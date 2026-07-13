import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, payments, dueEntries } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const allCustomers = await db
      .select({
        id: customers.id,
        name: customers.name,
        phone: customers.phone,
        totalDue: customers.totalDue,
        notes: customers.notes,
        isActive: customers.isActive,
        createdAt: customers.createdAt,
        updatedAt: customers.updatedAt,
      })
      .from(customers)
      .where(
        search
          ? sql`lower(${customers.name}) like lower(${"%" + search + "%"}) or ${customers.phone} like ${"%" + search + "%"}`
          : sql`1=1`
      )
      .orderBy(desc(customers.totalDue));

    const total = allCustomers.reduce(
      (sum, c) => sum + parseFloat(c.totalDue || "0"),
      0
    );

    return NextResponse.json({ customers: allCustomers, total });
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, totalDue, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    const [newCustomer] = await db
      .insert(customers)
      .values({
        name,
        phone,
        totalDue: totalDue?.toString() || "0",
        notes: notes || null,
      })
      .returning();

    // If initial due amount provided, create a due entry
    if (totalDue && parseFloat(totalDue) > 0) {
      await db.insert(dueEntries).values({
        customerId: newCustomer.id,
        amount: totalDue.toString(),
        description: "প্রারম্ভিক বাকি",
      });
    }

    return NextResponse.json({ customer: newCustomer }, { status: 201 });
  } catch (error) {
    console.error("POST /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
