// Bmnassa talks to Supabase over plain HTTP (no extra library), like the back office does.
// The publishable key is safe in the browser: every table is guarded by row-level security.

export const SB_URL = import.meta.env.VITE_SUPABASE_URL || "https://hfcqvcduuhzfxijsniav.supabase.co";
export const SB_KEY = import.meta.env.VITE_SUPABASE_KEY || "sb_publishable_oz8_r7FdYNbPYBOgofjriw__JVhsBOh";


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

// ---------- email sign-in ----------
// A 6-digit code goes to the person's email. Phone sign-in comes back once Bmnassa is registered.

// Trims, lower-cases and checks the shape; null if it is not an email address.
export function normaliseEmail(input) {
  const e = String(input || "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) ? e : null;
}

export function sendCode(email) {
  return call("/auth/v1/otp", { method: "POST", body: { email, create_user: true } });
}

export async function verifyCode(email, token) {
  const data = await call("/auth/v1/verify", { method: "POST", body: { type: "email", email, token } });
  return keepSession(data);
}

// ---------- phone numbers (for the business phone) ----------

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

export async function getCategories() {
  return call("/rest/v1/categories?select=id,name_en,name_ku,name_ar,icon,sort_order&order=sort_order");
}

// All districts and subdistricts at once (about 180 short rows), so the dropdowns change instantly.
export async function getPlaces() {
  const [districts, subdistricts] = await Promise.all([
    call("/rest/v1/districts?select=id,city_id,name_en,name_ku,name_ar,sort_order&order=sort_order"),
    call("/rest/v1/subdistricts?select=id,district_id,name_en,name_ku,name_ar,sort_order&order=sort_order"),
  ]);
  return { districts: districts || [], subdistricts: subdistricts || [] };
}

const BIZ_FIELDS =
  "id,name_en,name_ku,name_ar,category_id,city_id,district_id,subdistrict_id,phone,whatsapp,description_en,description_ku,description_ar,status,created_at";

export async function getMyBusinesses() {
  const s = await freshSession();
  if (!s) return [];
  return call(`/rest/v1/businesses?owner_id=eq.${s.user.id}&select=${BIZ_FIELDS}&order=created_at.desc`, { auth: true });
}

// The owner types the name and description in the language they use; the team fills the others at approval.
export async function createBusiness({ name, description, lang, category_id, city_id, district_id, subdistrict_id, phone }) {
  const s = await freshSession();
  if (!s) throw new ApiError("Not signed in", "no_session", 401);
  const body = {
    owner_id: s.user.id,
    status: "pending",
    category_id, city_id, district_id, subdistrict_id,
    phone, whatsapp: phone,
    sent_in_language: lang,
    ["name_" + lang]: name,
  };
  if (description) body["description_" + lang] = description;
  const rows = await call(`/rest/v1/businesses?select=${BIZ_FIELDS}`, {
    method: "POST", auth: true, body, headers: { Prefer: "return=representation" },
  });
  return rows && rows[0];
}
