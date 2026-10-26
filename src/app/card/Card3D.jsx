// The digital card as a real 3D object (WebGL): a thick card with a rounded, bevelled edge, lit by three
// lights, that tilts with the mouse or the phone and turns over in 3D. Its faces are painted from the same
// data as NfcCard (colour, logo, name, title, icons, QR), and the icons stay real links laid over the drawing.
// Where WebGL is not available, the caller shows the flat NfcCard instead (see canUse3D).
import React, { useEffect, useMemo, useRef, useState } from "react";
import { pick } from "../i18n.js";
import { photoUrl } from "../api.js";
import { ICON_SHAPES } from "../browse/icons.jsx";
import { QRCode, QRErrorCorrectLevel } from "../vendor/qrcode.js";
import { A, cardLinks, cardPerson, cardRole } from "./CardFaces.jsx";
import { t } from "../i18n.js";

let support = null;
export function canUse3D() {
  if (support !== null) return support;
  try {
    const c = document.createElement("canvas");
    support = !!(window.WebGLRenderingContext && c.getContext("webgl"));
  } catch (e) { support = false; }
  return support;
}

// ---------- matrices (column-major) ----------
const m4 = (a, b) => { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; };
const rotX = (d) => { const t = d * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; };
const rotY = (d) => { const t = d * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; };
const move = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];

// ---------- the card's shape: two faces and a half-round rim ----------
function geometry(W, H, R, depth) {
  const r = depth / 2, seg = 10, K = 8, out = [], pts = [];
  [[W / 2 - R, H / 2 - R, 0], [-(W / 2 - R), H / 2 - R, 90], [-(W / 2 - R), -(H / 2 - R), 180], [W / 2 - R, -(H / 2 - R), 270]].forEach((q) => {
    for (let s = 0; s <= seg; s++) { const a = (q[2] + 90 * s / seg) * Math.PI / 180; pts.push([q[0] + R * Math.cos(a), q[1] + R * Math.sin(a), Math.cos(a), Math.sin(a)]); }
  });
  const v = (x, y, z, nx, ny, nz, u, w, m) => { out.push(x, y, z, nx, ny, nz, u, w, m); };
  const N = pts.length;
  for (let i = 0; i < N; i++) {
    const a = pts[i], b = pts[(i + 1) % N];
    v(0, 0, r, 0, 0, 1, 0.5, 0.5, 0); v(a[0], a[1], r, 0, 0, 1, (a[0] + W / 2) / W, (H / 2 - a[1]) / H, 0); v(b[0], b[1], r, 0, 0, 1, (b[0] + W / 2) / W, (H / 2 - b[1]) / H, 0);
    // the back is read after turning the card around its upright axis, so it is mirrored left to right
    v(0, 0, -r, 0, 0, -1, 0.5, 0.5, 1); v(b[0], b[1], -r, 0, 0, -1, (W / 2 - b[0]) / W, (H / 2 - b[1]) / H, 1); v(a[0], a[1], -r, 0, 0, -1, (W / 2 - a[0]) / W, (H / 2 - a[1]) / H, 1);
    const P = (p, th) => [p[0] + p[2] * r * 0.5 * Math.sin(th), p[1] + p[3] * r * 0.5 * Math.sin(th), r * Math.cos(th), p[2] * Math.sin(th), p[3] * Math.sin(th), Math.cos(th)];
    for (let k = 0; k < K; k++) {
      const t0 = Math.PI * k / K, t1 = Math.PI * (k + 1) / K;
      const A0 = P(a, t0), A1 = P(a, t1), B0 = P(b, t0), B1 = P(b, t1);
      [A0, B1, B0, A0, A1, B1].forEach((q) => v(q[0], q[1], q[2], q[3], q[4], q[5], 0, 0, 2));
    }
  }
  return new Float32Array(out);
}

const VS = "attribute vec3 aP;attribute vec3 aN;attribute vec2 aUv;attribute float aM;uniform mat4 uP;uniform mat4 uM;uniform float uD;varying vec3 vN;varying vec3 vW;varying vec2 vUv;varying float vM;" +
  "void main(){vec4 w=uM*vec4(aP,1.0);vW=w.xyz;vN=(uM*vec4(aN,0.0)).xyz;vUv=aUv;vM=aM;gl_Position=uP*vec4(w.x,w.y,w.z-uD,1.0);}";
