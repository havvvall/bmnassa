// Slice 7 · the wallet (/wallet): every card the person saved, as a stack. Tap a card to bring it to the front;
// the front card turns over to its QR code, opens the full card, or is removed. Scanned paper cards arrive in part 3.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { t, pick } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useLists, useToast, Toast, ok, BottomNav } from "../browse/Browse.jsx";
import { NfcCard, cardSettings, cardLinks } from "../card/CardFaces.jsx";
import { getWallet, getSession, walletItemFor, saveToWallet, removeFromWallet, prettyPhone, scanImageUrl, removeScanPhotos } from "../api.js";
import { calm, ms, ease, flipCard, haptic } from "../motion.js";
import "./wallet.css";

const byId = (rows) => Object.fromEntries((rows || []).map((r) => [r.id, r]));
const store = {
  get: (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* fine */ } },
};

// "Save to wallet" for a business page or card. Not signed in: sign in first, then come back here.
export function SaveToWallet({ b, lang, go, setToast, className = "b-chip", dark, iconOnly }) {
  const [id, setId] = useState(undefined);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (b && b.id) walletItemFor(b.id).then(setId).catch(() => setId(null)); }, [b && b.id]);
  if (!b || !b.id) return null;
  const tap = async () => {
    if (!getSession()) {
      try { sessionStorage.setItem("bm_after", window.location.pathname); } catch { /* ignore */ }
      go("/signin");
      return;
    }
    if (id) { go("/wallet"); return; }
    setBusy(true);
    try {
      const nid = await saveToWallet(b.id);
      setId(nid || true);
      setToast(ok(t(lang, "saved_wallet")));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <button type="button" className={className + (id ? " saved" : "") + (dark ? " dark" : "")} disabled={busy} onClick={tap}
      aria-label={iconOnly ? t(lang, id ? "in_wallet" : "save_wallet") : undefined}>
      <Icon name={id ? "check" : "wallet"} size={iconOnly ? 19 : 15} stroke={id ? 3 : 2} />{iconOnly ? null : " " + t(lang, id ? "in_wallet" : "save_wallet")}
    </button>
  );
}

function itemName(it, lang) {
  if (it.kind === "scanned") return (it.data && (it.data.name || it.data.company)) || "·";
  const b = it.businesses;
  return b ? b.contact_name || pick(b, "name", lang) : "";
}

function useScanPhoto(path) {
  const [url, setUrl] = useState(null);
  useEffect(() => { let on = true; setUrl(null); if (path) scanImageUrl(path).then((u) => on && setUrl(u)); return () => { on = false; }; }, [path]);
  return url;
}

// A scanned paper card: its cleaned photo (front or back); text only if there is no photo
function PaperCard({ it, lang, back }) {
  const d = it.data || {};
  const front = useScanPhoto(it.image_path);
  const rear = useScanPhoto(d.back_path);
  const src = back ? rear : front;
  if ((back ? d.back_path : it.image_path)) {
    return <div className="w-photocard">{src ? <img src={src} alt={d.name || d.company || ""} /> : <span className="w-skelcard" />}</div>;
  }
  return (
    <div className="w-papercard">
      <div className="w-paper-top"><span className="w-badge paper">{t(lang, "scanned_tag")}</span></div>
      <b dir="auto">{d.name || d.company}</b>
      {d.title || d.company ? <small dir="auto">{[d.title, d.name ? d.company : ""].filter(Boolean).join(" · ")}</small> : null}
    </div>
  );
}

