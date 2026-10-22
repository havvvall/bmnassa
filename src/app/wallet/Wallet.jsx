// Slice 7 · the wallet (/wallet): every card the person saved, as a stack. Tap a card to bring it to the front;
// the front card turns over to its QR code, opens the full card, or is removed. Scanned paper cards arrive in part 3.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { t, pick } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useLists, useToast, Toast, ok, BottomNav } from "../browse/Browse.jsx";
import { cityName } from "../i18n.js";
import { NfcCard, cardSettings, cardLinks } from "../card/CardFaces.jsx";
import { getMySuggestions, suggestBusiness, getWallet, getSession, walletItemFor, saveToWallet, removeFromWallet, prettyPhone, scanImageUrl, removeScanPhotos } from "../api.js";
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
  const flip = (dir) => {
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
        {canFlip ? <button type="button" className="w-act icon flipbtn" aria-label={t(lang, "flip")} onClick={() => flip()}><Icon name="flip" size={16} /></button> : null}
        <span className="grow" />
        <button type="button" className="w-act icon" aria-label={t(lang, "remove_wallet")} onClick={onRemove}><Icon name="trash" size={16} /></button>
      </div>
      {scanned ? <PaperLinks it={it} lang={lang} /> : null}
      {scanned ? <SuggestBox it={it} lang={lang} /> : null}
    </div>
  );
}

// One card on the wheel: just its face (links are not tappable here; tap opens the details)
function WheelFace({ it, lang, cats, back }) {
  const b = it.businesses;
  if (it.kind === "scanned") return <PaperCard it={it} lang={lang} back={back} />;
  if (!b) return <div className="w-papercard w-gonecard"><b>{t(lang, "no_longer_listed")}</b></div>;
  return back ? <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cats[b.category_id]} back url={`${window.location.origin}/${b.handle}/card`} />
    : <NfcCard b={b} s={cardSettings(b)} lang={lang} cat={cats[b.category_id]} linksOnly />;
}
// "Scanned" for paper cards, "NFC" for Bmnassa digital cards
function TypeTag({ it, lang }) {
  if (it.kind === "scanned") return <span className="w-type paper">{t(lang, "scanned_tag")}</span>;
  if (it.businesses) return <span className="w-type nfc"><Icon name="nfc" size={11} />NFC</span>;
  return null;
}
const canFlip = (it) => !!it.businesses || (it.kind === "scanned" && !!(it.data && it.data.back_path));

