"use client";

import { useState, useEffect } from "react";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews/admin");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id: number, isApproved: boolean) => {
    try {
      await fetch("/api/reviews/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isApproved }),
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isApproved } : r))
      );
    } catch {
      // ignore
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("এই রিভিউটি মুছে ফেলতে চান?")) return;
    try {
      await fetch(`/api/reviews/admin?id=${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // ignore
    }
  };

  const filtered =
    filter === "all"
      ? reviews
      : filter === "pending"
        ? reviews.filter((r) => !r.isApproved)
        : reviews.filter((r) => r.isApproved);

  const pendingCount = reviews.filter((r) => !r.isApproved).length;
  const approvedCount = reviews.filter((r) => r.isApproved).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">রিভিউ ম্যানেজমেন্ট</h2>
          <p className="text-gray-500 text-sm">
            {pendingCount}টি অনুমোদনের অপেক্ষায়
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-100"
        >
          🔄 রিফ্রেশ
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { key: "all", label: `সব (${reviews.length})` },
          { key: "pending", label: `অপেক্ষমাণ (${pendingCount})` },
          { key: "approved", label: `অনুমোদিত (${approvedCount})` },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as "all" | "pending" | "approved")}
            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filter === item.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-5xl mb-4">⭐</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">কোনো রিভিউ নেই</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl border shadow-sm p-5 ${
                review.isApproved ? "border-green-100" : "border-amber-100"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">
                      {review.customerName}
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className="text-sm">
                          {s <= review.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      review.isApproved
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {review.isApproved ? "✓ অনুমোদিত" : "⏳ অপেক্ষমাণ"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      toggleApproval(review.id, !review.isApproved)
                    }
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium ${
                      review.isApproved
                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    }`}
                  >
                    {review.isApproved ? "⏸ অনুমোদন প্রত্যাহার" : "✓ অনুমোদন দিন"}
                  </button>
                  <button
                    onClick={() => deleteReview(review.id)}
                    className="text-xs px-3 py-1.5 rounded-lg border bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                  >
                    🗑 মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