// Call, WhatsApp, email and website for a scanned card
function PaperLinks({ it, lang }) {
  const d = it.data || {};
  const digits = (p) => String(p || "").replace(/[^\d]/g, "");
  const rows = [
    d.phone && ["phone", "call", t(lang, "call"), prettyPhone(d.phone) || d.phone, `tel:${d.phone}`],
    (d.whatsapp || d.phone) && ["whatsapp", "wa", t(lang, "whatsapp"), t(lang, "send_message"), `https://wa.me/${digits(d.whatsapp || d.phone)}`],
    d.email && ["mail", "mail", t(lang, "f_email"), d.email, `mailto:${d.email}`],
    d.website && ["globe", "web", t(lang, "f_website"), d.website, /^https?:/i.test(d.website) ? d.website : `https://${d.website}`],
    d.instagram && ["instagram", "ig", "Instagram", "@" + d.instagram, `https://instagram.com/${d.instagram}`],
  ].filter(Boolean);
  return (
    <div className="w-plinks">
      <div className="w-pname"><b dir="auto">{d.name || d.company}</b>{d.name && (d.title || d.company) ? <small dir="auto">{[d.title, d.company].filter(Boolean).join(" · ")}</small> : null}</div>
      {rows.map(([icon, cls, label, text, href]) => (
        <a key={icon} className="w-plink" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          <span className={"w-plic " + cls}><Icon name={icon} size={16} /></span>
          <span className="grow"><b>{label}</b><small className={icon === "phone" || icon === "mail" || icon === "globe" ? "ltr" : ""}>{text}</small></span>
        </a>
      ))}
    </div>
  );
}

// The card at the front: turns over on a sideways swipe or tap of the flip button
function FrontCard({ it, lang, cats, go, onRemove, refFn }) {
  const [back, setBack] = useState(false);
  const face = useRef(null);
  const touch = useRef(null);
  const turning = useRef(false);
  const b = it.businesses;
  const scanned = it.kind === "scanned";
  const canFlip = !!b || (scanned && !!(it.data && it.data.back_path));
  useEffect(() => setBack(false), [it.id]);
  const flip = (dir = 1) => {
    if (turning.current || !canFlip) return;
    turning.current = true;
    flipCard(face.current, { dir, swap: () => setBack((x) => !x), done: () => { turning.current = false; } });
  };
  const onStart = (e) => { const p = e.touches[0]; touch.current = { x: p.clientX, y: p.clientY }; };
  const onEnd = (e) => {
    if (!touch.current) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - touch.current.x, dy = p.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) flip(dx > 0 ? 1 : -1);
  };
  return (
    <div className="w-front" ref={refFn}>
      <div className="w-face" ref={face} onTouchStart={onStart} onTouchEnd={onEnd}>
        {scanned ? <PaperCard it={it} lang={lang} back={back} />
          : b ? <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cats[b.category_id]} back={back} url={`${window.location.origin}/${b.handle}/card`} />
          : <div className="w-papercard w-gonecard"><b>{t(lang, "no_longer_listed")}</b></div>}
      </div>
      {canFlip ? <p className="w-hint">‹ {t(lang, "swipe_flip_short")} ›</p> : null}
      <div className="w-actions">
        {b ? <button type="button" className="w-act" onClick={() => go(`/${b.handle}/card`)}><Icon name="up" size={15} /> {t(lang, "w_open_card")}</button> : null}
        {scanned ? <button type="button" className="w-act" onClick={() => go(`/scan/edit/${it.id}`)}><Icon name="rows" size={15} /> {t(lang, "edit_details")}</button> : null}
        {canFlip ? <button type="button" className="w-act icon flipbtn" aria-label={t(lang, "flip")} onClick={() => flip(1)}><Icon name="flip" size={16} /></button> : null}
        <span className="grow" />
        <button type="button" className="w-act icon" aria-label={t(lang, "remove_wallet")} onClick={onRemove}><Icon name="trash" size={16} /></button>
      </div>
      {scanned ? <PaperLinks it={it} lang={lang} /> : null}
    </div>
  );
}

// One card on the wheel: just its face (links are not tappable here; tap opens the details)
function WheelFace({ it, lang, cats }) {
  const b = it.businesses;
  if (it.kind === "scanned") return <PaperCard it={it} lang={lang} />;
  if (!b) return <div className="w-papercard w-gonecard"><b>{t(lang, "no_longer_listed")}</b></div>;
  return <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cats[b.category_id]} linksOnly />;
}

