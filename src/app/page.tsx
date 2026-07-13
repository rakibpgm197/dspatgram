"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReviewSection from "@/components/ReviewSection";
import OrderModal from "@/components/OrderModal";
import ServicesSection from "@/components/ServicesSection";

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [totalDue, setTotalDue] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                দু
              </div>
              <div>
                <div
                  className={`font-bold text-sm md:text-base leading-tight ${scrolled ? "text-gray-900" : "text-white"}`}
                >
                  দুরন্ত ডিজিটাল সাইন
                </div>
                <div
                  className={`text-xs ${scrolled ? "text-blue-600" : "text-blue-200"}`}
                >
                  পাটগ্রাম, লালমনিরহাট
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {[
                { href: "#home", label: "হোম" },
                { href: "#services", label: "সেবাসমূহ" },
                { href: "#about", label: "আমাদের সম্পর্কে" },
                { href: "#reviews", label: "রিভিউ" },
                { href: "#contact", label: "যোগাযোগ" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    scrolled ? "text-gray-700" : "text-white/90"
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => setOrderModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
              >
                অর্ডার করুন
              </button>
              <Link
                href="/admin"
                className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  scrolled
                    ? "border-gray-300 text-gray-600 hover:bg-gray-50"
                    : "border-white/40 text-white/80 hover:bg-white/10"
                }`}
              >
                🔐 অ্যাডমিন
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-lg ${scrolled ? "text-gray-700" : "text-white"}`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden bg-white rounded-2xl shadow-2xl mb-4 p-4 space-y-2 border border-gray-100">
              {[
                { href: "#home", label: "🏠 হোম" },
                { href: "#services", label: "🖨️ সেবাসমূহ" },
                { href: "#about", label: "ℹ️ আমাদের সম্পর্কে" },
                { href: "#reviews", label: "⭐ রিভিউ" },
                { href: "#contact", label: "📞 যোগাযোগ" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg font-medium"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setOrderModalOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold"
              >
                🛒 অর্ডার করুন
              </button>
              <Link
                href="/admin"
                className="block text-center px-4 py-2 border border-gray-200 text-gray-600 rounded-lg"
                onClick={() => setMenuOpen(false)}
              >
                🔐 অ্যাডমিন প্যানেল
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/37394506/pexels-photo-37394506.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600"
            alt="Printing shop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-blue-800/85"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: "10%", left: "5%", size: "200px", delay: "0s" },
            { top: "60%", right: "5%", size: "150px", delay: "1s" },
            { top: "30%", right: "15%", size: "100px", delay: "0.5s" },
          ].map((el, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/5 animate-pulse"
              style={{
                top: el.top,
                left: "left" in el ? el.left : undefined,
                right: "right" in el ? el.right : undefined,
                width: el.size,
                height: el.size,
                animationDelay: el.delay,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            আমরা এখন খোলা আছি • সকাল ১০টা – রাত ১০টা
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            দুরন্ত ডিজিটাল সাইন
            <span className="block text-2xl md:text-3xl lg:text-4xl font-normal text-blue-200 mt-2">
              ডিজাইনে দুরন্ত, মানে অনন্য
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-4">
            প্রিন্টিং থেকে ছাপানো — এক ছাদের নিচেই সব! ❤️
          </p>
          <p className="text-base text-white/70 max-w-2xl mx-auto mb-10">
            আপনার বিদ্যালয়, প্রতিষ্ঠান বা ব্যক্তিগত প্রয়োজনে আমরা প্রস্তুত
            বিশ্বস্ত ও মানসম্মত ডিজাইন–প্রিন্ট সেবায়
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setOrderModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-2xl hover:scale-105 flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              এখনই অর্ডার করুন
            </button>
            <a
              href="#services"
              className="w-full sm:w-auto border-2 border-white/40 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2 justify-center"
            >
              আমাদের সেবা দেখুন →
            </a>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-16 max-w-lg mx-auto">
            {[
              { number: "৫০০+", label: "সন্তুষ্ট গ্রাহক" },
              { number: "৩+", label: "বছরের অভিজ্ঞতা" },
              { number: "১২+", label: "ধরনের সেবা" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
              >
                <div className="text-2xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-xs text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection onOrder={() => setOrderModalOpen(true)} />

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-2 text-sm font-medium mb-6">
                <span>🏪</span> আমাদের সম্পর্কে
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                আস্সালামু আলাইকুম!
                <br />
                <span className="text-blue-600">দুরন্ত ডিজিটাল সাইন</span>
                <br />
                থেকে স্বাগতম
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                আমরা পাটগ্রাম, লালমনিরহাট-এ অবস্থিত একটি বিশ্বস্ত
                ডিজিটাল প্রিন্টিং ও সাইন শপ। আমাদের লক্ষ্য হলো আপনার
                প্রতিটি প্রিন্টিং চাহিদা পূরণ করা সর্বোচ্চ মান ও সুলভ
                মূল্যে।
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                বাংলা, ইংরেজি, আরবি ও উর্দু যেকোনো ভাষায় ডিজাইন ও প্রিন্ট
                করার দক্ষতা আমাদের রয়েছে। আমরা আপনার পাশে আছি সর্বদা।
              </p>

              <div className="space-y-3">
                {[
                  { icon: "⏰", text: "খোলা থাকি: সকাল ১০টা – রাত ১০টা (প্রতিদিন)" },
                  { icon: "📍", text: "হোটেল সাদিকের নিচতলা, বড় মসজিদের সামনে, পাটগ্রাম" },
                  { icon: "📞", text: "01710513624" },
                  { icon: "✅", text: "সুলভ মূল্যে উন্নত মানের সেবা নিশ্চিত" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <a
                  href="https://www.facebook.com/durontosignpgm/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
                <a
                  href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-500 text-white px-5 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                  </svg>
                  Google Maps
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/14956248/pexels-photo-14956248.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Stickers and printing"
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent rounded-3xl"></div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="text-2xl font-bold text-blue-600">৫০০+</div>
                <div className="text-xs text-gray-500">খুশি গ্রাহক</div>
              </div>
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl p-4 text-white">
                <div className="text-xl">⭐⭐⭐⭐⭐</div>
                <div className="text-xs font-medium">সেরা মান</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              যোগাযোগ করুন
            </h2>
            <p className="text-blue-200 text-lg">
              আমরা সর্বদা আপনার সেবায় প্রস্তুত
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: "📍",
                title: "ঠিকানা",
                lines: [
                  "হোটেল সাদিকের নিচতলা",
                  "বড় মসজিদের সামনে",
                  "পাটগ্রাম, লালমনিরহাট",
                ],
                href: "https://maps.app.goo.gl/BhRAeXknhWFHmkbGA",
                linkText: "Google Maps-এ দেখুন",
              },
              {
                icon: "📞",
                title: "ফোন ও WhatsApp",
                lines: ["01710513624", "সকাল ১০টা – রাত ১০টা"],
                href: "https://wa.me/8801710513624",
                linkText: "WhatsApp করুন",
              },
              {
                icon: "🌐",
                title: "সোশ্যাল মিডিয়া",
                lines: ["Facebook Page", "durontosignpgm"],
                href: "https://www.facebook.com/durontosignpgm/",
                linkText: "Facebook দেখুন",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center hover:bg-white/15 transition-all"
              >
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {card.title}
                </h3>
                {card.lines.map((line, j) => (
                  <p key={j} className="text-blue-200 text-sm">
                    {line}
                  </p>
                ))}
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-amber-300 text-sm font-medium hover:text-amber-200 underline"
                >
                  {card.linkText} →
                </a>
              </div>
            ))}
          </div>

          {/* Map embed area */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.0!2d89.0147!3d25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU0JzAwLjAiTiA4OcKwMDAnNTMuMiJF!5e0!3m2!1sen!2sbd!4v1234567890"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="দুরন্ত ডিজিটাল সাইন লোকেশন"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              দু
            </div>
            <span className="text-white font-bold">দুরন্ত ডিজিটাল সাইন</span>
          </div>
          <p className="text-sm mb-4">
            ডিজাইনে দুরন্ত, মানে অনন্য • পাটগ্রাম, লালমনিরহাট
          </p>
          <div className="flex items-center justify-center gap-4 mb-4">
            <a
              href="https://www.facebook.com/durontosignpgm/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://wa.me/8801710513624"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href="https://maps.app.goo.gl/BhRAeXknhWFHmkbGA"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
              </svg>
            </a>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} দুরন্ত ডিজিটাল সাইন। সর্বস্বত্ব সংরক্ষিত।
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/8801710513624"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 whatsapp-btn w-14 h-14 rounded-full flex items-center justify-center shadow-2xl pulse-glow"
        title="WhatsApp-এ যোগাযোগ করুন"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
          !
        </span>
      </a>

      {/* Order Modal */}
      <OrderModal
        isOpen={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
      />
    </div>
  );
}
