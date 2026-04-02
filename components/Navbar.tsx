"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const darkStyle = isHome;

  const getLinkClass = (href: string) => {
    const isActive = pathname === href;

    if (darkStyle) {
      return isActive
        ? "text-sm font-semibold text-white"
        : "text-sm text-white/85 transition hover:text-white";
    }

    return isActive
      ? "text-sm font-semibold text-black"
      : "text-sm text-neutral-700 transition hover:text-black";
  };

  const mobileLinkClass = (href: string) => {
    const isActive = pathname === href;
    return isActive
      ? "block rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white"
      : "block rounded-2xl px-4 py-3 text-sm text-neutral-700 transition hover:bg-neutral-100";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 pt-6">
        <div
          className={`rounded-[28px] px-6 py-4 backdrop-blur-md ${
            darkStyle
              ? "border border-white/15 bg-[var(--primary)]/30"
              : "border border-neutral-200 bg-white/85 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={`text-sm font-semibold tracking-[0.3em] ${
                darkStyle ? "text-white" : "text-black"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              DENTALDARI
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link href="/about" className={getLinkClass("/about")}>
                درباره من
              </Link>
              <Link href="/consultation" className={getLinkClass("/consultation")}>
                مشاوره
              </Link>
              <Link href="/socials" className={getLinkClass("/socials")}>
                شبکه‌های اجتماعی
              </Link>
              <Link href="/contact" className={getLinkClass("/contact")}>
                تماس
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/book"
                className={`hidden rounded-full px-5 py-2.5 text-sm font-medium transition md:inline-flex ${
                  pathname === "/book"
                    ? "bg-neutral-800 text-white"
                    : darkStyle
                    ? "bg-white text-black hover:opacity-90"
                    : "bg-[var(--primary)] text-white hover:opacity-90"
                }`}
              >
                رزرو
              </Link>

              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setMenuOpen((prev) => !prev)}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full md:hidden ${
                  darkStyle
                    ? "border border-white/20 text-white"
                    : "border border-neutral-300 text-black"
                }`}
              >
                <span className="sr-only">Menu</span>
                <div className="flex flex-col gap-1.5">
                  <span
                    className={`block h-0.5 w-5 ${
                      darkStyle ? "bg-white" : "bg-[var(--primary)]"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 ${
                      darkStyle ? "bg-white" : "bg-[var(--primary)]"
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-5 ${
                      darkStyle ? "bg-white" : "bg-[var(--primary)]"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="mt-4 border-t border-black/10 pt-4 md:hidden">
              <div className="space-y-2">
                <Link
                  href="/about"
                  className={mobileLinkClass("/about")}
                  onClick={() => setMenuOpen(false)}
                >
                  درباره من
                </Link>
                <Link
                  href="/consultation"
                  className={mobileLinkClass("/consultation")}
                  onClick={() => setMenuOpen(false)}
                >
                  مشاوره
                </Link>
                <Link
                  href="/socials"
                  className={mobileLinkClass("/socials")}
                  onClick={() => setMenuOpen(false)}
                >
                  شبکه‌های اجتماعی
                </Link>
                <Link
                  href="/contact"
                  className={mobileLinkClass("/contact")}
                  onClick={() => setMenuOpen(false)}
                >
                  تماس
                </Link>
                <Link
                  href="/book"
                  className="block rounded-2xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  رزرو
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}