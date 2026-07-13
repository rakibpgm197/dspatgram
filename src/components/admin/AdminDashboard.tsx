"use client";

import { useState, useEffect } from "react";
import CustomerList from "./CustomerList";
import AddCustomerModal from "./AddCustomerModal";
import OrdersPanel from "./OrdersPanel";
import ReviewsPanel from "./ReviewsPanel";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "customers" | "orders" | "reviews">("dashboard");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [stats, setStats] = useState({
    totalDue: 0,
    customerCount: 0,
    paidCount: 0,
    pendingOrders: 0,
  });
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const [custRes, ordersRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/orders"),
      ]);
      const custData = await custRes.json();
      const ordersData = await ordersRes.json();

      const customers = custData.customers || [];
      const orders = ordersData.orders || [];

      setStats({
        totalDue: custData.total || 0,
        customerCount: customers.length,
        paidCount: customers.filter(
          (c: { totalDue: string }) => parseFloat(c.totalDue) === 0
        ).length,
        pendingOrders: orders.filter(
          (o: { status: string }) => o.status === "pending"
        ).length,
      });
    } catch {
      // ignore
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      setSeedDone(true);
      setRefreshKey((k) => k + 1);
      setTimeout(() => setSeedDone(false), 3000);
    } catch {
      // ignore
    } finally {
      setSeeding(false);
    }
  };

  const tabs = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: "📊" },
    { id: "customers", label: "বাকির হিসাব", icon: "💰" },
    { id: "orders", label: "অর্ডার", icon: "📦" },
    { id: "reviews", label: "রিভিউ", icon: "⭐" },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <nav className="bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
                দু
              </div>
              <div>
                <div className="font-bold text-sm leading-tight">
                  দুরন্ত ডিজিটাল সাইন
                </div>
                <div className="text-xs text-blue-200">অ্যাডমিন প্যানেল</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="hidden sm:block text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
                title="প্রাথমিক ডেটা লোড করুন"
              >
                {seeding ? "⏳ লোড হচ্ছে..." : seedDone ? "✅ লোড হয়েছে" : "📥 ডেটা লোড"}
              </button>
              <a
                href="/"
                className="text-xs text-white/80 hover:text-white"
              >
                🌐 সাইট দেখুন
              </a>
              <button
                onClick={onLogout}
                className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                🚪 লগআউট
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <h1 className="text-2xl font-bold mb-1">আস্সালামু আলাইকুম! 👋</h1>
              <p className="text-blue-100">দুরন্ত ডিজিটাল সাইন পাটগ্রাম — অ্যাডমিন প্যানেলে স্বাগতম</p>
              <p className="text-blue-200 text-sm mt-2">
                {new Date().toLocaleDateString("bn-BD", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: "💰",
                  label: "মোট বাকি",
                  value: `৳${stats.totalDue.toLocaleString("bn-BD")}`,
                  color: "from-red-500 to-rose-600",
                  sub: "সকল গ্রাহকের মোট",
                },
                {
                  icon: "👥",
                  label: "মোট গ্রাহক",
                  value: stats.customerCount.toString(),
                  color: "from-blue-500 to-blue-600",
                  sub: "নিবন্ধিত গ্রাহক",
                },
                {
                  icon: "✅",
                  label: "পরিশোধ সম্পন্ন",
                  value: stats.paidCount.toString(),
                  color: "from-green-500 to-emerald-600",
                  sub: "শূন্য বাকির গ্রাহক",
                },
                {
                  icon: "📦",
                  label: "নতুন অর্ডার",
                  value: stats.pendingOrders.toString(),
                  color: "from-amber-500 to-orange-600",
                  sub: "প্রক্রিয়াধীন অর্ডার",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-5 shadow-lg`}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm font-medium opacity-90 mt-1">
                    {stat.label}
                  </div>
                  <div className="text-xs opacity-70 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  setActiveTab("customers");
                  setShowAddCustomer(true);
                }}
                className="bg-white border-2 border-dashed border-blue-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group"
              >
                <div className="text-3xl mb-2">➕</div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600">
                  নতুন গ্রাহক যোগ করুন
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  নতুন বাকির হিসাব শুরু করুন
                </div>
              </button>

              <button
                onClick={() => setActiveTab("customers")}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2">💳</div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600">
                  পরিশোধ নিন
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  গ্রাহকের পেমেন্ট রেকর্ড করুন
                </div>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-2">📋</div>
                <div className="font-bold text-gray-900 group-hover:text-blue-600">
                  অর্ডার দেখুন
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {stats.pendingOrders}টি নতুন অর্ডার
                </div>
              </button>
            </div>

            {/* Info cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>🏪</span> দোকানের তথ্য
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>📍 হোটেল সাদিকের নিচতলা, পাটগ্রাম</p>
                  <p>📞 01710513624</p>
                  <p>⏰ সকাল ১০টা – রাত ১০টা</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📌</span> দ্রুত লিংক
                </h3>
                <div className="space-y-2">
                  <a
                    href="https://www.facebook.com/durontosignpgm/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook Page
                  </a>
                  <a
                    href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-red-600 hover:underline"
                  >
                    📍 Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <CustomerList
            showAddModal={showAddCustomer}
            onAddModalClose={() => setShowAddCustomer(false)}
            onAddModalOpen={() => setShowAddCustomer(true)}
            onDataChange={() => setRefreshKey((k) => k + 1)}
          />
        )}

        {activeTab === "orders" && <OrdersPanel />}
        {activeTab === "reviews" && <ReviewsPanel />}
      </div>
    </div>
  );
}
