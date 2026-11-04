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

async function ocr(canvas, Tesseract) {
  // English + Arabic script. Sorani ("ckb") language data is not confirmed here, so it is not loaded.
  const worker = await Tesseract.createWorker("eng+ara");
  try {
    const { data } = await worker.recognize(canvas);
    return data && data.text ? data.text : "";
  } finally {
    await worker.terminate();
  }
}

// front / back: cleaned card canvases (back may be null). Returns the fields the check form uses.
export async function readCardLocal(front, back) {
  const Tesseract = await loadTesseract();
  const frontText = await ocr(front, Tesseract);
  const backText = back ? await ocr(back, Tesseract) : "";
  const fields = parseCardText(`${frontText}\n${backText}`);
  return { ...fields, _found: foundCount(fields) };
}
