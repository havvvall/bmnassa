// How a business page looks (Edit my page → Style). Shared by the editor and the public page.
import { photoUrl } from "./api.js";

export const MAIN_COLOURS = ["#3a3e42", "#121212", "#1b2a4a", "#1f3d2b", "#5a1a26", "#0f5c5c", "#b5532f", "#3f2a5c"];
export const BG_COLOURS = ["#ffffff", "#f4f1ea", "#eceef1", "#e6eef7", "#e8f2ea", "#f6e8ea", "#3a3e42", "#121212"];
const RADIUS = { rounded: "16px", square: "6px", pill: "999px" };

const hex = (v, d) => (/^#[0-9a-f]{6}$/i.test(v || "") ? v : d);

export function pageSettings(b) {
  const p = (b && b.page_style) || {};
  return {
    layout: p.layout === "grid" ? "grid" : "centred",
    main: hex(p.main, "#e0a614"),
    bg: hex(p.bg, ""),
    bg_path: p.bg_path || "",
    buttons: RADIUS[p.buttons] ? p.buttons : "pill",
    same: !!p.same,
  };
}

// Is a colour dark enough to need white text on it?
export function isDark(c) {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(c || "");
  if (!m) return false;
  const [r, g, b] = [m[1], m[2], m[3]].map((x) => parseInt(x, 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
}

// CSS variables and classes for the page; the card colour is used when the owner chose "same as my card"
export function pageLook(ps, cardColour) {
  const main = ps.same && cardColour ? cardColour : ps.main;
  const style = {
    "--pg-main": main,
    "--pg-on-main": isDark(main) ? "#ffffff" : "#15171a",
    "--pg-radius": RADIUS[ps.buttons],
  };
  if (ps.bg) style["--pg-bg"] = ps.bg;
  const bgImage = ps.bg_path ? `linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,.45)), url(${photoUrl(ps.bg_path)})` : null;
  const dark = !!ps.bg_path || (ps.bg && isDark(ps.bg));
  return { style, bgImage, cls: "pg pgl-" + ps.layout + (dark ? " pg-dark" : "") };
}
