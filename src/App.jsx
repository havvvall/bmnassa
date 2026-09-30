import React, { useState, useMemo, useEffect, useRef } from "react";


const LOGO_PATH = "M1273 281 L1250 258 L1229 253 L1214 254 L1200 259 L1189 268 L1174 296 L1173 822 L1169 831 L1156 840 L1143 840 L1137 837 L903 596 L894 578 L890 554 L889 378 L885 363 L878 352 L858 337 L829 334 L811 339 L793 355 L785 379 L781 449 L781 702 L777 711 L764 720 L749 718 L734 705 L538 503 L518 476 L484 410 L468 391 L459 386 L440 383 L419 387 L404 399 L396 414 L393 432 L393 679 L388 693 L373 704 L359 701 L331 674 L153 482 L60 387 L49 383 L23 386 L8 401 L0 426 L0 1033 L5 1052 L12 1063 L31 1078 L68 1079 L86 1068 L101 1048 L103 659 L106 648 L115 635 L132 632 L140 636 L321 819 L387 890 L395 910 L399 936 L409 955 L429 972 L441 976 L465 976 L475 973 L494 957 L501 945 L503 676 L511 661 L517 657 L528 657 L551 675 L779 915 L788 933 L790 944 L791 1017 L799 1043 L811 1057 L821 1063 L835 1066 L863 1064 L878 1054 L891 1036 L894 1019 L894 803 L897 794 L905 786 L921 784 L950 807 L1164 1026 L1172 1040 L1179 1067 L1182 1145 L1193 1163 L1212 1176 L1251 1174 L1273 1152 L1278 1127 L1278 301 Z M1379 25 L1373 46 L1373 1200 L1375 1243 L1383 1259 L1392 1268 L1415 1278 L1426 1279 L1455 1269 L1465 1259 L1477 1234 L1478 1192 L1489 1169 L1733 916 L1741 912 L1756 915 L1765 928 L1766 1129 L1781 1156 L1794 1165 L1805 1168 L1835 1167 L1857 1152 L1868 1132 L1871 1090 L1878 1076 L2087 859 L2123 826 L2137 829 L2148 851 L2150 1039 L2165 1060 L2184 1070 L2212 1071 L2232 1059 L2245 1041 L2252 1005 L2263 995 L2552 994 L2587 990 L2616 968 L2627 941 L2628 733 L2632 722 L2645 713 L2655 716 L2673 732 L2874 938 L2877 959 L2869 986 L2870 1033 L2879 1058 L2893 1082 L2917 1106 L2936 1118 L2962 1127 L3019 1127 L3059 1109 L3091 1077 L3107 1046 L3112 1018 L3110 978 L3100 949 L3083 923 L3071 911 L3046 894 L3009 879 L2998 863 L2998 441 L2993 418 L2980 403 L2963 393 L2930 394 L2906 415 L2901 426 L2898 466 L2900 774 L2894 790 L2885 798 L2877 799 L2870 796 L2850 777 L2632 543 L2623 521 L2619 463 L2609 446 L2588 428 L2562 423 L2264 422 L2254 416 L2246 384 L2230 364 L2210 354 L2187 355 L2164 368 L2150 392 L2149 629 L2140 652 L1904 892 L1894 897 L1878 894 L1871 887 L1868 878 L1868 499 L1871 491 L1908 457 L1923 437 L1934 409 L1938 372 L1932 338 L1911 298 L1875 267 L1852 257 L1825 253 L1802 253 L1776 258 L1738 278 L1723 291 L1706 314 L1696 336 L1691 358 L1690 387 L1694 411 L1701 428 L1719 456 L1757 490 L1762 501 L1763 676 L1755 717 L1742 739 L1708 778 L1527 968 L1504 984 L1487 981 L1477 967 L1477 43 L1466 18 L1458 10 L1441 1 L1402 3 L1387 14 Z M2257 530 L2272 527 L2498 527 L2512 531 L2520 539 L2526 554 L2526 867 L2522 877 L2513 886 L2505 889 L2260 888 L2252 882 L2247 861 L2248 544 Z";

function Logo({ width = 100, color = "#f4f6f7", style, glow = false }) {
  return (
    <svg
      viewBox="0 0 3113 1280"
      width={width}
      height={width * (1280 / 3113)}
      style={{ display: "block", filter: glow ? "drop-shadow(0 0 10px rgba(255,255,255,0.25))" : undefined, ...style }}
      aria-hidden="true"
    >
      <path d={LOGO_PATH} fill={color} />
    </svg>
  );
}

const DUST_PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: 1 + ((i * 13) % 3),
  duration: 14 + ((i * 7) % 12),
  delay: -((i * 3) % 18),
  opacity: 0.15 + ((i * 11) % 30) / 100,
}));

