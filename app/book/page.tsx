"use client";

import { useEffect, useMemo, useState } from "react";

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isSameDay(a: Date, b: Date) {
  return formatDateKey(a) === formatDateKey(b);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function getMonthName(date: Date) {
  const persianMonths = [
    "جنوری",
    "فبروری",
    "مارچ",
    "اپریل",
    "می",
    "جون",
    "جولای",
    "آگست",
    "سپتمبر",
    "اکتوبر",
    "نومبر",
    "دسمبر",
  ];

  const month = persianMonths[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}

function getWeekdayLabel(date: Date) {
  return date.toLocaleDateString("fa-AF", {
    weekday: "long",
  });
}

function getDayNumber(date: Date) {
  return date.getDate();
}

function getStockholmNowParts() {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value || "";

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

function isPastDay(date: Date) {
  const now = getStockholmNowParts();
  const todayKey = `${now.year}-${String(now.month).padStart(2, "0")}-${String(
    now.day
  ).padStart(2, "0")}`;

  return formatDateKey(date) <= todayKey;
}

function generateCalendarDays(currentMonth: Date) {
  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );

  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );

  const startDay = (startOfMonth.getDay() + 6) % 7;
  const daysInMonth = endOfMonth.getDate();

  const days: (Date | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    );
  }

  return days;
}

function generateTimeSlots(selectedDate: Date | null) {
  if (!selectedDate) return [];

  const day = selectedDate.getDay();
  const isWeekend = day === 0 || day === 6;

  const startHour = isWeekend ? 10 : 17;
  const endHour = 20;

  const slots: string[] = [];

  let currentHour = startHour;
  let currentMinute = 0;

  while (true) {
    const slotStartMinutes = currentHour * 60 + currentMinute;
    const slotEndMinutes = slotStartMinutes + 20;
    const endLimitMinutes = endHour * 60;

    if (slotEndMinutes > endLimitMinutes) break;

    const start = `${String(currentHour).padStart(2, "0")}:${String(
      currentMinute
    ).padStart(2, "0")}`;

    const endHourPart = Math.floor(slotEndMinutes / 60);
    const endMinutePart = slotEndMinutes % 60;

    const end = `${String(endHourPart).padStart(2, "0")}:${String(
      endMinutePart
    ).padStart(2, "0")}`;

    slots.push(`${start} - ${end}`);

    const nextMinutes = slotStartMinutes + 25;
    currentHour = Math.floor(nextMinutes / 60);
    currentMinute = nextMinutes % 60;
  }

  return slots;
}

