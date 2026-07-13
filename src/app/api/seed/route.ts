import { NextResponse } from "next/server";
import { db } from "@/db";
import { customers, dueEntries } from "@/db/schema";
import { sql } from "drizzle-orm";

const initialCustomers = [
  { name: "মাহবুব ভাই", phone: "01717094515", totalDue: "900.00" },
  { name: "হস্তলিপি একাডেমী", phone: "01894062946", totalDue: "500.00" },
  { name: "Afsana Arifa Apu", phone: "01616746123", totalDue: "1300.00" },
  { name: "Sumaiya F", phone: "01704304505", totalDue: "2000.00" },
  { name: "Sojib Red crescent", phone: "01406587807", totalDue: "150.00" },
  { name: "Sumon Vai Patgram", phone: "01976707601", totalDue: "250.00" },
  { name: "Hamidul Islám Milon Vai", phone: "01785314552", totalDue: "900.00" },
  { name: "Lemon's English Point", phone: "01787750815", totalDue: "4000.00" },
  { name: "Sagor Vai Pt", phone: "01781022523", totalDue: "200.00" },
  { name: "Mostofa Vai New", phone: "01765030107", totalDue: "1500.00" },
  { name: "Abdul korim chacha", phone: "01751120859", totalDue: "800.00" },
  { name: "Popy dada poster", phone: "01734559077", totalDue: "1000.00" },
  { name: "Tasmiya F Patgram", phone: "01854500402", totalDue: "600.00" },
  { name: "Shahajalal vai Patgram", phone: "01737653899", totalDue: "2158.00" },
  { name: "রেজাউল পানবাড়ি মাদ্রাসা", phone: "01937365426", totalDue: "1000.00" },
  { name: "আতিক স্যার সরকারি কলেজ", phone: "01738236006", totalDue: "2380.00" },
  { name: "সুমন কুচলিবাড়ি", phone: "01881047502", totalDue: "800.00" },
  { name: "ইমানুর", phone: "01345851277", totalDue: "1400.00" },
  { name: "ফরিদুল জয়যাত্রা", phone: "01792808305", totalDue: "2296.00" },
  { name: "মনির ভাই জোংড়া", phone: "01710226756", totalDue: "6000.00" },
  { name: "মাহবুব হুজুর", phone: "01723489907", totalDue: "8246.00" },
  { name: "হাফিজুল হুজুর", phone: "01301663645", totalDue: "700.00" },
  { name: "কচুয়ারপাড় উচ্চ বিদ্যালয়", phone: "01716090586", totalDue: "1500.00" },
  { name: "ললিতারহাট উচ্চ বিদ্যালয়", phone: "01309123014", totalDue: "6000.00" },
  { name: "আনোয়ারুল ইসলাম রাজু", phone: "01612021855", totalDue: "12340.00" },
  { name: "রাকিব", phone: "01581887072", totalDue: "100.00" },
  { name: "Nazmira", phone: "01812489130", totalDue: "0.00" },
  { name: "Mamun Vai Icab", phone: "01774218668", totalDue: "0.00" },
  { name: "ঈমানুর কুচলিবাড়ী", phone: "01714287824", totalDue: "1370.00" },
  { name: "Mijanur hujur", phone: "01745099906", totalDue: "500.00" },
];

export async function POST() {
  try {
    // Check if already seeded
    const existing = await db.select().from(customers).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    for (const c of initialCustomers) {
      const [customer] = await db
        .insert(customers)
        .values({
          name: c.name,
          phone: c.phone,
          totalDue: c.totalDue,
        })
        .returning();

      if (parseFloat(c.totalDue) > 0) {
        await db.insert(dueEntries).values({
          customerId: customer.id,
          amount: c.totalDue,
          description: "প্রারম্ভিক বাকি (পুরনো হিসাব)",
        });
      }
    }

    return NextResponse.json({ message: "Seeded successfully", count: initialCustomers.length });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