// Turn a card over in place (front ⇄ back), with the same 3D flip as the card screen
function useFlip(resetKey) {
  const [back, setBack] = useState(false);
  const busy = useRef(false);
  useEffect(() => setBack(false), [resetKey]);
  const flip = (el, dir) => {
    if (busy.current || !el) return;
    busy.current = true;
    haptic(12);
    flipCard(el, { dir, swap: () => setBack((x) => !x), done: () => { busy.current = false; } });
  };
  return [back, flip];
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

function CardInfo({ it, lang, cats, go, onRemove, setToast, onFlip }) {
  const b = it.businesses;
  const d = it.data || {};
  const scanned = it.kind === "scanned";
  const rows = b ? cardLinks(b, lang, cardSettings(b)) : scanned ? paperRows(d, lang) : [];
  const call = rows.find((r) => r.key === "call");
  const wa = rows.find((r) => r.key === "whatsapp");
  const rest = rows.filter((r) => r !== call && r !== wa);
  const sub = b ? [pick(b, "name", lang), cats[b.category_id] && pick(cats[b.category_id], "name", lang)].filter(Boolean).join(" · ")
    : [d.title, d.name ? d.company : ""].filter(Boolean).join(" · ");
  const openCard = () => go(`/${b.handle}/card`);
  return (
    <div className="wi">
      <div className="wi-head">
        <span className="grow"><b dir="auto">{itemName(it, lang)}</b>{sub ? <small dir="auto">{sub}</small> : null}</span>
        <TypeTag it={it} lang={lang} />
      </div>
      <div className="wi-quick">
        {call ? <a className="wi-btn gold" href={call.href} onClick={() => haptic(10)}><Icon name="phone" size={18} /> {t(lang, "call")}</a> : null}
        {wa ? <a className="wi-btn wa" href={wa.href} target="_blank" rel="noreferrer"><Icon name="whatsapp" size={18} /> {t(lang, "whatsapp")}</a> : null}
        {onFlip && canFlip(it) ? <button type="button" className="wi-btn plain" onClick={onFlip} aria-label={t(lang, "w_flip")}><Icon name="flip" size={18} /></button> : null}
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
      <SuggestBox it={it} lang={lang} setToast={setToast} />
      <div className="wi-foot">
        {scanned ? <button type="button" className="link" onClick={() => go(`/scan/edit/${it.id}`)}>{t(lang, "edit_details")}</button>
          : b ? <button type="button" className="link" onClick={openCard}>{t(lang, "w_open_card")}</button> : <span />}
        <button type="button" className="link danger" onClick={onRemove}>{t(lang, "remove_wallet")}</button>
      </div>
    </div>
  );
}

// ---------- "Suggest for Bmnassa": send a scanned card to the team, privately ----------
function SuggestBox({ it, lang, setToast }) {
  const [lists] = useLists();
  const [state, setState] = useState(undefined); // undefined loading · null none · row
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(() => store.get("bm_city", ""));
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => {
    let alive = true;
    getMySuggestions().then((m) => { if (alive) setState(m.get(it.id) || null); });
    return () => { alive = false; };
  }, [it.id]);
  if (it.kind !== "scanned" || state === undefined) return null;
  const send = async () => {
    setBusy(true); setErr("");
    try {
      const r = await suggestBusiness(it.id, { city_id: city, note });
      setState(r || { status: "new" });
      setOpen(false);
      ok(t(lang, "sg_sent"));
      haptic(20);
    } catch (e) {
      setErr(e && /function|relation|does not exist|404/i.test(e.message || "") ? t(lang, "sg_not_ready") : (e && e.message) || t(lang, "load_failed"));
    } finally { setBusy(false); }
  };
  if (state) {
    const key = { new: "sg_st_new", contacted: "sg_st_contacted", joined: "sg_st_joined", declined: "sg_st_declined" }[state.status] || "sg_st_new";
    return (
      <div className={"w-sg done " + (state.status || "new")}>
        <span className="w-sg-ic"><Icon name={state.status === "joined" ? "check" : "clock"} size={18} /></span>
        <span className="grow"><b>{t(lang, "sg_suggested")}</b><small>{t(lang, key)}</small></span>
      </div>
    );
  }
  return (
    <>
      <div className="w-sg">
        <span className="w-sg-ic"><Icon name="sparkle" size={18} /></span>
        <span className="grow"><b>{t(lang, "sg_q")}</b><small>{t(lang, "sg_sub")}</small></span>
        <button type="button" className="w-sg-btn" onClick={() => setOpen(true)}>{t(lang, "sg_btn")}</button>
      </div>
      {open ? (
        <Sheet lang={lang} title={t(lang, "sg_title")} onClose={() => setOpen(false)}>
          <p className="w-sg-how">{t(lang, "sg_how")}</p>
          <ol className="w-sg-steps">
            <li>{t(lang, "sg_step1")}</li>
            <li>{t(lang, "sg_step2")}</li>
            <li>{t(lang, "sg_step3")}</li>
          </ol>
          <label className="label" htmlFor="sg-city">{t(lang, "sg_city")}</label>
          <select id="sg-city" className="field" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">{t(lang, "choose_city")}</option>
            {(lists ? lists.cities : []).map((c) => <option key={c.id} value={c.id}>{cityName(c, lang)}</option>)}
          </select>
          <label className="label" htmlFor="sg-note">{t(lang, "sg_note")}</label>
          <textarea id="sg-note" className="field" rows={2} maxLength={300} value={note} placeholder={t(lang, "sg_note_ph")} onChange={(e) => setNote(e.target.value)} />
          {err ? <div className="err">{err}</div> : null}
          <button type="button" className="btn" disabled={busy} onClick={send}>{busy ? t(lang, "sending") : t(lang, "sg_send")}</button>
          <small className="w-sg-private">{t(lang, "sg_private")}</small>
        </Sheet>
      ) : null}
    </>
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
  const [drag, setDrag] = useState(0);
  const [swapDir, setSwapDir] = useState(0);
  const [back, flip] = useFlip(open);
  const faces = useRef({});
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
    if (it === sel) return { y: scroll0, s: 1, o: 1, z: 200, dim: 0, x: drag };
    const k = others.indexOf(it);
    return { y: pileTop + Math.min(k, 3) * 12, s: 0.9 - Math.min(k, 3) * 0.03, o: k > 3 ? 0 : 1, z: 100 - k, dim: 0.12 + Math.min(k, 3) * 0.06 };
  };
  const tap = (it) => {
    if (suppress.current) { suppress.current = false; return; }
    if (sel && it === sel) { if (canFlip(it)) flip(faces.current[it.id]); return; }
    haptic(10);
    setSwapDir(0);
    if (sel) { setOpen(null); return; }
    setScroll0(area.current ? area.current.scrollTop : 0);
    setOpen(it.id);
  };
  // swipe left / right on the open card: it slides away and the next one rises from the pile
  const swap = (step) => {
    if (!sel || n < 2) return;
    const i = items.indexOf(sel);
    const next = items[(i + step + n) % n];
    haptic(8);
    setSwapDir(step);
    setDrag(0);
    setOpen(next.id);
  };
  const tStart = (e) => { const p = e.touches[0]; touch.current = { x: p.clientX, y: p.clientY, axis: null }; };
  const tMove = (it) => (e) => {
    const t0 = touch.current;
    if (!sel || it !== sel || !t0) return;
    const p = e.touches[0];
    const dx = p.clientX - t0.x, dy = p.clientY - t0.y;
    if (!t0.axis && Math.abs(dx) + Math.abs(dy) > 8) t0.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    if (t0.axis === "x") setDrag(dx);
  };
  const tEnd = (it) => (e) => {
    const t0 = touch.current;
    touch.current = null;
    if (!sel || it !== sel || !t0) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - t0.x, dy = p.clientY - t0.y;
    if (t0.axis === "x" && Math.abs(dx) > 60) {
      const rtl = document.documentElement.dir === "rtl";
      swap((dx < 0) !== rtl ? 1 : -1);
      e.preventDefault();
    } else {
      setDrag(0);
      if (t0.axis === "y" && dy > 70) { setOpen(null); e.preventDefault(); }
    }
    if (t0.axis) suppress.current = true;
  };
  const suppress = useRef(false);
  const innerH = sel ? scroll0 + box.h : (n - 1) * STEP + H + 30;
  return (
    <div className={"ws-area" + (sel ? " is-open" : "")} ref={area} style={{ height: box.h }}>
      <div className="ws-inner" style={{ height: innerH }}>
        {items.map((it, i) => {
          const pl = place(it, i);
          return (
            <button key={it.id} type="button" className="ws-card" aria-label={itemName(it, lang)} aria-expanded={it === sel}
              style={{ zIndex: pl.z, opacity: pl.o, transition: it === sel && drag ? "none" : tr, "--dim": pl.dim, height: H,
                transform: `translate(${pl.x || 0}px, ${pl.y}px) rotate(${(pl.x || 0) / 40}deg) scale(${pl.s})` }}
              onClick={() => tap(it)}
              onTouchStart={tStart} onTouchMove={tMove(it)} onTouchEnd={tEnd(it)}>
              <div className="ws-face" ref={(el) => { faces.current[it.id] = el; }}><WheelFace it={it} lang={lang} cats={cats} back={it === sel && back} /></div>
              {it.kind !== "scanned" ? <span className="ws-name" dir="auto" style={{ opacity: !sel && i < n - 1 ? 1 : 0 }}>{itemName(it, lang)}</span> : null}
            </button>
          );
        })}
        {sel && n > 1 ? (
          <div className="ws-swaphint" aria-hidden="true" style={{ top: scroll0 + H + 2 }}>
            {items.slice(0, 12).map((x) => <i key={x.id} className={x === sel ? "on" : ""} />)}
          </div>
        ) : null}
        {sel ? (
          <div className={"ws-info" + (swapDir ? " swap" : "")} key={sel.id} style={{ top: scroll0 + H + 18, height: box.h - H - 18 - 108, "--from": swapDir * 40 + "px" }}>
            <CardInfo it={sel} lang={lang} cats={cats} go={go} onRemove={() => onRemove(sel)} setToast={setToast} onFlip={() => flip(faces.current[sel.id])} />
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
  const swipe = useRef(null);
  const cur = items[Math.min(active, items.length - 1)];
  const [back, flip] = useFlip(cur && cur.id);
  const faces = useRef({});
  return (
    <div className="wd">
      <div className="wd-row" ref={row} onScroll={onScroll}>
        {items.map((it, i) => (
          <div key={it.id} className="wd-item" ref={(el) => { els.current[it.id] = el; }}>
            <button type="button" className="wd-card" aria-label={itemName(it, lang)}
              onClick={() => (i === active ? (canFlip(it) ? flip(faces.current[it.id]) : null) : centre(i))}>
              <div className="ws-face" ref={(el) => { faces.current[it.id] = el; }}><WheelFace it={it} lang={lang} cats={cats} back={i === active && back} /></div>
            </button>
          </div>
        ))}
      </div>
      <div className="wd-dots" aria-hidden="true">
        {items.slice(0, 12).map((it, i) => <i key={it.id} className={i === active ? "on" : ""} />)}
      </div>
      {cur ? (
        <div className="wd-info" key={cur.id}
          onTouchStart={(e) => { const p = e.touches[0]; swipe.current = { x: p.clientX, y: p.clientY }; }}
          onTouchEnd={(e) => {
            const t0 = swipe.current; swipe.current = null;
            if (!t0) return;
            const p = e.changedTouches[0];
            const dx = p.clientX - t0.x, dy = p.clientY - t0.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
              const rtl = document.documentElement.dir === "rtl";
              const i = Math.min(active, items.length - 1) + ((dx < 0) !== rtl ? 1 : -1);
              if (i >= 0 && i < items.length) centre(i);
            }
          }}>
          <CardInfo it={cur} lang={lang} cats={cats} go={go} onRemove={() => onRemove(cur)} setToast={setToast} onFlip={() => flip(faces.current[cur.id])} />
        </div>
      ) : null}
    </div>
  );
}

// ---------- look · Bmnassa (default): a dark stage, the chosen card floats in a gold ring ----------
function BmnassaLook({ items, lang, cats, go, startId, onDetails, onScan }) {
  const stage = useRef(null);
  const scroller = useRef(null);
  const els = useRef({});
  const faces = useRef({});
  const [box, setBox] = useState({ w: 350, h: 470 });
  const [active, setActive] = useState(0);
  const act = useRef(-1);
  const cur = items[Math.min(active, items.length - 1)];
  const [back, flip] = useFlip(cur && cur.id);
  useLayoutEffect(() => {
    const m = () => {
      const el = stage.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setBox({ w: el.clientWidth, h: Math.max(380, window.innerHeight - top - 172) });
    };
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const CW = Math.min(400, box.w * 0.84);
  const H = CW / 1.586;
  const STEP = 120; // finger travel per card (slower, calmer scrolling)
  const GAP = 58; // how far apart the cards look
  const paint = () => {
    const sc = scroller.current;
    if (!sc) return;
    const mid = sc.getBoundingClientRect().top + sc.clientHeight / 2;
    let best = 0, bd = Infinity;
    items.forEach((it, i) => {
      const el = els.current[it.id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const d = (r.top + r.height / 2 - mid) / STEP;
      const a = Math.min(Math.abs(d), 4);
      const near = Math.min(a, 1);
      const card = el.firstElementChild;
      if (card) {
        // above: lean back and tuck behind; below: drop under the chosen card so each top edge shows
        const pull = -d * (STEP - GAP); // draw the cards closer together than the scroll distance
        const ty = pull + (d < 0 ? -near * 14 - Math.max(0, a - 1) * 8 : near * (H * 0.5 + 46) + Math.max(0, a - 1) * 6);
        const rx = calm() ? 0 : d < 0 ? Math.min(a, 2) * 20 : -Math.min(a, 1.5) * 9;
        const sc0 = 1 + (1 - near) * 0.04 - a * 0.055;
        card.style.transform = `translateY(${ty}px) perspective(900px) translateZ(${-a * 50}px) rotateX(${rx}deg) scale(${sc0})`;
        card.style.setProperty("--dim", String(d < 0 ? Math.min(0.62, a * 0.24) : Math.min(0.4, a * 0.1)));
        el.style.zIndex = a < 0.5 ? "200" : String(d < 0 ? 100 - Math.round(a * 10) : 60 + Math.round(a * 10));
        card.classList.toggle("on", a < 0.5);
      }
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
    });
    if (best !== act.current) { if (act.current !== -1) haptic(4); act.current = best; setActive(best); }
  };
  const raf = useRef(0);
  const onScroll = () => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(paint); };
  const centre = (i, smooth = true) => {
    const sc = scroller.current, el = items[i] && els.current[items[i].id];
    if (!sc || !el) return;
    sc.scrollTo({ top: el.offsetTop - (sc.clientHeight - STEP) / 2, behavior: smooth && !calm() ? "smooth" : "auto" });
  };
  useLayoutEffect(() => {
    const i = Math.max(0, items.findIndex((x) => x.id === startId));
    centre(i, false);
    paint();
  }, [items.length, box.h]);
  // swipe the front card left or right to flip it, turning the way the finger moves
  const sw = useRef(null);
  const swiped = useRef(false);
  const sStart = (e) => { const p = e.touches[0]; sw.current = { x: p.clientX, y: p.clientY }; };
  const sEnd = (it, i) => (e) => {
    const t0 = sw.current; sw.current = null;
    if (!t0 || i !== active || !canFlip(it)) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - t0.x, dy = p.clientY - t0.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      swiped.current = true;
      flip(faces.current[it.id], dx > 0 ? 1 : -1);
    }
  };
  const tap = (it, i) => {
    if (swiped.current) { swiped.current = false; return; }
    if (i !== active) { haptic(8); centre(i); return; }
    if (canFlip(it)) flip(faces.current[it.id]);
  };
  // the chosen card's quick buttons
  const b = cur && cur.businesses;
  const d0 = (cur && cur.data) || {};
  const digits = (x) => String(x || "").replace(/[^\d]/g, "");
  const phone = b ? b.phone : d0.phone;
  const wa = b ? b.whatsapp || b.phone : d0.whatsapp || d0.phone;
  const n = items.length;
  return (
    <div className="wb">
      <div className="wb-sum">
        <small>{t(lang, "wallet_title")}</small>
        <b>{n === 1 ? t(lang, "wallet_one") : t(lang, "wallet_cards", { n })}</b>
        <div className="wb-sumbtns">
          <button type="button" onClick={onScan}><Icon name="scan" size={15} /> {t(lang, "scan_paper")}</button>
          <button type="button" onClick={() => go("/home")}><Icon name="search" size={15} /> {t(lang, "find_business")}</button>
        </div>
      </div>
      <div className="wb-stage" ref={stage} style={{ height: box.h, "--cw": CW + "px", "--ch": H + "px" }}>
        <div className="wb-glow" aria-hidden="true" />
        <svg className="wb-ring" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: CW + 26, height: H + 30 }}>
          <defs>
            <linearGradient id="wbg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f5c33b" stopOpacity="0" /><stop offset="0.35" stopColor="#f5c33b" /><stop offset="0.65" stopColor="#ffe9a8" /><stop offset="1" stopColor="#f5c33b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="1" y="1" width="98" height="98" rx="9" ry="14" fill="none" stroke="url(#wbg)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" pathLength="100" className="wb-ring-a" />
          <rect x="1" y="1" width="98" height="98" rx="9" ry="14" fill="none" stroke="url(#wbg)" strokeWidth="0.7" vectorEffect="non-scaling-stroke" pathLength="100" className="wb-ring-b" />
        </svg>
        <div className="wb-scroll" ref={scroller} onScroll={onScroll}>
          <div style={{ height: `calc(50% - ${STEP / 2}px)` }} />
          {items.map((it, i) => (
            <div key={it.id} className="wb-item" style={{ height: STEP }} ref={(el) => { els.current[it.id] = el; }}>
              <button type="button" className="wb-card" aria-label={itemName(it, lang)} onClick={() => tap(it, i)} onTouchStart={sStart} onTouchEnd={sEnd(it, i)}>
                <div className="ws-face" ref={(el) => { faces.current[it.id] = el; }}><WheelFace it={it} lang={lang} cats={cats} back={i === active && back} /></div>
                {it.kind !== "scanned" ? <span className="ws-name wb-name" dir="auto">{itemName(it, lang)}</span> : null}
              </button>
            </div>
          ))}
          <div style={{ height: `calc(50% - ${STEP / 2}px)` }} />
        </div>
        {n > 1 ? (
          <div className="wb-dots" aria-hidden="true">
            {items.slice(0, 9).map((x, i) => <i key={x.id} className={i === Math.min(active, 8) ? "on" : ""} />)}
          </div>
        ) : null}
      </div>
      {cur ? (
        <div className="wb-bar" key={cur.id}>
          <span className="grow"><span className="wb-namerow"><b dir="auto">{itemName(cur, lang)}</b><TypeTag it={cur} lang={lang} /></span><small>{canFlip(cur) ? t(lang, "w_tap_flip") : b ? pick(b, "name", lang) : d0.company || ""}</small></span>
          {phone ? <a className="wb-btn gold" href={`tel:${phone}`} aria-label={t(lang, "call")} onClick={() => haptic(10)}><Icon name="phone" size={19} /></a> : null}
          {wa ? <a className="wb-btn wa" href={`https://wa.me/${digits(wa)}`} target="_blank" rel="noreferrer" aria-label={t(lang, "whatsapp")}><Icon name="whatsapp" size={19} /></a> : null}
          <button type="button" className="wb-btn" aria-label={t(lang, "w_details")} onClick={() => onDetails(cur)}><Icon name="more" size={19} /></button>
        </div>
      ) : null}
    </div>
  );
}

function Sheet({ lang, title, onClose, children }) {
  // drawn on the page itself, so a card panel's motion never traps it
  return createPortal(
    <div className={"b-sheet-wrap w-portal" + (document.querySelector(".w-page.look-bmnassa") ? " look-bmnassa" : "")} onClick={onClose}>
      <div className="b-sheet" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="b-sheet-head"><b>{title}</b><button type="button" className="link" onClick={onClose}>{t(lang, "close")}</button></div>
        <div className="stack">{children}</div>
      </div>
    </div>,
    document.body
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
    return ["bmnassa", "stack", "wheel", "deck"].includes(q0) ? q0 : store.get("bm_wallet_look2", "bmnassa");
  });
  const setLook = (v) => { setLookState(v); store.set("bm_wallet_look2", v); setSheet(""); };

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
  }, [rows, q, sort, lang, cats]);
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
  }, [rows, q, sort, look]);
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

  const n = (rows || []).length;
  return (
    <div className={"w-page look-" + look}>
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
      {rows && !n ? (
        <div className="w-empty">
          <div className="w-introstack" aria-hidden="true"><i /><i /><i /></div>
          <b>{t(lang, "wallet_empty")}</b>
          <p>{t(lang, "wallet_empty_sub")}</p>
          <button type="button" className="btn w-dark" onClick={() => go("/home")}>{t(lang, "find_business")}</button>
        </div>
      ) : null}

      {items.length && look === "bmnassa" ? <BmnassaLook items={items} lang={lang} cats={cats} go={go} startId={frontId} onDetails={setDetail} onScan={() => go("/scan")} /> : null}
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
            {look === "bmnassa" ? <CardInfo it={detail} lang={lang} cats={cats} go={go} onRemove={() => remove(detail)} setToast={setToast} />
              : <FrontCard it={detail} lang={lang} cats={cats} go={go} onRemove={() => remove(detail)} refFn={() => {}} />}
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
            {[["bmnassa", "w_bmnassa"], ["stack", "w_stack"], ["wheel", "w_wheel"], ["deck", "w_deck"]].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={look === k} onClick={() => setLook(k)}>{t(lang, label)}</button>
            ))}
          </div>
        </Sheet>
      ) : null}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="wallet" go={go} signedIn />
      <Toast text={toast} />
    </div>
  );
}
