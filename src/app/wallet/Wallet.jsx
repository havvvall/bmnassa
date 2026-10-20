// Slice 7 · the wallet (/wallet): every card the person saved, as a stack. Tap a card to bring it to the front;
// the front card turns over to its QR code, opens the full card, or is removed. Scanned paper cards arrive in part 3.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { t, pick } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useLists, useToast, Toast, BottomNav } from "../browse/Browse.jsx";
import { NfcCard, cardSettings, surface, surfaceClass } from "../card/CardFaces.jsx";
import { getWallet, getSession, walletItemFor, saveToWallet, removeFromWallet, prettyPhone, scanImageUrl, removeScanPhotos } from "../api.js";
import { calm, ms, ease, flipCard } from "../motion.js";
import "./wallet.css";

const byId = (rows) => Object.fromEntries((rows || []).map((r) => [r.id, r]));
const store = {
  get: (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* fine */ } },
};

// "Save to wallet" for a business page or card. Not signed in: sign in first, then come back here.
export function SaveToWallet({ b, lang, go, setToast, className = "b-chip", dark }) {
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
      setToast(t(lang, "saved_wallet"));
      if (navigator.vibrate && !calm()) navigator.vibrate(20);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy(false);
    }
  };
  return (
    <button type="button" className={className + (id ? " saved" : "") + (dark ? " dark" : "")} disabled={busy} onClick={tap}>
      <Icon name={id ? "check" : "wallet"} size={15} stroke={id ? 3 : 2} /> {t(lang, id ? "in_wallet" : "save_wallet")}
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
        card.style.transform = `translateY(${ty}px) scale(${1 - a * 0.075})`;
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
    if (!items.length) return;
    const start = frontId && items.find((x) => x.id === frontId) ? frontId : items[0].id;
    centre(start, false);
    paint();
  }, [rows, q, sort]);
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
    <div className="w-page">
      <div className="w-backdrop" aria-hidden="true" />
      <div className="w-head">
        <h1>{t(lang, "wallet_title")}</h1>
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

      {items.length ? (
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

      {rows && n ? (
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
        </Sheet>
      ) : null}

      <div className="b-navspace" />
      <BottomNav lang={lang} active="wallet" go={go} signedIn />
      <Toast text={toast} />
    </div>
  );
}
