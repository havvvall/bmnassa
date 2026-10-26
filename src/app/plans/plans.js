// The nine plans, as shown in the plan chooser. Prices in IQD.
// card: the plan includes an NFC card (ordered through the existing NFC order screen).
export const PLANS = [
  { id: "profile", tier: "Basic", name: "Bmnassa Profile", desc: "Profile only, no NFC card", year: 15000, perm: 30000, card: false },
  { id: "standard", tier: "Card", name: "Standard", desc: "Bmnassa NFC card + Standard profile", year: 20000, perm: 40000, card: true },
  { id: "silver", tier: "Card", name: "Silver", desc: "Custom NFC card + Standard profile", year: 35000, perm: 70000, card: true },
  { id: "gold", tier: "Premium", name: "Gold", desc: "Bmnassa NFC card + Custom portfolio, designed with our team", year: 45000, perm: 70000, card: true },
  { id: "platinum", tier: "Premium", name: "Platinum", desc: "Custom NFC card + Custom portfolio, designed with our team", year: 60000, perm: 95000, card: true },
];

// bento layout: the first, fourth and fifth tiles span the full width
export const WIDE = [0, 3, 4];

export const fmtIQD = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
