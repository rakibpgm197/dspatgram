"use client";

import { useState } from "react";

const services = [
  {
    id: 1,
    icon: "🖼️",
    title: "পিভিসি ব্যানার ও পোস্টার",
    description:
      "উচ্চমানের পিভিসি ব্যানার, পোস্টার, ফেস্টুন এবং হোর্ডিং। যেকোনো সাইজে প্রিন্ট করা হয়।",
    features: ["ওয়াটারপ্রুফ", "উজ্জ্বল রং", "দীর্ঘস্থায়ী"],
    image:
      "https://images.pexels.com/photos/34659828/pexels-photo-34659828.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-blue-500 to-blue-700",
    bgLight: "bg-blue-50",
    textColor: "text-blue-700",
  },
  {
    id: 2,
    icon: "🏆",
    title: "ক্রেস্ট ও পুরস্কার",
    description:
      "বিভিন্ন অনুষ্ঠান, প্রতিযোগিতা ও পুরস্কারের জন্য সুন্দর ডিজাইনের ক্রেস্ট তৈরি করা হয়।",
    features: ["কাস্টম ডিজাইন", "মানসম্মত", "দ্রুত ডেলিভারি"],
    image:
      "https://images.pexels.com/photos/34203966/pexels-photo-34203966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50",
    textColor: "text-amber-700",
  },
  {
    id: 3,
    icon: "🔖",
    title: "ভিনাইল স্টিকার ও সিল",
    description:
      "রঙিন ভিনাইল স্টিকার, ডিজিটাল সিল এবং লেবেল প্রিন্টিং সেবা।",
    features: ["ওয়াটারপ্রুফ", "কাটিং স্টিকার", "ডিজিটাল সিল"],
    image:
      "https://images.pexels.com/photos/14602294/pexels-photo-14602294.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-purple-500 to-purple-700",
    bgLight: "bg-purple-50",
    textColor: "text-purple-700",
  },
  {
    id: 4,
    icon: "☕",
    title: "মগ প্রিন্ট",
    description:
      "ব্যক্তিগত ছবি, নাম বা লোগো দিয়ে কাস্টম মগ প্রিন্টিং। গিফট হিসেবেও দারুণ।",
    features: ["সাবলিমেশন প্রিন্ট", "টেকসই", "উপহার উপযোগী"],
    image:
      "https://images.pexels.com/photos/20633747/pexels-photo-20633747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50",
    textColor: "text-teal-700",
  },
  {
    id: 5,
    icon: "👕",
    title: "গেঞ্জি প্রিন্ট",
    description:
      "টি-শার্ট ও গেঞ্জিতে কাস্টম ডিজাইন প্রিন্টিং। ব্যক্তিগত বা প্রাতিষ্ঠানিক প্রয়োজনে।",
    features: ["হিট ট্রান্সফার", "রঙিন ডিজাইন", "দীর্ঘস্থায়ী"],
    image:
      "https://images.pexels.com/photos/5771897/pexels-photo-5771897.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50",
    textColor: "text-rose-700",
  },
  {
    id: 6,
    icon: "🧾",
    title: "ক্যাশমেমো ও ভিজিটিং কার্ড",
    description:
      "প্রাতিষ্ঠানিক ক্যাশমেমো, ভিজিটিং কার্ড এবং লেটারহেড ডিজাইন ও প্রিন্ট।",
    features: ["প্রফেশনাল ডিজাইন", "দ্রুত সরবরাহ", "সুলভ মূল্য"],
    image:
      "https://images.pexels.com/photos/33952994/pexels-photo-33952994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-indigo-500 to-blue-600",
    bgLight: "bg-indigo-50",
    textColor: "text-indigo-700",
  },
  {
    id: 7,
    icon: "🪪",
    title: "আইডি কার্ড ও ফিতা",
    description:
      "প্রাতিষ্ঠানিক আইডি কার্ড, উন্নতমানের ফিতা প্রিন্ট, কার্ড কভার তৈরি।",
    features: ["ল্যামিনেশন", "ফিতা প্রিন্ট", "কভার পেপার"],
    image:
      "https://images.pexels.com/photos/6816369/pexels-photo-6816369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-green-500 to-emerald-600",
    bgLight: "bg-green-50",
    textColor: "text-green-700",
  },
  {
    id: 8,
    icon: "💌",
    title: "বিয়ে ও হালখাতার কার্ড",
    description:
      "বিয়ের আমন্ত্রণপত্র, হালখাতার কার্ড, জন্মদিন কার্ড ডিজাইন ও প্রিন্ট।",
    features: ["সুন্দর ডিজাইন", "আরবি ক্যালিগ্রাফি", "এক্সক্লুসিভ"],
    image:
      "https://images.pexels.com/photos/5868260/pexels-photo-5868260.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-pink-500 to-rose-600",
    bgLight: "bg-pink-50",
    textColor: "text-pink-700",
  },
  {
    id: 9,
    icon: "📜",
    title: "সার্টিফিকেট ও বহুভাষিক ডিজাইন",
    description:
      "সার্টিফিকেট, বাংলা, ইংরেজি, আরবি ও উর্দু যেকোনো ভাষায় ডিজাইন ও প্রিন্ট।",
    features: ["বহুভাষিক", "কাস্টম ডিজাইন", "উচ্চমান"],
    image:
      "https://images.pexels.com/photos/5869617/pexels-photo-5869617.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=600",
    color: "from-violet-500 to-purple-700",
    bgLight: "bg-violet-50",
    textColor: "text-violet-700",
  },
];

interface ServicesSectionProps {
  onOrder: () => void;
}

export default function ServicesSection({ onOrder }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <span>🖨️</span> আমাদের সেবাসমূহ
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 section-heading">
            এক ছাদের নিচে সব সেবা
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            সুলভ মূল্যে উন্নত মানের ডিজাইন ও প্রিন্টিং সেবা। আমাদের দক্ষ
            টিম সর্বদা আপনার পাশে।
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`service-card card-hover rounded-2xl overflow-hidden cursor-pointer group ${
                activeService === service.id ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() =>
                setActiveService(
                  activeService === service.id ? null : service.id
                )
              }
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-70`}
                ></div>
                <div className="absolute top-4 left-4 text-4xl">{service.icon}</div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {service.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feat, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${service.bgLight} ${service.textColor}`}
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>

                {/* Order button */}
                {activeService === service.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder();
                    }}
                    className={`mt-4 w-full py-2 rounded-xl text-white text-sm font-semibold bg-gradient-to-r ${service.color} hover:opacity-90 transition-opacity`}
                  >
                    এই সেবার অর্ডার করুন →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            আপনার পছন্দের সেবাটি নিতে চান?
          </h3>
          <p className="text-blue-100 mb-8 text-lg">
            এখনই অর্ডার করুন অথবা WhatsApp-এ মেসেজ করুন। দ্রুত সাড়া পাবেন
            ইনশাআল্লাহ।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOrder}
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
            >
              🛒 অনলাইন অর্ডার করুন
            </button>
            <a
              href="https://wa.me/8801710513624"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp-এ মেসেজ করুন
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
