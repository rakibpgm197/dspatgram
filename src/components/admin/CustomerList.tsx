"use client";

import { useState, useEffect, useCallback } from "react";
import AddCustomerModal from "./AddCustomerModal";
import CustomerDetailModal from "./CustomerDetailModal";
import PaymentModal from "./PaymentModal";
import AddDueModal from "./AddDueModal";

interface Customer {
  id: number;
  name: string;
  phone: string;
  totalDue: string;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CustomerListProps {
  showAddModal: boolean;
  onAddModalClose: () => void;
  onAddModalOpen: () => void;
  onDataChange: () => void;
}

export default function CustomerList({
  showAddModal,
  onAddModalClose,
  onAddModalOpen,
  onDataChange,
}: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "due" | "paid">("all");
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [addDueCustomer, setAddDueCustomer] = useState<Customer | null>(null);
  const [sortBy, setSortBy] = useState<"due" | "name" | "date">("due");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/customers${search ? `?search=${encodeURIComponent(search)}` : ""}`
      );
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [search, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(fetchCustomers, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const refresh = () => {
    setRefreshKey((k) => k + 1);
    onDataChange();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" কে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`)) return;
    await fetch(`/api/customers/${id}`, { method: "DELETE" });
    refresh();
  };

  let filtered = [...customers];
  if (filter === "due") filtered = filtered.filter((c) => parseFloat(c.totalDue) > 0);
  if (filter === "paid") filtered = filtered.filter((c) => parseFloat(c.totalDue) === 0);

  if (sortBy === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "due") filtered.sort((a, b) => parseFloat(b.totalDue) - parseFloat(a.totalDue));
  else if (sortBy === "date") filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const dueCount = customers.filter((c) => parseFloat(c.totalDue) > 0).length;
  const paidCount = customers.filter((c) => parseFloat(c.totalDue) === 0).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">বাকির হিসাব</h2>
          <p className="text-gray-500 text-sm">
            {customers.length}জন গ্রাহক • মোট বাকি: ৳{parseFloat(total.toString()).toLocaleString("bn-BD")}
          </p>
        </div>
        <button
          onClick={onAddModalOpen}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
        >
          <span>➕</span> নতুন গ্রাহক
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-xl p-4 text-center transition-all ${filter === "all" ? "bg-blue-600 text-white shadow-md" : "bg-white border border-gray-200 hover:border-blue-300"}`}
        >
          <div className="text-xl font-bold">{customers.length}</div>
          <div className="text-xs opacity-80">মোট গ্রাহক</div>
        </button>
        <button
          onClick={() => setFilter("due")}
          className={`rounded-xl p-4 text-center transition-all ${filter === "due" ? "bg-red-500 text-white shadow-md" : "bg-white border border-gray-200 hover:border-red-300"}`}
        >
          <div className="text-xl font-bold">{dueCount}</div>
          <div className="text-xs opacity-80">বাকি আছে</div>
        </button>
        <button
          onClick={() => setFilter("paid")}
          className={`rounded-xl p-4 text-center transition-all ${filter === "paid" ? "bg-green-500 text-white shadow-md" : "bg-white border border-gray-200 hover:border-green-300"}`}
        >
          <div className="text-xl font-bold">{paidCount}</div>
          <div className="text-xs opacity-80">পরিশোধিত</div>
        </button>
      </div>

      {/* Total Due Banner */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-xl">
            💰
          </div>
          <div>
            <div className="text-sm text-gray-600">মোট পাওনা</div>
            <div className="text-2xl font-bold text-red-600">
              ৳{parseFloat(total.toString()).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">রিপোর্ট তারিখ</div>
          <div className="text-sm font-medium text-gray-700">
            {new Date().toLocaleDateString("bn-BD")}
          </div>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "due" | "name" | "date")}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="due">বাকির পরিমাণ অনুযায়ী</option>
          <option value="name">নাম অনুযায়ী</option>
          <option value="date">তারিখ অনুযায়ী</option>
        </select>
      </div>

      {/* Customer Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">কোনো গ্রাহক পাওয়া যায়নি</h3>
          <p className="text-gray-500">
            {search ? "অনুসন্ধান পরিবর্তন করুন" : "নতুন গ্রাহক যোগ করুন"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="due-table">
                  <th className="px-4 py-3 text-left text-xs font-semibold">#</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">গ্রাহকের নাম</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">মোবাইল</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold">বাকির পরিমাণ</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold">নোট</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((customer, idx) => {
                  const due = parseFloat(customer.totalDue);
                  return (
                    <tr
                      key={customer.id}
                      className={`hover:bg-gray-50 transition-colors ${due === 0 ? "opacity-60" : ""}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {customer.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(customer.updatedAt).toLocaleDateString("bn-BD")}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`tel:${customer.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {customer.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-sm font-bold ${
                            due > 5000
                              ? "text-red-600"
                              : due > 0
                                ? "text-amber-600"
                                : "text-green-600"
                          }`}
                        >
                          ৳{due.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 truncate max-w-24 block">
                          {customer.notes || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded-lg transition-colors"
                            title="বিবরণ দেখুন"
                          >
                            বিবরণ
                          </button>
                          <button
                            onClick={() => setPaymentCustomer(customer)}
                            className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded-lg transition-colors"
                            title="পরিশোধ নিন"
                          >
                            পরিশোধ
                          </button>
                          <button
                            onClick={() => setAddDueCustomer(customer)}
                            className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors"
                            title="বাকি যোগ করুন"
                          >
                            +বাকি
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id, customer.name)}
                            className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors"
                            title="মুছুন"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-200">
                  <td colSpan={3} className="px-4 py-3 text-sm font-bold text-gray-700">
                    {filtered.length}জন গ্রাহক • সর্বমোট
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-red-600">
                    ৳{filtered
                      .reduce((s, c) => s + parseFloat(c.totalDue), 0)
                      .toLocaleString()}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filtered.map((customer, idx) => {
              const due = parseFloat(customer.totalDue);
              return (
                <div key={customer.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{customer.name}</div>
                        <a href={`tel:${customer.phone}`} className="text-sm text-blue-600">
                          {customer.phone}
                        </a>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${
                          due > 5000
                            ? "text-red-600"
                            : due > 0
                              ? "text-amber-600"
                              : "text-green-600"
                        }`}
                      >
                        ৳{due.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">বাকি</div>
                    </div>
                  </div>
                  {customer.notes && (
                    <p className="text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded-lg">
                      📝 {customer.notes}
                    </p>
                  )}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg"
                    >
                      বিবরণ
                    </button>
                    <button
                      onClick={() => setPaymentCustomer(customer)}
                      className="text-xs bg-green-50 text-green-600 py-1.5 rounded-lg"
                    >
                      পরিশোধ
                    </button>
                    <button
                      onClick={() => setAddDueCustomer(customer)}
                      className="text-xs bg-amber-50 text-amber-600 py-1.5 rounded-lg"
                    >
                      +বাকি
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id, customer.name)}
                      className="text-xs bg-red-50 text-red-600 py-1.5 rounded-lg"
                    >
                      ✕ মুছুন
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <AddCustomerModal
        isOpen={showAddModal}
        onClose={onAddModalClose}
        onSuccess={refresh}
      />
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={refresh}
        />
      )}
      {paymentCustomer && (
        <PaymentModal
          customer={paymentCustomer}
          onClose={() => setPaymentCustomer(null)}
          onSuccess={refresh}
        />
      )}
      {addDueCustomer && (
        <AddDueModal
          customer={addDueCustomer}
          onClose={() => setAddDueCustomer(null)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}
