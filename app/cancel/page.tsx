export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-6">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 text-center shadow-sm md:p-12">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
          Payment Cancelled
        </p>

        <h1 className="mb-6 text-3xl font-bold md:text-4xl">
          پرداخت تکمیل نشد
        </h1>

        <p className="mb-8 text-base leading-8 text-neutral-700 md:text-lg">
          مشکلی نیست. اگر خواستید، می‌توانید دوباره تلاش کنید و مشاوره خود را رزرو نمایید.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/#book"
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-white transition hover:opacity-90"
          >
            تلاش دوباره
          </a>

          <a
            href="/"
            className="rounded-full border border-black px-6 py-3 transition hover:bg-[var(--primary)] hover:text-white"
          >
            بازگشت به صفحه اصلی
          </a>
        </div>
      </div>
    </main>
  );
}