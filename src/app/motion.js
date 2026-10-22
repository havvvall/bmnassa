// Motion helpers. Timings come from the design system tokens in app.css,
// and every effect has a calm version when the phone asks for reduced motion.
export const calm = () => !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
export const ms = (name, fallback) => parseFloat(token(name)) || fallback;
export const ease = (name) => token(name) || "ease";

// A short vibration on Android (iPhones don't allow it from a web page): 10 ms for a tap, 20 ms for a save
export function haptic(ms = 10) {
  if (calm() || !navigator.vibrate) return;
  try { navigator.vibrate(ms); } catch { /* not allowed */ }
}

// Turn an element over like a card: rotate to edge-on, swap the face, rotate back in.
// swap() changes what is shown; done() runs when the turn ends.
export function flipCard(el, { dir, shine, swap, done }) {
  const finish = () => done && done();
  if (!el || !el.animate) { swap(); finish(); return; }
  if (calm()) {
    const out = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 90, fill: "forwards" });
    out.onfinish = () => {
      swap();
      requestAnimationFrame(() => { out.cancel(); el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 90 }).onfinish = finish; });
    };
    return;
  }
  const half = Math.max(200, ms("--duration-slow", 420) / 2 + 30);
  // a swipe passes the finger's direction (the card follows the finger in every language);
  // a button passes nothing, and the card turns the way the page reads
  const sign = dir === 1 || dir === -1 ? dir : (document.documentElement.dir === "rtl" ? -1 : 1);
  const P = "perspective(1000px)";
  const out = el.animate(
    [{ transform: `${P} rotateY(0deg) scale(1)` }, { transform: `${P} rotateY(${90 * sign}deg) scale(0.92)` }],
    { duration: half, easing: "cubic-bezier(0.4, 0, 1, 1)", fill: "forwards" });
  if (shine && shine.animate) {
    shine.animate(
      [{ transform: "translateX(-110%)", opacity: 0 }, { opacity: 1, offset: 0.45 }, { opacity: 1, offset: 0.55 }, { transform: "translateX(110%)", opacity: 0 }],
      { duration: half * 2, easing: "linear" });
  }
  out.onfinish = () => {
    swap();
    requestAnimationFrame(() => {
      out.cancel();
      const inn = el.animate(
        [{ transform: `${P} rotateY(${-90 * sign}deg) scale(0.92)` }, { transform: `${P} rotateY(0deg) scale(1)` }],
        { duration: half, easing: "cubic-bezier(0, 0, 0.2, 1)" });
      inn.onfinish = inn.oncancel = finish;
    });
  };
}
