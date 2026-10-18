// Bmnassa talks to Supabase over plain HTTP (no extra library), like the back office does.
// The publishable key is safe in the browser: every table is guarded by row-level security.

export const SB_URL = import.meta.env.VITE_SUPABASE_URL || "https://hfcqvcduuhzfxijsniav.supabase.co";
export const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_oz8_r7FdYNbPYBOgofjriw__JVhsBOh";

// Which channel sends the sign-in code first. "sms" until Twilio's WhatsApp sender is approved.
export const OTP_CHANNEL = import.meta.env.VITE_OTP_CHANNEL === "whatsapp" ? "whatsapp" : "sms";

const SESSION_KEY = "bm_session";

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

function readSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSession(s) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private mode: the session simply lasts for this tab */
  }
}

let session = readSession();

export function getSession() {
  return session;
}

function keepSession(data) {
  session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at || Math.floor(Date.now() / 1000) + (data.expires_in || 3600),
    user: data.user,
  };
  writeSession(session);
  return session;
}

async function call(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const h = { apikey: SB_KEY, "Content-Type": "application/json", ...headers };
  if (auth) {
    const s = await freshSession();
    if (!s) throw new ApiError("Not signed in", "no_session", 401);
    h.Authorization = "Bearer " + s.access_token;
  }
  let res;
  try {
    res = await fetch(SB_URL + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Network error", "network", 0);
  }
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const code = (data && (data.error_code || data.code || data.error)) || "http_" + res.status;
    const msg = (data && (data.msg || data.message || data.error_description)) || res.statusText;
    throw new ApiError(msg, String(code), res.status);
  }
  return data;
}

async function freshSession() {
  if (!session) return null;
  const now = Math.floor(Date.now() / 1000);
  if (session.expires_at - now > 60) return session;
  try {
    const data = await call("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refresh_token },
    });
    return keepSession(data);
  } catch {
    session = null;
    writeSession(null);
    return null;
  }
}

// ---------- phone sign-in ----------

// "0770 121 8832", "770 121 8832" or "+964 770…" -> "+9647701218832"; null if it is not an Iraqi mobile.
export function normalisePhone(input) {
  let d = String(input || "")
    .replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c))
    .replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
    .replace(/[^\d+]/g, "");
  if (d.startsWith("+")) d = d.slice(1);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("964")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return /^7\d{9}$/.test(d) ? "+964" + d : null;
}

export function prettyPhone(e164) {
  const d = String(e164 || "").replace(/\D/g, "").replace(/^964/, "");
  return d.length === 10 ? `+964 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : e164 || "";
}

export function sendCode(phone, channel = OTP_CHANNEL) {
  return call("/auth/v1/otp", { method: "POST", body: { phone, channel, create_user: true } });
}

export async function verifyCode(phone, token) {
  const data = await call("/auth/v1/verify", { method: "POST", body: { type: "sms", phone, token } });
  return keepSession(data);
}

export async function signOut() {
  try {
    await call("/auth/v1/logout", { method: "POST", auth: true });
  } catch {
    /* signed out locally either way */
  }
  session = null;
  writeSession(null);
}

// ---------- data ----------

export async function getMyProfile() {
  const s = await freshSession();
  if (!s) return null;
  const rows = await call(`/rest/v1/profiles?id=eq.${s.user.id}&select=*`, { auth: true });
  return rows && rows[0] ? rows[0] : null;
}

export async function updateMyProfile(fields) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const rows = await call(`/rest/v1/profiles?id=eq.${s.user.id}`, {
    method: "PATCH",
    auth: true,
    body: fields,
    headers: { Prefer: "return=representation" },
  });
  return rows && rows[0];
}

export async function getCities() {
  return call("/rest/v1/cities?select=id,name_en,name_ku,name_ar,live,sort_order&order=sort_order");
}
