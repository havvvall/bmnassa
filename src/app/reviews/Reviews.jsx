// Slice 7 · reviews: the summary on a business page, the full list (/name/reviews) and writing one (/name/rate).
// Only people who tapped Call or WhatsApp on the business while signed in can rate it (checked again by the database).
import React, { useEffect, useState } from "react";
import { t, pick, ago } from "../i18n.js";
import { Icon } from "../browse/icons.jsx";
import { useBusiness, useToast, Toast, NotFound, waLink } from "../browse/Browse.jsx";
import {
  getReviews, getMyReview, getMyContact, saveReview, deleteReview, replyToReview,
  myUserId, track, REVIEW_TAGS,
} from "../api.js";
import "./reviews.css";

export function Stars({ value, size = 14 }) {
  const v = Math.round(Number(value) || 0);
  return (
    <span className="rv-stars" aria-label={`${Number(value || 0).toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="star" size={size} stroke={0} className={i <= v ? "on" : ""} style={{ fill: "currentColor" }} />
      ))}
    </span>
  );
}

function ReviewItem({ r, lang, canReply, onReplied, setToast }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(r.owner_reply || "");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true);
    try {
      const row = await replyToReview(r.id, text.trim());
      onReplied(row || { ...r, owner_reply: text.trim() || null });
      setOpen(false);
      setToast(t(lang, "reply_sent"));
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
    } finally {
      setBusy(false);
    }
  };
  const name = r.first_name || "·";
  return (
    <article className="rv-item">
      <div className="rv-who">
        <span className="rv-av" aria-hidden="true">{name.charAt(0).toUpperCase()}</span>
        <span className="grow">
          <b dir="auto">{name}</b>
          <small>{r.contact_kind ? t(lang, r.contact_kind === "whatsapp" ? "contacted_whatsapp" : "contacted_call") + " · " : ""}{ago(lang, r.created_at)}</small>
        </span>
      </div>
      <Stars value={r.rating} />
      {r.tags && r.tags.length ? <div className="rv-tags">{r.tags.map((x) => <span key={x}>{t(lang, "tag_" + x)}</span>)}</div> : null}
      {r.body ? <p dir="auto">{r.body}</p> : null}
      {r.owner_reply && !open ? (
        <div className="rv-reply"><b>{t(lang, "owner_reply")}</b> <span dir="auto">{r.owner_reply}</span></div>
      ) : null}
      {canReply && !open ? (
        <button type="button" className="link rv-replybtn" onClick={() => setOpen(true)}>{t(lang, r.owner_reply ? "edit_reply" : "reply")}</button>
      ) : null}
      {open ? (
        <div className="rv-replybox">
          <textarea className="field" rows={3} maxLength={400} dir="auto" value={text} placeholder={t(lang, "reply_ph")} onChange={(e) => setText(e.target.value)} />
          <div className="rv-row">
            <button type="button" className="link" onClick={() => { setOpen(false); setText(r.owner_reply || ""); }}>{t(lang, "cancel")}</button>
            <span className="grow" />
            <button type="button" className="btn small" disabled={busy} onClick={send}>{busy ? t(lang, "loading") : t(lang, "send_reply")}</button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function useReviews(b) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    if (!b || !b.id) return;
    getReviews(b.id).then((r) => setRows(r || [])).catch(() => setRows([]));
  }, [b && b.id]);
  return [rows, setRows];
}

// On the business page: average, count and the two newest reviews.
export function ReviewsSummary({ b, lang, go }) {
  const [rows] = useReviews(b);
  const n = Number(b.reviews) || 0;
  const mine = myUserId() && b.owner_id === myUserId();
  return (
    <section className="rv-sum">
      <div className="rv-sumhead">
        <span className="label">{t(lang, "reviews_short")}</span>
        {n ? <span className="rv-avg"><b>{Number(b.rating || 0).toFixed(1)}</b><Stars value={b.rating} size={13} /><small>{t(lang, "reviews_n", { n })}</small></span> : null}
      </div>
      {!n ? <p className="b-muted">{t(lang, "no_reviews_yet", { name: pick(b, "name", lang) })}</p> : null}
      {rows && rows.slice(0, 2).map((r) => (
        <div key={r.id} className="rv-mini">
          <div className="rv-row"><b dir="auto">{r.first_name}</b><Stars value={r.rating} size={12} /><span className="grow" /><small>{ago(lang, r.created_at)}</small></div>
          {r.body ? <p dir="auto">{r.body}</p> : null}
        </div>
      ))}
      <div className="b-chips wrap" style={{ marginTop: 10 }}>
        {n ? <button type="button" className="b-chip" onClick={() => go(`/${b.handle}/reviews`)}>{t(lang, "see_all_reviews", { n })}</button> : null}
        {mine ? null : <button type="button" className="b-chip" onClick={() => go(`/${b.handle}/rate`)}><Icon name="star" size={15} /> {t(lang, "rate_this")}</button>}
      </div>
    </section>
  );
}

function Top({ lang, title, onBack }) {
  return (
    <div className="b-top">
      <button type="button" className="rbtn" aria-label={t(lang, "back")} onClick={onBack}><Icon name="back" size={18} className="flip" /></button>
      <h1 className="rv-title grow">{title}</h1>
    </div>
  );
}

function Wait({ lang, err, reload }) {
  return (
    <div className="b-page">
      <p className="note">{err ? t(lang, "load_failed") : t(lang, "loading")}</p>
      {err ? <button type="button" className="link" onClick={reload}>{t(lang, "try_again")}</button> : null}
    </div>
  );
}

// /name/reviews: the rating breakdown and every live review. The owner can reply here.
export function ReviewsPage({ lang, handle, go, back }) {
  const [b, err, reload] = useBusiness(handle);
  const [rows, setRows] = useReviews(b);
  const [mineRow, setMineRow] = useState(null);
  const [toast, setToast] = useToast();
  useEffect(() => { if (b && b.id && myUserId()) getMyReview(b.id).then(setMineRow).catch(() => {}); }, [b && b.id]);

  if (b === null) return <NotFound lang={lang} go={go} />;
  if (b === undefined) return <Wait lang={lang} err={err} reload={reload} />;

  const owner = !!myUserId() && b.owner_id === myUserId();
  const list = rows || [];
  const n = list.length;
  const avg = n ? list.reduce((a, r) => a + r.rating, 0) / n : 0;
  const counts = [5, 4, 3, 2, 1].map((s) => [s, list.filter((r) => r.rating === s).length]);
  const tagCounts = REVIEW_TAGS.map((x) => [x, list.filter((r) => (r.tags || []).includes(x)).length]).filter(([, c]) => c).sort((a, z) => z[1] - a[1]);
  const exit = () => (window.history.length > 1 ? back() : go("/" + b.handle));

  return (
    <div className="b-page rv-page">
      <Top lang={lang} title={t(lang, "reviews_title")} onBack={exit} />
      <p className="rv-biz"><bdi>{pick(b, "name", lang)}</bdi></p>

      <div className="panel rv-break">
        <div className="rv-big">
          <b>{avg.toFixed(1)}</b>
          <Stars value={avg} size={16} />
          <small>{t(lang, "reviews_n", { n })}</small>
        </div>
        <div className="rv-bars">
          {counts.map(([s, c]) => (
            <div key={s} className="rv-bar"><span className="ltr">{s}</span><i><em style={{ width: n ? `${(c / n) * 100}%` : 0 }} /></i></div>
          ))}
        </div>
      </div>
      {tagCounts.length ? (
        <div className="rv-tagsum">{tagCounts.map(([x, c]) => <span key={x}>{t(lang, "tag_" + x)} <b>{c}</b></span>)}</div>
      ) : null}

      {rows === null ? <p className="note">{t(lang, "loading")}</p> : null}
      {rows && !n ? <p className="note">{t(lang, "no_reviews_yet", { name: pick(b, "name", lang) })}</p> : null}
      <div className="rv-list">
        {list.map((r) => (
          <ReviewItem key={r.id} r={r} lang={lang} canReply={owner} setToast={setToast}
            onReplied={(row) => setRows((x) => x.map((y) => (y.id === row.id ? { ...y, ...row } : y)))} />
        ))}
      </div>

      <p className="note rv-rule">{t(lang, "reviews_rule")}</p>
      {owner ? <p className="note rv-rule">{t(lang, "own_business_no")}</p> : (
        <div className="o-savebar">
          <button type="button" className="btn" onClick={() => go(`/${b.handle}/rate`)}>{t(lang, mineRow ? "edit_my_review" : "rate_this")}</button>
        </div>
      )}
      <Toast text={toast} />
    </div>
  );
}

// /name/rate: write or edit a review.
export function RatePage({ lang, handle, go, back, signedIn }) {
  const [b, err, reload] = useBusiness(handle);
  const [state, setState] = useState("loading"); // loading | ok | contact | own
  const [contact, setContact] = useState(null);
  const [existing, setExisting] = useState(null);
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState([]);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useToast();

  const check = () => {
    if (!b || !b.id || !signedIn) return;
    if (b.owner_id && b.owner_id === myUserId()) { setState("own"); return; }
    Promise.all([getMyContact(b.id), getMyReview(b.id)]).then(([c, r]) => {
      setContact(c);
      if (r) { setExisting(r); setRating(r.rating); setTags(r.tags || []); setBody(r.body || ""); }
      setState(c || r ? "ok" : "contact");
    }).catch(() => setState("contact"));
  };
  useEffect(check, [b && b.id, signedIn]);
  // coming back after calling: look again
  useEffect(() => {
    const again = () => { if (document.visibilityState === "visible") check(); };
    document.addEventListener("visibilitychange", again);
    return () => document.removeEventListener("visibilitychange", again);
  });

  if (b === null) return <NotFound lang={lang} go={go} />;
  if (b === undefined) return <Wait lang={lang} err={err} reload={reload} />;

  const name = pick(b, "name", lang);
  const exit = () => (window.history.length > 1 ? back() : go("/" + b.handle));

  if (!signedIn) {
    return (
      <div className="b-page rv-page">
        <Top lang={lang} title={t(lang, "write_review")} onBack={exit} />
        <div className="rv-gate">
          <div className="rv-gateic"><Icon name="star" size={26} /></div>
          <b>{t(lang, "rate_name", { name })}</b>
          <p>{t(lang, "contact_first", { name })}</p>
          <button type="button" className="btn" onClick={() => { try { sessionStorage.setItem("bm_after", `/${b.handle}/rate`); } catch { /* ignore */ } go("/signin"); }}>{t(lang, "sign_in_to_rate")}</button>
        </div>
      </div>
    );
  }

  if (state === "loading") return <Wait lang={lang} />;

  if (state === "own") {
    return (
      <div className="b-page rv-page">
        <Top lang={lang} title={t(lang, "write_review")} onBack={exit} />
        <div className="rv-gate"><p>{t(lang, "own_business_no")}</p>
          <button type="button" className="btn" onClick={() => go(`/${b.handle}/reviews`)}>{t(lang, "reviews_short")}</button></div>
      </div>
    );
  }

  if (state === "contact") {
    return (
      <div className="b-page rv-page">
        <Top lang={lang} title={t(lang, "write_review")} onBack={exit} />
        <div className="rv-gate">
          <div className="rv-gateic"><Icon name="phone" size={24} /></div>
          <b>{t(lang, "contact_first_title")}</b>
          <p>{t(lang, "contact_first", { name })}</p>
          <div className="b-actions" style={{ width: "100%" }}>
            {b.phone ? <a className="b-act gold" href={`tel:${b.phone}`} onClick={() => track(b.id, "call")}><Icon name="phone" size={18} /> {t(lang, "call")}</a> : null}
            {b.whatsapp || b.phone ? <a className="b-act green" href={waLink(b.whatsapp || b.phone)} target="_blank" rel="noreferrer" onClick={() => track(b.id, "whatsapp")}><Icon name="whatsapp" size={18} /> {t(lang, "whatsapp")}</a> : null}
          </div>
        </div>
      </div>
    );
  }

  const when = existing ? existing.contacted_at : contact && contact.at;
  const kind = existing ? existing.contact_kind : contact && contact.kind;
  const toggle = (x) => setTags((v) => (v.includes(x) ? v.filter((y) => y !== x) : [...v, x]));

  const send = async () => {
    if (!rating) { setToast(t(lang, "pick_stars")); return; }
    setBusy("send");
    try {
      await saveReview(b.id, { rating, tags, body: body.trim() }, existing && existing.id);
      setToast(t(lang, "review_sent"));
      setTimeout(() => go(`/${b.handle}/reviews`, true), 700);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
      setBusy("");
    }
  };
  const remove = async () => {
    setBusy("del");
    try {
      await deleteReview(existing.id);
      setToast(t(lang, "review_deleted"));
      setTimeout(() => go("/" + b.handle, true), 700);
    } catch (e) {
      setToast(`${t(lang, "save_failed")} (${e.message || e.status})`);
      setBusy("");
    }
  };

  return (
    <div className="b-page rv-page">
      <Top lang={lang} title={t(lang, "write_review")} onBack={exit} />
      <div className="rv-head">
        <b><bdi>{t(lang, "rate_name", { name })}</bdi></b>
        {when ? <small>{t(lang, kind === "whatsapp" ? "you_whatsapped" : "you_called", { when: ago(lang, when) })}</small> : null}
      </div>

      <section className="panel rv-rate">
        <span className="label">{t(lang, "how_was_it")}</span>
        <div className="rv-pick" role="radiogroup" aria-label={t(lang, "how_was_it")}>
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} type="button" role="radio" aria-checked={rating === i} aria-label={`${i} · ${t(lang, "star_" + i)}`}
              className={i <= rating ? "on" : ""} onClick={() => setRating(i)}>
              <Icon name="star" size={34} stroke={0} style={{ fill: "currentColor" }} />
            </button>
          ))}
        </div>
        <p className="rv-word">{rating ? `${rating} · ${t(lang, "star_" + rating)}` : t(lang, "pick_stars")}</p>
      </section>

      <section className="o-sec">
        <span className="label">{t(lang, "went_well")}</span>
        <div className="st-opts">
          {REVIEW_TAGS.map((x) => (
            <button key={x} type="button" className={"st-opt" + (tags.includes(x) ? " on" : "")} aria-pressed={tags.includes(x)} onClick={() => toggle(x)}>{t(lang, "tag_" + x)}</button>
          ))}
        </div>
      </section>

      <section className="o-sec">
        <textarea className="field" rows={5} maxLength={600} dir="auto" value={body} placeholder={t(lang, "review_ph")} onChange={(e) => setBody(e.target.value)} />
        <p className="note">{t(lang, "rv_note")}</p>
        {existing ? <button type="button" className="link danger" disabled={!!busy} onClick={remove}>{t(lang, "delete_review")}</button> : null}
      </section>

      <div className="o-savebar">
        <button type="button" className="btn" disabled={!!busy} onClick={send}>{busy === "send" ? t(lang, "loading") : t(lang, existing ? "update_review" : "rv_send")}</button>
      </div>
      <Toast text={toast} />
    </div>
  );
}
