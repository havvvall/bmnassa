-- Bmnassa version 1 · slice 2: owner sign-up
-- Run once in Supabase → SQL Editor (the full editor). Safe to run again.
-- Needs 001_accounts.sql and 002_email_signin.sql already run.

-- 1) Districts and subdistricts (locations list of 15 Oct 2026; rows with needs_check = true still need a local check)
create table if not exists public.districts (
  id text primary key,
  city_id text not null references public.cities (id),
  name_en text not null, name_ku text, name_ar text,
  sort_order int not null default 0
);
create table if not exists public.subdistricts (
  id text primary key,
  district_id text not null references public.districts (id) on delete cascade,
  name_en text not null, name_ku text, name_ar text,
  sort_order int not null default 0,
  needs_check boolean not null default false
);

insert into public.districts (id, city_id, name_en, name_ku, name_ar, sort_order) values
  ('sulaymaniyah/sulaymaniyah', 'sulaymaniyah', 'Sulaymaniyah', 'سلێمانی', 'السليمانية', 0),
  ('sulaymaniyah/chamchamal', 'sulaymaniyah', 'Chamchamal', 'چەمچەماڵ', 'جمجمال', 1),
  ('sulaymaniyah/dukan', 'sulaymaniyah', 'Dukan', 'دوکان', 'دوكان', 2),
  ('sulaymaniyah/darbandikhan', 'sulaymaniyah', 'Darbandikhan', 'دەربەندیخان', 'دربندخان', 3),
  ('sulaymaniyah/kalar', 'sulaymaniyah', 'Kalar', 'کەلار', 'كلار', 4),
  ('sulaymaniyah/kifri', 'sulaymaniyah', 'Kifri', 'کفری', 'كفري', 5),
  ('sulaymaniyah/mawat', 'sulaymaniyah', 'Mawat', 'ماوەت', 'ماوت', 6),
  ('sulaymaniyah/penjwen', 'sulaymaniyah', 'Penjwen', 'پێنجوێن', 'بنجوين', 7),
  ('sulaymaniyah/pshdar', 'sulaymaniyah', 'Pshdar', 'پشدەر', 'بشدر', 8),
  ('sulaymaniyah/qaradagh', 'sulaymaniyah', 'Qaradagh', 'قەرەداغ', 'قرداغ', 9),
  ('sulaymaniyah/ranya', 'sulaymaniyah', 'Ranya', 'ڕانیە', 'رانية', 10),
  ('sulaymaniyah/said-sadiq', 'sulaymaniyah', 'Said Sadiq', 'سەیدسادق', 'سيد صادق', 11),
  ('sulaymaniyah/sharazur', 'sulaymaniyah', 'Sharazur', 'شارەزوور', 'شهرزور', 12),
  ('sulaymaniyah/sharbazher', 'sulaymaniyah', 'Sharbazher', 'شارباژێڕ', 'شاربازير', 13),
  ('erbil/erbil-centre', 'erbil', 'Erbil Centre', 'ناوەندی هەولێر', 'مركز أربيل', 0),
  ('erbil/dashti-hawler', 'erbil', 'Dashti Hawler', 'دەشتی هەولێر', 'دشت أربيل', 1),
  ('erbil/khabat', 'erbil', 'Khabat', 'خەبات', 'خبات', 2),
  ('erbil/koya', 'erbil', 'Koya', 'کۆیە', 'كويسنجق', 3),
  ('erbil/shaqlawa', 'erbil', 'Shaqlawa', 'شەقڵاوە', 'شقلاوة', 4),
  ('erbil/soran', 'erbil', 'Soran', 'سۆران', 'سوران', 5),
  ('erbil/rawanduz', 'erbil', 'Rawanduz', 'ڕەواندز', 'راوندوز', 6),
  ('erbil/choman', 'erbil', 'Choman', 'چۆمان', 'جومان', 7),
  ('erbil/mergasor', 'erbil', 'Mergasor', 'مێرگەسۆر', 'ميركسور', 8),
  ('erbil/makhmur', 'erbil', 'Makhmur', 'مەخموور', 'مخمور', 9),
  ('duhok/duhok', 'duhok', 'Duhok', 'دهۆک', 'دهوك', 0),
  ('duhok/sumel', 'duhok', 'Sumel', 'سێمێل', 'سميل', 1),
  ('duhok/zakho', 'duhok', 'Zakho', 'زاخۆ', 'زاخو', 2),
  ('duhok/amedi', 'duhok', 'Amedi', 'ئامێدی', 'العمادية', 3),
  ('duhok/bardarash', 'duhok', 'Bardarash', 'بەردەڕەش', 'بردرش', 4),
  ('duhok/akre', 'duhok', 'Akre', 'ئاکرێ', 'عقرة', 5),
  ('duhok/shekhan', 'duhok', 'Shekhan', 'شێخان', 'الشيخان', 6),
  ('halabja/halabja', 'halabja', 'Halabja', 'هەڵەبجە', 'حلبجة', 0),
  ('kirkuk/kirkuk', 'kirkuk', 'Kirkuk', 'کەرکووک', 'كركوك', 0),
  ('kirkuk/hawija', 'kirkuk', 'Hawija', 'حەویجە', 'الحويجة', 1),
  ('kirkuk/daquq', 'kirkuk', 'Daquq', 'داقووق', 'داقوق', 2),
  ('kirkuk/dibis', 'kirkuk', 'Dibis', 'دبس', 'الدبس', 3)
