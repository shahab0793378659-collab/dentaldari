export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#cfe3f8] bg-[#eaf4ff] px-6 py-10 text-black">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-[0.25em] text-[#0051A2]">
              DENTALDARI
            </h3>
            <p className="text-sm leading-7 text-neutral-700">
              مشاوره آنلاین دندانپزشکی به زبان دری. هدف ما ارائه معلومات درست،
              واضح و قابل فهم برای فارسی‌زبانان است.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#0051A2]">لینک‌ها</h4>
            <div className="space-y-2 text-sm text-neutral-700">
              <a href="/about" className="block transition hover:text-[#0051A2]">
                درباره من
              </a>
              <a
                href="/consultation"
                className="block transition hover:text-[#0051A2]"
              >
                مشاوره
              </a>
              <a href="/socials" className="block transition hover:text-[#0051A2]">
                شبکه‌های اجتماعی
              </a>
              <a href="/contact" className="block transition hover:text-[#0051A2]">
                تماس
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-[#0051A2]">تماس</h4>

            <div className="space-y-3 text-sm text-neutral-700">
              <p>
                Email:{" "}
                <a
                  href="mailto:dentaldari.com@gmail.com"
                  className="transition hover:text-[#0051A2]"
                >
                  dentaldari.com@gmail.com
                </a>
              </p>

              <a
                href="https://www.instagram.com/shahabmohammadi.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-[#0051A2]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0051A2] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3 w-3"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </span>
                <span>Instagram: @shahabmohammadi.nu</span>
              </a>

              <a
                href="https://www.tiktok.com/@shahabmohammadi.nu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition hover:text-[#0051A2]"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0051A2] text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-3 w-3"
                  >
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.187h-3.161l-.005 12.907a2.571 2.571 0 1 1-1.814-2.454V9.693a5.755 5.755 0 1 0 5.756 5.712V8.749a8.154 8.154 0 0 0 4.995 1.714V7.275a4.83 4.83 0 0 1-2.001-.589z" />
                  </svg>
                </span>
                <span>TikTok: @shahabmohammadi.nu</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#cfe3f8] pt-6 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} Dentaldari. All rights reserved.
        </div>
      </div>
    </footer>
  );
}