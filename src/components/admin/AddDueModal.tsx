"use client";

import { useState } from "react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  totalDue: string;
}

interface AddDueModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddDueModal({
  customer,
  onClose,
  onSuccess,
}: AddDueModalProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [newDue, setNewDue] = useState<number | null>(null);

  const currentDue = parseFloat(customer.totalDue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("সঠিক পরিমাণ লিখুন");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/due-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          amount: amt,
          description: description || null,
          dueDate: dueDate || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "সমস্যা হয়েছে");
        return;
      }

      const data = await res.json();
      setNewDue(data.newDue);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch {
      setError("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-t-2xl p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">নতুন বাকি যোগ করুন</h2>
            <p className="text-amber-100 text-xs">{customer.name}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Current Due Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-600">বর্তমান বাকি</div>
                <div className="text-xl font-bold text-amber-600">
                  ৳{currentDue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">গ্রাহক</div>
                <div className="font-medium text-gray-900">{customer.name}</div>
              </div>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-amber-600 mb-2">বাকি যোগ হয়েছে!</h3>
              <p className="text-gray-600">
                নতুন বাকি: ৳{parseFloat(newDue?.toString() || "0").toLocaleString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  বাকির পরিমাণ (টাকা) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {amount && (
                  <div className="mt-1 text-xs text-gray-500">
                    নতুন মোট বাকি হবে: ৳
                    {(currentDue + parseFloat(amount || "0")).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  কাজের বিবরণ
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  rows={3}
                  placeholder="কোন কাজের বাকি (ব্যানার, কার্ড, মগ ইত্যাদি বিস্তারিত লিখুন)..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  পরিশোধের তারিখ (কবে দিবে)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  কবে টাকা দিবে সেই তারিখ লিখুন (ঐচ্ছিক)
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  ⚠️ {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "যোগ হচ্ছে..." : "✓ বাকি যোগ করুন"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