on conflict (id) do nothing;

insert into public.subdistricts (id, district_id, name_en, name_ku, name_ar, sort_order, needs_check) values
  ('sulaymaniyah/sulaymaniyah/centre', 'sulaymaniyah/sulaymaniyah', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/sulaymaniyah/tanjaro', 'sulaymaniyah/sulaymaniyah', 'Tanjaro', 'تانجەرۆ', 'تانجرو', 1, false),
  ('sulaymaniyah/sulaymaniyah/bakrajo', 'sulaymaniyah/sulaymaniyah', 'Bakrajo', 'بەکرەجۆ', 'بكرجو', 2, false),
  ('sulaymaniyah/chamchamal/centre', 'sulaymaniyah/chamchamal', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/chamchamal/bazyan', 'sulaymaniyah/chamchamal', 'Bazyan', 'بازیان', 'بازيان', 1, true),
  ('sulaymaniyah/chamchamal/shwan', 'sulaymaniyah/chamchamal', 'Shwan', 'شوان', 'شوان', 2, false),
  ('sulaymaniyah/chamchamal/aghjalar', 'sulaymaniyah/chamchamal', 'Aghjalar', 'ئاغجەلەر', 'آغجلر', 3, false),
  ('sulaymaniyah/chamchamal/takiya', 'sulaymaniyah/chamchamal', 'Takiya', 'تەکیە', 'تكية', 4, false),
  ('sulaymaniyah/chamchamal/sangaw', 'sulaymaniyah/chamchamal', 'Sangaw', 'سەنگاو', 'سنكاو', 5, false),
  ('sulaymaniyah/chamchamal/qadir-karam', 'sulaymaniyah/chamchamal', 'Qadir Karam', 'قادرکەرەم', 'قادر كرم', 6, false),
  ('sulaymaniyah/dukan/centre', 'sulaymaniyah/dukan', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/dukan/surdash', 'sulaymaniyah/dukan', 'Surdash', 'سورداش', 'سورداش', 1, false),
  ('sulaymaniyah/dukan/chinaran', 'sulaymaniyah/dukan', 'Chinaran', 'چناران', 'جناران', 2, false),
  ('sulaymaniyah/dukan/bingird', 'sulaymaniyah/dukan', 'Bingird', 'بنگرد', 'بنكرد', 3, false),
  ('sulaymaniyah/dukan/khidran', 'sulaymaniyah/dukan', 'Khidran', 'خدران', 'خدران', 4, false),
  ('sulaymaniyah/dukan/piramagrun', 'sulaymaniyah/dukan', 'Piramagrun', 'پیرەمەگرون', 'بيرمكرون', 5, false),
  ('sulaymaniyah/darbandikhan/centre', 'sulaymaniyah/darbandikhan', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/darbandikhan/bawa-khoshin', 'sulaymaniyah/darbandikhan', 'Bawa Khoshin', 'باوەخۆشێن', 'باوه خوشين', 1, false),
  ('sulaymaniyah/kalar/centre', 'sulaymaniyah/kalar', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/kalar/pebaz', 'sulaymaniyah/kalar', 'Pebaz', 'پێباز', 'بيباز', 1, false),
  ('sulaymaniyah/kalar/sheikh-tawil', 'sulaymaniyah/kalar', 'Sheikh Tawil', 'شێخ تەویل', 'شيخ طويل', 2, false),
  ('sulaymaniyah/kalar/rizgari', 'sulaymaniyah/kalar', 'Rizgari', 'ڕزگاری', 'رزكاري', 3, false),
  ('sulaymaniyah/kifri/centre', 'sulaymaniyah/kifri', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('sulaymaniyah/kifri/sarqala', 'sulaymaniyah/kifri', 'Sarqala', 'سەرقەڵا', 'سرقلعة', 1, true),
  ('sulaymaniyah/mawat/centre', 'sulaymaniyah/mawat', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/penjwen/centre', 'sulaymaniyah/penjwen', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/penjwen/garmik', 'sulaymaniyah/penjwen', 'Garmik', 'گەرمک', 'كرمك', 1, false),
  ('sulaymaniyah/penjwen/nalparez', 'sulaymaniyah/penjwen', 'Nalparez', 'ناڵپارێز', 'نالباريز', 2, false),
  ('sulaymaniyah/pshdar/centre', 'sulaymaniyah/pshdar', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/pshdar/hero', 'sulaymaniyah/pshdar', 'Hero', 'هێرۆ', 'هيرو', 1, false),
  ('sulaymaniyah/pshdar/nawdasht', 'sulaymaniyah/pshdar', 'Nawdasht', 'ناودەشت', 'ناودشت', 2, false),
  ('sulaymaniyah/pshdar/halsho', 'sulaymaniyah/pshdar', 'Halsho', 'هەڵشۆ', 'هلشو', 3, false),
  ('sulaymaniyah/pshdar/zharawa', 'sulaymaniyah/pshdar', 'Zharawa', 'ژاراوە', 'زاراوة', 4, false),
  ('sulaymaniyah/pshdar/isewe', 'sulaymaniyah/pshdar', 'Isewe', 'ئیسێوێ', 'ئيسيوي', 5, false),
  ('sulaymaniyah/qaradagh/centre', 'sulaymaniyah/qaradagh', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/ranya/centre', 'sulaymaniyah/ranya', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/ranya/chwarqurna', 'sulaymaniyah/ranya', 'Chwarqurna', 'چوارقوڕنە', 'جوارقورنة', 1, false),
  ('sulaymaniyah/ranya/betwata', 'sulaymaniyah/ranya', 'Betwata', 'بێتواتە', 'بيتواتة', 2, false),
  ('sulaymaniyah/ranya/hajiawa', 'sulaymaniyah/ranya', 'Hajiawa', 'حاجیاوا', 'حاجياوة', 3, false),
  ('sulaymaniyah/ranya/sarkapkan', 'sulaymaniyah/ranya', 'Sarkapkan', 'سەرکەپکان', 'سركبكان', 4, false),
  ('sulaymaniyah/said-sadiq/centre', 'sulaymaniyah/said-sadiq', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/said-sadiq/saruchik', 'sulaymaniyah/said-sadiq', 'Saruchik', 'سەروچک', 'سروجك', 1, false),
  ('sulaymaniyah/said-sadiq/barzinja', 'sulaymaniyah/said-sadiq', 'Barzinja', 'بەرزنجە', 'برزنجة', 2, false),
  ('sulaymaniyah/sharazur/centre', 'sulaymaniyah/sharazur', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/sharbazher/centre', 'sulaymaniyah/sharbazher', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('sulaymaniyah/sharbazher/zalan', 'sulaymaniyah/sharbazher', 'Zalan', 'زەڵان', 'زلان', 1, true),
  ('sulaymaniyah/sharbazher/zhazhla', 'sulaymaniyah/sharbazher', 'Zhazhla', 'ژاژڵە', 'زاژلة', 2, true),
  ('sulaymaniyah/sharbazher/siwail', 'sulaymaniyah/sharbazher', 'Siwail', 'سیوەیل', 'سيويل', 3, false),
  ('sulaymaniyah/sharbazher/sitak', 'sulaymaniyah/sharbazher', 'Sitak', 'سیتەک', 'سيتك', 4, false),
  ('sulaymaniyah/sharbazher/gapilon', 'sulaymaniyah/sharbazher', 'Gapilon', 'گاپیلۆن', 'كابيلون', 5, false),
  ('erbil/erbil-centre/centre', 'erbil/erbil-centre', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/erbil-centre/ainkawa', 'erbil/erbil-centre', 'Ainkawa', 'عەینکاوە', 'عينكاوة', 1, false),
  ('erbil/dashti-hawler/centre', 'erbil/dashti-hawler', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('erbil/dashti-hawler/bahirka', 'erbil/dashti-hawler', 'Bahirka', 'بەحرکە', 'بحركة', 1, true),
  ('erbil/dashti-hawler/kasnazan', 'erbil/dashti-hawler', 'Kasnazan', 'کەسنەزان', 'كسنزان', 2, true),
  ('erbil/dashti-hawler/qushtapa', 'erbil/dashti-hawler', 'Qushtapa', 'قوشتەپە', 'قوشتبة', 3, true),
  ('erbil/dashti-hawler/shamamk', 'erbil/dashti-hawler', 'Shamamk', 'شەمامک', 'شمامك', 4, true),
  ('erbil/dashti-hawler/daratu', 'erbil/dashti-hawler', 'Daratu', 'داراتوو', 'داراتو', 5, true),
  ('erbil/khabat/centre', 'erbil/khabat', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/khabat/darashakran', 'erbil/khabat', 'Darashakran', 'دارەشەکران', 'دارشكران', 1, true),
  ('erbil/khabat/rizgari', 'erbil/khabat', 'Rizgari', 'ڕزگاری', 'رزكاري', 2, true),
  ('erbil/khabat/kawergosk', 'erbil/khabat', 'Kawergosk', 'کەورگۆسک', 'كوركوسك', 3, true),
  ('erbil/koya/centre', 'erbil/koya', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/koya/shorsh', 'erbil/koya', 'Shorsh', 'شۆڕش', 'شورش', 1, false),
  ('erbil/koya/segrdkan', 'erbil/koya', 'Segrdkan', 'سێگردکان', 'سيكردكان', 2, false),
  ('erbil/koya/taqtaq', 'erbil/koya', 'Taqtaq', 'تەقتەق', 'طق طق', 3, false),
  ('erbil/koya/ashti', 'erbil/koya', 'Ashti', 'ئاشتی', 'آشتي', 4, true),
  ('erbil/shaqlawa/centre', 'erbil/shaqlawa', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/shaqlawa/harir', 'erbil/shaqlawa', 'Harir', 'حەریر', 'حرير', 1, false),
  ('erbil/shaqlawa/salahaddin', 'erbil/shaqlawa', 'Salahaddin', 'سەڵاحەدین', 'صلاح الدين', 2, false),
  ('erbil/shaqlawa/basirma', 'erbil/shaqlawa', 'Basirma', 'باسرمە', 'باسرمة', 3, true),
  ('erbil/shaqlawa/heran', 'erbil/shaqlawa', 'Heran', 'هیران', 'هيران', 4, true),
  ('erbil/shaqlawa/balisan', 'erbil/shaqlawa', 'Balisan', 'باڵیسان', 'باليسان', 5, true),
  ('erbil/soran/centre', 'erbil/soran', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/soran/diana', 'erbil/soran', 'Diana', 'دیانا', 'ديانا', 1, false),
  ('erbil/soran/khalifan', 'erbil/soran', 'Khalifan', 'خەلیفان', 'خليفان', 2, false),
  ('erbil/soran/sidakan', 'erbil/soran', 'Sidakan', 'سیدەکان', 'سيدكان', 3, true),
  ('erbil/soran/sktan', 'erbil/soran', 'Sktan', 'سکتان', 'سكتان', 4, true),
  ('erbil/rawanduz/centre', 'erbil/rawanduz', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/rawanduz/warte', 'erbil/rawanduz', 'Warte', 'وەرتێ', 'وارتي', 1, true),
  ('erbil/choman/centre', 'erbil/choman', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/choman/galala', 'erbil/choman', 'Galala', 'گەڵاڵە', 'كلالة', 1, false),
  ('erbil/choman/qasre', 'erbil/choman', 'Qasre', 'قەسرێ', 'قصري', 2, false),
  ('erbil/choman/haji-omaran', 'erbil/choman', 'Haji Omaran', 'حاجی ئۆمەران', 'حاج عمران', 3, false),
  ('erbil/choman/smilan', 'erbil/choman', 'Smilan', 'سمیلان', 'سميلان', 4, true),
  ('erbil/mergasor/centre', 'erbil/mergasor', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('erbil/mergasor/barzan', 'erbil/mergasor', 'Barzan', 'بارزان', 'بارزان', 1, false),
  ('erbil/mergasor/goretu', 'erbil/mergasor', 'Goretu', 'گۆرەتوو', 'كوره تو', 2, false),
  ('erbil/mergasor/sherwan-mazn', 'erbil/mergasor', 'Sherwan Mazn', 'شێروان مەزن', 'شيروان مزن', 3, false),
  ('erbil/mergasor/mazne', 'erbil/mergasor', 'Mazne', 'مەزنێ', 'مزنة', 4, true),
  ('erbil/mergasor/piran', 'erbil/mergasor', 'Piran', 'پیران', 'بيران', 5, true),
  ('erbil/makhmur/centre', 'erbil/makhmur', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('erbil/makhmur/qaraj', 'erbil/makhmur', 'Qaraj', 'قەراج', 'قراج', 1, false),
  ('erbil/makhmur/gwer', 'erbil/makhmur', 'Gwer', 'گوێر', 'كوير', 2, false),
  ('erbil/makhmur/dibaga', 'erbil/makhmur', 'Dibaga', 'دیبەگە', 'ديبكة', 3, true),
  ('duhok/duhok/centre', 'duhok/duhok', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('duhok/duhok/zawita', 'duhok/duhok', 'Zawita', 'زاویتە', 'زاويتة', 1, false),
  ('duhok/duhok/mangesh', 'duhok/duhok', 'Mangesh', 'مانگێش', 'مانكيش', 2, false),
  ('duhok/sumel/centre', 'duhok/sumel', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('duhok/sumel/fayda', 'duhok/sumel', 'Fayda', 'فایدە', 'فايدة', 1, false),
  ('duhok/sumel/batel', 'duhok/sumel', 'Batel', 'باتێل', 'باتيل', 2, false),
  ('duhok/zakho/centre', 'duhok/zakho', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('duhok/zakho/darkar', 'duhok/zakho', 'Darkar', 'دەرکار', 'دركار', 1, false),
  ('duhok/zakho/batifa', 'duhok/zakho', 'Batifa', 'باتیفا', 'باتيفا', 2, false),
  ('duhok/zakho/ibrahim-khalil', 'duhok/zakho', 'Ibrahim Khalil', 'ئیبراهیم خەلیل', 'إبراهيم الخليل', 3, true),
  ('duhok/zakho/sindi', 'duhok/zakho', 'Sindi', 'سندی', 'السندي', 4, true),
  ('duhok/amedi/centre', 'duhok/amedi', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('duhok/amedi/sarsink', 'duhok/amedi', 'Sarsink', 'سەرسنگ', 'سرسنك', 1, false),
  ('duhok/amedi/bamarni', 'duhok/amedi', 'Bamarni', 'بامەڕنێ', 'بامرني', 2, false),
  ('duhok/amedi/kani-masi', 'duhok/amedi', 'Kani Masi', 'کانی ماسێ', 'كاني ماسي', 3, false),
  ('duhok/amedi/chamanke', 'duhok/amedi', 'Chamanke', 'چەمانکێ', 'جمانكي', 4, false),
  ('duhok/amedi/deralok', 'duhok/amedi', 'Deralok', 'دێرەلووک', 'ديرلوك', 5, false),
  ('duhok/amedi/barwari-bala', 'duhok/amedi', 'Barwari Bala', 'بەرواری باڵا', 'برواري بالا', 6, true),
  ('duhok/amedi/nerwa-and-rekan', 'duhok/amedi', 'Nerwa and Rekan', 'نێروە و ڕێکان', 'نيروة وريكان', 7, true),
  ('duhok/bardarash/centre', 'duhok/bardarash', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('duhok/bardarash/darato', 'duhok/bardarash', 'Darato', 'داراتوو', 'دارتو', 1, true),
  ('duhok/bardarash/rovia', 'duhok/bardarash', 'Rovia', 'ڕۆڤیا', 'روفيا', 2, false),
  ('duhok/bardarash/kalak', 'duhok/bardarash', 'Kalak', 'کەلەک', 'الكلك', 3, false),
  ('duhok/akre/centre', 'duhok/akre', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('duhok/akre/dinarta', 'duhok/akre', 'Dinarta', 'دینارتە', 'دينارتة', 1, false),
  ('duhok/akre/bijil', 'duhok/akre', 'Bijil', 'بجیل', 'بجيل', 2, false),
  ('duhok/akre/kurdasin', 'duhok/akre', 'Kurdasin', 'کوردەسین', 'كردسين', 3, false),
  ('duhok/shekhan/centre', 'duhok/shekhan', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('duhok/shekhan/qasrok', 'duhok/shekhan', 'Qasrok', 'قەسرۆک', 'قصروك', 1, false),
  ('duhok/shekhan/atrush', 'duhok/shekhan', 'Atrush', 'ئەتروش', 'أتروش', 2, false),
  ('halabja/halabja/centre', 'halabja/halabja', 'Centre', 'ناوەند', 'المركز', 0, true),
  ('halabja/halabja/khurmal', 'halabja/halabja', 'Khurmal', 'خورماڵ', 'خورمال', 1, false),
  ('halabja/halabja/sirwan', 'halabja/halabja', 'Sirwan', 'سیروان', 'سيروان', 2, false),
  ('halabja/halabja/biyara', 'halabja/halabja', 'Biyara', 'بیارە', 'بيارة', 3, false),
  ('halabja/halabja/bamo', 'halabja/halabja', 'Bamo', 'بەمۆ', 'بمو', 4, false),
  ('kirkuk/kirkuk/centre', 'kirkuk/kirkuk', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('kirkuk/kirkuk/taza-khurmatu', 'kirkuk/kirkuk', 'Taza Khurmatu', 'تازە خورماتوو', 'تازة خورماتو', 1, false),
  ('kirkuk/kirkuk/laylan', 'kirkuk/kirkuk', 'Laylan', 'لەیلان', 'ليلان', 2, false),
  ('kirkuk/kirkuk/qara-hanjir', 'kirkuk/kirkuk', 'Qara Hanjir', 'قەرەهەنجیر', 'قره هنجير', 3, false),
  ('kirkuk/kirkuk/shwan', 'kirkuk/kirkuk', 'Shwan', 'شوان', 'شوان', 4, false),
  ('kirkuk/kirkuk/yayji', 'kirkuk/kirkuk', 'Yayji', 'یایجی', 'يايجي', 5, false),
  ('kirkuk/kirkuk/multaqa', 'kirkuk/kirkuk', 'Multaqa', 'مولتەقا', 'الملتقى', 6, false),
  ('kirkuk/hawija/centre', 'kirkuk/hawija', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('kirkuk/hawija/abbasi', 'kirkuk/hawija', 'Abbasi', 'عەباسی', 'العباسي', 1, false),
  ('kirkuk/hawija/riyadh', 'kirkuk/hawija', 'Riyadh', 'ڕیاز', 'الرياض', 2, false),
  ('kirkuk/hawija/zab', 'kirkuk/hawija', 'Zab', 'زاب', 'الزاب', 3, false),
  ('kirkuk/hawija/rashad', 'kirkuk/hawija', 'Rashad', 'ڕەشاد', 'الرشاد', 4, true),
  ('kirkuk/daquq/centre', 'kirkuk/daquq', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('kirkuk/dibis/centre', 'kirkuk/dibis', 'Centre', 'ناوەند', 'المركز', 0, false),
  ('kirkuk/dibis/sargaran', 'kirkuk/dibis', 'Sargaran', 'سەرگەڕان', 'سركران', 1, false),
  ('kirkuk/dibis/altun-kupri-prde', 'kirkuk/dibis', 'Altun Kupri (Prde)', 'پردێ', 'التون كوبري', 2, false)
on conflict (id) do nothing;

alter table public.districts enable row level security;
alter table public.subdistricts enable row level security;
drop policy if exists "anyone reads districts" on public.districts;
create policy "anyone reads districts" on public.districts for select using (true);
drop policy if exists "team manages districts" on public.districts;
create policy "team manages districts" on public.districts for all to authenticated
  using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());
drop policy if exists "anyone reads subdistricts" on public.subdistricts;
create policy "anyone reads subdistricts" on public.subdistricts for select using (true);
drop policy if exists "team manages subdistricts" on public.subdistricts;
create policy "team manages subdistricts" on public.subdistricts for all to authenticated
  using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());
grant select on public.districts, public.subdistricts to anon, authenticated;

-- 2) Categories: everyone can read them (the sign-up form lists them)
drop policy if exists "anyone reads categories" on public.categories;
create policy "anyone reads categories" on public.categories for select using (true);
grant select on public.categories to anon, authenticated;

-- 3) Businesses get an owner, a district, a subdistrict and descriptions in 3 languages
alter table public.businesses add column if not exists owner_id uuid references auth.users (id) on delete set null;
alter table public.businesses add column if not exists district_id text references public.districts (id);
alter table public.businesses add column if not exists subdistrict_id text references public.subdistricts (id);
alter table public.businesses add column if not exists name_ar text;
alter table public.businesses add column if not exists whatsapp text;
alter table public.businesses add column if not exists description_en text;
alter table public.businesses add column if not exists description_ku text;
alter table public.businesses add column if not exists description_ar text;
alter table public.businesses add column if not exists sent_in_language text;
alter table public.businesses add column if not exists created_at timestamptz default now();
alter table public.businesses add column if not exists updated_at timestamptz default now();
alter table public.businesses add column if not exists status text default 'pending';
alter table public.businesses add column if not exists verified boolean default false;
alter table public.businesses add column if not exists rating numeric default 0;
alter table public.businesses add column if not exists reviews int default 0;
alter table public.businesses add column if not exists handle text;
create index if not exists businesses_owner_idx on public.businesses (owner_id);

-- New businesses get their number by themselves
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'businesses'
             and column_name = 'id' and column_default is null and is_identity = 'NO') then
    create sequence if not exists public.businesses_id_seq owned by public.businesses.id;
    perform setval('public.businesses_id_seq', coalesce((select max(id) from public.businesses), 0) + 1, false);
    alter table public.businesses alter column id set default nextval('public.businesses_id_seq');
  end if;
end $$;

-- An owner types the name in one language; the team fills the others at approval,
-- so no other column may be required when a business is first sent in
do $$
declare c record;
begin
  for c in select column_name from information_schema.columns where table_schema = 'public' and table_name = 'businesses'
           and is_nullable = 'NO' and column_default is null and column_name <> 'id' loop
    execute format('alter table public.businesses alter column %I drop not null', c.column_name);
  end loop;
end $$;

-- 4) What an owner may and may not change (the team can change anything)
create or replace function public.bmnassa_businesses_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.bmnassa_is_staff() then
    new.updated_at := now();
    return new;
  end if;
  if tg_op = 'INSERT' then
    if (select count(*) from public.businesses where owner_id = auth.uid()) >= 10 then
      raise exception 'You can list up to 10 businesses. Contact Bmnassa for more.';
    end if;
    new.owner_id := auth.uid();
    new.status := 'pending';
    new.verified := false;
    new.rating := 0;
    new.reviews := 0;
    new.handle := null;
    new.created_at := now();
  else
    new.id := old.id;
    new.owner_id := old.owner_id;
    new.verified := old.verified;
    new.rating := old.rating;
    new.reviews := old.reviews;
    new.handle := old.handle;
    new.created_at := old.created_at;
    -- Changing the name, category or phone of a live business sends it back for review
    if old.status = 'approved' and (new.name_en is distinct from old.name_en or new.name_ku is distinct from old.name_ku
        or new.name_ar is distinct from old.name_ar or new.category_id is distinct from old.category_id
        or new.phone is distinct from old.phone) then
      new.status := 'pending';
    else
      new.status := old.status;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists bmnassa_businesses_guard on public.businesses;
create trigger bmnassa_businesses_guard
  before insert or update on public.businesses
  for each row execute function public.bmnassa_businesses_guard();

-- 5) When the team approves a business, its owner becomes "Business owner"
create or replace function public.bmnassa_business_owner_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and new.owner_id is not null then
    update public.profiles set role = 'owner' where id = new.owner_id and role = 'customer';
  end if;
  return new;
end $$;

drop trigger if exists bmnassa_business_owner_role on public.businesses;
create trigger bmnassa_business_owner_role
  after insert or update of status on public.businesses
  for each row execute function public.bmnassa_business_owner_role();

-- 6) Who sees and changes businesses
alter table public.businesses enable row level security;
drop policy if exists "anyone reads live businesses" on public.businesses;
create policy "anyone reads live businesses" on public.businesses
  for select using (status = 'approved');
drop policy if exists "owners read own businesses" on public.businesses;
create policy "owners read own businesses" on public.businesses
  for select to authenticated using (owner_id = auth.uid());
drop policy if exists "owners add a business" on public.businesses;
create policy "owners add a business" on public.businesses
  for insert to authenticated with check (owner_id = auth.uid() and status = 'pending');
drop policy if exists "owners edit own businesses" on public.businesses;
create policy "owners edit own businesses" on public.businesses
  for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "team manages businesses" on public.businesses;
create policy "team manages businesses" on public.businesses
  for all to authenticated using (public.bmnassa_is_staff()) with check (public.bmnassa_is_staff());
grant select on public.businesses to anon;
grant select, insert, update on public.businesses to authenticated;
grant usage, select on all sequences in schema public to authenticated;
