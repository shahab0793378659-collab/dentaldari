import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, fullName, date, time } = await req.json();

    await resend.emails.send({
      from: "Dentaldari <onboarding@resend.dev>",
      to: [email, "dentaldari.com@gmail.com"],
      subject: "Ny bokning - Dentaldari",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.8;">
          <h2>Ny bokning hos Dentaldari</h2>

          <p><strong>Namn:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Datum:</strong> ${date}</p>
          <p><strong>Tid:</strong> ${time}</p>

          <hr style="margin: 24px 0;" />

          <h3>Bekräftelse till patient</h3>
          <p>سلام ${fullName}</p>
          <p>رزرو مشاوره آنلاین شما ثبت شد.</p>
          <p><strong>تاریخ:</strong> ${date}</p>
          <p><strong>ساعت:</strong> ${time}</p>
          <p>لطفاً در زمان مشخص آماده باشید.</p>

          <br />
          <p>Dentaldari</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send confirmation error:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }
}