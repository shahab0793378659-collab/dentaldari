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
      summary: `Dentaldari consultation - ${fullName}`,
      description:
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
          from: "Dentaldari <onboarding@resend.dev>",
          to: ["dentaldari.com@gmail.com"],
          subject: "رزرو تکراری احتمالی",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.9; direction: rtl; text-align: right;">
              <h2>نیاز به بررسی دستی</h2>
              <p>یک پرداخت برای زمانی ثبت شده که احتمالاً قبلاً رزرو شده است.</p>
              <p><strong>نام:</strong> ${fullName}</p>
              <p><strong>ایمیل:</strong> ${email}</p>
              <p><strong>تاریخ:</strong> ${date}</p>
              <p><strong>ساعت:</strong> ${time}</p>
              <p>لطفاً این رزرو را دستی بررسی کنید.</p>
            </div>
          `,
        });

        await resend.emails.send({
          from: "Dentaldari <onboarding@resend.dev>",
          to: [email],
          subject: "رزرو شما در حال بررسی است",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.9; direction: rtl; text-align: right;">
              <h2>رزرو شما در حال بررسی است</h2>
              <p>پرداخت شما دریافت شد، اما برای اطمینان از درست بودن زمان رزرو، درخواست شما به‌صورت دستی بررسی می‌شود.</p>
              <p>به‌زودی ایمیل بعدی برای شما ارسال خواهد شد.</p>
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

      // Mail till dig
      await resend.emails.send({
        from: "Dentaldari <onboarding@resend.dev>",
        to: ["dentaldari.com@gmail.com"],
        subject: "رزرو جدید در Dentaldari",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.9; direction: rtl; text-align: right;">
            <h2>رزرو جدید</h2>
            <p><strong>نام:</strong> ${fullName}</p>
            <p><strong>ایمیل:</strong> ${email}</p>
            <p><strong>تاریخ:</strong> ${date}</p>
            <p><strong>ساعت:</strong> ${time}</p>

            ${
              calendarFailed
                ? `<p><strong>نکته:</strong> رزرو ثبت شده است، اما لینک Google Meet هنوز به‌صورت خودکار ساخته نشده و باید بررسی شود.</p>`
                : `
                  <p><strong>لینک جلسه:</strong><br />
                  <a href="${meetLink}">${meetLink}</a></p>

                  <p><strong>لینک رویداد گوگل کلندر:</strong><br />
                  <a href="${googleEventLink}">${googleEventLink}</a></p>
                `
            }
          </div>
        `,
      });

      // Mail till kund
      await resend.emails.send({
        from: "Dentaldari <onboarding@resend.dev>",
        to: [email],
        subject: calendarFailed
          ? "رزرو شما ثبت شد"
          : "تایید رزرو شما",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.9; direction: rtl; text-align: right;">
            <h2>رزرو شما ثبت شد</h2>
            <p>سلام ${fullName}</p>
            <p>رزرو مشاوره آنلاین شما با موفقیت ثبت شد.</p>
            <p><strong>تاریخ:</strong> ${date}</p>
            <p><strong>ساعت:</strong> ${time}</p>

            ${
              calendarFailed
                ? `<p>لینک جلسه آنلاین به‌زودی برای شما ارسال خواهد شد.</p>`
                : `
                  <p><strong>لینک Google Meet:</strong><br />
                  <a href="${meetLink}">${meetLink}</a></p>

                  <p><strong>لینک رویداد گوگل کلندر:</strong><br />
                  <a href="${googleEventLink}">${googleEventLink}</a></p>
                `
            }

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