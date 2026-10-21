// Theme: Auto (follows the phone), Bmnassa (silver) or Dark. (Light was folded into Silver.)
// Auto uses Bmnassa in daytime mode and Dark when the phone is in dark mode.
export const THEMES = ["auto", "bmnassa", "dark"];
const BAR = { bmnassa: "#dfe2e6", light: "#f2f2f7", dark: "#000000" };
const media = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null);

export function getThemeChoice() {
  try {
    let v = localStorage.getItem("bm_theme");
    // people who had picked Light now get Silver, the app's light look
    if (v === "light") { v = "bmnassa"; localStorage.setItem("bm_theme", v); }
    return THEMES.includes(v) ? v : "auto";
  } catch { return "auto"; }
}
export function resolveTheme(choice = getThemeChoice()) {
  if (choice !== "auto") return choice;
  const m = media();
  return m && m.matches ? "dark" : "bmnassa";
}
export function themeBar() { return BAR[resolveTheme()] || BAR.bmnassa; }

export function applyTheme(choice = getThemeChoice()) {
  const th = resolveTheme(choice);
  document.documentElement.setAttribute("data-theme", th);
  // the card screen sets its own bar colour while it is open
  if (!document.documentElement.hasAttribute("data-bar-locked")) {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BAR[th]);
  }
  return th;
}
export function setThemeChoice(choice) {
  try { localStorage.setItem("bm_theme", choice); } catch { /* still applies now */ }
  return applyTheme(choice);
}
// follow the phone while on Auto
const m = media();
if (m) {
  const on = () => { if (getThemeChoice() === "auto") applyTheme("auto"); };
  m.addEventListener ? m.addEventListener("change", on) : m.addListener && m.addListener(on);
}
