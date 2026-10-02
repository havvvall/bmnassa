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

function Intro({ onEnter, lang = "ku" }) {
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
            <span className="bm-intro-tag">{t("introTag", lang)}</span>
          </div>
        </button>
        {ripples.map((id) => <span key={id} className="bm-intro-ripple" />)}
      </div>
      <div className="bm-intro-hint">{t("introHint", lang)}</div>
      {flash && <div className="bm-intro-flash go" />}
    </div>
  );
}

/* ---------------- DATA ---------------- */

const INITIAL_CATEGORIES = [
  { id: "plumbing", name: { en: "Plumbers", ku: "کارسازی بۆری", ar: "أعمال السباكة" }, icon: "wrench" },
  { id: "electrical", name: { en: "Electricians", ku: "کارەبایی", ar: "الكهرباء" }, icon: "bolt" },
  { id: "carpentry", name: { en: "Carpenters", ku: "دارتاشی", ar: "النجارة" }, icon: "hammer" },
  { id: "civil-eng", name: { en: "Civil Engineers", ku: "ئەندازیاری شارستانی", ar: "الهندسة المدنية" }, icon: "ruler" },
  { id: "architecture", name: { en: "Architects", ku: "تەلارسازی", ar: "الهندسة المعمارية" }, icon: "building" },
  { id: "interior", name: { en: "Interior Designers", ku: "ڕازاندنەوەی ناوماڵ", ar: "التصميم الداخلي" }, icon: "sofa" },
  { id: "painting", name: { en: "Painters", ku: "ڕەنگکاری", ar: "الدهان" }, icon: "brush" },
  { id: "hvac", name: { en: "AC & Refrigeration", ku: "ساردکەرەوە و فریزەر", ar: "التكييف والتبريد" }, icon: "wind" },
  { id: "cleaning", name: { en: "Home Cleaning", ku: "پاکژکردنەوەی ماڵ", ar: "تنظيف المنازل" }, icon: "sparkles" },
  { id: "moving", name: { en: "Movers & Packers", ku: "گواستنەوە و بەستنەوە", ar: "النقل والتغليف" }, icon: "truck" },
  { id: "mechanics", name: { en: "Car Mechanics", ku: "میکانیکی ئۆتۆمبێل", ar: "ميكانيكا السيارات" }, icon: "car" },
  { id: "carwash", name: { en: "Car Wash & Detailing", ku: "شوشتنی ئۆتۆمبێل", ar: "غسيل وتلميع السيارات" }, icon: "drop" },
  { id: "photography", name: { en: "Photographers", ku: "وێنەگری", ar: "التصوير الفوتوغرافي" }, icon: "camera" },
  { id: "tailoring", name: { en: "Tailors & Fashion", ku: "دەرزیکاری و مۆدا", ar: "الخياطة والأزياء" }, icon: "thread" },
  { id: "bakery", name: { en: "Bakeries & Pastry", ku: "نانەوایی و شیرینی", ar: "المخابز والحلويات" }, icon: "cake" },
  { id: "catering", name: { en: "Restaurants & Catering", ku: "چێشتخانە و کەیتەرینگ", ar: "المطاعم والضيافة" }, icon: "utensils" },
  { id: "beauty", name: { en: "Beauty Salons", ku: "ژوانگای جوانی", ar: "صالونات التجميل" }, icon: "sparkle" },
  { id: "barber", name: { en: "Barbershops", ku: "سەلمانی", ar: "صالونات الحلاقة" }, icon: "scissors" },
  { id: "legal", name: { en: "Lawyers", ku: "پارێزەر", ar: "المحاماة" }, icon: "scale" },
  { id: "accounting", name: { en: "Accountants", ku: "ژمێریاری", ar: "المحاسبة" }, icon: "calculator" },
  { id: "realestate", name: { en: "Real Estate Agents", ku: "دلالی خانووبەرە", ar: "الوساطة العقارية" }, icon: "key" },
  { id: "it-repair", name: { en: "IT & Computer Repair", ku: "چاککردنەوەی کۆمپیوتەر", ar: "صيانة الحاسوب" }, icon: "monitor" },
  { id: "events", name: { en: "Event Planners", ku: "ڕێکخستنی بۆنە", ar: "تنظيم الفعاليات" }, icon: "confetti" },
  { id: "metalwork", name: { en: "Blacksmiths & Metalwork", ku: "ئاسنگەری", ar: "الحدادة" }, icon: "flame" },
  { id: "welding", name: { en: "Welders", ku: "پاشکۆکاری", ar: "اللحام" }, icon: "spark" },
];

const ICON_OPTIONS = [
  "wrench", "bolt", "hammer", "ruler", "building", "sofa", "brush", "wind",
  "sparkles", "truck", "car", "drop", "camera", "thread", "scissors", "cake",
  "utensils", "sparkle", "scale", "calculator", "key", "monitor", "confetti",
  "flame", "spark", "grid",
];

function buildQrSrc(biz, size = 200, lang = "en") {
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const qrData = encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${bizNameOf(biz, lang)}\nTEL:${cleanPhone}\nADR:${bizAddressOf(biz, lang)}\nEND:VCARD`);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=0f0f0f&color=ffffff&margin=10&data=${qrData}`;
}

const LANGUAGES = [
  { code: "ku", name: "کوردی", sub: "Kurdish · Soranî" },
  { code: "en", name: "English", sub: "English" },
  { code: "ar", name: "عربي", sub: "Arabic · al-'Arabiyyah" },
];

const CITIES = [
  { id: "erbil", name: { en: "Erbil", ku: "هەولێر", ar: "أربيل" }, count: 62, live: true },
  { id: "sulaymaniyah", name: { en: "Sulaymaniyah", ku: "سلێمانی", ar: "السليمانية" }, count: 250, live: true },
  { id: "kirkuk", name: { en: "Kirkuk", ku: "کەرکووک", ar: "كركوك" }, count: 0, live: false },
  { id: "duhok", name: { en: "Duhok", ku: "دهۆک", ar: "دهوك" }, count: 0, live: false },
  { id: "halabja", name: { en: "Halabja", ku: "هەڵەبجە", ar: "حلبجة" }, count: 0, live: false },
];

/* ---------------- i18n ---------------- */

const DIRS = { en: "ltr", ku: "rtl", ar: "rtl" };
function dirOf(lang) { return DIRS[lang] || "ltr"; }

const EASTERN_DIGITS = "٠١٢٣٤٥٦٧٨٩";
function digits(n, lang) {
  const s = String(n);
  if (lang === "en") return s;
  return s.replace(/[0-9]/g, (d) => EASTERN_DIGITS[d]);
}

function trField(obj, key, lang) {
  if (!obj) return "";
  const v = obj[key];
  if (v && typeof v === "object") return v[lang] || v.en || "";
  return v || "";
}
const catNameOf = (cat, lang) => trField(cat, "name", lang);
const cityNameOf = (c, lang) => trField(c, "name", lang);
const bizNameOf = (b, lang) => trField(b, "name", lang);
const bizAddressOf = (b, lang) => trField(b, "address", lang);
const bizAddressShortOf = (b, lang) => bizAddressOf(b, lang).split(/[,،]\s*/)[0];

const UI = {
  introTag: { en: "SMART BUSINESS DIRECTORY", ku: "ڕێنمای بازرگانی زیرەک", ar: "دليل الأعمال الذكي" },
  introHint: { en: "Tap the logo", ku: "لۆگۆکە دابگرە", ar: "اضغط على الشعار" },
  chooseLanguage: { en: "Choose your language", ku: "زمانەکەت هەڵبژێرە", ar: "اختر لغتك" },
  changeLaterAccount: { en: "You can change this later in Account.", ku: "دواتر لە هەژمار دەتوانیت بیگۆڕیت.", ar: "يمكنك تغييرها لاحقًا من الحساب." },
  continueBtn: { en: "Continue", ku: "بەردەوامبوون", ar: "متابعة" },
  whereAreYou: { en: "Where are you?", ku: "لە کوێیت؟", ar: "أين أنت؟" },
  nearbyFirst: { en: "We'll show services near you first.", ku: "یەکەم جار خزمەتگوزارییە نزیکەکانت پیشان دەدەین.", ar: "سنعرض لك الخدمات القريبة منك أولاً." },
  startExploring: { en: "Start exploring", ku: "دەست بکە بە گەڕان", ar: "ابدأ الاستكشاف" },
  comingSoon: { en: "Coming soon", ku: "بەم زووانە", ar: "قريبًا" },
  soonChip: { en: "SOON", ku: "بەم زووانە", ar: "قريبًا" },
  businessesLabel: { en: "businesses", ku: "بازرگانی", ar: "نشاطًا تجاريًا" },
  back: { en: "Back", ku: "گەڕانەوە", ar: "رجوع" },
  homeHeadline: { en: "Find trusted craftsmen & services", ku: "کارامە و خزمەتگوزاری متمانەپێکراو بدۆزەرەوە", ar: "اعثر على حرفيين وخدمات موثوقة" },
  homeSubtitle: { en: "{count}+ verified professionals across {n} categories", ku: "{count}+ پیشەوەری پشتڕاستکراو لە {n} پۆلدا", ar: "+{count} محترفًا موثّقًا في {n} فئة" },
  searchPlaceholder: { en: "Plumber, electrician, cleaning…", ku: "کارسازی بۆری، کارەبایی، پاکژکردنەوە...", ar: "سباك، كهربائي، تنظيف..." },
  categoriesLabel: { en: "Categories", ku: "پۆلەکان", ar: "الفئات" },
  resultsFor: { en: '{n} results for "{q}"', ku: '{n} ئەنجام بۆ "{q}"', ar: '{n} نتيجة لـ "{q}"' },
  noResults: { en: "No listings match that search.", ku: "هیچ ئەنجامێک نەدۆزرایەوە.", ar: "لا توجد نتائج مطابقة لهذا البحث." },
  placesCount: { en: "{n} places", ku: "{n} شوێن", ar: "{n} مواقع" },
  placesVerifiedCount: { en: "{n} places · {m} verified", ku: "{n} شوێن · {m} پشتڕاستکراو", ar: "{n} مواقع · {m} موثّق" },
  removeFavorite: { en: "Remove from favorites", ku: "لابردن لە دڵخوازەکان", ar: "إزالة من المفضلة" },
  addFavorite: { en: "Add to favorites", ku: "زیادکردن بۆ دڵخوازەکان", ar: "إضافة إلى المفضلة" },
  verified: { en: "Verified", ku: "پشتڕاستکراوە", ar: "موثّق" },
  favoritesTitle: { en: "Favorites", ku: "دڵخوازەکان", ar: "المفضلة" },
  favoritesSub: { en: "Places you saved, in one place.", ku: "شوێنەکانی کە پاشەکەوتت کردوون، لە یەک شوێندا.", ar: "الأماكن التي حفظتها، في مكان واحد." },
  noFavoritesTitle: { en: "No favorites yet", ku: "هێشتا دڵخوازت نییە", ar: "لا توجد مفضلات بعد" },
  noFavoritesSub: { en: "Tap the heart on any place to save it here.", ku: "دڵی هەر شوێنێک دابگرە بۆ پاشەکەوتکردنی لێرە.", ar: "اضغط على أيقونة القلب في أي مكان لحفظه هنا." },
  welcome: { en: "Welcome", ku: "بەخێربێیت", ar: "مرحبًا بك" },
  placesStat: { en: "Places", ku: "شوێن", ar: "موقع" },
  categoriesStat: { en: "Categories", ku: "پۆل", ar: "فئة" },
  favoritesStat: { en: "Favorites", ku: "دڵخواز", ar: "مفضلة" },
  listYourBusiness: { en: "List Your Business", ku: "بازرگانیەکەت تۆمار بکە", ar: "سجّل نشاطك التجاري" },
  listYourBusinessSub: { en: "Get your business on Bmnassa", ku: "بازرگانیەکەت بخەرە سەر Bmnassa", ar: "أضف نشاطك إلى Bmnassa" },
  adminPanel: { en: "Admin Panel", ku: "پانێلی بەڕێوەبەری", ar: "لوحة الإدارة" },
  adminPanelSub: { en: "Manage listings & categories", ku: "بەڕێوەبردنی تۆمارەکان و پۆلەکان", ar: "إدارة القوائم والفئات" },
  languageLabel: { en: "Language", ku: "زمان", ar: "اللغة" },
  languageSub: { en: "Change app language", ku: "گۆڕینی زمانی ئەپ", ar: "تغيير لغة التطبيق" },
  cityLabel: { en: "City", ku: "شار", ar: "المدينة" },
  citySub: { en: "Change your city", ku: "گۆڕینی شارەکەت", ar: "تغيير مدينتك" },
  replayIntroLabel: { en: "Replay Intro", ku: "دووبارە پیشاندانەوەی سەرەتا", ar: "إعادة عرض المقدمة" },
  replayIntroSub: { en: "See the opening animation again", ku: "ئەنیمەیشنی سەرەتا دووبارە ببینەوە", ar: "شاهد الرسوم المتحركة الافتتاحية مرة أخرى" },
  navSearch: { en: "Search", ku: "گەڕان", ar: "البحث" },
  navFavorites: { en: "Favorites", ku: "دڵخوازەکان", ar: "المفضلة" },
  navAccount: { en: "Account", ku: "هەژمار", ar: "الحساب" },
  serviceProfile: { en: "Service profile", ku: "پرۆفایلی خزمەتگوزاری", ar: "الملف الشخصي للخدمة" },
  whatsappLabel: { en: "WhatsApp", ku: "واتساپ", ar: "واتساب" },
  shareLabel: { en: "Share", ku: "هاوبەشکردن", ar: "مشاركة" },
  directionsLabel: { en: "Directions", ku: "ڕێنیشاندان", ar: "الاتجاهات" },
  saveContactLabel: { en: "Save contact", ku: "پاشەکەوتکردن", ar: "حفظ البيانات" },
  verifiedByBmnassa: { en: "Verified by Bmnassa", ku: "پشتڕاستکراوە لەلایەن Bmnassa", ar: "موثّق من Bmnassa" },
  reviewsCount: { en: "{n} reviews", ku: "{n} هەڵسەنگاندن", ar: "{n} تقييمًا" },
  digitalBusinessCard: { en: "Digital business card", ku: "کارتی بازرگانی دیجیتاڵ", ar: "بطاقة العمل الرقمية" },
  scanToSave: { en: "Scan to save this contact.", ku: "هەڵیبسووڕێنە بۆ پاشەکەوتکردنی پەیوەندی.", ar: "امسح الرمز لحفظ جهة الاتصال." },
  viewFullProfile: { en: "View Full Profile", ku: "بینینی پرۆفایلی تەواو", ar: "عرض الملف الكامل" },
  hideDetails: { en: "Hide details", ku: "شاردنەوەی وردەکاری", ar: "إخفاء التفاصيل" },
  verifiedSince: { en: "Verified since {year}", ku: "پشتڕاستکراوە لە ساڵی {year}", ar: "موثّق منذ {year}" },
  customerReviewsOn: { en: "{n} customer reviews on Bmnassa", ku: "{n} هەڵسەنگاندنی کڕیار لە Bmnassa", ar: "{n} تقييمًا من العملاء على Bmnassa" },
  categoryColon: { en: "Category: {cat}", ku: "پۆل: {cat}", ar: "الفئة: {cat}" },
  call: { en: "Call", ku: "پەیوەندی", ar: "اتصال" },
  bizDescTemplate: {
    en: "{name} offers reliable {cat} in {address}.",
    ku: "{name} خزمەتگوزاری {cat} بە متمانەوە پێشکەش دەکات لە {address}.",
    ar: "تقدّم {name} خدمات {cat} موثوقة في {address}.",
  },
};

function t(key, lang, vars) {
  const entry = UI[key];
  let s = (entry && (entry[lang] || entry.en)) || key;
  if (vars) {
    for (const k in vars) s = s.split(`{${k}}`).join(vars[k]);
  }
  return s;
}

