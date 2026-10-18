// App words in English, Kurdish (Sorani) and Arabic.
// Lines marked "new" were written for slice 1 and still need a native-speaker check.

export const LANGS = [
  { id: "en", label: "English", dir: "ltr" },
  { id: "ku", label: "کوردی", dir: "rtl" },
  { id: "ar", label: "عربي", dir: "rtl" },
];

const T = {
  tagline: ["Every trusted service, one tap away", "هەموو خزمەتگوزارییەکی متمانەپێکراو، بە یەک لێدان", "كل خدمة موثوقة على بُعد لمسة"],
  region: ["Kurdistan · Iraq", "کوردستان · عێراق", "كوردستان · العراق"],
  welcome: ["Welcome to Bmnassa", "بەخێربێیت بۆ بمناسە", "أهلاً بك في بمناسة"],
  welcome_sub: ["Trusted services near you, in your language.", "خزمەتگوزاریی متمانەپێکراو لە نزیکت، بە زمانی خۆت.", "خدمات موثوقة قريبة منك، بلغتك."],
  choose_lang: ["Choose your language", "زمانەکەت هەڵبژێرە", "اختر لغتك"],
  choose_city: ["Choose your city", "شارەکەت هەڵبژێرە", "اختر مدينتك"],
  coming_soon: ["Coming soon", "بەم زووانە", "قريباً"],
  change_later: ["You can change these later in Settings.", "دواتر دەتوانیت لە ڕێکخستنەکان بیگۆڕیت.", "يمكنك تغييرها لاحقاً من الإعدادات."],
  continue: ["Continue", "بەردەوامبە", "متابعة"],

  // new
  signin_title: ["Sign in", "چوونەژوورەوە", "تسجيل الدخول"],
  signin_sub: ["Enter your email and we'll send you a 6-digit code.", "ئیمەیڵەکەت بنووسە، کۆدێکی 6 ژمارەییت بۆ دەنێرین.", "أدخل بريدك الإلكتروني وسنرسل لك رمزاً من 6 أرقام."],
  email_label: ["Email", "ئیمەیڵ", "البريد الإلكتروني"],
  email_invalid: ["Enter an email like name@gmail.com.", "ئیمەیڵێک بنووسە، وەک name@gmail.com.", "أدخل بريداً مثل name@gmail.com."],
  send_code: ["Send code", "کۆدەکە بنێرە", "أرسل الرمز"],
  privacy: ["We never share your email.", "هەرگیز ئیمەیڵەکەت بڵاو ناکەینەوە.", "لا نشارك بريدك أبداً."],
  verify_title: ["Check your email", "ئیمەیڵەکەت بپشکنە", "تحقق من بريدك"],
  enter_code: ["Enter the 6-digit code", "کۆدە 6 ژمارەییەکە بنووسە", "أدخل الرمز المكوّن من 6 أرقام"],
  sent_email: ["We sent a code to", "کۆدێکمان نارد بۆ", "أرسلنا رمزاً إلى"],
  spam_hint: ["Can't see it? Look in Spam or Promotions.", "نایبینیت؟ لە Spam یان Promotions بگەڕێ.", "لا تجده؟ ابحث في البريد المزعج (Spam) أو العروض."],
  verify: ["Verify", "پشتڕاستکردنەوە", "تأكيد"],
  resend_in: ["Send again in {s}", "دووبارە ناردن لە {s}", "إعادة الإرسال بعد {s}"],
  resend: ["Send the code again", "کۆدەکە دووبارە بنێرەوە", "أعد إرسال الرمز"],
  change: ["Change", "گۆڕین", "تغيير"],
  code_wrong: ["That code didn't work. Check it and try again, or send a new one.", "ئەم کۆدە کار ناکات. بیپشکنە و دووبارە هەوڵ بدەرەوە، یان کۆدێکی نوێ بنێرە.", "هذا الرمز لم ينجح. تحقق منه وحاول مرة أخرى، أو اطلب رمزاً جديداً."],
  send_failed: ["We couldn't send the code. Check your connection and try again.", "نەمانتوانی کۆدەکە بنێرین. ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەرەوە.", "تعذّر إرسال الرمز. تحقق من اتصالك وحاول مرة أخرى."],
  too_many: ["Too many tries. Wait a minute, then send a new code.", "هەوڵی زۆرت دا. خولەکێک چاوەڕێ بکە، پاشان کۆدێکی نوێ بنێرە.", "محاولات كثيرة. انتظر دقيقة ثم اطلب رمزاً جديداً."],
  not_ready: ["Email sign-in isn't switched on yet. The Bmnassa team is setting it up.", "چوونەژوورەوە بە ئیمەیڵ هێشتا چالاک نەکراوە. تیمی بمناسە خەریکی ڕێکخستنیەتی.", "تسجيل الدخول بالبريد غير مفعّل بعد. فريق بمناسة يعمل على إعداده."],
  name_title: ["What's your name?", "ناوت چییە؟", "ما اسمك؟"],
  name_sub: ["Your reviews and saved cards show this name.", "ئەم ناوە لەگەڵ هەڵسەنگاندن و کارتە هەڵگیراوەکانت دەردەکەوێت.", "يظهر هذا الاسم مع تقييماتك وبطاقاتك المحفوظة."],
  name_ph: ["Full name", "ناوی تەواو", "الاسم الكامل"],
  save: ["Save", "پاشەکەوتکردن", "حفظ"],
  saved: ["Saved", "پاشەکەوت کرا", "تم الحفظ"],
  save_failed: ["Couldn't save. Try again.", "پاشەکەوت نەکرا. دووبارە هەوڵ بدەرەوە.", "تعذّر الحفظ. حاول مرة أخرى."],
  account: ["Account", "هەژمار", "الحساب"],
  role_customer: ["Customer", "کڕیار", "زبون"],
  role_owner: ["Business owner", "خاوەن بزنس", "صاحب نشاط"],
  role_team: ["Bmnassa team", "تیمی بمناسە", "فريق بمناسة"],
  language: ["Language", "زمان", "اللغة"],
  city: ["City", "شار", "المدينة"],
  email: ["Email", "ئیمەیڵ", "البريد الإلكتروني"],
  phone: ["Phone", "ژمارەی مۆبایل", "رقم الهاتف"],
  edit: ["Edit", "دەستکاری", "تعديل"],
  sign_out: ["Sign out", "چوونەدەرەوە", "تسجيل الخروج"],
  next_slices: ["Search, business pages and your wallet arrive in the next updates.", "گەڕان، پەڕەی بزنسەکان و جزدانەکەت لە نوێکردنەوەکانی داهاتوودا دێن.", "البحث وصفحات الأنشطة ومحفظتك تصل في التحديثات القادمة."],
  test_version: ["Test version", "وەشانی تاقیکردنەوە", "نسخة تجريبية"],
  back: ["Back", "گەڕانەوە", "رجوع"],
  loading: ["Loading…", "چاوەڕێ بکە…", "جارٍ التحميل…"],
};

const IDX = { en: 0, ku: 1, ar: 2 };

export function t(lang, key, vars) {
  const row = T[key];
  let s = row ? row[IDX[lang] ?? 0] || row[0] : key;
  if (vars) for (const k in vars) s = s.replace("{" + k + "}", vars[k]);
  return s;
}

export function dirOf(lang) {
  return lang === "en" ? "ltr" : "rtl";
}

export const FALLBACK_CITIES = [
  { id: "sulaymaniyah", name_en: "Sulaymaniyah", name_ku: "سلێمانی", name_ar: "السليمانية", live: true },
  { id: "erbil", name_en: "Erbil", name_ku: "هەولێر", name_ar: "أربيل", live: true },
  { id: "duhok", name_en: "Duhok", name_ku: "دهۆک", name_ar: "دهوك", live: false },
  { id: "kirkuk", name_en: "Kirkuk", name_ku: "کەرکووک", name_ar: "كركوك", live: false },
  { id: "halabja", name_en: "Halabja", name_ku: "هەڵەبجە", name_ar: "حلبجة", live: false },
];

export function cityName(c, lang) {
  return (c && (c["name_" + lang] || c.name_en)) || "";
}