const FS = "precision highp float;uniform sampler2D tF;uniform sampler2D tB;uniform vec3 uEdge;uniform float uD;varying vec3 vN;varying vec3 vW;varying vec2 vUv;varying float vM;" +
  "vec3 lin(vec3 c){return pow(c,vec3(2.2));}" +
  "void main(){vec3 base=vM<0.5?lin(texture2D(tF,vUv).rgb):(vM<1.5?lin(texture2D(tB,vUv).rgb):lin(uEdge));" +
  "vec3 N=normalize(vN);vec3 V=normalize(vec3(0.0,0.0,uD)-vW);" +
  "vec3 Lk=normalize(vec3(-0.45,0.7,0.75));vec3 Lf=normalize(vec3(0.7,-0.25,0.6));vec3 Lr=normalize(vec3(0.35,-0.45,-0.8));" +
  "float dk=max(dot(N,Lk),0.0);float df=max(dot(N,Lf),0.0);float dr=max(dot(N,Lr),0.0);" +
  "vec3 amb=mix(vec3(0.05,0.045,0.04),vec3(0.26,0.25,0.24),N.y*0.5+0.5);" +
  "vec3 lit=amb+dk*vec3(0.95,0.91,0.84)+df*vec3(0.16,0.18,0.24)+dr*vec3(0.95,0.68,0.22);" +
  "vec3 Hk=normalize(Lk+V);float nh=max(dot(N,Hk),0.0);float sp=pow(nh,90.0)*0.5+pow(nh,14.0)*0.03;" +
  "vec3 Hr=normalize(Lr+V);float spr=pow(max(dot(N,Hr),0.0),40.0)*0.5;" +
  "float fr=pow(1.0-max(dot(N,V),0.0),5.0);vec3 R=reflect(-V,N);" +
  "vec3 env=mix(vec3(0.01),vec3(0.45,0.38,0.24),smoothstep(-0.1,0.9,R.y));" +
  "vec3 c=base*lit+sp*vec3(1.0,0.96,0.88)+spr*vec3(0.96,0.76,0.3)+fr*env*0.55;" +
  "c=c/(1.0+c*0.22)*1.12;gl_FragColor=vec4(pow(c,vec3(1.0/2.2)),1.0);}";

