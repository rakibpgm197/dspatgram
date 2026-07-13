"use client";

import { useState, useEffect } from "react";

interface Order {
  id: number;
  customerName: string;
  phone: string;
  productType: string;
  description: string;
  quantity: number;
  specialRequirements: string | null;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "অপেক্ষমাণ", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  processing: { label: "প্রক্রিয়াধীন", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  completed: { label: "সম্পন্ন", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  cancelled: { label: "বাতিল", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

export default function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const sendWhatsApp = (order: Order) => {
    const msg = `✅ *অর্ডার আপডেট - দুরন্ত ডিজিটাল সাইন*
━━━━━━━━━━━━━━━━━
👤 প্রিয় ${order.customerName},
আপনার অর্ডার *${STATUS_CONFIG[order.status]?.label || order.status}* হয়েছে।
📦 পণ্য: ${order.productType}
🔢 পরিমাণ: ${order.quantity}টি
━━━━━━━━━━━━━━━━━
📞 যোগাযোগ: 01710513624`;
    window.open(
      `https://wa.me/880${order.phone.replace(/^0/, "")}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  const filtered = filterStatus === "all"
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">অর্ডার ম্যানেজমেন্ট</h2>
          <p className="text-gray-500 text-sm">{orders.length}টি মোট অর্ডার</p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-100 transition-colors"
        >
          🔄 রিফ্রেশ
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: `সব (${counts.all})` },
          { key: "pending", label: `অপেক্ষমাণ (${counts.pending})` },
          { key: "processing", label: `প্রক্রিয়াধীন (${counts.processing})` },
          { key: "completed", label: `সম্পন্ন (${counts.completed})` },
          { key: "cancelled", label: `বাতিল (${counts.cancelled})` },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(item.key)}
            className={`whitespace-nowrap px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filterStatus === item.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">কোনো অর্ডার নেই</h3>
          <p className="text-gray-500">এই ক্যাটাগরিতে কোনো অর্ডার পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const statusConf = STATUS_CONFIG[order.status] || {
              label: order.status,
              color: "text-gray-700",
              bg: "bg-gray-50 border-gray-200",
            };
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {order.customerName}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusConf.bg} ${statusConf.color}`}
                        >
                          {statusConf.label}
                        </span>
                      </div>
                      <a
                        href={`tel:${order.phone}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {order.phone}
                      </a>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                      </div>
                      <div className="text-xs text-gray-500">
                        অর্ডার #{order.id}
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">পণ্য ও পরিমাণ</div>
                      <div className="font-medium text-sm text-gray-900">
                        {order.productType} × {order.quantity}টি
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">বিবরণ</div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        {order.description}
                      </div>
                    </div>
                  </div>

                  {order.specialRequirements && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4">
                      <div className="text-xs text-amber-600 font-medium mb-1">
                        ⚠️ বিশেষ দ্রষ্টব্য
                      </div>
                      <div className="text-sm text-amber-800">
                        {order.specialRequirements}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updatingId === order.id}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="pending">অপেক্ষমাণ</option>
                      <option value="processing">প্রক্রিয়াধীন</option>
                      <option value="completed">সম্পন্ন</option>
                      <option value="cancelled">বাতিল</option>
                    </select>

                    <button
                      onClick={() => sendWhatsApp(order)}
                      className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                      </svg>
                      WhatsApp
                    </button>

                    <a
                      href={`tel:${order.phone}`}
                      className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      📞 কল করুন
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
