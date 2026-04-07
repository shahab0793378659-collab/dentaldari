"use client";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[var(--primary)]/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/75" />

        <div className="relative z-10 mx-auto max-w-5xl text-center text-white fade-up">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-white/70">
            Dentaldari
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            مشوره آنلاین دندانپزشکی
            <br />
            به زبان دری
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-base leading-8 text-white/85 md:text-lg">
            اگر درباره درد دندان، التهاب، درمان، کشیدن دندان، عصب‌کشی، مراقبت
            دهان و دندان یا سوالات عمومی دندانپزشکی نیاز به راهنمایی دارید،
            می‌توانید وقت مشاوره آنلاین رزرو کنید.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/book"
              className="rounded-full bg-white px-6 py-3 text-black transition hover:opacity-90"
            >
              رزرو مشاوره
            </a>

            <a
              href="/about"
              className="rounded-full border border-white/70 px-6 py-3 text-white transition hover:bg-white hover:text-black"
            >
              درباره من
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--soft-blue)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-3 fade-up">
            <a
              href="/about"
              className="luxury-card rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold">درباره من</h2>
              <p className="leading-8 text-neutral-700">
                آشنایی بیشتر با من و هدف Dentaldari
              </p>
            </a>

            <a
              href="/consultation"
              className="luxury-card rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold">مشاوره آنلاین</h2>
              <p className="leading-8 text-neutral-700">
                معلومات کامل درباره مشاوره ۲۰ دقیقه‌ای
              </p>
            </a>

            <a
              href="/socials"
              className="luxury-card rounded-[28px] bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="mb-3 text-2xl font-semibold">شبکه‌های اجتماعی</h2>
              <p className="leading-8 text-neutral-700">
                اینستاگرام و تیک‌تاک من را ببینید
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-neutral-200 bg-white p-8 text-center shadow-sm md:p-12 fade-up">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Online Consultation
          </p>

          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            رزرو مشاوره آنلاین
          </h2>

          <p className="mx-auto mb-6 max-w-2xl text-base leading-8 text-neutral-700 md:text-lg">
            مشاوره دیجیتال ۲۰ دقیقه‌ای برای سوالات دندانپزشکی، درد دندان،
            مراقبت‌های خانگی، انتخاب درمان مناسب و راهنمایی پیش از مراجعه حضوری.
          </p>

          <p className="mb-2 text-2xl font-semibold">۹۹ کرون ‎(حدود ۹.۹ دالر)</p>
          <p className="mb-8 text-neutral-500">۲۰ دقیقه – آنلاین</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/book"
              className="rounded-full bg-[var(--primary)] px-6 py-3 text-white transition hover:opacity-90"
            >
              رزرو و پرداخت
            </a>

            <a
              href="/contact"
              className="rounded-full border border-black px-6 py-3 transition hover:bg-[var(--primary)] hover:text-white"
            >
              تماس
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--primary)] px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center fade-up">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">تماس با من</h2>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            اگر سوالی دارید، می‌توانید از طریق اینستاگرام پیام بدهید یا مستقیماً
            وقت مشاوره آنلاین رزرو کنید.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/book"
              className="rounded-full bg-white px-6 py-3 text-black transition hover:opacity-90"
            >
              رزرو مشاوره
            </a>

            <a
              href="/contact"
              className="rounded-full border border-white px-6 py-3 transition hover:bg-white hover:text-black"
            >
              صفحه تماس
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}