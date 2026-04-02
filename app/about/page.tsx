import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f2] px-6 py-20 text-black">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div className="fade-up">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            About
          </p>

          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            درباره من
          </h1>

          <div className="rtl-copy space-y-6 text-base leading-8 text-neutral-700 md:text-lg">
            <p>
              من دندانپزشک هستم و در سویدن کار می‌کنم. هدف من این است که معلومات
              درست، واضح و قابل فهم درباره دندانپزشکی را به زبان دری در اختیار
              شما قرار بدهم.
            </p>

            <p>
              در شبکه‌های اجتماعی درباره درد دندان، درمان‌ها، مراقبت دهان و دندان
              و سوالات رایج معلومات ارائه می‌کنم تا فارسی‌زبانان بتوانند بهتر و
              راحت‌تر تصمیم بگیرند.
            </p>

            <p>
              از طریق Dentaldari شما می‌توانید مشاوره آنلاین رزرو کنید و پاسخ
              سوالات دندانپزشکی خود را به زبان دری دریافت نمایید.
            </p>
          </div>
        </div>

        <div className="fade-up">
          <div className="luxury-card overflow-hidden rounded-[32px] bg-white">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/about.jpg"
                alt="Dentaldari"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}