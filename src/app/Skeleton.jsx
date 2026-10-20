// Loading shapes: grey placeholders the size of what is coming, with a soft light passing over them
// (left to right in English, right to left in Kurdish and Arabic). They appear only after 150 ms,
// so fast loads never flash, and the light stops when the phone asks for reduced motion.
import React from "react";

export function Skel({ w = "100%", h = 14, r = 8, style }) {
  return <span className="bm-skel" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

export function SkelTiles({ n = 12, cols = 4 }) {
  return (
    <div className="bm-skelwrap" aria-busy="true" style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 14 }}>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Skel w={cols > 3 ? 64 : 84} h={cols > 3 ? 64 : 84} r={20} />
          <Skel w="70%" h={10} />
        </span>
      ))}
    </div>
  );
}

export function SkelRows({ n = 5, avatar = true }) {
  return (
    <div className="panel bm-skelwrap" aria-busy="true">
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className="bm-skelrow">
          {avatar ? <Skel w={44} h={44} r={22} /> : null}
          <span style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <Skel w={i % 2 ? "55%" : "70%"} h={13} />
            <Skel w={i % 2 ? "40%" : "50%"} h={10} />
          </span>
          <Skel w={40} h={40} r={20} />
        </div>
      ))}
    </div>
  );
}

// A business page or owner screen: a card shape, a title, two buttons and a panel of lines
export function SkelPage({ card = true }) {
  return (
    <div className="bm-skelwrap" aria-busy="true" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <span style={{ display: "flex", justifyContent: "space-between" }}><Skel w={40} h={40} r={20} /><Skel w={40} h={40} r={20} /></span>
      {card ? <Skel h={0} r={22} style={{ aspectRatio: "1.586", height: "auto" }} /> : null}
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}><Skel w="60%" h={20} /><Skel w="45%" h={12} /></span>
      <span style={{ display: "flex", gap: 10 }}><Skel h={52} r={26} /><Skel h={52} r={26} /></span>
      <span className="panel" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 18 }}>
        <Skel w="30%" h={10} /><Skel h={12} /><Skel w="85%" h={12} /><Skel w="60%" h={12} />
      </span>
    </div>
  );
}
