// Reads a card on the phone without AI: OCR (Tesseract, loaded from a CDN when first needed),
// then the rules in parseCard.js turn the text into the form fields.
// Status: written but NOT tested against real cards or a real phone yet.
import { parseCardText, foundCount } from "./parseCard.js";

const TESS_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
let tessPromise = null;

function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (!tessPromise) {
    tessPromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = TESS_URL;
      s.async = true;
      s.onload = () => (window.Tesseract ? resolve(window.Tesseract) : reject(new Error("tesseract missing")));
      s.onerror = () => { tessPromise = null; reject(new Error("tesseract load failed")); };
      document.head.appendChild(s);
    });
  }
  return tessPromise;
}

// Greyscale, stretch the contrast and double the size, so small print and the QR side read better.
// Done by hand (not ctx.filter), because older iPhone Safari ignores ctx.filter.
function prepare(canvas) {
  const scale = 2;
  const out = document.createElement("canvas");
  out.width = canvas.width * scale;
  out.height = canvas.height * scale;
  const ctx = out.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(canvas, 0, 0, out.width, out.height);
  const img = ctx.getImageData(0, 0, out.width, out.height);
  const d = img.data;
  let lo = 255, hi = 0;
  for (let i = 0; i < d.length; i += 4) {
    const g = 0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = g;
    if (g < lo) lo = g;
    if (g > hi) hi = g;
  }
  const span = Math.max(1, hi - lo);
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.min(255, Math.max(0, ((d[i] - lo) / span) * 255));
    d[i] = d[i + 1] = d[i + 2] = v;
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

// English and Arabic only. Sorani data is not loaded: a failed download delays every scan.
function makeWorker(Tesseract) {
  return Tesseract.createWorker("eng+ara");
}

// front / back: cleaned card canvases (back may be null). Returns the fields the check form uses,
// plus _raw (the text the phone read) and _found (how many fields were filled).
export async function readCardLocal(front, back) {
  const Tesseract = await loadTesseract();
  const worker = await makeWorker(Tesseract);
  try {
    const f = await worker.recognize(prepare(front));
    const b = back ? await worker.recognize(prepare(back)) : null;
    const frontText = f && f.data && f.data.text ? f.data.text : "";
    const backText = b && b.data && b.data.text ? b.data.text : "";
    const raw = `${frontText}\n${backText}`.trim();
    const fields = parseCardText(raw);
    return { ...fields, _raw: raw, _found: foundCount(fields) };
  } finally {
    await worker.terminate();
  }
}
