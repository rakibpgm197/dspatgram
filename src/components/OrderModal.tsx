"use client";

import { useState } from "react";

const PRODUCTS = [
  "পিভিসি ব্যানার",
  "পোস্টার",
  "ফেস্টুন",
  "ক্রেস্ট",
  "ভিনাইল স্টিকার",
  "ডিজিটাল সিল",
  "মগ প্রিন্ট",
  "গেঞ্জি প্রিন্ট",
  "ক্যাশমেমো",
  "ভিজিটিং কার্ড",
  "আইডি কার্ড",
  "ফিতা প্রিন্ট",
  "বিয়ের কার্ড",
  "হালখাতার কার্ড",
  "সার্টিফিকেট",
  "লেটারহেড",
  "অন্যান্য",
];

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    productType: "",
    description: "",
    quantity: "1",
    specialRequirements: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to DB
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      // Build WhatsApp message
      const msg = `🛒 *নতুন অর্ডার - দুরন্ত ডিজিটাল সাইন*
━━━━━━━━━━━━━━━━━
👤 *নাম:* ${form.customerName}
📞 *ফোন:* ${form.phone}
📦 *পণ্য:* ${form.productType}
🔢 *পরিমাণ:* ${form.quantity}টি
📝 *বিবরণ:* ${form.description}
${form.specialRequirements ? `⚠️ *বিশেষ দ্রষ্টব্য:* ${form.specialRequirements}` : ""}
━━━━━━━━━━━━━━━━━
📅 তারিখ: ${new Date().toLocaleDateString("bn-BD")}`;

      const whatsappUrl = `https://wa.me/8801710513624?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, "_blank");
      setSubmitted(true);
    } catch {
      // fallback - just open WhatsApp
      const msg = `অর্ডার: ${form.productType} - ${form.customerName} (${form.phone})`;
      window.open(
        `https://wa.me/8801710513624?text=${encodeURIComponent(msg)}`,
        "_blank"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      customerName: "",
      phone: "",
      productType: "",
      description: "",
      quantity: "1",
      specialRequirements: "",
    });
    setStep(1);
    setSubmitted(false);
    onClose();
  };

  const isStep1Valid =
    form.customerName && form.phone && form.phone.length >= 11;
  const isStep2Valid = form.productType && form.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
              🛒
            </div>
            <div>
              <h2 className="text-xl font-bold">অনলাইন অর্ডার</h2>
              <p className="text-blue-100 text-sm">দুরন্ত ডিজিটাল সাইন</p>
            </div>
          </div>

          {/* Steps indicator */}
          {!submitted && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step >= s
                        ? "bg-white text-blue-600"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-0.5 w-8 transition-all ${step > s ? "bg-white" : "bg-white/30"}`}
                    />
                  )}
                </div>
              ))}
              <span className="text-white/80 text-xs ml-2">
                {step === 1
                  ? "আপনার তথ্য"
                  : step === 2
                    ? "অর্ডার বিবরণ"
                    : "নিশ্চিতকরণ"}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                অর্ডার সফল!
              </h3>
              <p className="text-gray-600 mb-6">
                আপনার অর্ডার WhatsApp-এ পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ
                করবো।
              </p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <p className="text-green-700 text-sm">
                  📞 যোগাযোগ: 01710513624
                  <br />
                  ⏰ সকাল ১০টা – রাত ১০টা
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold"
              >
                ঠিক আছে
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Customer Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-4">
                    আপনার তথ্য দিন
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      আপনার নাম *
                    </label>
                    <input
                      type="text"
                      value={form.customerName}
                      onChange={(e) =>
                        setForm({ ...form, customerName: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="আপনার পুরো নাম"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      মোবাইল নম্বর *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="01XXXXXXXXX"
                      required
                      maxLength={11}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => isStep1Valid && setStep(2)}
                    disabled={!isStep1Valid}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    পরবর্তী →
                  </button>
                </div>
              )}

              {/* Step 2: Order Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-4">
                    অর্ডার বিবরণ
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      পণ্যের ধরন *
                    </label>
                    <select
                      value={form.productType}
                      onChange={(e) =>
                        setForm({ ...form, productType: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">পণ্য বেছে নিন</option>
                      {PRODUCTS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      পরিমাণ *
                    </label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) =>
                        setForm({ ...form, quantity: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      placeholder="কতটি চাই"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিস্তারিত বিবরণ *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="কাজের বিস্তারিত বিবরণ দিন (সাইজ, রং, ডিজাইন ইত্যাদি)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিশেষ দ্রষ্টব্য (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={form.specialRequirements}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          specialRequirements: e.target.value,
                        })
                      }
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      placeholder="যেকোনো বিশেষ চাহিদা..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                    >
                      ← পেছনে
                    </button>
                    <button
                      type="button"
                      onClick={() => isStep2Valid && setStep(3)}
                      disabled={!isStep2Valid}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                    >
                      পরবর্তী →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 mb-4">
                    অর্ডার নিশ্চিত করুন
                  </h3>
                  <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                    {[
                      { label: "নাম", value: form.customerName },
                      { label: "ফোন", value: form.phone },
                      { label: "পণ্য", value: form.productType },
                      { label: "পরিমাণ", value: `${form.quantity}টি` },
                      { label: "বিবরণ", value: form.description },
                      form.specialRequirements
                        ? {
                            label: "বিশেষ দ্রষ্টব্য",
                            value: form.specialRequirements,
                          }
                        : null,
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <div key={item!.label} className="flex justify-between gap-4">
                          <span className="text-gray-500 font-medium w-28 flex-shrink-0">
                            {item!.label}:
                          </span>
                          <span className="text-gray-900 text-right">{item!.value}</span>
                        </div>
                      ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                    <div className="flex items-start gap-2">
                      <span>💬</span>
                      <span>
                        অর্ডার দেওয়ার পর WhatsApp খুলবে। সেখানে আমাদের
                        সাথে আলোচনা করতে পারবেন।
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50"
                    >
                      ← পেছনে
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          পাঠানো হচ্ছে...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                          </svg>
                          WhatsApp-এ অর্ডার করুন
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
