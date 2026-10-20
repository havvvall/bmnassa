// Slice 7 · scanning a paper card into the wallet (/scan), and editing a scanned card (/scan/edit/:id).
// Camera (front, then back) → cleanup on the phone + Claude reads the details → check the details → save.
import React, { useEffect, useRef, useState } from "react";
import { t } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useToast, Toast } from "../browse/Browse.jsx";
import {
  scanCard, uploadScan, addScannedCard, updateScannedCard, getWalletItem, scanImageUrl, normalisePhone, forgetWallet,
} from "../api.js";
import { toCanvas, fileToCanvas, toBlob, toBase64, cleanCard, detectCorners, FULL } from "./image.js";
import { calm } from "../motion.js";
import "./scan.css";

// Reading the details with Claude (the scan-card function). Off until Anthropic billing is set up:
// people type the details themselves. Turn on by changing this to true.
export const READ_WITH_AI = false;

const FIELDS = [
  ["name", "f_name", "text"], ["company", "f_company", "text"], ["title", "f_job", "text"],
  ["phone", "f_phone", "tel"], ["whatsapp", "f_whatsapp", "tel"], ["email", "f_email", "email"],
  ["website", "f_website", "url"], ["instagram", "f_instagram", "text"], ["address", "f_address", "text"],
];

// ---------- 1. the camera ----------
function Camera({ lang, side, onShot, onSkip, onClose }) {
  const video = useRef(null);
  const frame = useRef(null);
  const file = useRef(null);
  const [stream, setStream] = useState(null);
  const [blocked, setBlocked] = useState(false);
  const [torch, setTorch] = useState(false);
  const [canTorch, setCanTorch] = useState(false);

  useEffect(() => {
    let s = null, stop = false;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { setBlocked(true); return undefined; }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false })
      .then((st) => {
        if (stop) { st.getTracks().forEach((x) => x.stop()); return; }
        s = st; setStream(st);
        if (video.current) { video.current.srcObject = st; video.current.play().catch(() => {}); }
        const track = st.getVideoTracks()[0];
        const caps = track && track.getCapabilities ? track.getCapabilities() : {};
        setCanTorch(!!caps.torch);
      })
      .catch(() => setBlocked(true));
    return () => { stop = true; if (s) s.getTracks().forEach((x) => x.stop()); };
  }, []);

  const toggleTorch = () => {
    const track = stream && stream.getVideoTracks()[0];
    if (!track) return;
    track.applyConstraints({ advanced: [{ torch: !torch }] }).then(() => setTorch(!torch)).catch(() => {});
  };

  // Keeps what is inside the gold frame, plus a margin, so the card fills the photo
  const shoot = () => {
    const v = video.current, f = frame.current;
    if (!v || !v.videoWidth || !f) return;
    const vr = v.getBoundingClientRect(), fr = f.getBoundingClientRect();
    const k = Math.max(vr.width / v.videoWidth, vr.height / v.videoHeight); // object-fit: cover
    const ox = (v.videoWidth * k - vr.width) / 2, oy = (v.videoHeight * k - vr.height) / 2;
    const m = 0.12;
    let x = (fr.left - vr.left - fr.width * m + ox) / k, y = (fr.top - vr.top - fr.height * m + oy) / k;
    let w = (fr.width * (1 + 2 * m)) / k, h = (fr.height * (1 + 2 * m)) / k;
    x = Math.max(0, x); y = Math.max(0, y); w = Math.min(v.videoWidth - x, w); h = Math.min(v.videoHeight - y, h);
    const c = toCanvas(v, 1600, { x, y, w, h });
    if (navigator.vibrate && !calm()) navigator.vibrate(10);
    onShot(c);
  };
  const pick = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (f) onShot(await fileToCanvas(f, 1600));
  };

  return (
    <div className="sc-cam">
      <video ref={video} className="sc-video" playsInline muted autoPlay />
      <div className="sc-camtop">
        <button type="button" className="sc-cbtn" aria-label={t(lang, "close")} onClick={onClose}><Icon name="plus" size={20} style={{ transform: "rotate(45deg)" }} /></button>
        <span>{t(lang, side === "front" ? "scan_front" : "scan_back")}</span>
        {canTorch ? <button type="button" className={"sc-cbtn" + (torch ? " on" : "")} aria-label={t(lang, "flash")} onClick={toggleTorch}><Icon name="spark" size={18} /></button> : <span className="sc-cbtn ghost" />}
      </div>
      <div className="sc-framewrap">
        <div className="sc-frame" ref={frame}><i /><i /><i /><i /></div>
        <p>{blocked ? t(lang, "camera_blocked") : <>{t(lang, "scan_place")}<br />{t(lang, "scan_light")}</>}</p>
        <div className="sc-steps">
          <span className={side === "front" ? "on" : "done"}>{t(lang, "scan_step_front")}</span>
          <span className={side === "back" ? "on" : ""}>{t(lang, "scan_step_back")}</span>
        </div>
      </div>
      <div className="sc-bar">
        <button type="button" className="sc-side" onClick={() => file.current && file.current.click()}><Icon name="image" size={20} /><span>{t(lang, "upload")}</span></button>
        <button type="button" className="sc-shutter" aria-label={t(lang, "take_photo")} disabled={!stream} onClick={shoot}><i /></button>
        {side === "back" ? <button type="button" className="sc-side" onClick={onSkip}><Icon name="chevron" size={20} className="flip" /><span>{t(lang, "skip_back")}</span></button> : <span className="sc-side" />}
        <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
      </div>
    </div>
  );
}

