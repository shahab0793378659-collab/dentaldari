export default function ConsultationPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-20 text-black">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
          Consultation
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          مشاوره آنلاین
        </h1>

        <div className="rtl-copy space-y-6 text-base leading-8 text-neutral-700 md:text-lg">
          <p>
            مشاوره آنلاین برای سوالات دندانپزشکی، درد دندان، مراقبت‌های خانگی،
            راهنمایی قبل از مراجعه حضوری و فهم بهتر گزینه‌های درمانی مناسب است.
          </p>

          <p>
            مدت هر مشاوره ۲۰ دقیقه است و قیمت آن ۹۹ کرون می‌باشد.
          </p>

          <p>
            برای رزرو وقت، روز و ساعت مناسب خود را انتخاب کرده و سپس پرداخت را
            انجام دهید.
          </p>
        </div>

        <a
          href="/book"
          className="mt-8 inline-block rounded-full bg-[var(--primary)] px-6 py-3 text-white transition hover:opacity-90"
        >
          رزرو و پرداخت
        </a>
      </div>
    </main>
  );
}