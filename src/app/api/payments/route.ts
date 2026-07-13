import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, payments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, amount, note, paymentDate } = body;

    if (!customerId || !amount) {
      return NextResponse.json(
        { error: "Customer ID and amount are required" },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Get current customer
    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.id, customerId));

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const currentDue = parseFloat(customer.totalDue || "0");
    const newDue = Math.max(0, currentDue - amountNum);

    // Insert payment record
    const [payment] = await db
      .insert(payments)
      .values({
        customerId,
        amount: amountNum.toString(),
        note: note || null,
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      })
      .returning();

    // Update customer total due
    await db
      .update(customers)
      .set({
        totalDue: newDue.toString(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({ payment, newDue }, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
