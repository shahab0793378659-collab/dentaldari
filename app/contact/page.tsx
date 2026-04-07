export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--primary)] px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-white/60">
          Contact
        </p>

        <h1 className="mb-6 text-4xl font-bold md:text-5xl">
          تماس با من
        </h1>

        <div className="rtl-copy space-y-6 text-base leading-8 text-white/80 md:text-lg">
          <p>
            اگر سوالی دارید، می‌توانید از طریق اینستاگرام پیام بدهید یا مستقیماً
            وقت مشاوره آنلاین رزرو کنید.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="/book"
            className="rounded-full bg-white px-6 py-3 text-center text-black transition hover:opacity-90"
          >
            رزرو مشاوره
          </a>

          <a
            href="https://instagram.com/dentaldari"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white px-6 py-3 text-center transition hover:bg-white hover:text-black"
          >
            پیام در اینستاگرام
          </a>
        </div>
      </div>
    </main>
  );
}