// ---------- 2. cleanup (+ reading, when AI is on) ----------

// Drag the four gold handles onto the card's corners
function Corners({ lang, shot, corners, onDone, onCancel }) {
  const [pts, setPts] = useState(corners || FULL);
  const box = useRef(null);
  const drag = useRef(-1);
  const url = useRef(shot.toDataURL("image/jpeg", 0.8));
  const move = (e) => {
    if (drag.current < 0 || !box.current) return;
    const r = box.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    const x = Math.min(1, Math.max(0, (p.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (p.clientY - r.top) / r.height));
    setPts((v) => v.map((q, i) => (i === drag.current ? [x, y] : q)));
    if (e.cancelable) e.preventDefault();
  };
  const up = () => { drag.current = -1; };
  return (
    <div className="sc-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onCancel}><Icon name="back" size={18} className="flip" /></button>
        <div className="grow"><h1 className="sc-h1">{t(lang, "adjust_corners")}</h1><p className="sc-sub">{t(lang, "adjust_sub")}</p></div>
      </div>
      <div className="sc-adjust" ref={box} style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
        onPointerMove={move} onPointerUp={up} onPointerLeave={up} onTouchMove={move} onTouchEnd={up}>
        <img src={url.current} alt="" draggable={false} />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polygon points={pts.map(([x, y]) => `${x * 100},${y * 100}`).join(" ")} />
        </svg>
        {pts.map(([x, y], i) => (
          <span key={i} className="sc-handle" style={{ left: `${x * 100}%`, top: `${y * 100}%` }}
            onPointerDown={(e) => { drag.current = i; e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId); }}
            onTouchStart={() => { drag.current = i; }} />
        ))}
      </div>
      <div className="sc-two">
        <button type="button" className="btn ghost" onClick={() => setPts(FULL)}>{t(lang, "reset")}</button>
        <button type="button" className="btn" onClick={() => onDone(pts)}>{t(lang, "done")}</button>
      </div>
    </div>
  );
}