export default function BookPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingBookedSlots, setLoadingBookedSlots] = useState(false);

  const calendarDays = useMemo(
    () => generateCalendarDays(currentMonth),
    [currentMonth]
  );

  const timeSlots = useMemo(
    () => generateTimeSlots(selectedDate),
    [selectedDate]
  );

  const monthTitle = getMonthName(currentMonth);

  useEffect(() => {
    async function loadBookedSlots() {
      if (!selectedDate) {
        setBookedSlots([]);
        return;
      }

      try {
        setLoadingBookedSlots(true);

        const date = formatDateKey(selectedDate);
        const response = await fetch(`/api/booked-slots?date=${date}`);
        const data = await response.json();

        if (response.ok) {
          setBookedSlots(data.bookedSlots || []);
        } else {
          console.error(data);
          setBookedSlots([]);
        }
      } catch (error) {
        console.error(error);
        setBookedSlots([]);
      } finally {
        setLoadingBookedSlots(false);
      }
    }

    loadBookedSlots();
  }, [selectedDate]);

  const handleContinue = async () => {
    if (!selectedDate || !selectedTime) {
      alert("لطفاً ابتدا روز و ساعت را انتخاب کنید");
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("لطفاً معلومات خود را کامل وارد کنید");
      return;
    }

    if (bookedSlots.includes(selectedTime)) {
      alert("این ساعت قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          reason: reason.trim(),
          date: formatDateKey(selectedDate),
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        alert("این ساعت قبلاً رزرو شده است. لطفاً زمان دیگری را انتخاب کنید.");
        setSelectedTime("");
        return;
      }

      if (!response.ok) {
        console.error(data);
        alert("خطا در ساخت پرداخت. لطفاً دوباره تلاش کنید.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      alert("لینک پرداخت ساخته نشد");
    } catch (error) {
      console.error(error);
      alert("مشکل در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f9ff] px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Booking
          </p>

          <h1 className="mb-4 text-3xl font-bold md:text-5xl">
            رزرو وقت مشاوره آنلاین
          </h1>

          <p className="mx-auto max-w-3xl text-base leading-8 text-neutral-700 md:text-lg">
            ابتدا روز مناسب خود را از تقویم انتخاب کنید، سپس ساعت دلخواه را
            انتخاب نمایید. مدت هر نوبت ۲۰ دقیقه مشاوره است و ۵ دقیقه بین هر نوبت
            برای استراحت در نظر گرفته شده است.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-[#d8e8f8] bg-white p-6 shadow-sm md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-[#1B75BE]"
              >
                ماه قبل
              </button>

              <h2 className="text-center text-xl font-semibold md:text-2xl">
                {monthTitle}
              </h2>

              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="rounded-full border border-neutral-300 px-4 py-2 text-sm transition hover:border-[#1B75BE]"
              >
                ماه بعد
              </button>
            </div>

            <div className="mb-4 grid grid-cols-7 gap-3 text-center text-sm text-neutral-500">
              <div>دوشنبه</div>
              <div>سه‌شنبه</div>
              <div>چهارشنبه</div>
              <div>پنجشنبه</div>
              <div>جمعه</div>
              <div>شنبه</div>
              <div>یکشنبه</div>
            </div>

            <div className="grid grid-cols-7 gap-3">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} />;
                }

                const isSelected = selectedDate
                  ? isSameDay(day, selectedDate)
                  : false;
                const isPast = isPastDay(day);

                return (
                  <button
                    key={formatDateKey(day)}
                    type="button"
                    onClick={() => {
                      if (isPast) return;
                      setSelectedDate(day);
                      setSelectedTime("");
                    }}
                    className={`min-h-[84px] rounded-2xl border p-3 text-right transition ${
                      isPast
                        ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                        : isSelected
                        ? "border-[#0051A2] bg-[#1B75BE] text-white"
                        : "border-neutral-200 bg-[#fcfbf8] hover:border-[#1B75BE]"
                    }`}
                  >
                    <div className="flex h-full items-center justify-center">
                      <span className="text-lg font-semibold">
                        {getDayNumber(day)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[32px] border border-[#d8e8f8] bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-2 text-2xl font-semibold">انتخاب ساعت</h2>

            <p className="mb-6 text-sm leading-7 text-neutral-600">
              {selectedDate
                ? `برای ${getWeekdayLabel(selectedDate)} ${getDayNumber(
                    selectedDate
                  )} زمان مناسب خود را انتخاب کنید.`
                : "ابتدا یک روز از تقویم انتخاب کنید."}
            </p>

            <div className="grid max-h-[420px] gap-3 overflow-y-auto pr-1">
              {selectedDate ? (
                loadingBookedSlots ? (
                  <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-neutral-500">
                    در حال بارگذاری زمان‌های موجود...
                  </div>
                ) : timeSlots.length > 0 ? (
                  timeSlots.map((time) => {
                    const isBooked = bookedSlots.includes(time);

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          if (isBooked) return;
                          setSelectedTime(time);
                        }}
                        disabled={isBooked}
                        className={`rounded-2xl border px-4 py-3 text-right transition ${
                          isBooked
                            ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                            : selectedTime === time
                            ? "border-[#0051A2] bg-[#1B75BE] text-white"
                            : "border-neutral-300 bg-white hover:border-[#1B75BE]"
                        }`}
                      >
                        {time}
                        {isBooked ? " — رزرو شده" : ""}
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-neutral-500">
                    برای این روز زمان خالی موجود نیست
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center text-neutral-500">
                  ابتدا روز را انتخاب کنید
                </div>
              )}
            </div>

            <div className="mt-8 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-600">
                  نام کامل
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="نام و نام خانوادگی"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-600">
                  ایمیل
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-600">
                  شماره تماس
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="شماره تماس"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-600">
                  دلیل مشاوره
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-h-[110px] w-full rounded-2xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="مثلاً درد دندان، سوال درباره درمان، یا مشاوره عمومی"
                />
              </div>
            </div>

            <div className="mt-8 rounded-[24px] bg-[#eaf4ff] p-5">
              <h3 className="mb-3 text-lg font-semibold">خلاصه رزرو</h3>

              <div className="space-y-2 text-sm text-neutral-700">
                <p>
                  <span className="font-medium">روز:</span>{" "}
                  {selectedDate
                    ? `${getWeekdayLabel(selectedDate)} ${getDayNumber(
                        selectedDate
                      )}`
                    : "هنوز انتخاب نشده"}
                </p>
                <p>
                  <span className="font-medium">ساعت:</span>{" "}
                  {selectedTime || "هنوز انتخاب نشده"}
                </p>
                <p>
                  <span className="font-medium">نوع:</span> مشاوره آنلاین ۲۰ دقیقه
                </p>
                <p>
                  <span className="font-medium">قیمت:</span> ۹۹ کرون ‎(حدود ۹.۹ دالر)
                </p>
                <p>
                  <span className="font-medium">نام:</span>{" "}
                  {fullName || "هنوز وارد نشده"}
                </p>
                <p>
                  <span className="font-medium">ایمیل:</span>{" "}
                  {email || "هنوز وارد نشده"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  loading ||
                  loadingBookedSlots ||
                  !selectedDate ||
                  !selectedTime ||
                  !fullName.trim() ||
                  !email.trim() ||
                  !phone.trim()
                }
                className={`mt-6 w-full rounded-full px-6 py-3 text-white transition ${
                  loading ||
                  loadingBookedSlots ||
                  !selectedDate ||
                  !selectedTime ||
                  !fullName.trim() ||
                  !email.trim() ||
                  !phone.trim()
                    ? "cursor-not-allowed bg-neutral-400"
                    : "bg-[#1B75BE] hover:bg-[#0051A2]"
                }`}
              >
                {loading ? "لطفاً صبر کنید..." : "ادامه به پرداخت"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}