// ---------- details of one card: name, the two big buttons, the other links ----------
function paperRows(d, lang) {
  const digits = (p) => String(p || "").replace(/[^\d]/g, "");
  return [
    d.phone && { key: "call", icon: "phone", cls: "call", label: t(lang, "call"), text: prettyPhone(d.phone) || d.phone, href: `tel:${d.phone}`, ltr: true },
    (d.whatsapp || d.phone) && { key: "whatsapp", icon: "whatsapp", cls: "wa", label: t(lang, "whatsapp"), text: t(lang, "send_message"), href: `https://wa.me/${digits(d.whatsapp || d.phone)}` },
    d.email && { key: "email", icon: "mail", cls: "mail", label: t(lang, "f_email"), text: d.email, href: `mailto:${d.email}`, ltr: true },
    d.website && { key: "website", icon: "globe", cls: "web", label: t(lang, "f_website"), text: d.website, href: /^https?:/i.test(d.website) ? d.website : `https://${d.website}`, ltr: true },
    d.instagram && { key: "instagram", icon: "instagram", cls: "ig", label: "Instagram", text: "@" + d.instagram, href: `https://instagram.com/${d.instagram}`, ltr: true },
  ].filter(Boolean);
}

function CardInfo({ it, lang, cats, go, onRemove, setToast }) {
  const b = it.businesses;
  const d = it.data || {};
  const scanned = it.kind === "scanned";
  const demo = it.id < 0;
  const rows = b ? cardLinks(b, lang, cardSettings(b)) : scanned ? paperRows(d, lang) : [];
  const call = rows.find((r) => r.key === "call");
  const wa = rows.find((r) => r.key === "whatsapp");
  const rest = rows.filter((r) => r !== call && r !== wa);
  const sub = b ? [pick(b, "name", lang), cats[b.category_id] && pick(cats[b.category_id], "name", lang)].filter(Boolean).join(" · ")
    : [d.title, d.name ? d.company : ""].filter(Boolean).join(" · ");
  const openCard = () => (demo ? setToast(t(lang, "w_demo_note")) : go(`/${b.handle}/card`));
  return (
    <div className="wi">
      <div className="wi-head">
        <span className="grow"><b dir="auto">{itemName(it, lang)}</b>{sub ? <small dir="auto">{sub}</small> : null}</span>
        {scanned ? <span className="w-badge paper">{t(lang, "scanned_tag")}</span> : null}
      </div>
      <div className="wi-quick">
        {call ? <a className="wi-btn gold" href={call.href} onClick={() => haptic(10)}><Icon name="phone" size={18} /> {t(lang, "call")}</a> : null}
        {wa ? <a className="wi-btn wa" href={wa.href} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> {t(lang, "whatsapp")}</a> : null}
        {b ? <button type="button" className="wi-btn plain" onClick={openCard} aria-label={t(lang, "w_open_card")}><Icon name="flip" size={18} /></button> : null}
      </div>
      {rest.length ? (
        <div className="wi-rows">
          {rest.map((l) => (
            <a key={l.key} className="wi-row" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              <span className={"w-plic " + l.cls}><Icon name={l.icon} size={16} /></span>
              <span className="grow"><b>{l.label}</b><small className={l.ltr ? "ltr" : ""}>{l.text}</small></span>
              <Icon name="chevron" size={16} className="flip" />
            </a>
          ))}
        </div>
      ) : null}
      <div className="wi-foot">
        {scanned && !demo ? <button type="button" className="link" onClick={() => go(`/scan/edit/${it.id}`)}>{t(lang, "edit_details")}</button> : <span />}
        <button type="button" className="link danger" onClick={onRemove}>{t(lang, "remove_wallet")}</button>
      </div>
    </div>
  );
}

