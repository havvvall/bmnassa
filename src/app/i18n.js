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
  // slice 5 · owner dashboard and Edit my page (signed-off screen text, from the language check)
  my_business_sub: ["My business", "بزنسەکەم", "نشاطي"],
  pending_approval: ["Pending approval", "چاوەڕێی پەسەندکردن", "بانتظار الموافقة"],
  team_will_call: ["Our team will call you within 48 hours.", "تیمەکەمان لە ماوەی 48 کاتژمێردا پەیوەندیت پێوە دەکات.", "سيتصل بك فريقنا خلال 48 ساعة."],
  page_views: ["Page views", "بینینی پەڕە", "مشاهدات الصفحة"],
  call_taps: ["Call taps", "پەیوەندییەکان", "نقرات الاتصال"],
  wa_taps: ["WhatsApp taps", "نامەی واتسئاپ", "نقرات واتساب"],
  complete_page: ["Complete your page", "پەڕەکەت تەواو بکە", "أكمل صفحتك"],
  n_of_6: ["{n} of 6", "{n} لە 6", "{n} من 6"],
  ck_name: ["Business name and phone", "ناوی بزنس و ژمارە", "اسم النشاط والهاتف"],
  ck_photos: ["Add photos", "وێنە زیاد بکە", "أضف صوراً"],
  ck_location: ["Add your location", "شوێنەکەت زیاد بکە", "أضف موقعك"],
  ck_hours: ["Add working hours", "کاتی کارکردن زیاد بکە", "أضف ساعات العمل"],
  ck_prices: ["Add prices and links", "نرخ و لینک زیاد بکە", "أضف الأسعار والروابط"],
  ck_card: ["Design your card", "کارتەکەت دیزاین بکە", "صمّم بطاقتك"],
  edit_page: ["Edit my page", "دەستکاریی پەڕەکەم", "تعديل صفحتي"],
  card_studio: ["Card Studio", "ستۆدیۆی کارت", "استوديو البطاقة"],
  order_nfc: ["Order NFC card", "داواکردنی کارتی NFC", "اطلب بطاقة NFC"],
  my_wallet: ["My wallet", "جزدانەکەم", "محفظتي"],
  preview: ["Preview", "پێشبینین", "معاينة"],
  content: ["Content", "ناوەڕۆک", "المحتوى"],
  style: ["Style", "دیزاین", "التصميم"],
  photos: ["Photos", "وێنەکان", "الصور"],
  name_desc: ["Name and description", "ناو و وەسف", "الاسم والوصف"],
  missing: ["missing", "نییە", "ناقص"],
  prices: ["Prices", "نرخەکان", "الأسعار"],
  add_price: ["+ Add a price", "+ نرخێک زیاد بکە", "+ أضف سعراً"],
  working_hours: ["Working hours", "کاتی کارکردن", "ساعات العمل"],
  drag_pin: ["Drag the pin to your shop", "نیشانەکە بۆ شوێنی دوکانەکەت ڕابکێشە", "اسحب الدبوس إلى موقع محلك"],
  links: ["Links", "لینکەکان", "الروابط"],
  add_link: ["+ Add", "+ زیادکردن", "+ إضافة"],
  edit_warning: ["Changing the name, category or phone sends your page back for approval.", "گۆڕینی ناو، پۆل یان ژمارە پەڕەکەت دەگەڕێنێتەوە بۆ پەسەندکردن.", "تغيير الاسم أو الفئة أو الهاتف يعيد صفحتك إلى المراجعة."],

  // new (slice 5)
  live_views: ["Live · {n} views this week", "بڵاوکراوەتەوە · {n} بینین لەم هەفتەیەدا", "منشور · {n} مشاهدة هذا الأسبوع"],
  live_banner: ["Your business is live", "بزنسەکەت بڵاوکراوەتەوە", "نشاطك منشور"],
  open_my_page: ["Open my page", "پەڕەکەم بکەرەوە", "افتح صفحتي"],
  not_approved_banner: ["Not approved", "پەسەند نەکرا", "لم تتم الموافقة"],
  fix_and_save: ["Fix it in Edit my page and save; it goes back to our team.", "لە «دەستکاریی پەڕەکەم» چاکی بکە و پاشەکەوتی بکە؛ دەگەڕێتەوە بۆ تیمەکەمان.", "صحّحه في «تعديل صفحتي» واحفظه؛ سيعود إلى فريقنا."],
  last_7_days: ["Last 7 days", "7 ڕۆژی ڕابردوو", "آخر 7 أيام"],
  item_ph: ["e.g. AC service", "بۆ نموونە خزمەتگوزاریی سپلیت", "مثلاً صيانة سبلت"],
  price_ph: ["Price", "نرخ", "السعر"],
  iqd: ["IQD", "دینار", "د.ع"],
  remove: ["Remove", "لابردن", "إزالة"],
  set_hours: ["Set your working hours", "کاتی کارکردنت دابنێ", "حدّد ساعات العمل"],
  same_every_day: ["Same hours for every open day", "هەمان کات بۆ هەموو ڕۆژە کراوەکان", "نفس الساعات لكل أيام العمل"],
  open_word: ["Open", "کراوە", "مفتوح"],
  closed_word: ["Closed", "داخراوە", "مغلق"],
  done: ["Done", "تەواو", "تم"],
  clear: ["Clear", "سڕینەوە", "مسح"],
  use_my_location: ["Use my location", "شوێنی ئێستام بەکاربهێنە", "استخدم موقعي"],
  pin_set: ["Pin placed. Drag it to the exact spot.", "نیشانە دانرا. بۆ شوێنی ڕاست ڕایبکێشە.", "تم وضع الدبوس. اسحبه إلى المكان الدقيق."],
  pin_tap: ["Tap the map to place the pin.", "دەست لە نەخشەکە بدە بۆ دانانی نیشانە.", "اضغط على الخريطة لوضع الدبوس."],
  address_ph: ["Street, building or a nearby landmark", "شەقام، باڵەخانە یان شوێنێکی ناسراو لە نزیکی", "الشارع أو البناية أو معلم قريب"],
  photo_hint: ["Up to 8 photos of your shop or your work.", "تا 8 وێنەی دوکان یان کارەکەت.", "حتى 8 صور لمحلك أو عملك."],
  uploading: ["Uploading…", "بار دەکرێت…", "جارٍ الرفع…"],
  upload_failed: ["Couldn't upload the photo. Try again.", "وێنەکە بار نەبوو. دووبارە هەوڵ بدەرەوە.", "تعذّر رفع الصورة. حاول مرة أخرى."],
  saved_page: ["Saved", "پاشەکەوت کرا", "تم الحفظ"],
  saved_review: ["Saved. Your page went back for approval.", "پاشەکەوت کرا. پەڕەکەت گەڕایەوە بۆ پەسەندکردن.", "تم الحفظ. عادت صفحتك إلى المراجعة."],
  unsaved: ["You have changes that are not saved.", "گۆڕانکاریی پاشەکەوت نەکراوت هەیە.", "لديك تغييرات غير محفوظة."],
  name_on_card: ["Your name on the card", "ناوت لەسەر کارتەکە", "اسمك على البطاقة"],
  directions: ["Directions", "ڕێگا", "الاتجاهات"],
  hours_title: ["Opening hours", "کاتی کارکردن", "ساعات العمل"],
  soon_short: ["Soon", "بەم زووانە", "قريباً"],
  instagram: ["Instagram", "ئینستاگرام", "إنستغرام"],
  facebook: ["Facebook", "فەیسبووک", "فيسبوك"],
  tiktok: ["TikTok", "تیکتۆک", "تيك توك"],
  email_link: ["Email", "ئیمەیڵ", "البريد"],
  website: ["Website", "ماڵپەڕ", "الموقع"],
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