function Enhance({ lang, shots, onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [corners, setCorners] = useState(null); // { front, back }
  const [adjust, setAdjust] = useState(""); // "front" | "back" while dragging corners
  const ai = useRef(null);
  const ran = useRef(false);
  const steps = READ_WITH_AI ? 4 : 3;

  const build = (c, aiRes, err) => {
    const front = cleanCard(shots.front, c.front);
    const back = shots.back ? cleanCard(shots.back, c.back) : null;
    setResult({
      ai: aiRes, err, front: front.canvas, back: back && back.canvas,
      after: front.canvas.toDataURL("image/jpeg", 0.8), afterBack: back && back.canvas.toDataURL("image/jpeg", 0.8),
    });
  };

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const tick = setInterval(() => setStep((s) => Math.min(steps - 1, s + 1)), 550);
    (async () => {
      let aiRes = null, err = "";
      if (READ_WITH_AI) {
        try {
          aiRes = await scanCard(toBase64(shots.front), shots.back ? toBase64(shots.back) : null);
        } catch (e) {
          err = e.code === "limit" ? "scan_limit" : e.code === "no_key" || e.status === 404 ? "scan_not_ready" : "scan_read_failed";
        }
      }
      await new Promise((r) => setTimeout(r, READ_WITH_AI ? 300 : 1400));
      const c = {
        front: (aiRes && aiRes.front_corners) || detectCorners(shots.front),
        back: shots.back ? (aiRes && aiRes.back_corners) || detectCorners(shots.back) : null,
      };
      ai.current = { aiRes, err };
      clearInterval(tick);
      setStep(steps);
      setCorners(c);
      build(c, aiRes, err);
    })();
    return () => clearInterval(tick);
  }, []);

  if (adjust) {
    return (
      <Corners lang={lang} shot={shots[adjust]} corners={corners && corners[adjust]} onCancel={() => setAdjust("")}
        onDone={(pts) => { const c = { ...corners, [adjust]: pts }; setCorners(c); setAdjust(""); build(c, ai.current.aiRes, ai.current.err); }} />
    );
  }

  const what = [["enh_1", "enh_1s"], ["enh_2", "enh_2s"], ["enh_3", "enh_3s"], ...(READ_WITH_AI ? [["enh_4", "enh_4s"]] : [])];
  const before = (c) => <canvas ref={(el) => { if (el && c && !el.dataset.done) { el.width = c.width; el.height = c.height; el.getContext("2d").drawImage(c, 0, 0); el.dataset.done = "1"; } }} />;
  return (
    <div className="sc-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onBack}><Icon name="back" size={18} className="flip" /></button>
        <div className="grow"><h1 className="sc-h1">{t(lang, "enh_title")}</h1><p className="sc-sub">{t(lang, "enh_sub")}</p></div>
      </div>
      <div className="sc-ba">
        <figure><div className="sc-bimg">{before(shots.front)}</div><figcaption>{t(lang, "your_photo")}</figcaption></figure>
        <span className="sc-arrow">›</span>
        <figure><div className="sc-bimg after">{result ? <img src={result.after} alt="" /> : <span className="sc-skel" />}</div><figcaption className="gold"><Icon name="spark" size={13} /> {t(lang, "after_clean")}</figcaption></figure>
      </div>
      {result ? (
        <div className="sc-adjrow">
          <button type="button" className="b-chip" onClick={() => setAdjust("front")}><Icon name="rows" size={15} /> {t(lang, shots.back ? "adjust_front" : "adjust_corners")}</button>
          {shots.back ? <button type="button" className="b-chip" onClick={() => setAdjust("back")}><Icon name="rows" size={15} /> {t(lang, "adjust_back")}</button> : null}
        </div>
      ) : null}
      <div className="panel sc-what">
        <b className="sc-whath">{t(lang, "enh_what")}</b>
        {what.map(([k, sub], i) => (
          <div key={k} className={"sc-wrow" + (step > i ? " done" : step === i ? " now" : "")}>
            <span className="sc-dot">{step > i ? <Icon name="check" size={13} stroke={3} /> : null}</span>
            <span className="grow"><b>{t(lang, k)}</b><small>{t(lang, sub)}</small></span>
          </div>
        ))}
      </div>
      <p className="sc-note">{t(lang, "enh_note")}</p>
      <div className="sc-two">
        <button type="button" className="btn ghost" disabled={!result} onClick={() => onDone({ ...result, front: shots.front, back: shots.back })}>{t(lang, "use_original")}</button>
        <button type="button" className="btn" disabled={!result} onClick={() => onDone(result)}>{result ? t(lang, "looks_good") : t(lang, READ_WITH_AI ? "reading" : "loading")}</button>
      </div>
    </div>
  );
}

// ---------- 3. check the details (also used to edit a saved scanned card) ----------
function fromAi(ai) {
  if (!ai) return {};
  const phones = ai.phones || [];
  return {
    name: ai.name || "", name_other: ai.name_other || "", company: ai.company || "", title: ai.title || "",
    phone: phones[0] || "", phone2: phones[1] || "", whatsapp: ai.whatsapp || "", email: ai.email || "",
    website: ai.website || "", instagram: ai.instagram || "", address: ai.address || "", language: ai.language || "",
  };
}

function Check({ lang, title, sub, front, back, initial, aiFilled, warn, onBack, onSave, busy }) {
  const [d, setD] = useState(initial);
  const [toast, setToast] = useToast();
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  const save = () => {
    if (!(d.name || "").trim() && !(d.company || "").trim()) { setToast(t(lang, "name_needed")); return; }
    const clean = {};
    for (const [k, v] of Object.entries(d)) if (typeof v === "string" && v.trim()) clean[k] = v.trim();
    for (const k of ["phone", "phone2", "whatsapp"]) if (clean[k]) clean[k] = normalisePhone(clean[k]) || clean[k];
    if (clean.instagram) clean.instagram = clean.instagram.replace(/^@/, "");
    onSave(clean);
  };
  return (
    <div className="sc-page">
      <div className="b-top">
        <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onBack}><Icon name="back" size={18} className="flip" /></button>
        <div className="grow"><h1 className="sc-h1">{title}</h1><p className="sc-sub">{sub}</p></div>
      </div>
      {front ? (
        <>
          <div className="sc-thumbs">
            <div className="sc-thumb"><img src={front} alt="" /></div>
            {back ? <div className="sc-thumb"><img src={back} alt="" /></div> : null}
          </div>
          {back ? <p className="sc-flipnote"><Icon name="flip" size={14} /> {t(lang, "check_flip")}</p> : null}
        </>
      ) : null}
      {warn ? <div className="sc-warn">{t(lang, warn)}</div> : null}
      <div className="sc-fields">
        {FIELDS.map(([k, label, type]) => (
          <label key={k} className="sc-field">
            <span className="sc-label">{t(lang, label)}{aiFilled && aiFilled[k] ? <em className="sc-ai"><Icon name="spark" size={10} /> {t(lang, "ai_badge")}</em> : null}</span>
            <input className="field" type={type} dir={type === "text" ? "auto" : "ltr"} value={d[k] || ""} onChange={(e) => set(k, e.target.value)}
              inputMode={type === "tel" ? "tel" : type === "email" ? "email" : undefined} autoComplete="off" />
          </label>
        ))}
      </div>
      {aiFilled && Object.keys(aiFilled).length ? <div className="sc-warn soft">{t(lang, "ai_warn")}</div> : null}
      <div className="o-savebar">
        <button type="button" className="btn" disabled={busy} onClick={save}><Icon name="wallet" size={18} /> {busy ? t(lang, "saving") : t(lang, "save_my_wallet")}</button>
      </div>
      <Toast text={toast} />
    </div>
  );
}

