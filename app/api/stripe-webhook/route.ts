// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { isSlotBooked } from "../../../lib/calendar";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

function formatDateTimeInStockholm(date: string, timeRange: string) {
  const [startTime] = timeRange.split(" - ");
  const [hours, minutes] = startTime.split(":").map(Number);

  const start = new Date(`${date}T00:00:00`);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 20);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

async function createCalendarEvent({
  fullName,
  customerEmail,
  date,
  time,
}: {
  fullName: string;
  customerEmail: string;
  date: string;
  time: string;
}) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  const calendar = google.calendar({ version: "v3", auth });

  const { start, end } = formatDateTimeInStockholm(date, time);

  const event = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Dentaldari online consultation (≈ $9.9) - ${fullName}`,
      description:
        `Online dental consultation via Google Meet.\n\n` +
        `Name: ${fullName}\n` +
        `Email: ${customerEmail}\n` +
        `Date: ${date}\n` +
        `Time: ${time}`,
      start: {
        dateTime: start,
        timeZone: "Europe/Stockholm",
      },
      end: {
        dateTime: end,
        timeZone: "Europe/Stockholm",
      },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    },
  });

  const meetLink =
    event.data.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video"
    )?.uri || "";

  return {
    meetLink,
    googleEventLink: event.data.htmlLink || "",
  };
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const fullName = session.metadata?.fullName || "";
      const email = session.metadata?.email || session.customer_email || "";
      const date = session.metadata?.date || "";
      const time = session.metadata?.time || "";

      if (!fullName || !email || !date || !time) {
        console.error("Missing metadata in Stripe session");
        return NextResponse.json({ received: true });
      }

      const alreadyBooked = await isSlotBooked(date, time);

      if (alreadyBooked) {
        await resend.emails.send({
          from: "Dentaldari <dentaldari.com@gmail.com>",
          to: ["dentaldari.com@gmail.com"],
          subject: "VIKTIGT: möjlig dubbelbokning efter betalning",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8;">
              <h2>Manuell kontroll krävs</h2>
              <p>En betalning kom in för en tid som redan verkar vara bokad.</p>
              <p><strong>Namn:</strong> ${fullName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Datum:</strong> ${date}</p>
              <p><strong>Tid:</strong> ${time}</p>
              <p>Kontrollera Stripe och kalendern direkt.</p>
            </div>
          `,
        });

        await resend.emails.send({
          from: "Dentaldari <onboarding@resend.dev>",
          to: [email],
          subject: "Din bokning granskas manuellt - Dentaldari",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8;">
              <h2>Vi granskar din bokning manuellt</h2>
              <p>Vi har mottagit din betalning och granskar just nu din bokning manuellt för att säkerställa rätt tid.</p>
              <p>Du får snart ett uppföljande mejl från oss.</p>
            </div>
          `,
        });

        return NextResponse.json({ received: true });
      }

      let meetLink = "";
      let googleEventLink = "";
      let calendarFailed = false;

      try {
        const calendarResult = await createCalendarEvent({
          fullName,
          customerEmail: email,
          date,
          time,
        });

        meetLink = calendarResult.meetLink;
        googleEventLink = calendarResult.googleEventLink;
      } catch (calendarError) {
        calendarFailed = true;
        console.error("Calendar creation error:", calendarError);
      }

      await resend.emails.send({
        from: "Dentaldari <dentaldari.com@gmail.com>",
        to: [email, "dentaldari.com@gmail.com"],
        subject: calendarFailed
          ? "Bokning mottagen - Dentaldari"
          : "Bekräftelse på bokning - Dentaldari",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8;">
            <h2>Ny bokning hos Dentaldari</h2>

            <p><strong>Namn:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Datum:</strong> ${date}</p>
            <p><strong>Tid:</strong> ${time}</p>

            ${
              calendarFailed
                ? `
              <p><strong>Obs:</strong> Bokningen är mottagen, men Google Meet-länken skapas manuellt och skickas separat inom kort.</p>
            `
                : `
              <p><strong>Google Meet-länk:</strong><br />
              <a href="${meetLink}">${meetLink}</a></p>

              <p><strong>Lägg till i Google Kalender:</strong><br />
              <a href="${googleEventLink}">Öppna kalenderbokningen</a></p>
            `
            }

            <hr style="margin: 24px 0;" />

            <h3>Bekräftelse till patient</h3>
            <p>سلام ${fullName}</p>
            <p>رزرو مشاوره آنلاین شما ثبت شد.</p>
            <p><strong>تاریخ:</strong> ${date}</p>
            <p><strong>ساعت:</strong> ${time}</p>

            ${
              calendarFailed
                ? `
              <p>لینک جلسه آنلاین بعداً برای شما ارسال خواهد شد.</p>
            `
                : `
              <p><strong>لینک جلسه:</strong><br />
              <a href="${meetLink}">${meetLink}</a></p>

              <p><strong>اضافه کردن به گوگل کلندر:</strong><br />
              <a href="${googleEventLink}">Open calendar event</a></p>
            `
            }

            <br />
            <p>Dentaldari</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}