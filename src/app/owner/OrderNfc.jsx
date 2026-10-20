// Slice 7 · ordering printed NFC cards (/my/:id/nfc). The team calls to confirm and arrange payment before printing.
import React, { useEffect, useState } from "react";
import { t, pick } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useLists, useToast, Toast } from "../browse/Browse.jsx";
import { NfcCard, cardSettings, cardRole } from "../card/CardFaces.jsx";
import { getMyOrders, placeOrder, cancelOrder, normalisePhone, prettyPhone, NFC_PRICE_USD, PAYMENTS } from "../api.js";
import { useMine, Loading, Missing, Back } from "./Owner.jsx";
import { calm } from "../motion.js";

const usd = (n) => "$" + Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

export default function OrderNfc({ lang, id, go }) {
  const [b, , err, reload] = useMine(id);
  const [lists] = useLists();
  const [orders, setOrders] = useState(null);
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(null);
  const [toast, setToast] = useToast();

  useEffect(() => { getMyOrders(id).then((r) => setOrders(r || [])).catch(() => setOrders([])); }, [id]);
  useEffect(() => {
    if (!b || form) return;
    const cat = lists && lists.cats.find((c) => c.id === b.category_id);
    setForm({
      name_on_card: b.contact_name || pick(b, "name", lang),
      title_on_card: cardRole(b, cat, "en", cardSettings(b)) || "",
      quantity: 1,
      delivery_address: b.address || "",
      phone: b.phone ? prettyPhone(b.phone) : "",
      payment: "cash",
    });
  }, [b, lists]);

  if (b === null) return <Missing lang={lang} go={go} />;
  if (b === undefined || !form) return <Loading lang={lang} err={err} reload={reload} go={go} />;

  const live = b.status === "approved" && b.handle;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const s = cardSettings(b);
  const preview = { ...b, contact_name: form.name_on_card || " " };
  const cat = lists && lists.cats.find((c) => c.id === b.category_id);

  const submit = async () => {
    const phone = normalisePhone(form.phone);
    if (!form.name_on_card.trim() || form.delivery_address.trim().length < 3 || !phone) { setToast(t(lang, "nfc_fill")); return; }
    setBusy(true);
    try {
      const row = await placeOrder(b.id, { ...form, name_on_card: form.name_on_card.trim(), title_on_card: form.title_on_card.trim(), delivery_address: form.delivery_address.trim(), phone });
      setOrders((o) => [row, ...(o || [])]);
      setSent(row);
      if (navigator.vibrate && !calm()) navigator.vibrate(20);
      window.scrollTo(0, 0);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy(false);
    }
  };
  const cancel = async (o) => {
    try {
      const row = await cancelOrder(o.id);
      setOrders((x) => x.map((y) => (y.id === o.id ? { ...y, ...row } : y)));
      setToast(t(lang, "nfc_cancelled_toast"));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    }
  };

  const list = (orders || []).length ? (
    <section className="o-sec">
      <span className="label">{t(lang, "nfc_orders")}</span>
      <div className="panel nf-orders">
        {orders.map((o) => (
          <div key={o.id} className="nf-order">
            <span className="grow">
              <b dir="auto">{o.name_on_card}</b>
              <small>{t(lang, "nfc_cards_n", { n: o.quantity })} · {usd(o.quantity * o.unit_price_usd)} · {new Date(o.created_at).toLocaleDateString(lang === "en" ? "en-GB" : lang === "ku" ? "ckb-IQ" : "ar-IQ", { day: "numeric", month: "short" })}</small>
            </span>
            <span className={"nf-status " + o.status}>{t(lang, "os_" + o.status)}</span>
            {o.status === "new" ? <button type="button" className="link danger nf-cancel" onClick={() => cancel(o)}>{t(lang, "nfc_cancel")}</button> : null}
          </div>
        ))}
      </div>
    </section>
  ) : null;

  if (sent) {
    return (
      <div className="o-page">
        <div className="o-head"><Back lang={lang} onClick={() => go(`/my/${b.id}`)} /><b>{t(lang, "nfc_title")}</b></div>
        <div className="nf-done">
          <span className="nf-check"><Icon name="check" size={30} stroke={3} /></span>
          <b>{t(lang, "nfc_sent_title")}</b>
          <p>{t(lang, "nfc_sent_sub", { phone: prettyPhone(sent.phone) })}</p>
        </div>
        {list}
        <button type="button" className="btn ghost" onClick={() => setSent(null)}>{t(lang, "order_another")}</button>
        <button type="button" className="btn" onClick={() => go(`/my/${b.id}`)}>{t(lang, "done")}</button>
        <Toast text={toast} />
      </div>
    );
  }

  return (
    <div className="o-page">
      <div className="o-head"><Back lang={lang} onClick={() => go(`/my/${b.id}`)} /><b>{t(lang, "nfc_title")}</b></div>

      <div className="nf-preview"><NfcCard b={preview} s={{ ...s, title: form.title_on_card || s.title }} lang={lang} cat={cat} linksOnly /></div>
      <p className="note" style={{ textAlign: "center", marginTop: -6 }}>{t(lang, "nfc_sub")}</p>

      {!live ? <div className="o-banner wait">{t(lang, "nfc_need_live")}</div> : null}

      <label className="o-sec">
        <span className="label">{t(lang, "nfc_name")}</span>
        <input className="field" dir="auto" maxLength={60} value={form.name_on_card} onChange={(e) => set("name_on_card", e.target.value)} />
      </label>
      <label className="o-sec">
        <span className="label">{t(lang, "nfc_role")}</span>
        <input className="field" dir="auto" maxLength={80} value={form.title_on_card} onChange={(e) => set("title_on_card", e.target.value)} />
      </label>

      <div className="nf-qty">
        <span className="grow"><b>{t(lang, "nfc_qty")}</b><small>{t(lang, "nfc_each", { p: NFC_PRICE_USD })}</small></span>
        <button type="button" className="nf-step" aria-label="−" disabled={form.quantity <= 1} onClick={() => set("quantity", Math.max(1, form.quantity - 1))}>−</button>
        <b className="nf-n ltr" aria-live="polite">{form.quantity}</b>
        <button type="button" className="nf-step" aria-label="+" disabled={form.quantity >= 50} onClick={() => set("quantity", Math.min(50, form.quantity + 1))}>+</button>
      </div>

      <label className="o-sec">
        <span className="label">{t(lang, "nfc_address")}</span>
        <input className="field" dir="auto" maxLength={300} placeholder={t(lang, "nfc_address_ph")} value={form.delivery_address} onChange={(e) => set("delivery_address", e.target.value)} />
      </label>
      <label className="o-sec">
        <span className="label">{t(lang, "nfc_phone")}</span>
        <input className="field ltr" type="tel" inputMode="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </label>

      <section className="o-sec">
        <span className="label">{t(lang, "nfc_payment")}</span>
        <div className="nf-pay" role="radiogroup" aria-label={t(lang, "nfc_payment")}>
          {PAYMENTS.map((p) => (
            <button key={p} type="button" role="radio" aria-checked={form.payment === p} className={"nf-payopt" + (p === "cash" ? " wide" : "") + (form.payment === p ? " on" : "")} onClick={() => set("payment", p)}>
              <span className="nf-radio" />{t(lang, "pay_" + p)}
            </button>
          ))}
        </div>
        <p className="note" style={{ margin: 0 }}>{t(lang, "nfc_pay_note")}</p>
      </section>

      {list}

      <div className="o-savebar nf-bar">
        <div className="nf-total"><span>{t(lang, "nfc_total")}</span><b className="ltr">{usd(form.quantity * NFC_PRICE_USD)}</b></div>
        <button type="button" className="btn" disabled={busy || !live} onClick={submit}>{busy ? t(lang, "loading") : t(lang, "nfc_place")}</button>
        <p className="note" style={{ textAlign: "center", margin: "6px 0 0" }}>{t(lang, "nfc_confirm_note")}</p>
      </div>
      <Toast text={toast} />
    </div>
  );
}
