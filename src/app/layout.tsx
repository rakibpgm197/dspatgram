import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "দুরন্ত ডিজিটাল সাইন পাটগ্রাম | Duronto Digital Sign Patgram",
  description:
    "দুরন্ত ডিজিটাল সাইন পাটগ্রাম – পিভিসি ব্যানার, পোস্টার, ক্রেস্ট, ভিনাইল স্টিকার, মগ প্রিন্ট, গেঞ্জি প্রিন্ট, ক্যাশমেমো, ভিজিটিং কার্ড, আইডি কার্ড, সার্টিফিকেট এবং আরও অনেক কিছু। পাটগ্রাম, লালমনিরহাট।",
  keywords:
    "দুরন্ত সাইন, পাটগ্রাম, প্রিন্টিং, ব্যানার, পোস্টার, ডিজিটাল সাইন, লালমনিরহাট",
  openGraph: {
    title: "দুরন্ত ডিজিটাল সাইন পাটগ্রাম",
    description: "প্রিন্টিং থেকে ছাপানো — এক ছাদের নিচেই সব!",
    type: "website",
    locale: "bn_BD",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