// ---------- the flow ----------
export function ScanPage({ lang, go, back, signedIn }) {
  const [step, setStep] = useState("front");
  const [shots, setShots] = useState({ front: null, back: null });
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useToast();

  useEffect(() => {
    if (!signedIn) { try { sessionStorage.setItem("bm_after", "/scan"); } catch { /* ignore */ } go("/signin", true); }
  }, [signedIn]);
  if (!signedIn) return null;
  const close = () => (window.history.length > 1 ? back() : go("/wallet"));

  if (step === "front" || step === "back") {
    return (
      <Camera key={step} lang={lang} side={step} onClose={close}
        onShot={(c) => { setShots((s) => ({ ...s, [step]: c })); setStep(step === "front" ? "back" : "enhance"); }}
        onSkip={() => setStep("enhance")} />
    );
  }
  if (step === "enhance") {
    return <Enhance lang={lang} shots={shots} onBack={() => { setShots({ front: null, back: null }); setStep("front"); }} onDone={(r) => { setRes(r); setStep("check"); }} />;
  }

  const initial = fromAi(res && res.ai);
  const aiFilled = Object.fromEntries(Object.entries(initial).filter(([, v]) => v).map(([k]) => [k, true]));
  const save = async (data) => {
    setBusy(true);
    try {
      const frontPath = await uploadScan(await toBlob(res.front), "front");
      const backPath = res.back ? await uploadScan(await toBlob(res.back), "back") : null;
      const row = await addScannedCard({ ...data, ...(backPath ? { back_path: backPath } : {}) }, frontPath);
      forgetWallet();
      try { sessionStorage.setItem("bm_wallet_front", String(row && row.id)); } catch { /* ignore */ }
      setToast(t(lang, "scan_saved"));
      setTimeout(() => go("/wallet", true), 500);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
      setBusy(false);
    }
  };
  return (
    <>
      <Check lang={lang} title={t(lang, "check_title")} sub={res && res.ai ? t(lang, "check_sub") : t(lang, "check_sub_manual")}
        front={res && res.front.toDataURL("image/jpeg", 0.7)} back={res && res.back && res.back.toDataURL("image/jpeg", 0.7)}
        initial={initial} aiFilled={aiFilled} warn={READ_WITH_AI ? res && res.err : ""} busy={busy}
        onBack={() => setStep("enhance")} onSave={save} />
      <Toast text={toast} />
    </>
  );
}

export function EditScanPage({ lang, id, go, back }) {
  const [item, setItem] = useState(undefined);
  const [imgs, setImgs] = useState({});
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useToast();
  useEffect(() => {
    getWalletItem(id).then(async (r) => {
      setItem(r || null);
      if (r) setImgs({ front: await scanImageUrl(r.image_path), back: await scanImageUrl(r.data && r.data.back_path) });
    }).catch(() => setItem(null));
  }, [id]);
  if (item === undefined) return <div className="sc-page"><p className="note">{t(lang, "loading")}</p></div>;
  if (!item || item.kind !== "scanned") { go("/wallet", true); return null; }
  const exit = () => (window.history.length > 1 ? back() : go("/wallet"));
  const save = async (data) => {
    setBusy(true);
    try {
      await updateScannedCard(item.id, { ...data, ...(item.data && item.data.back_path ? { back_path: item.data.back_path } : {}) });
      setToast(t(lang, "saved"));
      setTimeout(exit, 400);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
      setBusy(false);
    }
  };
  return (
    <>
      <Check lang={lang} title={t(lang, "edit_details")} sub={(item.data && (item.data.name || item.data.company)) || ""}
        front={imgs.front} back={imgs.back} initial={item.data || {}} busy={busy} onBack={exit} onSave={save} />
      <Toast text={toast} />
    </>
  );
}
