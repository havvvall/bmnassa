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

  // slice 2 · owner sign-up (signed-off screen text, from the language check)
  list_title: ["List your business", "بزنسەکەت تۆمار بکە", "سجّل نشاطك التجاري"],
  list_sub: ["About 1 minute · free", "نزیکەی 1 خولەک · خۆڕایی", "حوالي دقيقة · مجاناً"],
  biz_name: ["Business name", "ناوی بزنس", "اسم النشاط"],
  biz_name_ph: ["e.g. Azad Cooling Services", "بۆ نموونە ساردکەرەوەی ئازاد", "مثلاً آزاد للتبريد"],
  category: ["Category", "پۆل", "الفئة"],
  choose_category: ["Choose a category", "پۆلێک هەڵبژێرە", "اختر فئة"],
  district: ["District", "قەزا", "القضاء"],
  subdistrict: ["Subdistrict", "ناحیە", "الناحية"],
  biz_phone: ["Phone · WhatsApp", "ژمارەی مۆبایل · واتسئاپ", "رقم الهاتف · واتساب"],
  description: ["Description", "وەسف", "الوصف"],
  optional: ["optional", "ئارەزوومەندانە", "اختياري"],
  desc_ph: ["A few words: AC repair, 10 years, free quote", "چەند وشەیەک: چاککردنەوەی سپلیت، 10 ساڵ، نرخدانانی خۆڕایی", "بضع كلمات: تصليح مكيّفات، 10 سنوات، تسعير مجاني"],
  other_langs: ["You can add the other languages later in Edit my page.", "دواتر لە «دەستکاریی پەڕەکەم» دەتوانیت زمانەکانی تر زیاد بکەیت.", "يمكنك إضافة اللغات الأخرى لاحقاً من «تعديل صفحتي»."],
  my_business: ["My business", "بزنسەکەم", "نشاطي التجاري"],

  // new (slice 2)
  choose_city_first: ["Choose a city", "شارێک هەڵبژێرە", "اختر مدينة"],
  choose_district: ["Choose a district", "قەزایەک هەڵبژێرە", "اختر قضاءً"],
  choose_subdistrict: ["Choose a subdistrict", "ناحیەیەک هەڵبژێرە", "اختر ناحية"],
  send_review: ["Send for review", "بینێرە بۆ پێداچوونەوە", "أرسل للمراجعة"],
  review_note: ["The Bmnassa team checks every business before it goes live.", "تیمی بمناسە هەموو بزنسێک دەپشکنێت پێش ئەوەی بڵاو بکرێتەوە.", "يراجع فريق بمناسة كل نشاط قبل نشره."],
  name_required: ["Enter your business name.", "ناوی بزنسەکەت بنووسە.", "أدخل اسم نشاطك."],
  pick_required: ["Choose a category, city, district and subdistrict.", "پۆل، شار، قەزا و ناحیە هەڵبژێرە.", "اختر الفئة والمدينة والقضاء والناحية."],
  biz_phone_invalid: ["Enter a mobile number like 0770 123 4567.", "ژمارەیەکی مۆبایل بنووسە، وەک 0770 123 4567.", "أدخل رقم جوال مثل 0770 123 4567."],
  send_biz_failed: ["Couldn't send. Check your connection and try again.", "نەنێردرا. ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەرەوە.", "تعذّر الإرسال. تحقق من اتصالك وحاول مرة أخرى."],
  places_failed: ["Couldn't load the lists. Check your connection and try again.", "لیستەکان بار نەبوون. ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەرەوە.", "تعذّر تحميل القوائم. تحقق من اتصالك وحاول مرة أخرى."],
  try_again: ["Try again", "دووبارە هەوڵ بدەرەوە", "حاول مرة أخرى"],
  sent_title: ["Sent for review", "نێردرا بۆ پێداچوونەوە", "أُرسل للمراجعة"],
  sent_sub: ["Thank you. The Bmnassa team will check {name} and put it live, usually within a day.", "سوپاس. تیمی بمناسە {name} دەپشکنێت و بڵاوی دەکاتەوە، زۆربەی کات لە ماوەی ڕۆژێکدا.", "شكراً. سيراجع فريق بمناسة {name} وينشره، غالباً خلال يوم."],
  sent_next: ["You'll see it under My business in your account. Photos, prices and opening hours come next, in Edit my page.", "لە هەژمارەکەتدا لە ژێر «بزنسەکەم» دەیبینیت. وێنە، نرخ و کاتی کارکردن دواتر لە «دەستکاریی پەڕەکەم» زیاد دەکرێن.", "ستجده تحت «نشاطي التجاري» في حسابك. الصور والأسعار وأوقات العمل تأتي لاحقاً في «تعديل صفحتي»."],
  to_account: ["Go to my account", "بڕۆ بۆ هەژمارەکەم", "اذهب إلى حسابي"],
  list_free: ["List your business, free", "بزنسەکەت تۆمار بکە، خۆڕایی", "سجّل نشاطك التجاري مجاناً"],
  list_another: ["List another business", "بزنسێکی تر تۆمار بکە", "سجّل نشاطاً آخر"],
  st_pending: ["Waiting for review", "چاوەڕێی پێداچوونەوە", "بانتظار المراجعة"],
  st_approved: ["Live", "بڵاوکراوەتەوە", "منشور"],
  st_rejected: ["Not approved", "پەسەند نەکرا", "لم تتم الموافقة"],
  reason: ["Reason:", "هۆکار:", "السبب:"],

  // slice 4 · listing (signed-off screen text, from the language check)
  home_title: ["Find a trusted service", "خزمەتگوزارییەک بدۆزەرەوە", "ابحث عن خدمة"],
  home_sub: ["Plumbers, pharmacies, engineers and more near you", "بۆڕیچی، دەرمانخانە، ئەندازیار و زیاتر لە نزیکت", "سبّاكون، صيدليات، مهندسون والمزيد بالقرب منك"],
  search_ph: ["Search a service, e.g. AC repair", "بگەڕێ، بۆ نموونە چاککردنەوەی سپلیت", "ابحث، مثلاً تصليح سبلت"],
  categories: ["Categories", "پۆلەکان", "الفئات"],
  own_biz: ["Own a business?", "خاوەنی کار و بزنسێکی ؟", "هل تملك عملاً تجارياً؟"],
  own_biz_sub: ["List it free in about one minute", "بە خێرایی و خۆڕایی تۆماری بکە", "سجّله بسرعة ومجاناً"],
  list_it_free: ["List it free", "تۆمارکردنی خۆڕایی", "تسجيل مجاني"],
  nav_home: ["Home", "سەرەکی", "الرئيسية"],
  nav_wallet: ["Wallet", "جزدان", "المحفظة"],
  nav_scan: ["Scan card", "سکانی کارت", "مسح بطاقة"],
  nav_account: ["Account", "هەژمار", "الحساب"],
  filters: ["Filters", "فلتەر", "تصفية"],
  top_rated: ["Top rated", "باشترین هەڵسەنگاندن", "الأعلى تقييماً"],
  latest: ["Latest added", "نوێترین", "الأحدث"],
  new_badge: ["New", "نوێ", "جديد"],
  empty_text: ["Bmnassa only lists real, checked businesses. New ones join every week.", "بمناسە تەنها بزنسی ڕاستەقینە و پشکنراو پیشان دەدات. هەموو هەفتەیەک بزنسی نوێ زیاد دەبن.", "بمناسة تعرض فقط أنشطة حقيقية وموثّقة. تنضم أنشطة جديدة كل أسبوع."],
  ask_find: ["Ask Bmnassa to find one", "لە بمناسە بپرسە بۆت بدۆزێتەوە", "اسأل بمناسة لتجد لك واحداً"],
  other_cats: ["See other categories", "بینینی پۆلەکانی تر", "تصفّح فئات أخرى"],
  other_city: ["Try another city", "شارێکی تر تاقی بکەرەوە", "جرّب مدينة أخرى"],
  list_your_free: ["List your business free", "بە خۆڕایی تۆماری بکە", "سجّل نشاطك مجاناً"],
  call: ["Call", "پەیوەندی", "اتصال"],
  whatsapp: ["WhatsApp", "واتسئاپ", "واتساب"],
  send_message: ["Send a message", "نامە بنێرە", "أرسل رسالة"],
  save_contact: ["Save contact", "هەڵگرتنی ژمارە", "حفظ جهة الاتصال"],
  swipe_hint: ["Swipe sideways to flip · down to go back", "بۆ لاکان وەریبگێڕە · بۆ خوارەوە بگەڕێرەوە", "اسحب جانباً للقلب · للأسفل للرجوع"],
  powered_by: ["Powered by", "بە پشتگیریی", "مدعوم من"],
  more_info: ["Prices, reviews and location", "نرخ، هەڵسەنگاندن و شوێن", "الأسعار والتقييمات والموقع"],
  scan_save: ["Scan to save this card", "سکانی بکە بۆ هەڵگرتنی ئەم کارتە", "امسح لحفظ هذه البطاقة"],
  or_link: ["Or open the link", "یان لینکەکە بکەرەوە", "أو افتح الرابط"],
  share_card: ["Share this card", "ئەم کارتە هاوبەش بکە", "شارك هذه البطاقة"],
  about: ["About", "دەربارە", "نبذة"],

  // new (slice 4)
  view_4: ["Large tiles", "خانەی گەورە", "مربعات كبيرة"],
  view_3: ["Small tiles", "خانەی بچووک", "مربعات صغيرة"],
  view_list: ["List", "لیست", "قائمة"],
  choose_city_title: ["Choose your city", "شارەکەت هەڵبژێرە", "اختر مدينتك"],
  close: ["Close", "داخستن", "إغلاق"],
  search_title: ["Search", "گەڕان", "بحث"],
  search_none: ["Nothing found for “{q}” in {city}.", "هیچ شتێک بۆ «{q}» لە {city} نەدۆزرایەوە.", "لا نتائج لـ«{q}» في {city}."],
  search_hint: ["Type a business name, a service or a phone number.", "ناوی بزنس، خزمەتگوزاری یان ژمارەی مۆبایل بنووسە.", "اكتب اسم نشاط أو خدمة أو رقم هاتف."],
  all_areas: ["All areas", "هەموو ناوچەکان", "كل المناطق"],
  location: ["Location", "شوێن", "الموقع"],
  new_on: ["New on Bmnassa", "نوێیە لە بمناسە", "جديد على بمناسة"],
  reviews_n: ["{n} reviews", "{n} هەڵسەنگاندن", "{n} تقييماً"],
  share: ["Share", "هاوبەشکردن", "مشاركة"],
  copied: ["Link copied", "لینکەکە کۆپی کرا", "تم نسخ الرابط"],
  not_found_title: ["Business not found", "بزنسەکە نەدۆزرایەوە", "النشاط غير موجود"],
  not_found_sub: ["This link may be old, or the business is not live on Bmnassa yet.", "لەوانەیە ئەم لینکە کۆن بێت، یان بزنسەکە هێشتا لە بمناسە بڵاو نەکراوەتەوە.", "قد يكون الرابط قديماً، أو أن النشاط لم يُنشر على بمناسة بعد."],
  go_home: ["Go to Bmnassa", "بڕۆ بۆ بمناسە", "اذهب إلى بمناسة"],
  soon_feature: ["Coming in a later update", "لە نوێکردنەوەیەکی داهاتوودا دێت", "قادم في تحديث لاحق"],
  load_failed: ["Couldn't load. Check your connection and try again.", "بار نەبوو. ئینتەرنێتەکەت بپشکنە و دووبارە هەوڵ بدەرەوە.", "تعذّر التحميل. تحقق من اتصالك وحاول مرة أخرى."],
  no_biz_yet: ["No {cat} here yet", "هێشتا هیچ بزنسێکی {cat} لێرە نییە", "لا يوجد {cat} هنا بعد"],
  ask_msg: ["Hello Bmnassa, I'm looking for: {cat} in {city}.", "سڵاو بمناسە، بەدوای ئەمەدا دەگەڕێم: {cat} لە {city}.", "مرحباً بمناسة، أبحث عن: {cat} في {city}."],
  st_hidden: ["Hidden", "شاراوە", "مخفي"],
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

// "18 businesses" in each language (Arabic changes the word with the number)
export function bizCount(lang, n) {
  if (lang === "ku") return `${n} بزنس`;
  if (lang === "ar") {
    if (n === 0) return "0 نتيجة";
    if (n === 1) return "نشاط واحد";
    if (n === 2) return "نشاطان";
    if (n <= 10) return `${n} أنشطة`;
    return `${n} نشاطاً`;
  }
  return n === 1 ? "1 business" : `${n} businesses`;
}

// The text of a business field in the person's language, falling back to the languages that are filled
export function pick(row, field, lang) {
  if (!row) return "";
  return row[field + "_" + lang] || row[field + "_en"] || row[field + "_ku"] || row[field + "_ar"] || "";
}
