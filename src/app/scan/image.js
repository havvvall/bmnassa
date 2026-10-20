// Photo cleanup for scanned cards, done on the phone: straighten and crop to the card,
// fix light and colour, sharpen. It never changes what is printed on the card.

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("not an image"));
    img.src = src;
  });
}

// Any image, video frame or canvas → a canvas no longer than `max` on its long side
export function toCanvas(source, max = 1600, crop) {
  const sw = source.videoWidth || source.naturalWidth || source.width;
  const sh = source.videoHeight || source.naturalHeight || source.height;
  const c0 = crop || { x: 0, y: 0, w: sw, h: sh };
  const k = Math.min(1, max / Math.max(c0.w, c0.h));
  const c = document.createElement("canvas");
  c.width = Math.round(c0.w * k);
  c.height = Math.round(c0.h * k);
  c.getContext("2d").drawImage(source, c0.x, c0.y, c0.w, c0.h, 0, 0, c.width, c.height);
  return c;
}

export async function fileToCanvas(file, max = 1600) {
  const url = URL.createObjectURL(file);
  try { return toCanvas(await loadImage(url), max); } finally { URL.revokeObjectURL(url); }
}

export function toBlob(canvas, q = 0.86) {
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("no image"))), "image/jpeg", q));
}

export function toBase64(canvas, max = 1280, q = 0.8) {
  const c = Math.max(canvas.width, canvas.height) > max ? toCanvas(canvas, max) : canvas;
  return c.toDataURL("image/jpeg", q).split(",")[1];
}

// ---- straighten: map the card's four corners onto a flat rectangle ----

function solve(A, b) {
  const n = b.length;
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]];
    if (Math.abs(A[i][i]) < 1e-12) return null;
    for (let r = i + 1; r < n; r++) {
      const f = A[r][i] / A[i][i];
      for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c];
    x[i] = s / A[i][i];
  }
  return x;
}

// Homography taking points `from` to points `to` (4 pairs)
function homography(from, to) {
  const A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = from[i], [u, v] = to[i];
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
  }
  const h = solve(A, b);
  return h && [...h, 1];
}

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// corners: [[x,y] ×4] as fractions (top-left, top-right, bottom-right, bottom-left). Returns null if they make no sense.
export function straighten(src, corners) {
  if (!corners || corners.length !== 4) return null;
  const W = src.width, H = src.height;
  const q = corners.map(([x, y]) => [Math.min(1, Math.max(0, x)) * W, Math.min(1, Math.max(0, y)) * H]);
  const top = dist(q[0], q[1]), bottom = dist(q[3], q[2]), left = dist(q[0], q[3]), right = dist(q[1], q[2]);
  const w = (top + bottom) / 2, h = (left + right) / 2;
  if (w < W * 0.2 || h < H * 0.15) return null; // too small: probably a wrong guess
  // standard card shape (85.6 × 54 mm), landscape or portrait as photographed
  const landscape = w >= h;
  const ow = landscape ? 1200 : 757, oh = landscape ? 757 : 1200;
  const m = homography([[0, 0], [ow, 0], [ow, oh], [0, oh]], q);
  if (!m) return null;
  const sctx = src.getContext("2d");
  const sd = sctx.getImageData(0, 0, W, H).data;
  const out = document.createElement("canvas");
  out.width = ow; out.height = oh;
  const octx = out.getContext("2d");
  const od = octx.createImageData(ow, oh);
  const o = od.data;
  for (let y = 0; y < oh; y++) {
    for (let x = 0; x < ow; x++) {
      const d = m[6] * x + m[7] * y + 1;
      const sx = (m[0] * x + m[1] * y + m[2]) / d;
      const sy = (m[3] * x + m[4] * y + m[5]) / d;
      const x0 = Math.floor(sx), y0 = Math.floor(sy);
      const i = (y * ow + x) * 4;
      if (x0 < 0 || y0 < 0 || x0 >= W - 1 || y0 >= H - 1) { o[i] = o[i + 1] = o[i + 2] = 255; o[i + 3] = 255; continue; }
      const fx = sx - x0, fy = sy - y0;
      const a = (y0 * W + x0) * 4, bb = a + 4, c = a + W * 4, dd = c + 4;
      for (let k = 0; k < 3; k++) {
        o[i + k] = (sd[a + k] * (1 - fx) + sd[bb + k] * fx) * (1 - fy) + (sd[c + k] * (1 - fx) + sd[dd + k] * fx) * fy;
      }
      o[i + 3] = 255;
    }
  }
  octx.putImageData(od, 0, 0);
  return out;
}

// ---- fix light and colour, then sharpen ----

function percentile(hist, total, p) {
  let n = 0;
  for (let v = 0; v < 256; v++) { n += hist[v]; if (n >= total * p) return v; }
  return 255;
}

export function enhance(src) {
  const W = src.width, H = src.height;
  const out = document.createElement("canvas");
  out.width = W; out.height = H;
  const ctx = out.getContext("2d");
  ctx.drawImage(src, 0, 0);
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  const hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  const lum = new Uint32Array(256);
  const total = W * H;
  for (let i = 0; i < d.length; i += 4) {
    hist[0][d[i]]++; hist[1][d[i + 1]]++; hist[2][d[i + 2]]++;
    lum[(d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114) | 0]++;
  }
  // One brightness stretch for all colours (darkest 1% → black, brightest 2% → white),
  // plus a gentle white balance that removes yellow light without repainting a coloured card
  // limits keep a dark or brightly coloured card its own colour: only real shadows become black, only near-white becomes white
  const lo = Math.min(40, percentile(lum, total, 0.01));
  const hi = Math.max(200, percentile(lum, total, 0.98));
  const gain = 255 / (hi - lo);
  const wb = hist.map((h) => Math.min(1.18, Math.max(0.88, percentile(lum, total, 0.98) / Math.max(1, percentile(h, total, 0.98)))));
  const lut = [0, 1, 2].map((k) => {
    const t = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) t[v] = (v * wb[k] - lo) * gain;
    return t;
  });
  for (let i = 0; i < d.length; i += 4) { d[i] = lut[0][d[i]]; d[i + 1] = lut[1][d[i + 1]]; d[i + 2] = lut[2][d[i + 2]]; }
  // Gentle sharpen (unsharp mask with a 3×3 blur) for clear text and logos
  const s = new Uint8ClampedArray(d);
  const amt = 0.55;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const i = (y * W + x) * 4;
      for (let k = 0; k < 3; k++) {
        const blur = (s[i - W * 4 - 4 + k] + s[i - W * 4 + k] + s[i - W * 4 + 4 + k] + s[i - 4 + k] + s[i + k] + s[i + 4 + k]
          + s[i + W * 4 - 4 + k] + s[i + W * 4 + k] + s[i + W * 4 + 4 + k]) / 9;
        d[i + k] = s[i + k] + (s[i + k] - blur) * amt;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

// Both steps: straighten when the corners are good, then fix light and sharpen
export function cleanCard(src, corners) {
  const flat = straighten(src, corners);
  return { canvas: enhance(flat || src), straightened: !!flat };
}
