// First-run feature slides. The slides live in public/intro/index.html (a static page, so its
// swipe and animation code stays as designed). This component shows it and waits for "done".
import { useEffect } from "react";

export function IntroSlides({ lang, onDone }) {
  const code = lang === "ku" || lang === "ar" ? lang : "en";
  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin) return;
      if (e.data && e.data.bmIntro === "done") onDone();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onDone]);
  return (
    <iframe
      title="Bmnassa features"
      src={`/intro/index.html?lang=${code}`}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0, background: "#0f0e0b" }}
    />
  );
}
