import { NextResponse } from "next/server";
import { getBookedSlotsForDate } from "../../../lib/calendar";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date" },
        { status: 400 }
      );
    }

    const bookedSlots = await getBookedSlotsForDate(date);

    return NextResponse.json({ bookedSlots });
  } catch (error) {
    console.error("Booked slots error:", error);
    return NextResponse.json(
      { error: "Could not load booked slots" },
      { status: 500 }
    );
  }
}