// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isSlotBooked } from "../../../lib/calendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const body = await req.json();

    const { fullName, email, phone, reason, date, time } = body;

    if (!fullName || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const alreadyBooked = await isSlotBooked(String(date), String(time));

    if (alreadyBooked) {
      return NextResponse.json(
        { error: "This time is already booked" },
        { status: 409 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      payment_intent_data: {
        description: `Dentaldari consultation - ${fullName} - ${date} ${time}`,
      },
      metadata: {
        fullName,
        email,
        phone,
        reason: reason || "",
        date: String(date),
        time,
        type: "dentaldari_consultation",
      },
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: {
              name: "Dentaldari Online Consultation",
            },
            unit_amount: 9900,
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}&fullName=${encodeURIComponent(
        fullName
      )}&email=${encodeURIComponent(email)}&date=${encodeURIComponent(
        String(date)
      )}&time=${encodeURIComponent(time)}`,
      cancel_url: `${siteUrl}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}