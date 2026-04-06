// lib/calendar.ts
import { google } from "googleapis";

const CALENDAR_TIME_ZONE = "Europe/Stockholm";

function getCalendarAuth() {
  return new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

export function getCalendarClient() {
  const auth = getCalendarAuth();
  return google.calendar({ version: "v3", auth });
}

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getSlotStartEnd(date: string, timeRange: string) {
  const [startTime] = timeRange.split(" - ");
  const [hours, minutes] = startTime.split(":").map(Number);

  const start = new Date(`${date}T00:00:00`);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 20);

  return { start, end };
}

export function generateTimeSlotsForDate(date: string) {
  const selectedDate = new Date(`${date}T00:00:00`);
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

function overlaps(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
) {
  return aStart < bEnd && aEnd > bStart;
}

export async function getBookedSlotsForDate(date: string) {
  const calendar = getCalendarClient();

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: dayStart.toISOString(),
      timeMax: dayEnd.toISOString(),
      timeZone: CALENDAR_TIME_ZONE,
      items: [{ id: process.env.GOOGLE_CALENDAR_ID as string }],
    },
  });

  const busy =
    response.data.calendars?.[process.env.GOOGLE_CALENDAR_ID as string]?.busy ||
    [];

  const allSlots = generateTimeSlotsForDate(date);

  const bookedSlots = allSlots.filter((slot) => {
    const { start, end } = getSlotStartEnd(date, slot);

    return busy.some((busyItem) => {
      if (!busyItem.start || !busyItem.end) return false;
      const busyStart = new Date(busyItem.start);
      const busyEnd = new Date(busyItem.end);
      return overlaps(start, end, busyStart, busyEnd);
    });
  });

  return bookedSlots;
}

export async function isSlotBooked(date: string, time: string) {
  const bookedSlots = await getBookedSlotsForDate(date);
  return bookedSlots.includes(time);
}