// ---------- look A · stack: tap a card, it rises to the top, the rest drop into a pile ----------
const SPRING = "cubic-bezier(0.22, 1.18, 0.36, 1)";
function StackLook({ items, lang, cats, go, onRemove, setToast, startId }) {
  const area = useRef(null);
  const touch = useRef(null);
  const [box, setBox] = useState({ w: 350, h: 520 });
  const [open, setOpen] = useState(null);
  const [scroll0, setScroll0] = useState(0);
  useLayoutEffect(() => {
    const m = () => {
      const el = area.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setBox({ w: el.clientWidth, h: Math.max(420, window.innerHeight - top - 104) });
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  useEffect(() => { if (open && !items.find((x) => x.id === open)) setOpen(null); }, [items]);
  const H = box.w / 1.586;
  const n = items.length;
  const STEP = Math.max(58, Math.min(84, (box.h - H - 24) / Math.max(1, n - 1)));
  const sel = items.find((x) => x.id === open);
  const others = items.filter((x) => x !== sel);
  const pileTop = scroll0 + box.h - 96;
  const fast = calm();
  const tr = fast ? "opacity 120ms linear" : `transform 620ms ${SPRING}, opacity 260ms ease, filter 300ms ease`;
  const place = (it, i) => {
    if (!sel) return { y: i * STEP, s: 1, o: 1, z: i, dim: 0 };
    if (it === sel) return { y: scroll0, s: 1, o: 1, z: 200, dim: 0 };
    const k = others.indexOf(it);
    return { y: pileTop + Math.min(k, 3) * 12, s: 0.9 - Math.min(k, 3) * 0.03, o: k > 3 ? 0 : 1, z: 100 - k, dim: 0.12 + Math.min(k, 3) * 0.06 };
  };
  const tap = (it) => {
    haptic(10);
    if (sel) { setOpen(null); return; }
    setScroll0(area.current ? area.current.scrollTop : 0);
    setOpen(it.id);
  };
  const innerH = sel ? scroll0 + box.h : (n - 1) * STEP + H + 30;
  return (
    <div className={"ws-area" + (sel ? " is-open" : "")} ref={area} style={{ height: box.h }}>
      <div className="ws-inner" style={{ height: innerH }}>
        {items.map((it, i) => {
          const pl = place(it, i);
          return (
            <button key={it.id} type="button" className="ws-card" aria-label={itemName(it, lang)} aria-expanded={it === sel}
              style={{ zIndex: pl.z, opacity: pl.o, transform: `translateY(${pl.y}px) scale(${pl.s})`, transition: tr, "--dim": pl.dim, height: H }}
              onClick={() => tap(it)}
              onTouchStart={(e) => { touch.current = e.touches[0].clientY; }}
              onTouchEnd={(e) => { if (sel && it === sel && touch.current != null && e.changedTouches[0].clientY - touch.current > 70) setOpen(null); touch.current = null; }}>
              <WheelFace it={it} lang={lang} cats={cats} />
              {it.kind !== "scanned" ? <span className="ws-name" dir="auto" style={{ opacity: !sel && i < n - 1 ? 1 : 0 }}>{itemName(it, lang)}</span> : null}
            </button>
          );
        })}
        {sel ? (
          <div className="ws-info" key={sel.id} style={{ top: scroll0 + H + 18, height: box.h - H - 18 - 108 }}>
            <CardInfo it={sel} lang={lang} cats={cats} go={go} onRemove={() => onRemove(sel)} setToast={setToast} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------- look C · swipe deck: one big card in the middle, neighbours tilt away at the sides ----------
function DeckLook({ items, lang, cats, go, onRemove, setToast, startId }) {
  const row = useRef(null);
  const els = useRef({});
  const [active, setActive] = useState(0);
  const act = useRef(0);
  const paint = () => {
    const r = row.current;
    if (!r) return;
    const rr = r.getBoundingClientRect();
    const mid = rr.left + rr.width / 2;
    let best = 0, bd = Infinity;
    items.forEach((it, i) => {
      const el = els.current[it.id];
      if (!el) return;
      const b = el.getBoundingClientRect();
      const d = (b.left + b.width / 2 - mid) / b.width;
      const a = Math.min(Math.abs(d), 1.6);
      const card = el.firstElementChild;
      if (card) {
        card.style.transform = calm() ? `scale(${1 - a * 0.08})` : `perspective(1000px) rotateY(${Math.max(-1.4, Math.min(1.4, d)) * -22}deg) scale(${1 - a * 0.1})`;
        card.style.setProperty("--dim", String(Math.min(0.5, a * 0.3)));
      }
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
    });
    if (best !== act.current) { act.current = best; setActive(best); haptic(4); }
  };
  const raf = useRef(0);
  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(paint); };
  const centre = (i, smooth = true) => {
    const it = items[i];
    const el = it && els.current[it.id];
    if (el) el.scrollIntoView({ behavior: smooth && !calm() ? "smooth" : "auto", inline: "center", block: "nearest" });
  };
  useLayoutEffect(() => {
    const i = Math.max(0, items.findIndex((x) => x.id === startId));
    act.current = i; setActive(i);
    centre(i, false);
    requestAnimationFrame(paint);
  }, [items.length]);
  const cur = items[Math.min(active, items.length - 1)];
  return (
    <div className="wd">
      <div className="wd-row" ref={row} onScroll={onScroll}>
        {items.map((it, i) => (
          <div key={it.id} className="wd-item" ref={(el) => { els.current[it.id] = el; }}>
            <button type="button" className="wd-card" aria-label={itemName(it, lang)}
              onClick={() => (i === active ? (it.businesses && it.id > 0 ? go(`/${it.businesses.handle}/card`) : null) : centre(i))}>
              <WheelFace it={it} lang={lang} cats={cats} />
            </button>
          </div>
        ))}
      </div>
      <div className="wd-dots" aria-hidden="true">
        {items.slice(0, 12).map((it, i) => <i key={it.id} className={i === active ? "on" : ""} />)}
      </div>
      {cur ? (
        <div className="wd-info" key={cur.id}>
          <CardInfo it={cur} lang={lang} cats={cats} go={go} onRemove={() => onRemove(cur)} setToast={setToast} />
        </div>
      ) : null}
    </div>
  );
}

// Sample cards so the wallet's motion can be tried with only a few saved cards
const DEMO_CARDS = [
  ["Karwan Ahmed", "Azad Cooling Services", "hvac", "#1b2a4a"],
  ["Dana Ali", "Baran Electric", "electrical", "#5a1a26"],
  ["Hemn Ali", "Hemn Plumbing", "plumbing", "#1f3d2b"],
  ["Lana Kamal", "Lana Interiors", "interior", "#0f5c5c"],
  ["Rebwar Aziz", "Aziz Carpentry", "carpentry", "#3f2a5c"],
  ["Shilan Omar", "Shilan Studio", "photography", "#b5532f"],
].map(([person, name, cat, color], i) => ({
  id: -(i + 1), kind: "business", business_id: -(i + 1), created_at: "2026-10-2" + i,
  businesses: { id: -(i + 1), handle: "demo", contact_name: person, name_en: name, name_ku: name, name_ar: name, category_id: cat,
    phone: "+96475012345" + (60 + i), whatsapp: "+96475012345" + (60 + i), instagram: i % 2 ? "" : "bmnassa", email: i % 3 ? "" : "hello@bmnassa.com", card: { style: "wallet", color } },
}));
DEMO_CARDS.splice(2, 0, { id: -99, kind: "scanned", created_at: "2026-10-20", data: { name: "Sherwan Kamal", title: "Manager", company: "Kamal Printing", phone: "+9647501234599", email: "sherwan@kamalprint.com" } });

function Sheet({ lang, title, onClose, children }) {
  return (
    <div className="b-sheet-wrap" onClick={onClose}>
      <div className="b-sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="b-sheet-head"><b>{title}</b><button type="button" className="link" onClick={onClose}>{t(lang, "close")}</button></div>
        <div className="stack">{children}</div>
      </div>
    </div>
  );
}

export function WalletPage({ lang, go, signedIn }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(false);
  const [frontId, setFrontId] = useState(null);
  const [q, setQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [sheet, setSheet] = useState("");
  const [sort, setSortState] = useState(() => store.get("bm_wallet_sort", "newest"));
  const [lists] = useLists();
  const [toast, setToast] = useToast();
  const wheel = useRef(null);
  const els = useRef({});
  const centred = useRef(-1);
  const [detail, setDetail] = useState(null);
  const [look, setLookState] = useState(() => {
    const q0 = new URLSearchParams(window.location.search).get("look");
    return ["stack", "wheel", "deck"].includes(q0) ? q0 : store.get("bm_wallet_look", "stack");
  });
  const [demo, setDemoState] = useState(() => store.get("bm_wallet_demo", "") === "1" || new URLSearchParams(window.location.search).has("demo"));
  const setLook = (v) => { setLookState(v); store.set("bm_wallet_look", v); setSheet(""); };
  const setDemo = (v) => { setDemoState(v); store.set("bm_wallet_demo", v ? "1" : ""); setSheet(""); };
  const [hidden, setHidden] = useState([]);

  const load = () => {
    setErr(false);
    getWallet().then((r) => {
      setRows(r);
      try { const f = sessionStorage.getItem("bm_wallet_front"); if (f) { setFrontId(Number(f)); sessionStorage.removeItem("bm_wallet_front"); } } catch { /* ignore */ }
    }).catch(() => setErr(true));
  };
  useEffect(() => { if (signedIn) load(); }, [signedIn]);

  const cats = useMemo(() => byId(lists && lists.cats), [lists]);
  const items = useMemo(() => {
    let r = (rows || []).slice();
    if (demo) r = r.concat(DEMO_CARDS.filter((x) => !hidden.includes(x.id)));
    if (q.trim()) {
      const n = q.trim().toLowerCase();
      r = r.filter((it) => {
        const b = it.businesses || {};
        return [itemName(it, lang), b.name_en, b.name_ku, b.name_ar, it.data && it.data.company, cats[b.category_id] && pick(cats[b.category_id], "name", lang)]
          .some((x) => x && String(x).toLowerCase().includes(n));
      });
    }
    if (sort === "az") r.sort((a, z) => itemName(a, lang).localeCompare(itemName(z, lang)));
    return r;
  }, [rows, q, sort, lang, cats, demo, hidden]);
  // The wheel: the card in the middle is full size and on top; the others shrink, darken and tuck behind it
  const paint = () => {
    const w = wheel.current;
    if (!w) return;
    const wr = w.getBoundingClientRect();
    const mid = wr.top + wr.height / 2;
    let best = -1, bestD = Infinity;
    items.forEach((it, i) => {
      const el = els.current[it.id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const step = r.height || 1;
      const d = (r.top + r.height / 2 - mid) / step;
      const a = Math.min(Math.abs(d), 4);
      const card = el.firstElementChild;
      if (card) {
        // cards below slide a little further down so their name and buttons show; cards above show their top
        const ty = d > 0 ? Math.min(a, 1) * 36 + Math.max(0, a - 1) * step * 0.12 : -(Math.min(a, 1) * 6 + Math.max(0, a - 1) * step * 0.18);
        const tilt = calm() ? "" : ` perspective(1100px) rotateX(${Math.max(-1.6, Math.min(1.6, d)) * -16}deg)`;
        card.style.transform = `translateY(${ty}px)${tilt} scale(${1 - a * 0.075})`;
        card.style.setProperty("--dim", String(Math.min(0.55, a * 0.16)));
        card.style.zIndex = String(100 - Math.round(a * 10));
      }
      if (Math.abs(d) < bestD) { bestD = Math.abs(d); best = i; }
    });
    if (best !== centred.current) {
      if (centred.current !== -1 && navigator.vibrate && !calm()) navigator.vibrate(4);
      centred.current = best;
    }
  };
  const raf = useRef(0);
  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(paint); };
  const centre = (id, smooth = true) => {
    const w = wheel.current, el = els.current[id];
    if (!w || !el) return;
    const top = el.offsetTop - (w.clientHeight - el.offsetHeight) / 2;
    w.scrollTo({ top, behavior: smooth && !calm() ? "smooth" : "auto" });
  };
  // after loading: start on the card that was just saved, else the first
  useLayoutEffect(() => {
    if (!items.length || look !== "wheel") return;
    const start = frontId && items.find((x) => x.id === frontId) ? frontId : items[0].id;
    centre(start, false);
    paint();
  }, [rows, q, sort, look, demo]);
  useEffect(() => {
    const r = () => paint();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  });
  const tapCard = (it, i) => {
    if (i === centred.current) setDetail(it);
    else centre(it.id);
  };
  const setSort = (v) => { setSortState(v); store.set("bm_wallet_sort", v); setSheet(""); };
  const remove = async (it) => {
    if (it.id < 0) { setHidden((x) => x.concat(it.id)); setDetail(null); setToast(t(lang, "removed_wallet")); return; }
    try {
      await removeFromWallet(it.id, it.business_id);
      if (it.kind === "scanned") removeScanPhotos([it.image_path, it.data && it.data.back_path]);
      setRows((x) => x.filter((y) => y.id !== it.id));
      setFrontId(null);
      setDetail(null);
      setToast(t(lang, "removed_wallet"));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    }
  };

  if (!signedIn) {
    return (
      <div className="w-page">
        <div className="w-backdrop" aria-hidden="true" />
        <div className="w-head"><h1>{t(lang, "wallet_title")}</h1></div>
        <div className="w-intro">
          <div className="w-introstack" aria-hidden="true"><i /><i /><i /></div>
          <b>{t(lang, "wallet_create")}</b>
          <p>{t(lang, "wallet_create_sub")}</p>
          <button type="button" className="btn w-dark" onClick={() => { try { sessionStorage.setItem("bm_after", "/wallet"); } catch { /* ignore */ } go("/signin"); }}>{t(lang, "wallet_signin")}</button>
          <small>{t(lang, "wallet_private")}</small>
        </div>
        <div className="b-navspace" />
        <BottomNav lang={lang} active="wallet" go={go} signedIn={false} />
      </div>
    );
  }

  const n = (rows || []).length + (demo ? DEMO_CARDS.length - hidden.length : 0);
  return (
    <div className="w-page">
      <div className="w-backdrop" aria-hidden="true" />
      <div className="w-head">
        <h1>{t(lang, "w_short")}</h1>
        <button type="button" className="w-round" aria-label={t(lang, "add_card")} onClick={() => setSheet("add")}><Icon name="plus" size={20} stroke={2.4} /></button>
        <span className="w-pill">
          <button type="button" aria-label={t(lang, "wallet_search")} onClick={() => setSearching((x) => !x)}><Icon name="search" size={17} /></button>
          <button type="button" aria-label="More" onClick={() => setSheet("more")}><Icon name="more" size={18} /></button>
        </span>
      </div>
      {searching ? (
        <label className="w-search"><Icon name="search" size={16} />
          <input autoFocus value={q} placeholder={t(lang, "wallet_search")} onChange={(e) => setQ(e.target.value)} />
        </label>
      ) : null}

      {err ? <div className="w-empty"><p>{t(lang, "load_failed")}</p><button type="button" className="btn w-dark" onClick={load}>{t(lang, "try_again")}</button></div> : null}
      {rows === null && !err ? (
        <div className="w-wheel" aria-hidden="true"><div className="w-wheelpad" />
          <div className="w-witem"><div className="w-wcard"><span className="w-skelcard" /></div></div>
          <div className="w-witem"><div className="w-wcard" style={{ transform: "scale(0.92)" }}><span className="w-skelcard" /></div></div>
        </div>
      ) : null}
      {rows && !n && !demo ? (
        <div className="w-empty">
          <div className="w-introstack" aria-hidden="true"><i /><i /><i /></div>
          <b>{t(lang, "wallet_empty")}</b>
          <p>{t(lang, "wallet_empty_sub")}</p>
          <button type="button" className="btn w-dark" onClick={() => go("/home")}>{t(lang, "find_business")}</button>
        </div>
      ) : null}

      {items.length && look === "stack" ? <StackLook items={items} lang={lang} cats={cats} go={go} onRemove={remove} setToast={setToast} startId={frontId} /> : null}
      {items.length && look === "deck" ? <DeckLook items={items} lang={lang} cats={cats} go={go} onRemove={remove} setToast={setToast} startId={frontId} /> : null}
      {items.length && look === "wheel" ? (
        <div className="w-wheel" ref={wheel} onScroll={onScroll}>
          <div className="w-wheelpad" />
          {items.map((it, i) => (
            <div key={it.id} className="w-witem" ref={(el) => { els.current[it.id] = el; }}>
              <button type="button" className="w-wcard" onClick={() => tapCard(it, i)} aria-label={itemName(it, lang)}>
                <WheelFace it={it} lang={lang} cats={cats} />
              </button>
            </div>
          ))}
          <div className="w-wheelpad" />
        </div>
      ) : null}

      {rows && n && look === "wheel" ? (
        <div className="w-foot">
          <span className="w-count">{n === 1 ? t(lang, "wallet_one") : t(lang, "wallet_cards", { n })}</span>
          <button type="button" className="w-scan" onClick={() => go("/scan")}><Icon name="scan" size={16} /> {t(lang, "scan_paper")}</button>
        </div>
      ) : null}

      {detail ? (
        <div className="b-sheet-wrap w-detailwrap" onClick={() => setDetail(null)}>
          <div className="w-detail" role="dialog" aria-label={itemName(detail, lang)} onClick={(e) => e.stopPropagation()}>
            <div className="w-detailhead"><span className="b-grab" /><button type="button" className="link" onClick={() => setDetail(null)}>{t(lang, "close")}</button></div>
            <FrontCard it={detail} lang={lang} cats={cats} go={go} onRemove={() => remove(detail)} refFn={() => {}} />
          </div>
        </div>
      ) : null}
      {sheet === "add" ? (
        <Sheet lang={lang} title={t(lang, "add_card")} onClose={() => setSheet("")}>
          <button type="button" className="choice" onClick={() => go("/scan")}><span><Icon name="scan" size={17} /> {t(lang, "scan_paper")}</span></button>
          <button type="button" className="choice" onClick={() => go("/home")}><span><Icon name="search" size={17} /> {t(lang, "find_business")}</span></button>
        </Sheet>
      ) : null}
      {sheet === "more" ? (
        <Sheet lang={lang} title={t(lang, "wallet_title")} onClose={() => setSheet("")}>
          {[["newest", "sort_newest"], ["az", "sort_az"]].map(([k, label]) => (
            <button key={k} type="button" className="choice" aria-pressed={sort === k} onClick={() => setSort(k)}><span>{t(lang, label)}</span>{sort === k ? <span className="tick">✓</span> : null}</button>
          ))}
          <span className="label" style={{ marginTop: 8 }}>{t(lang, "w_style")}</span>
          <div className="seg" role="group" aria-label={t(lang, "w_style")}>
            {[["stack", "w_stack"], ["wheel", "w_wheel"], ["deck", "w_deck"]].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={look === k} onClick={() => setLook(k)}>{t(lang, label)}</button>
            ))}
          </div>
          <label className="ps-toggle"><span>{t(lang, "w_demo")}</span>
            <input type="checkbox" role="switch" checked={demo} onChange={(e) => setDemo(e.target.checked)} /></label>
        </Sheet>
      ) : null}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="wallet" go={go} signedIn />
      <Toast text={toast} />
    </div>
  );
}