// ---------- colours and drawing helpers ----------
const hexRgb = (h) => { const v = parseInt(String(h || "#1b2a4a").slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
const mix = (c, d, k) => c.map((x, i) => Math.round(x * (1 - k) + d[i] * k));
const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
const ICON_BG = { call: "#2fbf55", wa: "#25d366", fb: "#1877f2", tt: "#111111", em: "#1e88e5", web: "#5f6368", dir: "#e5483b", sc: "#fffc00", vb: "#7360f2", tg: "#229ed9", xx: "#000000", th: "#000000", li: "#0a66c2" };

const images = {};
function loadImage(src, cors) {
  if (!src) return Promise.resolve(null);
  if (images[src]) return images[src];
  images[src] = new Promise((res) => {
    const im = new Image();
    if (cors) im.crossOrigin = "anonymous";
    im.onload = () => res(im);
    im.onerror = () => res(null);
    im.src = src;
  });
  return images[src];
}

function roundRect(x, px, py, w, h, r) {
  x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath();
}

// draws one of the app's line icons (24 × 24 shapes) at x, y in size px
function drawIcon(x, name, px, py, size, colour, stroke = 1.8) {
  const shapes = ICON_SHAPES[name];
  if (!shapes) return;
  x.save(); x.translate(px, py); x.scale(size / 24, size / 24);
  x.strokeStyle = colour; x.fillStyle = colour; x.lineCap = "round"; x.lineJoin = "round";
  const walk = (el) => {
    if (!el) return;
    if (Array.isArray(el)) { el.forEach(walk); return; }
    if (typeof el !== "object") return;
    const p = el.props || {};
    if (el.type === React.Fragment) { walk(p.children); return; }
    x.lineWidth = Number(p.strokeWidth) || stroke;
    if (el.type === "path") x.stroke(new Path2D(p.d));
    else if (el.type === "circle") { x.beginPath(); x.arc(Number(p.cx), Number(p.cy), Number(p.r), 0, Math.PI * 2); if (p.fill && p.fill !== "none") x.fill(); else x.stroke(); }
    else if (el.type === "rect") { roundRect(x, Number(p.x), Number(p.y), Number(p.width), Number(p.height), Number(p.rx) || 0); x.stroke(); }
  };
  walk(shapes);
  x.restore();
}

// wraps text to a width; returns the lines
function wrap(x, text, width, maxLines) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = "";
  words.forEach((w) => { const test = cur ? cur + " " + w : w; if (x.measureText(test).width <= width || !cur) cur = test; else { lines.push(cur); cur = w; } });
  if (cur) lines.push(cur);
  if (lines.length > maxLines) { lines.length = maxLines; lines[maxLines - 1] += "…"; }
  return lines;
}

// where everything sits on the tall card (CSS px); shared by the drawing and the tappable icons
function layout(W, H, nIcons, rtl, wide, logoSize) {
  if (wide) return layoutWide(W, H, nIcons, rtl, logoSize);
  const pad = 24, top = 26, bottom = 24, ic = 46, gap = 10;
  const perRow = Math.max(1, Math.floor((W - pad * 2 + gap) / (ic + gap)));
  const rows = Math.ceil(nIcons / perRow);
  const wordH = 16, wordY = H - bottom - 4 - wordH;
  const iconsBottom = wordY - 22;
  const iconsTop = iconsBottom - (rows * ic + Math.max(0, rows - 1) * gap);
  const icons = [];
  for (let i = 0; i < nIcons; i++) {
    const row = Math.floor(i / perRow), col = i % perRow;
    const xl = pad + col * (ic + gap);
    icons.push({ x: rtl ? W - xl - ic : xl, y: iconsTop + row * (ic + gap), s: ic });
  }
  return { pad, top, logo: { x: rtl ? W - pad - 58 : pad, y: top, s: 58 }, sign: { x: rtl ? pad : W - pad - 26, y: top + 16, s: 26 }, icons, nameBottom: iconsTop - 24, wordY, wordH };
}

// the same card in the wallet's landscape shape: logo and sign on top, name and icons along the bottom
function layoutWide(W, H, nIcons, rtl, logoSize = 44) {
  const pad = 20, top = 18, ic = 30, gap = 8, lg = logoSize;
  const perRow = Math.max(1, Math.floor((W - pad * 2 + gap) / (ic + gap)));
  const rows = Math.ceil(nIcons / perRow);
  const wordH = 10, wordY = H - 12 - wordH;
  const iconsBottom = wordY - 12;
  const iconsTop = iconsBottom - (rows * ic + Math.max(0, rows - 1) * gap);
  const icons = [];
  for (let i = 0; i < nIcons; i++) {
    const row = Math.floor(i / perRow), col = i % perRow;
    const xl = pad + col * (ic + gap);
    icons.push({ x: rtl ? W - xl - ic : xl, y: iconsTop + row * (ic + gap), s: ic });
  }
  return { pad, top, wide: true, logo: { x: rtl ? W - pad - lg : pad, y: top, s: lg }, sign: { x: rtl ? pad : W - pad - 22, y: top + 4, s: 22 }, icons, nameBottom: iconsTop - 10, wordY, wordH };
}

async function paintFaces(G, d) {
  const { W, H, b, s, lang, cat, url, rtl, links, wide, logoSize = 44 } = d;
  const fs = wide ? 22 : 34, lh = wide ? 26 : 40; // name size and line step
  const k = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
  const font = rtl ? "Vazirmatn, Manrope, sans-serif" : "Manrope, sans-serif";
  // wait for the fonts, but never long: a slow network still gets a card
  const soon = (ms) => new Promise((r) => setTimeout(r, ms));
  try { await Promise.race([Promise.all([document.fonts.load(`800 34px ${font}`), document.fonts.load(`800 12px ${font}`)]), soon(1500)]); } catch (e) { /* draw with what we have */ }
  const [mark, word, logo] = await Promise.race([soon(4000).then(() => [null, null, null]), Promise.all([
    loadImage("/brand/mark-ink.svg"), loadImage("/brand/logo-silver.svg"),
    s.logo_path ? loadImage(photoUrl(s.logo_path), true) : Promise.resolve(null),
  ])]);
  const base = hexRgb(s.color);
  const L = layout(W, H, links.length, rtl, wide, logoSize);
  const canvasOf = () => { const c = document.createElement("canvas"); c.width = Math.round(W * k); c.height = Math.round(H * k); const x = c.getContext("2d"); x.scale(k, k); return [c, x]; };
  const ground = (x) => {
    const dx = Math.sin(160 * Math.PI / 180), dy = -Math.cos(160 * Math.PI / 180), len = Math.abs(W * dx) + Math.abs(H * dy);
    const g = x.createLinearGradient(W / 2 - dx * len / 2, H / 2 - dy * len / 2, W / 2 + dx * len / 2, H / 2 + dy * len / 2);
    g.addColorStop(0, css(mix(base, [255, 255, 255], 0.07))); g.addColorStop(0.45, css(base)); g.addColorStop(1, css(mix(base, [0, 0, 0], 0.26)));
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    let q = 11; const rnd = () => { q = (q * 9301 + 49297) % 233280; return q / 233280; };
    for (let i = 0; i < W * H / 14; i++) { x.fillStyle = rnd() > 0.5 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.06)"; x.fillRect(rnd() * W, rnd() * H, 0.7, 0.7); }
    if (mark) {
      const mh = H * 0.78, mw = mh * (mark.naturalWidth / mark.naturalHeight || 0.73);
      const tmp = document.createElement("canvas"); tmp.width = Math.ceil(mw * k); tmp.height = Math.ceil(mh * k);
      const tx = tmp.getContext("2d"); tx.drawImage(mark, 0, 0, tmp.width, tmp.height); tx.globalCompositeOperation = "source-in"; tx.fillStyle = "#fff"; tx.fillRect(0, 0, tmp.width, tmp.height);
      x.save(); x.globalAlpha = 0.06;
      if (rtl) { x.translate(W * 0.14 + mw, H * 0.08); x.scale(-1, 1); x.drawImage(tmp, 0, 0, mw, mh); }
      else x.drawImage(tmp, W + W * 0.14 - mw, H * 0.08, mw, mh);
      x.restore();
    }
  };

  // ----- front -----
  const [fc, fx] = canvasOf();
  ground(fx);
  const lg = L.logo;
  fx.save(); fx.shadowColor = "rgba(0,0,0,0.25)"; fx.shadowBlur = 8; fx.shadowOffsetY = 2;
  roundRect(fx, lg.x, lg.y, lg.s, lg.s, 16);
  if (logo) { fx.fillStyle = "#fff"; fx.fill(); fx.restore(); fx.save(); roundRect(fx, lg.x, lg.y, lg.s, lg.s, 16); fx.clip(); const r = Math.max(lg.s / logo.naturalWidth, lg.s / logo.naturalHeight); const w = logo.naturalWidth * r, h = logo.naturalHeight * r; fx.drawImage(logo, lg.x + (lg.s - w) / 2, lg.y + (lg.s - h) / 2, w, h); }
  else { const g = fx.createLinearGradient(lg.x, lg.y, lg.x + lg.s, lg.y + lg.s); g.addColorStop(0, "#f3d27a"); g.addColorStop(1, "#c9962e"); fx.fillStyle = g; fx.fill(); fx.restore(); fx.save();
    const letter = (String(pick(b, "name", lang) || b.contact_name || "B").trim().charAt(0) || "B").toUpperCase();
    fx.fillStyle = "#15171a"; fx.font = `800 27px ${font}`; fx.textAlign = "center"; fx.textBaseline = "middle"; fx.fillText(letter, lg.x + lg.s / 2, lg.y + lg.s / 2 + 1); }
  fx.restore();
  drawIcon(fx, "nfc", L.sign.x, L.sign.y, L.sign.s, "rgba(255,255,255,0.85)", 1.8);
  // name and title, from the bottom up
  fx.textAlign = rtl ? "right" : "left"; fx.direction = rtl ? "rtl" : "ltr";
  const tx = rtl ? W - L.pad : L.pad;
  const role = cardRole(b, cat, lang, s);
  fx.font = `800 12px ${font}`;
  if ("letterSpacing" in fx) fx.letterSpacing = rtl ? "0px" : "1.7px";
  let y = L.nameBottom;
  if (role) { fx.fillStyle = "rgba(255,255,255,0.72)"; fx.fillText(rtl ? role : role.toUpperCase(), tx, y - 3); y -= 18; }
  if ("letterSpacing" in fx) fx.letterSpacing = rtl ? "0px" : "-0.6px";
  fx.font = `800 ${fs}px ${font}`;
  const lines = wrap(fx, cardPerson(b, lang), W - L.pad * 2, wide ? 2 : 3);
  for (let i = lines.length - 1; i >= 0; i--) {
    fx.fillStyle = "rgba(0,0,0,0.3)"; fx.fillText(lines[i], tx, y + 1);
    fx.fillStyle = "#fff"; fx.fillText(lines[i], tx, y);
    y -= lh;
  }
  if ("letterSpacing" in fx) fx.letterSpacing = "0px";
  // round icons
  const mode = s.icons;
  links.forEach((l, i) => {
    const p = L.icons[i];
    if (!p) return;
    const cx = p.x + p.s / 2, cy = p.y + p.s / 2;
    fx.beginPath(); fx.arc(cx, cy, p.s / 2, 0, Math.PI * 2);
    let fg = "#fff";
    if (mode === "gold") { const g = fx.createLinearGradient(p.x, p.y, p.x + p.s * 0.4, p.y + p.s); g.addColorStop(0, "#f5c33b"); g.addColorStop(1, "#c98f0a"); fx.fillStyle = g; fg = "#15171a"; }
    else if (mode === "white") fx.fillStyle = "rgba(255,255,255,0.16)";
    else if (mode === "match") fx.fillStyle = css(base);
    else if (l.cls === "ig") { const g = fx.createLinearGradient(p.x, p.y + p.s, p.x + p.s, p.y); g.addColorStop(0, "#f9a825"); g.addColorStop(0.55, "#e1306c"); g.addColorStop(1, "#833ab4"); fx.fillStyle = g; }
    else { fx.fillStyle = ICON_BG[l.cls] || "#5f6368"; if (l.cls === "sc") fg = "#111"; }
    fx.fill();
    if (mode === "white" || mode === "match" || l.cls === "tt" || l.cls === "xx" || l.cls === "th") { fx.strokeStyle = mode === "white" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.25)"; fx.lineWidth = 1; fx.stroke(); }
    drawIcon(fx, l.icon, cx - 10.5, cy - 10.5, 21, fg, 1.8);
  });
  if (word) { const wh = L.wordH, ww = wh * (word.naturalWidth / word.naturalHeight || 2.4); fx.globalAlpha = 0.55; fx.drawImage(word, rtl ? W - L.pad - ww : L.pad, L.wordY, ww, wh); fx.globalAlpha = 1; }

  // ----- back: the QR in light modules on the card colour, and one line under it -----
  const [bc, bx] = canvasOf();
  ground(bx);
  if (url) {
    const q = new QRCode(-1, QRErrorCorrectLevel.M); q.addData(url); q.make();
    const n = q.getModuleCount(), size = wide ? Math.min(H * 0.5, 120) : Math.min(240, W * 0.62), cell = size / n, qx = (W - size) / 2, qy = (H - size) / 2 - 16;
    bx.fillStyle = "rgba(255,255,255,0.92)";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) bx.fillRect(qx + c * cell, qy + r * cell, cell + 0.3, cell + 0.3);
    bx.font = `800 17px ${font}`; bx.textAlign = "center"; bx.fillStyle = "rgba(255,255,255,0.9)"; bx.direction = rtl ? "rtl" : "ltr";
    bx.fillText(t(lang, "scan_find_me"), W / 2, qy + size + 34);
  }

  const gl = G.gl;
  const upload = (c) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };
  let front;
  try { front = upload(fc); } catch (e) {
    // a logo from another site without permission to draw it: paint the letter tile instead
    if (s.logo_path) return paintFaces(G, { ...d, s: { ...s, logo_path: "" } });
    throw e;
  }
  return { front, back: upload(bc), edge: mix(base, [0, 0, 0], 0.28).map((x) => x / 255), layout: L };
}