const BUSINESSES = [
  {
    "id": 1,
    "name": {
      "en": "Halgurd Plumbing Services",
      "ku": "هەڵگورد خزمەتگوزاری کارسازی بۆری",
      "ar": "هەڵگورد خدمات السباكة"
    },
    "category": "plumbing",
    "owner": "Kawa Jaza",
    "phone": "0771 242 2679",
    "whatsapp": "0771 242 2679",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.5,
    "reviews": 143,
    "verified": true
  },
  {
    "id": 2,
    "name": {
      "en": "Zana Plumbing Services",
      "ku": "زانا خزمەتگوزاری کارسازی بۆری",
      "ar": "زانا خدمات السباكة"
    },
    "category": "plumbing",
    "owner": "Kawa Karim",
    "phone": "0771 617 1434",
    "whatsapp": "0771 617 1434",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.4,
    "reviews": 170,
    "verified": false
  },
  {
    "id": 3,
    "name": {
      "en": "Sardar Plumbing Est.",
      "ku": "سەردار دامەزراوەی کارسازی بۆری",
      "ar": "سەردار مؤسسة أعمال السباكة"
    },
    "category": "plumbing",
    "owner": "Hawre Ahmad",
    "phone": "0780 448 5552",
    "whatsapp": "0780 448 5552",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 3.8,
    "reviews": 90,
    "verified": true
  },
  {
    "id": 4,
    "name": {
      "en": "Ranj Plumbing Services",
      "ku": "ڕەنج خزمەتگوزاری کارسازی بۆری",
      "ar": "ڕەنج خدمات السباكة"
    },
    "category": "plumbing",
    "owner": "Bakhtiar Rashid",
    "phone": "0773 926 1711",
    "whatsapp": "0773 926 1711",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.6,
    "reviews": 141,
    "verified": true
  },
  {
    "id": 5,
    "name": {
      "en": "Payam Water & Pipe Works",
      "ku": "پەیام کاری ئاو و بۆری",
      "ar": "پەیام أعمال المياه والأنابيب"
    },
    "category": "plumbing",
    "owner": "Hemin Barzinji",
    "phone": "0775 691 4150",
    "whatsapp": "0775 691 4150",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.6,
    "reviews": 15,
    "verified": false
  },
  {
    "id": 6,
    "name": {
      "en": "Shene Water & Pipe Works",
      "ku": "شێنە کاری ئاو و بۆری",
      "ar": "شێنە أعمال المياه والأنابيب"
    },
    "category": "plumbing",
    "owner": "Hemin Salih",
    "phone": "0780 384 8428",
    "whatsapp": "0780 384 8428",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.5,
    "reviews": 97,
    "verified": true
  },
  {
    "id": 7,
    "name": {
      "en": "Bakhtiar Plumbing Services",
      "ku": "بەختیار خزمەتگوزاری کارسازی بۆری",
      "ar": "بەختیار خدمات السباكة"
    },
    "category": "plumbing",
    "owner": "Nazdar Jaza",
    "phone": "0770 646 5010",
    "whatsapp": "0770 646 5010",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 3.8,
    "reviews": 101,
    "verified": true
  },
  {
    "id": 8,
    "name": {
      "en": "Payam Plumbing Est.",
      "ku": "پەیام دامەزراوەی کارسازی بۆری",
      "ar": "پەیام مؤسسة أعمال السباكة"
    },
    "category": "plumbing",
    "owner": "Snur Barzinji",
    "phone": "0775 963 1916",
    "whatsapp": "0775 963 1916",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 3.9,
    "reviews": 12,
    "verified": false
  },
  {
    "id": 9,
    "name": {
      "en": "Ranj Water & Pipe Works",
      "ku": "ڕەنج کاری ئاو و بۆری",
      "ar": "ڕەنج أعمال المياه والأنابيب"
    },
    "category": "plumbing",
    "owner": "Hemin Qadir",
    "phone": "0775 317 9179",
    "whatsapp": "0775 317 9179",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 168,
    "verified": false
  },
  {
    "id": 10,
    "name": {
      "en": "Hawre Plumbing Services",
      "ku": "هاوڕێ خزمەتگوزاری کارسازی بۆری",
      "ar": "هاوڕێ خدمات السباكة"
    },
    "category": "plumbing",
    "owner": "Bnar Barzinji",
    "phone": "0773 864 8019",
    "whatsapp": "0773 864 8019",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.9,
    "reviews": 106,
    "verified": false
  },
  {
    "id": 11,
    "name": {
      "en": "Shvan Power Solutions",
      "ku": "شوان چارەسەری وزە",
      "ar": "شوان حلول الطاقة"
    },
    "category": "electrical",
    "owner": "Rekan Karim",
    "phone": "0751 256 3621",
    "whatsapp": "0751 256 3621",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.7,
    "reviews": 112,
    "verified": false
  },
  {
    "id": 12,
    "name": {
      "en": "Ranj Electrical Services",
      "ku": "ڕەنج خزمەتگوزاری کارەبایی",
      "ar": "ڕەنج خدمات كهربائية"
    },
    "category": "electrical",
    "owner": "Shorsh Mahmud",
    "phone": "0773 666 1188",
    "whatsapp": "0773 666 1188",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.6,
    "reviews": 33,
    "verified": false
  },
  {
    "id": 13,
    "name": {
      "en": "Dilshad Electrical Services",
      "ku": "دڵشاد خزمەتگوزاری کارەبایی",
      "ar": "دڵشاد خدمات كهربائية"
    },
    "category": "electrical",
    "owner": "Shene Sofi",
    "phone": "0773 545 3591",
    "whatsapp": "0773 545 3591",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.2,
    "reviews": 71,
    "verified": false
  },
  {
    "id": 14,
    "name": {
      "en": "Shene Electric Works",
      "ku": "شێنە کاری کارەبایی",
      "ar": "شێنە أعمال كهربائية"
    },
    "category": "electrical",
    "owner": "Twana Rasul",
    "phone": "0771 256 7126",
    "whatsapp": "0771 256 7126",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.7,
    "reviews": 142,
    "verified": false
  },
  {
    "id": 15,
    "name": {
      "en": "Payam Power Solutions",
      "ku": "پەیام چارەسەری وزە",
      "ar": "پەیام حلول الطاقة"
    },
    "category": "electrical",
    "owner": "Payam Ahmad",
    "phone": "0775 600 1319",
    "whatsapp": "0775 600 1319",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 3.8,
    "reviews": 96,
    "verified": false
  },
  {
    "id": 16,
    "name": {
      "en": "Newroz Electrical Services",
      "ku": "نەورۆز خزمەتگوزاری کارەبایی",
      "ar": "نەورۆز خدمات كهربائية"
    },
    "category": "electrical",
    "owner": "Bnar Hussein",
    "phone": "0751 187 8962",
    "whatsapp": "0751 187 8962",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.7,
    "reviews": 140,
    "verified": false
  },
  {
    "id": 17,
    "name": {
      "en": "Rekan Power Solutions",
      "ku": "ڕێکان چارەسەری وزە",
      "ar": "ڕێکان حلول الطاقة"
    },
    "category": "electrical",
    "owner": "Diyar Jaza",
    "phone": "0780 316 9835",
    "whatsapp": "0780 316 9835",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.7,
    "reviews": 180,
    "verified": true
  },
  {
    "id": 18,
    "name": {
      "en": "Peshraw Electrical Services",
      "ku": "پێشڕەو خزمەتگوزاری کارەبایی",
      "ar": "پێشڕەو خدمات كهربائية"
    },
    "category": "electrical",
    "owner": "Nazdar Rashid",
    "phone": "0781 223 5061",
    "whatsapp": "0781 223 5061",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 3.9,
    "reviews": 90,
    "verified": true
  },
  {
    "id": 19,
    "name": {
      "en": "Dilshad Electric Works",
      "ku": "دڵشاد کاری کارەبایی",
      "ar": "دڵشاد أعمال كهربائية"
    },
    "category": "electrical",
    "owner": "Awat Salih",
    "phone": "0751 824 1964",
    "whatsapp": "0751 824 1964",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 3.9,
    "reviews": 12,
    "verified": false
  },
  {
    "id": 20,
    "name": {
      "en": "Hemin Power Solutions",
      "ku": "هێمن چارەسەری وزە",
      "ar": "هێمن حلول الطاقة"
    },
    "category": "electrical",
    "owner": "Bnar Jaza",
    "phone": "0771 652 3167",
    "whatsapp": "0771 652 3167",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.6,
    "reviews": 150,
    "verified": false
  },
  {
    "id": 21,
    "name": {
      "en": "Bnar Wood Works",
      "ku": "بنار کاری دار",
      "ar": "بنار أعمال خشبية"
    },
    "category": "carpentry",
    "owner": "Beston Aziz",
    "phone": "0751 199 8062",
    "whatsapp": "0751 199 8062",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.1,
    "reviews": 109,
    "verified": false
  },
  {
    "id": 22,
    "name": {
      "en": "Chnur Carpentry Workshop",
      "ku": "چنوور کارگەی داری",
      "ar": "چنوور ورشة نجارة"
    },
    "category": "carpentry",
    "owner": "Nazdar Rasul",
    "phone": "0780 845 6559",
    "whatsapp": "0780 845 6559",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.7,
    "reviews": 31,
    "verified": true
  },
  {
    "id": 23,
    "name": {
      "en": "Karwan Furniture & Carpentry",
      "ku": "کاروان کەلوپەل و داری",
      "ar": "کاروان أثاث ونجارة"
    },
    "category": "carpentry",
    "owner": "Sardar Faraj",
    "phone": "0770 385 8579",
    "whatsapp": "0770 385 8579",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 3.9,
    "reviews": 23,
    "verified": false
  },
  {
    "id": 24,
    "name": {
      "en": "Goran Furniture & Carpentry",
      "ku": "گۆران کەلوپەل و داری",
      "ar": "گۆران أثاث ونجارة"
    },
    "category": "carpentry",
    "owner": "Aram Hussein",
    "phone": "0750 195 4872",
    "whatsapp": "0750 195 4872",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 3.8,
    "reviews": 128,
    "verified": false
  },
  {
    "id": 25,
    "name": {
      "en": "Goran Wood Works",
      "ku": "گۆران کاری دار",
      "ar": "گۆران أعمال خشبية"
    },
    "category": "carpentry",
    "owner": "Handren Hussein",
    "phone": "0780 102 7396",
    "whatsapp": "0780 102 7396",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4,
    "reviews": 120,
    "verified": true
  },
  {
    "id": 26,
    "name": {
      "en": "Snur Furniture & Carpentry",
      "ku": "سنوور کەلوپەل و داری",
      "ar": "سنوور أثاث ونجارة"
    },
    "category": "carpentry",
    "owner": "Beston Barzinji",
    "phone": "0770 294 5861",
    "whatsapp": "0770 294 5861",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 3.9,
    "reviews": 18,
    "verified": false
  },
  {
    "id": 27,
    "name": {
      "en": "Dilshad Carpentry Workshop",
      "ku": "دڵشاد کارگەی داری",
      "ar": "دڵشاد ورشة نجارة"
    },
    "category": "carpentry",
    "owner": "Chnur Sofi",
    "phone": "0750 698 8811",
    "whatsapp": "0750 698 8811",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.3,
    "reviews": 139,
    "verified": true
  },
  {
    "id": 28,
    "name": {
      "en": "Twana Carpentry Workshop",
      "ku": "توانا کارگەی داری",
      "ar": "توانا ورشة نجارة"
    },
    "category": "carpentry",
    "owner": "Goran Amin",
    "phone": "0751 791 4853",
    "whatsapp": "0751 791 4853",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 4.2,
    "reviews": 149,
    "verified": true
  },
  {
    "id": 29,
    "name": {
      "en": "Shorsh Carpentry Workshop",
      "ku": "شۆڕش کارگەی داری",
      "ar": "شۆڕش ورشة نجارة"
    },
    "category": "carpentry",
    "owner": "Shorsh Karim",
    "phone": "0775 367 4346",
    "whatsapp": "0775 367 4346",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 84,
    "verified": true
  },
  {
    "id": 30,
    "name": {
      "en": "Ranj Carpentry Workshop",
      "ku": "ڕەنج کارگەی داری",
      "ar": "ڕەنج ورشة نجارة"
    },
    "category": "carpentry",
    "owner": "Nazdar Baban",
    "phone": "0775 869 2188",
    "whatsapp": "0775 869 2188",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 3.6,
    "reviews": 163,
    "verified": false
  },
  {
    "id": 31,
    "name": {
      "en": "Aram Engineering Consultancy",
      "ku": "ئارام ڕاوێژکاری ئەندازیاری",
      "ar": "ئارام استشارات هندسية"
    },
    "category": "civil-eng",
    "owner": "Dilshad Qadir",
    "phone": "0773 235 6718",
    "whatsapp": "0773 235 6718",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.8,
    "reviews": 66,
    "verified": false
  },
  {
    "id": 32,
    "name": {
      "en": "Diyar Civil Engineering Office",
      "ku": "دیار ئۆفیسی ئەندازیاری شارستانی",
      "ar": "دیار مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Newroz Barzinji",
    "phone": "0750 783 5905",
    "whatsapp": "0750 783 5905",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.9,
    "reviews": 30,
    "verified": false
  },
  {
    "id": 33,
    "name": {
      "en": "Shvan Civil Engineering Office",
      "ku": "شوان ئۆفیسی ئەندازیاری شارستانی",
      "ar": "شوان مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Aram Rasul",
    "phone": "0770 378 5616",
    "whatsapp": "0770 378 5616",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.4,
    "reviews": 91,
    "verified": true
  },
  {
    "id": 34,
    "name": {
      "en": "Halgurd Civil Engineering Office",
      "ku": "هەڵگورد ئۆفیسی ئەندازیاری شارستانی",
      "ar": "هەڵگورد مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Twana Sultan",
    "phone": "0750 194 7939",
    "whatsapp": "0750 194 7939",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 15,
    "verified": true
  },
  {
    "id": 35,
    "name": {
      "en": "Shene Engineering Consultancy",
      "ku": "شێنە ڕاوێژکاری ئەندازیاری",
      "ar": "شێنە استشارات هندسية"
    },
    "category": "civil-eng",
    "owner": "Halgurd Jaza",
    "phone": "0781 664 8007",
    "whatsapp": "0781 664 8007",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.4,
    "reviews": 32,
    "verified": true
  },
  {
    "id": 36,
    "name": {
      "en": "Handren Structural Consultants",
      "ku": "هەندرین ڕاوێژکاری ستراکچەر",
      "ar": "هەندرین استشاريو إنشائي"
    },
    "category": "civil-eng",
    "owner": "Handren Faraj",
    "phone": "0750 954 7049",
    "whatsapp": "0750 954 7049",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.4,
    "reviews": 41,
    "verified": false
  },
  {
    "id": 37,
    "name": {
      "en": "Rebaz Civil Engineering Office",
      "ku": "ڕێباز ئۆفیسی ئەندازیاری شارستانی",
      "ar": "ڕێباز مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Bakhtiar Hussein",
    "phone": "0771 798 5088",
    "whatsapp": "0771 798 5088",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 94,
    "verified": false
  },
  {
    "id": 38,
    "name": {
      "en": "Handren Civil Engineering Office",
      "ku": "هەندرین ئۆفیسی ئەندازیاری شارستانی",
      "ar": "هەندرین مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Shorsh Faraj",
    "phone": "0770 919 3900",
    "whatsapp": "0770 919 3900",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 10,
    "verified": true
  },
  {
    "id": 39,
    "name": {
      "en": "Payam Civil Engineering Office",
      "ku": "پەیام ئۆفیسی ئەندازیاری شارستانی",
      "ar": "پەیام مكتب هندسة مدنية"
    },
    "category": "civil-eng",
    "owner": "Beston Aziz",
    "phone": "0773 263 2771",
    "whatsapp": "0773 263 2771",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.1,
    "reviews": 13,
    "verified": false
  },
  {
    "id": 40,
    "name": {
      "en": "Bnar Engineering Consultancy",
      "ku": "بنار ڕاوێژکاری ئەندازیاری",
      "ar": "بنار استشارات هندسية"
    },
    "category": "civil-eng",
    "owner": "Newroz Mahmud",
    "phone": "0773 940 4728",
    "whatsapp": "0773 940 4728",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.9,
    "reviews": 172,
    "verified": true
  },
  {
    "id": 41,
    "name": {
      "en": "Sherko Design & Architecture Office",
      "ku": "شێرکۆ ئۆفیسی دیزاین و تەلارسازی",
      "ar": "شێرکۆ مكتب تصميم وهندسة معمارية"
    },
    "category": "architecture",
    "owner": "Goran Karim",
    "phone": "0775 756 9346",
    "whatsapp": "0775 756 9346",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.2,
    "reviews": 141,
    "verified": true
  },
  {
    "id": 42,
    "name": {
      "en": "Kawa Architecture Studio",
      "ku": "کاوا ستۆدیۆی تەلارسازی",
      "ar": "کاوا استوديو هندسة معمارية"
    },
    "category": "architecture",
    "owner": "Handren Jaza",
    "phone": "0773 139 2776",
    "whatsapp": "0773 139 2776",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.4,
    "reviews": 92,
    "verified": false
  },
  {
    "id": 43,
    "name": {
      "en": "Shorsh Architects",
      "ku": "شۆڕش تەلارسازان",
      "ar": "شۆڕش مهندسون معماريون"
    },
    "category": "architecture",
    "owner": "Aram Hama",
    "phone": "0771 360 1727",
    "whatsapp": "0771 360 1727",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.6,
    "reviews": 4,
    "verified": false
  },
  {
    "id": 44,
    "name": {
      "en": "Beston Architects",
      "ku": "بیستوون تەلارسازان",
      "ar": "بیستوون مهندسون معماريون"
    },
    "category": "architecture",
    "owner": "Nazdar Qadir",
    "phone": "0780 171 6409",
    "whatsapp": "0780 171 6409",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 173,
    "verified": false
  },
  {
    "id": 45,
    "name": {
      "en": "Chnur Design & Architecture Office",
      "ku": "چنوور ئۆفیسی دیزاین و تەلارسازی",
      "ar": "چنوور مكتب تصميم وهندسة معمارية"
    },
    "category": "architecture",
    "owner": "Twana Baban",
    "phone": "0775 512 5844",
    "whatsapp": "0775 512 5844",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.4,
    "reviews": 53,
    "verified": false
  },
  {
    "id": 46,
    "name": {
      "en": "Ranj Architects",
      "ku": "ڕەنج تەلارسازان",
      "ar": "ڕەنج مهندسون معماريون"
    },
    "category": "architecture",
    "owner": "Chnur Amin",
    "phone": "0773 515 9977",
    "whatsapp": "0773 515 9977",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.8,
    "reviews": 81,
    "verified": true
  },
  {
    "id": 47,
    "name": {
      "en": "Zana Architects",
      "ku": "زانا تەلارسازان",
      "ar": "زانا مهندسون معماريون"
    },
    "category": "architecture",
    "owner": "Shorsh Sofi",
    "phone": "0781 552 4501",
    "whatsapp": "0781 552 4501",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.3,
    "reviews": 47,
    "verified": false
  },
  {
    "id": 48,
    "name": {
      "en": "Peshraw Architects",
      "ku": "پێشڕەو تەلارسازان",
      "ar": "پێشڕەو مهندسون معماريون"
    },
    "category": "architecture",
    "owner": "Nazdar Kakei",
    "phone": "0751 938 4848",
    "whatsapp": "0751 938 4848",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4.5,
    "reviews": 61,
    "verified": false
  },
  {
    "id": 49,
    "name": {
      "en": "Shvan Architecture Studio",
      "ku": "شوان ستۆدیۆی تەلارسازی",
      "ar": "شوان استوديو هندسة معمارية"
    },
    "category": "architecture",
    "owner": "Rebaz Salih",
    "phone": "0751 566 7790",
    "whatsapp": "0751 566 7790",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.8,
    "reviews": 151,
    "verified": true
  },
  {
    "id": 50,
    "name": {
      "en": "Snur Design & Architecture Office",
      "ku": "سنوور ئۆفیسی دیزاین و تەلارسازی",
      "ar": "سنوور مكتب تصميم وهندسة معمارية"
    },
    "category": "architecture",
    "owner": "Rekan Hama",
    "phone": "0770 771 1090",
    "whatsapp": "0770 771 1090",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 31,
    "verified": false
  },
  {
    "id": 51,
    "name": {
      "en": "Bnar Interior Design Studio",
      "ku": "بنار ستۆدیۆی ڕازاندنەوەی ناوماڵ",
      "ar": "بنار استوديو تصميم داخلي"
    },
    "category": "interior",
    "owner": "Beston Sheikhani",
    "phone": "0750 670 5082",
    "whatsapp": "0750 670 5082",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.9,
    "reviews": 35,
    "verified": false
  },
  {
    "id": 52,
    "name": {
      "en": "Beston Home Interiors",
      "ku": "بیستوون ناوماڵی خانوو",
      "ar": "بیستوون ديكورات داخلية للمنازل"
    },
    "category": "interior",
    "owner": "Nazdar Sheikhani",
    "phone": "0775 873 8251",
    "whatsapp": "0775 873 8251",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.5,
    "reviews": 133,
    "verified": false
  },
  {
    "id": 53,
    "name": {
      "en": "Payam Design House",
      "ku": "پەیام ماڵی دیزاین",
      "ar": "پەیام دار التصميم"
    },
    "category": "interior",
    "owner": "Sardar Amin",
    "phone": "0781 365 5050",
    "whatsapp": "0781 365 5050",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.8,
    "reviews": 74,
    "verified": false
  },
  {
    "id": 54,
    "name": {
      "en": "Twana Home Interiors",
      "ku": "توانا ناوماڵی خانوو",
      "ar": "توانا ديكورات داخلية للمنازل"
    },
    "category": "interior",
    "owner": "Halgurd Salih",
    "phone": "0781 179 5681",
    "whatsapp": "0781 179 5681",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 3.9,
    "reviews": 89,
    "verified": true
  },
  {
    "id": 55,
    "name": {
      "en": "Dilshad Interior Design Studio",
      "ku": "دڵشاد ستۆدیۆی ڕازاندنەوەی ناوماڵ",
      "ar": "دڵشاد استوديو تصميم داخلي"
    },
    "category": "interior",
    "owner": "Shvan Faraj",
    "phone": "0780 810 3503",
    "whatsapp": "0780 810 3503",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.6,
    "reviews": 20,
    "verified": false
  },
  {
    "id": 56,
    "name": {
      "en": "Sherko Design House",
      "ku": "شێرکۆ ماڵی دیزاین",
      "ar": "شێرکۆ دار التصميم"
    },
    "category": "interior",
    "owner": "Sardar Aziz",
    "phone": "0771 952 7883",
    "whatsapp": "0771 952 7883",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.1,
    "reviews": 153,
    "verified": false
  },
  {
    "id": 57,
    "name": {
      "en": "Kawa Design House",
      "ku": "کاوا ماڵی دیزاین",
      "ar": "کاوا دار التصميم"
    },
    "category": "interior",
    "owner": "Ranj Sultan",
    "phone": "0775 405 7389",
    "whatsapp": "0775 405 7389",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 4.8,
    "reviews": 111,
    "verified": false
  },
  {
    "id": 58,
    "name": {
      "en": "Chnur Design House",
      "ku": "چنوور ماڵی دیزاین",
      "ar": "چنوور دار التصميم"
    },
    "category": "interior",
    "owner": "Beston Kakei",
    "phone": "0781 324 5471",
    "whatsapp": "0781 324 5471",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.2,
    "reviews": 11,
    "verified": false
  },
  {
    "id": 59,
    "name": {
      "en": "Nazdar Design House",
      "ku": "نازدار ماڵی دیزاین",
      "ar": "نازدار دار التصميم"
    },
    "category": "interior",
    "owner": "Beston Hama",
    "phone": "0781 230 9751",
    "whatsapp": "0781 230 9751",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 3.6,
    "reviews": 104,
    "verified": false
  },
  {
    "id": 60,
    "name": {
      "en": "Nazdar Interior Design Studio",
      "ku": "نازدار ستۆدیۆی ڕازاندنەوەی ناوماڵ",
      "ar": "نازدار استوديو تصميم داخلي"
    },
    "category": "interior",
    "owner": "Hemin Aziz",
    "phone": "0781 286 1823",
    "whatsapp": "0781 286 1823",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4,
    "reviews": 87,
    "verified": true
  },
  {
    "id": 61,
    "name": {
      "en": "Sherko Decor & Paint",
      "ku": "شێرکۆ ڕازاندنەوە و ڕەنگکاری",
      "ar": "شێرکۆ ديكور ودهان"
    },
    "category": "painting",
    "owner": "Shene Hama",
    "phone": "0780 358 2341",
    "whatsapp": "0780 358 2341",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.3,
    "reviews": 142,
    "verified": true
  },
  {
    "id": 62,
    "name": {
      "en": "Bakhtiar Painting Services",
      "ku": "بەختیار خزمەتگوزاری ڕەنگکاری",
      "ar": "بەختیار خدمات الدهان"
    },
    "category": "painting",
    "owner": "Halgurd Karim",
    "phone": "0750 353 4266",
    "whatsapp": "0750 353 4266",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 163,
    "verified": true
  },
  {
    "id": 63,
    "name": {
      "en": "Shvan Decor & Paint",
      "ku": "شوان ڕازاندنەوە و ڕەنگکاری",
      "ar": "شوان ديكور ودهان"
    },
    "category": "painting",
    "owner": "Nazdar Rasul",
    "phone": "0771 576 5198",
    "whatsapp": "0771 576 5198",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.7,
    "reviews": 46,
    "verified": false
  },
  {
    "id": 64,
    "name": {
      "en": "Chnur Painting Contractors",
      "ku": "چنوور پەیمانکاری ڕەنگکاری",
      "ar": "چنوور مقاولو دهان"
    },
    "category": "painting",
    "owner": "Aram Amin",
    "phone": "0751 692 1420",
    "whatsapp": "0751 692 1420",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.9,
    "reviews": 151,
    "verified": false
  },
  {
    "id": 65,
    "name": {
      "en": "Ranj Decor & Paint",
      "ku": "ڕەنج ڕازاندنەوە و ڕەنگکاری",
      "ar": "ڕەنج ديكور ودهان"
    },
    "category": "painting",
    "owner": "Snur Qadir",
    "phone": "0771 204 5941",
    "whatsapp": "0771 204 5941",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 4.8,
    "reviews": 157,
    "verified": false
  },
  {
    "id": 66,
    "name": {
      "en": "Beston Painting Contractors",
      "ku": "بیستوون پەیمانکاری ڕەنگکاری",
      "ar": "بیستوون مقاولو دهان"
    },
    "category": "painting",
    "owner": "Beston Hussein",
    "phone": "0780 777 7071",
    "whatsapp": "0780 777 7071",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.7,
    "reviews": 169,
    "verified": true
  },
  {
    "id": 67,
    "name": {
      "en": "Goran Decor & Paint",
      "ku": "گۆران ڕازاندنەوە و ڕەنگکاری",
      "ar": "گۆران ديكور ودهان"
    },
    "category": "painting",
    "owner": "Newroz Sultan",
    "phone": "0780 470 8532",
    "whatsapp": "0780 470 8532",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.6,
    "reviews": 115,
    "verified": true
  },
  {
    "id": 68,
    "name": {
      "en": "Twana Painting Contractors",
      "ku": "توانا پەیمانکاری ڕەنگکاری",
      "ar": "توانا مقاولو دهان"
    },
    "category": "painting",
    "owner": "Hawre Kakei",
    "phone": "0781 576 8136",
    "whatsapp": "0781 576 8136",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.8,
    "reviews": 155,
    "verified": true
  },
  {
    "id": 69,
    "name": {
      "en": "Goran Painting Services",
      "ku": "گۆران خزمەتگوزاری ڕەنگکاری",
      "ar": "گۆران خدمات الدهان"
    },
    "category": "painting",
    "owner": "Newroz Karim",
    "phone": "0781 349 8613",
    "whatsapp": "0781 349 8613",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.4,
    "reviews": 175,
    "verified": false
  },
  {
    "id": 70,
    "name": {
      "en": "Kawa Decor & Paint",
      "ku": "کاوا ڕازاندنەوە و ڕەنگکاری",
      "ar": "کاوا ديكور ودهان"
    },
    "category": "painting",
    "owner": "Goran Sofi",
    "phone": "0781 317 6813",
    "whatsapp": "0781 317 6813",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.7,
    "reviews": 91,
    "verified": true
  },
  {
    "id": 71,
    "name": {
      "en": "Shorsh Climate Systems",
      "ku": "شۆڕش سیستەمی کەش و هەوا",
      "ar": "شۆڕش أنظمة التكييف"
    },
    "category": "hvac",
    "owner": "Handren Jaza",
    "phone": "0750 629 4130",
    "whatsapp": "0750 629 4130",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 3.7,
    "reviews": 108,
    "verified": false
  },
  {
    "id": 72,
    "name": {
      "en": "Shene AC & Cooling Services",
      "ku": "شێنە خزمەتگوزاری ساردکەرەوە",
      "ar": "شێنە خدمات التكييف والتبريد"
    },
    "category": "hvac",
    "owner": "Snur Sultan",
    "phone": "0781 911 1282",
    "whatsapp": "0781 911 1282",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 3.7,
    "reviews": 60,
    "verified": false
  },
  {
    "id": 73,
    "name": {
      "en": "Bnar Refrigeration Technicians",
      "ku": "بنار تەکنیشیانی ساردکردنەوە",
      "ar": "بنار فنيو تبريد"
    },
    "category": "hvac",
    "owner": "Nazdar Zangana",
    "phone": "0781 666 9698",
    "whatsapp": "0781 666 9698",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.1,
    "reviews": 144,
    "verified": true
  },
  {
    "id": 74,
    "name": {
      "en": "Snur Refrigeration Technicians",
      "ku": "سنوور تەکنیشیانی ساردکردنەوە",
      "ar": "سنوور فنيو تبريد"
    },
    "category": "hvac",
    "owner": "Hawre Baban",
    "phone": "0771 223 4155",
    "whatsapp": "0771 223 4155",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4,
    "reviews": 141,
    "verified": false
  },
  {
    "id": 75,
    "name": {
      "en": "Snur AC & Cooling Services",
      "ku": "سنوور خزمەتگوزاری ساردکەرەوە",
      "ar": "سنوور خدمات التكييف والتبريد"
    },
    "category": "hvac",
    "owner": "Karwan Qadir",
    "phone": "0773 841 9595",
    "whatsapp": "0773 841 9595",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.4,
    "reviews": 29,
    "verified": false
  },
  {
    "id": 76,
    "name": {
      "en": "Peshraw AC & Cooling Services",
      "ku": "پێشڕەو خزمەتگوزاری ساردکەرەوە",
      "ar": "پێشڕەو خدمات التكييف والتبريد"
    },
    "category": "hvac",
    "owner": "Bakhtiar Amin",
    "phone": "0750 825 9751",
    "whatsapp": "0750 825 9751",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 3.8,
    "reviews": 15,
    "verified": false
  },
  {
    "id": 77,
    "name": {
      "en": "Dilshad Refrigeration Technicians",
      "ku": "دڵشاد تەکنیشیانی ساردکردنەوە",
      "ar": "دڵشاد فنيو تبريد"
    },
    "category": "hvac",
    "owner": "Snur Faraj",
    "phone": "0751 993 1200",
    "whatsapp": "0751 993 1200",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.4,
    "reviews": 124,
    "verified": false
  },
  {
    "id": 78,
    "name": {
      "en": "Sherko AC & Cooling Services",
      "ku": "شێرکۆ خزمەتگوزاری ساردکەرەوە",
      "ar": "شێرکۆ خدمات التكييف والتبريد"
    },
    "category": "hvac",
    "owner": "Rebaz Jaza",
    "phone": "0751 941 2070",
    "whatsapp": "0751 941 2070",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.2,
    "reviews": 22,
    "verified": false
  },
  {
    "id": 79,
    "name": {
      "en": "Nazdar AC & Cooling Services",
      "ku": "نازدار خزمەتگوزاری ساردکەرەوە",
      "ar": "نازدار خدمات التكييف والتبريد"
    },
    "category": "hvac",
    "owner": "Shvan Faraj",
    "phone": "0773 187 5066",
    "whatsapp": "0773 187 5066",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 3.8,
    "reviews": 110,
    "verified": false
  },
  {
    "id": 80,
    "name": {
      "en": "Beston Climate Systems",
      "ku": "بیستوون سیستەمی کەش و هەوا",
      "ar": "بیستوون أنظمة التكييف"
    },
    "category": "hvac",
    "owner": "Bnar Sheikhani",
    "phone": "0781 553 5871",
    "whatsapp": "0781 553 5871",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.8,
    "reviews": 113,
    "verified": true
  },
  {
    "id": 81,
    "name": {
      "en": "Shorsh Cleaning Services",
      "ku": "شۆڕش خزمەتگوزاری پاکژکردنەوە",
      "ar": "شۆڕش خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Shorsh Rasul",
    "phone": "0771 370 2330",
    "whatsapp": "0771 370 2330",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 3.8,
    "reviews": 48,
    "verified": false
  },
  {
    "id": 82,
    "name": {
      "en": "Diyar Cleaning Services",
      "ku": "دیار خزمەتگوزاری پاکژکردنەوە",
      "ar": "دیار خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Zana Mahmud",
    "phone": "0781 398 1534",
    "whatsapp": "0781 398 1534",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 3.9,
    "reviews": 76,
    "verified": false
  },
  {
    "id": 83,
    "name": {
      "en": "Sardar Cleaning Services",
      "ku": "سەردار خزمەتگوزاری پاکژکردنەوە",
      "ar": "سەردار خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Nazdar Salih",
    "phone": "0771 535 2880",
    "whatsapp": "0771 535 2880",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.4,
    "reviews": 169,
    "verified": true
  },
  {
    "id": 84,
    "name": {
      "en": "Hawre Cleaning Services",
      "ku": "هاوڕێ خزمەتگوزاری پاکژکردنەوە",
      "ar": "هاوڕێ خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Hemin Hussein",
    "phone": "0773 709 5728",
    "whatsapp": "0773 709 5728",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.2,
    "reviews": 123,
    "verified": false
  },
  {
    "id": 85,
    "name": {
      "en": "Snur Home Cleaning Co.",
      "ku": "سنوور کۆمپانیای پاکژکردنەوەی ماڵ",
      "ar": "سنوور شركة تنظيف منازل"
    },
    "category": "cleaning",
    "owner": "Hawre Sheikhani",
    "phone": "0781 548 2317",
    "whatsapp": "0781 548 2317",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.4,
    "reviews": 114,
    "verified": false
  },
  {
    "id": 86,
    "name": {
      "en": "Shorsh Home Cleaning Co.",
      "ku": "شۆڕش کۆمپانیای پاکژکردنەوەی ماڵ",
      "ar": "شۆڕش شركة تنظيف منازل"
    },
    "category": "cleaning",
    "owner": "Kawa Karim",
    "phone": "0750 883 5415",
    "whatsapp": "0750 883 5415",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.4,
    "reviews": 48,
    "verified": false
  },
  {
    "id": 87,
    "name": {
      "en": "Halgurd Home Cleaning Co.",
      "ku": "هەڵگورد کۆمپانیای پاکژکردنەوەی ماڵ",
      "ar": "هەڵگورد شركة تنظيف منازل"
    },
    "category": "cleaning",
    "owner": "Payam Jaza",
    "phone": "0780 750 9056",
    "whatsapp": "0780 750 9056",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 5,
    "reviews": 124,
    "verified": true
  },
  {
    "id": 88,
    "name": {
      "en": "Sherko Home Cleaning Co.",
      "ku": "شێرکۆ کۆمپانیای پاکژکردنەوەی ماڵ",
      "ar": "شێرکۆ شركة تنظيف منازل"
    },
    "category": "cleaning",
    "owner": "Nazdar Rasul",
    "phone": "0775 521 9117",
    "whatsapp": "0775 521 9117",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4,
    "reviews": 106,
    "verified": false
  },
  {
    "id": 89,
    "name": {
      "en": "Dilshad Cleaning Services",
      "ku": "دڵشاد خزمەتگوزاری پاکژکردنەوە",
      "ar": "دڵشاد خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Sardar Karim",
    "phone": "0773 431 2899",
    "whatsapp": "0773 431 2899",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 5,
    "reviews": 107,
    "verified": false
  },
  {
    "id": 90,
    "name": {
      "en": "Newroz Cleaning Services",
      "ku": "نەورۆز خزمەتگوزاری پاکژکردنەوە",
      "ar": "نەورۆز خدمات التنظيف"
    },
    "category": "cleaning",
    "owner": "Nazdar Barzinji",
    "phone": "0780 155 4073",
    "whatsapp": "0780 155 4073",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.3,
    "reviews": 163,
    "verified": false
  },
  {
    "id": 91,
    "name": {
      "en": "Halgurd Moving Services",
      "ku": "هەڵگورد خزمەتگوزاری گواستنەوە",
      "ar": "هەڵگورد خدمات النقل"
    },
    "category": "moving",
    "owner": "Shene Hussein",
    "phone": "0773 662 3146",
    "whatsapp": "0773 662 3146",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.9,
    "reviews": 116,
    "verified": false
  },
  {
    "id": 92,
    "name": {
      "en": "Rekan Movers & Packers",
      "ku": "ڕێکان گواستنەوە و بەستنەوە",
      "ar": "ڕێکان نقل وتغليف"
    },
    "category": "moving",
    "owner": "Kawa Kakei",
    "phone": "0770 418 1224",
    "whatsapp": "0770 418 1224",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.4,
    "reviews": 27,
    "verified": true
  },
  {
    "id": 93,
    "name": {
      "en": "Newroz Movers & Packers",
      "ku": "نەورۆز گواستنەوە و بەستنەوە",
      "ar": "نەورۆز نقل وتغليف"
    },
    "category": "moving",
    "owner": "Sardar Rasul",
    "phone": "0781 833 5781",
    "whatsapp": "0781 833 5781",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.3,
    "reviews": 73,
    "verified": false
  },
  {
    "id": 94,
    "name": {
      "en": "Rekan Moving Services",
      "ku": "ڕێکان خزمەتگوزاری گواستنەوە",
      "ar": "ڕێکان خدمات النقل"
    },
    "category": "moving",
    "owner": "Bnar Mahmud",
    "phone": "0770 492 4122",
    "whatsapp": "0770 492 4122",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.9,
    "reviews": 134,
    "verified": false
  },
  {
    "id": 95,
    "name": {
      "en": "Shvan Movers & Packers",
      "ku": "شوان گواستنەوە و بەستنەوە",
      "ar": "شوان نقل وتغليف"
    },
    "category": "moving",
    "owner": "Hawre Aziz",
    "phone": "0773 940 1042",
    "whatsapp": "0773 940 1042",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4,
    "reviews": 80,
    "verified": false
  },
  {
    "id": 96,
    "name": {
      "en": "Awat Cargo & Relocation",
      "ku": "ئاوات گواستنەوە و بارهەڵگرتن",
      "ar": "ئاوات شحن ونقل"
    },
    "category": "moving",
    "owner": "Rekan Faraj",
    "phone": "0781 453 6446",
    "whatsapp": "0781 453 6446",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.4,
    "reviews": 143,
    "verified": false
  },
  {
    "id": 97,
    "name": {
      "en": "Payam Moving Services",
      "ku": "پەیام خزمەتگوزاری گواستنەوە",
      "ar": "پەیام خدمات النقل"
    },
    "category": "moving",
    "owner": "Goran Qadir",
    "phone": "0780 339 7730",
    "whatsapp": "0780 339 7730",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 3.7,
    "reviews": 125,
    "verified": false
  },
  {
    "id": 98,
    "name": {
      "en": "Beston Moving Services",
      "ku": "بیستوون خزمەتگوزاری گواستنەوە",
      "ar": "بیستوون خدمات النقل"
    },
    "category": "moving",
    "owner": "Ranj Faraj",
    "phone": "0750 229 9229",
    "whatsapp": "0750 229 9229",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 5,
    "reviews": 88,
    "verified": false
  },
  {
    "id": 99,
    "name": {
      "en": "Goran Moving Services",
      "ku": "گۆران خزمەتگوزاری گواستنەوە",
      "ar": "گۆران خدمات النقل"
    },
    "category": "moving",
    "owner": "Aram Sheikhani",
    "phone": "0750 839 3361",
    "whatsapp": "0750 839 3361",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.2,
    "reviews": 171,
    "verified": false
  },
  {
    "id": 100,
    "name": {
      "en": "Hemin Moving Services",
      "ku": "هێمن خزمەتگوزاری گواستنەوە",
      "ar": "هێمن خدمات النقل"
    },
    "category": "moving",
    "owner": "Beston Jaza",
    "phone": "0780 765 2315",
    "whatsapp": "0780 765 2315",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4.8,
    "reviews": 176,
    "verified": false
  },
  {
    "id": 101,
    "name": {
      "en": "Ranj Car Service Center",
      "ku": "ڕەنج ناوەندی خزمەتگوزاری ئۆتۆمبێل",
      "ar": "ڕەنج مركز خدمة السيارات"
    },
    "category": "mechanics",
    "owner": "Halgurd Sultan",
    "phone": "0750 732 2121",
    "whatsapp": "0750 732 2121",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 3.9,
    "reviews": 179,
    "verified": false
  },
  {
    "id": 102,
    "name": {
      "en": "Bnar Mechanics Workshop",
      "ku": "بنار کارگەی میکانیکی",
      "ar": "بنار ورشة ميكانيكا"
    },
    "category": "mechanics",
    "owner": "Hemin Aziz",
    "phone": "0751 554 3725",
    "whatsapp": "0751 554 3725",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.6,
    "reviews": 11,
    "verified": true
  },
  {
    "id": 103,
    "name": {
      "en": "Beston Auto Repair Garage",
      "ku": "بیستوون گەراجی چاککردنەوەی ئۆتۆمبێل",
      "ar": "بیستوون كراج تصليح السيارات"
    },
    "category": "mechanics",
    "owner": "Peshraw Rashid",
    "phone": "0780 249 5000",
    "whatsapp": "0780 249 5000",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.3,
    "reviews": 148,
    "verified": false
  },
  {
    "id": 104,
    "name": {
      "en": "Diyar Auto Repair Garage",
      "ku": "دیار گەراجی چاککردنەوەی ئۆتۆمبێل",
      "ar": "دیار كراج تصليح السيارات"
    },
    "category": "mechanics",
    "owner": "Diyar Karim",
    "phone": "0780 734 4945",
    "whatsapp": "0780 734 4945",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.3,
    "reviews": 153,
    "verified": true
  },
  {
    "id": 105,
    "name": {
      "en": "Sardar Mechanics Workshop",
      "ku": "سەردار کارگەی میکانیکی",
      "ar": "سەردار ورشة ميكانيكا"
    },
    "category": "mechanics",
    "owner": "Hawre Mahmud",
    "phone": "0750 923 8622",
    "whatsapp": "0750 923 8622",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.9,
    "reviews": 177,
    "verified": false
  },
  {
    "id": 106,
    "name": {
      "en": "Hemin Car Service Center",
      "ku": "هێمن ناوەندی خزمەتگوزاری ئۆتۆمبێل",
      "ar": "هێمن مركز خدمة السيارات"
    },
    "category": "mechanics",
    "owner": "Bakhtiar Zangana",
    "phone": "0780 806 5097",
    "whatsapp": "0780 806 5097",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.2,
    "reviews": 81,
    "verified": true
  },
  {
    "id": 107,
    "name": {
      "en": "Aram Auto Repair Garage",
      "ku": "ئارام گەراجی چاککردنەوەی ئۆتۆمبێل",
      "ar": "ئارام كراج تصليح السيارات"
    },
    "category": "mechanics",
    "owner": "Ranj Zangana",
    "phone": "0773 816 5837",
    "whatsapp": "0773 816 5837",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.6,
    "reviews": 172,
    "verified": false
  },
  {
    "id": 108,
    "name": {
      "en": "Kawa Mechanics Workshop",
      "ku": "کاوا کارگەی میکانیکی",
      "ar": "کاوا ورشة ميكانيكا"
    },
    "category": "mechanics",
    "owner": "Goran Hussein",
    "phone": "0781 952 5689",
    "whatsapp": "0781 952 5689",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.7,
    "reviews": 62,
    "verified": false
  },
  {
    "id": 109,
    "name": {
      "en": "Bakhtiar Auto Repair Garage",
      "ku": "بەختیار گەراجی چاککردنەوەی ئۆتۆمبێل",
      "ar": "بەختیار كراج تصليح السيارات"
    },
    "category": "mechanics",
    "owner": "Halgurd Qadir",
    "phone": "0773 794 3240",
    "whatsapp": "0773 794 3240",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.5,
    "reviews": 164,
    "verified": false
  },
  {
    "id": 110,
    "name": {
      "en": "Peshraw Car Service Center",
      "ku": "پێشڕەو ناوەندی خزمەتگوزاری ئۆتۆمبێل",
      "ar": "پێشڕەو مركز خدمة السيارات"
    },
    "category": "mechanics",
    "owner": "Rebaz Zangana",
    "phone": "0770 192 5835",
    "whatsapp": "0770 192 5835",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.1,
    "reviews": 110,
    "verified": true
  },
  {
    "id": 111,
    "name": {
      "en": "Shvan Shine Car Care",
      "ku": "شوان چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "شوان العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Handren Rashid",
    "phone": "0773 950 3695",
    "whatsapp": "0773 950 3695",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4,
    "reviews": 127,
    "verified": false
  },
  {
    "id": 112,
    "name": {
      "en": "Peshraw Shine Car Care",
      "ku": "پێشڕەو چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "پێشڕەو العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Goran Sofi",
    "phone": "0781 177 3306",
    "whatsapp": "0781 177 3306",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.7,
    "reviews": 61,
    "verified": false
  },
  {
    "id": 113,
    "name": {
      "en": "Chnur Shine Car Care",
      "ku": "چنوور چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "چنوور العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Ranj Barzinji",
    "phone": "0751 909 7464",
    "whatsapp": "0751 909 7464",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.6,
    "reviews": 141,
    "verified": true
  },
  {
    "id": 114,
    "name": {
      "en": "Bakhtiar Shine Car Care",
      "ku": "بەختیار چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "بەختیار العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Chnur Jaza",
    "phone": "0780 942 7086",
    "whatsapp": "0780 942 7086",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 3.8,
    "reviews": 63,
    "verified": false
  },
  {
    "id": 115,
    "name": {
      "en": "Shorsh Shine Car Care",
      "ku": "شۆڕش چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "شۆڕش العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Sherko Kakei",
    "phone": "0751 750 8606",
    "whatsapp": "0751 750 8606",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.9,
    "reviews": 81,
    "verified": false
  },
  {
    "id": 116,
    "name": {
      "en": "Aram Car Wash & Detailing",
      "ku": "ئارام شوشتن و پاککردنەوەی ئۆتۆمبێل",
      "ar": "ئارام غسيل وتلميع السيارات"
    },
    "category": "carwash",
    "owner": "Rebaz Hussein",
    "phone": "0781 218 2592",
    "whatsapp": "0781 218 2592",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 3.9,
    "reviews": 141,
    "verified": true
  },
  {
    "id": 117,
    "name": {
      "en": "Sardar Auto Spa",
      "ku": "سەردار سپای ئۆتۆمبێل",
      "ar": "سەردار سبا السيارات"
    },
    "category": "carwash",
    "owner": "Nazdar Barzinji",
    "phone": "0770 524 2622",
    "whatsapp": "0770 524 2622",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.8,
    "reviews": 161,
    "verified": false
  },
  {
    "id": 118,
    "name": {
      "en": "Hawre Car Wash & Detailing",
      "ku": "هاوڕێ شوشتن و پاککردنەوەی ئۆتۆمبێل",
      "ar": "هاوڕێ غسيل وتلميع السيارات"
    },
    "category": "carwash",
    "owner": "Snur Rashid",
    "phone": "0781 555 4868",
    "whatsapp": "0781 555 4868",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.8,
    "reviews": 29,
    "verified": false
  },
  {
    "id": 119,
    "name": {
      "en": "Handren Shine Car Care",
      "ku": "هەندرین چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "هەندرین العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Bakhtiar Hussein",
    "phone": "0773 294 3001",
    "whatsapp": "0773 294 3001",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.9,
    "reviews": 120,
    "verified": true
  },
  {
    "id": 120,
    "name": {
      "en": "Karwan Shine Car Care",
      "ku": "کاروان چاودێری درەوشانەوەی ئۆتۆمبێل",
      "ar": "کاروان العناية بلمعان السيارات"
    },
    "category": "carwash",
    "owner": "Halgurd Kakei",
    "phone": "0750 905 6464",
    "whatsapp": "0750 905 6464",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 3.9,
    "reviews": 36,
    "verified": false
  },
  {
    "id": 121,
    "name": {
      "en": "Karwan Photography Studio",
      "ku": "کاروان ستۆدیۆی وێنەگری",
      "ar": "کاروان استوديو تصوير"
    },
    "category": "photography",
    "owner": "Newroz Barzinji",
    "phone": "0771 932 4817",
    "whatsapp": "0771 932 4817",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.1,
    "reviews": 41,
    "verified": false
  },
  {
    "id": 122,
    "name": {
      "en": "Shorsh Photography Studio",
      "ku": "شۆڕش ستۆدیۆی وێنەگری",
      "ar": "شۆڕش استوديو تصوير"
    },
    "category": "photography",
    "owner": "Hawre Faraj",
    "phone": "0773 917 3858",
    "whatsapp": "0773 917 3858",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 3.8,
    "reviews": 10,
    "verified": true
  },
  {
    "id": 123,
    "name": {
      "en": "Bakhtiar Photography Studio",
      "ku": "بەختیار ستۆدیۆی وێنەگری",
      "ar": "بەختیار استوديو تصوير"
    },
    "category": "photography",
    "owner": "Awat Sofi",
    "phone": "0770 371 1858",
    "whatsapp": "0770 371 1858",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 3.8,
    "reviews": 111,
    "verified": false
  },
  {
    "id": 124,
    "name": {
      "en": "Chnur Photography Studio",
      "ku": "چنوور ستۆدیۆی وێنەگری",
      "ar": "چنوور استوديو تصوير"
    },
    "category": "photography",
    "owner": "Rekan Mahmud",
    "phone": "0751 562 9254",
    "whatsapp": "0751 562 9254",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.9,
    "reviews": 161,
    "verified": true
  },
  {
    "id": 125,
    "name": {
      "en": "Beston Studio",
      "ku": "بیستوون ستۆدیۆ",
      "ar": "بیستوون استوديو"
    },
    "category": "photography",
    "owner": "Twana Baban",
    "phone": "0750 162 8847",
    "whatsapp": "0750 162 8847",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.8,
    "reviews": 113,
    "verified": false
  },
  {
    "id": 126,
    "name": {
      "en": "Rekan Studio",
      "ku": "ڕێکان ستۆدیۆ",
      "ar": "ڕێکان استوديو"
    },
    "category": "photography",
    "owner": "Payam Mahmud",
    "phone": "0751 429 3430",
    "whatsapp": "0751 429 3430",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 3.7,
    "reviews": 74,
    "verified": false
  },
  {
    "id": 127,
    "name": {
      "en": "Awat Studio",
      "ku": "ئاوات ستۆدیۆ",
      "ar": "ئاوات استوديو"
    },
    "category": "photography",
    "owner": "Snur Sofi",
    "phone": "0773 564 9282",
    "whatsapp": "0773 564 9282",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.4,
    "reviews": 29,
    "verified": false
  },
  {
    "id": 128,
    "name": {
      "en": "Aram Studio",
      "ku": "ئارام ستۆدیۆ",
      "ar": "ئارام استوديو"
    },
    "category": "photography",
    "owner": "Halgurd Barzinji",
    "phone": "0780 562 4743",
    "whatsapp": "0780 562 4743",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.2,
    "reviews": 120,
    "verified": false
  },
  {
    "id": 129,
    "name": {
      "en": "Sherko Photo & Video",
      "ku": "شێرکۆ وێنە و ڤیدیۆ",
      "ar": "شێرکۆ تصوير فوتوغرافي وفيديو"
    },
    "category": "photography",
    "owner": "Sherko Jaza",
    "phone": "0770 803 8770",
    "whatsapp": "0770 803 8770",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 3.7,
    "reviews": 25,
    "verified": true
  },
  {
    "id": 130,
    "name": {
      "en": "Chnur Photo & Video",
      "ku": "چنوور وێنە و ڤیدیۆ",
      "ar": "چنوور تصوير فوتوغرافي وفيديو"
    },
    "category": "photography",
    "owner": "Beston Faraj",
    "phone": "0750 700 6400",
    "whatsapp": "0750 700 6400",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.5,
    "reviews": 109,
    "verified": false
  },
  {
    "id": 131,
    "name": {
      "en": "Nazdar Fashion Atelier",
      "ku": "نازدار ئاتۆلیەی فاشن",
      "ar": "نازدار أتيليه أزياء"
    },
    "category": "tailoring",
    "owner": "Goran Hussein",
    "phone": "0773 460 2697",
    "whatsapp": "0773 460 2697",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.4,
    "reviews": 58,
    "verified": true
  },
  {
    "id": 132,
    "name": {
      "en": "Rekan Tailoring House",
      "ku": "ڕێکان ماڵی دەرزیکاری",
      "ar": "ڕێکان دار الخياطة"
    },
    "category": "tailoring",
    "owner": "Goran Rasul",
    "phone": "0775 217 5564",
    "whatsapp": "0775 217 5564",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.4,
    "reviews": 113,
    "verified": false
  },
  {
    "id": 133,
    "name": {
      "en": "Shene Custom Tailors",
      "ku": "شێنە دەرزیکاری تایبەت",
      "ar": "شێنە خياطة حسب الطلب"
    },
    "category": "tailoring",
    "owner": "Shorsh Barzinji",
    "phone": "0773 129 3955",
    "whatsapp": "0773 129 3955",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 4,
    "reviews": 83,
    "verified": false
  },
  {
    "id": 134,
    "name": {
      "en": "Bakhtiar Tailoring House",
      "ku": "بەختیار ماڵی دەرزیکاری",
      "ar": "بەختیار دار الخياطة"
    },
    "category": "tailoring",
    "owner": "Diyar Faraj",
    "phone": "0780 171 3324",
    "whatsapp": "0780 171 3324",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.6,
    "reviews": 11,
    "verified": true
  },
  {
    "id": 135,
    "name": {
      "en": "Twana Tailoring House",
      "ku": "توانا ماڵی دەرزیکاری",
      "ar": "توانا دار الخياطة"
    },
    "category": "tailoring",
    "owner": "Ranj Aziz",
    "phone": "0775 261 7062",
    "whatsapp": "0775 261 7062",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4,
    "reviews": 87,
    "verified": false
  },
  {
    "id": 136,
    "name": {
      "en": "Awat Custom Tailors",
      "ku": "ئاوات دەرزیکاری تایبەت",
      "ar": "ئاوات خياطة حسب الطلب"
    },
    "category": "tailoring",
    "owner": "Hemin Hussein",
    "phone": "0770 872 1815",
    "whatsapp": "0770 872 1815",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.5,
    "reviews": 73,
    "verified": false
  },
  {
    "id": 137,
    "name": {
      "en": "Zana Fashion Atelier",
      "ku": "زانا ئاتۆلیەی فاشن",
      "ar": "زانا أتيليه أزياء"
    },
    "category": "tailoring",
    "owner": "Shorsh Mahmud",
    "phone": "0773 320 9394",
    "whatsapp": "0773 320 9394",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 3.8,
    "reviews": 114,
    "verified": true
  },
  {
    "id": 138,
    "name": {
      "en": "Nazdar Custom Tailors",
      "ku": "نازدار دەرزیکاری تایبەت",
      "ar": "نازدار خياطة حسب الطلب"
    },
    "category": "tailoring",
    "owner": "Awat Sultan",
    "phone": "0773 146 4612",
    "whatsapp": "0773 146 4612",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.2,
    "reviews": 157,
    "verified": true
  },
  {
    "id": 139,
    "name": {
      "en": "Karwan Fashion Atelier",
      "ku": "کاروان ئاتۆلیەی فاشن",
      "ar": "کاروان أتيليه أزياء"
    },
    "category": "tailoring",
    "owner": "Karwan Faraj",
    "phone": "0773 435 2965",
    "whatsapp": "0773 435 2965",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 3.6,
    "reviews": 114,
    "verified": true
  },
  {
    "id": 140,
    "name": {
      "en": "Ranj Custom Tailors",
      "ku": "ڕەنج دەرزیکاری تایبەت",
      "ar": "ڕەنج خياطة حسب الطلب"
    },
    "category": "tailoring",
    "owner": "Snur Salih",
    "phone": "0775 173 7505",
    "whatsapp": "0775 173 7505",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.8,
    "reviews": 14,
    "verified": false
  },
  {
    "id": 141,
    "name": {
      "en": "Sardar Bakery & Pastry",
      "ku": "سەردار نانەوایی و شیرینی",
      "ar": "سەردار مخبز وحلويات"
    },
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0780 687 7626",
    "whatsapp": "0780 687 7626",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.6,
    "reviews": 110,
    "verified": true
  },
  {
    "id": 142,
    "name": {
      "en": "Ranj Bakery & Pastry",
      "ku": "ڕەنج نانەوایی و شیرینی",
      "ar": "ڕەنج مخبز وحلويات"
    },
    "category": "bakery",
    "owner": "Sherko Amin",
    "phone": "0781 951 6928",
    "whatsapp": "0781 951 6928",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 3.7,
    "reviews": 31,
    "verified": true
  },
  {
    "id": 143,
    "name": {
      "en": "Awat Sweets & Bakery",
      "ku": "ئاوات شیرینی و نانەوایی",
      "ar": "ئاوات حلويات ومخبوزات"
    },
    "category": "bakery",
    "owner": "Twana Karim",
    "phone": "0773 863 6562",
    "whatsapp": "0773 863 6562",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 3.9,
    "reviews": 47,
    "verified": true
  },
  {
    "id": 144,
    "name": {
      "en": "Halgurd Bakery & Pastry",
      "ku": "هەڵگورد نانەوایی و شیرینی",
      "ar": "هەڵگورد مخبز وحلويات"
    },
    "category": "bakery",
    "owner": "Twana Sheikhani",
    "phone": "0775 459 3419",
    "whatsapp": "0775 459 3419",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 3.9,
    "reviews": 41,
    "verified": true
  },
  {
    "id": 145,
    "name": {
      "en": "Diyar Pastry Shop",
      "ku": "دیار شیرینیخانە",
      "ar": "دیار محل حلويات"
    },
    "category": "bakery",
    "owner": "Shvan Karim",
    "phone": "0781 575 8354",
    "whatsapp": "0781 575 8354",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.6,
    "reviews": 148,
    "verified": false
  },
  {
    "id": 146,
    "name": {
      "en": "Shorsh Sweets & Bakery",
      "ku": "شۆڕش شیرینی و نانەوایی",
      "ar": "شۆڕش حلويات ومخبوزات"
    },
    "category": "bakery",
    "owner": "Goran Sofi",
    "phone": "0781 169 8682",
    "whatsapp": "0781 169 8682",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 81,
    "verified": false
  },
  {
    "id": 147,
    "name": {
      "en": "Awat Bakery & Pastry",
      "ku": "ئاوات نانەوایی و شیرینی",
      "ar": "ئاوات مخبز وحلويات"
    },
    "category": "bakery",
    "owner": "Bakhtiar Sheikhani",
    "phone": "0773 572 8404",
    "whatsapp": "0773 572 8404",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 3.7,
    "reviews": 98,
    "verified": false
  },
  {
    "id": 148,
    "name": {
      "en": "Hemin Pastry Shop",
      "ku": "هێمن شیرینیخانە",
      "ar": "هێمن محل حلويات"
    },
    "category": "bakery",
    "owner": "Goran Karim",
    "phone": "0780 573 1672",
    "whatsapp": "0780 573 1672",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.2,
    "reviews": 150,
    "verified": false
  },
  {
    "id": 149,
    "name": {
      "en": "Sherko Pastry Shop",
      "ku": "شێرکۆ شیرینیخانە",
      "ar": "شێرکۆ محل حلويات"
    },
    "category": "bakery",
    "owner": "Rekan Sheikhani",
    "phone": "0750 561 2695",
    "whatsapp": "0750 561 2695",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.7,
    "reviews": 91,
    "verified": false
  },
  {
    "id": 150,
    "name": {
      "en": "Rebaz Bakery & Pastry",
      "ku": "ڕێباز نانەوایی و شیرینی",
      "ar": "ڕێباز مخبز وحلويات"
    },
    "category": "bakery",
    "owner": "Snur Mahmud",
    "phone": "0770 472 7108",
    "whatsapp": "0770 472 7108",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.9,
    "reviews": 103,
    "verified": false
  },
  {
    "id": 151,
    "name": {
      "en": "Sherko Kitchen & Events",
      "ku": "شێرکۆ چێشتخانە و بۆنەکان",
      "ar": "شێرکۆ مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Shorsh Hussein",
    "phone": "0751 437 2548",
    "whatsapp": "0751 437 2548",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4.4,
    "reviews": 102,
    "verified": true
  },
  {
    "id": 152,
    "name": {
      "en": "Chnur Kitchen & Events",
      "ku": "چنوور چێشتخانە و بۆنەکان",
      "ar": "چنوور مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Payam Kakei",
    "phone": "0775 183 3317",
    "whatsapp": "0775 183 3317",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.9,
    "reviews": 83,
    "verified": false
  },
  {
    "id": 153,
    "name": {
      "en": "Snur Kitchen & Events",
      "ku": "سنوور چێشتخانە و بۆنەکان",
      "ar": "سنوور مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Ranj Faraj",
    "phone": "0751 417 7171",
    "whatsapp": "0751 417 7171",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.5,
    "reviews": 88,
    "verified": false
  },
  {
    "id": 154,
    "name": {
      "en": "Nazdar Kitchen & Events",
      "ku": "نازدار چێشتخانە و بۆنەکان",
      "ar": "نازدار مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Newroz Sheikhani",
    "phone": "0780 620 6928",
    "whatsapp": "0780 620 6928",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 3.6,
    "reviews": 83,
    "verified": true
  },
  {
    "id": 155,
    "name": {
      "en": "Karwan Catering Services",
      "ku": "کاروان خزمەتگوزاری کەیتەرینگ",
      "ar": "کاروان خدمات التموين"
    },
    "category": "catering",
    "owner": "Shene Sultan",
    "phone": "0771 240 3538",
    "whatsapp": "0771 240 3538",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 3.7,
    "reviews": 29,
    "verified": false
  },
  {
    "id": 156,
    "name": {
      "en": "Dilshad Kitchen & Events",
      "ku": "دڵشاد چێشتخانە و بۆنەکان",
      "ar": "دڵشاد مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Handren Sheikhani",
    "phone": "0775 997 3147",
    "whatsapp": "0775 997 3147",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.4,
    "reviews": 43,
    "verified": true
  },
  {
    "id": 157,
    "name": {
      "en": "Newroz Kitchen & Events",
      "ku": "نەورۆز چێشتخانە و بۆنەکان",
      "ar": "نەورۆز مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Shene Kakei",
    "phone": "0781 144 7731",
    "whatsapp": "0781 144 7731",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.1,
    "reviews": 64,
    "verified": false
  },
  {
    "id": 158,
    "name": {
      "en": "Shorsh Catering Services",
      "ku": "شۆڕش خزمەتگوزاری کەیتەرینگ",
      "ar": "شۆڕش خدمات التموين"
    },
    "category": "catering",
    "owner": "Shene Mahmud",
    "phone": "0771 416 8684",
    "whatsapp": "0771 416 8684",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.9,
    "reviews": 53,
    "verified": false
  },
  {
    "id": 159,
    "name": {
      "en": "Awat Catering Services",
      "ku": "ئاوات خزمەتگوزاری کەیتەرینگ",
      "ar": "ئاوات خدمات التموين"
    },
    "category": "catering",
    "owner": "Sardar Baban",
    "phone": "0780 265 4271",
    "whatsapp": "0780 265 4271",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.7,
    "reviews": 39,
    "verified": false
  },
  {
    "id": 160,
    "name": {
      "en": "Rebaz Kitchen & Events",
      "ku": "ڕێباز چێشتخانە و بۆنەکان",
      "ar": "ڕێباز مطبخ ومناسبات"
    },
    "category": "catering",
    "owner": "Rekan Rashid",
    "phone": "0751 828 9452",
    "whatsapp": "0751 828 9452",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.8,
    "reviews": 76,
    "verified": true
  },
  {
    "id": 161,
    "name": {
      "en": "Diyar Beauty Center",
      "ku": "دیار ناوەندی جوانی",
      "ar": "دیار مركز تجميل"
    },
    "category": "beauty",
    "owner": "Sardar Sheikhani",
    "phone": "0780 193 4637",
    "whatsapp": "0780 193 4637",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.7,
    "reviews": 93,
    "verified": false
  },
  {
    "id": 162,
    "name": {
      "en": "Zana Beauty Salon",
      "ku": "زانا ژوانگای جوانی",
      "ar": "زانا صالون تجميل"
    },
    "category": "beauty",
    "owner": "Ranj Sheikhani",
    "phone": "0771 495 2337",
    "whatsapp": "0771 495 2337",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.1,
    "reviews": 11,
    "verified": true
  },
  {
    "id": 163,
    "name": {
      "en": "Aram Ladies Salon",
      "ku": "ئارام ژوانگای ئافرەتان",
      "ar": "ئارام صالون نسائي"
    },
    "category": "beauty",
    "owner": "Halgurd Sofi",
    "phone": "0770 139 5700",
    "whatsapp": "0770 139 5700",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.9,
    "reviews": 124,
    "verified": false
  },
  {
    "id": 164,
    "name": {
      "en": "Shvan Ladies Salon",
      "ku": "شوان ژوانگای ئافرەتان",
      "ar": "شوان صالون نسائي"
    },
    "category": "beauty",
    "owner": "Rekan Mahmud",
    "phone": "0750 181 1311",
    "whatsapp": "0750 181 1311",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4,
    "reviews": 42,
    "verified": false
  },
  {
    "id": 165,
    "name": {
      "en": "Chnur Ladies Salon",
      "ku": "چنوور ژوانگای ئافرەتان",
      "ar": "چنوور صالون نسائي"
    },
    "category": "beauty",
    "owner": "Twana Aziz",
    "phone": "0773 343 5934",
    "whatsapp": "0773 343 5934",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 3.8,
    "reviews": 65,
    "verified": false
  },
  {
    "id": 166,
    "name": {
      "en": "Beston Ladies Salon",
      "ku": "بیستوون ژوانگای ئافرەتان",
      "ar": "بیستوون صالون نسائي"
    },
    "category": "beauty",
    "owner": "Sardar Karim",
    "phone": "0781 711 9782",
    "whatsapp": "0781 711 9782",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 3.6,
    "reviews": 135,
    "verified": false
  },
  {
    "id": 167,
    "name": {
      "en": "Snur Beauty Salon",
      "ku": "سنوور ژوانگای جوانی",
      "ar": "سنوور صالون تجميل"
    },
    "category": "beauty",
    "owner": "Peshraw Aziz",
    "phone": "0775 346 7825",
    "whatsapp": "0775 346 7825",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 3.9,
    "reviews": 175,
    "verified": true
  },
  {
    "id": 168,
    "name": {
      "en": "Bakhtiar Beauty Salon",
      "ku": "بەختیار ژوانگای جوانی",
      "ar": "بەختیار صالون تجميل"
    },
    "category": "beauty",
    "owner": "Twana Barzinji",
    "phone": "0750 499 8702",
    "whatsapp": "0750 499 8702",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 3.7,
    "reviews": 103,
    "verified": false
  },
  {
    "id": 169,
    "name": {
      "en": "Hawre Ladies Salon",
      "ku": "هاوڕێ ژوانگای ئافرەتان",
      "ar": "هاوڕێ صالون نسائي"
    },
    "category": "beauty",
    "owner": "Kawa Rashid",
    "phone": "0775 346 2698",
    "whatsapp": "0775 346 2698",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 4.7,
    "reviews": 89,
    "verified": true
  },
  {
    "id": 170,
    "name": {
      "en": "Bakhtiar Ladies Salon",
      "ku": "بەختیار ژوانگای ئافرەتان",
      "ar": "بەختیار صالون نسائي"
    },
    "category": "beauty",
    "owner": "Sherko Amin",
    "phone": "0781 746 3986",
    "whatsapp": "0781 746 3986",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.7,
    "reviews": 20,
    "verified": false
  },
  {
    "id": 171,
    "name": {
      "en": "Sardar Barbershop",
      "ku": "سەردار سەلمانی",
      "ar": "سەردار صالون حلاقة"
    },
    "category": "barber",
    "owner": "Peshraw Qadir",
    "phone": "0771 142 6170",
    "whatsapp": "0771 142 6170",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.9,
    "reviews": 135,
    "verified": false
  },
  {
    "id": 172,
    "name": {
      "en": "Newroz Gents Barber",
      "ku": "نەورۆز سەلمانی پیاوان",
      "ar": "نەورۆز حلاقة رجالي"
    },
    "category": "barber",
    "owner": "Rekan Jaza",
    "phone": "0771 392 6848",
    "whatsapp": "0771 392 6848",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 16,
    "verified": false
  },
  {
    "id": 173,
    "name": {
      "en": "Sherko Men's Salon",
      "ku": "شێرکۆ ژوانگای پیاوان",
      "ar": "شێرکۆ صالون رجالي"
    },
    "category": "barber",
    "owner": "Aram Rashid",
    "phone": "0780 861 8204",
    "whatsapp": "0780 861 8204",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.9,
    "reviews": 102,
    "verified": true
  },
  {
    "id": 174,
    "name": {
      "en": "Diyar Men's Salon",
      "ku": "دیار ژوانگای پیاوان",
      "ar": "دیار صالون رجالي"
    },
    "category": "barber",
    "owner": "Snur Sultan",
    "phone": "0773 920 2353",
    "whatsapp": "0773 920 2353",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.6,
    "reviews": 24,
    "verified": false
  },
  {
    "id": 175,
    "name": {
      "en": "Newroz Barbershop",
      "ku": "نەورۆز سەلمانی",
      "ar": "نەورۆز صالون حلاقة"
    },
    "category": "barber",
    "owner": "Dilshad Baban",
    "phone": "0751 181 6372",
    "whatsapp": "0751 181 6372",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4.5,
    "reviews": 82,
    "verified": false
  },
  {
    "id": 176,
    "name": {
      "en": "Snur Men's Salon",
      "ku": "سنوور ژوانگای پیاوان",
      "ar": "سنوور صالون رجالي"
    },
    "category": "barber",
    "owner": "Diyar Mahmud",
    "phone": "0781 143 6776",
    "whatsapp": "0781 143 6776",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 115,
    "verified": true
  },
  {
    "id": 177,
    "name": {
      "en": "Beston Barbershop",
      "ku": "بیستوون سەلمانی",
      "ar": "بیستوون صالون حلاقة"
    },
    "category": "barber",
    "owner": "Hemin Hama",
    "phone": "0770 131 3339",
    "whatsapp": "0770 131 3339",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.8,
    "reviews": 177,
    "verified": false
  },
  {
    "id": 178,
    "name": {
      "en": "Rebaz Barbershop",
      "ku": "ڕێباز سەلمانی",
      "ar": "ڕێباز صالون حلاقة"
    },
    "category": "barber",
    "owner": "Hemin Salih",
    "phone": "0775 492 1530",
    "whatsapp": "0775 492 1530",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.4,
    "reviews": 177,
    "verified": false
  },
  {
    "id": 179,
    "name": {
      "en": "Bakhtiar Men's Salon",
      "ku": "بەختیار ژوانگای پیاوان",
      "ar": "بەختیار صالون رجالي"
    },
    "category": "barber",
    "owner": "Sardar Karim",
    "phone": "0770 642 7012",
    "whatsapp": "0770 642 7012",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 170,
    "verified": true
  },
  {
    "id": 180,
    "name": {
      "en": "Aram Barbershop",
      "ku": "ئارام سەلمانی",
      "ar": "ئارام صالون حلاقة"
    },
    "category": "barber",
    "owner": "Chnur Amin",
    "phone": "0780 675 2929",
    "whatsapp": "0780 675 2929",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4,
    "reviews": 70,
    "verified": false
  },
  {
    "id": 181,
    "name": {
      "en": "Karwan Advocates",
      "ku": "کاروان پارێزەران",
      "ar": "کاروان محامون"
    },
    "category": "legal",
    "owner": "Peshraw Sultan",
    "phone": "0751 238 2213",
    "whatsapp": "0751 238 2213",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.2,
    "reviews": 117,
    "verified": false
  },
  {
    "id": 182,
    "name": {
      "en": "Beston Advocates",
      "ku": "بیستوون پارێزەران",
      "ar": "بیستوون محامون"
    },
    "category": "legal",
    "owner": "Goran Sofi",
    "phone": "0751 663 9882",
    "whatsapp": "0751 663 9882",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4,
    "reviews": 80,
    "verified": false
  },
  {
    "id": 183,
    "name": {
      "en": "Snur Advocates",
      "ku": "سنوور پارێزەران",
      "ar": "سنوور محامون"
    },
    "category": "legal",
    "owner": "Payam Amin",
    "phone": "0771 224 4292",
    "whatsapp": "0771 224 4292",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.7,
    "reviews": 64,
    "verified": false
  },
  {
    "id": 184,
    "name": {
      "en": "Kawa Legal Consultancy",
      "ku": "کاوا ڕاوێژکاری یاسایی",
      "ar": "کاوا استشارات قانونية"
    },
    "category": "legal",
    "owner": "Dilshad Zangana",
    "phone": "0781 922 3126",
    "whatsapp": "0781 922 3126",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 26,
    "verified": true
  },
  {
    "id": 185,
    "name": {
      "en": "Ranj Advocates",
      "ku": "ڕەنج پارێزەران",
      "ar": "ڕەنج محامون"
    },
    "category": "legal",
    "owner": "Chnur Sultan",
    "phone": "0780 887 7708",
    "whatsapp": "0780 887 7708",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.8,
    "reviews": 22,
    "verified": true
  },
  {
    "id": 186,
    "name": {
      "en": "Sherko Advocates",
      "ku": "شێرکۆ پارێزەران",
      "ar": "شێرکۆ محامون"
    },
    "category": "legal",
    "owner": "Hemin Mahmud",
    "phone": "0775 231 3981",
    "whatsapp": "0775 231 3981",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.7,
    "reviews": 37,
    "verified": false
  },
  {
    "id": 187,
    "name": {
      "en": "Payam Law Office",
      "ku": "پەیام ئۆفیسی یاسایی",
      "ar": "پەیام مكتب محاماة"
    },
    "category": "legal",
    "owner": "Newroz Rasul",
    "phone": "0770 411 3697",
    "whatsapp": "0770 411 3697",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 3.8,
    "reviews": 61,
    "verified": true
  },
  {
    "id": 188,
    "name": {
      "en": "Twana Legal Consultancy",
      "ku": "توانا ڕاوێژکاری یاسایی",
      "ar": "توانا استشارات قانونية"
    },
    "category": "legal",
    "owner": "Goran Karim",
    "phone": "0771 750 5496",
    "whatsapp": "0771 750 5496",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 3.8,
    "reviews": 81,
    "verified": false
  },
  {
    "id": 189,
    "name": {
      "en": "Hemin Advocates",
      "ku": "هێمن پارێزەران",
      "ar": "هێمن محامون"
    },
    "category": "legal",
    "owner": "Halgurd Amin",
    "phone": "0770 275 6531",
    "whatsapp": "0770 275 6531",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.8,
    "reviews": 148,
    "verified": true
  },
  {
    "id": 190,
    "name": {
      "en": "Goran Law Office",
      "ku": "گۆران ئۆفیسی یاسایی",
      "ar": "گۆران مكتب محاماة"
    },
    "category": "legal",
    "owner": "Hemin Hussein",
    "phone": "0773 766 4453",
    "whatsapp": "0773 766 4453",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.7,
    "reviews": 110,
    "verified": false
  },
  {
    "id": 191,
    "name": {
      "en": "Kawa Tax & Accounting Services",
      "ku": "کاوا خزمەتگوزاری باج و ژمێریاری",
      "ar": "کاوا خدمات الضرائب والمحاسبة"
    },
    "category": "accounting",
    "owner": "Handren Barzinji",
    "phone": "0773 594 5012",
    "whatsapp": "0773 594 5012",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.7,
    "reviews": 179,
    "verified": false
  },
  {
    "id": 192,
    "name": {
      "en": "Sardar Accounting Office",
      "ku": "سەردار ئۆفیسی ژمێریاری",
      "ar": "سەردار مكتب محاسبة"
    },
    "category": "accounting",
    "owner": "Snur Hussein",
    "phone": "0781 525 8933",
    "whatsapp": "0781 525 8933",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.3,
    "reviews": 91,
    "verified": false
  },
  {
    "id": 193,
    "name": {
      "en": "Sherko Audit Services",
      "ku": "شێرکۆ خزمەتگوزاری لێکۆڵینەوەی دارایی",
      "ar": "شێرکۆ خدمات التدقيق"
    },
    "category": "accounting",
    "owner": "Sherko Rashid",
    "phone": "0770 878 7070",
    "whatsapp": "0770 878 7070",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.3,
    "reviews": 31,
    "verified": true
  },
  {
    "id": 194,
    "name": {
      "en": "Hawre Tax & Accounting Services",
      "ku": "هاوڕێ خزمەتگوزاری باج و ژمێریاری",
      "ar": "هاوڕێ خدمات الضرائب والمحاسبة"
    },
    "category": "accounting",
    "owner": "Bnar Faraj",
    "phone": "0750 397 7293",
    "whatsapp": "0750 397 7293",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.8,
    "reviews": 111,
    "verified": true
  },
  {
    "id": 195,
    "name": {
      "en": "Goran Accounting Office",
      "ku": "گۆران ئۆفیسی ژمێریاری",
      "ar": "گۆران مكتب محاسبة"
    },
    "category": "accounting",
    "owner": "Newroz Sofi",
    "phone": "0775 294 3610",
    "whatsapp": "0775 294 3610",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.3,
    "reviews": 135,
    "verified": false
  },
  {
    "id": 196,
    "name": {
      "en": "Handren Tax & Accounting Services",
      "ku": "هەندرین خزمەتگوزاری باج و ژمێریاری",
      "ar": "هەندرین خدمات الضرائب والمحاسبة"
    },
    "category": "accounting",
    "owner": "Rekan Ahmad",
    "phone": "0780 617 8491",
    "whatsapp": "0780 617 8491",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 5,
    "reviews": 59,
    "verified": false
  },
  {
    "id": 197,
    "name": {
      "en": "Rebaz Accounting Office",
      "ku": "ڕێباز ئۆفیسی ژمێریاری",
      "ar": "ڕێباز مكتب محاسبة"
    },
    "category": "accounting",
    "owner": "Peshraw Sultan",
    "phone": "0781 392 9793",
    "whatsapp": "0781 392 9793",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 3.6,
    "reviews": 31,
    "verified": false
  },
  {
    "id": 198,
    "name": {
      "en": "Chnur Tax & Accounting Services",
      "ku": "چنوور خزمەتگوزاری باج و ژمێریاری",
      "ar": "چنوور خدمات الضرائب والمحاسبة"
    },
    "category": "accounting",
    "owner": "Shene Hama",
    "phone": "0750 510 1838",
    "whatsapp": "0750 510 1838",
    "address": {
      "en": "Gulan Street, Sulaymaniyah",
      "ku": "شەقامی گوڵان، سلێمانی",
      "ar": "شەقامی گوڵان، السليمانية"
    },
    "rating": 4.4,
    "reviews": 53,
    "verified": false
  },
  {
    "id": 199,
    "name": {
      "en": "Peshraw Accounting Office",
      "ku": "پێشڕەو ئۆفیسی ژمێریاری",
      "ar": "پێشڕەو مكتب محاسبة"
    },
    "category": "accounting",
    "owner": "Ranj Sheikhani",
    "phone": "0773 945 2946",
    "whatsapp": "0773 945 2946",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 3.8,
    "reviews": 28,
    "verified": false
  },
  {
    "id": 200,
    "name": {
      "en": "Beston Tax & Accounting Services",
      "ku": "بیستوون خزمەتگوزاری باج و ژمێریاری",
      "ar": "بیستوون خدمات الضرائب والمحاسبة"
    },
    "category": "accounting",
    "owner": "Dilshad Rashid",
    "phone": "0771 716 9341",
    "whatsapp": "0771 716 9341",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 14,
    "verified": true
  },
  {
    "id": 201,
    "name": {
      "en": "Shvan Real Estate Group",
      "ku": "شوان گروپی خانووبەرە",
      "ar": "شوان مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Sherko Sultan",
    "phone": "0781 252 9446",
    "whatsapp": "0781 252 9446",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 3.8,
    "reviews": 160,
    "verified": true
  },
  {
    "id": 202,
    "name": {
      "en": "Ranj Real Estate Group",
      "ku": "ڕەنج گروپی خانووبەرە",
      "ar": "ڕەنج مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Chnur Baban",
    "phone": "0775 619 9351",
    "whatsapp": "0775 619 9351",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.3,
    "reviews": 148,
    "verified": true
  },
  {
    "id": 203,
    "name": {
      "en": "Newroz Real Estate Office",
      "ku": "نەورۆز ئۆفیسی خانووبەرە",
      "ar": "نەورۆز مكتب عقاري"
    },
    "category": "realestate",
    "owner": "Bakhtiar Sofi",
    "phone": "0780 697 6040",
    "whatsapp": "0780 697 6040",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.7,
    "reviews": 180,
    "verified": false
  },
  {
    "id": 204,
    "name": {
      "en": "Shorsh Property Agency",
      "ku": "شۆڕش ئاژانسی خانووبەرە",
      "ar": "شۆڕش وكالة عقارية"
    },
    "category": "realestate",
    "owner": "Hawre Zangana",
    "phone": "0771 838 1841",
    "whatsapp": "0771 838 1841",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.4,
    "reviews": 47,
    "verified": false
  },
  {
    "id": 205,
    "name": {
      "en": "Chnur Real Estate Group",
      "ku": "چنوور گروپی خانووبەرە",
      "ar": "چنوور مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Shene Hama",
    "phone": "0771 132 2800",
    "whatsapp": "0771 132 2800",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 3.9,
    "reviews": 116,
    "verified": true
  },
  {
    "id": 206,
    "name": {
      "en": "Shvan Property Agency",
      "ku": "شوان ئاژانسی خانووبەرە",
      "ar": "شوان وكالة عقارية"
    },
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0781 993 2020",
    "whatsapp": "0781 993 2020",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.6,
    "reviews": 136,
    "verified": true
  },
  {
    "id": 207,
    "name": {
      "en": "Sherko Real Estate Group",
      "ku": "شێرکۆ گروپی خانووبەرە",
      "ar": "شێرکۆ مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Rekan Sheikhani",
    "phone": "0775 277 8531",
    "whatsapp": "0775 277 8531",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.9,
    "reviews": 91,
    "verified": false
  },
  {
    "id": 208,
    "name": {
      "en": "Nazdar Real Estate Group",
      "ku": "نازدار گروپی خانووبەرە",
      "ar": "نازدار مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Nazdar Jaza",
    "phone": "0781 296 5038",
    "whatsapp": "0781 296 5038",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4,
    "reviews": 80,
    "verified": true
  },
  {
    "id": 209,
    "name": {
      "en": "Peshraw Property Agency",
      "ku": "پێشڕەو ئاژانسی خانووبەرە",
      "ar": "پێشڕەو وكالة عقارية"
    },
    "category": "realestate",
    "owner": "Snur Qadir",
    "phone": "0775 591 6714",
    "whatsapp": "0775 591 6714",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4.4,
    "reviews": 74,
    "verified": true
  },
  {
    "id": 210,
    "name": {
      "en": "Awat Real Estate Group",
      "ku": "ئاوات گروپی خانووبەرە",
      "ar": "ئاوات مجموعة عقارية"
    },
    "category": "realestate",
    "owner": "Dilshad Hama",
    "phone": "0775 891 3399",
    "whatsapp": "0775 891 3399",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4,
    "reviews": 77,
    "verified": false
  },
  {
    "id": 211,
    "name": {
      "en": "Hemin IT Solutions",
      "ku": "هێمن چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "هێمن حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Payam Mahmud",
    "phone": "0781 319 4310",
    "whatsapp": "0781 319 4310",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 73,
    "verified": false
  },
  {
    "id": 212,
    "name": {
      "en": "Snur IT Solutions",
      "ku": "سنوور چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "سنوور حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Shvan Rasul",
    "phone": "0771 348 1831",
    "whatsapp": "0771 348 1831",
    "address": {
      "en": "Sarshaqam, Sulaymaniyah",
      "ku": "سەرشەقام، سلێمانی",
      "ar": "سەرشەقام، السليمانية"
    },
    "rating": 4.5,
    "reviews": 139,
    "verified": true
  },
  {
    "id": 213,
    "name": {
      "en": "Bnar Computer Repair Center",
      "ku": "بنار ناوەندی چاککردنەوەی کۆمپیوتەر",
      "ar": "بنار مركز صيانة الحاسوب"
    },
    "category": "it-repair",
    "owner": "Aram Aziz",
    "phone": "0781 202 3252",
    "whatsapp": "0781 202 3252",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 3.6,
    "reviews": 144,
    "verified": false
  },
  {
    "id": 214,
    "name": {
      "en": "Diyar IT Solutions",
      "ku": "دیار چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "دیار حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Halgurd Sultan",
    "phone": "0771 874 5706",
    "whatsapp": "0771 874 5706",
    "address": {
      "en": "Chwarbakh, Sulaymaniyah",
      "ku": "چوارباخ، سلێمانی",
      "ar": "چوارباخ، السليمانية"
    },
    "rating": 4,
    "reviews": 169,
    "verified": true
  },
  {
    "id": 215,
    "name": {
      "en": "Shene Computer Repair Center",
      "ku": "شێنە ناوەندی چاککردنەوەی کۆمپیوتەر",
      "ar": "شێنە مركز صيانة الحاسوب"
    },
    "category": "it-repair",
    "owner": "Halgurd Zangana",
    "phone": "0750 279 7846",
    "whatsapp": "0750 279 7846",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 49,
    "verified": false
  },
  {
    "id": 216,
    "name": {
      "en": "Rebaz IT Solutions",
      "ku": "ڕێباز چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "ڕێباز حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Beston Sultan",
    "phone": "0773 997 1613",
    "whatsapp": "0773 997 1613",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 3.6,
    "reviews": 149,
    "verified": false
  },
  {
    "id": 217,
    "name": {
      "en": "Payam IT Solutions",
      "ku": "پەیام چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "پەیام حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Peshraw Mahmud",
    "phone": "0781 237 9261",
    "whatsapp": "0781 237 9261",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.3,
    "reviews": 53,
    "verified": false
  },
  {
    "id": 218,
    "name": {
      "en": "Sherko Computer Repair Center",
      "ku": "شێرکۆ ناوەندی چاککردنەوەی کۆمپیوتەر",
      "ar": "شێرکۆ مركز صيانة الحاسوب"
    },
    "category": "it-repair",
    "owner": "Chnur Mahmud",
    "phone": "0770 114 6523",
    "whatsapp": "0770 114 6523",
    "address": {
      "en": "Bakhtiary Town, Sulaymaniyah",
      "ku": "شاری بەختیاری، سلێمانی",
      "ar": "شاری بەختیاری، السليمانية"
    },
    "rating": 4.7,
    "reviews": 149,
    "verified": false
  },
  {
    "id": 219,
    "name": {
      "en": "Karwan Computer Repair Center",
      "ku": "کاروان ناوەندی چاککردنەوەی کۆمپیوتەر",
      "ar": "کاروان مركز صيانة الحاسوب"
    },
    "category": "it-repair",
    "owner": "Shorsh Hama",
    "phone": "0775 188 7567",
    "whatsapp": "0775 188 7567",
    "address": {
      "en": "Iskan, Sulaymaniyah",
      "ku": "ئیسکان، سلێمانی",
      "ar": "ئیسکان، السليمانية"
    },
    "rating": 4.5,
    "reviews": 51,
    "verified": false
  },
  {
    "id": 220,
    "name": {
      "en": "Rekan IT Solutions",
      "ku": "ڕێکان چارەسەری تەکنەلۆجیای زانیاری",
      "ar": "ڕێکان حلول تقنية المعلومات"
    },
    "category": "it-repair",
    "owner": "Payam Salih",
    "phone": "0773 492 4858",
    "whatsapp": "0773 492 4858",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 4.2,
    "reviews": 72,
    "verified": false
  },
  {
    "id": 221,
    "name": {
      "en": "Peshraw Occasions Planner",
      "ku": "پێشڕەو ڕێکخەری بۆنەکان",
      "ar": "پێشڕەو منظم مناسبات"
    },
    "category": "events",
    "owner": "Chnur Zangana",
    "phone": "0773 769 6890",
    "whatsapp": "0773 769 6890",
    "address": {
      "en": "Sarchinar, Sulaymaniyah",
      "ku": "سەرچنار، سلێمانی",
      "ar": "سەرچنار، السليمانية"
    },
    "rating": 4.6,
    "reviews": 19,
    "verified": false
  },
  {
    "id": 222,
    "name": {
      "en": "Sardar Weddings & Events",
      "ku": "سەردار زەماوەند و بۆنەکان",
      "ar": "سەردار أفراح ومناسبات"
    },
    "category": "events",
    "owner": "Diyar Hama",
    "phone": "0773 806 2923",
    "whatsapp": "0773 806 2923",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 4.5,
    "reviews": 79,
    "verified": false
  },
  {
    "id": 223,
    "name": {
      "en": "Bnar Event Planning",
      "ku": "بنار پلاندانانی بۆنە",
      "ar": "بنار تنظيم الفعاليات"
    },
    "category": "events",
    "owner": "Shvan Sultan",
    "phone": "0781 865 7121",
    "whatsapp": "0781 865 7121",
    "address": {
      "en": "Rapareen, Sulaymaniyah",
      "ku": "ڕاپەڕین، سلێمانی",
      "ar": "ڕاپەڕین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 144,
    "verified": false
  },
  {
    "id": 224,
    "name": {
      "en": "Shene Occasions Planner",
      "ku": "شێنە ڕێکخەری بۆنەکان",
      "ar": "شێنە منظم مناسبات"
    },
    "category": "events",
    "owner": "Beston Qadir",
    "phone": "0751 638 8319",
    "whatsapp": "0751 638 8319",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 4.3,
    "reviews": 96,
    "verified": true
  },
  {
    "id": 225,
    "name": {
      "en": "Awat Event Planning",
      "ku": "ئاوات پلاندانانی بۆنە",
      "ar": "ئاوات تنظيم الفعاليات"
    },
    "category": "events",
    "owner": "Rebaz Barzinji",
    "phone": "0771 686 9792",
    "whatsapp": "0771 686 9792",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 3.8,
    "reviews": 87,
    "verified": false
  },
  {
    "id": 226,
    "name": {
      "en": "Sardar Event Planning",
      "ku": "سەردار پلاندانانی بۆنە",
      "ar": "سەردار تنظيم الفعاليات"
    },
    "category": "events",
    "owner": "Nazdar Qadir",
    "phone": "0781 193 9361",
    "whatsapp": "0781 193 9361",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 4.2,
    "reviews": 18,
    "verified": false
  },
  {
    "id": 227,
    "name": {
      "en": "Twana Weddings & Events",
      "ku": "توانا زەماوەند و بۆنەکان",
      "ar": "توانا أفراح ومناسبات"
    },
    "category": "events",
    "owner": "Sardar Zangana",
    "phone": "0781 788 6049",
    "whatsapp": "0781 788 6049",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.6,
    "reviews": 105,
    "verified": true
  },
  {
    "id": 228,
    "name": {
      "en": "Kawa Occasions Planner",
      "ku": "کاوا ڕێکخەری بۆنەکان",
      "ar": "کاوا منظم مناسبات"
    },
    "category": "events",
    "owner": "Karwan Zangana",
    "phone": "0750 533 6644",
    "whatsapp": "0750 533 6644",
    "address": {
      "en": "Malik Mahmud Ring Road, Sulaymaniyah",
      "ku": "ئاڕاستەی بازنەیی مەلیک مەحمود، سلێمانی",
      "ar": "ئاڕاستەی بازنەیی مەلیک مەحمود، السليمانية"
    },
    "rating": 4.6,
    "reviews": 142,
    "verified": false
  },
  {
    "id": 229,
    "name": {
      "en": "Payam Event Planning",
      "ku": "پەیام پلاندانانی بۆنە",
      "ar": "پەیام تنظيم الفعاليات"
    },
    "category": "events",
    "owner": "Payam Sultan",
    "phone": "0773 518 3948",
    "whatsapp": "0773 518 3948",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.7,
    "reviews": 168,
    "verified": false
  },
  {
    "id": 230,
    "name": {
      "en": "Halgurd Weddings & Events",
      "ku": "هەڵگورد زەماوەند و بۆنەکان",
      "ar": "هەڵگورد أفراح ومناسبات"
    },
    "category": "events",
    "owner": "Bakhtiar Hama",
    "phone": "0780 484 2314",
    "whatsapp": "0780 484 2314",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.6,
    "reviews": 173,
    "verified": false
  },
  {
    "id": 231,
    "name": {
      "en": "Shvan Iron & Steel Works",
      "ku": "شوان کاری ئاسن و پۆلا",
      "ar": "شوان أعمال الحديد والصلب"
    },
    "category": "metalwork",
    "owner": "Goran Rashid",
    "phone": "0770 650 7439",
    "whatsapp": "0770 650 7439",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.3,
    "reviews": 61,
    "verified": false
  },
  {
    "id": 232,
    "name": {
      "en": "Shene Blacksmith Workshop",
      "ku": "شێنە کارگەی ئاسنگەری",
      "ar": "شێنە ورشة حدادة"
    },
    "category": "metalwork",
    "owner": "Peshraw Mahmud",
    "phone": "0780 644 7214",
    "whatsapp": "0780 644 7214",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.8,
    "reviews": 67,
    "verified": false
  },
  {
    "id": 233,
    "name": {
      "en": "Shvan Metal Works",
      "ku": "شوان کاری فلز",
      "ar": "شوان أعمال معدنية"
    },
    "category": "metalwork",
    "owner": "Karwan Rasul",
    "phone": "0780 729 1256",
    "whatsapp": "0780 729 1256",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 3.9,
    "reviews": 21,
    "verified": true
  },
  {
    "id": 234,
    "name": {
      "en": "Rebaz Metal Works",
      "ku": "ڕێباز کاری فلز",
      "ar": "ڕێباز أعمال معدنية"
    },
    "category": "metalwork",
    "owner": "Shorsh Hussein",
    "phone": "0750 511 8191",
    "whatsapp": "0750 511 8191",
    "address": {
      "en": "Andazyari, Sulaymaniyah",
      "ku": "ئەندازیاری، سلێمانی",
      "ar": "ئەندازیاری، السليمانية"
    },
    "rating": 3.9,
    "reviews": 59,
    "verified": false
  },
  {
    "id": 235,
    "name": {
      "en": "Peshraw Blacksmith Workshop",
      "ku": "پێشڕەو کارگەی ئاسنگەری",
      "ar": "پێشڕەو ورشة حدادة"
    },
    "category": "metalwork",
    "owner": "Newroz Zangana",
    "phone": "0775 342 5944",
    "whatsapp": "0775 342 5944",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4.8,
    "reviews": 173,
    "verified": false
  },
  {
    "id": 236,
    "name": {
      "en": "Zana Metal Works",
      "ku": "زانا کاری فلز",
      "ar": "زانا أعمال معدنية"
    },
    "category": "metalwork",
    "owner": "Hawre Hussein",
    "phone": "0770 741 7999",
    "whatsapp": "0770 741 7999",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.4,
    "reviews": 16,
    "verified": false
  },
  {
    "id": 237,
    "name": {
      "en": "Halgurd Iron & Steel Works",
      "ku": "هەڵگورد کاری ئاسن و پۆلا",
      "ar": "هەڵگورد أعمال الحديد والصلب"
    },
    "category": "metalwork",
    "owner": "Ranj Sheikhani",
    "phone": "0780 518 3444",
    "whatsapp": "0780 518 3444",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 4,
    "reviews": 51,
    "verified": false
  },
  {
    "id": 238,
    "name": {
      "en": "Rekan Blacksmith Workshop",
      "ku": "ڕێکان کارگەی ئاسنگەری",
      "ar": "ڕێکان ورشة حدادة"
    },
    "category": "metalwork",
    "owner": "Goran Salih",
    "phone": "0770 925 8586",
    "whatsapp": "0770 925 8586",
    "address": {
      "en": "Ashty, Sulaymaniyah",
      "ku": "ئاشتی، سلێمانی",
      "ar": "ئاشتی، السليمانية"
    },
    "rating": 4.9,
    "reviews": 147,
    "verified": false
  },
  {
    "id": 239,
    "name": {
      "en": "Zana Iron & Steel Works",
      "ku": "زانا کاری ئاسن و پۆلا",
      "ar": "زانا أعمال الحديد والصلب"
    },
    "category": "metalwork",
    "owner": "Twana Faraj",
    "phone": "0771 361 4331",
    "whatsapp": "0771 361 4331",
    "address": {
      "en": "Kurdistan Street, Sulaymaniyah",
      "ku": "شەقامی کوردستان، سلێمانی",
      "ar": "شەقامی کوردستان، السليمانية"
    },
    "rating": 4.1,
    "reviews": 24,
    "verified": false
  },
  {
    "id": 240,
    "name": {
      "en": "Goran Metal Works",
      "ku": "گۆران کاری فلز",
      "ar": "گۆران أعمال معدنية"
    },
    "category": "metalwork",
    "owner": "Hemin Barzinji",
    "phone": "0750 374 7179",
    "whatsapp": "0750 374 7179",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 4.5,
    "reviews": 158,
    "verified": true
  },
  {
    "id": 241,
    "name": {
      "en": "Hemin Welding Workshop",
      "ku": "هێمن کارگەی پاشکۆکاری",
      "ar": "هێمن ورشة لحام"
    },
    "category": "welding",
    "owner": "Beston Zangana",
    "phone": "0771 590 4422",
    "whatsapp": "0771 590 4422",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.8,
    "reviews": 89,
    "verified": true
  },
  {
    "id": 242,
    "name": {
      "en": "Payam Welding Workshop",
      "ku": "پەیام کارگەی پاشکۆکاری",
      "ar": "پەیام ورشة لحام"
    },
    "category": "welding",
    "owner": "Karwan Qadir",
    "phone": "0781 348 4350",
    "whatsapp": "0781 348 4350",
    "address": {
      "en": "Goizha, Sulaymaniyah",
      "ku": "گۆیژە، سلێمانی",
      "ar": "گۆیژە، السليمانية"
    },
    "rating": 4.2,
    "reviews": 65,
    "verified": false
  },
  {
    "id": 243,
    "name": {
      "en": "Shene Welding & Fabrication",
      "ku": "شێنە پاشکۆکاری و دروستکردن",
      "ar": "شێنە لحام وتصنيع"
    },
    "category": "welding",
    "owner": "Ranj Mahmud",
    "phone": "0775 415 5285",
    "whatsapp": "0775 415 5285",
    "address": {
      "en": "Empire Area, Sulaymaniyah",
      "ku": "گەڕەکی ئیمپایەر، سلێمانی",
      "ar": "گەڕەکی ئیمپایەر، السليمانية"
    },
    "rating": 4.1,
    "reviews": 131,
    "verified": false
  },
  {
    "id": 244,
    "name": {
      "en": "Beston Steel Welding Services",
      "ku": "بیستوون خزمەتگوزاری پاشکۆکاری پۆلا",
      "ar": "بیستوون خدمات لحام الصلب"
    },
    "category": "welding",
    "owner": "Rekan Sofi",
    "phone": "0775 420 7781",
    "whatsapp": "0775 420 7781",
    "address": {
      "en": "Zargata, Sulaymaniyah",
      "ku": "زەرگەتە، سلێمانی",
      "ar": "زەرگەتە، السليمانية"
    },
    "rating": 3.7,
    "reviews": 60,
    "verified": false
  },
  {
    "id": 245,
    "name": {
      "en": "Kawa Welding & Fabrication",
      "ku": "کاوا پاشکۆکاری و دروستکردن",
      "ar": "کاوا لحام وتصنيع"
    },
    "category": "welding",
    "owner": "Dilshad Zangana",
    "phone": "0780 402 3497",
    "whatsapp": "0780 402 3497",
    "address": {
      "en": "Raparin, Sulaymaniyah",
      "ku": "ڕاپەرین، سلێمانی",
      "ar": "ڕاپەرین، السليمانية"
    },
    "rating": 3.9,
    "reviews": 62,
    "verified": false
  },
  {
    "id": 246,
    "name": {
      "en": "Newroz Welding Workshop",
      "ku": "نەورۆز کارگەی پاشکۆکاری",
      "ar": "نەورۆز ورشة لحام"
    },
    "category": "welding",
    "owner": "Rekan Barzinji",
    "phone": "0773 881 9005",
    "whatsapp": "0773 881 9005",
    "address": {
      "en": "Qirga, Sulaymaniyah",
      "ku": "قیرغە، سلێمانی",
      "ar": "قیرغە، السليمانية"
    },
    "rating": 5,
    "reviews": 168,
    "verified": false
  },
  {
    "id": 247,
    "name": {
      "en": "Sardar Welding Workshop",
      "ku": "سەردار کارگەی پاشکۆکاری",
      "ar": "سەردار ورشة لحام"
    },
    "category": "welding",
    "owner": "Chnur Rashid",
    "phone": "0770 837 9954",
    "whatsapp": "0770 837 9954",
    "address": {
      "en": "Salim Street, Sulaymaniyah",
      "ku": "شەقامی سالم، سلێمانی",
      "ar": "شەقامی سالم، السليمانية"
    },
    "rating": 4.3,
    "reviews": 142,
    "verified": false
  },
  {
    "id": 248,
    "name": {
      "en": "Rebaz Steel Welding Services",
      "ku": "ڕێباز خزمەتگوزاری پاشکۆکاری پۆلا",
      "ar": "ڕێباز خدمات لحام الصلب"
    },
    "category": "welding",
    "owner": "Rebaz Karim",
    "phone": "0750 522 3252",
    "whatsapp": "0750 522 3252",
    "address": {
      "en": "Bakhtiary, Sulaymaniyah",
      "ku": "بەختیاری، سلێمانی",
      "ar": "بەختیاری، السليمانية"
    },
    "rating": 4.8,
    "reviews": 63,
    "verified": true
  },
  {
    "id": 249,
    "name": {
      "en": "Shvan Welding Workshop",
      "ku": "شوان کارگەی پاشکۆکاری",
      "ar": "شوان ورشة لحام"
    },
    "category": "welding",
    "owner": "Karwan Sheikhani",
    "phone": "0775 161 8916",
    "whatsapp": "0775 161 8916",
    "address": {
      "en": "Dwezakh, Sulaymaniyah",
      "ku": "دوێزاخ، سلێمانی",
      "ar": "دوێزاخ، السليمانية"
    },
    "rating": 4.5,
    "reviews": 8,
    "verified": true
  },
  {
    "id": 250,
    "name": {
      "en": "Dilshad Welding & Fabrication",
      "ku": "دڵشاد پاشکۆکاری و دروستکردن",
      "ar": "دڵشاد لحام وتصنيع"
    },
    "category": "welding",
    "owner": "Kawa Ahmad",
    "phone": "0773 648 5697",
    "whatsapp": "0773 648 5697",
    "address": {
      "en": "Shorsh Street, Sulaymaniyah",
      "ku": "شەقامی شۆڕش، سلێمانی",
      "ar": "شەقامی شۆڕش، السليمانية"
    },
    "rating": 3.6,
    "reviews": 176,
    "verified": false
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
    case "back": return <svg {...common} className="bm-icon-flip"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
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
    case "chevron": return <svg {...common} className="bm-icon-flip"><polyline points="9 6 15 12 9 18"/></svg>;
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

  const cityObj = CITIES.find((c) => c.id === city);
  const cityName = cityObj ? cityNameOf(cityObj, language) : city;
  const langName = LANGUAGES.find((l) => l.code === language)?.name || language;
  const dir = dirOf(language);

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
      bizNameOf(b, language).toLowerCase().includes(q) ||
      bizNameOf(b, "en").toLowerCase().includes(q) ||
      catNameOf(categories.find((c) => c.id === b.category), language).toLowerCase().includes(q) ||
      bizAddressOf(b, language).toLowerCase().includes(q) ||
      bizAddressOf(b, "en").toLowerCase().includes(q)
    );
  }, [businesses, categories, query, language]);

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
      <div style={styles.app} className="bm-glass-root" dir={dir}>
        <style>{globalCss}</style>
        <BackgroundField />
        <Intro onEnter={() => setOnboardingStep("language")} lang={language} />
      </div>
    );
  }

  if (onboardingStep === "language") {
    return (
      <div style={styles.app} className="bm-glass-root" dir={dirOf(language)}>
        <style>{globalCss}</style>
        <BackgroundField />
        <OnboardingLanguage language={language} onSelect={setLanguage} onContinue={continueFromLanguage} />
      </div>
    );
  }

  if (onboardingStep === "city") {
    return (
      <div style={styles.app} className="bm-glass-root" dir={dir}>
        <style>{globalCss}</style>
        <BackgroundField />
        <OnboardingCity city={city} onSelect={setCity} onContinue={finishOnboarding} onBack={backToLanguage} language={language} />
      </div>
    );
  }

  return (
    <div style={styles.app} className="bm-glass-root" dir={dir}>
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
            language={language}
          />
        )}

        {view === null && activeTab === "favorites" && (
          <Favorites
            businesses={favoriteBusinesses}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            openProfile={openProfile}
            language={language}
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
            language={language}
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
          language={language}
        />
      )}

      {view === "profile" && selectedBiz && (
        <Profile
          biz={selectedBiz}
          categories={categories}
          isFavorite={favorites.has(selectedBiz.id)}
          onToggleFavorite={() => toggleFavorite(selectedBiz.id)}
          onBack={() => setView(selectedCategory ? "category" : null)}
          language={language}
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
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} favoriteCount={favorites.size} language={language} />
      )}
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, favoriteCount, language }) {
  const tabs = [
    { id: "search", label: t("navSearch", language), icon: "search" },
    { id: "favorites", label: t("navFavorites", language), icon: "heart" },
    { id: "account", label: t("navAccount", language), icon: "user" },
  ];
  return (
    <div className="bm-nav-glass bm-bottom-nav">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="bm-nav-btn"
            style={active ? { ...styles.navBtn, ...styles.navBtnActive } : styles.navBtn}
          >
            <span style={styles.navIconWrap}>
              <Icon name={tab.icon} size={19} />
              {tab.id === "favorites" && favoriteCount > 0 && (
                <span style={styles.navBadge}>{digits(favoriteCount, language)}</span>
              )}
            </span>
            <span style={styles.navLabel}>{tab.label}</span>
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

      <h1 style={styles.onboardH1}>{t("chooseLanguage", language)}</h1>
      <p style={styles.onboardSub}>{t("changeLaterAccount", language)}</p>

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

      <button style={styles.cta} onClick={onContinue}>{t("continueBtn", language)}</button>
    </div>
  );
}

/* ---------------- ONBOARDING: CITY ---------------- */

function OnboardingCity({ city, onSelect, onContinue, onBack, language }) {
  return (
    <div style={styles.onboardWrap}>
      <div style={styles.onboardSteps}>
        <span style={{ ...styles.onboardStepDot, ...styles.onboardStepDotActive }} />
        <span style={{ ...styles.onboardStepDot, ...styles.onboardStepDotActive }} />
      </div>

      <div style={styles.onboardBackRow}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label={t("back", language)}>
          <Icon name="back" size={16} />
        </button>
        <Logo width={84} />
      </div>

      <h1 style={styles.onboardH1}>{t("whereAreYou", language)}</h1>
      <p style={styles.onboardSub}>{t("nearbyFirst", language)}</p>

      <div style={styles.onboardBody}>
        <div style={styles.choiceList}>
          {CITIES.map((c, i) => {
            const active = city === c.id;
            const sub = c.live ? `${digits(c.count, language)} ${t("businessesLabel", language)}` : t("comingSoon", language);
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
                  <b style={styles.choiceName}>{cityNameOf(c, language)}</b>
                  <small style={styles.choiceSub}>{sub}</small>
                </span>
                {c.live
                  ? <span style={active ? { ...styles.tick, ...styles.tickActive } : styles.tick} />
                  : <span style={styles.soonChip}>{t("soonChip", language)}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <button style={styles.cta} onClick={onContinue}>{t("startExploring", language)}</button>
    </div>
  );
}

/* ---------------- HOME ---------------- */

function Home({ query, setQuery, searchResults, categoryCounts, categories, businesses, favorites, onToggleFavorite, openProfile, openCategory, cityName, onChangeCity, language }) {
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

      <h2 style={styles.homeH2} className="bm-hero-title">{t("homeHeadline", language)}</h2>
      <p style={styles.heroSubtitle} className="bm-hero-sub">
        {t("homeSubtitle", language, { count: digits(businessCount, language), n: digits(categories.length, language) })}
      </p>

      <div
        style={{ ...styles.searchWrap, ...(focused ? styles.searchWrapFocus : {}) }}
        className="bm-glass bm-search"
      >
        <Icon name="search" size={17} />
        <input
          style={styles.searchInput}
          placeholder={t("searchPlaceholder", language)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>

      {isSearching ? (
        <>
          <div style={styles.resultsMeta} className="bm-meta" key={`meta-${query}`}>
            {t("resultsFor", language, { n: digits(searchResults.length, language), q: query })}
          </div>
          <div style={styles.list} key={`grid-${query}`}>
            {searchResults.map((b, i) => (
              <Card
                key={b.id} biz={b} categories={categories} index={i}
                isFavorite={favorites.has(b.id)}
                onToggleFavorite={() => onToggleFavorite(b.id)}
                onClick={() => openProfile(b)}
                language={language}
              />
            ))}
            {searchResults.length === 0 && (
              <div style={styles.empty} className="bm-empty">
                <span className="bm-orbi" style={{ width: 84, height: 84 }}><Icon name="search" size={30} /></span>
                {t("noResults", language)}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div style={styles.sectionTitle} className="bm-meta">{t("categoriesLabel", language)}</div>
          <div style={styles.categoryGrid}>
            {categories.map((c, i) => (
              <CategoryTile
                key={c.id}
                category={c}
                count={categoryCounts[c.id] || 0}
                index={i}
                onClick={() => openCategory(c.id)}
                language={language}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CategoryTile({ category, count, index, onClick, language }) {
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
        <div style={styles.categoryTileName}>{catNameOf(category, language)}</div>
        <div style={styles.categoryTileCount}>{t("placesCount", language, { n: digits(count, language) })}</div>
      </div>
    </button>
  );
}

function CategoryView({ categoryId, categories, businesses, favorites, onToggleFavorite, openProfile, onBack, cityName, language }) {
  const category = categories.find((c) => c.id === categoryId);
  const verifiedCount = businesses.filter((b) => b.verified).length;
  return (
    <div style={styles.screenPad}>
      <div style={styles.topbar}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label={t("back", language)}>
          <Icon name="back" size={16} />
        </button>
        <span style={styles.cityPill}><Icon name="pin" size={14} /> {cityName}</span>
      </div>

      <div style={styles.categoryViewHeader} className="bm-bizcard">
        <span className="bm-orbi" style={{ width: 72, height: 72 }}>
          <Icon name={category.icon} size={30} />
        </span>
        <div>
          <h1 style={styles.categoryViewTitle}>{catNameOf(category, language)}</h1>
          <div style={styles.categoryViewSub}>{t("placesVerifiedCount", language, { n: digits(businesses.length, language), m: digits(verifiedCount, language) })}</div>
        </div>
      </div>

      <div style={styles.list}>
        {businesses.map((b, i) => (
          <Card
            key={b.id} biz={b} categories={categories} index={i}
            isFavorite={favorites.has(b.id)}
            onToggleFavorite={() => onToggleFavorite(b.id)}
            onClick={() => openProfile(b)}
            language={language}
          />
        ))}
      </div>
    </div>
  );
}

function Card({ biz, categories, index, isFavorite, onToggleFavorite, onClick, language }) {
  const cat = categories.find((c) => c.id === biz.category);
  return (
    <button
      style={{ "--i": index % 20 }}
      className="bm-card bm-biz-glass"
      onClick={onClick}
    >
      <span className="bm-orbi" style={{ width: 48, height: 48 }}>
        <Logo width={26} />
      </span>
      <span style={{ flex: 1, minWidth: 0, display: "grid", gap: 4, textAlign: "start" }}>
        <span style={styles.cardNameRow}>
          <span style={styles.cardName}>{bizNameOf(biz, language)}</span>
          {biz.verified && (
            <span style={styles.verifiedBadge} className="bm-verified" title={t("verified", language)}>
              <Icon name="check" size={12} />
            </span>
          )}
        </span>
        <span style={styles.cardCat}>{catNameOf(cat, language)} · {bizAddressShortOf(biz, language)}</span>
        <span style={styles.rating}><Icon name="star" size={13} /> {digits(biz.rating, language)} <span style={styles.reviewCount}>({digits(biz.reviews, language)})</span></span>
      </span>
      <span
        role="button"
        style={{ ...styles.favBtn, ...(isFavorite ? styles.favBtnActive : {}) }}
        className="bm-fav-btn"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        title={isFavorite ? t("removeFavorite", language) : t("addFavorite", language)}
      >
        <Icon name="heart" size={16} />
      </span>
    </button>
  );
}

/* ---------------- FAVORITES ---------------- */

function Favorites({ businesses, categories, favorites, onToggleFavorite, openProfile, language }) {
  return (
    <div style={styles.screenPad}>
      <div className="bm-meta">
        <h1 style={styles.onboardH1}>{t("favoritesTitle", language)}</h1>
        <p style={styles.onboardSub}>{t("favoritesSub", language)}</p>
      </div>

      {businesses.length === 0 ? (
        <div style={styles.empty} className="bm-empty">
          <span className="bm-orbi" style={{ width: 84, height: 84 }}><Icon name="heart" size={30} /></span>
          <b style={{ color: "#f4f6f7" }}>{t("noFavoritesTitle", language)}</b>
          {t("noFavoritesSub", language)}
        </div>
      ) : (
        <div style={styles.list}>
          {businesses.map((b, i) => (
            <Card
              key={b.id} biz={b} categories={categories} index={i}
              isFavorite={favorites.has(b.id)}
              onToggleFavorite={() => onToggleFavorite(b.id)}
              onClick={() => openProfile(b)}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- ACCOUNT ---------------- */

function Account({ businessCount, categoryCount, favoriteCount, cityName, langName, goAdmin, goRegister, goReplayIntro, goChangeLanguage, goChangeCity, language }) {
  const menu = [
    { icon: "store", title: t("listYourBusiness", language), sub: t("listYourBusinessSub", language), onClick: goRegister },
    { icon: "shield", title: t("adminPanel", language), sub: t("adminPanelSub", language), onClick: goAdmin },
    { icon: "globe", title: t("languageLabel", language), sub: t("languageSub", language), onClick: goChangeLanguage },
    { icon: "pin", title: t("cityLabel", language), sub: t("citySub", language), onClick: goChangeCity },
    { icon: "play", title: t("replayIntroLabel", language), sub: t("replayIntroSub", language), onClick: goReplayIntro },
  ];
  return (
    <div style={styles.screenPad}>
      <div style={styles.accountHero} className="bm-bizcard">
        <span className="bm-orbi" style={{ width: 72, height: 72 }}><Logo width={40} /></span>
        <div>
          <h1 style={styles.accountWelcome}>{t("welcome", language)}</h1>
          <div style={styles.accountSub}>{cityName} · {langName}</div>
        </div>
      </div>

      <div style={styles.accountStatsRow} className="bm-cascade">
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{digits(businessCount, language)}</span>
          <span style={styles.accountStatLabel}>{t("placesStat", language)}</span>
        </div>
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{digits(categoryCount, language)}</span>
          <span style={styles.accountStatLabel}>{t("categoriesStat", language)}</span>
        </div>
        <div style={styles.accountStat} className="bm-glass">
          <span style={styles.accountStatNum}>{digits(favoriteCount, language)}</span>
          <span style={styles.accountStatLabel}>{t("favoritesStat", language)}</span>
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

  const catName = catNameOf(categories.find((c) => c.id === form.category), "en") || form.category;
  const cityName = cityNameOf(CITIES.find((c) => c.id === form.city), "en") || form.city;

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
          {categories.map((c) => <option key={c.id} value={c.id}>{catNameOf(c, "en")}</option>)}
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
          {CITIES.map((c) => <option key={c.id} value={c.id}>{cityNameOf(c, "en")}</option>)}
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

function Profile({ biz, categories, isFavorite, onToggleFavorite, onBack, language }) {
  const cat = categories.find((c) => c.id === biz.category);
  const catDisplay = catNameOf(cat, language);
  const bizName = bizNameOf(biz, language);
  const bizAddress = bizAddressOf(biz, language);
  const cleanPhone = biz.phone.replace(/\s+/g, "");
  const waLink = `https://wa.me/964${cleanPhone.replace(/^0/, "")}`;
  const establishedYear = 2024 - (biz.id % 12);
  const [expanded, setExpanded] = useState(false);

  const qrSrc = buildQrSrc(biz, 200, language);
  const bizDesc = biz.description && biz.description.trim()
    ? biz.description
    : t("bizDescTemplate", language, {
        name: bizName,
        cat: language === "en" ? catDisplay.toLowerCase() : catDisplay,
        address: bizAddress,
      });

  const handleShare = async () => {
    const text = `${bizName} — ${catDisplay}\n${bizAddress}\n${biz.phone}`;
    if (navigator.share) {
      try { await navigator.share({ title: bizName, text }); } catch (e) {}
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bizAddressOf(biz, "en"))}`, "_blank");
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${bizName}\nORG:${bizName}\nTEL;TYPE=CELL:${cleanPhone}\nADR:;;${bizAddress};;;;\nNOTE:${catDisplay}\nEND:VCARD`;
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${bizName.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actions = [
    { icon: "whatsapp", label: t("whatsappLabel", language), onClick: () => window.open(waLink, "_blank") },
    { icon: "share", label: t("shareLabel", language), onClick: handleShare },
    { icon: "navigation", label: t("directionsLabel", language), onClick: handleDirections },
    { icon: "idcard", label: t("saveContactLabel", language), onClick: handleSaveContact },
  ];

  return (
    <div style={styles.profileWrap}>
      <div style={styles.profileTopBar}>
        <button style={styles.iconBtnGlass} onClick={onBack} aria-label={t("back", language)}>
          <Icon name="back" size={16} />
        </button>
        <span style={styles.profileTopTitle}>{t("serviceProfile", language)}</span>
        <button
          style={{ ...styles.iconBtnGlass, ...(isFavorite ? styles.favIconActive : {}) }}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? t("removeFavorite", language) : t("addFavorite", language)}
        >
          <Icon name="heart" size={17} />
        </button>
      </div>

      <div style={styles.bizCard} className="bm-card-glow bm-bizcard">
        <Logo width={140} glow style={{ margin: "4px auto 8px", display: "block" }} />
        <div style={styles.profileNameRow}>
          <h1 style={styles.profileName}>{bizName}</h1>
          {biz.verified && (
            <span style={styles.verifiedBadgeLg} title={t("verified", language)}>
              <Icon name="check" size={13} />
            </span>
          )}
        </div>
        <div style={styles.profileCat}>{catDisplay}</div>
        <div style={styles.rating}><Icon name="star" size={14} /> {digits(biz.rating, language)} <span style={styles.reviewCount}>· {t("reviewsCount", language, { n: digits(biz.reviews, language) })}</span></div>
      </div>

      <div style={styles.actionsRow}>
        {actions.map((a) => (
          <button key={a.label} style={styles.actionBtn} className="bm-social-btn" onClick={a.onClick}>
            <span className="bm-orbi" style={{ width: 54, height: 54 }}><Icon name={a.icon} size={20} /></span>
            {a.label}
          </button>
        ))}
      </div>

      <p style={styles.profileDesc}>{bizDesc}</p>

      <div style={styles.infoBlock} className="bm-glass">
        <div style={styles.infoRow}><Icon name="pin" size={16} /> {bizAddress}</div>
        <div style={styles.infoRow}><Icon name="phone" size={16} /> <span className="bm-ltr">{biz.phone}</span></div>
        {biz.verified && <div style={styles.infoRow}><Icon name="shield" size={16} /> {t("verifiedByBmnassa", language)}</div>}
      </div>

      <div style={styles.qrWrap} className="bm-glass">
        <img src={qrSrc} alt={`QR code for ${bizName}`} style={styles.qrImg} />
        <div>
          <div style={styles.qrTitle}>{t("digitalBusinessCard", language)}</div>
          <div style={styles.qrCaption}>{t("scanToSave", language)}</div>
        </div>
      </div>

      <button style={styles.viewFullBtn} className="bm-view-full" onClick={() => setExpanded((v) => !v)}>
        {expanded ? t("hideDetails", language) : t("viewFullProfile", language)}
      </button>

      {expanded && (
        <div style={styles.expandedBlock} className="bm-expanded bm-glass">
          <div style={styles.infoRow}><Icon name="shield" size={16} /> {t("verifiedSince", language, { year: digits(establishedYear, language) })}</div>
          <div style={styles.infoRow}><Icon name="star" size={16} /> {t("customerReviewsOn", language, { n: digits(biz.reviews, language) })}</div>
          <div style={styles.infoRow}><Icon name="grid" size={16} /> {t("categoryColon", language, { cat: catDisplay })}</div>
        </div>
      )}

      <div style={styles.ctaRow}>
        <a style={styles.ctaCall} href={`tel:${cleanPhone}`}>
          <Icon name="phone" size={16} /> {t("call", language)}
        </a>
        <a style={styles.ctaWhatsapp} href={waLink} target="_blank" rel="noreferrer">
          <Icon name="whatsapp" size={16} /> {t("whatsappLabel", language)}
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
  const startEdit = (b) => {
    const flat = { ...b, name: bizNameOf(b, "en"), address: bizAddressOf(b, "en") };
    setForm(flat);
    setEditing(flat);
  };
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
    if (count > 0 && !window.confirm(`${count} business(es) use "${catNameOf(cat, "en")}". Delete this category anyway? Those listings will stay but won't be browsable by category.`)) {
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
                <div style={styles.adminRowName}>{catNameOf(c, "en")}</div>
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
            {categories.map((c) => <option key={c.id} value={c.id}>{catNameOf(c, "en")}</option>)}
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
              <div style={styles.adminRowName}>{bizNameOf(b, "en")} {b.verified && <Icon name="shield" size={13} />}</div>
              <div style={styles.adminRowMeta}>{catNameOf(categories.find((c) => c.id === b.category), "en") || "Uncategorized"} · {b.phone}</div>
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
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Kufi+Arabic:wght@400;500;600;700;800&display=swap');
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
  .bm-glass-root[dir="rtl"] { font-family: 'Noto Kufi Arabic', 'Manrope', 'Helvetica Neue', Arial, sans-serif; }
  .bm-glass-root button, .bm-glass-root a { color: inherit; font-family: inherit; -webkit-tap-highlight-color: transparent; }
  [dir="rtl"] .bm-icon-flip { transform: scaleX(-1); }
  .bm-ltr { direction: ltr; unicode-bidi: isolate; display: inline-block; }

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
