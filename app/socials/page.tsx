export default function SocialsPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-20 text-black">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
          Social Media
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          شبکه‌های اجتماعی
        </h1>

        <div className="rtl-copy space-y-6 text-base leading-8 text-neutral-700 md:text-lg">
          <p>
            برای ویدیوهای آموزشی، نکات کاربردی و پاسخ به سوالات رایج، مرا در
            اینستاگرام و تیک‌تاک دنبال کنید.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <a
            href="https://www.instagram.com/shahabmohammadi.nu"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-card group rounded-[28px] border border-neutral-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white transition group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">اینستاگرام</h2>
            </div>

            <p className="leading-8 text-neutral-700">
              ویدیوهای آموزشی و معلومات دندانپزشکی
            </p>
          </a>

          <a
            href="https://www.tiktok.com/@shahabmohammadi.nu"
            target="_blank"
            rel="noopener noreferrer"
            className="luxury-card group rounded-[28px] border border-neutral-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-white transition group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.187h-3.161l-.005 12.907a2.571 2.571 0 1 1-1.814-2.454V9.693a5.755 5.755 0 1 0 5.756 5.712V8.749a8.154 8.154 0 0 0 4.995 1.714V7.275a4.83 4.83 0 0 1-2.001-.589z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">تیک‌تاک</h2>
            </div>

            <p className="leading-8 text-neutral-700">
              محتواهای کوتاه و مفید درباره سلامت دهان و دندان
            </p>
          </a>
        </div>
      </div>
    </main>
  );
}