import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { customers, dueEntries } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerId, amount, description, dueDate } = body;

    if (!customerId || !amount) {
      return NextResponse.json(
        { error: "Customer ID and amount are required" },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

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

    const [entry] = await db
      .insert(dueEntries)
      .values({
        customerId,
        amount: amountNum.toString(),
        description: description || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      })
      .returning();

    // Update customer total due
    const currentDue = parseFloat(customer.totalDue || "0");
    const newDue = currentDue + amountNum;

    await db
      .update(customers)
      .set({
        totalDue: newDue.toString(),
        updatedAt: new Date(),
      })
      .where(eq(customers.id, customerId));

    return NextResponse.json({ entry, newDue }, { status: 201 });
  } catch (error) {
    console.error("POST /api/due-entries error:", error);
    return NextResponse.json(
      { error: "Failed to add due entry" },
      { status: 500 }
    );
  }
}
