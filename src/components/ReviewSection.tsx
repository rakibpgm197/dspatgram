"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`text-2xl transition-transform ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
        >
          {star <= (hover || rating) ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.comment || !form.rating) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ customerName: "", rating: 5, comment: "" });
        setTimeout(() => {
          setSuccess(false);
          setShowForm(false);
        }, 3000);
      }
    } catch {
      // error
    } finally {
      setSubmitting(false);
    }
  };

  // Fallback demo reviews if none in DB
  const demoReviews: Review[] = [
    {
      id: -1,
      customerName: "রাকিব হাসান",
      rating: 5,
      comment: "অসাধারণ কাজ! ব্যানার প্রিন্ট একদম পারফেক্ট হয়েছে। সময়মতো ডেলিভারি দিয়েছে। অবশ্যই আবার আসবো।",
      createdAt: "2025-06-15",
    },
    {
      id: -2,
      customerName: "সুমাইয়া",
      rating: 5,
      comment: "মগ প্রিন্ট এবং ভিজিটিং কার্ড দুটোই খুব সুন্দর হয়েছে। দাম সহনীয় এবং মান অনেক ভালো।",
      createdAt: "2025-06-10",
    },
    {
      id: -3,
      customerName: "আতিক স্যার",
      rating: 4,
      comment: "বিদ্যালয়ের আইডি কার্ড ও ব্যানার বানিয়েছি। কাজ ভালো হয়েছে, সময়মতো পেয়েছি।",
      createdAt: "2025-05-20",
    },
  ];

  const displayReviews = reviews.length > 0 ? reviews : demoReviews;
  const avgRating =
    displayReviews.reduce((s, r) => s + r.rating, 0) / displayReviews.length;

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <span>⭐</span> গ্রাহক রিভিউ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-heading">
            আমাদের গ্রাহকরা কী বলেন?
          </h2>

          {/* Average rating display */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="text-5xl font-bold text-gray-900">
              {avgRating.toFixed(1)}
            </div>
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-2xl">
                    {s <= Math.round(avgRating) ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-gray-500 text-sm mt-1">
                {displayReviews.length}টি রিভিউ
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {displayReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 card-hover"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {review.customerName}
                    </h4>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-sm">
                          {s <= review.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="mt-4 text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Review Button */}
        <div className="text-center">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            ✍️ আপনার রিভিউ দিন
          </button>
        </div>

        {/* Review Form */}
        {showForm && (
          <div className="mt-8 max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
              আপনার মতামত শেয়ার করুন
            </h3>

            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h4 className="text-xl font-bold text-green-600 mb-2">
                  ধন্যবাদ!
                </h4>
                <p className="text-gray-600">
                  আপনার রিভিউ সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পরে
                  প্রকাশিত হবে।
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="নাম লিখুন"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    রেটিং *
                  </label>
                  <StarRating
                    rating={form.rating}
                    onChange={(r) => setForm({ ...form, rating: r })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    মন্তব্য *
                  </label>
                  <textarea
                    value={form.comment}
                    onChange={(e) =>
                      setForm({ ...form, comment: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="আপনার অভিজ্ঞতা শেয়ার করুন..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? "জমা হচ্ছে..." : "রিভিউ পাঠান"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
