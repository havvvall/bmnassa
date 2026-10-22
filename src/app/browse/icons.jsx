// Line icons for categories and buttons (24 × 24, drawn with the current text colour).
import React from "react";

const P = {
  // categories (names match categories.icon in the database)
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3.5 17.3a1.8 1.8 0 0 0 2.5 2.5l5.8-5.8a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.1-.4-.4-2.1z" />,
  drop: <path d="M12 3.5s-6 6.6-6 10.6a6 6 0 0 0 12 0c0-4-6-10.6-6-10.6z" />,
  bolt: <path d="M13 2 4.5 13.5H12L11 22l8.5-11.5H12z" />,
  hammer: <><path d="m14 7 3 3" /><path d="M5 20 15.5 9.5" /><path d="M12.5 4.5 15 2l7 7-2.5 2.5-2-2-1.5 1.5-4-4L13.5 5z" /></>,
  ruler: <><path d="M3 17 17 3l4 4L7 21z" /><path d="m7 13 2 2M10 10l2 2M13 7l2 2" /></>,
  building: <><path d="M5 21V4h10v17" /><path d="M15 9h4v12" /><path d="M8 8h1M11 8h1M8 12h1M11 12h1M8 16h1M11 16h1M3 21h18" /></>,
  sofa: <><path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3" /><path d="M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z" /><path d="M5 18v2M19 18v2" /></>,
  brush: <><path d="M4 4h12v5H4z" /><path d="M16 6.5h3v5h-7V15" /><path d="M10.5 15h3v6h-3z" /></>,
  wind: <><path d="M12 3v18" /><path d="m8.5 5.5 3.5 3 3.5-3M8.5 18.5l3.5-3 3.5 3" /><path d="M4.2 7.5 19.8 16.5M4.2 16.5l15.6-9" /><path d="m4 11.2 3.2 1.8-3.2 1.8M20 12.8 16.8 11l3.2-1.8" /></>,
  sparkles: <><path d="M10 3.5 11.8 8 16.5 10l-4.7 2-1.8 4.5L8.2 12 3.5 10l4.7-2z" /><path d="M18 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" /></>,
  sparkle: <><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z" /><path d="M19 17v4M17 19h4" /></>,
  truck: <><path d="M2.5 6h11v10h-11z" /><path d="M13.5 9.5h4l3 3.5V16h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  car: <><path d="M4 16v-3.5L6 7.5a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 7.5l2 5V16z" /><path d="M4 12.5h16" /><path d="M6 16v2.5M18 16v2.5" /><circle cx="8" cy="14.3" r=".6" /><circle cx="16" cy="14.3" r=".6" /></>,
  camera: <><path d="M3 8h4l2-2.5h6L17 8h4v11H3z" /><circle cx="12" cy="13" r="3.5" /></>,
  thread: <><path d="M7 3h10M7 21h10" /><path d="M8 3c0 6 8 6 8 9s-8 3-8 9M16 3c0 6-8 6-8 9s8 3 8 9" /></>,
  cake: <><path d="M4 21v-8h16v8" /><path d="M4 16.5c2 1.5 4 1.5 5.3 0 1.4-1.5 4-1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0" /><path d="M8 13V9.5M12 13V9.5M16 13V9.5" /><path d="M8 6.5v.5M12 6v.5M16 6.5v.5M3 21h18" /></>,
  utensils: <><path d="M6 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M8 3v18" /><path d="M17 21V3c-2 1.5-3 4.5-3 8h3" /></>,
  scissors: <><circle cx="6" cy="6.5" r="2.7" /><circle cx="6" cy="17.5" r="2.7" /><path d="M8.2 8.2 20 19M8.2 15.8 20 5" /></>,
  scale: <><path d="M12 3v18M7 21h10M5 7h14" /><path d="M5 7 2.5 13a3 3 0 0 0 5 0zM19 7l-2.5 6a3 3 0 0 0 5 0z" /></>,
  calculator: <><rect x="5" y="2.5" width="14" height="19" rx="2" /><path d="M8 6.5h8v3H8z" /><path d="M8.5 13h.01M12 13h.01M15.5 13h.01M8.5 16.5h.01M12 16.5h.01M15.5 16.5h.01" strokeWidth="2.4" /></>,
  key: <><circle cx="8" cy="15" r="4.5" /><path d="m11.2 11.8 9-9M17 6l2.5 2.5M14.5 8.5 16.5 10.5" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M8.5 20h7M12 16v4" /></>,
  confetti: <><path d="M4 20 8.5 7.5l8 8z" /><path d="M14 3c0 2-1 3-3 3M21 10c-2 0-3 1-3 3M17 3.5v.01M20.5 7v.01M19 15.5v.01" strokeWidth="2" /></>,
  flame: <path d="M12 21.5c-3.6 0-6.2-2.6-6.2-6 0-4.2 4.2-6.6 4.6-11 3 1.8 4.4 4.6 4.6 7.3.9-.6 1.5-1.6 1.6-2.8 1.3 1.6 1.6 3.4 1.6 4.8 0 4.2-2.6 7.7-6.2 7.7z" />,
  spark: <><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8" /></>,
  plus: <><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M12 8.5v7M8.5 12h7" /></>,
  helmet: <><path d="M4 16a8 8 0 0 1 16 0" /><path d="M2.5 16h19v2.5h-19z" /><path d="M10 8.5V6h4v2.5" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>,

  // interface
  more: <><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></>,
  trash: <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  chevron: <path d="m9 5 7 7-7 7" />,
  back: <path d="m15 5-7 7 7 7" />,
  down: <path d="m6 9 6 6 6-6" />,
  up: <path d="m6 15 6-6 6 6" />,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  whatsapp: <><path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-1 .8c-1.1-.5-1.8-1.2-2.3-2.3l.8-1-1-1.9z" strokeWidth="1.4" /></>,
  share: <><path d="M12 15V3M7.5 7.5 12 3l4.5 4.5" /><path d="M5 12v7.5h14V12" /></>,
  flip: <><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8" /><path d="M4 3.5V8h4.5" /><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16" /><path d="M20 20.5V16h-4.5" /></>,
  copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></>,
  contact: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M19 8v6M16 11h6" /></>,
  home: <><path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 9v11.5h13V9" /><path d="M10 20.5V15h4v5.5" /></>,
  wallet: <><rect x="3" y="6" width="18" height="14" rx="2.5" /><path d="M3 10h18M16 15h1.5" /><path d="M6 6V5a1.5 1.5 0 0 1 1.8-1.5l9 1.8A1.5 1.5 0 0 1 18 6.8V6" /></>,
  scan: <><path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" /><path d="M7 9h10M7 12h10M7 15h6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  tiles4: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  tiles9: <><path d="M5 5h3v3H5zM10.5 5h3v3h-3zM16 5h3v3h-3zM5 10.5h3v3H5zM10.5 10.5h3v3h-3zM16 10.5h3v3h-3zM5 16h3v3H5zM10.5 16h3v3h-3zM16 16h3v3h-3z" /></>,
  rows: <path d="M4 6h16M4 12h16M4 18h16" />,
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  chat: <path d="M4 5h16v11H9l-5 4z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" strokeWidth="2.6" /></>,
  facebook: <path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.6-1.5H17V4.4a20 20 0 0 0-2.3-.1C12.4 4.3 11 5.7 11 8.2v2.3H8.4v3H11V21" />,
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.1 4.3 5 4.6" />,
  snapchat: <path d="M12 3.5c-3 0-4.8 2.2-4.8 5v2.2l-1.9.5c-.5.2-.4.8 0 1l1.6.7c-.6 1.6-1.8 2.9-3.4 3.6.4.7 1.7 1 2.6 1.1.2.6.3 1.3.9 1.3.8 0 1.6-.4 2.6.1 1 .5 1.5 1.5 2.4 1.5s1.4-1 2.4-1.5c1-.5 1.8-.1 2.6-.1.6 0 .7-.7.9-1.3.9-.1 2.2-.4 2.6-1.1-1.6-.7-2.8-2-3.4-3.6l1.6-.7c.4-.2.5-.8 0-1l-1.9-.5V8.5c0-2.8-1.8-5-4.8-5z" />,
  viber: <><path d="M12 3c4.6 0 8 2.6 8 7.3 0 4.8-3.4 7.3-8 7.3-.8 0-1.5 0-2.2-.2L6.8 20.5v-3.3C4.9 16 4 13.6 4 10.3 4 5.6 7.4 3 12 3z" /><path d="M9.6 7.6c-.5.3-.8.9-.6 1.6.7 2.2 2.2 3.8 4.4 4.6.7.2 1.3-.1 1.6-.6l-1.4-1.2-.9.6c-.9-.4-1.6-1.1-2-2l.6-.9z" /><path d="M13 6.8c1.6.2 2.7 1.3 2.9 2.9M13 8.6c.6.1 1 .5 1.1 1.1" /></>,
  telegram: <><path d="M20.5 4 3.5 10.8l5.6 2 2.1 6.2 3.2-3.8 4.4 3.3z" /><path d="m9.1 12.8 8.4-6.3-6.3 8.6" /></>,
  x: <path d="M4 4h4.6L20 20h-4.6zM19.6 4l-6.4 7M4.4 20l6.4-7" />,
  threads: <path d="M9.6 10.4C10.2 9.3 11.2 8.8 12.3 8.8c1.6 0 2.6 1 2.6 3v1.2c0 1.5-1.1 2.4-2.8 2.4-1.6 0-2.6-.8-2.6-1.9s1.1-1.9 2.7-1.9c2.9 0 5.4 1 5.4 3.4 0 2.5-2.4 4.2-5.6 4.2-4.1 0-6.6-3-6.6-7.6s2.5-7.6 6.6-7.6c2.6 0 4.5 1.4 5.3 4.1" />,
  linkedin: <><rect x="3.5" y="3.5" width="17" height="17" rx="3" /><path d="M8 10.5V17M8 7.5v.01M12 17v-6.5M12 13.5c0-2 1.2-3 2.6-3 1.5 0 2.4 1 2.4 2.8V17" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3z" /></>,
  route: <><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" /></>,
  nfc: <><path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" /><circle cx="5" cy="12" r="1" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.2 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 0 0 4-4C21 6.5 17 3 12 3z" /><circle cx="7.5" cy="11" r="1.2" /><circle cx="10.5" cy="7" r="1.2" /><circle cx="15" cy="7.5" r="1.2" /></>,
  image: <><rect x="3" y="4" width="18" height="16" rx="2.5" /><circle cx="8.5" cy="9.5" r="1.8" /><path d="m21 16-5-5-9 9" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  star: <path d="m12 3 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z" />,
};

// Category ids from today's app, and a few likely names, get a fitting icon even without categories.icon
const BY_ID = {
  plumbing: "drop", electrical: "bolt", carpentry: "hammer", "civil-eng": "helmet", architecture: "building", interior: "sofa",
  painting: "brush", hvac: "wind", cleaning: "sparkles", moving: "truck", mechanics: "car", carwash: "drop", photography: "camera",
  tailoring: "thread", bakery: "cake", catering: "utensils", beauty: "sparkle", barber: "scissors", legal: "scale",
  accounting: "calculator", realestate: "key", "it-repair": "monitor", events: "confetti", metalwork: "flame", welding: "spark",
  pharmacy: "plus",
};

export function categoryIcon(cat) {
  if (!cat) return "grid";
  if (cat.icon && P[cat.icon] && cat.icon !== "grid") return cat.icon;
  return BY_ID[cat.id] || (cat.icon && P[cat.icon] ? cat.icon : "grid");
}

export function Icon({ name, size = 22, stroke = 1.8, className, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>
      {P[name] || P.grid}
    </svg>
  );
}
