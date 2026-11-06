// The public landing page at bmnassa.com. The app itself lives at app.bmnassa.com.
// Download buttons are shown but disabled until the store apps are published.
export function Landing() {
  const APP = "https://app.bmnassa.com";
  const box = { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 200, padding: "14px 22px", borderRadius: 999, fontSize: 16, fontWeight: 700, textDecoration: "none", fontFamily: "inherit" };
  return (
    <div style={{ minHeight: "100dvh", background: "#0f0e0b", color: "#f4f4f2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", boxSizing: "border-box", textAlign: "center", fontFamily: "Manrope, system-ui, sans-serif" }}>
      <img src="/brand/logo-silver.svg" alt="Bmnassa" style={{ width: 220, maxWidth: "70%" }} />
      <p style={{ color: "#f5c33b", fontSize: 15, letterSpacing: ".04em", margin: "18px 0 28px" }}>Every trusted service, one tap away</p>
      <a href={APP} style={{ ...box, background: "#f5c33b", color: "#0f0e0b" }}>Open the app</a>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
        <span aria-disabled="true" style={{ ...box, background: "#2a2822", color: "#77756d", cursor: "not-allowed" }}>App Store · soon</span>
        <span aria-disabled="true" style={{ ...box, background: "#2a2822", color: "#77756d", cursor: "not-allowed" }}>Google Play · soon</span>
      </div>
      <p style={{ color: "#8d8b84", fontSize: 13, marginTop: 40 }}>Kurdistan · Iraq</p>
    </div>
  );
}
