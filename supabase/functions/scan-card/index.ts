// Bmnassa · scan-card: reads a photographed paper business card with Claude.
// Deploy in Supabase → Edge Functions → Deploy a new function → Via Editor, name it "scan-card", paste this file.
// Needs the secret ANTHROPIC_API_KEY (Edge Functions → Secrets). Keep "Verify JWT" on: only signed-in people can scan.
//
// Request:  POST { front: "<base64 jpeg>", back?: "<base64 jpeg>" }   (with the person's sign-in token)
// Response: { name, title, company, phones[], email, website, address, instagram, facebook, whatsapp,
//             language, front_corners, back_corners, left_today }
// The photos are only passed to Claude to read; this function does not keep them.

const MODEL = "claude-haiku-4-5-20251001";
const MAX_IMAGE = 2_500_000; // characters of base64, about 1.8 MB

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const PROMPT = `You read photos of printed business cards from Kurdistan and Iraq for a contacts wallet.
The first image is the front of the card${"${BACK}"}. Cards may be in English, Kurdish (Sorani, Arabic script), Arabic, or several at once.

Return ONLY one JSON object, no other text, with these keys:
{
  "name": person's full name as printed (prefer the Latin-script version if the card has one, else as printed), or "" if it is a company-only card,
  "name_other": the same name in another script if the card also prints it, else "",
  "title": job title as printed, else "",
  "company": company or shop name as printed, else "",
  "phones": array of phone numbers exactly as printed (digits, +, spaces), most important first,
  "whatsapp": the number marked as WhatsApp, else "",
  "email": "", "website": "", "instagram": handle without @ or "", "facebook": "",
  "address": address as printed, else "",
  "language": main language of the card: "en", "ku" or "ar",
  "front_corners": the four corners of the card in the first image as [[x,y],[x,y],[x,y],[x,y]] in the order top-left, top-right, bottom-right, bottom-left of the card as it reads, with x and y as fractions of image width and height from the top-left (0 to 1); null if you cannot see the card edges,
  "back_corners": the same for the second image, or null
}
Copy text exactly; never invent, translate or "fix" names, numbers or emails. Leave a field empty when it is not on the card.`;

function b64ok(s: unknown) {
  return typeof s === "string" && s.length > 100 && s.length < MAX_IMAGE && /^[A-Za-z0-9+/=]+$/.test(s.slice(0, 200));
}

function cleanCorners(c: unknown) {
  if (!Array.isArray(c) || c.length !== 4) return null;
  const pts = c.map((p) => (Array.isArray(p) ? [Number(p[0]), Number(p[1])] : [NaN, NaN]));
  return pts.every(([x, y]) => x >= -0.05 && x <= 1.05 && y >= -0.05 && y <= 1.05) ? pts : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "method" }, 405);

  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) return json({ error: "no_key" }, 503);
  const sbUrl = Deno.env.get("SUPABASE_URL");
  const auth = req.headers.get("Authorization") || "";
  const apikey = req.headers.get("apikey") || Deno.env.get("SUPABASE_ANON_KEY") || "";

  let body: { front?: string; back?: string };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  if (!b64ok(body.front) || (body.back && !b64ok(body.back))) return json({ error: "bad_image" }, 400);

  // Counts this read against the person's daily limit (and checks they are signed in)
  const start = await fetch(`${sbUrl}/rest/v1/rpc/bmnassa_scan_start`, {
    method: "POST", headers: { apikey, Authorization: auth, "Content-Type": "application/json" }, body: "{}",
  });
  const startText = await start.text();
  if (!start.ok) {
    if (startText.includes("scan_limit")) return json({ error: "limit" }, 429);
    return json({ error: "not_signed_in", detail: startText.slice(0, 200) }, 401);
  }
  const leftToday = Number(startText) || 0;

  const images = [body.front!, ...(body.back ? [body.back] : [])].map((data) => ({
    type: "image", source: { type: "base64", media_type: "image/jpeg", data },
  }));
  const prompt = PROMPT.replace("${BACK}", body.back ? " and the second image is the back" : "");

  const ai = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 900,
      messages: [{ role: "user", content: [...images, { type: "text", text: prompt }] }],
    }),
  });
  if (!ai.ok) {
    const detail = (await ai.text()).slice(0, 300);
    return json({ error: "ai_failed", status: ai.status, detail }, 502);
  }
  const out = await ai.json();
  const text: string = (out.content || []).filter((c: { type: string }) => c.type === "text").map((c: { text: string }) => c.text).join("");
  const m = text.match(/\{[\s\S]*\}/);
  let r: Record<string, unknown> = {};
  try { r = m ? JSON.parse(m[0]) : {}; } catch { r = {}; }

  const s = (v: unknown, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  return json({
    name: s(r.name), name_other: s(r.name_other), title: s(r.title), company: s(r.company),
    phones: Array.isArray(r.phones) ? r.phones.map((p) => s(p, 40)).filter(Boolean).slice(0, 4) : [],
    whatsapp: s(r.whatsapp, 40), email: s(r.email), website: s(r.website), instagram: s(r.instagram).replace(/^@/, ""),
    facebook: s(r.facebook), address: s(r.address, 300), language: ["en", "ku", "ar"].includes(r.language as string) ? r.language : "",
    front_corners: cleanCorners(r.front_corners), back_corners: body.back ? cleanCorners(r.back_corners) : null,
    left_today: leftToday,
  });
});
