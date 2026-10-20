// Working hours: stored as {"sat": ["09:00", "18:00"], "fri": null, ...}; missing day = closed.
// The week starts on Saturday, as in Iraq. "Open now" uses Baghdad time wherever the phone is.

export const DAYS = ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];

const NAMES = {
  en: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  ku: ["شەممە", "یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی"],
  ar: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
};
const WORDS = {
  en: { to: "to", closed: "Closed", openUntil: "Open until {t}", closedOpens: "Closed · opens {t}", closedToday: "Closed today", allDay: "Open 24 hours" },
  ku: { to: "تا", closed: "داخراوە", openUntil: "کراوەیە تا {t}", closedOpens: "داخراوە · {t} دەکرێتەوە", closedToday: "ئەمڕۆ داخراوە", allDay: "24 کاتژمێر کراوەیە" },
  ar: { to: "إلى", closed: "مغلق", openUntil: "مفتوح حتى {t}", closedOpens: "مغلق · يفتح {t}", closedToday: "مغلق اليوم", allDay: "مفتوح 24 ساعة" },
};

export const dayName = (lang, i) => (NAMES[lang] || NAMES.en)[i];
const w = (lang) => WORDS[lang] || WORDS.en;
const short = (t) => String(t || "").replace(/^0(\d)/, "$1");
const span = (h) => (h ? h[0] + "-" + h[1] : "x");

export function hasHours(hours) {
  return !!hours && DAYS.some((d) => Array.isArray(hours[d]));
}

// "Sat to Thu · 9:00 to 18:00", "Fri · Closed"
export function hoursLines(hours, lang) {
  if (!hasHours(hours)) return [];
  const W = w(lang);
  const lines = [];
  let i = 0;
  while (i < 7) {
    let j = i;
    while (j + 1 < 7 && span(hours[DAYS[j + 1]]) === span(hours[DAYS[i]])) j++;
    const days = i === j ? dayName(lang, i) : `${dayName(lang, i)} ${W.to} ${dayName(lang, j)}`;
    const h = hours[DAYS[i]];
    const time = !h ? W.closed : h[0] === "00:00" && h[1] === "24:00" ? W.allDay : `${short(h[0])} ${W.to} ${short(h[1])}`;
    lines.push(`${days} · ${time}`);
    i = j + 1;
  }
  return lines;
}

function baghdadNow() {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baghdad", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(new Date());
  const get = (t) => (parts.find((p) => p.type === t) || {}).value;
  const wd = { Sat: 0, Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6 }[get("weekday")];
  return { day: wd, time: `${get("hour")}:${get("minute")}`.replace(/^24/, "00") };
}

// { open: true, text: "Open until 18:00" } or { open: false, text: "Closed · opens 9:00" }; null when no hours were given
export function openState(hours, lang) {
  if (!hasHours(hours)) return null;
  const W = w(lang);
  const { day, time } = baghdadNow();
  const today = hours[DAYS[day]];
  if (today && time >= today[0] && time < today[1]) {
    return { open: true, text: today[1] === "24:00" ? W.allDay : W.openUntil.replace("{t}", short(today[1])) };
  }
  if (today && time < today[0]) return { open: false, text: W.closedOpens.replace("{t}", short(today[0])) };
  for (let k = 1; k <= 7; k++) {
    const d = (day + k) % 7;
    const h = hours[DAYS[d]];
    if (h) return { open: false, text: k === 1 ? W.closedOpens.replace("{t}", short(h[0])) : `${W.closed} · ${dayName(lang, d)} ${short(h[0])}` };
  }
  return { open: false, text: W.closedToday };
}

// Which day it is in Baghdad (0 = Saturday … 6 = Friday)
export function todayIndex() {
  return baghdadNow().day;
}

// "9:00 to 18:00" for today, or "Closed today"; null when no hours were given
export function todayHours(hours, lang) {
  if (!hasHours(hours)) return null;
  const W = w(lang);
  const h = hours[DAYS[baghdadNow().day]];
  if (!h) return W.closedToday;
  if (h[0] === "00:00" && h[1] === "24:00") return W.allDay;
  return `${short(h[0])} ${W.to} ${short(h[1])}`;
}
