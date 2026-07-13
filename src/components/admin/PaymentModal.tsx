"use client";

import { useState } from "react";

interface Customer {
  id: number;
  name: string;
  phone: string;
  totalDue: string;
}

interface PaymentModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({
  customer,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
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
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          amount: amt,
          note: note || null,
          paymentDate,
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

  const quickAmounts = [
    Math.round(currentDue * 0.25),
    Math.round(currentDue * 0.5),
    Math.round(currentDue * 0.75),
    currentDue,
  ].filter((a) => a > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-t-2xl p-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">পরিশোধ নিন</h2>
            <p className="text-green-100 text-xs">{customer.name}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Current Due Info */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">বর্তমান বাকি</div>
                <div className="text-2xl font-bold text-red-600">
                  ৳{currentDue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">গ্রাহক</div>
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.phone}</div>
              </div>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                পরিশোধ সফল!
              </h3>
              <p className="text-gray-600">
                নতুন বাকি: ৳{parseFloat(newDue?.toString() || "0").toLocaleString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick amount buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  দ্রুত পরিমাণ
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {quickAmounts.map((qa, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setAmount(qa.toString())}
                      className={`text-xs py-2 rounded-lg border transition-all ${
                        amount === qa.toString()
                          ? "bg-green-500 text-white border-green-500"
                          : "border-gray-200 text-gray-600 hover:border-green-300"
                      }`}
                    >
                      ৳{qa.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  পরিশোধের পরিমাণ (টাকা) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">
                    ৳
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    max={currentDue}
                    required
                  />
                </div>
                {amount && (
                  <div className="mt-1 text-xs text-gray-500">
                    পরিশোধের পরে বাকি থাকবে: ৳
                    {Math.max(0, currentDue - parseFloat(amount || "0")).toLocaleString()}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  পরিশোধের তারিখ
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="পরিশোধের বিবরণ..."
                />
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
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "প্রক্রিয়াকরণ..." : "✓ পরিশোধ নিন"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