function BackgroundField() {
  return (
    <div style={styles.bgDust} aria-hidden="true">
      <div className="bm-blob teal" />
      <div className="bm-blob coral" />
      {DUST_PARTICLES.map((d, i) => (
        <div
          key={i}
          className="bm-dust"
          style={{
            left: d.left, bottom: -20, width: d.size, height: d.size,
            animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`,
            "--o": d.opacity,
          }}
        />
      ))}
    </div>
  );
}

function Intro({ onEnter }) {
  const [ripples, setRipples] = useState([]);
  const [flash, setFlash] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const idRef = useRef(0);

  const addRipples = (count) => {
    for (let i = 0; i < count; i++) {
      const id = idRef.current++;
      setTimeout(() => {
        setRipples((prev) => [...prev, id]);
        setTimeout(() => setRipples((prev) => prev.filter((r) => r !== id)), 2300);
      }, i * 260);
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => addRipples(2), 1200);
    const interval = setInterval(() => addRipples(2), 4800);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, []);

  const handleTap = () => {
    if (leaving) return;
    addRipples(3);
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
    setLeaving(true);
    setTimeout(() => onEnter(), 350);
  };

  return (
    <div style={styles.introScreen} className={leaving ? "bm-intro-leave" : ""}>
      <div className="bm-intro-system">
        <div className="bm-intro-ring" />
        <div className="bm-intro-ring r2" />
        <div className="bm-intro-orbit o1">
          <span className="bm-intro-dot big t" style={{ left: "50%", top: 0 }} />
          <span className="bm-intro-dot big c" style={{ left: "85%", top: "85%" }} />
        </div>
        <div className="bm-intro-orbit o2">
          <span className="bm-intro-dot small c" style={{ left: "100%", top: "50%" }} />
          <span className="bm-intro-dot small t" style={{ left: 0, top: "55%" }} />
        </div>
        <div className="bm-intro-orbit o3">
          <span className="bm-intro-dot small t" style={{ left: "15%", top: "15%" }} />
        </div>
        <button className="bm-intro-orb" onClick={handleTap} aria-label="Open Bmnassa">
          <div className="bm-intro-brand">
            <Logo width={130} glow />
            <span className="bm-intro-tag">SMART BUSINESS DIRECTORY</span>
          </div>
        </button>
        {ripples.map((id) => <span key={id} className="bm-intro-ripple" />)}
      </div>
      <div className="bm-intro-hint">Tap the logo</div>
      {flash && <div className="bm-intro-flash go" />}
    </div>
  );
}

/* ---------------- DATA ---------------- */

const INITIAL_CATEGORIES = [
  { id: "plumbing", name: "Plumbers", icon: "wrench" },
  { id: "electrical", name: "Electricians", icon: "bolt" },
  { id: "carpentry", name: "Carpenters", icon: "hammer" },
  { id: "civil-eng", name: "Civil Engineers", icon: "ruler" },
  { id: "architecture", name: "Architects", icon: "building" },
  { id: "interior", name: "Interior Designers", icon: "sofa" },
  { id: "painting", name: "Painters", icon: "brush" },
  { id: "hvac", name: "AC & Refrigeration", icon: "wind" },
  { id: "cleaning", name: "Home Cleaning", icon: "sparkles" },
  { id: "moving", name: "Movers & Packers", icon: "truck" },
  { id: "mechanics", name: "Car Mechanics", icon: "car" },
  { id: "carwash", name: "Car Wash & Detailing", icon: "drop" },
  { id: "photography", name: "Photographers", icon: "camera" },
  { id: "tailoring", name: "Tailors & Fashion", icon: "thread" },
  { id: "bakery", name: "Bakeries & Pastry", icon: "cake" },
  { id: "catering", name: "Restaurants & Catering", icon: "utensils" },
  { id: "beauty", name: "Beauty Salons", icon: "sparkle" },
  { id: "barber", name: "Barbershops", icon: "scissors" },
  { id: "legal", name: "Lawyers", icon: "scale" },
  { id: "accounting", name: "Accountants", icon: "calculator" },
  { id: "realestate", name: "Real Estate Agents", icon: "key" },
  { id: "it-repair", name: "IT & Computer Repair", icon: "monitor" },
  { id: "events", name: "Event Planners", icon: "confetti" },
  { id: "metalwork", name: "Blacksmiths & Metalwork", icon: "flame" },
  { id: "welding", name: "Welders", icon: "spark" },
];

const ICON_OPTIONS = [
  "wrench", "bolt", "hammer", "ruler", "building", "sofa", "brush", "wind",
  "sparkles", "truck", "car", "drop", "camera", "thread", "scissors", "cake",
  "utensils", "sparkle", "scale", "calculator", "key", "monitor", "confetti",
  "flame", "spark", "grid",
];

function buildQrSrc(biz, size = 200) {
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const qrData = encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${biz.name}\nTEL:${cleanPhone}\nADR:${biz.address}\nEND:VCARD`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=0f0f0f&color=ffffff&margin=10&data=${qrData}`;
}

const LANGUAGES = [
  { code: "ku", name: "کوردی", sub: "Kurdish · Soranî" },
  { code: "en", name: "English", sub: "English" },
  { code: "ar", name: "عربي", sub: "Arabic · al-'Arabiyyah" },
];

const CITIES = [
  { id: "erbil", name: "Erbil", sub: "62 businesses", live: true },
  { id: "sulaymaniyah", name: "Sulaymaniyah", sub: "250 businesses", live: true },
  { id: "kirkuk", name: "Kirkuk", sub: "Coming soon", live: false },
  { id: "duhok", name: "Duhok", sub: "Coming soon", live: false },
  { id: "halabja", name: "Halabja", sub: "Coming soon", live: false },
];

const BUSINESSES = [
  {
    "id": 1,
    "name": "Halgurd Plumbing Services",
    "category": "plumbing",
    "owner": "Kawa Jaza",
    "phone": "0771 242 2679",
    "whatsapp": "0771 242 2679",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 143,
    "verified": true,
    "description": "Halgurd Plumbing Services offers reliable plumbers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 2,
    "name": "Zana Plumbing Services",
    "category": "plumbing",
    "owner": "Kawa Karim",
    "phone": "0771 617 1434",
    "whatsapp": "0771 617 1434",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 170,
    "verified": false,
    "description": "Zana Plumbing Services offers reliable plumbers in Zargata, Sulaymaniyah."
  },
  {
    "id": 3,
    "name": "Sardar Plumbing Est.",
    "category": "plumbing",
    "owner": "Hawre Ahmad",
    "phone": "0780 448 5552",
    "whatsapp": "0780 448 5552",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 90,
    "verified": true,
    "description": "Sardar Plumbing Est. offers reliable plumbers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 4,
    "name": "Ranj Plumbing Services",
    "category": "plumbing",
    "owner": "Bakhtiar Rashid",
    "phone": "0773 926 1711",
    "whatsapp": "0773 926 1711",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 141,
    "verified": true,
    "description": "Ranj Plumbing Services offers reliable plumbers in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 5,
    "name": "Payam Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Barzinji",
    "phone": "0775 691 4150",
    "whatsapp": "0775 691 4150",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 15,
    "verified": false,
    "description": "Payam Water & Pipe Works offers reliable plumbers in Ashty, Sulaymaniyah."
  },
  {
    "id": 6,
    "name": "Shene Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Salih",
    "phone": "0780 384 8428",
    "whatsapp": "0780 384 8428",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 97,
    "verified": true,
    "description": "Shene Water & Pipe Works offers reliable plumbers in Goizha, Sulaymaniyah."
  },
  {
    "id": 7,
    "name": "Bakhtiar Plumbing Services",
    "category": "plumbing",
    "owner": "Nazdar Jaza",
    "phone": "0770 646 5010",
    "whatsapp": "0770 646 5010",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 101,
    "verified": true,
    "description": "Bakhtiar Plumbing Services offers reliable plumbers in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 8,
    "name": "Payam Plumbing Est.",
    "category": "plumbing",
    "owner": "Snur Barzinji",
    "phone": "0775 963 1916",
    "whatsapp": "0775 963 1916",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 12,
    "verified": false,
    "description": "Payam Plumbing Est. offers reliable plumbers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 9,
    "name": "Ranj Water & Pipe Works",
    "category": "plumbing",
    "owner": "Hemin Qadir",
    "phone": "0775 317 9179",
    "whatsapp": "0775 317 9179",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 168,
    "verified": false,
    "description": "Ranj Water & Pipe Works offers reliable plumbers in Raparin, Sulaymaniyah."
  },
  {
    "id": 10,
    "name": "Hawre Plumbing Services",
    "category": "plumbing",
    "owner": "Bnar Barzinji",
    "phone": "0773 864 8019",
    "whatsapp": "0773 864 8019",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 106,
    "verified": false,
    "description": "Hawre Plumbing Services offers reliable plumbers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 11,
    "name": "Shvan Power Solutions",
    "category": "electrical",
    "owner": "Rekan Karim",
    "phone": "0751 256 3621",
    "whatsapp": "0751 256 3621",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 112,
    "verified": false,
    "description": "Shvan Power Solutions offers reliable electricians in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 12,
    "name": "Ranj Electrical Services",
    "category": "electrical",
    "owner": "Shorsh Mahmud",
    "phone": "0773 666 1188",
    "whatsapp": "0773 666 1188",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 33,
    "verified": false,
    "description": "Ranj Electrical Services offers reliable electricians in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 13,
    "name": "Dilshad Electrical Services",
    "category": "electrical",
    "owner": "Shene Sofi",
    "phone": "0773 545 3591",
    "whatsapp": "0773 545 3591",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 71,
    "verified": false,
    "description": "Dilshad Electrical Services offers reliable electricians in Goizha, Sulaymaniyah."
  },
  {
    "id": 14,
    "name": "Shene Electric Works",
    "category": "electrical",
    "owner": "Twana Rasul",
    "phone": "0771 256 7126",
    "whatsapp": "0771 256 7126",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 142,
    "verified": false,
    "description": "Shene Electric Works offers reliable electricians in Ashty, Sulaymaniyah."
  },
  {
    "id": 15,
    "name": "Payam Power Solutions",
    "category": "electrical",
    "owner": "Payam Ahmad",
    "phone": "0775 600 1319",
    "whatsapp": "0775 600 1319",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 96,
    "verified": false,
    "description": "Payam Power Solutions offers reliable electricians in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 16,
    "name": "Newroz Electrical Services",
    "category": "electrical",
    "owner": "Bnar Hussein",
    "phone": "0751 187 8962",
    "whatsapp": "0751 187 8962",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 140,
    "verified": false,
    "description": "Newroz Electrical Services offers reliable electricians in Andazyari, Sulaymaniyah."
  },
  {
    "id": 17,
    "name": "Rekan Power Solutions",
    "category": "electrical",
    "owner": "Diyar Jaza",
    "phone": "0780 316 9835",
    "whatsapp": "0780 316 9835",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 180,
    "verified": true,
    "description": "Rekan Power Solutions offers reliable electricians in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 18,
    "name": "Peshraw Electrical Services",
    "category": "electrical",
    "owner": "Nazdar Rashid",
    "phone": "0781 223 5061",
    "whatsapp": "0781 223 5061",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 90,
    "verified": true,
    "description": "Peshraw Electrical Services offers reliable electricians in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 19,
    "name": "Dilshad Electric Works",
    "category": "electrical",
    "owner": "Awat Salih",
    "phone": "0751 824 1964",
    "whatsapp": "0751 824 1964",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 12,
    "verified": false,
    "description": "Dilshad Electric Works offers reliable electricians in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 20,
    "name": "Hemin Power Solutions",
    "category": "electrical",
    "owner": "Bnar Jaza",
    "phone": "0771 652 3167",
    "whatsapp": "0771 652 3167",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 150,
    "verified": false,
    "description": "Hemin Power Solutions offers reliable electricians in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 21,
    "name": "Bnar Wood Works",
    "category": "carpentry",
    "owner": "Beston Aziz",
    "phone": "0751 199 8062",
    "whatsapp": "0751 199 8062",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 109,
    "verified": false,
    "description": "Bnar Wood Works offers reliable carpenters in Zargata, Sulaymaniyah."
  },
  {
    "id": 22,
    "name": "Chnur Carpentry Workshop",
    "category": "carpentry",
    "owner": "Nazdar Rasul",
    "phone": "0780 845 6559",
    "whatsapp": "0780 845 6559",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 31,
    "verified": true,
    "description": "Chnur Carpentry Workshop offers reliable carpenters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 23,
    "name": "Karwan Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Sardar Faraj",
    "phone": "0770 385 8579",
    "whatsapp": "0770 385 8579",
    "address": "Iskan, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 23,
    "verified": false,
    "description": "Karwan Furniture & Carpentry offers reliable carpenters in Iskan, Sulaymaniyah."
  },
  {
    "id": 24,
    "name": "Goran Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Aram Hussein",
    "phone": "0750 195 4872",
    "whatsapp": "0750 195 4872",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 128,
    "verified": false,
    "description": "Goran Furniture & Carpentry offers reliable carpenters in Empire Area, Sulaymaniyah."
  },
  {
    "id": 25,
    "name": "Goran Wood Works",
    "category": "carpentry",
    "owner": "Handren Hussein",
    "phone": "0780 102 7396",
    "whatsapp": "0780 102 7396",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 120,
    "verified": true,
    "description": "Goran Wood Works offers reliable carpenters in Salim Street, Sulaymaniyah."
  },
  {
    "id": 26,
    "name": "Snur Furniture & Carpentry",
    "category": "carpentry",
    "owner": "Beston Barzinji",
    "phone": "0770 294 5861",
    "whatsapp": "0770 294 5861",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 18,
    "verified": false,
    "description": "Snur Furniture & Carpentry offers reliable carpenters in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 27,
    "name": "Dilshad Carpentry Workshop",
    "category": "carpentry",
    "owner": "Chnur Sofi",
    "phone": "0750 698 8811",
    "whatsapp": "0750 698 8811",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 139,
    "verified": true,
    "description": "Dilshad Carpentry Workshop offers reliable carpenters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 28,
    "name": "Twana Carpentry Workshop",
    "category": "carpentry",
    "owner": "Goran Amin",
    "phone": "0751 791 4853",
    "whatsapp": "0751 791 4853",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 149,
    "verified": true,
    "description": "Twana Carpentry Workshop offers reliable carpenters in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 29,
    "name": "Shorsh Carpentry Workshop",
    "category": "carpentry",
    "owner": "Shorsh Karim",
    "phone": "0775 367 4346",
    "whatsapp": "0775 367 4346",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 84,
    "verified": true,
    "description": "Shorsh Carpentry Workshop offers reliable carpenters in Iskan, Sulaymaniyah."
  },
  {
    "id": 30,
    "name": "Ranj Carpentry Workshop",
    "category": "carpentry",
    "owner": "Nazdar Baban",
    "phone": "0775 869 2188",
    "whatsapp": "0775 869 2188",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 163,
    "verified": false,
    "description": "Ranj Carpentry Workshop offers reliable carpenters in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 31,
    "name": "Aram Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Dilshad Qadir",
    "phone": "0773 235 6718",
    "whatsapp": "0773 235 6718",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 66,
    "verified": false,
    "description": "Aram Engineering Consultancy offers reliable civil engineers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 32,
    "name": "Diyar Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Newroz Barzinji",
    "phone": "0750 783 5905",
    "whatsapp": "0750 783 5905",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 30,
    "verified": false,
    "description": "Diyar Civil Engineering Office offers reliable civil engineers in Ashty, Sulaymaniyah."
  },
  {
    "id": 33,
    "name": "Shvan Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Aram Rasul",
    "phone": "0770 378 5616",
    "whatsapp": "0770 378 5616",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 91,
    "verified": true,
    "description": "Shvan Civil Engineering Office offers reliable civil engineers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 34,
    "name": "Halgurd Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Twana Sultan",
    "phone": "0750 194 7939",
    "whatsapp": "0750 194 7939",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 15,
    "verified": true,
    "description": "Halgurd Civil Engineering Office offers reliable civil engineers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 35,
    "name": "Shene Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Halgurd Jaza",
    "phone": "0781 664 8007",
    "whatsapp": "0781 664 8007",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 32,
    "verified": true,
    "description": "Shene Engineering Consultancy offers reliable civil engineers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 36,
    "name": "Handren Structural Consultants",
    "category": "civil-eng",
    "owner": "Handren Faraj",
    "phone": "0750 954 7049",
    "whatsapp": "0750 954 7049",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 41,
    "verified": false,
    "description": "Handren Structural Consultants offers reliable civil engineers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 37,
    "name": "Rebaz Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Bakhtiar Hussein",
    "phone": "0771 798 5088",
    "whatsapp": "0771 798 5088",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 94,
    "verified": false,
    "description": "Rebaz Civil Engineering Office offers reliable civil engineers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 38,
    "name": "Handren Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Shorsh Faraj",
    "phone": "0770 919 3900",
    "whatsapp": "0770 919 3900",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 10,
    "verified": true,
    "description": "Handren Civil Engineering Office offers reliable civil engineers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 39,
    "name": "Payam Civil Engineering Office",
    "category": "civil-eng",
    "owner": "Beston Aziz",
    "phone": "0773 263 2771",
    "whatsapp": "0773 263 2771",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 13,
    "verified": false,
    "description": "Payam Civil Engineering Office offers reliable civil engineers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 40,
    "name": "Bnar Engineering Consultancy",
    "category": "civil-eng",
    "owner": "Newroz Mahmud",
    "phone": "0773 940 4728",
    "whatsapp": "0773 940 4728",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 172,
    "verified": true,
    "description": "Bnar Engineering Consultancy offers reliable civil engineers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 41,
    "name": "Sherko Design & Architecture Office",
    "category": "architecture",
    "owner": "Goran Karim",
    "phone": "0775 756 9346",
    "whatsapp": "0775 756 9346",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 141,
    "verified": true,
    "description": "Sherko Design & Architecture Office offers reliable architects in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 42,
    "name": "Kawa Architecture Studio",
    "category": "architecture",
    "owner": "Handren Jaza",
    "phone": "0773 139 2776",
    "whatsapp": "0773 139 2776",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 92,
    "verified": false,
    "description": "Kawa Architecture Studio offers reliable architects in Salim Street, Sulaymaniyah."
  },
  {
    "id": 43,
    "name": "Shorsh Architects",
    "category": "architecture",
    "owner": "Aram Hama",
    "phone": "0771 360 1727",
    "whatsapp": "0771 360 1727",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 4,
    "verified": false,
    "description": "Shorsh Architects offers reliable architects in Raparin, Sulaymaniyah."
  },
  {
    "id": 44,
    "name": "Beston Architects",
    "category": "architecture",
    "owner": "Nazdar Qadir",
    "phone": "0780 171 6409",
    "whatsapp": "0780 171 6409",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 173,
    "verified": false,
    "description": "Beston Architects offers reliable architects in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 45,
    "name": "Chnur Design & Architecture Office",
    "category": "architecture",
    "owner": "Twana Baban",
    "phone": "0775 512 5844",
    "whatsapp": "0775 512 5844",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 53,
    "verified": false,
    "description": "Chnur Design & Architecture Office offers reliable architects in Iskan, Sulaymaniyah."
  },
  {
    "id": 46,
    "name": "Ranj Architects",
    "category": "architecture",
    "owner": "Chnur Amin",
    "phone": "0773 515 9977",
    "whatsapp": "0773 515 9977",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 81,
    "verified": true,
    "description": "Ranj Architects offers reliable architects in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 47,
    "name": "Zana Architects",
    "category": "architecture",
    "owner": "Shorsh Sofi",
    "phone": "0781 552 4501",
    "whatsapp": "0781 552 4501",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 47,
    "verified": false,
    "description": "Zana Architects offers reliable architects in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 48,
    "name": "Peshraw Architects",
    "category": "architecture",
    "owner": "Nazdar Kakei",
    "phone": "0751 938 4848",
    "whatsapp": "0751 938 4848",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 61,
    "verified": false,
    "description": "Peshraw Architects offers reliable architects in Qirga, Sulaymaniyah."
  },
  {
    "id": 49,
    "name": "Shvan Architecture Studio",
    "category": "architecture",
    "owner": "Rebaz Salih",
    "phone": "0751 566 7790",
    "whatsapp": "0751 566 7790",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 151,
    "verified": true,
    "description": "Shvan Architecture Studio offers reliable architects in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 50,
    "name": "Snur Design & Architecture Office",
    "category": "architecture",
    "owner": "Rekan Hama",
    "phone": "0770 771 1090",
    "whatsapp": "0770 771 1090",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 31,
    "verified": false,
    "description": "Snur Design & Architecture Office offers reliable architects in Andazyari, Sulaymaniyah."
  },
  {
    "id": 51,
    "name": "Bnar Interior Design Studio",
    "category": "interior",
    "owner": "Beston Sheikhani",
    "phone": "0750 670 5082",
    "whatsapp": "0750 670 5082",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 35,
    "verified": false,
    "description": "Bnar Interior Design Studio offers reliable interior designers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 52,
    "name": "Beston Home Interiors",
    "category": "interior",
    "owner": "Nazdar Sheikhani",
    "phone": "0775 873 8251",
    "whatsapp": "0775 873 8251",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 133,
    "verified": false,
    "description": "Beston Home Interiors offers reliable interior designers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 53,
    "name": "Payam Design House",
    "category": "interior",
    "owner": "Sardar Amin",
    "phone": "0781 365 5050",
    "whatsapp": "0781 365 5050",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 74,
    "verified": false,
    "description": "Payam Design House offers reliable interior designers in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 54,
    "name": "Twana Home Interiors",
    "category": "interior",
    "owner": "Halgurd Salih",
    "phone": "0781 179 5681",
    "whatsapp": "0781 179 5681",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 89,
    "verified": true,
    "description": "Twana Home Interiors offers reliable interior designers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 55,
    "name": "Dilshad Interior Design Studio",
    "category": "interior",
    "owner": "Shvan Faraj",
    "phone": "0780 810 3503",
    "whatsapp": "0780 810 3503",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 20,
    "verified": false,
    "description": "Dilshad Interior Design Studio offers reliable interior designers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 56,
    "name": "Sherko Design House",
    "category": "interior",
    "owner": "Sardar Aziz",
    "phone": "0771 952 7883",
    "whatsapp": "0771 952 7883",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 153,
    "verified": false,
    "description": "Sherko Design House offers reliable interior designers in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 57,
    "name": "Kawa Design House",
    "category": "interior",
    "owner": "Ranj Sultan",
    "phone": "0775 405 7389",
    "whatsapp": "0775 405 7389",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 111,
    "verified": false,
    "description": "Kawa Design House offers reliable interior designers in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 58,
    "name": "Chnur Design House",
    "category": "interior",
    "owner": "Beston Kakei",
    "phone": "0781 324 5471",
    "whatsapp": "0781 324 5471",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 11,
    "verified": false,
    "description": "Chnur Design House offers reliable interior designers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 59,
    "name": "Nazdar Design House",
    "category": "interior",
    "owner": "Beston Hama",
    "phone": "0781 230 9751",
    "whatsapp": "0781 230 9751",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 104,
    "verified": false,
    "description": "Nazdar Design House offers reliable interior designers in Salim Street, Sulaymaniyah."
  },
  {
    "id": 60,
    "name": "Nazdar Interior Design Studio",
    "category": "interior",
    "owner": "Hemin Aziz",
    "phone": "0781 286 1823",
    "whatsapp": "0781 286 1823",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 87,
    "verified": true,
    "description": "Nazdar Interior Design Studio offers reliable interior designers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 61,
    "name": "Sherko Decor & Paint",
    "category": "painting",
    "owner": "Shene Hama",
    "phone": "0780 358 2341",
    "whatsapp": "0780 358 2341",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 142,
    "verified": true,
    "description": "Sherko Decor & Paint offers reliable painters in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 62,
    "name": "Bakhtiar Painting Services",
    "category": "painting",
    "owner": "Halgurd Karim",
    "phone": "0750 353 4266",
    "whatsapp": "0750 353 4266",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 163,
    "verified": true,
    "description": "Bakhtiar Painting Services offers reliable painters in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 63,
    "name": "Shvan Decor & Paint",
    "category": "painting",
    "owner": "Nazdar Rasul",
    "phone": "0771 576 5198",
    "whatsapp": "0771 576 5198",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 46,
    "verified": false,
    "description": "Shvan Decor & Paint offers reliable painters in Raparin, Sulaymaniyah."
  },
  {
    "id": 64,
    "name": "Chnur Painting Contractors",
    "category": "painting",
    "owner": "Aram Amin",
    "phone": "0751 692 1420",
    "whatsapp": "0751 692 1420",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 151,
    "verified": false,
    "description": "Chnur Painting Contractors offers reliable painters in Ashty, Sulaymaniyah."
  },
  {
    "id": 65,
    "name": "Ranj Decor & Paint",
    "category": "painting",
    "owner": "Snur Qadir",
    "phone": "0771 204 5941",
    "whatsapp": "0771 204 5941",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 157,
    "verified": false,
    "description": "Ranj Decor & Paint offers reliable painters in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 66,
    "name": "Beston Painting Contractors",
    "category": "painting",
    "owner": "Beston Hussein",
    "phone": "0780 777 7071",
    "whatsapp": "0780 777 7071",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 169,
    "verified": true,
    "description": "Beston Painting Contractors offers reliable painters in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 67,
    "name": "Goran Decor & Paint",
    "category": "painting",
    "owner": "Newroz Sultan",
    "phone": "0780 470 8532",
    "whatsapp": "0780 470 8532",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 115,
    "verified": true,
    "description": "Goran Decor & Paint offers reliable painters in Goizha, Sulaymaniyah."
  },
  {
    "id": 68,
    "name": "Twana Painting Contractors",
    "category": "painting",
    "owner": "Hawre Kakei",
    "phone": "0781 576 8136",
    "whatsapp": "0781 576 8136",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 155,
    "verified": true,
    "description": "Twana Painting Contractors offers reliable painters in Empire Area, Sulaymaniyah."
  },
  {
    "id": 69,
    "name": "Goran Painting Services",
    "category": "painting",
    "owner": "Newroz Karim",
    "phone": "0781 349 8613",
    "whatsapp": "0781 349 8613",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 175,
    "verified": false,
    "description": "Goran Painting Services offers reliable painters in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 70,
    "name": "Kawa Decor & Paint",
    "category": "painting",
    "owner": "Goran Sofi",
    "phone": "0781 317 6813",
    "whatsapp": "0781 317 6813",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 91,
    "verified": true,
    "description": "Kawa Decor & Paint offers reliable painters in Salim Street, Sulaymaniyah."
  },
  {
    "id": 71,
    "name": "Shorsh Climate Systems",
    "category": "hvac",
    "owner": "Handren Jaza",
    "phone": "0750 629 4130",
    "whatsapp": "0750 629 4130",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 108,
    "verified": false,
    "description": "Shorsh Climate Systems offers reliable ac & refrigeration in Empire Area, Sulaymaniyah."
  },
  {
    "id": 72,
    "name": "Shene AC & Cooling Services",
    "category": "hvac",
    "owner": "Snur Sultan",
    "phone": "0781 911 1282",
    "whatsapp": "0781 911 1282",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 60,
    "verified": false,
    "description": "Shene AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 73,
    "name": "Bnar Refrigeration Technicians",
    "category": "hvac",
    "owner": "Nazdar Zangana",
    "phone": "0781 666 9698",
    "whatsapp": "0781 666 9698",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 144,
    "verified": true,
    "description": "Bnar Refrigeration Technicians offers reliable ac & refrigeration in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 74,
    "name": "Snur Refrigeration Technicians",
    "category": "hvac",
    "owner": "Hawre Baban",
    "phone": "0771 223 4155",
    "whatsapp": "0771 223 4155",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 141,
    "verified": false,
    "description": "Snur Refrigeration Technicians offers reliable ac & refrigeration in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 75,
    "name": "Snur AC & Cooling Services",
    "category": "hvac",
    "owner": "Karwan Qadir",
    "phone": "0773 841 9595",
    "whatsapp": "0773 841 9595",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 29,
    "verified": false,
    "description": "Snur AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 76,
    "name": "Peshraw AC & Cooling Services",
    "category": "hvac",
    "owner": "Bakhtiar Amin",
    "phone": "0750 825 9751",
    "whatsapp": "0750 825 9751",
    "address": "Ashty, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 15,
    "verified": false,
    "description": "Peshraw AC & Cooling Services offers reliable ac & refrigeration in Ashty, Sulaymaniyah."
  },
  {
    "id": 77,
    "name": "Dilshad Refrigeration Technicians",
    "category": "hvac",
    "owner": "Snur Faraj",
    "phone": "0751 993 1200",
    "whatsapp": "0751 993 1200",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 124,
    "verified": false,
    "description": "Dilshad Refrigeration Technicians offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 78,
    "name": "Sherko AC & Cooling Services",
    "category": "hvac",
    "owner": "Rebaz Jaza",
    "phone": "0751 941 2070",
    "whatsapp": "0751 941 2070",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 22,
    "verified": false,
    "description": "Sherko AC & Cooling Services offers reliable ac & refrigeration in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 79,
    "name": "Nazdar AC & Cooling Services",
    "category": "hvac",
    "owner": "Shvan Faraj",
    "phone": "0773 187 5066",
    "whatsapp": "0773 187 5066",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 110,
    "verified": false,
    "description": "Nazdar AC & Cooling Services offers reliable ac & refrigeration in Raparin, Sulaymaniyah."
  },
  {
    "id": 80,
    "name": "Beston Climate Systems",
    "category": "hvac",
    "owner": "Bnar Sheikhani",
    "phone": "0781 553 5871",
    "whatsapp": "0781 553 5871",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 113,
    "verified": true,
    "description": "Beston Climate Systems offers reliable ac & refrigeration in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 81,
    "name": "Shorsh Cleaning Services",
    "category": "cleaning",
    "owner": "Shorsh Rasul",
    "phone": "0771 370 2330",
    "whatsapp": "0771 370 2330",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 48,
    "verified": false,
    "description": "Shorsh Cleaning Services offers reliable home cleaning in Zargata, Sulaymaniyah."
  },
  {
    "id": 82,
    "name": "Diyar Cleaning Services",
    "category": "cleaning",
    "owner": "Zana Mahmud",
    "phone": "0781 398 1534",
    "whatsapp": "0781 398 1534",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 76,
    "verified": false,
    "description": "Diyar Cleaning Services offers reliable home cleaning in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 83,
    "name": "Sardar Cleaning Services",
    "category": "cleaning",
    "owner": "Nazdar Salih",
    "phone": "0771 535 2880",
    "whatsapp": "0771 535 2880",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 169,
    "verified": true,
    "description": "Sardar Cleaning Services offers reliable home cleaning in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 84,
    "name": "Hawre Cleaning Services",
    "category": "cleaning",
    "owner": "Hemin Hussein",
    "phone": "0773 709 5728",
    "whatsapp": "0773 709 5728",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 123,
    "verified": false,
    "description": "Hawre Cleaning Services offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 85,
    "name": "Snur Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Hawre Sheikhani",
    "phone": "0781 548 2317",
    "whatsapp": "0781 548 2317",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 114,
    "verified": false,
    "description": "Snur Home Cleaning Co. offers reliable home cleaning in Empire Area, Sulaymaniyah."
  },
  {
    "id": 86,
    "name": "Shorsh Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Kawa Karim",
    "phone": "0750 883 5415",
    "whatsapp": "0750 883 5415",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 48,
    "verified": false,
    "description": "Shorsh Home Cleaning Co. offers reliable home cleaning in Andazyari, Sulaymaniyah."
  },
  {
    "id": 87,
    "name": "Halgurd Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Payam Jaza",
    "phone": "0780 750 9056",
    "whatsapp": "0780 750 9056",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 124,
    "verified": true,
    "description": "Halgurd Home Cleaning Co. offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 88,
    "name": "Sherko Home Cleaning Co.",
    "category": "cleaning",
    "owner": "Nazdar Rasul",
    "phone": "0775 521 9117",
    "whatsapp": "0775 521 9117",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 106,
    "verified": false,
    "description": "Sherko Home Cleaning Co. offers reliable home cleaning in Salim Street, Sulaymaniyah."
  },
  {
    "id": 89,
    "name": "Dilshad Cleaning Services",
    "category": "cleaning",
    "owner": "Sardar Karim",
    "phone": "0773 431 2899",
    "whatsapp": "0773 431 2899",
    "address": "Qirga, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 107,
    "verified": false,
    "description": "Dilshad Cleaning Services offers reliable home cleaning in Qirga, Sulaymaniyah."
  },
  {
    "id": 90,
    "name": "Newroz Cleaning Services",
    "category": "cleaning",
    "owner": "Nazdar Barzinji",
    "phone": "0780 155 4073",
    "whatsapp": "0780 155 4073",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 163,
    "verified": false,
    "description": "Newroz Cleaning Services offers reliable home cleaning in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 91,
    "name": "Halgurd Moving Services",
    "category": "moving",
    "owner": "Shene Hussein",
    "phone": "0773 662 3146",
    "whatsapp": "0773 662 3146",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 116,
    "verified": false,
    "description": "Halgurd Moving Services offers reliable movers & packers in Zargata, Sulaymaniyah."
  },
  {
    "id": 92,
    "name": "Rekan Movers & Packers",
    "category": "moving",
    "owner": "Kawa Kakei",
    "phone": "0770 418 1224",
    "whatsapp": "0770 418 1224",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 27,
    "verified": true,
    "description": "Rekan Movers & Packers offers reliable movers & packers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 93,
    "name": "Newroz Movers & Packers",
    "category": "moving",
    "owner": "Sardar Rasul",
    "phone": "0781 833 5781",
    "whatsapp": "0781 833 5781",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 73,
    "verified": false,
    "description": "Newroz Movers & Packers offers reliable movers & packers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 94,
    "name": "Rekan Moving Services",
    "category": "moving",
    "owner": "Bnar Mahmud",
    "phone": "0770 492 4122",
    "whatsapp": "0770 492 4122",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 134,
    "verified": false,
    "description": "Rekan Moving Services offers reliable movers & packers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 95,
    "name": "Shvan Movers & Packers",
    "category": "moving",
    "owner": "Hawre Aziz",
    "phone": "0773 940 1042",
    "whatsapp": "0773 940 1042",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": false,
    "description": "Shvan Movers & Packers offers reliable movers & packers in Qirga, Sulaymaniyah."
  },
  {
    "id": 96,
    "name": "Awat Cargo & Relocation",
    "category": "moving",
    "owner": "Rekan Faraj",
    "phone": "0781 453 6446",
    "whatsapp": "0781 453 6446",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 143,
    "verified": false,
    "description": "Awat Cargo & Relocation offers reliable movers & packers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 97,
    "name": "Payam Moving Services",
    "category": "moving",
    "owner": "Goran Qadir",
    "phone": "0780 339 7730",
    "whatsapp": "0780 339 7730",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 125,
    "verified": false,
    "description": "Payam Moving Services offers reliable movers & packers in Andazyari, Sulaymaniyah."
  },
  {
    "id": 98,
    "name": "Beston Moving Services",
    "category": "moving",
    "owner": "Ranj Faraj",
    "phone": "0750 229 9229",
    "whatsapp": "0750 229 9229",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 88,
    "verified": false,
    "description": "Beston Moving Services offers reliable movers & packers in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 99,
    "name": "Goran Moving Services",
    "category": "moving",
    "owner": "Aram Sheikhani",
    "phone": "0750 839 3361",
    "whatsapp": "0750 839 3361",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 171,
    "verified": false,
    "description": "Goran Moving Services offers reliable movers & packers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 100,
    "name": "Hemin Moving Services",
    "category": "moving",
    "owner": "Beston Jaza",
    "phone": "0780 765 2315",
    "whatsapp": "0780 765 2315",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 176,
    "verified": false,
    "description": "Hemin Moving Services offers reliable movers & packers in Qirga, Sulaymaniyah."
  },
  {
    "id": 101,
    "name": "Ranj Car Service Center",
    "category": "mechanics",
    "owner": "Halgurd Sultan",
    "phone": "0750 732 2121",
    "whatsapp": "0750 732 2121",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 179,
    "verified": false,
    "description": "Ranj Car Service Center offers reliable car mechanics in Empire Area, Sulaymaniyah."
  },
  {
    "id": 102,
    "name": "Bnar Mechanics Workshop",
    "category": "mechanics",
    "owner": "Hemin Aziz",
    "phone": "0751 554 3725",
    "whatsapp": "0751 554 3725",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 11,
    "verified": true,
    "description": "Bnar Mechanics Workshop offers reliable car mechanics in Goizha, Sulaymaniyah."
  },
  {
    "id": 103,
    "name": "Beston Auto Repair Garage",
    "category": "mechanics",
    "owner": "Peshraw Rashid",
    "phone": "0780 249 5000",
    "whatsapp": "0780 249 5000",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 148,
    "verified": false,
    "description": "Beston Auto Repair Garage offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 104,
    "name": "Diyar Auto Repair Garage",
    "category": "mechanics",
    "owner": "Diyar Karim",
    "phone": "0780 734 4945",
    "whatsapp": "0780 734 4945",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 153,
    "verified": true,
    "description": "Diyar Auto Repair Garage offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 105,
    "name": "Sardar Mechanics Workshop",
    "category": "mechanics",
    "owner": "Hawre Mahmud",
    "phone": "0750 923 8622",
    "whatsapp": "0750 923 8622",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 177,
    "verified": false,
    "description": "Sardar Mechanics Workshop offers reliable car mechanics in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 106,
    "name": "Hemin Car Service Center",
    "category": "mechanics",
    "owner": "Bakhtiar Zangana",
    "phone": "0780 806 5097",
    "whatsapp": "0780 806 5097",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 81,
    "verified": true,
    "description": "Hemin Car Service Center offers reliable car mechanics in Ashty, Sulaymaniyah."
  },
  {
    "id": 107,
    "name": "Aram Auto Repair Garage",
    "category": "mechanics",
    "owner": "Ranj Zangana",
    "phone": "0773 816 5837",
    "whatsapp": "0773 816 5837",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 172,
    "verified": false,
    "description": "Aram Auto Repair Garage offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 108,
    "name": "Kawa Mechanics Workshop",
    "category": "mechanics",
    "owner": "Goran Hussein",
    "phone": "0781 952 5689",
    "whatsapp": "0781 952 5689",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 62,
    "verified": false,
    "description": "Kawa Mechanics Workshop offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 109,
    "name": "Bakhtiar Auto Repair Garage",
    "category": "mechanics",
    "owner": "Halgurd Qadir",
    "phone": "0773 794 3240",
    "whatsapp": "0773 794 3240",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 164,
    "verified": false,
    "description": "Bakhtiar Auto Repair Garage offers reliable car mechanics in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 110,
    "name": "Peshraw Car Service Center",
    "category": "mechanics",
    "owner": "Rebaz Zangana",
    "phone": "0770 192 5835",
    "whatsapp": "0770 192 5835",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 110,
    "verified": true,
    "description": "Peshraw Car Service Center offers reliable car mechanics in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 111,
    "name": "Shvan Shine Car Care",
    "category": "carwash",
    "owner": "Handren Rashid",
    "phone": "0773 950 3695",
    "whatsapp": "0773 950 3695",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 127,
    "verified": false,
    "description": "Shvan Shine Car Care offers reliable car wash & detailing in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 112,
    "name": "Peshraw Shine Car Care",
    "category": "carwash",
    "owner": "Goran Sofi",
    "phone": "0781 177 3306",
    "whatsapp": "0781 177 3306",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 61,
    "verified": false,
    "description": "Peshraw Shine Car Care offers reliable car wash & detailing in Goizha, Sulaymaniyah."
  },
  {
    "id": 113,
    "name": "Chnur Shine Car Care",
    "category": "carwash",
    "owner": "Ranj Barzinji",
    "phone": "0751 909 7464",
    "whatsapp": "0751 909 7464",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 141,
    "verified": true,
    "description": "Chnur Shine Car Care offers reliable car wash & detailing in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 114,
    "name": "Bakhtiar Shine Car Care",
    "category": "carwash",
    "owner": "Chnur Jaza",
    "phone": "0780 942 7086",
    "whatsapp": "0780 942 7086",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 63,
    "verified": false,
    "description": "Bakhtiar Shine Car Care offers reliable car wash & detailing in Raparin, Sulaymaniyah."
  },
  {
    "id": 115,
    "name": "Shorsh Shine Car Care",
    "category": "carwash",
    "owner": "Sherko Kakei",
    "phone": "0751 750 8606",
    "whatsapp": "0751 750 8606",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 81,
    "verified": false,
    "description": "Shorsh Shine Car Care offers reliable car wash & detailing in Andazyari, Sulaymaniyah."
  },
  {
    "id": 116,
    "name": "Aram Car Wash & Detailing",
    "category": "carwash",
    "owner": "Rebaz Hussein",
    "phone": "0781 218 2592",
    "whatsapp": "0781 218 2592",
    "address": "Ashty, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 141,
    "verified": true,
    "description": "Aram Car Wash & Detailing offers reliable car wash & detailing in Ashty, Sulaymaniyah."
  },
  {
    "id": 117,
    "name": "Sardar Auto Spa",
    "category": "carwash",
    "owner": "Nazdar Barzinji",
    "phone": "0770 524 2622",
    "whatsapp": "0770 524 2622",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 161,
    "verified": false,
    "description": "Sardar Auto Spa offers reliable car wash & detailing in Iskan, Sulaymaniyah."
  },
  {
    "id": 118,
    "name": "Hawre Car Wash & Detailing",
    "category": "carwash",
    "owner": "Snur Rashid",
    "phone": "0781 555 4868",
    "whatsapp": "0781 555 4868",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 29,
    "verified": false,
    "description": "Hawre Car Wash & Detailing offers reliable car wash & detailing in Zargata, Sulaymaniyah."
  },
  {
    "id": 119,
    "name": "Handren Shine Car Care",
    "category": "carwash",
    "owner": "Bakhtiar Hussein",
    "phone": "0773 294 3001",
    "whatsapp": "0773 294 3001",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 120,
    "verified": true,
    "description": "Handren Shine Car Care offers reliable car wash & detailing in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 120,
    "name": "Karwan Shine Car Care",
    "category": "carwash",
    "owner": "Halgurd Kakei",
    "phone": "0750 905 6464",
    "whatsapp": "0750 905 6464",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 36,
    "verified": false,
    "description": "Karwan Shine Car Care offers reliable car wash & detailing in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 121,
    "name": "Karwan Photography Studio",
    "category": "photography",
    "owner": "Newroz Barzinji",
    "phone": "0771 932 4817",
    "whatsapp": "0771 932 4817",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 41,
    "verified": false,
    "description": "Karwan Photography Studio offers reliable photographers in Zargata, Sulaymaniyah."
  },
  {
    "id": 122,
    "name": "Shorsh Photography Studio",
    "category": "photography",
    "owner": "Hawre Faraj",
    "phone": "0773 917 3858",
    "whatsapp": "0773 917 3858",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 10,
    "verified": true,
    "description": "Shorsh Photography Studio offers reliable photographers in Rapareen, Sulaymaniyah."
  },
  {
    "id": 123,
    "name": "Bakhtiar Photography Studio",
    "category": "photography",
    "owner": "Awat Sofi",
    "phone": "0770 371 1858",
    "whatsapp": "0770 371 1858",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 111,
    "verified": false,
    "description": "Bakhtiar Photography Studio offers reliable photographers in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 124,
    "name": "Chnur Photography Studio",
    "category": "photography",
    "owner": "Rekan Mahmud",
    "phone": "0751 562 9254",
    "whatsapp": "0751 562 9254",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 161,
    "verified": true,
    "description": "Chnur Photography Studio offers reliable photographers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 125,
    "name": "Beston Studio",
    "category": "photography",
    "owner": "Twana Baban",
    "phone": "0750 162 8847",
    "whatsapp": "0750 162 8847",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 113,
    "verified": false,
    "description": "Beston Studio offers reliable photographers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 126,
    "name": "Rekan Studio",
    "category": "photography",
    "owner": "Payam Mahmud",
    "phone": "0751 429 3430",
    "whatsapp": "0751 429 3430",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 74,
    "verified": false,
    "description": "Rekan Studio offers reliable photographers in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 127,
    "name": "Awat Studio",
    "category": "photography",
    "owner": "Snur Sofi",
    "phone": "0773 564 9282",
    "whatsapp": "0773 564 9282",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 29,
    "verified": false,
    "description": "Awat Studio offers reliable photographers in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 128,
    "name": "Aram Studio",
    "category": "photography",
    "owner": "Halgurd Barzinji",
    "phone": "0780 562 4743",
    "whatsapp": "0780 562 4743",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 120,
    "verified": false,
    "description": "Aram Studio offers reliable photographers in Zargata, Sulaymaniyah."
  },
  {
    "id": 129,
    "name": "Sherko Photo & Video",
    "category": "photography",
    "owner": "Sherko Jaza",
    "phone": "0770 803 8770",
    "whatsapp": "0770 803 8770",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 25,
    "verified": true,
    "description": "Sherko Photo & Video offers reliable photographers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 130,
    "name": "Chnur Photo & Video",
    "category": "photography",
    "owner": "Beston Faraj",
    "phone": "0750 700 6400",
    "whatsapp": "0750 700 6400",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 109,
    "verified": false,
    "description": "Chnur Photo & Video offers reliable photographers in Empire Area, Sulaymaniyah."
  },
  {
    "id": 131,
    "name": "Nazdar Fashion Atelier",
    "category": "tailoring",
    "owner": "Goran Hussein",
    "phone": "0773 460 2697",
    "whatsapp": "0773 460 2697",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 58,
    "verified": true,
    "description": "Nazdar Fashion Atelier offers reliable tailors & fashion in Ashty, Sulaymaniyah."
  },
  {
    "id": 132,
    "name": "Rekan Tailoring House",
    "category": "tailoring",
    "owner": "Goran Rasul",
    "phone": "0775 217 5564",
    "whatsapp": "0775 217 5564",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 113,
    "verified": false,
    "description": "Rekan Tailoring House offers reliable tailors & fashion in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 133,
    "name": "Shene Custom Tailors",
    "category": "tailoring",
    "owner": "Shorsh Barzinji",
    "phone": "0773 129 3955",
    "whatsapp": "0773 129 3955",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 83,
    "verified": false,
    "description": "Shene Custom Tailors offers reliable tailors & fashion in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 134,
    "name": "Bakhtiar Tailoring House",
    "category": "tailoring",
    "owner": "Diyar Faraj",
    "phone": "0780 171 3324",
    "whatsapp": "0780 171 3324",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 11,
    "verified": true,
    "description": "Bakhtiar Tailoring House offers reliable tailors & fashion in Raparin, Sulaymaniyah."
  },
  {
    "id": 135,
    "name": "Twana Tailoring House",
    "category": "tailoring",
    "owner": "Ranj Aziz",
    "phone": "0775 261 7062",
    "whatsapp": "0775 261 7062",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 87,
    "verified": false,
    "description": "Twana Tailoring House offers reliable tailors & fashion in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 136,
    "name": "Awat Custom Tailors",
    "category": "tailoring",
    "owner": "Hemin Hussein",
    "phone": "0770 872 1815",
    "whatsapp": "0770 872 1815",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 73,
    "verified": false,
    "description": "Awat Custom Tailors offers reliable tailors & fashion in Rapareen, Sulaymaniyah."
  },
  {
    "id": 137,
    "name": "Zana Fashion Atelier",
    "category": "tailoring",
    "owner": "Shorsh Mahmud",
    "phone": "0773 320 9394",
    "whatsapp": "0773 320 9394",
    "address": "Iskan, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 114,
    "verified": true,
    "description": "Zana Fashion Atelier offers reliable tailors & fashion in Iskan, Sulaymaniyah."
  },
  {
    "id": 138,
    "name": "Nazdar Custom Tailors",
    "category": "tailoring",
    "owner": "Awat Sultan",
    "phone": "0773 146 4612",
    "whatsapp": "0773 146 4612",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 157,
    "verified": true,
    "description": "Nazdar Custom Tailors offers reliable tailors & fashion in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 139,
    "name": "Karwan Fashion Atelier",
    "category": "tailoring",
    "owner": "Karwan Faraj",
    "phone": "0773 435 2965",
    "whatsapp": "0773 435 2965",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 114,
    "verified": true,
    "description": "Karwan Fashion Atelier offers reliable tailors & fashion in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 140,
    "name": "Ranj Custom Tailors",
    "category": "tailoring",
    "owner": "Snur Salih",
    "phone": "0775 173 7505",
    "whatsapp": "0775 173 7505",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 14,
    "verified": false,
    "description": "Ranj Custom Tailors offers reliable tailors & fashion in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 141,
    "name": "Sardar Bakery & Pastry",
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0780 687 7626",
    "whatsapp": "0780 687 7626",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 110,
    "verified": true,
    "description": "Sardar Bakery & Pastry offers reliable bakeries & pastry in Raparin, Sulaymaniyah."
  },
  {
    "id": 142,
    "name": "Ranj Bakery & Pastry",
    "category": "bakery",
    "owner": "Sherko Amin",
    "phone": "0781 951 6928",
    "whatsapp": "0781 951 6928",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 31,
    "verified": true,
    "description": "Ranj Bakery & Pastry offers reliable bakeries & pastry in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 143,
    "name": "Awat Sweets & Bakery",
    "category": "bakery",
    "owner": "Twana Karim",
    "phone": "0773 863 6562",
    "whatsapp": "0773 863 6562",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 47,
    "verified": true,
    "description": "Awat Sweets & Bakery offers reliable bakeries & pastry in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 144,
    "name": "Halgurd Bakery & Pastry",
    "category": "bakery",
    "owner": "Twana Sheikhani",
    "phone": "0775 459 3419",
    "whatsapp": "0775 459 3419",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 41,
    "verified": true,
    "description": "Halgurd Bakery & Pastry offers reliable bakeries & pastry in Zargata, Sulaymaniyah."
  },
  {
    "id": 145,
    "name": "Diyar Pastry Shop",
    "category": "bakery",
    "owner": "Shvan Karim",
    "phone": "0781 575 8354",
    "whatsapp": "0781 575 8354",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 148,
    "verified": false,
    "description": "Diyar Pastry Shop offers reliable bakeries & pastry in Salim Street, Sulaymaniyah."
  },
  {
    "id": 146,
    "name": "Shorsh Sweets & Bakery",
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0781 169 8682",
    "whatsapp": "0781 169 8682",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 81,
    "verified": false,
    "description": "Shorsh Sweets & Bakery offers reliable bakeries & pastry in Rapareen, Sulaymaniyah."
  },
  {
    "id": 147,
    "name": "Awat Bakery & Pastry",
    "category": "bakery",
    "owner": "Bakhtiar Sheikhani",
    "phone": "0773 572 8404",
    "whatsapp": "0773 572 8404",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 98,
    "verified": false,
    "description": "Awat Bakery & Pastry offers reliable bakeries & pastry in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 148,
    "name": "Hemin Pastry Shop",
    "category": "bakery",
    "owner": "Goran Karim",
    "phone": "0780 573 1672",
    "whatsapp": "0780 573 1672",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 150,
    "verified": false,
    "description": "Hemin Pastry Shop offers reliable bakeries & pastry in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 149,
    "name": "Sherko Pastry Shop",
    "category": "bakery",
    "owner": "Rekan Sheikhani",
    "phone": "0750 561 2695",
    "whatsapp": "0750 561 2695",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 91,
    "verified": false,
    "description": "Sherko Pastry Shop offers reliable bakeries & pastry in Rapareen, Sulaymaniyah."
  },
  {
    "id": 150,
    "name": "Rebaz Bakery & Pastry",
    "category": "bakery",
    "owner": "Snur Mahmud",
    "phone": "0770 472 7108",
    "whatsapp": "0770 472 7108",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 103,
    "verified": false,
    "description": "Rebaz Bakery & Pastry offers reliable bakeries & pastry in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 151,
    "name": "Sherko Kitchen & Events",
    "category": "catering",
    "owner": "Shorsh Hussein",
    "phone": "0751 437 2548",
    "whatsapp": "0751 437 2548",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 102,
    "verified": true,
    "description": "Sherko Kitchen & Events offers reliable restaurants & catering in Qirga, Sulaymaniyah."
  },
  {
    "id": 152,
    "name": "Chnur Kitchen & Events",
    "category": "catering",
    "owner": "Payam Kakei",
    "phone": "0775 183 3317",
    "whatsapp": "0775 183 3317",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 83,
    "verified": false,
    "description": "Chnur Kitchen & Events offers reliable restaurants & catering in Rapareen, Sulaymaniyah."
  },
  {
    "id": 153,
    "name": "Snur Kitchen & Events",
    "category": "catering",
    "owner": "Ranj Faraj",
    "phone": "0751 417 7171",
    "whatsapp": "0751 417 7171",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 88,
    "verified": false,
    "description": "Snur Kitchen & Events offers reliable restaurants & catering in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 154,
    "name": "Nazdar Kitchen & Events",
    "category": "catering",
    "owner": "Newroz Sheikhani",
    "phone": "0780 620 6928",
    "whatsapp": "0780 620 6928",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 83,
    "verified": true,
    "description": "Nazdar Kitchen & Events offers reliable restaurants & catering in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 155,
    "name": "Karwan Catering Services",
    "category": "catering",
    "owner": "Shene Sultan",
    "phone": "0771 240 3538",
    "whatsapp": "0771 240 3538",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 29,
    "verified": false,
    "description": "Karwan Catering Services offers reliable restaurants & catering in Zargata, Sulaymaniyah."
  },
  {
    "id": 156,
    "name": "Dilshad Kitchen & Events",
    "category": "catering",
    "owner": "Handren Sheikhani",
    "phone": "0775 997 3147",
    "whatsapp": "0775 997 3147",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 43,
    "verified": true,
    "description": "Dilshad Kitchen & Events offers reliable restaurants & catering in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 157,
    "name": "Newroz Kitchen & Events",
    "category": "catering",
    "owner": "Shene Kakei",
    "phone": "0781 144 7731",
    "whatsapp": "0781 144 7731",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 64,
    "verified": false,
    "description": "Newroz Kitchen & Events offers reliable restaurants & catering in Salim Street, Sulaymaniyah."
  },
  {
    "id": 158,
    "name": "Shorsh Catering Services",
    "category": "catering",
    "owner": "Shene Mahmud",
    "phone": "0771 416 8684",
    "whatsapp": "0771 416 8684",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 53,
    "verified": false,
    "description": "Shorsh Catering Services offers reliable restaurants & catering in Andazyari, Sulaymaniyah."
  },
  {
    "id": 159,
    "name": "Awat Catering Services",
    "category": "catering",
    "owner": "Sardar Baban",
    "phone": "0780 265 4271",
    "whatsapp": "0780 265 4271",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 39,
    "verified": false,
    "description": "Awat Catering Services offers reliable restaurants & catering in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 160,
    "name": "Rebaz Kitchen & Events",
    "category": "catering",
    "owner": "Rekan Rashid",
    "phone": "0751 828 9452",
    "whatsapp": "0751 828 9452",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 76,
    "verified": true,
    "description": "Rebaz Kitchen & Events offers reliable restaurants & catering in Empire Area, Sulaymaniyah."
  },
  {
    "id": 161,
    "name": "Diyar Beauty Center",
    "category": "beauty",
    "owner": "Sardar Sheikhani",
    "phone": "0780 193 4637",
    "whatsapp": "0780 193 4637",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 93,
    "verified": false,
    "description": "Diyar Beauty Center offers reliable beauty salons in Rapareen, Sulaymaniyah."
  },
  {
    "id": 162,
    "name": "Zana Beauty Salon",
    "category": "beauty",
    "owner": "Ranj Sheikhani",
    "phone": "0771 495 2337",
    "whatsapp": "0771 495 2337",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 11,
    "verified": true,
    "description": "Zana Beauty Salon offers reliable beauty salons in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 163,
    "name": "Aram Ladies Salon",
    "category": "beauty",
    "owner": "Halgurd Sofi",
    "phone": "0770 139 5700",
    "whatsapp": "0770 139 5700",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 124,
    "verified": false,
    "description": "Aram Ladies Salon offers reliable beauty salons in Rapareen, Sulaymaniyah."
  },
  {
    "id": 164,
    "name": "Shvan Ladies Salon",
    "category": "beauty",
    "owner": "Rekan Mahmud",
    "phone": "0750 181 1311",
    "whatsapp": "0750 181 1311",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 42,
    "verified": false,
    "description": "Shvan Ladies Salon offers reliable beauty salons in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 165,
    "name": "Chnur Ladies Salon",
    "category": "beauty",
    "owner": "Twana Aziz",
    "phone": "0773 343 5934",
    "whatsapp": "0773 343 5934",
    "address": "Goizha, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 65,
    "verified": false,
    "description": "Chnur Ladies Salon offers reliable beauty salons in Goizha, Sulaymaniyah."
  },
  {
    "id": 166,
    "name": "Beston Ladies Salon",
    "category": "beauty",
    "owner": "Sardar Karim",
    "phone": "0781 711 9782",
    "whatsapp": "0781 711 9782",
    "address": "Goizha, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 135,
    "verified": false,
    "description": "Beston Ladies Salon offers reliable beauty salons in Goizha, Sulaymaniyah."
  },
  {
    "id": 167,
    "name": "Snur Beauty Salon",
    "category": "beauty",
    "owner": "Peshraw Aziz",
    "phone": "0775 346 7825",
    "whatsapp": "0775 346 7825",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 175,
    "verified": true,
    "description": "Snur Beauty Salon offers reliable beauty salons in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 168,
    "name": "Bakhtiar Beauty Salon",
    "category": "beauty",
    "owner": "Twana Barzinji",
    "phone": "0750 499 8702",
    "whatsapp": "0750 499 8702",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 103,
    "verified": false,
    "description": "Bakhtiar Beauty Salon offers reliable beauty salons in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 169,
    "name": "Hawre Ladies Salon",
    "category": "beauty",
    "owner": "Kawa Rashid",
    "phone": "0775 346 2698",
    "whatsapp": "0775 346 2698",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 89,
    "verified": true,
    "description": "Hawre Ladies Salon offers reliable beauty salons in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 170,
    "name": "Bakhtiar Ladies Salon",
    "category": "beauty",
    "owner": "Sherko Amin",
    "phone": "0781 746 3986",
    "whatsapp": "0781 746 3986",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 20,
    "verified": false,
    "description": "Bakhtiar Ladies Salon offers reliable beauty salons in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 171,
    "name": "Sardar Barbershop",
    "category": "barber",
    "owner": "Peshraw Qadir",
    "phone": "0771 142 6170",
    "whatsapp": "0771 142 6170",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 135,
    "verified": false,
    "description": "Sardar Barbershop offers reliable barbershops in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 172,
    "name": "Newroz Gents Barber",
    "category": "barber",
    "owner": "Rekan Jaza",
    "phone": "0771 392 6848",
    "whatsapp": "0771 392 6848",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 16,
    "verified": false,
    "description": "Newroz Gents Barber offers reliable barbershops in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 173,
    "name": "Sherko Men's Salon",
    "category": "barber",
    "owner": "Aram Rashid",
    "phone": "0780 861 8204",
    "whatsapp": "0780 861 8204",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 102,
    "verified": true,
    "description": "Sherko Men's Salon offers reliable barbershops in Iskan, Sulaymaniyah."
  },
  {
    "id": 174,
    "name": "Diyar Men's Salon",
    "category": "barber",
    "owner": "Snur Sultan",
    "phone": "0773 920 2353",
    "whatsapp": "0773 920 2353",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 24,
    "verified": false,
    "description": "Diyar Men's Salon offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 175,
    "name": "Newroz Barbershop",
    "category": "barber",
    "owner": "Dilshad Baban",
    "phone": "0751 181 6372",
    "whatsapp": "0751 181 6372",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 82,
    "verified": false,
    "description": "Newroz Barbershop offers reliable barbershops in Qirga, Sulaymaniyah."
  },
  {
    "id": 176,
    "name": "Snur Men's Salon",
    "category": "barber",
    "owner": "Diyar Mahmud",
    "phone": "0781 143 6776",
    "whatsapp": "0781 143 6776",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 115,
    "verified": true,
    "description": "Snur Men's Salon offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 177,
    "name": "Beston Barbershop",
    "category": "barber",
    "owner": "Hemin Hama",
    "phone": "0770 131 3339",
    "whatsapp": "0770 131 3339",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 177,
    "verified": false,
    "description": "Beston Barbershop offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 178,
    "name": "Rebaz Barbershop",
    "category": "barber",
    "owner": "Hemin Salih",
    "phone": "0775 492 1530",
    "whatsapp": "0775 492 1530",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 177,
    "verified": false,
    "description": "Rebaz Barbershop offers reliable barbershops in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 179,
    "name": "Bakhtiar Men's Salon",
    "category": "barber",
    "owner": "Sardar Karim",
    "phone": "0770 642 7012",
    "whatsapp": "0770 642 7012",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 170,
    "verified": true,
    "description": "Bakhtiar Men's Salon offers reliable barbershops in Raparin, Sulaymaniyah."
  },
  {
    "id": 180,
    "name": "Aram Barbershop",
    "category": "barber",
    "owner": "Chnur Amin",
    "phone": "0780 675 2929",
    "whatsapp": "0780 675 2929",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 70,
    "verified": false,
    "description": "Aram Barbershop offers reliable barbershops in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 181,
    "name": "Karwan Advocates",
    "category": "legal",
    "owner": "Peshraw Sultan",
    "phone": "0751 238 2213",
    "whatsapp": "0751 238 2213",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 117,
    "verified": false,
    "description": "Karwan Advocates offers reliable lawyers in Zargata, Sulaymaniyah."
  },
  {
    "id": 182,
    "name": "Beston Advocates",
    "category": "legal",
    "owner": "Goran Sofi",
    "phone": "0751 663 9882",
    "whatsapp": "0751 663 9882",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": false,
    "description": "Beston Advocates offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 183,
    "name": "Snur Advocates",
    "category": "legal",
    "owner": "Payam Amin",
    "phone": "0771 224 4292",
    "whatsapp": "0771 224 4292",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 64,
    "verified": false,
    "description": "Snur Advocates offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 184,
    "name": "Kawa Legal Consultancy",
    "category": "legal",
    "owner": "Dilshad Zangana",
    "phone": "0781 922 3126",
    "whatsapp": "0781 922 3126",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 26,
    "verified": true,
    "description": "Kawa Legal Consultancy offers reliable lawyers in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 185,
    "name": "Ranj Advocates",
    "category": "legal",
    "owner": "Chnur Sultan",
    "phone": "0780 887 7708",
    "whatsapp": "0780 887 7708",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 22,
    "verified": true,
    "description": "Ranj Advocates offers reliable lawyers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 186,
    "name": "Sherko Advocates",
    "category": "legal",
    "owner": "Hemin Mahmud",
    "phone": "0775 231 3981",
    "whatsapp": "0775 231 3981",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 37,
    "verified": false,
    "description": "Sherko Advocates offers reliable lawyers in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 187,
    "name": "Payam Law Office",
    "category": "legal",
    "owner": "Newroz Rasul",
    "phone": "0770 411 3697",
    "whatsapp": "0770 411 3697",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 61,
    "verified": true,
    "description": "Payam Law Office offers reliable lawyers in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 188,
    "name": "Twana Legal Consultancy",
    "category": "legal",
    "owner": "Goran Karim",
    "phone": "0771 750 5496",
    "whatsapp": "0771 750 5496",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 81,
    "verified": false,
    "description": "Twana Legal Consultancy offers reliable lawyers in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 189,
    "name": "Hemin Advocates",
    "category": "legal",
    "owner": "Halgurd Amin",
    "phone": "0770 275 6531",
    "whatsapp": "0770 275 6531",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 148,
    "verified": true,
    "description": "Hemin Advocates offers reliable lawyers in Raparin, Sulaymaniyah."
  },
  {
    "id": 190,
    "name": "Goran Law Office",
    "category": "legal",
    "owner": "Hemin Hussein",
    "phone": "0773 766 4453",
    "whatsapp": "0773 766 4453",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 110,
    "verified": false,
    "description": "Goran Law Office offers reliable lawyers in Raparin, Sulaymaniyah."
  },
  {
    "id": 191,
    "name": "Kawa Tax & Accounting Services",
    "category": "accounting",
    "owner": "Handren Barzinji",
    "phone": "0773 594 5012",
    "whatsapp": "0773 594 5012",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 179,
    "verified": false,
    "description": "Kawa Tax & Accounting Services offers reliable accountants in Ashty, Sulaymaniyah."
  },
  {
    "id": 192,
    "name": "Sardar Accounting Office",
    "category": "accounting",
    "owner": "Snur Hussein",
    "phone": "0781 525 8933",
    "whatsapp": "0781 525 8933",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 91,
    "verified": false,
    "description": "Sardar Accounting Office offers reliable accountants in Salim Street, Sulaymaniyah."
  },
  {
    "id": 193,
    "name": "Sherko Audit Services",
    "category": "accounting",
    "owner": "Sherko Rashid",
    "phone": "0770 878 7070",
    "whatsapp": "0770 878 7070",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 31,
    "verified": true,
    "description": "Sherko Audit Services offers reliable accountants in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 194,
    "name": "Hawre Tax & Accounting Services",
    "category": "accounting",
    "owner": "Bnar Faraj",
    "phone": "0750 397 7293",
    "whatsapp": "0750 397 7293",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 111,
    "verified": true,
    "description": "Hawre Tax & Accounting Services offers reliable accountants in Goizha, Sulaymaniyah."
  },
  {
    "id": 195,
    "name": "Goran Accounting Office",
    "category": "accounting",
    "owner": "Newroz Sofi",
    "phone": "0775 294 3610",
    "whatsapp": "0775 294 3610",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 135,
    "verified": false,
    "description": "Goran Accounting Office offers reliable accountants in Raparin, Sulaymaniyah."
  },
  {
    "id": 196,
    "name": "Handren Tax & Accounting Services",
    "category": "accounting",
    "owner": "Rekan Ahmad",
    "phone": "0780 617 8491",
    "whatsapp": "0780 617 8491",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 59,
    "verified": false,
    "description": "Handren Tax & Accounting Services offers reliable accountants in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 197,
    "name": "Rebaz Accounting Office",
    "category": "accounting",
    "owner": "Peshraw Sultan",
    "phone": "0781 392 9793",
    "whatsapp": "0781 392 9793",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 31,
    "verified": false,
    "description": "Rebaz Accounting Office offers reliable accountants in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 198,
    "name": "Chnur Tax & Accounting Services",
    "category": "accounting",
    "owner": "Shene Hama",
    "phone": "0750 510 1838",
    "whatsapp": "0750 510 1838",
    "address": "Gulan Street, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 53,
    "verified": false,
    "description": "Chnur Tax & Accounting Services offers reliable accountants in Gulan Street, Sulaymaniyah."
  },
  {
    "id": 199,
    "name": "Peshraw Accounting Office",
    "category": "accounting",
    "owner": "Ranj Sheikhani",
    "phone": "0773 945 2946",
    "whatsapp": "0773 945 2946",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 28,
    "verified": false,
    "description": "Peshraw Accounting Office offers reliable accountants in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 200,
    "name": "Beston Tax & Accounting Services",
    "category": "accounting",
    "owner": "Dilshad Rashid",
    "phone": "0771 716 9341",
    "whatsapp": "0771 716 9341",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 14,
    "verified": true,
    "description": "Beston Tax & Accounting Services offers reliable accountants in Rapareen, Sulaymaniyah."
  },
  {
    "id": 201,
    "name": "Shvan Real Estate Group",
    "category": "realestate",
    "owner": "Sherko Sultan",
    "phone": "0781 252 9446",
    "whatsapp": "0781 252 9446",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 160,
    "verified": true,
    "description": "Shvan Real Estate Group offers reliable real estate agents in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 202,
    "name": "Ranj Real Estate Group",
    "category": "realestate",
    "owner": "Chnur Baban",
    "phone": "0775 619 9351",
    "whatsapp": "0775 619 9351",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 148,
    "verified": true,
    "description": "Ranj Real Estate Group offers reliable real estate agents in Raparin, Sulaymaniyah."
  },
  {
    "id": 203,
    "name": "Newroz Real Estate Office",
    "category": "realestate",
    "owner": "Bakhtiar Sofi",
    "phone": "0780 697 6040",
    "whatsapp": "0780 697 6040",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 180,
    "verified": false,
    "description": "Newroz Real Estate Office offers reliable real estate agents in Goizha, Sulaymaniyah."
  },
  {
    "id": 204,
    "name": "Shorsh Property Agency",
    "category": "realestate",
    "owner": "Hawre Zangana",
    "phone": "0771 838 1841",
    "whatsapp": "0771 838 1841",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 47,
    "verified": false,
    "description": "Shorsh Property Agency offers reliable real estate agents in Raparin, Sulaymaniyah."
  },
  {
    "id": 205,
    "name": "Chnur Real Estate Group",
    "category": "realestate",
    "owner": "Shene Hama",
    "phone": "0771 132 2800",
    "whatsapp": "0771 132 2800",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 116,
    "verified": true,
    "description": "Chnur Real Estate Group offers reliable real estate agents in Rapareen, Sulaymaniyah."
  },
  {
    "id": 206,
    "name": "Shvan Property Agency",
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0781 993 2020",
    "whatsapp": "0781 993 2020",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 136,
    "verified": true,
    "description": "Shvan Property Agency offers reliable real estate agents in Iskan, Sulaymaniyah."
  },
  {
    "id": 207,
    "name": "Sherko Real Estate Group",
    "category": "realestate",
    "owner": "Rekan Sheikhani",
    "phone": "0775 277 8531",
    "whatsapp": "0775 277 8531",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 91,
    "verified": false,
    "description": "Sherko Real Estate Group offers reliable real estate agents in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 208,
    "name": "Nazdar Real Estate Group",
    "category": "realestate",
    "owner": "Nazdar Jaza",
    "phone": "0781 296 5038",
    "whatsapp": "0781 296 5038",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 80,
    "verified": true,
    "description": "Nazdar Real Estate Group offers reliable real estate agents in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 209,
    "name": "Peshraw Property Agency",
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0775 591 6714",
    "whatsapp": "0775 591 6714",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 74,
    "verified": true,
    "description": "Peshraw Property Agency offers reliable real estate agents in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 210,
    "name": "Awat Real Estate Group",
    "category": "realestate",
    "owner": "Dilshad Hama",
    "phone": "0775 891 3399",
    "whatsapp": "0775 891 3399",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 77,
    "verified": false,
    "description": "Awat Real Estate Group offers reliable real estate agents in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 211,
    "name": "Hemin IT Solutions",
    "category": "it-repair",
    "owner": "Payam Mahmud",
    "phone": "0781 319 4310",
    "whatsapp": "0781 319 4310",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 73,
    "verified": false,
    "description": "Hemin IT Solutions offers reliable it & computer repair in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 212,
    "name": "Snur IT Solutions",
    "category": "it-repair",
    "owner": "Shvan Rasul",
    "phone": "0771 348 1831",
    "whatsapp": "0771 348 1831",
    "address": "Sarshaqam, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 139,
    "verified": true,
    "description": "Snur IT Solutions offers reliable it & computer repair in Sarshaqam, Sulaymaniyah."
  },
  {
    "id": 213,
    "name": "Bnar Computer Repair Center",
    "category": "it-repair",
    "owner": "Aram Aziz",
    "phone": "0781 202 3252",
    "whatsapp": "0781 202 3252",
    "address": "Qirga, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 144,
    "verified": false,
    "description": "Bnar Computer Repair Center offers reliable it & computer repair in Qirga, Sulaymaniyah."
  },
  {
    "id": 214,
    "name": "Diyar IT Solutions",
    "category": "it-repair",
    "owner": "Halgurd Sultan",
    "phone": "0771 874 5706",
    "whatsapp": "0771 874 5706",
    "address": "Chwarbakh, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 169,
    "verified": true,
    "description": "Diyar IT Solutions offers reliable it & computer repair in Chwarbakh, Sulaymaniyah."
  },
  {
    "id": 215,
    "name": "Shene Computer Repair Center",
    "category": "it-repair",
    "owner": "Halgurd Zangana",
    "phone": "0750 279 7846",
    "whatsapp": "0750 279 7846",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 49,
    "verified": false,
    "description": "Shene Computer Repair Center offers reliable it & computer repair in Andazyari, Sulaymaniyah."
  },
  {
    "id": 216,
    "name": "Rebaz IT Solutions",
    "category": "it-repair",
    "owner": "Beston Sultan",
    "phone": "0773 997 1613",
    "whatsapp": "0773 997 1613",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 149,
    "verified": false,
    "description": "Rebaz IT Solutions offers reliable it & computer repair in Salim Street, Sulaymaniyah."
  },
  {
    "id": 217,
    "name": "Payam IT Solutions",
    "category": "it-repair",
    "owner": "Peshraw Mahmud",
    "phone": "0781 237 9261",
    "whatsapp": "0781 237 9261",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 53,
    "verified": false,
    "description": "Payam IT Solutions offers reliable it & computer repair in Empire Area, Sulaymaniyah."
  },
  {
    "id": 218,
    "name": "Sherko Computer Repair Center",
    "category": "it-repair",
    "owner": "Chnur Mahmud",
    "phone": "0770 114 6523",
    "whatsapp": "0770 114 6523",
    "address": "Bakhtiary Town, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 149,
    "verified": false,
    "description": "Sherko Computer Repair Center offers reliable it & computer repair in Bakhtiary Town, Sulaymaniyah."
  },
  {
    "id": 219,
    "name": "Karwan Computer Repair Center",
    "category": "it-repair",
    "owner": "Shorsh Hama",
    "phone": "0775 188 7567",
    "whatsapp": "0775 188 7567",
    "address": "Iskan, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 51,
    "verified": false,
    "description": "Karwan Computer Repair Center offers reliable it & computer repair in Iskan, Sulaymaniyah."
  },
  {
    "id": 220,
    "name": "Rekan IT Solutions",
    "category": "it-repair",
    "owner": "Payam Salih",
    "phone": "0773 492 4858",
    "whatsapp": "0773 492 4858",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 72,
    "verified": false,
    "description": "Rekan IT Solutions offers reliable it & computer repair in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 221,
    "name": "Peshraw Occasions Planner",
    "category": "events",
    "owner": "Chnur Zangana",
    "phone": "0773 769 6890",
    "whatsapp": "0773 769 6890",
    "address": "Sarchinar, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 19,
    "verified": false,
    "description": "Peshraw Occasions Planner offers reliable event planners in Sarchinar, Sulaymaniyah."
  },
  {
    "id": 222,
    "name": "Sardar Weddings & Events",
    "category": "events",
    "owner": "Diyar Hama",
    "phone": "0773 806 2923",
    "whatsapp": "0773 806 2923",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 79,
    "verified": false,
    "description": "Sardar Weddings & Events offers reliable event planners in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 223,
    "name": "Bnar Event Planning",
    "category": "events",
    "owner": "Shvan Sultan",
    "phone": "0781 865 7121",
    "whatsapp": "0781 865 7121",
    "address": "Rapareen, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 144,
    "verified": false,
    "description": "Bnar Event Planning offers reliable event planners in Rapareen, Sulaymaniyah."
  },
  {
    "id": 224,
    "name": "Shene Occasions Planner",
    "category": "events",
    "owner": "Beston Qadir",
    "phone": "0751 638 8319",
    "whatsapp": "0751 638 8319",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 96,
    "verified": true,
    "description": "Shene Occasions Planner offers reliable event planners in Andazyari, Sulaymaniyah."
  },
  {
    "id": 225,
    "name": "Awat Event Planning",
    "category": "events",
    "owner": "Rebaz Barzinji",
    "phone": "0771 686 9792",
    "whatsapp": "0771 686 9792",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.8,
    "reviews": 87,
    "verified": false,
    "description": "Awat Event Planning offers reliable event planners in Shorsh Street, Sulaymaniyah."
  },
  {
    "id": 226,
    "name": "Sardar Event Planning",
    "category": "events",
    "owner": "Nazdar Qadir",
    "phone": "0781 193 9361",
    "whatsapp": "0781 193 9361",
    "address": "Raparin, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 18,
    "verified": false,
    "description": "Sardar Event Planning offers reliable event planners in Raparin, Sulaymaniyah."
  },
  {
    "id": 227,
    "name": "Twana Weddings & Events",
    "category": "events",
    "owner": "Sardar Zangana",
    "phone": "0781 788 6049",
    "whatsapp": "0781 788 6049",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 105,
    "verified": true,
    "description": "Twana Weddings & Events offers reliable event planners in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 228,
    "name": "Kawa Occasions Planner",
    "category": "events",
    "owner": "Karwan Zangana",
    "phone": "0750 533 6644",
    "whatsapp": "0750 533 6644",
    "address": "Malik Mahmud Ring Road, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 142,
    "verified": false,
    "description": "Kawa Occasions Planner offers reliable event planners in Malik Mahmud Ring Road, Sulaymaniyah."
  },
  {
    "id": 229,
    "name": "Payam Event Planning",
    "category": "events",
    "owner": "Payam Sultan",
    "phone": "0773 518 3948",
    "whatsapp": "0773 518 3948",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.7,
    "reviews": 168,
    "verified": false,
    "description": "Payam Event Planning offers reliable event planners in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 230,
    "name": "Halgurd Weddings & Events",
    "category": "events",
    "owner": "Bakhtiar Hama",
    "phone": "0780 484 2314",
    "whatsapp": "0780 484 2314",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.6,
    "reviews": 173,
    "verified": false,
    "description": "Halgurd Weddings & Events offers reliable event planners in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 231,
    "name": "Shvan Iron & Steel Works",
    "category": "metalwork",
    "owner": "Goran Rashid",
    "phone": "0770 650 7439",
    "whatsapp": "0770 650 7439",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 61,
    "verified": false,
    "description": "Shvan Iron & Steel Works offers reliable blacksmiths & metalwork in Goizha, Sulaymaniyah."
  },
  {
    "id": 232,
    "name": "Shene Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Peshraw Mahmud",
    "phone": "0780 644 7214",
    "whatsapp": "0780 644 7214",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 67,
    "verified": false,
    "description": "Shene Blacksmith Workshop offers reliable blacksmiths & metalwork in Empire Area, Sulaymaniyah."
  },
  {
    "id": 233,
    "name": "Shvan Metal Works",
    "category": "metalwork",
    "owner": "Karwan Rasul",
    "phone": "0780 729 1256",
    "whatsapp": "0780 729 1256",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 21,
    "verified": true,
    "description": "Shvan Metal Works offers reliable blacksmiths & metalwork in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 234,
    "name": "Rebaz Metal Works",
    "category": "metalwork",
    "owner": "Shorsh Hussein",
    "phone": "0750 511 8191",
    "whatsapp": "0750 511 8191",
    "address": "Andazyari, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 59,
    "verified": false,
    "description": "Rebaz Metal Works offers reliable blacksmiths & metalwork in Andazyari, Sulaymaniyah."
  },
  {
    "id": 235,
    "name": "Peshraw Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Newroz Zangana",
    "phone": "0775 342 5944",
    "whatsapp": "0775 342 5944",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 173,
    "verified": false,
    "description": "Peshraw Blacksmith Workshop offers reliable blacksmiths & metalwork in Qirga, Sulaymaniyah."
  },
  {
    "id": 236,
    "name": "Zana Metal Works",
    "category": "metalwork",
    "owner": "Hawre Hussein",
    "phone": "0770 741 7999",
    "whatsapp": "0770 741 7999",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.4,
    "reviews": 16,
    "verified": false,
    "description": "Zana Metal Works offers reliable blacksmiths & metalwork in Empire Area, Sulaymaniyah."
  },
  {
    "id": 237,
    "name": "Halgurd Iron & Steel Works",
    "category": "metalwork",
    "owner": "Ranj Sheikhani",
    "phone": "0780 518 3444",
    "whatsapp": "0780 518 3444",
    "address": "Qirga, Sulaymaniyah",
    "rating": 4.0,
    "reviews": 51,
    "verified": false,
    "description": "Halgurd Iron & Steel Works offers reliable blacksmiths & metalwork in Qirga, Sulaymaniyah."
  },
  {
    "id": 238,
    "name": "Rekan Blacksmith Workshop",
    "category": "metalwork",
    "owner": "Goran Salih",
    "phone": "0770 925 8586",
    "whatsapp": "0770 925 8586",
    "address": "Ashty, Sulaymaniyah",
    "rating": 4.9,
    "reviews": 147,
    "verified": false,
    "description": "Rekan Blacksmith Workshop offers reliable blacksmiths & metalwork in Ashty, Sulaymaniyah."
  },
  {
    "id": 239,
    "name": "Zana Iron & Steel Works",
    "category": "metalwork",
    "owner": "Twana Faraj",
    "phone": "0771 361 4331",
    "whatsapp": "0771 361 4331",
    "address": "Kurdistan Street, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 24,
    "verified": false,
    "description": "Zana Iron & Steel Works offers reliable blacksmiths & metalwork in Kurdistan Street, Sulaymaniyah."
  },
  {
    "id": 240,
    "name": "Goran Metal Works",
    "category": "metalwork",
    "owner": "Hemin Barzinji",
    "phone": "0750 374 7179",
    "whatsapp": "0750 374 7179",
    "address": "Zargata, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 158,
    "verified": true,
    "description": "Goran Metal Works offers reliable blacksmiths & metalwork in Zargata, Sulaymaniyah."
  },
  {
    "id": 241,
    "name": "Hemin Welding Workshop",
    "category": "welding",
    "owner": "Beston Zangana",
    "phone": "0771 590 4422",
    "whatsapp": "0771 590 4422",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 89,
    "verified": true,
    "description": "Hemin Welding Workshop offers reliable welders in Empire Area, Sulaymaniyah."
  },
  {
    "id": 242,
    "name": "Payam Welding Workshop",
    "category": "welding",
    "owner": "Karwan Qadir",
    "phone": "0781 348 4350",
    "whatsapp": "0781 348 4350",
    "address": "Goizha, Sulaymaniyah",
    "rating": 4.2,
    "reviews": 65,
    "verified": false,
    "description": "Payam Welding Workshop offers reliable welders in Goizha, Sulaymaniyah."
  },
  {
    "id": 243,
    "name": "Shene Welding & Fabrication",
    "category": "welding",
    "owner": "Ranj Mahmud",
    "phone": "0775 415 5285",
    "whatsapp": "0775 415 5285",
    "address": "Empire Area, Sulaymaniyah",
    "rating": 4.1,
    "reviews": 131,
    "verified": false,
    "description": "Shene Welding & Fabrication offers reliable welders in Empire Area, Sulaymaniyah."
  },
  {
    "id": 244,
    "name": "Beston Steel Welding Services",
    "category": "welding",
    "owner": "Rekan Sofi",
    "phone": "0775 420 7781",
    "whatsapp": "0775 420 7781",
    "address": "Zargata, Sulaymaniyah",
    "rating": 3.7,
    "reviews": 60,
    "verified": false,
    "description": "Beston Steel Welding Services offers reliable welders in Zargata, Sulaymaniyah."
  },
  {
    "id": 245,
    "name": "Kawa Welding & Fabrication",
    "category": "welding",
    "owner": "Dilshad Zangana",
    "phone": "0780 402 3497",
    "whatsapp": "0780 402 3497",
    "address": "Raparin, Sulaymaniyah",
    "rating": 3.9,
    "reviews": 62,
    "verified": false,
    "description": "Kawa Welding & Fabrication offers reliable welders in Raparin, Sulaymaniyah."
  },
  {
    "id": 246,
    "name": "Newroz Welding Workshop",
    "category": "welding",
    "owner": "Rekan Barzinji",
    "phone": "0773 881 9005",
    "whatsapp": "0773 881 9005",
    "address": "Qirga, Sulaymaniyah",
    "rating": 5.0,
    "reviews": 168,
    "verified": false,
    "description": "Newroz Welding Workshop offers reliable welders in Qirga, Sulaymaniyah."
  },
  {
    "id": 247,
    "name": "Sardar Welding Workshop",
    "category": "welding",
    "owner": "Chnur Rashid",
    "phone": "0770 837 9954",
    "whatsapp": "0770 837 9954",
    "address": "Salim Street, Sulaymaniyah",
    "rating": 4.3,
    "reviews": 142,
    "verified": false,
    "description": "Sardar Welding Workshop offers reliable welders in Salim Street, Sulaymaniyah."
  },
  {
    "id": 248,
    "name": "Rebaz Steel Welding Services",
    "category": "welding",
    "owner": "Rebaz Karim",
    "phone": "0750 522 3252",
    "whatsapp": "0750 522 3252",
    "address": "Bakhtiary, Sulaymaniyah",
    "rating": 4.8,
    "reviews": 63,
    "verified": true,
    "description": "Rebaz Steel Welding Services offers reliable welders in Bakhtiary, Sulaymaniyah."
  },
  {
    "id": 249,
    "name": "Shvan Welding Workshop",
    "category": "welding",
    "owner": "Karwan Sheikhani",
    "phone": "0775 161 8916",
    "whatsapp": "0775 161 8916",
    "address": "Dwezakh, Sulaymaniyah",
    "rating": 4.5,
    "reviews": 8,
    "verified": true,
    "description": "Shvan Welding Workshop offers reliable welders in Dwezakh, Sulaymaniyah."
  },
  {
    "id": 250,
    "name": "Dilshad Welding & Fabrication",
    "category": "welding",
    "owner": "Kawa Ahmad",
    "phone": "0773 648 5697",
    "whatsapp": "0773 648 5697",
    "address": "Shorsh Street, Sulaymaniyah",
    "rating": 3.6,
    "reviews": 176,
    "verified": false,
    "description": "Dilshad Welding & Fabrication offers reliable welders in Shorsh Street, Sulaymaniyah."
  }
];


/* ---------------- ICONS (inline, no deps) ---------------- */

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "search": return <svg {...common}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case "phone": return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92z"/></svg>;
    case "whatsapp": return <svg {...common} strokeWidth="1.5"><path d="M21 11.5a8.5 8.5 0 0 1-12.5 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 9.5c.3 2.5 2.5 4.7 5 5"/></svg>;
    case "pin": return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "star": return <svg {...common} fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
    case "check": return <svg {...common}><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>;
    case "back": return <svg {...common}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
    case "plus": return <svg {...common}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
    case "trash": return <svg {...common}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>;
    case "edit": return <svg {...common}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>;
    case "shield": return <svg {...common}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/></svg>;
    case "grid": return <svg {...common}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "wrench": return <svg {...common}><path d="M14.7 6.3a4 4 0 1 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-3-3z"/><path d="M17 2l3 3-2 2-3-3z"/></svg>;
    case "bolt": return <svg {...common}><polygon points="13 2 3 14 11 14 10 22 21 10 13 10 13 2"/></svg>;
    case "hammer": return <svg {...common}><path d="M15 12l-8.5 8.5a1.5 1.5 0 0 1-2-2L13 10"/><path d="M13 3l7 7-3 3-7-7z"/></svg>;
    case "ruler": return <svg {...common}><rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/></svg>;
    case "building": return <svg {...common}><rect x="4" y="3" width="16" height="18"/><path d="M9 21v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1"/></svg>;
    case "sofa": return <svg {...common}><path d="M4 13V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v5"/><path d="M3 13h18v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M5 19v2M19 19v2"/></svg>;
    case "brush": return <svg {...common}><path d="M9.5 14.5L18 6a2.1 2.1 0 0 0-3-3l-8.5 8.5"/><path d="M8 12l4 4-3 3.5A3 3 0 0 1 4.5 20 3 3 0 0 1 4 15.5z"/></svg>;
    case "wind": return <svg {...common}><path d="M3 8h9a2.5 2.5 0 1 0-2.4-3.2"/><path d="M3 12h13a2.5 2.5 0 1 1-2.4 3.2"/><path d="M3 16h7a2 2 0 1 1-1.9 2.6"/></svg>;
    case "sparkles": return <svg {...common}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.7 2.1L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.9z"/></svg>;
    case "truck": return <svg {...common}><rect x="1" y="7" width="13" height="10"/><path d="M14 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>;
    case "car": return <svg {...common}><path d="M4 16V11l2-5h12l2 5v5"/><path d="M4 16h16v2a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H7v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><circle cx="7.5" cy="16" r="1.4"/><circle cx="16.5" cy="16" r="1.4"/></svg>;
    case "drop": return <svg {...common}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/></svg>;
    case "camera": return <svg {...common}><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13.5" r="3.5"/></svg>;
    case "thread": return <svg {...common}><circle cx="7" cy="7" r="3"/><path d="M9.5 9.5C13 11 15 15 21 15"/><path d="M17 12c1 1 1 2.5 0 3.5"/></svg>;
    case "scissors": return <svg {...common}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20M20 4L8.5 15.5"/></svg>;
    case "cake": return <svg {...common}><path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7z"/><path d="M4 17h16"/><path d="M9 12V8M12 12V6M15 12V8"/><path d="M12 3v1"/></svg>;
    case "utensils": return <svg {...common}><path d="M6 2v8a2 2 0 0 0 4 0V2M8 10v12"/><path d="M16 2c-1.5 0-3 2-3 5s1 5 3 5v10"/></svg>;
    case "sparkle": return <svg {...common}><path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/></svg>;
    case "scale": return <svg {...common}><path d="M12 3v18M7 21h10"/><path d="M5 7l3.5-1.5L12 7"/><path d="M12 7l3.5-1.5L19 7"/><path d="M3 7l2 5a2.5 2.5 0 0 0 5 0L8 7"/><path d="M14 7l2 5a2.5 2.5 0 0 0 5 0L19 7"/></svg>;
    case "calculator": return <svg {...common}><rect x="5" y="2" width="14" height="20" rx="1"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h.01M12 19h.01"/></svg>;
    case "key": return <svg {...common}><circle cx="8" cy="8" r="5"/><path d="M11.5 11.5L21 21M17 17l2-2M14 14l2-2"/></svg>;
    case "monitor": return <svg {...common}><rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/></svg>;
    case "confetti": return <svg {...common}><path d="M4 20l5-15 11 11z"/><path d="M17 4l1 1M20 8l1 1M14 2l1 1"/></svg>;
    case "flame": return <svg {...common}><path d="M12 2c2 3-1 4-1 7a3 3 0 0 0 6 0c2 2 2 5 0 8a7 7 0 0 1-13 0c-1-3 0-5 2-7 0 2 1 3 2 3-1-3 1-6 4-11z"/></svg>;
    case "spark": return <svg {...common}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"/></svg>;
    case "more": return <svg {...common} fill="currentColor" stroke="none"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>;
    case "share": return <svg {...common}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.7l7.6-4.4M8.2 13.3l7.6 4.4"/></svg>;
    case "navigation": return <svg {...common}><polygon points="3 11 21 3 13 21 11 13 3 11"/></svg>;
    case "idcard": return <svg {...common}><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M6 16c.5-1.5 1.8-2 2-2s1.5.5 2 2"/><path d="M13 10h6M13 13h6M13 16h4"/></svg>;
    case "heart": return <svg {...common}><path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 2 4.5 5.5 4c2-.3 3.8.7 6.5 3 2.7-2.3 4.5-3.3 6.5-3C22 4.5 23.6 8 22 11.2c-2.5 4.7-10 9.3-10 9.3z"/></svg>;
    case "user": return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>;
    case "chevron": return <svg {...common}><polyline points="9 6 15 12 9 18"/></svg>;
    case "store": return <svg {...common}><path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM9 20v-6h6v6"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>;
    case "play": return <svg {...common} fill="currentColor" stroke="none"><path d="M8 5l11 7-11 7z"/></svg>;
    default: return null;
  }
};

/* ---------------- APP ---------------- */

export default function App() {
  const [onboardingStep, setOnboardingStep] = useState(() => {
    try {
      if (!localStorage.getItem("bm_language")) return "intro";
      if (!localStorage.getItem("bm_city")) return "city";
    } catch (e) {}
    return null;
  });
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem("bm_language") || "ku"; } catch (e) { return "ku"; }
  });
  const [city, setCity] = useState(() => {
    try { return localStorage.getItem("bm_city") || "sulaymaniyah"; } catch (e) { return "sulaymaniyah"; }
  });

  const continueFromLanguage = () => {
    try { localStorage.setItem("bm_language", language); } catch (e) {}
    setOnboardingStep("city");
  };
  const finishOnboarding = () => {
    try { localStorage.setItem("bm_city", city); } catch (e) {}
    setOnboardingStep(null);
  };
  const backToLanguage = () => setOnboardingStep("language");
  const replayIntro = () => setOnboardingStep("intro");
  const changeLanguage = () => setOnboardingStep("language");
  const changeCity = () => setOnboardingStep("city");

  const cityName = CITIES.find((c) => c.id === city)?.name || city;
  const langName = LANGUAGES.find((l) => l.code === language)?.name || language;

  const [activeTab, setActiveTab] = useState("search"); // search | favorites | account
  const [view, setView] = useState(null); // null | category | profile | admin
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBiz, setSelectedBiz] = useState(null);
  const [businesses, setBusinesses] = useState(BUSINESSES);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [favorites, setFavorites] = useState(() => new Set());
  const [editing, setEditing] = useState(null);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return businesses.filter((b) =>
      b.name.toLowerCase().includes(q) ||
      categories.find((c) => c.id === b.category)?.name.toLowerCase().includes(q) ||
      b.address.toLowerCase().includes(q)
    );
  }, [businesses, categories, query]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    businesses.forEach((b) => { counts[b.category] = (counts[b.category] || 0) + 1; });
    return counts;
  }, [businesses]);

  const favoriteBusinesses = useMemo(
    () => businesses.filter((b) => favorites.has(b.id)),
    [businesses, favorites]
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const openProfile = (b) => {
    setSelectedBiz(b);
    setView("profile");
  };

  const openProfileFromSearch = (b) => {
    setSelectedCategory(null);
    openProfile(b);
  };

  const openCategory = (catId) => {
    setSelectedCategory(catId);
    setView("category");
  };

  const saveBusiness = (biz) => {
    setBusinesses((prev) => {
      const exists = prev.some((b) => b.id === biz.id);
      if (exists) return prev.map((b) => (b.id === biz.id ? biz : b));
      return [...prev, { ...biz, id: Math.max(0, ...prev.map((b) => b.id)) + 1 }];
    });
    setEditing(null);
  };

  const deleteBusiness = (id) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
  };

  const addCategory = (cat) => {
    setCategories((prev) => [...prev, cat]);
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const showTabBar = view === null;

  if (onboardingStep === "intro") {
    return (
      <div style={styles.app} className="bm-glass-root">
        <style>{globalCss}</style>
        <BackgroundField />
        <Intro onEnter={() => setOnboardingStep("language")} />
      </div>
    );
  }

  if (onboardingStep === "language") {
    return (
      <div style={styles.app} className="bm-glass-root">
        <style>{globalCss}</style>
        <BackgroundField />
        <OnboardingLanguage language={language} onSelect={setLanguage} onContinue={continueFromLanguage} />
      </div>
    );
  }

  if (onboardingStep === "city") {
    return (
      <div style={styles.app} className="bm-glass-root">
        <style>{globalCss}</style>
        <BackgroundField />
        <OnboardingCity city={city} onSelect={setCity} onContinue={finishOnboarding} onBack={backToLanguage} />
      </div>
    );
  }

  return (
    <div style={styles.app} className="bm-glass-root">
      <style>{globalCss}</style>
      <BackgroundField />

      <div style={showTabBar ? styles.tabContent : undefined}>
        {view === null && activeTab === "search" && (
          <Home
            query={query} setQuery={setQuery}
            searchResults={searchResults}
            categoryCounts={categoryCounts}
            categories={categories}
            businesses={businesses}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            openProfile={openProfileFromSearch}
            openCategory={openCategory}
            cityName={cityName}
            onChangeCity={changeCity}
          />
        )}

        {view === null && activeTab === "favorites" && (
          <Favorites
            businesses={favoriteBusinesses}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            openProfile={openProfile}
          />
        )}

        {view === null && activeTab === "account" && (
          <Account
            businessCount={businesses.length}
            categoryCount={categories.length}
            favoriteCount={favorites.size}
            cityName={cityName}
            langName={langName}
            goAdmin={() => setView("admin")}
            goRegister={() => setView("register")}
            goReplayIntro={replayIntro}
            goChangeLanguage={changeLanguage}
            goChangeCity={changeCity}
          />
        )}
      </div>

      {view === "category" && selectedCategory && (
        <CategoryView
          categoryId={selectedCategory}
          categories={categories}
          businesses={businesses.filter((b) => b.category === selectedCategory)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          openProfile={openProfile}
          onBack={() => { setView(null); setSelectedCategory(null); }}
          cityName={cityName}
        />
      )}

      {view === "profile" && selectedBiz && (
        <Profile
          biz={selectedBiz}
          categories={categories}
          isFavorite={favorites.has(selectedBiz.id)}
          onToggleFavorite={() => toggleFavorite(selectedBiz.id)}
          onBack={() => setView(selectedCategory ? "category" : null)}
        />
      )}

      {view === "register" && (
        <RegisterBusiness
          categories={categories}
          onBack={() => setView(null)}
        />
      )}

      {view === "admin" && (
        <Admin
          businesses={businesses}
          categories={categories}
          onBack={() => { setView(null); setEditing(null); }}
          onSave={saveBusiness}
          onDelete={deleteBusiness}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          editing={editing}
          setEditing={setEditing}
        />
      )}

      {showTabBar && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} favoriteCount={favorites.size} />
      )}
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, favoriteCount }) {
  const tabs = [
    { id: "search", label: "Search", icon: "search" },
    { id: "favorites", label: "Favorites", icon: "heart" },
    { id: "account", label: "Account", icon: "user" },
  ];
  return (
    <div className="bm-nav-glass bm-bottom-nav">
      {tabs.map((t) => {
        const active = activeTab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="bm-nav-btn"
            style={active ? { ...styles.navBtn, ...styles.navBtnActive } : styles.navBtn}
          >
            <span style={styles.navIconWrap}>
              <Icon name={t.icon} size={19} />
              {t.id === "favorites" && favoriteCount > 0 && (
                <span style={styles.navBadge}>{favoriteCount}</span>
              )}
            </span>
            <span style={styles.navLabel}>{t.label}</span>
            {active && <span style={styles.navActiveBar} />}
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- ONBOARDING: LANGUAGE ---------------- */

function OnboardingLanguage({ language, onSelect, onContinue }) {
  return (
    <div style={styles.onboardWrap}>
      <div style={styles.onboardSteps}>
        <span style={{ ...styles.onboardStepDot, ...styles.onboardStepDotActive }} />
        <span style={styles.onboardStepDot} />
      </div>

      <div style={styles.onboardLogoRow}>
        <Logo width={104} />
      </div>

      <h1 style={styles.onboardH1}>Choose your language</h1>
      <p style={styles.onboardSub}>You can change this later in Account.</p>

      <div style={styles.onboardBody}>
        <div style={styles.choiceList}>
          {LANGUAGES.map((lang, i) => {
            const active = language === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className={`bm-choice${active ? " active" : ""}`}
                style={{ "--i": i }}
              >
                <span className="bm-orbi" style={{ width: 40, height: 40 }}>
                  <span style={{ fontSize: 12, fontWeight: 800 }}>{lang.code.toUpperCase()}</span>
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b style={styles.choiceName}>{lang.name}</b>
                  <small style={styles.choiceSub}>{lang.sub}</small>
                </span>
                <span style={active ? { ...styles.tick, ...styles.tickActive } : styles.tick} />
              </div>
            );
          })}
        </div>
      </div>

      <button style={styles.cta} onClick={onContinue}>Continue</button>
    </div>
  );
}

/* ---------------- ONBOARDING: CITY ---------------- */

function OnboardingCity({ city, onSelect, onContinue, onBack }) {
  return (
    <div style={styles.onboardWrap}>
      <div style={styles.onboardSteps}>
        <span style={{ ...styles.onboardStepDot, ...styles.onboardStepDotActive }} />
        <span style={{ ...styles.onboardStepDot, ...styles.onboardStepDotActive }} />
      </div>

      <div style={styles.onboardBackRow}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label="Back">
          <Icon name="back" size={16} />
        </button>
        <Logo width={84} />
      </div>

      <h1 style={styles.onboardH1}>Where are you?</h1>
      <p style={styles.onboardSub}>We'll show services near you first.</p>

      <div style={styles.onboardBody}>
        <div style={styles.choiceList}>
          {CITIES.map((c, i) => {
            const active = city === c.id;
            return (
              <div
                key={c.id}
                onClick={() => c.live && onSelect(c.id)}
                className={`bm-choice${active ? " active" : ""}${c.live ? "" : " soon"}`}
                style={{ "--i": i }}
              >
                <span className="bm-orbi" style={{ width: 40, height: 40 }}>
                  <Icon name="pin" size={17} />
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <b style={styles.choiceName}>{c.name}</b>
                  <small style={styles.choiceSub}>{c.sub}</small>
                </span>
                {c.live
                  ? <span style={active ? { ...styles.tick, ...styles.tickActive } : styles.tick} />
                  : <span style={styles.soonChip}>SOON</span>}
              </div>
            );
          })}
        </div>
      </div>

      <button style={styles.cta} onClick={onContinue}>Start exploring</button>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ query, setQuery, searchResults, categoryCounts, categories, businesses, favorites, onToggleFavorite, openProfile, openCategory, cityName, onChangeCity }) {
  const [focused, setFocused] = useState(false);
  const businessCount = businesses.length;
  const isSearching = query.trim().length > 0;

  return (
    <div style={styles.screenPad} className="bm-hero">
      <div style={styles.topbar}>
        <Logo width={92} />
        <button style={styles.cityPill} onClick={onChangeCity} className="bm-hero-logo">
          <Icon name="pin" size={14} /> {cityName}
        </button>
      </div>

      <h2 style={styles.homeH2} className="bm-hero-title">Find trusted craftsmen &amp; services</h2>
      <p style={styles.heroSubtitle} className="bm-hero-sub">
        {businessCount}+ verified professionals across {categories.length} categories
      </p>

      <div
        style={{ ...styles.searchWrap, ...(focused ? styles.searchWrapFocus : {}) }}
        className="bm-glass bm-search"
      >
        <Icon name="search" size={17} />
        <input
          style={styles.searchInput}
          placeholder="Plumber, electrician, cleaning…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      {isSearching ? (
        <>
          <div style={styles.resultsMeta} className="bm-meta" key={`meta-${query}`}>
            {searchResults.length} results for "{query}"
          </div>
          <div style={styles.list} key={`grid-${query}`}>
            {searchResults.map((b, i) => (
              <Card
                key={b.id} biz={b} categories={categories} index={i}
                isFavorite={favorites.has(b.id)}
                onToggleFavorite={() => onToggleFavorite(b.id)}
                onClick={() => openProfile(b)}
              />
            ))}
            {searchResults.length === 0 && (
              <div style={styles.empty} className="bm-empty">
                <span className="bm-orbi" style={{ width: 84, height: 84 }}><Icon name="search" size={30} /></span>
                No listings match that search.
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.sectionTitle} className="bm-meta">Categories</div>
          <div style={styles.categoryGrid}>
            {categories.map((c, i) => (
              <CategoryTile
                key={c.id}
                category={c}
                count={categoryCounts[c.id] || 0}
                index={i}
                onClick={() => openCategory(c.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CategoryTile({ category, count, index, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bm-cat-tile bm-cat-glass"
      style={{ ...styles.categoryTile, "--i": index }}
    >
      <span className="bm-orbi bm-cat-icon" style={{ width: 48, height: 48 }}>
        <Icon name={category.icon} size={22} />
      </span>
      <div>
        <div style={styles.categoryTileName}>{category.name}</div>
        <div style={styles.categoryTileCount}>{count} places</div>
      </div>
    </button>
  );
}

function CategoryView({ categoryId, categories, businesses, favorites, onToggleFavorite, openProfile, onBack, cityName }) {
  const category = categories.find((c) => c.id === categoryId);
  const verifiedCount = businesses.filter((b) => b.verified).length;
  return (
    <div style={styles.screenPad}>
      <div style={styles.topbar}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label="Back">
          <Icon name="back" size={16} />
        </button>
        <span style={styles.cityPill}><Icon name="pin" size={14} /> {cityName}</span>
      </div>

      <div style={styles.categoryViewHeader} className="bm-bizcard">
        <span className="bm-orbi" style={{ width: 72, height: 72 }}>
          <Icon name={category.icon} size={30} />
        </span>
        <div>
          <h1 style={styles.categoryViewTitle}>{category.name}</h1>
          <div style={styles.categoryViewSub}>{businesses.length} places · {verifiedCount} verified</div>
        </div>
      </div>

      <div style={styles.list}>
        {businesses.map((b, i) => (
          <Card
            key={b.id} biz={b} categories={categories} index={i}
            isFavorite={favorites.has(b.id)}
            onToggleFavorite={() => onToggleFavorite(b.id)}
            onClick={() => openProfile(b)}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ biz, categories, index, isFavorite, onToggleFavorite, onClick }) {
  const catName = categories.find((c) => c.id === biz.category)?.name;
  return (
    <button
      style={{ "--i": index % 20 }}
      className="bm-card bm-biz-glass"
      onClick={onClick}
    >
      <span className="bm-orbi" style={{ width: 48, height: 48 }}>
        <Logo width={26} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "grid", gap: 4, textAlign: "left" }}>
        <span style={styles.cardNameRow}>
          <span style={styles.cardName}>{biz.name}</span>
          {biz.verified && (
            <span style={styles.verifiedBadge} className="bm-verified" title="Verified">
              <Icon name="check" size={12} />
            </span>
          )}
        </span>
        <span style={styles.cardCat}>{catName} · {biz.address.split(",")[0]}</span>
        <span style={styles.rating}><Icon name="star" size={13} /> {biz.rating} <span style={styles.reviewCount}>({biz.reviews})</span></span>
      </span>
      <span
        role="button"
        style={{ ...styles.favBtn, ...(isFavorite ? styles.favBtnActive : {}) }}
        className="bm-fav-btn"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Icon name="heart" size={16} />
      </span>
    </button>
  );
}

/* ---------------- FAVORITES ---------------- */

function Favorites({ businesses, categories, favorites, onToggleFavorite, openProfile }) {
  return (
    <div style={styles.screenPad}>
      <div className="bm-meta">
        <h1 style={styles.onboardH1}>Favorites</h1>
        <p style={styles.onboardSub}>Places you saved, in one place.</p>
      </div>

      {businesses.length === 0 ? (
        <div style={styles.empty} className="bm-empty">
          <span className="bm-orbi" style={{ width: 84, height: 84 }}><Icon name="heart" size={30} /></span>
          <b style={{ color: "#f4f6f7" }}>No favorites yet</b>
          Tap the heart on any place to save it here.
        </div>
      ) : (
        <div style={styles.list}>
          {businesses.map((b, i) => (
            <Card
              key={b.id} biz={b} categories={categories} index={i}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
              onClick={() => openProfile(b)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- ACCOUNT ---------------- */

function Account({ businessCount, categoryCount, favoriteCount, cityName, langName, goAdmin, goRegister, goReplayIntro, goChangeLanguage, goChangeCity }) {
  const menu = [
    { icon: "store", title: "List Your Business", sub: "Get your business on Bmnassa", onClick: goRegister },
    { icon: "shield", title: "Admin Panel", sub: "Manage listings & categories", onClick: goAdmin },
    { icon: "globe", title: "Language", sub: "Change app language", onClick: goChangeLanguage },
    { icon: "pin", title: "City", sub: "Change your city", onClick: goChangeCity },
    { icon: "play", title: "Replay Intro", sub: "See the opening animation again", onClick: goReplayIntro },
  ];
  return (
    <div style={styles.screenPad}>
      <div style={styles.accountHero} className="bm-bizcard">
        <span className="bm-orbi" style={{ width: 72, height: 72 }}><Logo width={40} /></span>
        <div>
          <h1 style={styles.accountWelcome}>Welcome</h1>
          <div style={styles.accountSub}>{cityName} · {langName}</div>
        </div>
      </div>

      <div style={styles.accountStatsRow} className="bm-cascade">
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{businessCount}</span>
          <span style={styles.accountStatLabel}>Places</span>
        </div>
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{categoryCount}</span>
          <span style={styles.accountStatLabel}>Categories</span>
        </div>
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{favoriteCount}</span>
          <span style={styles.accountStatLabel}>Favorites</span>
        </div>
      </div>

      <div style={styles.accountList} className="bm-glass">
        {menu.map((m) => (
          <button key={m.title} style={styles.accountRow} className="bm-account-row" onClick={m.onClick}>
            <span className="bm-orbi" style={styles.accountRowIcon}><Icon name={m.icon} size={17} /></span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={styles.accountRowTitle}>{m.title}</span>
              <span style={styles.accountRowSub}>{m.sub}</span>
            </span>
            <Icon name="chevron" size={16} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------------- REGISTER BUSINESS ---------------- */

const emptyRegisterForm = {
  name: "", category: "", owner: "", phone: "", whatsapp: "", city: "", address: "", description: "",
};

const BMNASSA_WHATSAPP_NUMBER = "9647508177096";
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxfqdwDmqolp0rBeDW8mxwGy43rjaI0eNPZ1UGbIOIqtZ_b75_-gEY7xZ4gA6ChVn_f/exec";

function RegisterBusiness({ categories, onBack }) {
  const [form, setForm] = useState(emptyRegisterForm);
  const [sent, setSent] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = form.name.trim() && form.category && form.phone.trim() && form.city;

  const catName = categories.find((c) => c.id === form.category)?.name || form.category;
  const cityName = CITIES.find((c) => c.id === form.city)?.name || form.city;

  const openWhatsAppFallback = () => {
    const lines = [
      "New business registration for Bmnassa:",
      "",
      `Business name: ${form.name.trim()}`,
      `Category: ${catName}`,
      form.owner.trim() && `Owner: ${form.owner.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.whatsapp.trim() && `WhatsApp: ${form.whatsapp.trim()}`,
      `City: ${cityName}`,
      form.address.trim() && `Address / neighborhood: ${form.address.trim()}`,
      form.description.trim() && `Description: ${form.description.trim()}`,
    ].filter(Boolean);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${BMNASSA_WHATSAPP_NUMBER}?text=${text}`, "_blank");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);

    const params = new URLSearchParams({
      name: form.name.trim(),
      category: catName,
      owner: form.owner.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      city: cityName,
      address: form.address.trim(),
      description: form.description.trim(),
    });

    try {
      // Apps Script web apps don't return CORS headers, so we send this
      // "no-cors": the row still gets appended, we just can't read the response.
      await fetch(SHEET_WEBAPP_URL, { method: "POST", mode: "no-cors", body: params });
      setUsedFallback(false);
      setSent(true);
    } catch (err) {
      // Real network failure (offline, blocked, etc.) — fall back to WhatsApp so the
      // submission isn't lost.
      openWhatsAppFallback();
      setUsedFallback(true);
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div style={styles.registerWrap}>
        <button style={styles.backBtn} onClick={onBack}>
          <Icon name="back" size={18} /> Back to app
        </button>
        <div style={styles.registerSentWrap}>
          <div style={styles.registerSentIcon}>
            <Icon name="check" size={28} />
          </div>
          <div style={styles.registerSentTitle}>
            {usedFallback ? "Almost done!" : "Submitted!"}
          </div>
          <div style={styles.registerSentSub}>
            {usedFallback
              ? "We couldn't reach our system, so we opened WhatsApp with your details filled in instead — just hit send and our team will take it from there."
              : "Your business details have been saved. Our team will review them and add your listing to Bmnassa shortly."}
          </div>
          <button style={styles.saveBtn} onClick={() => { setSent(false); setForm(emptyRegisterForm); }}>
            Register another business
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.registerWrap}>
      <button style={styles.backBtn} onClick={onBack}>
        <Icon name="back" size={18} /> Back to app
      </button>
      <h1 style={styles.adminTitle}>List Your Business</h1>
      <div style={styles.adminSub}>
        Fill in your details below — your submission is saved automatically and our team will review it shortly.
      </div>

      <form style={styles.form} onSubmit={submit}>
        <input style={styles.input} placeholder="Business name *" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <select style={styles.input} value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Category *</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input style={styles.input} placeholder="Owner name" value={form.owner}
          onChange={(e) => setForm({ ...form, owner: e.target.value })} />

        <input style={styles.input} placeholder="Phone *" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <input style={styles.input} placeholder="WhatsApp (if different from phone)" value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />

        <select style={styles.input} value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}>
          <option value="">City *</option>
          {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <input style={styles.input} placeholder="Address / neighborhood" value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <textarea style={{ ...styles.input, minHeight: 70 }} placeholder="Short description of your business"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

        <div style={styles.formBtnRow}>
          <button type="submit" style={{ ...styles.saveBtn, opacity: canSubmit && !submitting ? 1 : 0.5 }} disabled={!canSubmit || submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- PROFILE ---------------- */

function Profile({ biz, categories, isFavorite, onToggleFavorite, onBack }) {
  const catName = categories.find((c) => c.id === biz.category)?.name;
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const waLink = `https://wa.me/964${cleanPhone.replace(/^0/, "")}`;
  const establishedYear = 2024 - (biz.id % 12);
  const [expanded, setExpanded] = useState(false);

  const qrSrc = buildQrSrc(biz);

  const handleShare = async () => {
    const text = `${biz.name} — ${catName}\n${biz.address}\n${biz.phone}`;
    if (navigator.share) {
      try { await navigator.share({ title: biz.name, text }); } catch (e) {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(biz.address + ", Sulaymaniyah")}`, "_blank");
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${biz.name}\nORG:${biz.name}\nTEL;TYPE=CELL:${cleanPhone}\nADR:;;${biz.address};;;;\nNOTE:${catName}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${biz.name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    { icon: "whatsapp", label: "WhatsApp", onClick: () => window.open(waLink, "_blank") },
    { icon: "share", label: "Share", onClick: handleShare },
    { icon: "navigation", label: "Directions", onClick: handleDirections },
    { icon: "idcard", label: "Save contact", onClick: handleSaveContact },
  ];

  return (
    <div style={styles.profileWrap}>
      <div style={styles.profileTopBar}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label="Back">
          <Icon name="back" size={16} />
        </button>
        <span style={styles.profileTopTitle}>Service profile</span>
        <button
          style={{ ...styles.iconBtnGlass, ...(isFavorite ? styles.favIconActive : {}) }}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Icon name="heart" size={17} />
        </button>
      </div>

      <div style={styles.bizCard} className="bm-card-glow bm-bizcard">
        <Logo width={140} glow style={{ margin: "4px auto 8px", display: "block" }} />
        <div style={styles.profileNameRow}>
          <h1 style={styles.profileName}>{biz.name}</h1>
          {biz.verified && (
            <span style={styles.verifiedBadgeLg} title="Verified">
              <Icon name="check" size={13} />
            </span>
          )}
        </div>
        <div style={styles.profileCat}>{catName}</div>
        <div style={styles.rating}><Icon name="star" size={14} /> {biz.rating} <span style={styles.reviewCount}>· {biz.reviews} reviews</span></div>
      </div>

      <div style={styles.actionsRow}>
        {actions.map((a) => (
          <button key={a.label} style={styles.actionBtn} className="bm-social-btn" onClick={a.onClick}>
            <span className="bm-orbi" style={{ width: 54, height: 54 }}><Icon name={a.icon} size={20} /></span>
            {a.label}
          </button>
        ))}
      </div>

      <p style={styles.profileDesc}>{biz.description}</p>

      <div style={styles.infoBlock} className="bm-glass">
        <div style={styles.infoRow}><Icon name="pin" size={16} /> {biz.address}</div>
        <div style={styles.infoRow}><Icon name="phone" size={16} /> {biz.phone}</div>
        {biz.verified && <div style={styles.infoRow}><Icon name="shield" size={16} /> Verified by Bmnassa</div>}
      </div>

      <div style={styles.qrWrap} className="bm-glass">
        <img src={qrSrc} alt={`QR code for ${biz.name}`} style={styles.qrImg} />
        <div>
          <div style={styles.qrTitle}>Digital business card</div>
          <div style={styles.qrCaption}>Scan to save this contact.</div>
        </div>
      </div>

      <button style={styles.viewFullBtn} className="bm-view-full" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Hide details" : "View Full Profile"}
      </button>

      {expanded && (
        <div style={styles.expandedBlock} className="bm-expanded bm-glass">
          <div style={styles.infoRow}><Icon name="shield" size={16} /> Verified since {establishedYear}</div>
          <div style={styles.infoRow}><Icon name="star" size={16} /> {biz.reviews} customer reviews on Bmnassa</div>
          <div style={styles.infoRow}><Icon name="grid" size={16} /> Category: {catName}</div>
        </div>
      )}

      <div style={styles.ctaRow}>
        <a style={styles.ctaCall} href={`tel:${cleanPhone}`}>
          <Icon name="phone" size={16} /> Call
        </a>
        <a style={styles.ctaWhatsapp} href={waLink} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={16} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

/* ---------------- ADMIN ---------------- */

const emptyBusinessForm = {
  id: null, name: "", category: "", owner: "", phone: "",
  address: "", rating: 5.0, reviews: 0, verified: false, description: "",
};

const emptyCategoryForm = { name: "", icon: ICON_OPTIONS[0] };

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Admin({ businesses, categories, onBack, onSave, onDelete, onAddCategory, onDeleteCategory, editing, setEditing }) {
  const [form, setForm] = useState(editing || { ...emptyBusinessForm, category: categories[0]?.id || "" });
  const [catForm, setCatForm] = useState(emptyCategoryForm);
  const [showCatForm, setShowCatForm] = useState(false);

  const startNew = () => { setForm({ ...emptyBusinessForm, category: categories[0]?.id || "" }); setEditing({}); };
  const startEdit = (b) => { setForm(b); setEditing(b); };
  const cancel = () => { setEditing(null); setForm({ ...emptyBusinessForm, category: categories[0]?.id || "" }); };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    onSave({ ...form, rating: Number(form.rating), reviews: Number(form.reviews) });
  };

  const submitCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    const id = slugify(catForm.name);
    if (categories.some((c) => c.id === id)) return;
    onAddCategory({ id, name: catForm.name.trim(), icon: catForm.icon });
    setCatForm(emptyCategoryForm);
    setShowCatForm(false);
  };

  const handleDeleteCategory = (cat, count) => {
    if (count > 0 && !window.confirm(`${count} business(es) use "${cat.name}". Delete this category anyway? Those listings will stay but won't be browsable by category.`)) {
      return;
    }
    onDeleteCategory(cat.id);
  };

  return (
    <div style={styles.adminWrap}>
      <button style={styles.backBtn} onClick={onBack}>
        <Icon name="back" size={18} /> Back to app
      </button>
      <h1 style={styles.adminTitle}>Admin — Listings</h1>
      <div style={styles.adminSub}>{businesses.length} businesses across {categories.length} categories</div>

      <div style={styles.adminSectionHeader}>
        <span>Categories</span>
        <button style={styles.smallGhostBtn} onClick={() => setShowCatForm((v) => !v)}>
          <Icon name="plus" size={13} /> {showCatForm ? "Close" : "Add category"}
        </button>
      </div>

      {showCatForm && (
        <form style={styles.form} onSubmit={submitCategory}>
          <input style={styles.input} placeholder="Category name (e.g. Locksmiths)" value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          <select style={styles.input} value={catForm.icon}
            onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}>
            {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
          </select>
          <div style={styles.formBtnRow}>
            <button type="submit" style={styles.saveBtn}>Add category</button>
          </div>
        </form>
      )}

      <div style={styles.categoryAdminList}>
        {categories.map((c) => {
          const count = businesses.filter((b) => b.category === c.id).length;
          return (
            <div key={c.id} style={styles.categoryAdminRow}>
              <div style={styles.categoryAdminIcon}><Icon name={c.icon} size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.adminRowName}>{c.name}</div>
                <div style={styles.adminRowMeta}>{count} businesses</div>
              </div>
              <button style={styles.iconBtn} onClick={() => handleDeleteCategory(c, count)}>
                <Icon name="trash" size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={styles.adminSectionHeader}>
        <span>Listings</span>
      </div>

      {!editing && (
        <button style={styles.addBtn} onClick={startNew}>
          <Icon name="plus" size={16} /> Add business
        </button>
      )}

      {editing !== null && (
        <form style={styles.form} onSubmit={submit}>
          <input style={styles.input} placeholder="Business name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select style={styles.input} value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={styles.input} placeholder="Owner name" value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })} />
          <input style={styles.input} placeholder="Phone (e.g. 0770 123 4567)" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input style={styles.input} placeholder="Address / neighborhood" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <textarea style={{ ...styles.input, minHeight: 70 }} placeholder="Short description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label style={styles.checkboxRow}>
            <input type="checkbox" checked={form.verified}
              onChange={(e) => setForm({ ...form, verified: e.target.checked })} />
            Verified business
          </label>
          {form.name.trim() && form.phone.trim() && (
            <div style={styles.qrPreviewRow}>
              <img src={buildQrSrc({ ...form, phone: form.phone }, 90)} alt="QR preview" style={styles.qrPreviewImg} />
              <span style={styles.qrPreviewLabel}>QR preview — generated automatically from name, phone &amp; address</span>
            </div>
          )}
          <div style={styles.formBtnRow}>
            <button type="submit" style={styles.saveBtn}>Save</button>
            <button type="button" style={styles.cancelBtn} onClick={cancel}>Cancel</button>
          </div>
        </form>
      )}

      <div style={styles.adminList}>
        {businesses.map((b) => (
          <div key={b.id} style={styles.adminRow}>
            <img src={buildQrSrc(b, 90)} alt="" style={styles.adminRowQr} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.adminRowName}>{b.name} {b.verified && <Icon name="shield" size={13} />}</div>
              <div style={styles.adminRowMeta}>{categories.find((c) => c.id === b.category)?.name || "Uncategorized"} · {b.phone}</div>
            </div>
            <button style={styles.iconBtn} onClick={() => startEdit(b)}><Icon name="edit" size={15} /></button>
            <button style={styles.iconBtn} onClick={() => onDelete(b.id)}><Icon name="trash" size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #0d1318; }
  input, select, textarea, button { font-family: inherit; }
  input:focus, select:focus, textarea:focus { outline: 1.5px solid #ffffff55; }

  @keyframes bmFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bmPopIn {
    from { opacity: 0; transform: scale(0.75); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes bmSpinIn {
    from { opacity: 0; transform: rotate(-8deg) scale(0.9); }
    to { opacity: 1; transform: rotate(0deg) scale(1); }
  }

  .bm-hero { animation: bmFadeUp 0.55s cubic-bezier(.2,.7,.3,1) both; }
  .bm-hero-logo { animation: bmSpinIn 0.6s cubic-bezier(.2,.7,.3,1) both; }
  .bm-hero-title { animation: bmFadeUp 0.55s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.08s; }
  .bm-hero-sub { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.15s; }
  .bm-search { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.2s; transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.2s ease; }
  .bm-chips { animation: bmFadeUp 0.5s cubic-bezier(.2,.7,.3,1) both; animation-delay: 0.13s; }
  .bm-meta { animation: bmFadeUp 0.4s ease both; animation-delay: 0.18s; }
  .bm-empty { animation: bmFadeUp 0.4s ease both; }

  .bm-admin-btn { transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease; }
  .bm-admin-btn:hover { border-color: #666; }
  .bm-admin-btn:active { transform: scale(0.93); }

  .bm-chip { transition: transform 0.16s ease, background 0.25s ease, color 0.25s ease, border-color 0.25s ease; }
  .bm-chip:hover { border-color: #555; }
  .bm-chip:active { transform: scale(0.92); }
  .bm-chip.active { animation: bmPopIn 0.25s cubic-bezier(.3,1.4,.6,1) both; }

  .bm-cat-tile {
    animation: bmFadeUp 0.4s cubic-bezier(.16,.85,.3,1) both;
    animation-delay: calc(var(--i, 0) * 35ms);
    transition: transform 0.2s cubic-bezier(.2,.7,.3,1), border-color 0.2s ease, box-shadow 0.25s ease;
  }
  .bm-cat-tile:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(0,0,0,0.4); }
  .bm-cat-tile:hover .bm-cat-icon { transform: scale(1.08) rotate(-3deg); }
  .bm-cat-tile:active { transform: translateY(-1px) scale(0.98); }
  .bm-cat-icon { transition: transform 0.22s ease; }

  .bm-card {
    animation: bmFadeUp 0.45s cubic-bezier(.16,.85,.3,1) both;
    animation-delay: calc(var(--i, 0) * 40ms);
    transition: transform 0.22s cubic-bezier(.2,.7,.3,1), border-color 0.22s ease, box-shadow 0.25s ease;
  }
  .bm-card:hover { transform: translateY(-5px); border-color: #3a3a3a; box-shadow: 0 14px 28px rgba(0,0,0,0.45); }
  .bm-card:hover .bm-corner { border-width: 0 28px 28px 0; }
  .bm-card:hover .bm-avatar { transform: scale(1.06); }
  .bm-card:active { transform: translateY(-1px) scale(0.99); }
  .bm-corner { transition: border-width 0.25s ease; }
  .bm-avatar { transition: transform 0.22s ease; }
  .bm-verified { animation: bmPopIn 0.3s cubic-bezier(.3,1.4,.6,1) both; animation-delay: 0.1s; }

  .bm-bizcard { animation: bmFadeUp 0.5s cubic-bezier(.16,.85,.3,1) both; }
  .bm-expanded { animation: bmFadeUp 0.35s ease both; }
  .bm-social-btn { transition: transform 0.15s ease, border-color 0.2s ease, background 0.2s ease; }
  .bm-social-btn:hover { border-color: #1fc6c088; transform: translateY(-2px); }
  .bm-social-btn:active { transform: scale(0.9); }
  .bm-view-full { transition: transform 0.15s ease, background 0.2s ease; }
  .bm-view-full:active { transform: scale(0.98); }

  .bm-fav-btn { transition: transform 0.18s cubic-bezier(.3,1.4,.6,1), background 0.2s ease, border-color 0.2s ease; }
  .bm-fav-btn:active { transform: scale(0.85); }
  .bm-fav-btn.pulse { animation: bmPopIn 0.3s cubic-bezier(.3,1.4,.6,1) both; }

  .bm-nav-btn { transition: color 0.2s ease, transform 0.15s ease; }
  .bm-nav-btn:active { transform: scale(0.92); }
  .bm-bottom-nav { animation: bmFadeUp 0.4s ease both; }

  .bm-account-row { transition: transform 0.15s ease, border-color 0.2s ease; }
  .bm-account-row:hover { border-color: #3a3a3a; }
  .bm-account-row:active { transform: scale(0.98); }

  @media (prefers-reduced-motion: reduce) {
    .bm-hero, .bm-hero-logo, .bm-hero-title, .bm-hero-sub, .bm-search, .bm-chips, .bm-meta, .bm-empty,
    .bm-card, .bm-chip.active, .bm-verified, .bm-bizcard, .bm-expanded, .bm-bottom-nav { animation: none !important; }
    .bm-card, .bm-chip, .bm-admin-btn, .bm-corner, .bm-avatar, .bm-search, .bm-social-btn, .bm-view-full,
    .bm-fav-btn, .bm-nav-btn, .bm-account-row { transition: none !important; }
  }

  /* ---- Glass redesign ---- */
  .bm-glass-root, .bm-glass-root * { box-sizing: border-box; }
  .bm-glass-root { font-family: 'Manrope', 'Helvetica Neue', Arial, sans-serif; }

  .bm-blob { position: absolute; filter: blur(38px); opacity: 0.85; pointer-events: none; will-change: transform, border-radius; z-index: 0; }
  .bm-blob.teal { width: 130%; height: 46%; left: -35%; top: -12%; background: radial-gradient(closest-side, #0f6f78, rgba(15,111,120,0.55) 60%, transparent); animation: bmDriftA 14s ease-in-out infinite alternate, bmMorph 11s ease-in-out infinite; }
  .bm-blob.coral { width: 130%; height: 44%; right: -38%; bottom: -10%; background: radial-gradient(closest-side, #f0806a, rgba(185,87,63,0.6) 60%, transparent); animation: bmDriftB 16s ease-in-out infinite alternate, bmMorph 13s ease-in-out infinite reverse; }
  @keyframes bmDriftA { 0% { transform: translate(0,0) rotate(0); } 100% { transform: translate(10%,6%) rotate(16deg); } }
  @keyframes bmDriftB { 0% { transform: translate(0,0) rotate(0); } 100% { transform: translate(-12%,-6%) rotate(-14deg); } }
  @keyframes bmMorph { 0%,100% { border-radius: 42% 58% 63% 37% / 45% 38% 62% 55%; } 50% { border-radius: 61% 39% 35% 65% / 58% 62% 38% 42%; } }
  .bm-dust { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.55); pointer-events: none; z-index: 0; animation: bmDustFloat linear infinite; }
  @keyframes bmDustFloat { 0% { transform: translateY(0); opacity: 0; } 10% { opacity: var(--o, 0.4); } 90% { opacity: var(--o, 0.4); } 100% { transform: translateY(-110vh); opacity: 0; } }

  .bm-glass { background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.11); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-radius: 20px; }
  .bm-orbi { border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; position: relative;
    background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.14), rgba(255,255,255,0.03) 65%), rgba(20,26,31,0.6); box-shadow: inset 0 1px 0 rgba(255,255,255,0.14); }
  .bm-orbi::before { content: ""; position: absolute; inset: -1px; border-radius: 50%; padding: 1px;
    background: linear-gradient(120deg, #1fc6c0, #f0806a); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0.75; }

  .bm-choice { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.11);
    background: rgba(255,255,255,0.055); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); cursor: pointer; text-align: left;
    transition: border-color 0.2s, background 0.2s; animation: bmFadeUp 0.4s cubic-bezier(.2,.8,.2,1) both; animation-delay: calc(var(--i,0) * 70ms); }
  .bm-choice.active { border-color: #1fc6c0; background: rgba(31,198,192,0.08); }
  .bm-choice.soon { opacity: 0.45; cursor: default; }
  .bm-choice:active:not(.soon) { transform: scale(0.98); }

  .bm-cat-glass { display: flex; flex-direction: column; align-items: flex-start; gap: 14px; padding: 16px; border-radius: 22px;
    border: 1px solid rgba(255,255,255,0.11); background: rgba(255,255,255,0.055); cursor: pointer; text-align: left;
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); transition: transform 0.25s, border-color 0.25s, background 0.25s; }
  .bm-cat-glass:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.09); }
  .bm-cat-glass:active { transform: scale(0.97); }

  .bm-biz-glass { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.11);
    background: rgba(255,255,255,0.055); cursor: pointer; text-align: left; width: 100%; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transition: border-color 0.2s, background 0.2s; }
  .bm-biz-glass:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.09); }

  .bm-nav-glass { position: fixed; left: 16px; right: 16px; bottom: 14px; max-width: 388px; margin: 0 auto; height: 68px; display: flex;
    align-items: center; justify-content: space-around; border-radius: 24px; background: rgba(16,22,27,0.72); border: 1px solid rgba(255,255,255,0.11);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); z-index: 10; }

  .bm-card-glow { position: relative; padding: 22px 18px 20px; border-radius: 26px; background: rgba(18,24,29,0.55);
    backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .bm-card-glow::before { content: ""; position: absolute; inset: 0; border-radius: 26px; padding: 1.2px;
    background: linear-gradient(120deg, #1fc6c0, #f0806a); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; }

  /* intro screen */
  .bm-intro-system { position: relative; width: min(84vw, 340px); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
  .bm-intro-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px solid rgba(255,255,255,0.11); }
  .bm-intro-ring.r2 { inset: 7%; }
  .bm-intro-orbit { position: absolute; inset: 0; border-radius: 50%; animation: bmSpin linear infinite; }
  .bm-intro-orbit.o1 { animation-duration: 14s; }
  .bm-intro-orbit.o2 { inset: 7%; animation-duration: 20s; animation-direction: reverse; }
  .bm-intro-orbit.o3 { animation-duration: 26s; }
  @keyframes bmSpin { to { transform: rotate(360deg); } }
  .bm-intro-dot { position: absolute; border-radius: 50%; }
  .bm-intro-dot.big { width: 16px; height: 16px; margin: -8px; }
  .bm-intro-dot.small { width: 7px; height: 7px; margin: -3.5px; }
  .bm-intro-dot.t { background: #1fc6c0; box-shadow: 0 0 14px #1fc6c0; }
  .bm-intro-dot.c { background: #f0806a; box-shadow: 0 0 14px #f0806a; }
  .bm-intro-orb { position: relative; width: 70%; aspect-ratio: 1; border-radius: 50%; border: 1px solid rgba(255,255,255,0.14);
    background: radial-gradient(circle at 50% 35%, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 60%), rgba(20,26,31,0.55);
    backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 50px rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; border-width: 1px;
    transition: transform 0.35s cubic-bezier(.3,1.6,.5,1); animation: bmBreathe 4.8s ease-in-out infinite, bmEnter 1.1s cubic-bezier(.2,.9,.25,1.2) both; }
  .bm-intro-orb:active { transform: scale(0.95); }
  @keyframes bmBreathe { 0%,100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 20px 50px rgba(0,0,0,0.45), 0 0 0 0 rgba(255,255,255,0); }
    50% { box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 20px 50px rgba(0,0,0,0.45), 0 0 60px 4px rgba(255,255,255,0.08); } }
  @keyframes bmEnter { from { transform: scale(0.4); opacity: 0; filter: blur(8px); } to { transform: scale(1); opacity: 1; filter: blur(0); } }
  .bm-intro-brand { display: flex; flex-direction: column; align-items: center; gap: 12px; width: 66%; animation: bmFadeUp 0.9s ease 0.3s both; }
  .bm-intro-tag { font-size: clamp(8px,2.2vw,10px); font-weight: 600; letter-spacing: 0.24em; color: #d7dde0; white-space: nowrap; }
  .bm-intro-ripple { position: absolute; width: 70%; aspect-ratio: 1; border-radius: 50%; pointer-events: none; border: 1px solid rgba(255,255,255,0.35);
    background: radial-gradient(circle, rgba(255,255,255,0) 55%, rgba(255,255,255,0.10)); opacity: 0; animation: bmRipple 2.2s cubic-bezier(.2,.7,.2,1) forwards; }
  @keyframes bmRipple { 0% { transform: scale(1); opacity: 0.75; } 100% { transform: scale(1.65); opacity: 0; } }
  .bm-intro-hint { position: absolute; bottom: 8%; left: 0; right: 0; text-align: center; font-size: 12px; font-weight: 500; letter-spacing: 0.14em;
    color: #8b979d; text-transform: uppercase; animation: bmHint 2.4s ease-in-out infinite; }
  @keyframes bmHint { 0%,100% { opacity: 0.35; } 50% { opacity: 0.9; } }
  .bm-intro-flash { position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.35), transparent 55%);
    opacity: 0; pointer-events: none; z-index: 5; }
  .bm-intro-flash.go { animation: bmFlash 0.8s ease; }
  @keyframes bmFlash { 0% { opacity: 0; } 30% { opacity: 1; } 100% { opacity: 0; } }
  .bm-intro-leave { animation: bmLeave 0.9s cubic-bezier(.2,.8,.2,1) forwards; }
  @keyframes bmLeave { to { opacity: 0; transform: scale(1.5); } }

  @media (prefers-reduced-motion: reduce) {
    .bm-blob, .bm-dust, .bm-intro-orbit, .bm-intro-orb, .bm-intro-brand, .bm-intro-ripple, .bm-intro-hint, .bm-intro-flash.go, .bm-intro-leave,
    .bm-choice { animation: none !important; }
  }
`;

const styles = {
  app: {
    color: "#f4f6f7", minHeight: "100vh", position: "relative", isolation: "isolate",
    fontFamily: "'Manrope', 'Helvetica Neue', Arial, sans-serif", paddingBottom: 0,
  },
  bgDust: {
    position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden",
    pointerEvents: "none", zIndex: -1,
  },
  tabContent: { paddingBottom: 90 },

  introScreen: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", position: "relative", padding: 24,
  },

  onboardWrap: {
    minHeight: "100vh", display: "flex", flexDirection: "column",
    padding: "calc(28px + env(safe-area-inset-top, 0px)) 20px calc(28px + env(safe-area-inset-bottom, 0px))",
    boxSizing: "border-box", position: "relative",
  },
  onboardSteps: { display: "flex", justifyContent: "center", gap: 6, marginBottom: 26 },
  onboardStepDot: { width: 22, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.2)" },
  onboardStepDotActive: { background: "linear-gradient(120deg, #1fc6c0, #f0806a)" },
  onboardLogoRow: { display: "flex", justifyContent: "center", marginBottom: 20 },
  onboardBackRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 20 },
  onboardH1: { margin: "0 0 4px", fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "#f4f6f7" },
  onboardSub: { margin: "0 0 6px", color: "#8b979d", fontSize: 14 },
  onboardBody: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "18px 0" },
  choiceList: { display: "flex", flexDirection: "column", gap: 12 },
  choiceName: { display: "block", fontSize: 16, fontWeight: 700, color: "#f4f6f7" },
  choiceSub: { display: "block", color: "#8b979d", fontWeight: 500, fontSize: 12, marginTop: 2 },
  tick: { width: 22, height: 22, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.25)", flexShrink: 0 },
  tickActive: { border: "1.5px solid #1fc6c0", background: "radial-gradient(circle, #1fc6c0 45%, transparent 50%)" },
  soonChip: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", padding: "5px 9px", borderRadius: 99,
    border: "1px solid rgba(255,255,255,0.11)", color: "#8b979d", flexShrink: 0,
  },
  cta: {
    padding: 16, borderRadius: 16, border: "none", fontWeight: 700, fontSize: 16, cursor: "pointer",
    color: "#071315", background: "linear-gradient(120deg, #1fc6c0, #f0806a)",
  },
  iconBtnGlass: {
    width: 42, height: 42, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.11)", cursor: "pointer",
    color: "#f4f6f7", flexShrink: 0,
  },
  bottomNav: {
    position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 10,
    display: "flex", background: "rgba(15,15,15,0.92)", backdropFilter: "blur(14px)",
    borderTop: "1px solid #232323", padding: "10px 12px calc(10px + env(safe-area-inset-bottom))",
  },
  navBtn: {
    position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
    background: "transparent", border: "none", color: "#5d686e", padding: "8px 16px", borderRadius: 16, cursor: "pointer",
  },
  navBtnActive: { color: "#f4f6f7" },
  navIconWrap: { position: "relative", display: "flex" },
  navBadge: {
    position: "absolute", top: -5, right: -8, background: "#f0806a", color: "#1a0b07",
    fontSize: 9.5, fontWeight: 800, borderRadius: 8, minWidth: 15, height: 15,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
  },
  navLabel: { fontSize: 10.5, fontWeight: 600 },
  navActiveBar: {
    position: "absolute", bottom: -2, width: 18, height: 3, borderRadius: 3,
    background: "linear-gradient(120deg, #1fc6c0, #f0806a)",
  },

  tabPageWrap: { padding: "20px 20px 8px" },
  tabPageHeader: { marginBottom: 16 },
  tabPageTitle: { fontSize: 20, margin: 0, fontWeight: 700 },
  tabPageSub: { fontSize: 12.5, color: "#888", marginTop: 3 },

  favEmptyWrap: { textAlign: "center", padding: "50px 20px", color: "#888" },
  favEmptyIcon: {
    width: 56, height: 56, borderRadius: "50%", margin: "0 auto 14px",
    background: "#161616", border: "1px solid #262626", color: "#555",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  favEmptyTitle: { fontSize: 15, fontWeight: 600, color: "#eee", marginBottom: 4 },
  favEmptySub: { fontSize: 13, color: "#888" },

  favBtn: {
    width: 30, height: 30, borderRadius: "50%", color: "#5d686e", flexShrink: 0,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent",
  },
  favBtnActive: { color: "#f0806a" },

  accountHero: { display: "flex", alignItems: "center", gap: 16, padding: "20px 20px 4px" },
  accountWelcome: { fontSize: 20, fontWeight: 800, color: "#f4f6f7", margin: 0 },
  accountSub: { fontSize: 12.5, color: "#8b979d", marginTop: 4 },
  accountStatsRow: { display: "flex", gap: 10, margin: "20px 20px 10px" },
  accountStat: {
    flex: 1, borderRadius: 18, padding: "14px 8px", textAlign: "center",
  },
  accountStatNum: {
    fontSize: 22, fontWeight: 800, background: "linear-gradient(120deg, #1fc6c0, #f0806a)",
    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", display: "block",
  },
  accountStatLabel: { fontSize: 12, color: "#8b979d", display: "block" },
  accountList: { display: "flex", flexDirection: "column", margin: "10px 20px 0", borderRadius: 22, overflow: "hidden" },
  accountRow: {
    display: "flex", alignItems: "center", gap: 14, width: "100%",
    background: "rgba(255,255,255,0.055)", borderBottom: "1px solid rgba(255,255,255,0.11)",
    padding: "14px 16px", cursor: "pointer", color: "#f4f6f7", textAlign: "left",
  },
  accountRowIcon: { width: 38, height: 38, flexShrink: 0 },
  accountRowTitle: { fontSize: 15, fontWeight: 600, display: "block" },
  accountRowSub: { fontSize: 12, color: "#8b979d", marginTop: 2, fontWeight: 500, display: "block" },

  screenPad: { padding: "22px 20px 24px", position: "relative" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 18 },
  cityPill: {
    display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 99,
    fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.11)",
    color: "#f4f6f7", cursor: "pointer",
  },
  homeH2: { margin: "4px 0 6px", fontSize: 22, fontWeight: 800, letterSpacing: "-0.015em", color: "#f4f6f7" },
  heroSubtitle: { color: "#8b979d", fontSize: 13.5, margin: "0 0 16px" },
  searchWrap: {
    display: "flex", alignItems: "center", gap: 10, height: 54, padding: "0 16px", color: "#8b979d", marginBottom: 18,
  },
  searchWrapFocus: { border: "1px solid rgba(31,198,192,0.5)", boxShadow: "0 0 0 4px rgba(31,198,192,0.08)" },
  searchInput: {
    flex: 1, minWidth: 0, background: "transparent", border: "none", color: "#f4f6f7", fontSize: 15, outline: "none",
  },
  sectionTitle: {
    padding: "0 0 12px", fontSize: 11, fontWeight: 700, color: "#8b979d",
    textTransform: "uppercase", letterSpacing: "0.18em",
  },
  categoryGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  categoryTile: { textAlign: "left" },
  categoryTileName: { fontSize: 15, fontWeight: 700, color: "#f4f6f7" },
  categoryTileCount: { fontSize: 12, color: "#8b979d", marginTop: 2, fontVariantNumeric: "tabular-nums" },

  categoryViewHeader: { display: "flex", alignItems: "center", gap: 16, margin: "18px 0" },
  categoryViewTitle: { fontSize: 22, margin: 0, fontWeight: 800, color: "#f4f6f7" },
  categoryViewSub: { fontSize: 13, color: "#8b979d", marginTop: 4 },

  resultsMeta: { marginBottom: 12, fontSize: 11, fontWeight: 700, color: "#8b979d", textTransform: "uppercase", letterSpacing: "0.18em" },
  list: { display: "grid", gap: 12 },
  empty: {
    display: "grid", justifyItems: "center", gap: 14, textAlign: "center", padding: "40px 16px", color: "#8b979d",
  },
  cardNameRow: { display: "flex", alignItems: "center", gap: 6 },
  cardName: { fontSize: 15, fontWeight: 700, color: "#f4f6f7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  cardCat: { fontSize: 13, color: "#8b979d" },
  verifiedBadge: {
    background: "#1fc6c0", color: "#062022", borderRadius: "50%", width: 18, height: 18,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  rating: { display: "flex", alignItems: "center", gap: 4, color: "#f4c46a", fontWeight: 700, fontSize: 13 },
  reviewCount: { color: "#8b979d", fontWeight: 500 },

  profileWrap: { padding: "20px 20px 100px", position: "relative" },
  profileTopBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  backBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none",
    color: "#ccc", fontSize: 14, cursor: "pointer", padding: 0,
  },
  profileTopTitle: { fontSize: 15, fontWeight: 600, color: "#f4f6f7" },
  favIconActive: { color: "#f0806a", border: "1px solid rgba(240,128,106,0.5)" },
  eyebrow: { color: "#8b979d", fontSize: 11, letterSpacing: 1.2, fontWeight: 600, margin: "18px 0 10px" },

  bizCard: {
    borderRadius: 20, padding: "28px 20px 22px", textAlign: "center", position: "relative", overflow: "hidden",
  },
  profileNameRow: { display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 2 },
  profileName: { fontSize: 20, margin: 0, color: "#f4f6f7", fontWeight: 700 },
  verifiedBadgeLg: {
    background: "linear-gradient(120deg, #1fc6c0, #f0806a)", color: "#0d1318", borderRadius: "50%", width: 19, height: 19,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  profileCat: { color: "#8b979d", fontSize: 13.5, marginTop: 6 },
  profileDesc: { color: "#b7c1c5", fontSize: 14, lineHeight: 1.6, marginTop: 20 },
  infoBlock: { marginTop: 16, display: "flex", flexDirection: "column", gap: 12, padding: 16, borderRadius: 14 },
  infoRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#e4e9ea" },

  actionsRow: { display: "flex", justifyContent: "space-around", marginTop: 22, textAlign: "center" },
  actionBtn: {
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    background: "none", border: 0, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#8b979d",
    padding: 0,
  },

  qrWrap: {
    display: "flex", alignItems: "center", gap: 16, textAlign: "left", marginTop: 22,
    padding: 16, borderRadius: 14,
  },
  qrImg: { width: 84, height: 84, borderRadius: 10, background: "#fff", flexShrink: 0 },
  qrTitle: { fontSize: 14.5, fontWeight: 700, color: "#f4f6f7" },
  qrCaption: { color: "#8b979d", fontSize: 12.5, marginTop: 4 },

  viewFullBtn: {
    display: "block", width: "100%", background: "rgba(31,198,192,0.12)", color: "#5fe0da",
    border: "1px solid rgba(31,198,192,0.35)",
    padding: "13px 0", borderRadius: 12, fontWeight: 600, fontSize: 13.5, marginTop: 18, cursor: "pointer",
  },
  expandedBlock: {
    display: "flex", flexDirection: "column", gap: 10, marginTop: 14, padding: 16, borderRadius: 14,
  },

  ctaRow: {
    display: "flex", gap: 10, position: "fixed", left: 0, right: 0, bottom: 0,
    padding: "14px 20px calc(14px + env(safe-area-inset-bottom))",
    background: "linear-gradient(180deg, rgba(13,19,24,0) 0%, rgba(13,19,24,0.94) 30%, rgba(13,19,24,0.98) 100%)",
    zIndex: 5,
  },
  ctaCall: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.16)",
    color: "#f4f6f7", padding: "13px 0", borderRadius: 12,
    fontWeight: 600, fontSize: 14, textDecoration: "none", backdropFilter: "blur(14px)",
  },
  ctaWhatsapp: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "linear-gradient(120deg, #1fc6c0, #f0806a)", color: "#0d1318", padding: "13px 0",
    borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none",
  },

  adminWrap: { padding: 20 },
  registerWrap: { padding: 20 },
  registerSentWrap: { textAlign: "center", padding: "60px 16px 20px" },
  registerSentIcon: {
    width: 64, height: 64, borderRadius: "50%", margin: "0 auto 18px",
    background: "linear-gradient(135deg, #1fc6c0, #189690)", color: "#062022",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  registerSentTitle: { fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 },
  registerSentSub: { fontSize: 13.5, color: "#999", lineHeight: 1.6, maxWidth: 300, margin: "0 auto 24px" },
  adminTitle: { fontSize: 20, margin: "4px 0 2px" },
  adminSub: { color: "#888", fontSize: 13, marginBottom: 16 },
  adminSectionHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    fontSize: 12.5, fontWeight: 700, color: "#999", textTransform: "uppercase",
    letterSpacing: 0.6, margin: "18px 0 10px",
  },
  smallGhostBtn: {
    display: "flex", alignItems: "center", gap: 5, background: "transparent",
    border: "1px solid #1fc6c055", color: "#5fe0da", padding: "5px 10px",
    borderRadius: 16, fontSize: 12, cursor: "pointer",
  },
  categoryAdminList: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 6 },
  categoryAdminRow: {
    display: "flex", alignItems: "center", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 10, padding: "8px 10px",
  },
  categoryAdminIcon: {
    width: 30, height: 30, borderRadius: 8, flexShrink: 0, color: "#fff",
    background: "linear-gradient(135deg, #1fc6c0, #f0806a)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  addBtn: {
    display: "flex", alignItems: "center", gap: 6, background: "#fff", color: "#0d1318",
    border: "none", padding: "10px 16px", borderRadius: 10, fontWeight: 600, fontSize: 13.5,
    cursor: "pointer", marginBottom: 18,
  },
  form: {
    display: "flex", flexDirection: "column", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 14, padding: 16, marginBottom: 20,
  },
  input: {
    background: "#0f0f0f", border: "1px solid #2a2a2a", borderRadius: 8, color: "#fff",
    padding: "10px 12px", fontSize: 13.5,
  },
  checkboxRow: { display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#ccc" },
  qrPreviewRow: { display: "flex", alignItems: "center", gap: 12, padding: "4px 0" },
  qrPreviewImg: { width: 72, height: 72, borderRadius: 8, border: "1px solid #232323", flexShrink: 0 },
  qrPreviewLabel: { fontSize: 11.5, color: "#888", lineHeight: 1.4 },
  formBtnRow: { display: "flex", gap: 10, marginTop: 4 },
  saveBtn: {
    flex: 1, background: "#fff", color: "#0d1318", border: "none", padding: "10px 0",
    borderRadius: 8, fontWeight: 600, fontSize: 13.5, cursor: "pointer",
  },
  cancelBtn: {
    flex: 1, background: "transparent", color: "#ccc", border: "1px solid #333",
    padding: "10px 0", borderRadius: 8, fontSize: 13.5, cursor: "pointer",
  },
  adminList: { display: "flex", flexDirection: "column", gap: 8 },
  adminRow: {
    display: "flex", alignItems: "center", gap: 10, background: "#131313",
    border: "1px solid #232323", borderRadius: 10, padding: "10px 12px",
  },
  adminRowQr: { width: 40, height: 40, borderRadius: 6, flexShrink: 0, border: "1px solid #232323" },
  adminRowName: { fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 },
  adminRowMeta: { fontSize: 12, color: "#888", marginTop: 2 },
  iconBtn: {
    background: "transparent", border: "1px solid #2a2a2a", color: "#ccc", borderRadius: 8,
    width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
};
