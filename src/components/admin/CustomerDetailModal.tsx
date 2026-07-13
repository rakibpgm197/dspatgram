"use client";

import { useState, useEffect } from "react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  totalDue: string;
  notes: string | null;
}

interface Payment {
  id: number;
  amount: string;
  note: string | null;
  paymentDate: string;
  createdAt: string;
}

interface DueEntry {
  id: number;
  amount: string;
  description: string | null;
  dueDate: string | null;
  entryDate: string;
  createdAt: string;
}

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onUpdate: () => void;
}

export default function CustomerDetailModal({
  customer,
  onClose,
  onUpdate,
}: CustomerDetailModalProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dueEntries, setDueEntries] = useState<DueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"due" | "payments" | "edit">("due");
  const [editForm, setEditForm] = useState({
    name: customer.name,
    phone: customer.phone,
    notes: customer.notes || "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/customers/${customer.id}`);
      const data = await res.json();
      setPayments(data.payments || []);
      setDueEntries(data.dueEntries || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      onUpdate();
      onClose();
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const totalPaid = payments.reduce((s, p) => s + parseFloat(p.amount), 0);
  const totalAdded = dueEntries.reduce((s, d) => s + parseFloat(d.amount), 0);
  const currentDue = parseFloat(customer.totalDue);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold">{customer.name}</h2>
                <p className="text-blue-100 text-sm">{customer.phone}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-bold">৳{currentDue.toLocaleString()}</div>
              <div className="text-xs text-blue-200">বর্তমান বাকি</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-green-300">৳{totalPaid.toLocaleString()}</div>
              <div className="text-xs text-blue-200">মোট পরিশোধ</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-amber-300">৳{totalAdded.toLocaleString()}</div>
              <div className="text-xs text-blue-200">মোট বাকি যোগ</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[
            { id: "due", label: "বাকির ইতিহাস", icon: "📋" },
            { id: "payments", label: "পরিশোধের ইতিহাস", icon: "💳" },
            { id: "edit", label: "সম্পাদনা", icon: "✏️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "due" | "payments" | "edit")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {activeTab === "due" && (
                <div className="space-y-3">
                  {dueEntries.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-3xl mb-2">📝</div>
                      কোনো হিসাব নেই
                    </div>
                  ) : (
                    dueEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-amber-50 border border-amber-100 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {entry.description || "বাকি যোগ"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(entry.entryDate).toLocaleDateString("bn-BD")}
                            </div>
                            {entry.dueDate && (
                              <div className="text-xs text-red-500 mt-0.5">
                                📅 পরিশোধ করবে:{" "}
                                {new Date(entry.dueDate).toLocaleDateString("bn-BD")}
                              </div>
                            )}
                          </div>
                          <div className="text-amber-700 font-bold text-sm ml-3">
                            +৳{parseFloat(entry.amount).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "payments" && (
                <div className="space-y-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-3xl mb-2">💳</div>
                      কোনো পরিশোধ নেই
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="bg-green-50 border border-green-100 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">
                              {payment.note || "পরিশোধ"}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(payment.paymentDate).toLocaleDateString("bn-BD")}
                            </div>
                          </div>
                          <div className="text-green-700 font-bold text-sm ml-3">
                            -৳{parseFloat(payment.amount).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === "edit" && (
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      নাম
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      নোট
                    </label>
                    <textarea
                      value={editForm.notes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, notes: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-xl text-sm font-semibold"
                  >
                    {saving ? "সংরক্ষণ হচ্ছে..." : "✓ পরিবর্তন সংরক্ষণ করুন"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
