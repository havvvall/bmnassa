// Edit my page → Style: how the business page looks. Goes live on Save, no approval needed.
import React, { useRef, useState } from "react";
import { t, pick } from "../i18n.js";
import { ok } from "../browse/Browse.jsx";
import { updateMyBusiness, uploadImage } from "../api.js";
import { Icon } from "../browse/icons.jsx";
import { cardSettings } from "../card/CardFaces.jsx";
import { pageSettings, pageLook, MAIN_COLOURS, BG_COLOURS } from "../pageStyle.js";

function shrink(file, max = 1600) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error("no image"))), "image/jpeg", 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    img.src = url;
  });
}

function Swatches({ colours, value, onPick, light }) {
  const custom = value && !colours.includes(value.toLowerCase());
  return (
    <div className="st-swatches">
      {colours.map((c) => (
        <button key={c} type="button" className={"st-sw" + (value && value.toLowerCase() === c ? " on" : "") + (light ? " lightsw" : "")}
          style={{ background: c }} aria-label={c} aria-pressed={value && value.toLowerCase() === c} onClick={() => onPick(c)} />
      ))}
      <label className={"st-sw add" + (custom ? " on" : "")} style={custom ? { background: value } : undefined}>
        +<input type="color" value={value || "#ffffff"} onChange={(e) => onPick(e.target.value)} />
      </label>
    </div>
  );
}

export default function PageStyle({ lang, b, setB, setToast }) {
  const [ps, setPs] = useState(() => pageSettings(b));
  const [busy, setBusy] = useState("");
  const file = useRef(null);
  const set = (k, v) => setPs((x) => ({ ...x, [k]: v }));
  const card = cardSettings(b);
  const look = pageLook(ps, card.color);

  const upload = async (f) => {
    if (!f) return;
    setBusy("bg");
    try {
      const blob = await shrink(f);
      const path = await uploadImage(b.id, blob, "page-bg-");
      set("bg_path", path);
    } catch {
      setToast(t(lang, "upload_failed"));
    } finally {
      setBusy("");
    }
  };

  const save = async () => {
    setBusy("save");
    try {
      const row = await updateMyBusiness(b.id, { page_style: ps });
      setB(row);
      setToast(ok(t(lang, "saved_page")));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy("");
    }
  };

  const name = pick(b, "name", lang);

  return (
    <>
      <section className="o-sec">
        <span className="label">{t(lang, "ps_layout")}</span>
        <div className="st-styles">
          {[["centred", "ps_centred"], ["grid", "ps_grid"]].map(([k, label]) => (
            <button key={k} type="button" className={"st-style" + (ps.layout === k ? " on" : "")} aria-pressed={ps.layout === k} onClick={() => set("layout", k)}>
              <span className={"ps-thumb " + k} style={{ "--pg-main": look.style["--pg-main"] }}>
                {k === "centred"
                  ? <><i className="logo" /><i className="l w60" /><i className="l w40" /><span className="btns"><i /><i className="green" /></span></>
                  : <><span className="head"><i className="logo sm" /><i className="l w70" /></span><span className="tiles"><i /><i /><i /><i /></span><i className="bar" /></>}
              </span>
              <b>{t(lang, label)}</b>
              {ps.layout === k ? <span className="st-tick"><Icon name="check" size={12} stroke={3} /></span> : null}
            </button>
          ))}
        </div>
      </section>

      <section className="o-sec">
        <div className="b-row-head"><span className="label">{t(lang, "ps_main")}</span><span className="note">{t(lang, "ps_main_sub")}</span></div>
        <Swatches colours={MAIN_COLOURS} value={ps.same ? card.color : ps.main} onPick={(c) => setPs((x) => ({ ...x, main: c, same: false }))} />
      </section>

      <section className="o-sec">
        <div className="b-row-head"><span className="label">{t(lang, "ps_bg")}</span><span className="note">{t(lang, "ps_bg_sub")}</span></div>
        <Swatches colours={BG_COLOURS} value={ps.bg_path ? "" : ps.bg || "#d9dce0"} light onPick={(c) => setPs((x) => ({ ...x, bg: c, bg_path: "" }))} />
        <div className="st-opts">
          <button type="button" className={"st-opt" + (ps.bg_path ? " on" : "")} disabled={busy === "bg"} onClick={() => file.current && file.current.click()}>
            <Icon name="image" size={16} /> {busy === "bg" ? t(lang, "uploading") : t(lang, "ps_bg_photo")}
          </button>
          {ps.bg_path ? <button type="button" className="link" onClick={() => set("bg_path", "")}>{t(lang, "ps_remove_photo")}</button> : null}
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files && e.target.files[0]); e.target.value = ""; }} />
        </div>
      </section>

      <section className="o-sec">
        <span className="label">{t(lang, "ps_buttons")}</span>
        <div className="st-opts">
          {[["rounded", "ps_rounded"], ["square", "ps_square"], ["pill", "ps_pill"]].map(([k, label]) => (
            <button key={k} type="button" className={"st-opt" + (ps.buttons === k ? " on" : "")} onClick={() => set("buttons", k)}>{t(lang, label)}</button>
          ))}
        </div>
        <label className="ps-toggle">
          <span>{t(lang, "ps_same")}</span>
          <input type="checkbox" role="switch" checked={ps.same} onChange={(e) => set("same", e.target.checked)} />
        </label>
      </section>

      <div className={"ps-preview " + look.cls} style={{ ...look.style, backgroundImage: look.bgImage || undefined, backgroundColor: ps.bg || undefined }}>
        <span className="ps-av">{(name.trim().charAt(0) || "B").toUpperCase()}</span>
        <span className="grow"><b><bdi>{name}</bdi></b><small>{t(lang, "ps_preview")}</small></span>
        <span className="ps-call">{t(lang, "call")}</span>
      </div>

      <p className="note" style={{ textAlign: "center" }}>{t(lang, "ps_note")}</p>
      <div className="o-savebar">
        <button type="button" className="btn" disabled={!!busy} onClick={save}>{busy === "save" ? t(lang, "loading") : t(lang, "save")}</button>
      </div>
    </>
  );
}
