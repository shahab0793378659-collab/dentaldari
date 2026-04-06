type SuccessPageProps = {
  searchParams: Promise<{
    fullName?: string;
    email?: string;
    time?: string;
    date?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;

  const fullName = params.fullName || "";
  const email = params.email || "";
  const time = params.time || "";
  const rawDate = params.date || "";

  let formattedDate = "";
  if (rawDate) {
    const parsedDate = new Date(rawDate);
    if (!isNaN(parsedDate.getTime())) {
      formattedDate = parsedDate.toLocaleDateString("sv-SE", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-6 py-10">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-sm md:p-12">
        <div className="text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Payment Success
          </p>

          <h1 className="mb-4 text-3xl font-bold md:text-4xl">
            پرداخت موفق بود
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
            تشکر از شما. رزرو و پرداخت شما با موفقیت انجام شد. معلومات رزرو شما
            در پایین نوشته شده است.
          </p>
        </div>

        <div className="mb-8 rounded-[24px] bg-[#f8f6f2] p-6 text-right">
          <h2 className="mb-4 text-xl font-semibold">خلاصه رزرو</h2>

          <div className="space-y-2 text-sm leading-7 text-neutral-700 md:text-base">
            <p>
              <span className="font-medium">نام:</span>{" "}
              {fullName || "ثبت نشده"}
            </p>
            <p>
              <span className="font-medium">ایمیل:</span>{" "}
              {email || "ثبت نشده"}
            </p>
            <p>
              <span className="font-medium">روز:</span>{" "}
              {formattedDate || "ثبت نشده"}
            </p>
            <p>
              <span className="font-medium">ساعت:</span>{" "}
              {time || "ثبت نشده"}
            </p>
            <p>
              <span className="font-medium">نوع جلسه:</span> مشاوره آنلاین
              دندانپزشکی
            </p>
            <p>
              <span className="font-medium">مدت:</span> ۲۰ دقیقه
            </p>
            <p>
              <span className="font-medium">مبلغ پرداختی:</span> ۹۹ کرون
            </p>
          </div>
        </div>

        <div className="mb-8 rounded-[24px] border border-neutral-200 p-6 text-right">
          <h2 className="mb-4 text-xl font-semibold">مرحله بعد چیست؟</h2>

          <div className="space-y-3 text-sm leading-7 text-neutral-700 md:text-base">
            <p>• یک ایمیل تایید برای شما ارسال می‌شود.</p>
            <p>• لینک جلسه آنلاین گوگل میت برای شما فرستاده خواهد شد.</p>
            <p>• لطفاً چند دقیقه قبل از وقت تعیین‌شده آماده باشید.</p>
            <p>• اگر سوالی داشتید، از طریق اینستاگرام پیام بدهید.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/"
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-white transition hover:opacity-90"
          >
            بازگشت به صفحه اصلی
          </a>

          <a
            href="https://instagram.com/shahabmohammadi.nu"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-black px-6 py-3 transition hover:bg-[var(--primary)] hover:text-white"
          >
            پیام در اینستاگرام
          </a>
        </div>

        <form
          action="/api/send-confirmation"
          method="POST"
          className="hidden"
        >
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="fullName" value={fullName} />
          <input type="hidden" name="date" value={rawDate} />
          <input type="hidden" name="time" value={time} />
        </form>
      </div>
    </main>
  );
}