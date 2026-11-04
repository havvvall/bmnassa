// Turns the text read from a paper card into the same fields the check form uses.
// Rules only (no AI): phones, email, website, instagram, address, company, title, name.
// Works on Latin, Arabic-script (Arabic and Sorani) and mixed text.

const DIGITS = { "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9", "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9" };

const COMPANY_WORDS = /\b(co\.?|company|ltd|llc|group|trading|restaurant|bakery|clinic|hospital|pharmacy|services?|engineering|construction|contracting|studio|store|shop|cafe|hotel|school|agency|solutions?|technology|tech|center|centre|market|factory|workshop|garage)\b|شركة|شرکەت|کۆمپانی|کۆمپانیا|مطعم|مطعەم|بەکەری|مخبز|عيادة|کلینیک|صيدلية|فارمەسی|مكتب|ئۆفیس|سەنتەر|مركز|فندق|مەطبخ/i;
const TITLE_WORDS = /\b(owner|manager|ceo|cto|director|founder|engineer|architect|doctor|dr\.?|dentist|accountant|lawyer|designer|developer|sales|partner|chef|pharmacist)\b|خاوەن|خاوين|بەڕێوەبەر|بەڕێوەبەری|ئەندازیار|پزیشک|دکتۆر|مدير|مالك|مهندس|طبيب|صاحب|مدیر|ڕێکخەر/i;
const ADDRESS_WORDS = /\b(street|st\.|road|rd\.|avenue|ave\.|building|floor|erbil|hewler|hawler|sulaymaniyah|slemani|suli|duhok|dohuk|kirkuk|baghdad|basra|mosul|iraq|kurdistan|block|district)\b|شارع|شەقام|هەولێر|هەولير|سلێمانی|سلیمانی|دهۆک|دهوک|کەرکوک|كركوك|بەغدا|بغداد|بصرة|البصرة|العراق|کوردستان|كوردستان|گەڕەک|محلة|بناية|نهج|شەقامی/i;

export function normaliseDigits(s) {
  return String(s || "").replace(/[٠-٩۰-۹]/g, (d) => DIGITS[d] || d);
}

// Iraqi numbers: 07xx xxx xxxx (mobile, 11 digits), +964 7xx xxx xxxx, 0xx landlines.
export function findPhones(text) {
  const t = normaliseDigits(text);
  const out = [];
  const re = /(\+|00)?\d(?:[ \t\-.()/]*\d){6,14}/g;
  let m;
  while ((m = re.exec(t))) {
    const plus = m[1] === "+";
    const digits = m[0].replace(/\D/g, "");
    let norm = null;
    if (/^(00|\+)?964/.test(m[0].replace(/[ \t\-.()/]/g, "")) && digits.replace(/^(00)?964/, "").length === 10) {
      norm = "+964" + digits.replace(/^(00)?964/, "");
    } else if (/^07\d{9}$/.test(digits)) {
      norm = "+964" + digits.slice(1);
    } else if (/^0\d{7,9}$/.test(digits) && !plus) {
      norm = digits;
    }
    if (norm && !out.includes(norm)) out.push(norm);
  }
  return out;
}

export function findEmail(text) {
  const m = normaliseDigits(text).match(/[A-Za-z0-9._%+\-]+@[A-Za-z0-9\-]+(\.[A-Za-z0-9\-]+)+/);
  return m ? m[0].toLowerCase() : "";
}

export function findInstagram(text) {
  const t = normaliseDigits(text);
  const url = t.match(/instagram\.com\/([A-Za-z0-9._]{2,30})/i);
  if (url) return "@" + url[1];
  const at = t.match(/(?:^|\s)@([A-Za-z0-9._]{2,30})\b/);
  return at ? "@" + at[1] : "";
}

export function findWebsite(text, email) {
  const t = normaliseDigits(text).replace(new RegExp(email ? email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "$^", "gi"), " ");
  const m = t.match(/(?:https?:\/\/)?(?:www\.)?[A-Za-z0-9\-]+(?:\.[A-Za-z0-9\-]+)*\.(?:com|net|org|iq|krd|info|co|me|app|shop|store|biz|io)(?:\/[^\s]*)?/i);
  if (!m) return "";
  const site = m[0].replace(/[,;)]+$/, "");
  return site;
}

function hasArabic(s) { return /[؀-ۿ]/.test(s); }
function hasKurdish(s) { return /[ۆێەڕڵھوۀې]|[ڕڵۆێەڤگچژپ]/.test(s); }

export function detectLanguage(text) {
  if (!hasArabic(text)) return "en";
  return hasKurdish(text) ? "ckb" : "ar";
}

// Splits the card text into clean, non-empty lines
export function splitLines(text) {
  return String(text || "").split(/\r?\n|[|·•]+/).map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length >= 2);
}

const isContact = (l) => /@|https?:|www\.|\.com|\.iq|\.krd/i.test(l) || findPhones(l).length > 0;

// Reads the fields from text. Returns the same shape the check form expects.
export function parseCardText(text) {
  const lines = splitLines(text);
  const email = findEmail(text);
  const website = findWebsite(text, email);
  const phones = findPhones(text);
  const instagram = findInstagram(text);
  const language = detectLanguage(text);

  const plain = lines.filter((l) => !isContact(l));
  const company = plain.find((l) => COMPANY_WORDS.test(l)) || "";
  const addrLine = plain.find((l) => ADDRESS_WORDS.test(l) && l !== company) || "";
  const address = addrLine;

  const titleIdx = plain.findIndex((l) => TITLE_WORDS.test(l) && l !== company);
  const title = titleIdx >= 0 ? plain[titleIdx] : "";

  // Name: the line just before the title, else the first short line that is not company or address
  let name = "";
  if (titleIdx > 0 && plain[titleIdx - 1] !== company) name = plain[titleIdx - 1];
  if (!name) {
    name = plain.find((l) => l !== company && l !== addrLine && l !== title && l.split(" ").length <= 4 && !TITLE_WORDS.test(l) && !COMPANY_WORDS.test(l) && !ADDRESS_WORDS.test(l)) || "";
  }
  const nameIsArabic = hasArabic(name);
  return {
    name: nameIsArabic ? "" : name,
    name_other: nameIsArabic ? name : "",
    company, title, phones, whatsapp: "", email, website, instagram, address, language,
  };
}

// Counts how many fields were found (used to decide if the reading is usable)
export function foundCount(fields) {
  return ["name", "company", "title", "email", "website", "address", "instagram"].filter((k) => fields[k]).length + ((fields.phones || []).length ? 1 : 0);
}
