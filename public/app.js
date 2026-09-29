(function () {
  'use strict';
  const D = window.DALEEL_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- text ----------
  const T = {
    brand: { ar: 'دليل', en: 'Daleel' },
    tagline: { ar: 'خبيرك في شراء السيارات المستعملة', en: 'Your used-car buying expert' },
    trial: {
      ar: 'فترة تجريبية: لن يطلب منك التطبيق أي مبلغ حالياً. خدمات الدفع متوقفة.',
      en: 'Trial period: the app will not ask you for any money for now. Payments are switched off.',
    },
    navHome: { ar: 'الرئيسية', en: 'Home' },
    navRequest: { ar: 'اطلب سيارة', en: 'Find a car' },
    navPlatforms: { ar: 'المنصات', en: 'Platforms' },
    navSafety: { ar: 'اشترِ بأمان', en: 'Buy safely' },
    navRate: { ar: 'قيّمنا', en: 'Rate us' },
    heroEyebrow: { ar: 'سيارات مستعملة · السعودية', en: 'Used cars · Saudi Arabia' },
    heroTitle: {
      ar: 'اشترِ سيارتك المستعملة <em>ومعك خبير</em> يدور لك أفضل صفقة',
      en: 'Buy your used car <em>with an expert</em> hunting the best deal for you',
    },
    heroLead: {
      ar: 'قل لنا السيارة اللي تبيها، أو قل لنا كم معك ولو ٥٠٠٠ ريال، ونرشّح لك أفضل خيار من منصات وبائعين موثوقين. مناسب لأول مرة تشتري فيها، وللسيدات اللي يبون مستشار موثوق.',
      en: 'Tell us the car you want, or just how much you have, even 5,000 SAR, and we recommend the best option from trusted platforms and sellers. Made for first-time buyers and for women who want a trusted advisor.',
    },
    ctaBudget: { ar: 'عندي ميزانية', en: 'I have a budget' },
    ctaSpecific: { ar: 'أبي سيارة محددة', en: 'I want a specific car' },
    statVisits: { ar: 'زيارة', en: 'visits' },
    statRequests: { ar: 'طلب بحث', en: 'car requests' },
    statRating: { ar: 'تقييم العملاء', en: 'customer rating' },
    demoNote: { ar: 'وضع العرض: البيانات محفوظة على جهازك فقط.', en: 'Demo mode: data is saved on this device only.' },
    plateCaption: { ar: 'حتى لو ميزانيتك ٥٠٠٠ ريال، نوجّهك.', en: 'Even with 5,000 SAR, we guide you.' },
    point1: { ar: 'نسبة ثقة لكل منصة مبنية على الفحص والضمان والتقييمات', en: 'A trust score for every platform, based on inspection, warranty and reviews' },
    point2: { ar: 'فاحص ثقة البائع قبل ما تقابله', en: 'A seller trust checker before you meet anyone' },
    point3: { ar: 'مستشارة للسيدات عند الطلب، والتواصل واتساب فقط لو تحب', en: 'Female advisor on request, WhatsApp-only contact if you prefer' },
    reqEyebrow: { ar: 'الخطوة ١', en: 'Step 1' },
    reqTitle: { ar: 'وش تدور عليه؟', en: 'What are you looking for?' },
    reqLead: {
      ar: 'حرّك الميزانية وشوف مباشرة وش تقدر تشتري. أرسل الطلب ويتواصل معك فريقنا بأفضل الإعلانات.',
      en: 'Move the budget and see right away what it buys. Send the request and our team contacts you with the best listings.',
    },
    modeBudget: { ar: 'كم معي؟', en: 'My budget' },
    modeSpecific: { ar: 'سيارة محددة', en: 'Specific car' },
    budgetLabel: { ar: 'ميزانيتك (ريال)', en: 'Your budget (SAR)' },
    budgetNote: { ar: 'ما في ميزانية صغيرة. من ٥٠٠٠ ريال وفوق، نلقى لك الأنسب.', en: 'No budget is too small. From 5,000 SAR up, we find what fits.' },
    make: { ar: 'الشركة', en: 'Make' },
    model: { ar: 'الموديل', en: 'Model' },
    yearFrom: { ar: 'سنة الصنع من', en: 'Year from' },
    bodyType: { ar: 'نوع السيارة', en: 'Body type' },
    usage: { ar: 'الاستخدام', en: 'Main use' },
    name: { ar: 'الاسم', en: 'Name' },
    phone: { ar: 'رقم الجوال', en: 'Mobile number' },
    city: { ar: 'المدينة', en: 'City' },
    contact: { ar: 'طريقة التواصل', en: 'Contact by' },
    femaleAdvisor: { ar: 'أفضّل التعامل مع مستشارة', en: 'I prefer a female advisor' },
    firstCar: { ar: 'هذي أول سيارة أشتريها', en: 'This is my first car purchase' },
    notes: { ar: 'ملاحظات (لون، ناقل حركة، أي شي يهمك)', en: 'Notes (colour, gearbox, anything that matters)' },
    consent: {
      ar: 'أوافق على حفظ بياناتي والتواصل معي بخصوص طلبي، حسب سياسة الخصوصية.',
      en: 'I agree that my details are stored and used to contact me about this request, per the privacy policy.',
    },
    submit: { ar: 'أرسل الطلب مجاناً', en: 'Send request for free' },
    sending: { ar: 'جاري الإرسال…', en: 'Sending…' },
    sentOk: { ar: 'وصلنا طلبك. بنتواصل معك خلال ٢٤ ساعة. تذكير: لن نطلب منك أي مبلغ حالياً.', en: 'Request received. We will contact you within 24 hours. Reminder: we will not ask you for any money for now.' },
    sentLocal: { ar: 'تم حفظ الطلب (وضع العرض). في النسخة المنشورة يوصل للفريق مباشرة.', en: 'Request saved (demo mode). In the live app it goes straight to the team.' },
    errFields: { ar: 'اكتب الاسم ورقم جوال صحيح ووافق على الخصوصية.', en: 'Enter your name, a valid mobile number and accept the privacy terms.' },
    guideTitle: { ar: 'وش تجيب لك ميزانيتك', en: 'What your budget buys' },
    searchOn: { ar: 'أفضل مكان تدوّر فيه لهذي الميزانية:', en: 'Best places to search at this budget:' },
    bestHead: { ar: 'أفضل خيار لك', en: 'Your best option' },
    bestLocked: { ar: 'أفضل خيار مخفي', en: 'Best option is hidden' },
    bestLockedText: { ar: 'وافق على الشروط لعرض أفضل خيار. ما في أي دفع الآن.', en: 'Accept the terms to reveal it. No payment now.' },
    revealBtn: { ar: 'اعرض الشروط', en: 'View terms' },
    bModel: { ar: 'الموديل المستهدف', en: 'Target model' },
    bPrice: { ar: 'السعر العادل', en: 'Fair price' },
    bOpen: { ar: 'ابدأ التفاوض من', en: 'Open negotiation at' },
    bKm: { ar: 'أقصى ممشى', en: 'Max mileage' },
    bWhere: { ar: 'دوّر عليها في', en: 'Search on' },
    bWhy: { ar: 'ليش؟', en: 'Why?' },
    bNote: { ar: 'أسعار تقديرية للسوق السعودي. فريقنا يرسل لك إعلانات حقيقية مطابقة.', en: 'Estimated Saudi market prices. Our team sends you real matching listings.' },
    confidence: { ar: 'ثقة', en: 'confidence' },
    platEyebrow: { ar: 'نسبة الثقة', en: 'Trust score' },
    platTitle: { ar: 'أين تشتري؟ المنصات مرتبة حسب الثقة', en: 'Where to buy: platforms ranked by trust' },
    platLead: {
      ar: 'كل نسبة محسوبة من ٦ معايير: الفحص، الضمان والإرجاع، التحقق من البائع، التقييمات، الشفافية، وخدمة ما بعد البيع.',
      en: 'Each score is built from 6 criteria: inspection, warranty and returns, seller checks, reviews, transparency and after-sale support.',
    },
    filterAll: { ar: 'الكل', en: 'All' },
    filterCertified: { ar: 'مفحوصة ومضمونة', en: 'Inspected & warranty' },
    filterMarket: { ar: 'أسواق ومعارض', en: 'Marketplaces' },
    filterClassified: { ar: 'إعلانات أفراد', en: 'Private classifieds' },
    typeCertified: { ar: 'مفحوصة', en: 'Inspected' },
    typeMarketplace: { ar: 'سوق', en: 'Marketplace' },
    typeClassifieds: { ar: 'إعلانات أفراد', en: 'Classifieds' },
    pros: { ar: 'المميزات', en: 'Good' },
    cons: { ar: 'انتبه', en: 'Watch out' },
    breakdown: { ar: 'تفاصيل النسبة', en: 'Score breakdown' },
    visit: { ar: 'زيارة الموقع', en: 'Visit site' },
    c_inspection: { ar: 'الفحص', en: 'Inspection' },
    c_warranty: { ar: 'الضمان', en: 'Warranty' },
    c_sellerCheck: { ar: 'التحقق', en: 'Seller check' },
    c_reviews: { ar: 'التقييمات', en: 'Reviews' },
    c_transparency: { ar: 'الشفافية', en: 'Transparency' },
    c_support: { ar: 'الدعم', en: 'Support' },
    method: {
      ar: 'النسب تقديرية من فريق دليل (سبتمبر ٢٠٢٦) بناءً على سياسات المنصات المعلنة وتقييمات المتاجر ومراجعات العملاء، وتُحدّث كل ربع سنة. ليست تقييماً رسمياً.',
      en: 'Scores are Daleel team estimates (September 2026) from each platform\'s published policies, app-store ratings and customer reviews, updated quarterly. They are not an official rating.',
    },
    safeEyebrow: { ar: 'اشترِ بأمان', en: 'Buy safely' },
    safeTitle: { ar: 'افحص البائع قبل ما تفحص السيارة', en: 'Check the seller before the car' },
    safeLead: { ar: 'خصوصاً في حراج والسوق المفتوح: هذي الأسئلة تكشف أغلب حالات النصب.', en: 'Especially on Haraj and OpenSooq: these questions expose most scams.' },
    sellerTitle: { ar: 'فاحص ثقة البائع', en: 'Seller trust checker' },
    sellerLead: { ar: 'علّم على اللي ينطبق على البائع.', en: 'Tick what is true about the seller.' },
    sellerScore: { ar: 'نسبة الثقة', en: 'Trust score' },
    vLow: { ar: 'خطر: لا تكمل ولا تحوّل أي مبلغ.', en: 'High risk: stop, and do not send any money.' },
    vMid: { ar: 'متوسط: كمّل بحذر، والفحص إلزامي.', en: 'Medium: continue carefully, inspection is a must.' },
    vHigh: { ar: 'جيد: بائع موثوق غالباً. كمّل بالفحص ونقل الملكية عبر أبشر.', en: 'Good: likely trustworthy. Continue with inspection and an Absher transfer.' },
    stepsTitle: { ar: 'خطوات الشراء الآمن', en: 'Safe buying steps' },
    s1: { ar: 'اطلب رقم الهيكل (VIN) واطلع تقرير موجز: الحوادث وعدد الملاك.', en: 'Ask for the VIN and get a Mojaz report: accidents and number of owners.' },
    s2: { ar: 'لا تحوّل عربون أبداً قبل ما تشوف السيارة بعينك.', en: 'Never send a deposit before you see the car yourself.' },
    s3: { ar: 'قابل البائع في مكان عام أو في مركز فحص، ويفضّل معك أحد.', en: 'Meet in a public place or at an inspection centre, ideally with someone.' },
    s4: { ar: 'افحص السيارة في مركز فحص تختاره أنت، مو البائع.', en: 'Inspect the car at a centre you choose, not the seller.' },
    s5: { ar: 'تأكد إن الاستمارة والفحص الدوري ساريين وما عليها مخالفات.', en: 'Confirm registration and periodic inspection are valid with no fines.' },
    s6: { ar: 'انقل الملكية إلكترونياً عبر أبشر، وادفع بتحويل بنكي موثّق فقط.', en: 'Transfer ownership through Absher and pay only by traceable bank transfer.' },
    officialTitle: { ar: 'أدوات رسمية مفيدة', en: 'Useful official tools' },
    respTitle: { ar: 'مسؤوليتك ومسؤوليتنا', en: 'Your responsibility and ours' },
    resp1: {
      ar: 'نحن نوجّهك ونعطيك أفضل خيار تحتاجه، لكن أنت المسؤول عن الفحص الميكانيكي وأي فحوصات أخرى لازمة قبل الشراء.',
      en: 'We guide you and give you the best option you need, but you are responsible for the mechanical inspection and any other checks needed before buying.',
    },
    resp2: {
      ar: 'لاحقاً بنقدّم الفحص بأنفسنا، وممكن نضيف الصيانة والتوصيل.',
      en: 'Later, we will do the inspection ourselves, and we may add maintenance and delivery.',
    },
    roadEyebrow: { ar: 'قريباً', en: 'Coming later' },
    roadTitle: { ar: 'اليوم نوجّهك، وبكرة نخدمك من الباب للباب', en: 'Today we guide you. Later, door-to-door service' },
    nowLbl: { ar: 'متاح الآن · مجاناً', en: 'Available now · free' },
    soonLbl: { ar: 'قريباً', en: 'Coming soon' },
    r1t: { ar: 'التوجيه وأفضل خيار', en: 'Guidance and best option' },
    r1d: { ar: 'نبحث ونرشّح ونفاوض معك.', en: 'We search, recommend and help you negotiate.' },
    r2t: { ar: 'الفحص', en: 'Inspection' },
    r2d: { ar: 'فحص ميكانيكي وكهربائي بتقرير واضح.', en: 'Mechanical and electrical inspection with a clear report.' },
    r3t: { ar: 'الصيانة', en: 'Maintenance' },
    r3d: { ar: 'ورش موثوقة بأسعار متفق عليها.', en: 'Trusted workshops at agreed prices.' },
    r4t: { ar: 'التوصيل', en: 'Delivery' },
    r4d: { ar: 'نوصّل السيارة لباب بيتك.', en: 'We bring the car to your door.' },
    rateEyebrow: { ar: 'رأيك يهمنا', en: 'Your opinion matters' },
    rateTitle: { ar: 'قيّم تجربتك مع دليل', en: 'Rate your experience with Daleel' },
    rateLead: { ar: 'التقييمات تساعد غيرك يثق، وتساعدنا نتحسن.', en: 'Ratings help others trust us, and help us improve.' },
    rateName: { ar: 'اسمك (اختياري)', en: 'Your name (optional)' },
    rateComment: { ar: 'تعليقك', en: 'Your comment' },
    rateSubmit: { ar: 'أرسل التقييم', en: 'Send rating' },
    rateThanks: { ar: 'شكراً لتقييمك!', en: 'Thanks for your rating!' },
    rateNeedStars: { ar: 'اختر عدد النجوم أولاً.', en: 'Choose a star rating first.' },
    ratings: { ar: 'تقييم', en: 'ratings' },
    noReviews: { ar: 'كن أول من يقيّم دليل.', en: 'Be the first to rate Daleel.' },
    guest: { ar: 'عميل', en: 'Customer' },
    footer1: {
      ar: 'دليل منصة توجيه وليست طرفاً في عملية البيع. خلال الفترة التجريبية لن نطلب منك أي مبلغ.',
      en: 'Daleel is a guidance service and is not a party to any sale. During the trial period we will not ask you for any money.',
    },
    footerTerms: { ar: 'الشروط والأحكام', en: 'Terms and conditions' },
    footerPrivacy: { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
    termsTitle: { ar: 'الشروط والأحكام', en: 'Terms and conditions' },
    termsFree: { ar: 'حالياً لن نطلب منك أي مبلغ. الدفع متوقف خلال الفترة التجريبية.', en: 'For now we will not ask you for any money. Payments are off during the trial period.' },
    t1: {
      ar: 'إذا أتممت شراء سيارة رشّحناها لك، توافق على تحويل رسوم خدمة قدرها ٥٠٠ ريال سعودي لدليل (بعد انتهاء الفترة التجريبية وتفعيل الدفع).',
      en: 'If you complete the purchase of a car we recommended, you agree to transfer a 500 SAR service fee to Daleel (after the trial ends and payments are switched on).',
    },
    t2: { ar: 'تحويل الرسوم على مسؤوليتك وأمانتك الشخصية.', en: 'Paying this fee is your own responsibility and on your honour.' },
    t3: { ar: 'لن نرفع عليك أي قضية أو نلاحقك قانونياً بخصوص هذه الرسوم.', en: 'We will not sue you or take any legal action against you over this fee.' },
    t4: {
      ar: 'نوجّهك ونعطيك أفضل خيار، لكن أنت المسؤول عن الفحص الميكانيكي وفحص الأوراق وقرار الشراء النهائي. دليل ليس طرفاً في البيع.',
      en: 'We guide you and give you the best option, but you are responsible for the mechanical check, paperwork check and the final decision. Daleel is not a party to the sale.',
    },
    t5: { ar: 'نستخدم بياناتك لخدمة طلبك وتحسين الخدمة فقط، ولا نبيعها لأي طرف.', en: 'We use your data only to serve your request and improve the service, and never sell it.' },
    termsCheck: { ar: 'قرأت الشروط وأوافق عليها', en: 'I have read and accept the terms' },
    termsAgree: { ar: 'أوافق، اعرض أفضل خيار', en: 'I agree, show the best option' },
    termsCancel: { ar: 'ليس الآن', en: 'Not now' },
    privacyTitle: { ar: 'سياسة الخصوصية', en: 'Privacy policy' },
    privacyText: {
      ar: 'نجمع: الاسم، رقم الجوال، المدينة، تفاصيل السيارة والميزانية، التقييمات، وبيانات زيارة مجهولة (الصفحة، اللغة، مصدر الزيارة، نوع الجهاز). نستخدمها للتواصل معك بخصوص طلبك وتحسين الخدمة، وفق نظام حماية البيانات الشخصية في المملكة. لا نبيع بياناتك. لطلب حذف بياناتك تواصل معنا وسنحذفها خلال ٣٠ يوماً.',
      en: 'We collect: name, mobile number, city, car and budget details, ratings, and anonymous visit data (page, language, referrer, device type). We use it to contact you about your request and improve the service, in line with the Saudi Personal Data Protection Law. We do not sell your data. Ask us to delete your data and we will do so within 30 days.',
    },
    close: { ar: 'إغلاق', en: 'Close' },
    revealed: { ar: 'تم! هذا أفضل خيار لك.', en: 'Done! Here is your best option.' },
    sar: { ar: 'ر.س', en: 'SAR' },
    km: { ar: 'كم', en: 'km' },
    choose: { ar: 'اختر', en: 'Choose' },
  };

  // Urdu text, merged into T below.
  const UR = {
    brand: 'دلیل',
    tagline: 'استعمال شدہ گاڑی خریدنے میں آپ کا ماہر',
    trial: 'آزمائشی مدت: فی الحال ایپ آپ سے کوئی رقم نہیں مانگے گی۔ ادائیگی کی سہولت بند ہے۔',
    navHome: 'ہوم',
    navRequest: 'گاڑی تلاش کریں',
    navPlatforms: 'پلیٹ فارمز',
    navSafety: 'محفوظ خریداری',
    navRate: 'ریٹنگ دیں',
    heroEyebrow: 'استعمال شدہ گاڑیاں · سعودی عرب',
    heroTitle: 'اپنی استعمال شدہ گاڑی <em>ماہر کے ساتھ</em> خریدیں جو آپ کے لیے بہترین سودا ڈھونڈے',
    heroLead: 'ہمیں بتائیں آپ کو کون سی گاڑی چاہیے، یا صرف یہ کہ آپ کے پاس کتنی رقم ہے، چاہے 5,000 ریال ہی ہوں، اور ہم قابلِ اعتماد پلیٹ فارمز اور بیچنے والوں میں سے بہترین آپشن تجویز کریں گے۔ پہلی بار خریدنے والوں اور ان خواتین کے لیے جو قابلِ اعتماد مشیر چاہتی ہیں۔',
    ctaBudget: 'میرا بجٹ ہے',
    ctaSpecific: 'مجھے خاص گاڑی چاہیے',
    statVisits: 'وزٹس',
    statRequests: 'گاڑی کی درخواستیں',
    statRating: 'صارفین کی ریٹنگ',
    demoNote: 'ڈیمو موڈ: ڈیٹا صرف اسی ڈیوائس پر محفوظ ہے۔',
    plateCaption: 'چاہے آپ کا بجٹ 5,000 ریال ہو، ہم رہنمائی کریں گے۔',
    point1: 'ہر پلیٹ فارم کا اعتماد اسکور، معائنہ، وارنٹی اور ریویوز کی بنیاد پر',
    point2: 'کسی سے ملنے سے پہلے بیچنے والے کے اعتماد کی جانچ',
    point3: 'درخواست پر خاتون مشیر، اور چاہیں تو صرف واٹس ایپ پر رابطہ',
    reqEyebrow: 'مرحلہ 1',
    reqTitle: 'آپ کیا تلاش کر رہے ہیں؟',
    reqLead: 'بجٹ تبدیل کریں اور فوراً دیکھیں کہ اس میں کیا ملتا ہے۔ درخواست بھیجیں، ہماری ٹیم بہترین اشتہارات کے ساتھ آپ سے رابطہ کرے گی۔',
    modeBudget: 'میرا بجٹ',
    modeSpecific: 'خاص گاڑی',
    budgetLabel: 'آپ کا بجٹ (ریال)',
    budgetNote: 'کوئی بجٹ چھوٹا نہیں۔ 5,000 ریال سے اوپر، ہم مناسب گاڑی ڈھونڈ دیں گے۔',
    make: 'کمپنی',
    model: 'ماڈل',
    yearFrom: 'سالِ ساخت (سے)',
    bodyType: 'گاڑی کی قسم',
    usage: 'استعمال',
    name: 'نام',
    phone: 'موبائل نمبر',
    city: 'شہر',
    contact: 'رابطے کا طریقہ',
    femaleAdvisor: 'خاتون مشیر کو ترجیح',
    firstCar: 'یہ میری پہلی گاڑی کی خریداری ہے',
    notes: 'نوٹس (رنگ، گیئر باکس، جو بھی اہم ہو)',
    consent: 'میں اتفاق کرتا/کرتی ہوں کہ پرائیویسی پالیسی کے مطابق میری معلومات محفوظ کی جائیں اور اس درخواست کے بارے میں مجھ سے رابطہ کیا جائے۔',
    submit: 'مفت درخواست بھیجیں',
    sending: 'بھیجا جا رہا ہے…',
    sentOk: 'آپ کی درخواست موصول ہو گئی۔ ہم 24 گھنٹوں میں رابطہ کریں گے۔ یاد رہے: فی الحال ہم آپ سے کوئی رقم نہیں مانگیں گے۔',
    sentLocal: 'درخواست محفوظ ہو گئی (ڈیمو موڈ)۔ اصل ایپ میں یہ سیدھی ٹیم کو پہنچتی ہے۔',
    errFields: 'نام اور درست موبائل نمبر لکھیں اور پرائیویسی شرائط قبول کریں۔',
    guideTitle: 'آپ کے بجٹ میں کیا ملتا ہے',
    searchOn: 'اس بجٹ کے لیے تلاش کی بہترین جگہیں:',
    bestHead: 'آپ کا بہترین آپشن',
    bestLocked: 'بہترین آپشن چھپا ہوا ہے',
    bestLockedText: 'دیکھنے کے لیے شرائط قبول کریں۔ ابھی کوئی ادائیگی نہیں۔',
    revealBtn: 'شرائط دیکھیں',
    bModel: 'مطلوبہ ماڈل',
    bPrice: 'مناسب قیمت',
    bOpen: 'بات چیت یہاں سے شروع کریں',
    bKm: 'زیادہ سے زیادہ کلومیٹر',
    bWhere: 'یہاں تلاش کریں',
    bWhy: 'کیوں؟',
    bNote: 'سعودی مارکیٹ کی اندازاً قیمتیں۔ ہماری ٹیم آپ کو حقیقی اشتہارات بھیجے گی۔',
    confidence: 'اعتماد',
    platEyebrow: 'اعتماد اسکور',
    platTitle: 'کہاں سے خریدیں: اعتماد کے لحاظ سے پلیٹ فارمز',
    platLead: 'ہر اسکور 6 معیارات سے بنتا ہے: معائنہ، وارنٹی اور واپسی، بیچنے والے کی تصدیق، ریویوز، شفافیت، اور فروخت کے بعد سپورٹ۔',
    filterAll: 'سب',
    filterCertified: 'معائنہ شدہ اور وارنٹی',
    filterMarket: 'مارکیٹ پلیسز',
    filterClassified: 'انفرادی اشتہارات',
    typeCertified: 'معائنہ شدہ',
    typeMarketplace: 'مارکیٹ پلیس',
    typeClassifieds: 'انفرادی اشتہارات',
    pros: 'خوبیاں',
    cons: 'احتیاط',
    breakdown: 'اسکور کی تفصیل',
    visit: 'ویب سائٹ دیکھیں',
    c_inspection: 'معائنہ',
    c_warranty: 'وارنٹی',
    c_sellerCheck: 'تصدیق',
    c_reviews: 'ریویوز',
    c_transparency: 'شفافیت',
    c_support: 'سپورٹ',
    method: 'یہ اسکور دلیل ٹیم کے اندازے ہیں (ستمبر 2026)، جو پلیٹ فارمز کی شائع شدہ پالیسیوں، ایپ اسٹور ریٹنگز اور صارفین کے ریویوز پر مبنی ہیں اور ہر سہ ماہی اپڈیٹ ہوتے ہیں۔ یہ سرکاری ریٹنگ نہیں ہے۔',
    safeEyebrow: 'محفوظ خریداری',
    safeTitle: 'گاڑی سے پہلے بیچنے والے کو جانچیں',
    safeLead: 'خاص طور پر حراج اور اوپن سوق پر: یہ سوالات زیادہ تر دھوکے پکڑ لیتے ہیں۔',
    sellerTitle: 'بیچنے والے کا اعتماد چیکر',
    sellerLead: 'جو باتیں بیچنے والے پر درست ہوں ان پر نشان لگائیں۔',
    sellerScore: 'اعتماد اسکور',
    vLow: 'زیادہ خطرہ: رک جائیں اور کوئی رقم نہ بھیجیں۔',
    vMid: 'درمیانہ: احتیاط سے آگے بڑھیں، معائنہ لازمی ہے۔',
    vHigh: 'اچھا: غالباً قابلِ اعتماد۔ معائنہ کروائیں اور ابشر کے ذریعے ملکیت منتقل کریں۔',
    stepsTitle: 'محفوظ خریداری کے مراحل',
    s1: 'چیسس نمبر (VIN) مانگیں اور موجز رپورٹ نکالیں: حادثات اور مالکان کی تعداد۔',
    s2: 'گاڑی خود دیکھنے سے پہلے کبھی بیعانہ نہ بھیجیں۔',
    s3: 'عوامی جگہ یا معائنہ مرکز پر ملیں، بہتر ہے کسی کو ساتھ لے جائیں۔',
    s4: 'گاڑی کا معائنہ اپنی پسند کے مرکز پر کروائیں، بیچنے والے کی پسند پر نہیں۔',
    s5: 'تصدیق کریں کہ استمارہ اور فحص دوری درست ہیں اور کوئی جرمانہ نہیں۔',
    s6: 'ملکیت ابشر کے ذریعے منتقل کریں اور صرف قابلِ تصدیق بینک ٹرانسفر سے ادائیگی کریں۔',
    officialTitle: 'مفید سرکاری ٹولز',
    respTitle: 'آپ کی ذمہ داری اور ہماری',
    resp1: 'ہم آپ کی رہنمائی کرتے ہیں اور آپ کو بہترین آپشن دیتے ہیں، لیکن خریدنے سے پہلے مکینیکل معائنہ اور دیگر ضروری جانچ کی ذمہ داری آپ کی ہے۔',
    resp2: 'بعد میں ہم خود معائنہ کریں گے، اور ممکن ہے مرمت اور ڈیلیوری بھی شامل کریں۔',
    roadEyebrow: 'جلد آ رہا ہے',
    roadTitle: 'آج ہم رہنمائی کرتے ہیں، بعد میں گھر تک سروس',
    nowLbl: 'ابھی دستیاب · مفت',
    soonLbl: 'جلد آ رہا ہے',
    r1t: 'رہنمائی اور بہترین آپشن',
    r1d: 'ہم تلاش کرتے ہیں، تجویز دیتے ہیں اور قیمت طے کرنے میں مدد کرتے ہیں۔',
    r2t: 'معائنہ',
    r2d: 'واضح رپورٹ کے ساتھ مکینیکل اور الیکٹریکل معائنہ۔',
    r3t: 'مرمت',
    r3d: 'طے شدہ قیمتوں پر قابلِ اعتماد ورکشاپس۔',
    r4t: 'ڈیلیوری',
    r4d: 'گاڑی آپ کے دروازے تک۔',
    rateEyebrow: 'آپ کی رائے اہم ہے',
    rateTitle: 'دلیل کے ساتھ اپنے تجربے کی ریٹنگ دیں',
    rateLead: 'ریٹنگز دوسروں کو اعتماد دیتی ہیں اور ہمیں بہتر بننے میں مدد کرتی ہیں۔',
    rateName: 'آپ کا نام (اختیاری)',
    rateComment: 'آپ کا تبصرہ',
    rateSubmit: 'ریٹنگ بھیجیں',
    rateThanks: 'ریٹنگ کا شکریہ!',
    rateNeedStars: 'پہلے ستاروں کی تعداد منتخب کریں۔',
    ratings: 'ریٹنگز',
    noReviews: 'دلیل کو ریٹنگ دینے والے پہلے فرد بنیں۔',
    guest: 'صارف',
    footer1: 'دلیل ایک رہنمائی سروس ہے اور کسی بھی فروخت میں فریق نہیں۔ آزمائشی مدت کے دوران ہم آپ سے کوئی رقم نہیں مانگیں گے۔',
    footerTerms: 'شرائط و ضوابط',
    footerPrivacy: 'پرائیویسی پالیسی',
    termsTitle: 'شرائط و ضوابط',
    termsFree: 'فی الحال ہم آپ سے کوئی رقم نہیں مانگیں گے۔ آزمائشی مدت میں ادائیگی بند ہے۔',
    t1: 'اگر آپ ہماری تجویز کردہ گاڑی کی خریداری مکمل کرتے ہیں تو آپ دلیل کو 500 سعودی ریال سروس فیس منتقل کرنے پر متفق ہیں (آزمائشی مدت ختم ہونے اور ادائیگی شروع ہونے کے بعد)۔',
    t2: 'یہ فیس ادا کرنا آپ کی اپنی ذمہ داری اور امانت پر ہے۔',
    t3: 'ہم اس فیس کے سلسلے میں آپ کے خلاف کوئی مقدمہ یا قانونی کارروائی نہیں کریں گے۔',
    t4: 'ہم آپ کی رہنمائی کرتے ہیں اور بہترین آپشن دیتے ہیں، لیکن مکینیکل معائنہ، کاغذات کی جانچ اور حتمی فیصلہ آپ کی ذمہ داری ہے۔ دلیل فروخت میں فریق نہیں ہے۔',
    t5: 'ہم آپ کا ڈیٹا صرف آپ کی درخواست پوری کرنے اور سروس بہتر بنانے کے لیے استعمال کرتے ہیں، اور کبھی فروخت نہیں کرتے۔',
    termsCheck: 'میں نے شرائط پڑھ لی ہیں اور قبول کرتا/کرتی ہوں',
    termsAgree: 'میں متفق ہوں، بہترین آپشن دکھائیں',
    termsCancel: 'ابھی نہیں',
    privacyTitle: 'پرائیویسی پالیسی',
    privacyText: 'ہم جمع کرتے ہیں: نام، موبائل نمبر، شہر، گاڑی اور بجٹ کی تفصیلات، ریٹنگز، اور گمنام وزٹ ڈیٹا (صفحہ، زبان، ریفرر، ڈیوائس کی قسم)۔ ہم اسے آپ کی درخواست کے بارے میں رابطے اور سروس بہتر بنانے کے لیے، سعودی ذاتی ڈیٹا تحفظ قانون کے مطابق استعمال کرتے ہیں۔ ہم آپ کا ڈیٹا فروخت نہیں کرتے۔ ڈیٹا حذف کروانے کے لیے ہم سے رابطہ کریں، ہم 30 دن میں حذف کر دیں گے۔',
    close: 'بند کریں',
    revealed: 'ہو گیا! یہ رہا آپ کا بہترین آپشن۔',
    sar: 'ریال',
    km: 'کلومیٹر',
    choose: 'منتخب کریں',
  };
  for (const [k, v] of Object.entries(UR)) if (T[k]) T[k].ur = v;

  // Search-engine text (overrides and additions), in ar / en / ur.
  Object.assign(T, {
    wsBar: { ar: 'ورش موثوقة في المدينة المنورة', en: 'Trusted workshops in Al-Madinah', ur: 'مدینہ منورہ میں قابلِ اعتماد ورکشاپس' },
    wsBarGo: { ar: 'اعرض ←', en: 'View →', ur: 'دیکھیں ←' },
    navWorkshops: { ar: 'الورش', en: 'Workshops', ur: 'ورکشاپس' },
    wsTitle: { ar: 'ورش موثوقة في المدينة المنورة', en: 'Trusted workshops in Al-Madinah', ur: 'مدینہ منورہ میں قابلِ اعتماد ورکشاپس' },
    liveLbl: { ar: 'أرقام حقيقية مباشرة', en: 'Real, live numbers', ur: 'حقیقی، براہِ راست اعداد' },
    statToday: { ar: 'زيارة اليوم', en: 'visits today', ur: 'آج کے وزٹس' },
    statVisits: { ar: 'إجمالي الزيارات', en: 'total visits', ur: 'کل وزٹس' },
    wsPerk1: { ar: 'معاملة خاصة لعملاء أفضل المعروض', en: 'Special treatment for Best Car Offers customers', ur: 'بہترین پیشکش کاریں کے صارفین کے لیے خصوصی سلوک' },
    wsPerk2: { ar: 'أولوية في المواعيد والخدمة', en: 'Priority in appointments and service', ur: 'اپائنٹمنٹ اور سروس میں ترجیح' },
    wsPerk3: { ar: 'ظهور ورشتك لعملائنا في المدينة المنورة', en: 'Your workshop shown to our customers in Al-Madinah', ur: 'مدینہ منورہ میں ہمارے صارفین کو آپ کی ورکشاپ کی نمائش' },
    wsContact: { ar: 'تواصل معنا:', en: 'Contact us:', ur: 'ہم سے رابطہ کریں:' },
    emailLbl: { ar: 'البريد الإلكتروني', en: 'Email', ur: 'ای میل' },
    phoneLbl: { ar: 'الجوال', en: 'Phone', ur: 'فون' },
    supportTitle: { ar: 'خدمة العملاء', en: 'Customer support', ur: 'کسٹمر سپورٹ' },
    supportLead: { ar: 'لأي سؤال أو مشكلة أو اقتراح، تواصل معنا مباشرة.', en: 'For any question, problem or suggestion, contact us directly.', ur: 'کسی بھی سوال، مسئلے یا تجویز کے لیے ہم سے براہِ راست رابطہ کریں۔' },
    sendFailed: { ar: 'تعذّر الإرسال الآن. راسلنا على dromda@hotmail.com', en: 'Could not send right now. Email us at dromda@hotmail.com', ur: 'ابھی بھیجا نہیں جا سکا۔ ہمیں dromda@hotmail.com پر ای میل کریں' },
    wsLead: {
      ar: 'عندك ورشة موثوقة في المدينة المنورة؟ انضم لشركائنا وقدّم لعملائنا:',
      en: 'Do you run a trusted workshop in Al-Madinah? Join our partners and give our customers:',
      ur: 'کیا آپ مدینہ منورہ میں قابلِ اعتماد ورکشاپ چلاتے ہیں؟ ہمارے شراکت داروں میں شامل ہوں اور ہمارے صارفین کو دیں:',
    },
    wsWarn: {
      ar: 'اطلب تقرير فحص مكتوب وسعر واضح قبل أي إصلاح. أنت المسؤول عن اختيار الورشة.',
      en: 'Ask for a written inspection report and a clear price before any repair. Choosing the workshop is your responsibility.',
      ur: 'کسی بھی مرمت سے پہلے تحریری معائنہ رپورٹ اور واضح قیمت مانگیں۔ ورکشاپ کا انتخاب آپ کی ذمہ داری ہے۔',
    },
    lowTitle: { ar: 'أرخص العروض الحقيقية الآن', en: 'The cheapest real offers right now', ur: 'ابھی کی سب سے سستی حقیقی پیشکشیں' },
    lowLead: {
      ar: 'السيارات الاقتصادية هي تخصصنا. جمعنا لك كل مكان فيه سيارات بسعرك، مرتبة حسب الثقة، مع الأحدث أولاً.',
      en: 'Budget cars are our focus. Every place with cars at your price, ranked by trust, newest first.',
      ur: 'کم قیمت گاڑیاں ہماری خصوصیت ہیں۔ ہر وہ جگہ جہاں آپ کی قیمت پر گاڑیاں ہیں، اعتماد کے لحاظ سے، تازہ ترین پہلے۔',
    },
    lowWarn: {
      ar: 'تحذير: أغلب هذي المصادر إعلانات أفراد بدون تحقق. قابل البائع في مكان عام، افحص السيارة، ولا تحوّل أي مبلغ قبل نقل الملكية عبر أبشر.',
      en: 'Warning: most of these are unverified private ads. Meet the seller in a public place, inspect the car, and never send money before the Absher transfer.',
      ur: 'انتباہ: ان میں سے زیادہ تر غیر تصدیق شدہ نجی اشتہارات ہیں۔ بیچنے والے سے عوامی جگہ ملیں، گاڑی کا معائنہ کریں، اور ابشر منتقلی سے پہلے کبھی رقم نہ بھیجیں۔',
    },
    lowTrustWarn: { ar: 'ثقة منخفضة', en: 'Low trust', ur: 'کم اعتماد' },
    newest: { ar: 'الأحدث', en: 'Newest', ur: 'تازہ ترین' },
    checking: { ar: 'نتحقق الآن من توفر السيارة في كل موقع…', en: 'Checking which sites have this car right now…', ur: 'ابھی چیک کر رہے ہیں کہ کن سائٹس پر یہ گاڑی ہے…' },
    checkedAt: { ar: 'تم التحقق من التوفر الآن', en: 'Availability checked just now', ur: 'دستیابی ابھی چیک کی گئی' },
    avail: { ar: 'متوفر', en: 'Available', ur: 'دستیاب' },
    ads: { ar: 'إعلان', en: 'ads', ur: 'اشتہارات' },
    fromPrice: { ar: 'من', en: 'from', ur: 'سے' },
    notChecked: { ar: 'لم نتحقق', en: 'Not verified', ur: 'تصدیق نہیں ہوئی' },
    aboveBudget: { ar: 'أغلى من ميزانيتك', en: 'Above your budget', ur: 'آپ کے بجٹ سے زیادہ' },
    hiddenNone: { ar: 'أخفينا مواقع ما فيها هذي السيارة حالياً: ', en: 'Hidden because they have no such car right now: ', ur: 'پوشیدہ کیونکہ ابھی ان پر یہ گاڑی نہیں: ' },
    m2t: { ar: 'ورش وقطع غيار موثوقة', en: 'Trusted workshops and spare parts', ur: 'قابلِ اعتماد ورکشاپس اور اسپیئر پارٹس' },
    m2d: { ar: 'اتفاقيات مع ورش ومحلات قطع غيار في المدينة تقدم عناية إضافية لعملائنا.', en: 'Agreements with workshops and spare-parts shops in Madinah that give our customers extra care.', ur: 'مدینہ کی ورکشاپس اور پارٹس کی دکانوں سے معاہدے جو ہمارے صارفین کو اضافی توجہ دیں گی۔' },
    optionsSub: { ar: 'موديلات تناسب مبلغك. اضغط على أي موديل لعرض إعلاناته.', en: 'Models that fit your money. Tap one to see its ads.', ur: 'آپ کی رقم کے مطابق ماڈلز۔ اشتہارات دیکھنے کے لیے کسی پر ٹیپ کریں۔' },
    method: {
      ar: 'نسبة الثقة تقديرية من فريقنا حسب الفحص والضمان وتقييمات العملاء (سبتمبر ٢٠٢٦).',
      en: 'Trust scores are our team\'s estimate from inspection, warranty and customer reviews (September 2026).',
      ur: 'اعتماد اسکور ہماری ٹیم کا اندازہ ہے، معائنہ، وارنٹی اور صارفین کے ریویوز کی بنیاد پر (ستمبر 2026)۔',
    },
    trial: { ar: 'فترة تجريبية مجانية: لن نطلب منك أي مبلغ حالياً.', en: 'Free trial period: we will not ask you for any money for now.', ur: 'مفت آزمائشی مدت: فی الحال ہم آپ سے کوئی رقم نہیں مانگیں گے۔' },
    cityBadge: { ar: 'نبدأ من المدينة المنورة', en: 'Starting in Al-Madinah', ur: 'ہم مدینہ منورہ سے شروع کر رہے ہیں' },
    navMadinah: { ar: 'المدينة', en: 'Madinah', ur: 'مدینہ' },
    navYours: { ar: 'اقتراحك', en: 'Suggest', ur: 'تجویز' },
    moreOptions: { ar: 'خيارات أكثر: السنة، النوع، المواصفات', en: 'More options: year, type, features', ur: 'مزید آپشنز: سال، قسم، خصوصیات' },
    low1t: { ar: 'إعلانات بسعرك بالضبط', en: 'Ads at your exact price', ur: 'آپ کی قیمت کے عین مطابق اشتہارات' },
    low1d: { ar: 'بحث في حراج والسوق المفتوح عن سيارات معروضة بمبلغك تقريباً.', en: 'Searches Haraj and OpenSooq for cars listed at about your amount.', ur: 'حراج اور اوپن سوق پر تقریباً آپ کی رقم میں دستیاب گاڑیاں تلاش کرتا ہے۔' },
    low2t: { ar: 'أرخص الموديلات الموثوقة', en: 'Cheapest reliable models', ur: 'سب سے سستے قابلِ اعتماد ماڈلز' },
    low2d: { ar: 'موديلات قطعها رخيصة وتتحمل، مع روابطها تحت.', en: 'Models with cheap parts that last, with links below.', ur: 'سستے پرزوں والے پائیدار ماڈلز، نیچے لنکس کے ساتھ۔' },
    low3t: { ar: 'خلّ مبلغك دفعة أولى', en: 'Use your money as a down payment', ur: 'اپنی رقم کو پہلی قسط بنائیں' },
    low3d: { ar: 'سوم وسيارة فيها تقسيط، وسوم بدون فوائد (حسب موافقة جهة التمويل). سياراتهم تبدأ من حوالي ٢٠ ألف.', en: 'Soum and Syarah offer installments, Soum interest-free (subject to financing approval). Their cars start around 20,000 SAR.', ur: 'سوم اور سیارہ قسطیں دیتے ہیں، سوم بغیر سود (فنانسنگ کی منظوری سے مشروط)۔ ان کی گاڑیاں تقریباً 20,000 ریال سے شروع ہوتی ہیں۔' },
    lowGo: { ar: 'افتح', en: 'Open', ur: 'کھولیں' },
    lowSee: { ar: 'شوفها', en: 'See them', ur: 'دیکھیں' },
    hiddenSoum: { ar: 'سوم غير ظاهر لأن سياراته تبدأ من حوالي ٢٠ ألف ريال. ارفع الميزانية أو جرّب التقسيط.', en: 'Soum is hidden because its cars start around 20,000 SAR. Raise the budget or try installments.', ur: 'سوم نظر نہیں آ رہا کیونکہ اس کی گاڑیاں تقریباً 20,000 ریال سے شروع ہوتی ہیں۔ بجٹ بڑھائیں یا قسطیں آزمائیں۔' },
    madTitle: { ar: 'قريباً في المدينة المنورة', en: 'Coming soon to Al-Madinah', ur: 'جلد مدینہ منورہ میں' },
    madLead: { ar: 'بدأنا من المدينة المنورة، وقريباً:', en: 'We are starting in Al-Madinah, and soon:', ur: 'ہم مدینہ منورہ سے شروع کر رہے ہیں، اور جلد:' },
    m1t: { ar: 'عروض حقيقية من معارض السيارات', en: 'Real offers from car showrooms', ur: 'کار شورومز سے حقیقی پیشکشیں' },
    m1d: { ar: 'اتفاقيات مع معارض في المدينة لعرض سيارات حقيقية على المنصة تحت مسؤوليتنا.', en: 'Agreements with Madinah showrooms to list real cars on the platform under our responsibility.', ur: 'مدینہ کے شورومز سے معاہدے تاکہ حقیقی گاڑیاں ہماری ذمہ داری پر پلیٹ فارم پر دکھائی جائیں۔' },
    m3t: { ar: 'الفحص والصيانة والتوصيل', en: 'Inspection, maintenance and delivery', ur: 'معائنہ، مرمت اور ڈیلیوری' },
    m3d: { ar: 'نفحص السيارة بأنفسنا، وممكن نضيف الصيانة والتوصيل.', en: 'We inspect the car ourselves, and may add maintenance and delivery.', ur: 'ہم خود گاڑی کا معائنہ کریں گے، اور ممکن ہے مرمت اور ڈیلیوری بھی شامل کریں۔' },
    m4t: { ar: 'مستشار شخصي وواتساب', en: 'Personal advisor & WhatsApp', ur: 'ذاتی مشیر اور واٹس ایپ' },
    m4d: { ar: 'بعد استكمال الأوراق الرسمية.', en: 'After our official paperwork is complete.', ur: 'سرکاری کاغذات مکمل ہونے کے بعد۔' },
    yoursTitle: { ar: 'هذي منصتك', en: 'This is your platform', ur: 'یہ آپ کا پلیٹ فارم ہے' },
    yoursLead: { ar: 'أي اقتراح أو ملاحظة تسعدنا وتفرق معنا. قيّمنا واكتب رأيك.', en: 'Every suggestion or comment is appreciated and makes a difference. Rate us and tell us what you think.', ur: 'ہر تجویز یا رائے کی قدر کی جاتی ہے اور فرق ڈالتی ہے۔ ہمیں ریٹ کریں اور اپنی رائے بتائیں۔' },
    sugLabel: { ar: 'اقتراحك أو ملاحظتك', en: 'Your suggestion or comment', ur: 'آپ کی تجویز یا رائے' },
    rateLabel: { ar: 'تقييمك (اختياري)', en: 'Your rating (optional)', ur: 'آپ کی ریٹنگ (اختیاری)' },
    sendBtn: { ar: 'أرسل', en: 'Send', ur: 'بھیجیں' },
    sentThanks: { ar: 'شكراً! وصلنا اقتراحك.', en: 'Thank you! We received your suggestion.', ur: 'شکریہ! آپ کی تجویز موصول ہو گئی۔' },
    needSomething: { ar: 'اكتب اقتراحك أو اختر تقييم.', en: 'Write a suggestion or pick a rating.', ur: 'تجویز لکھیں یا ریٹنگ منتخب کریں۔' },
    searchTitle: { ar: 'وش تدور عليه؟', en: 'What are you looking for?', ur: 'آپ کیا تلاش کر رہے ہیں؟' },
    platTitle: { ar: 'المواقع مرتبة حسب الثقة', en: 'Sites ranked by trust', ur: 'اعتماد کے لحاظ سے سائٹس' },
    platLead: { ar: 'اضغط على أي موقع لتشوف المميزات والملاحظات.', en: 'Tap any site to see its pros and cautions.', ur: 'خوبیاں اور احتیاطیں دیکھنے کے لیے کسی بھی سائٹ پر ٹیپ کریں۔' },
    safeTitle: { ar: 'اشترِ بأمان', en: 'Buy safely', ur: 'محفوظ خریداری' },
    brand: { ar: 'أفضل المعروض للسيارات', en: 'Best Car Offers', ur: 'بہترین پیشکش کاریں' },
    tagline: { ar: 'محرك بحث السيارات المستعملة', en: 'Used-car search engine', ur: 'استعمال شدہ گاڑیوں کا سرچ انجن' },
    navSearch: { ar: 'ابحث', en: 'Search', ur: 'تلاش' },
    heroEyebrow: { ar: 'محرك بحث السيارات المستعملة · السعودية', en: 'Used-car search engine · Saudi Arabia', ur: 'استعمال شدہ گاڑیوں کا سرچ انجن · سعودی عرب' },
    heroTitle: {
      ar: 'كل عروض السيارات <em>في بحث واحد</em>',
      en: 'Every used-car offer <em>in one search</em>',
      ur: 'تمام گاڑیوں کی پیشکشیں <em>ایک ہی تلاش میں</em>',
    },
    heroLead: {
      ar: 'قل لنا كم معك، ولو ٥٠٠٠ ريال، أو اختر الموديل. نفتح لك أفضل العروض في حراج وسيارة وسوم وغيرها مباشرة.',
      en: 'Tell us how much you have, even 5,000 SAR, or pick a model. We open the best offers on Haraj, Syarah, Soum and more, directly.',
      ur: 'بتائیں آپ کے پاس کتنی رقم ہے، چاہے 5,000 ریال، یا ماڈل منتخب کریں۔ ہم حراج، سیارہ، سوم اور دیگر پر بہترین پیشکشیں براہِ راست کھول دیں گے۔',
    },
    ctaSearch: { ar: 'ابحث الآن', en: 'Search now', ur: 'ابھی تلاش کریں' },
    ctaPlatforms: { ar: 'المواقع الموثوقة', en: 'Trusted sites', ur: 'قابلِ اعتماد سائٹس' },
    statSearches: { ar: 'عملية بحث', en: 'searches', ur: 'تلاشیں' },
    plateCaption: { ar: 'حتى لو معك ٥٠٠٠ ريال، نوريك أفضل المعروض.', en: 'Even with 5,000 SAR, we show you the best offers.', ur: 'چاہے 5,000 ریال ہوں، ہم آپ کو بہترین پیشکشیں دکھائیں گے۔' },
    point1: { ar: 'روابط مباشرة لنتائج كل موقع حسب الموديل والسنة والمدينة', en: 'Direct links to each site\'s results by model, year and city', ur: 'ماڈل، سال اور شہر کے مطابق ہر سائٹ کے نتائج کے براہِ راست لنکس' },
    point2: { ar: 'بحث عميق داخل نص كل إعلان عن المواصفات اللي تبيها', en: 'Deep search inside every ad\'s text for the features you want', ur: 'ہر اشتہار کے متن میں آپ کی مطلوبہ خصوصیات کی گہری تلاش' },
    from: { ar: 'من', en: 'from', ur: 'سے' },
    point3: { ar: 'نسبة ثقة لكل موقع وفاحص ثقة للبائع', en: 'A trust score for every site and a seller trust checker', ur: 'ہر سائٹ کا اعتماد اسکور اور بیچنے والے کا اعتماد چیکر' },
    searchEyebrow: { ar: 'محرك البحث', en: 'Search engine', ur: 'سرچ انجن' },
    searchLead: {
      ar: 'حدد ميزانيتك، وإذا تبي اختر الشركة والموديل والسنة والمواصفات. النتائج تتحدث مباشرة.',
      en: 'Set your budget, and if you like pick the make, model, year and features. Results update instantly.',
      ur: 'اپنا بجٹ طے کریں، اور چاہیں تو کمپنی، ماڈل، سال اور خصوصیات منتخب کریں۔ نتائج فوراً اپڈیٹ ہوتے ہیں۔',
    },
    yearTo: { ar: 'إلى سنة', en: 'Year to', ur: 'سال تک' },
    yearFrom: { ar: 'من سنة', en: 'Year from', ur: 'سال سے' },
    anyMake: { ar: 'كل الشركات', en: 'Any make', ur: 'تمام کمپنیاں' },
    anyModel: { ar: 'كل الموديلات', en: 'Any model', ur: 'تمام ماڈلز' },
    anyYear: { ar: 'أي سنة', en: 'Any year', ur: 'کوئی بھی سال' },
    anyCity: { ar: 'كل المدن', en: 'All cities', ur: 'تمام شہر' },
    featuresLabel: { ar: 'المواصفات (اختر اللي يهمك)', en: 'Features (pick what matters)', ur: 'خصوصیات (جو اہم ہو منتخب کریں)' },
    searchBtn: { ar: 'ابحث في كل المواقع', en: 'Search all sites', ur: 'تمام سائٹس پر تلاش کریں' },
    liability: {
      ar: 'تنبيه: نحن نرشدك لأفضل العروض فقط، وأنت المسؤول وحدك عن فحص السيارة والتأكد من البائع والأوراق وتجنّب الاحتيال. لا تحوّل أي مبلغ قبل المعاينة ونقل الملكية عبر أبشر.',
      en: 'Warning: we only guide you to the best offers. You alone are responsible for inspecting the car, verifying the seller and papers, and avoiding fraud. Never send money before seeing the car and transferring ownership through Absher.',
      ur: 'انتباہ: ہم صرف بہترین پیشکشوں تک آپ کی رہنمائی کرتے ہیں۔ گاڑی کا معائنہ، بیچنے والے اور کاغذات کی تصدیق اور دھوکے سے بچنا صرف آپ کی ذمہ داری ہے۔ گاڑی دیکھے اور ابشر کے ذریعے ملکیت منتقل کیے بغیر کبھی رقم نہ بھیجیں۔',
    },
    footerLiability: {
      ar: 'نحن نرشدك، لكن أنت المسؤول عن الفحص والتحقق وتجنّب الاحتيال.',
      en: 'We guide you, but you are responsible for inspection, verification and avoiding fraud.',
      ur: 'ہم رہنمائی کرتے ہیں، لیکن معائنہ، تصدیق اور دھوکے سے بچاؤ آپ کی ذمہ داری ہے۔',
    },
    resultsFor: { ar: 'نتائج', en: 'Results for', ur: 'نتائج' },
    resultsAll: { ar: 'كل السيارات ضمن ميزانيتك', en: 'All cars within your budget', ur: 'آپ کے بجٹ میں تمام گاڑیاں' },
    resSubModel: {
      ar: 'اضغط على أي موقع لفتح إعلاناته الحية مباشرة. المواقع مرتبة حسب نسبة الثقة.',
      en: 'Tap any site to open its live listings directly. Sites are ranked by trust score.',
      ur: 'کسی بھی سائٹ پر ٹیپ کریں اور اس کے لائیو اشتہارات براہِ راست کھولیں۔ سائٹس اعتماد اسکور کے لحاظ سے ترتیب میں ہیں۔',
    },
    resSubPick: {
      ar: 'اختر موديل من الخيارات تحت، أو من القائمة، عشان نفتح لك نتائجه بالضبط.',
      en: 'Pick a model from the options below, or from the list, to open its exact results.',
      ur: 'نیچے دیے گئے آپشنز یا فہرست سے ماڈل منتخب کریں تاکہ ہم اس کے درست نتائج کھولیں۔',
    },
    allYears: { ar: 'كل السنوات', en: 'All years', ur: 'تمام سال' },
    openResults: { ar: 'افتح النتائج', en: 'Open results', ur: 'نتائج کھولیں' },
    trust: { ar: 'ثقة', en: 'trust', ur: 'اعتماد' },
    deepTitle: { ar: 'بحث عميق في كل الإعلانات', en: 'Deep search across every ad', ur: 'تمام اشتہارات میں گہری تلاش' },
    deepSub: {
      ar: 'يبحث داخل نص الإعلانات في كل المواقع عن: ',
      en: 'Searches the text of ads on all sites for: ',
      ur: 'تمام سائٹس کے اشتہارات کے متن میں تلاش: ',
    },
    optionsTitle: { ar: 'خيارات حقيقية لميزانيتك', en: 'Real options for your budget', ur: 'آپ کے بجٹ کے لیے حقیقی آپشنز' },
    useThis: { ar: 'اعرض كل النتائج', en: 'Show all results', ur: 'تمام نتائج دکھائیں' },
    haraj: { ar: 'حراج', en: 'Haraj', ur: 'حراج' },
    deepShort: { ar: 'بحث عميق', en: 'Deep search', ur: 'گہری تلاش' },
    searched: { ar: 'تم فتح نتائج البحث. تذكّر: أنت المسؤول عن الفحص وتجنّب الاحتيال.', en: 'Results ready. Remember: you are responsible for inspection and avoiding fraud.', ur: 'نتائج تیار ہیں۔ یاد رکھیں: معائنہ اور دھوکے سے بچاؤ آپ کی ذمہ داری ہے۔' },
    r5t: { ar: 'مستشار شخصي وواتساب', en: 'Personal advisor & WhatsApp', ur: 'ذاتی مشیر اور واٹس ایپ' },
    r5d: { ar: 'بعد استكمال الأوراق الرسمية.', en: 'After our official paperwork is complete.', ur: 'سرکاری کاغذات مکمل ہونے کے بعد۔' },
    r1t: { ar: 'محرك البحث وأفضل خيار', en: 'Search engine and best option', ur: 'سرچ انجن اور بہترین آپشن' },
    r1d: { ar: 'روابط مباشرة لأفضل المعروض في كل المواقع.', en: 'Direct links to the best offers on every site.', ur: 'ہر سائٹ پر بہترین پیشکشوں کے براہِ راست لنکس۔' },
    footer1: {
      ar: 'موقع أفضل المعروض للسيارات محرك بحث وإرشاد وليس طرفاً في أي عملية بيع. خلال الفترة التجريبية لن نطلب منك أي مبلغ.',
      en: 'Best Car Offers is a search and guidance service and is not a party to any sale. During the trial period we will not ask you for any money.',
      ur: 'بہترین پیشکش کاریں ایک تلاش اور رہنمائی کی سروس ہے اور کسی فروخت میں فریق نہیں۔ آزمائشی مدت میں ہم آپ سے کوئی رقم نہیں مانگیں گے۔',
    },
    privacyText: {
      ar: 'لا نطلب اسمك أو رقم جوالك حالياً. نجمع فقط بيانات استخدام مجهولة: عمليات البحث (الميزانية، الموديل، المدينة، المواصفات)، التقييمات، وبيانات الزيارة (الصفحة، اللغة، مصدر الزيارة، نوع الجهاز، الدولة والمدينة التقريبية). نستخدمها لتحسين النتائج، وفق نظام حماية البيانات الشخصية في المملكة، ولا نبيعها.',
      en: 'We do not ask for your name or phone number for now. We only collect anonymous usage data: searches (budget, model, city, features), ratings, and visit data (page, language, referrer, device type, approximate country and city). We use it to improve results, in line with the Saudi Personal Data Protection Law, and never sell it.',
      ur: 'فی الحال ہم آپ کا نام یا فون نمبر نہیں مانگتے۔ ہم صرف گمنام استعمال کا ڈیٹا جمع کرتے ہیں: تلاشیں (بجٹ، ماڈل، شہر، خصوصیات)، ریٹنگز، اور وزٹ ڈیٹا (صفحہ، زبان، ریفرر، ڈیوائس کی قسم، اندازاً ملک اور شہر)۔ ہم اسے نتائج بہتر بنانے کے لیے، سعودی ذاتی ڈیٹا تحفظ قانون کے مطابق استعمال کرتے ہیں اور کبھی فروخت نہیں کرتے۔',
    },
    t5: {
      ar: 'نستخدم بيانات الاستخدام المجهولة لتحسين الخدمة فقط، ولا نبيعها لأي طرف.',
      en: 'We use anonymous usage data only to improve the service, and never sell it.',
      ur: 'ہم گمنام استعمال کا ڈیٹا صرف سروس بہتر بنانے کے لیے استعمال کرتے ہیں اور کبھی فروخت نہیں کرتے۔',
    },
    bestLockedText: {
      ar: 'وافق على الشروط لعرض أفضل خيار مع روابطه المباشرة. ما في أي دفع الآن.',
      en: 'Accept the terms to reveal it with its direct links. No payment now.',
      ur: 'شرائط قبول کریں تاکہ یہ اپنے براہِ راست لنکس کے ساتھ ظاہر ہو۔ ابھی کوئی ادائیگی نہیں۔',
    },
    bNote: {
      ar: 'أسعار تقديرية للسوق السعودي. الروابط تفتح الإعلانات الحية الآن.',
      en: 'Estimated Saudi market prices. The links open live listings now.',
      ur: 'سعودی مارکیٹ کی اندازاً قیمتیں۔ لنکس ابھی کے لائیو اشتہارات کھولتے ہیں۔',
    },
  });

  const OPTS = {
    // [value, ar, en, ur]
    bodyType: [['any', 'أي نوع', 'Any type', 'کوئی بھی قسم'], ['sedan', 'سيدان', 'Sedan', 'سیڈان'], ['suv', 'SUV / جيب', 'SUV', 'SUV / جیپ'], ['pickup', 'بيك أب / غمارة', 'Pickup', 'پک اپ'], ['van', 'فان عائلي', 'Family van', 'فیملی وین']],
  };

  // ---------- state ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('daleel:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('daleel:' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const LANGS = ['ar', 'en', 'ur'];
  let lang = LANGS.includes(store.get('lang', 'ar')) ? store.get('lang', 'ar') : 'ar';
  let online = true;
  let starPick = 0;
  let activeYear = null; // null = all years
  let cityInit = false;
  const features = new Set();
  const visitorId = store.get('vid', null) || (() => { const id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)); store.set('vid', id); return id; })();
  const t = (k) => (T[k] ? T[k][lang] ?? T[k].en : k);
  const L = (o) => (o && typeof o === 'object' ? o[lang] ?? o.en : o);
  const fmt = (n) => Number(n).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US');
  const fmtEn = (n) => Number(n).toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const THIS_YEAR = 2026;

  // ---------- API with local fallback ----------
  async function api(path, body) {
    if (!online) throw new Error('offline');
    const res = await fetch('api/' + path, {
      method: body ? 'POST' : 'GET',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
    });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) { online = false; throw new Error('no_api'); }
    const data = await res.json();
    if (!res.ok) { if (res.status === 503) online = false; throw Object.assign(new Error(data.error || 'error'), { status: res.status }); }
    return data;
  }


  // ---------- catalog helpers ----------
  const makeBySlug = (s) => D.catalog.find((m) => m.slug === s);
  const modelOf = (mk, s) => mk && mk.models.find((m) => m[0] === s);
  // Parses "Toyota Camry 2017–2019 GL" into { mk, md, from, to }.
  function parseModel(text) {
    for (const mk of D.catalog) {
      if (!text.startsWith(mk.en + ' ')) continue;
      const rest = text.slice(mk.en.length + 1);
      const md = mk.models.slice().sort((a, b) => b[1].length - a[1].length).find((m) => rest.startsWith(m[1]));
      const yrs = (rest.match(/\d{4}/g) || []).map(Number);
      return { mk, md, from: yrs[0] || null, to: yrs[1] || yrs[0] || null };
    }
    return null;
  }
  const modelName = (mk, md) => (lang === 'en' ? `${mk.en} ${md ? md[1] : ''}` : `${mk.ar} ${md ? (/^[A-Z0-9-]+$/.test(md[1]) ? md[1] : md[2]) : ''}`).trim();

  // ---------- direct links ----------
  // Each builder returns a URL for the platform's live search results.
  const cityUrl = (p, c) => (D.cityUrls[p] || {})[c] || '';
  const LINKS = {
    haraj({ mk, md, year, city }) {
      const kw = md ? `${md[2]}${year ? ' ' + year : ''}` : mk ? mk.ar : 'حراج السيارات';
      const c = cityUrl('haraj', city);
      return `https://haraj.com.sa/tags/${encodeURIComponent(c && (md || mk) ? `${c}_${kw}` : kw)}/`;
    },
    syarah({ mk, md, year }) {
      return 'https://syarah.com/en/autos' + (mk ? `/${mk.slug}` : '') + (mk && md ? `/${md[0]}` : '') + (md && year ? `/${year}` : '');
    },
    carswitch({ mk, md, year, city }) {
      const c = cityUrl('carswitch', city) || 'saudi';
      return `https://ksa.carswitch.com/en/${c}/used-cars` + (mk ? `/${mk.slug}` : '/search') + (mk && md ? `/${md[0]}` : '') + (md && year ? `/${year}-price` : '');
    },
    opensooq({ mk, md, year, city }) {
      const c = cityUrl('opensooq', city);
      return `https://sa.opensooq.com/en/${c ? c + '/' : ''}cars/cars-for-sale` + (mk ? `/${mk.slug}` : '') + (mk && md ? `/${md[0]}` : '') + (md && year ? `/${year}` : '');
    },
    motory({ mk, md, year, city }) {
      const c = cityUrl('motory', city);
      return 'https://ksa.motory.com/en/cars-for-sale/' + (c ? c + '/' : '') + (mk ? mk.slug + '/' : '') + (mk && md ? md[0] + '/' : '') + (md && year && !c ? year + '/' : '');
    },
    soum({ mk, md }) {
      // Soum uses Arabic names in its URLs: /ar/سيارات/تويوتا/كامري
      const arabicModel = md && /^[\u0600-\u06FF ]+$/.test(md[2]) ? md[2] : '';
      const path = ['سيارات', mk ? mk.ar : '', mk && arabicModel ? arabicModel : ''].filter(Boolean).map(encodeURIComponent).join('/');
      return `https://soum.sa/ar/${path}`;
    },
    yallamotor({ mk, md, year }) {
      return 'https://ksa.yallamotor.com/used-cars' + (mk ? `/${mk.slug}` : '') + (mk && md ? `/${md[0]}` : '') + (md && year ? `/${year}` : '');
    },
  };
  const SITES = ['haraj.com.sa', 'syarah.com', 'soum.sa', 'sa.opensooq.com', 'ksa.motory.com', 'ksa.yallamotor.com', 'ksa.carswitch.com'];
  // Google search restricted to the six platforms: finds ads whose text mentions the chosen features.
  function deepLink({ mk, md, years, city }) {
    const parts = ['(' + SITES.map((s) => 'site:' + s).join(' OR ') + ')'];
    if (md) parts.push(`("${md[2]}" OR "${mk.en} ${md[1]}")`);
    else if (mk) parts.push(`("${mk.ar}" OR "${mk.en}")`);
    else parts.push('سيارة للبيع');
    if (years && years.length) parts.push(years.length === 1 ? String(years[0]) : '(' + years.slice(0, 6).join(' OR ') + ')');
    const c = cityUrl('haraj', city);
    if (c) parts.push(`"${c}"`);
    D.features.filter((f) => features.has(f.id)).forEach((f) => parts.push(`"${f.q}"`));
    return 'https://www.google.com/search?tbs=qdr:m&q=' + encodeURIComponent(parts.join(' ')); // past month only
  }
  function deepWords({ mk, md, years, city }) {
    const w = [];
    if (md) w.push(modelName(mk, md)); else if (mk) w.push(lang === 'en' ? mk.en : mk.ar);
    if (years && years.length) w.push(years.length === 1 ? years[0] : `${years[0]}–${years[years.length - 1]}`);
    const c = D.cities.find((x) => x[0] === city);
    if (c) w.push(c[1 + LANGS.indexOf(lang)]);
    D.features.filter((f) => features.has(f.id)).forEach((f) => w.push(f[lang] || f.en));
    return w.join(' · ') || t('anyModel');
  }

  // ---------- render: i18n ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
    document.title = t('brand');
    $$('[data-i]').forEach((el) => { el.textContent = t(el.dataset.i); });
    $$('[data-ih]').forEach((el) => { el.innerHTML = t(el.dataset.ih); });
    $('#langSel').value = lang;
    fillSelect($('#bodyType'), OPTS.bodyType);
    fillSelect($('#city'), [['', 'كل المدن', 'All cities', 'تمام شہر'], ...D.cities]);
    if (!cityInit) { $('#city').value = 'madinah'; cityInit = true; }
    fillMakes(); fillModels(); fillYears();
    renderChips(); renderFeatures(); renderAll(); renderSeller(); renderOfficial(); renderStars(); renderStats(lastStats);
  }
  function fillSelect(sel, list) {
    const cur = sel.value;
    sel.innerHTML = list.map((o) => `<option value="${o[0]}">${esc(o[1 + LANGS.indexOf(lang)] || o[2])}</option>`).join('');
    if (cur !== '') sel.value = cur;
    if (sel.selectedIndex < 0) sel.selectedIndex = 0;
  }
  function fillMakes() {
    fillSelect($('#make'), [['', t('anyMake'), t('anyMake'), t('anyMake')], ...D.catalog.map((m) => [m.slug, m.ar, m.en, m.ar])]);
  }
  function fillModels() {
    const mk = makeBySlug($('#make').value);
    const body = $('#bodyType').value;
    const list = mk ? mk.models.filter((m) => body === 'any' || m[3] === body) : [];
    const cur = $('#model').value;
    $('#model').innerHTML = `<option value="">${esc(t('anyModel'))}</option>` +
      list.map((m) => `<option value="${m[0]}">${esc(lang === 'en' ? m[1] : (/^[A-Z0-9-]+$/.test(m[1]) ? m[1] : m[2]))}</option>`).join('');
    $('#model').value = list.some((m) => m[0] === cur) ? cur : '';
    $('#model').disabled = !mk;
  }
  function fillYears() {
    const years = [];
    for (let y = THIS_YEAR; y >= 2000; y--) years.push(y);
    for (const id of ['yearFrom', 'yearTo']) {
      const sel = $('#' + id); const cur = sel.value;
      sel.innerHTML = `<option value="">${esc(t('anyYear'))}</option>` + years.map((y) => `<option value="${y}">${y}</option>`).join('');
      sel.value = cur;
    }
  }

  // ---------- budget ----------
  const budgetEl = $('#budget');
  const toArDigits = (s) => String(s).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  function renderChips() {
    $('#budgetChips').innerHTML = [5000, 10000, 20000, 35000, 60000, 100000, 180000]
      .map((v) => `<button type="button" class="chip num" data-v="${v}">${fmt(v)}</button>`).join('');
  }
  function renderFeatures() {
    $('#featureChips').innerHTML = D.features.map((f) =>
      `<button type="button" class="chip feat" data-f="${f.id}" aria-pressed="${features.has(f.id)}">${esc(f[lang] || f.en)}</button>`).join('');
  }
  const tierFor = (b) => D.tiers.find((x) => b >= x.min && b < x.max) || D.tiers[0];
  const platById = (id) => D.platforms.find((p) => p.id === id);

  // ---------- current selection ----------
  function selection() {
    const mk = makeBySlug($('#make').value) || null;
    const md = modelOf(mk, $('#model').value) || null;
    let from = Number($('#yearFrom').value) || null;
    let to = Number($('#yearTo').value) || null;
    if (from && to && from > to) [from, to] = [to, from];
    if (from && !to) to = Math.min(THIS_YEAR, from + 5);
    if (to && !from) from = Math.max(2000, to - 5);
    const years = [];
    if (from && to) for (let y = to; y >= from && years.length < 10; y--) years.push(y);
    return { mk, md, years: years.reverse(), city: $('#city').value, budget: Number(budgetEl.value) };
  }

  function renderAll() {
    const b = Number(budgetEl.value);
    $('#budgetOut').textContent = `${fmt(b)} ${t('sar')}`;
    const tier = tierFor(b);
    renderLow(b);
    renderResults(tier);
    renderOptions(tier);
    renderBest(tier);
  }

  // Low-price finder: our main sector. Every place with cars at this price, by trust, newest first.
  const LOW_FOCUS = 30000;
  const recentGoogle = (q, period = 'w') => `https://www.google.com/search?tbs=qdr:${period}&q=${encodeURIComponent(q)}`;
  function lowSourceUrl(id, { b, city, mk, md }) {
    const cityAr = (D.cities.find((c) => c[0] === city) || [])[1] || '';
    const carWord = md ? md[2] : mk ? mk.ar : 'سيارة';
    const prices = [];
    for (let p = Math.max(3000, Math.round((b * 0.7) / 1000) * 1000); p <= b; p += 1000) prices.push(p);
    const priceQ = '(' + prices.slice(-6).join(' OR ') + ')';
    const place = cityAr ? ` "${cityAr}"` : '';
    switch (id) {
      case 'infath': return 'https://auctions.infath.gov.sa/';
      case 'recent': return recentGoogle(`(site:haraj.com.sa OR site:sa.opensooq.com) ${carWord} للبيع ${priceQ}${place}`);
      case 'mstaml': return city === 'madinah' && !mk ? D.mstamlCheapMadinah : recentGoogle(`site:mstaml.com ${carWord} للبيع ${priceQ}${place}`, 'm');
      case 'expatriates': return `https://www.expatriates.com/classifieds/${D.cityUrls.expatriates[city] || 'saudi-arabia'}/vehicles-cars-trucks/`;
      case 'web': return recentGoogle(`${carWord} للبيع ${priceQ} ريال${place} -site:haraj.com.sa -site:sa.opensooq.com`);
      case 'x': return `https://x.com/search?f=live&q=${encodeURIComponent(`${carWord} للبيع${cityAr ? ' ' + cityAr : ''}`)}`;
      case 'facebook': return `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(`${carWord} ${cityAr}`.trim())}`;
    }
    return '#';
  }
  function renderLow(b) {
    $('#lowPanel').hidden = b >= LOW_FOCUS;
    if (b >= LOW_FOCUS) return;
    const sel = { b, city: $('#city').value, mk: makeBySlug($('#make').value), md: null };
    sel.md = modelOf(sel.mk, $('#model').value) || null;
    const soum = platById('soum');
    const rows = D.lowSources.slice().sort((x, y) => y.trust - x.trust).map((src) => `
      <a class="low-row" href="${esc(lowSourceUrl(src.id, sel))}" target="_blank" rel="noopener">
        <span class="pl-score num" style="--c:${scoreColor(src.trust)}">${src.trust}%</span>
        <span class="pl-name"><b>${esc(L(src.name))}</b><small>${esc(L(src.note))}</small>
          ${src.trust < 40 ? `<small class="danger-text">⚠ ${t('lowTrustWarn')}</small>` : ''}</span>
        <span class="pl-go">${t('lowGo')} ↗</span>
      </a>`).join('');
    const installments = b < 20000 ? `
      <div class="low-item"><div><b>${t('low3t')}</b><p>${t('low3d')}</p></div>
        <span class="low-links"><a class="btn btn-ghost btn-sm" href="${soum.url}" target="_blank" rel="noopener">${esc(L(soum.name))} ↗</a>
        <a class="btn btn-ghost btn-sm" href="https://syarah.com/en/autos" target="_blank" rel="noopener">Syarah ↗</a></span></div>` : '';
    $('#lowList').innerHTML = rows + installments;
  }

  function platformRows(sel) {
    return D.platforms
      .filter((p) => LINKS[p.id] && !(p.minBudget && sel.budget < p.minBudget))
      .map((p) => ({ p, s: trustScore(p), url: LINKS[p.id](sel) }))
      // Under 20,000 SAR the cheap cars are on classifieds, so those come first.
      .sort((a, b) => (sel.budget < 20000 ? (b.p.type === 'classifieds') - (a.p.type === 'classifieds') : 0) || b.s - a.s);
  }

  function renderResults() {
    const sel = selection();
    const { mk, md, years } = sel;
    if (activeYear && !years.includes(activeYear)) activeYear = null;
    $('#resTitle').textContent = mk ? `${t('resultsFor')}: ${modelName(mk, md)}${activeYear ? ' ' + activeYear : ''}` : t('resultsAll');
    $('#resSub').textContent = md ? t('resSubModel') : t('resSubPick');
    $('#yearChips').innerHTML = md && years.length
      ? [`<button type="button" class="chip" data-y="" aria-pressed="${!activeYear}">${t('allYears')}</button>`,
        ...years.map((y) => `<button type="button" class="chip num" data-y="${y}" aria-pressed="${activeYear === y}">${y}</button>`)].join('')
      : '';
    const linkSel = { ...sel, year: md ? activeYear : null };
    const typeKey = { certified: 'typeCertified', marketplace: 'typeMarketplace', classifieds: 'typeClassifieds' };
    const rows = platformRows(linkSel);
    $('#platLinks').innerHTML = rows.map(({ p, s, url }) => `
      <a class="plat-link" data-site="${p.id}" href="${esc(url)}" target="_blank" rel="noopener">
        <span class="pl-score num" style="--c:${scoreColor(s)}">${s}%</span>
        <span class="pl-name"><b>${esc(L(p.name))}</b><small>${t(typeKey[p.type])} · ${t('trust')} ${s}%</small><small class="avail" data-avail></small></span>
        <span class="pl-go">${t('openResults')} ↗</span>
      </a>`).join('');
    scheduleCheck(mk ? Object.fromEntries(rows.map((r) => [r.p.id, r.url])) : null, sel.budget);
    const hidden = D.platforms.filter((p) => LINKS[p.id] && p.minBudget && sel.budget < p.minBudget);
    $('#hiddenNote').hidden = !hidden.length;
    $('#hiddenNote').textContent = hidden.length ? t('hiddenSoum') : '';
    const deepSel = { ...sel, years: activeYear ? [activeYear] : years };
    $('#deepLink').href = deepLink(deepSel);
    $('#deepSub').textContent = t('deepSub') + deepWords(deepSel);
  }

  // ---------- live availability check ----------
  // Asks our server which sites really have this car; hides the ones that clearly have none.
  let checkTimer = null;
  let checkSeq = 0;
  function scheduleCheck(urls, budget) {
    clearTimeout(checkTimer);
    $('#checkNote').hidden = true;
    if (!urls || !online) return;
    const seq = ++checkSeq;
    checkTimer = setTimeout(async () => {
      $('#checkNote').hidden = false;
      $('#checkNote').textContent = t('checking');
      let results;
      try { results = (await api('check', { urls })).results; } catch { $('#checkNote').hidden = true; return; }
      if (seq !== checkSeq) return; // a newer search replaced this one
      const hiddenNames = [];
      for (const [id, r] of Object.entries(results)) {
        const row = $(`#platLinks [data-site="${id}"]`);
        if (!row) continue;
        const tag = row.querySelector('[data-avail]');
        if (r.state === 'none') { row.remove(); hiddenNames.push(L(platById(id).name)); continue; }
        if (r.state === 'available') {
          const over = r.lowPrice && r.lowPrice > budget * 1.1;
          tag.className = 'avail ' + (over ? 'avail-over' : 'avail-ok');
          tag.textContent = `✓ ${t('avail')}${r.count ? ` · ${fmt(r.count)} ${t('ads')}` : ''}${r.lowPrice ? ` · ${t('fromPrice')} ${fmt(r.lowPrice)} ${t('sar')}` : ''}${over ? ` · ${t('aboveBudget')}` : ''}`;
          if (over) $('#platLinks').appendChild(row); else $('#platLinks').prepend(row);
        } else {
          tag.className = 'avail avail-unknown';
          tag.textContent = t('notChecked');
        }
      }
      $('#checkNote').textContent = t('checkedAt');
      const note = $('#hiddenNote');
      if (hiddenNames.length) { note.hidden = false; note.textContent = t('hiddenNone') + hiddenNames.join('، '); }
    }, 600);
  }

  function renderOptions(tier) {
    const mkSel = makeBySlug($('#make').value);
    let list = tier.models.map(parseModel).filter(Boolean);
    if (mkSel && list.some((o) => o.mk === mkSel)) list = list.filter((o) => o.mk === mkSel);
    $('#optionsSub').textContent = `${L(tier.label)} · ${L(tier.expect)} ${t('optionsSub')}`;
    $('#options').innerHTML = list.map((o, i) => `
      <button type="button" class="opt" data-use="${i}">
        <b>${esc(modelName(o.mk, o.md))}</b><span class="num muted">${o.from}${o.to !== o.from ? '–' + o.to : ''}</span>
        <span class="pl-go">${t('useThis')} ←</span>
      </button>`).join('');
    $('#options').dataset.list = JSON.stringify(list.map((o) => [o.mk.slug, o.md && o.md[0], o.from, o.to]));
  }

  function renderBest(tier) {
    const pk = tier.pick;
    const b = Number(budgetEl.value);
    const maxPrice = Math.min(pk.price[1], Math.max(b, pk.price[0]));
    const o = parseModel(pk.model);
    const mid = o && o.from && o.to ? o.to : o && o.from;
    const sel = o ? { mk: o.mk, md: o.md, year: mid, city: $('#city').value } : null;
    const bestPlat = platById(tier.where[0]);
    const firstUrl = sel && LINKS[bestPlat.id] ? LINKS[bestPlat.id](sel) : bestPlat.url;
    $('#bestConf').textContent = `${Math.round(pk.open * 100)}% ${t('confidence')}`;
    $('#bestBody').innerHTML = `
      <span class="muted" style="font-size:.78rem">${t('bModel')}</span>
      <div class="model">${esc(pk.model)}</div>
      <div class="kv">
        <div><span>${t('bPrice')}</span><b>${fmtEn(pk.price[0])}–${fmtEn(maxPrice)}</b></div>
        <div><span>${t('bOpen')}</span><b>${fmtEn(Math.round((pk.price[0] * pk.open) / 500) * 500)}</b></div>
        <div><span>${t('bKm')}</span><b>${fmtEn(pk.km)} ${t('km')}</b></div>
      </div>
      <p style="font-size:.9rem"><b>${t('bWhy')}</b> ${esc(L(pk.why))}</p>
      ${sel ? `<div class="opt-links">
        <a href="${esc(firstUrl)}" target="_blank" rel="noopener">${esc(L(bestPlat.name))} ↗</a>
        <a href="${esc(LINKS.haraj(sel))}" target="_blank" rel="noopener">${t('haraj')} ↗</a>
        <a href="${esc(deepLink({ ...sel, years: [o.from, o.to].filter((v, i, a) => v && a.indexOf(v) === i) }))}" target="_blank" rel="noopener">${t('deepShort')} ↗</a>
      </div>` : ''}
      <p class="muted" style="font-size:.78rem">${t('bNote')}</p>`;
    $('#best').classList.toggle('locked', !store.get('terms', null));
  }

  // ---------- platforms ----------
  function trustScore(p) {
    let s = 0;
    for (const [k, w] of Object.entries(D.trustWeights)) s += (p.scores[k] * w) / 100;
    return Math.round(s);
  }
  const scoreColor = (s) => (s >= 80 ? 'var(--ok)' : s >= 60 ? 'var(--mid)' : 'var(--bad)');
  // ---------- seller checker ----------
  const sellerState = new Set();
  function renderSeller() {
    $('#sellerChecks').innerHTML = D.sellerSignals.map((s) => `
      <label class="check"><input type="checkbox" data-sid="${s.id}" ${sellerState.has(s.id) ? 'checked' : ''}><span>${esc(s[lang] || s.en)}</span></label>`).join('');
    updateSeller();
  }
  function updateSeller() {
    const pct = D.sellerSignals.filter((s) => sellerState.has(s.id)).reduce((a, s) => a + s.w, 0);
    $('#sellerPct').textContent = pct + '%';
    const bar = $('#sellerBar');
    bar.style.width = pct + '%';
    bar.style.background = scoreColor(pct);
    const critical = !sellerState.has('nodeposit') || !sellerState.has('inspect');
    const level = pct >= 80 && !critical ? 'high' : pct >= 50 && sellerState.has('nodeposit') ? 'mid' : 'low';
    $('#sellerVerdict').textContent = t(level === 'high' ? 'vHigh' : level === 'mid' ? 'vMid' : 'vLow');
    $('#sellerVerdict').style.color = scoreColor(level === 'high' ? 90 : level === 'mid' ? 70 : 0);
  }
  function renderOfficial() {
    $('#official').innerHTML = D.officialChecks.map((o) => `<a href="${o.url}" target="_blank" rel="noopener"><b>${esc(L(o.name))}</b><span>${esc(L(o.what))}</span></a>`).join('');
  }

  // ---------- stats + reviews ----------
  let lastStats = null;
  function renderStats(s) {
    if (!s) return;
    lastStats = s;
    $('#stVisits').textContent = fmt(s.visits);
    $('#stSearches').textContent = fmt(s.searches || 0);
    $('#stRating').textContent = s.ratingCount ? `${fmt(s.ratingAvg)}★` : '–';
    // Only numbers from the shared server are shown (never counts from this device alone).
    // The last server numbers are remembered so the row stays filled if the server is briefly unreachable.
    store.set('lastStats', { ...s, recentReviews: [] });
    $('#stToday').textContent = fmt(s.visitsToday || 0);
    $('#reviews').innerHTML = s.recentReviews.slice(0, 3)
      .map((r) => `<div class="review"><div class="who"><span>${esc(r.name || t('guest'))}</span><span class="s">${'★'.repeat(r.stars)}</span></div>${esc(r.comment)}</div>`).join('');
  }
  function renderStars() {
    const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.6l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z"/></svg>';
    $('#stars').innerHTML = [1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${n === starPick}" aria-label="${n}" data-n="${n}" class="${n <= starPick ? 'on' : ''}">${star}</button>`).join('');
  }

  // ---------- UI helpers ----------
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 3600);
  }
  function openModal(id) { const m = $('#' + id); m.hidden = false; const f = m.querySelector('input,button'); f && f.focus(); }
  function closeModal(id) { $('#' + id).hidden = true; }

  // ---------- events ----------
  $('#langSel').addEventListener('change', (e) => { lang = LANGS.includes(e.target.value) ? e.target.value : 'ar'; store.set('lang', lang); applyLang(); });
  budgetEl.addEventListener('input', renderAll);
  $('#budgetChips').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { budgetEl.value = b.dataset.v; renderAll(); } });
  $('#make').addEventListener('change', () => { fillModels(); activeYear = null; renderAll(); });
  $('#bodyType').addEventListener('change', () => { fillModels(); renderAll(); });
  ['model', 'yearFrom', 'yearTo', 'city'].forEach((id) => $('#' + id).addEventListener('change', renderAll));
  $('#featureChips').addEventListener('click', (e) => {
    const c = e.target.closest('[data-f]'); if (!c) return;
    features.has(c.dataset.f) ? features.delete(c.dataset.f) : features.add(c.dataset.f);
    c.setAttribute('aria-pressed', String(features.has(c.dataset.f)));
    renderAll();
  });
  $('#yearChips').addEventListener('click', (e) => { const c = e.target.closest('[data-y]'); if (c) { activeYear = Number(c.dataset.y) || null; renderResults(); } });
  $('#options').addEventListener('click', (e) => {
    const b = e.target.closest('[data-use]'); if (!b) return;
    const [mk, md, from, to] = JSON.parse($('#options').dataset.list)[Number(b.dataset.use)];
    $('#bodyType').value = 'any';
    $('#make').value = mk; fillModels(); $('#model').value = md || '';
    $('#yearFrom').value = from || ''; $('#yearTo').value = to || '';
    activeYear = null; renderAll();
    $('#resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('#searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    renderAll();
    $('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast(t('searched'));
    const s = selection();
    const body = {
      visitorId, lang, budget: s.budget, make: s.mk ? s.mk.slug : '', model: s.md ? s.md[0] : '',
      yearFrom: s.years[0] || '', yearTo: s.years[s.years.length - 1] || '', city: s.city,
      bodyType: $('#bodyType').value, features: [...features].join(','),
    };
    try { renderStats(await api('search', body)); }
    catch { /* not counted without the database */ }
  });
  $('#sellerChecks').addEventListener('change', (e) => { const id = e.target.dataset.sid; if (!id) return; e.target.checked ? sellerState.add(id) : sellerState.delete(id); updateSeller(); });

  const openWorkshops = (e) => { if (e) e.preventDefault(); openModal('wsModal'); };
  $('#wsOpen').addEventListener('click', openWorkshops);
  $('#wsNav').addEventListener('click', openWorkshops);
  $('#wsClose').addEventListener('click', () => closeModal('wsModal'));
  $('#revealBtn').addEventListener('click', () => openModal('termsModal'));
  $('#openTerms').addEventListener('click', () => openModal('termsModal'));
  $('#openPrivacy').addEventListener('click', () => openModal('privacyModal'));
  $('#privacyClose').addEventListener('click', () => closeModal('privacyModal'));
  $('#termsCancel').addEventListener('click', () => closeModal('termsModal'));
  $('#termsCheck').addEventListener('change', (e) => { $('#termsAgree').disabled = !e.target.checked; });
  $('#termsAgree').addEventListener('click', async () => {
    store.set('terms', { at: new Date().toISOString(), version: D.termsVersion });
    closeModal('termsModal');
    renderAll();
    toast(t('revealed'));
    $('#best').scrollIntoView({ block: 'center' });
    try { await api('terms', { visitorId, version: D.termsVersion }); } catch { /* demo mode */ }
  });
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal').forEach((m) => { m.hidden = true; }); });

  $('#stars').addEventListener('click', (e) => { const b = e.target.closest('[data-n]'); if (b) { starPick = Number(b.dataset.n); renderStars(); } });
  // Suggestions are private (admin only); a star rating with a comment also shows as a public review.
  $('#sendBtn').addEventListener('click', async () => {
    const text = $('#sugText').value.trim().slice(0, 1000);
    if (!text && !starPick) return toast(t('needSomething'));
    try {
      if (text) await api('suggestions', { visitorId, lang, text, stars: starPick || null });
      if (starPick) renderStats(await api('ratings', { visitorId, stars: starPick, comment: text.slice(0, 500) }));
    } catch {
      // Not saved on the server: keep what they wrote and point them to email instead.
      return toast(t('sendFailed'));
    }
    starPick = 0; renderStars(); $('#sugText').value = '';
    toast(t('sentThanks'));
  });

  // Highlight the bottom-nav item for the section in view.
  const navLinks = $$('.bnav a');
  const io = 'IntersectionObserver' in window && new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const id = en.target.classList.contains('hero') ? 'top' : en.target.id;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  if (io) { ['search', 'madinah', 'yours'].forEach((id) => io.observe($('#' + id))); io.observe($('.hero')); }

  // ---------- boot ----------
  async function recordVisit() {
    let first = true;
    try { if (sessionStorage.getItem('daleel:visited')) first = false; else sessionStorage.setItem('daleel:visited', '1'); } catch { /* ignore */ }
    try {
      if (!first) return renderStats(await api('stats'));
      const params = new URLSearchParams(location.search);
      const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => params.get(k)).filter(Boolean).join('|');
      renderStats(await api('visit', { visitorId, page: location.pathname, lang, referrer: document.referrer, utm, screen: `${screen.width}x${screen.height}` }));
    } catch {
      // Server unreachable: show the last real numbers it gave us, if any.
      const last = store.get('lastStats', null);
      if (last) renderStats({ ...last, recentReviews: [] });
    }
  }

  applyLang();
  recordVisit();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