// The tall digital card on the business page
export function Card3D({ b, s, lang, cat, url, flipped, dir = 1, wide = false, logoSize = 44, onFail }) {
  const box = useRef(null);
  // tells the parent when the 3D card cannot be drawn, so it can show the flat card instead
  const fail = useRef(onFail);
  fail.current = onFail;
  const failed = () => { if (fail.current) fail.current(); };
  const cv = useRef(null);
  const G = useRef(null);
  const [lay, setLay] = useState(null);
  const [size, setSize] = useState(null);
  const rtl = lang !== "en";
  const links = useMemo(() => cardLinks(b, lang, s).filter((l) => l.key !== "directions").slice(0, 7), [b, lang, s]);
  const st = useRef({ angle: 0, from: 0, to: 0, t0: 0, tilt: { x: 0, y: 0, tx: 0, ty: 0 }, born: performance.now() });

  // the box's size decides the card's size
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    // the layout size, not the on-screen size: the page scales the card while it scrolls, and that must not shrink the drawing
    const ro = new ResizeObserver(() => { const r = { width: el.offsetWidth, height: el.offsetHeight }; setSize((o) => (o && Math.abs(o.w - r.width) < 2 && Math.abs(o.h - r.height) < 2 ? o : { w: r.width, h: r.height })); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // WebGL, once
  useEffect(() => {
    const c = cv.current;
    // React may mount this twice in development; the canvas keeps its one WebGL setup
    if (c && c.__g) { G.current = c.__g; return undefined; }
    const gl = c && c.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true });
    if (!gl) { failed(); return undefined; }
    const sh = (type, src) => { const x = gl.createShader(type); gl.shaderSource(x, src); gl.compileShader(x); return x; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { failed(); return undefined; }
    const g = { gl, pr, buf: gl.createBuffer(), count: 0, faces: null };
    ["aP", "aN", "aUv", "aM"].forEach((k) => { g[k] = gl.getAttribLocation(pr, k); });
    ["uP", "uM", "uD", "tF", "tB", "uEdge"].forEach((k) => { g[k] = gl.getUniformLocation(pr, k); });
    G.current = g; c.__g = g;
    return undefined;
  }, []);

  // shape and faces, whenever the size or what is printed on the card changes (not on every re-render)
  const data = useRef({});
  data.current = { b, s, lang, cat, url, rtl, links, wide, logoSize };
  const person = cardPerson(b, lang);
  const sig = JSON.stringify([wide, logoSize, size, s.color, s.icons, s.logo_path, cardRole(b, cat, lang, s), person, pick(b, "name", lang), lang, url, links.map((l) => l.key + l.href)]);
  const gen = useRef(0);
  useEffect(() => {
    const g = G.current;
    if (!g || !size || size.w < 40 || size.h < 40) return;
    const W = size.w, H = size.h;
    const geo = geometry(W, H, 30, Math.max(5, W * 0.016));
    const my = ++gen.current;
    paintFaces(g, { W, H, ...data.current }).then((f) => {
      if (!f || my !== gen.current || G.current !== g) return;
      // the new shape and faces go in together, so the drawing never mixes old and new
      g.gl.bindBuffer(g.gl.ARRAY_BUFFER, g.buf);
      g.gl.bufferData(g.gl.ARRAY_BUFFER, geo, g.gl.STATIC_DRAW);
      g.count = geo.length / 9;
      if (g.faces) { g.gl.deleteTexture(g.faces.front); g.gl.deleteTexture(g.faces.back); }
      g.faces = f; g.ver = (g.ver || 0) + 1;
      setLay(f.layout);
    }).catch((e) => { console.error("3D card could not be drawn", e); failed(); });
  }, [sig]);

  // turning over: the angle eases to the next half turn, in the direction of the swipe
  useEffect(() => {
    const S = st.current;
    const target = flipped ? 180 : 0;
    const now = performance.now();
    if (Math.abs(((S.to % 360) + 360) % 360 - target) < 1) return;
    S.from = S.angle; S.to = S.angle + 180 * (dir < 0 ? -1 : 1); S.t0 = now;
  }, [flipped]);

  // tilt with the mouse on a computer, and with the phone itself on a phone
  useEffect(() => {
    const S = st.current.tilt;
    const el = box.current;
    // only a mouse tilts it by pointing: a finger on the card is swiping or scrolling
    const onMove = (e) => { if (e.pointerType !== "mouse") return; const r = el.getBoundingClientRect(); S.tx = Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / (r.width / 2))); S.ty = Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / (r.height / 2))); };
    const onLeave = () => { S.tx = 0; S.ty = 0; };
    // the phone's angle: only changes count, and the resting angle slowly follows how the phone is held,
    // so the card always drifts back to face you straight
    let g0 = null;
    const onTurn = (e) => {
      if (e.beta == null || e.gamma == null) return;
      if (!g0) g0 = { b: e.beta, g: e.gamma };
      g0.b += (e.beta - g0.b) * 0.03; g0.g += (e.gamma - g0.g) * 0.03;
      S.tx = Math.max(-1, Math.min(1, (e.gamma - g0.g) / 22));
      S.ty = Math.max(-1, Math.min(1, (e.beta - g0.b) / 22));
    };
    window.addEventListener("deviceorientation", onTurn);
    // iPhones only share the angle after asking once; the first tap on the card asks
    let asked = false;
    const ask = () => {
      const D = window.DeviceOrientationEvent;
      if (asked || !D || typeof D.requestPermission !== "function") return;
      asked = true;
      D.requestPermission().catch(() => {});
    };
    el.addEventListener("touchend", ask);
    el.addEventListener("click", ask);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); el.removeEventListener("touchend", ask); el.removeEventListener("click", ask); window.removeEventListener("deviceorientation", onTurn); };
  }, []);

  // draw every frame while the card is on screen
  useEffect(() => {
    let raf = 0, seen = true;
    const io = new IntersectionObserver((es) => { seen = es[0] ? es[0].isIntersecting : true; });
    if (box.current) io.observe(box.current);
    const calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // while the page scrolls, the card holds still (the page moves it), so scrolling stays smooth
    let scrolled = 0, last = "";
    const onScroll = () => { scrolled = performance.now(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const g = G.current, c = cv.current;
      if (!g || !c || !seen || document.hidden || !g.faces) return;
      const S = st.current, T = S.tilt;
      const turning = S.t0 && now - S.t0 < 720;
      if (!turning && now - scrolled < 160) return;
      // the turn: 700ms, eased, lifting slightly towards you halfway
      const p = S.t0 ? Math.min(1, (now - S.t0) / (calm ? 1 : 700)) : 1;
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      S.angle = S.from + (S.to - S.from) * e;
      const lift = Math.sin(Math.PI * p) * 70;
      T.x += (T.tx - T.x) * 0.08; T.y += (T.ty - T.y) * 0.08;
      const rx = -T.y * 9;
      const ry = T.x * 12;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = c.clientWidth, h = c.clientHeight;
      if (!w || !h) return;
      if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); last = ""; }
      // nothing moved since the last drawing: keep it, and save the phone's battery
      const key = [rx.toFixed(2), ry.toFixed(2), S.angle.toFixed(2), lift.toFixed(1), g.ver].join();
      if (key === last) return;
      last = key;
      const gl = g.gl;
      gl.viewport(0, 0, c.width, c.height);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(g.pr); gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
      gl.bindBuffer(gl.ARRAY_BUFFER, g.buf);
      gl.enableVertexAttribArray(g.aP); gl.vertexAttribPointer(g.aP, 3, gl.FLOAT, false, 36, 0);
      gl.enableVertexAttribArray(g.aN); gl.vertexAttribPointer(g.aN, 3, gl.FLOAT, false, 36, 12);
      gl.enableVertexAttribArray(g.aUv); gl.vertexAttribPointer(g.aUv, 2, gl.FLOAT, false, 36, 24);
      gl.enableVertexAttribArray(g.aM); gl.vertexAttribPointer(g.aM, 1, gl.FLOAT, false, 36, 32);
      const D = 1400, near = 100, far = 5000, f = D / (h / 2), asp = w / h;
      gl.uniformMatrix4fv(g.uP, false, new Float32Array([f / asp, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]));
      gl.uniform1f(g.uD, D); gl.uniform1i(g.tF, 0); gl.uniform1i(g.tB, 1);
      // screen y points down in the page but up here, so tilts towards the bottom become negative
      const M = m4(move(0, 0, lift), m4(rotX(rx), rotY(ry + S.angle)));
      gl.uniformMatrix4fv(g.uM, false, new Float32Array(M));
      gl.uniform3fv(g.uEdge, g.faces.edge);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, g.faces.front);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, g.faces.back);
      gl.drawArrays(gl.TRIANGLES, 0, g.count);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div ref={box} className="c3d" dir={rtl ? "rtl" : "ltr"}>
      <canvas ref={cv} className="c3d-gl" aria-hidden="true" />
      <span className="sr-only">{person} · {cardRole(b, cat, lang, s)}</span>
      {lay && !flipped ? (
        <span className="c3d-hits">
          {links.map((l, i) => {
            const p = lay.icons[i];
            return p ? <A key={l.key} l={l} b={b} className="c3d-hit" aria-label={l.label} style={{ left: p.x, top: p.y, width: p.s, height: p.s }} /> : null;
          })}
        </span>
      ) : null}
    </div>
  );
}
