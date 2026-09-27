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

  const OPTS = {
    bodyType: [['any', 'أي نوع', 'Any'], ['sedan', 'سيدان', 'Sedan'], ['suv', 'SUV / جيب', 'SUV'], ['hatch', 'هاتشباك', 'Hatchback'], ['pickup', 'بيك أب / غمارة', 'Pickup'], ['van', 'فان عائلي', 'Family van']],
    usage: [['daily', 'دوام ومشاوير', 'Daily commute'], ['family', 'عائلة', 'Family'], ['travel', 'سفر وطرق طويلة', 'Road trips'], ['first', 'أول سيارة / تعليم', 'First car / learning'], ['work', 'شغل وتوصيل', 'Work / delivery']],
    contact: [['whatsapp', 'واتساب فقط', 'WhatsApp only'], ['call', 'اتصال', 'Phone call'], ['sms', 'رسالة نصية', 'SMS']],
  };

  // ---------- state ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('daleel:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem('daleel:' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  let lang = store.get('lang', 'ar');
  let mode = 'budget';
  let online = true;
  let starPick = 0;
  let platFilter = 'all';
  const visitorId = store.get('vid', null) || (() => { const id = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2)); store.set('vid', id); return id; })();
  const t = (k) => (T[k] ? T[k][lang] : k);
  const L = (o) => (o && typeof o === 'object' ? o[lang] ?? o.en : o);
  const fmt = (n) => Number(n).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-US');
  const fmtEn = (n) => Number(n).toLocaleString('en-US');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

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
    if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { status: res.status });
    return data;
  }
  function localStats() {
    const ratings = store.get('ratings', []);
    const avg = ratings.length ? ratings.reduce((a, r) => a + r.stars, 0) / ratings.length : 0;
    return {
      visits: store.get('visits', 0), requests: store.get('requests', []).length,
      ratingAvg: Math.round(avg * 10) / 10, ratingCount: ratings.length,
      recentReviews: ratings.filter((r) => r.comment).slice(-6).reverse(),
    };
  }

  // ---------- render: i18n ----------
  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    $$('[data-i]').forEach((el) => { el.textContent = t(el.dataset.i); });
    $$('[data-ih]').forEach((el) => { el.innerHTML = t(el.dataset.ih); });
    $('#langBtn').textContent = lang === 'ar' ? 'English' : 'العربية';
    for (const [id, list] of Object.entries(OPTS)) fillSelect($('#' + id), list);
    fillSelect($('#city'), D.cities, true);
    renderChips(); renderGuide(); renderPlatforms(); renderSeller(); renderOfficial(); renderStars(); renderStats(lastStats);
    if ($('#submitBtn').dataset.busy) $('#submitBtn').textContent = t('sending');
  }
  function fillSelect(sel, list, withChoose) {
    const cur = sel.value;
    sel.innerHTML = (withChoose ? `<option value="">${t('choose')}</option>` : '') +
      list.map(([v, ar, en]) => `<option value="${v}">${lang === 'ar' ? ar : en}</option>`).join('');
    if (cur) sel.value = cur;
  }

  // ---------- budget + guidance ----------
  const budgetEl = $('#budget');
  const toArDigits = (s) => String(s).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  function renderChips() {
    $('#budgetChips').innerHTML = [5000, 10000, 20000, 35000, 60000, 100000, 180000]
      .map((v) => `<button type="button" class="chip num" data-v="${v}">${fmt(v)}</button>`).join('');
  }
  function tierFor(b) { return D.tiers.find((x) => b >= x.min && b < x.max) || D.tiers[0]; }
  const platById = (id) => D.platforms.find((p) => p.id === id);

  function renderGuide() {
    const b = Number(budgetEl.value);
    $('#budgetOut').textContent = `${fmt(b)} ${t('sar')}`;
    $('#plateAr').textContent = toArDigits(b);
    $('#plateEn').textContent = String(b);
    const tier = tierFor(b);
    $('#tierTag').textContent = L(tier.label);
    $('#tierExpect').textContent = L(tier.expect);
    $('#modelList').innerHTML = tier.models.map((m) => {
      const [name, yrs] = m.split(/ (?=\d{4})/);
      return `<li><span>${esc(name)}</span><span class="muted num">${esc(yrs || '')}</span></li>`;
    }).join('');
    $('#whereList').innerHTML = tier.where.map((id) => {
      const p = platById(id);
      return `<a href="${p.url}" target="_blank" rel="noopener">${esc(L(p.name))} · <span class="num">${trustScore(p)}%</span></a>`;
    }).join('');

    const pk = tier.pick;
    const maxPrice = Math.min(pk.price[1], Math.max(b, pk.price[0]));
    const bestPlat = platById(tier.where[0]);
    $('#bestConf').textContent = `${Math.round(pk.open * 100)}% ${t('confidence')}`;
    $('#bestBody').innerHTML = `
      <span class="muted" style="font-size:.78rem">${t('bModel')}</span>
      <div class="model">${esc(mode === 'specific' && $('#make').value ? `${$('#make').value} ${$('#model').value}`.trim() : pk.model)}</div>
      <div class="kv">
        <div><span>${t('bPrice')}</span><b>${fmtEn(pk.price[0])}–${fmtEn(maxPrice)}</b></div>
        <div><span>${t('bOpen')}</span><b>${fmtEn(Math.round((pk.price[0] * pk.open) / 500) * 500)}</b></div>
        <div><span>${t('bKm')}</span><b>${fmtEn(pk.km)} ${t('km')}</b></div>
      </div>
      <p style="font-size:.9rem"><b>${t('bWhere')}:</b> <a href="${bestPlat.url}" target="_blank" rel="noopener">${esc(L(bestPlat.name))}</a></p>
      <p style="font-size:.9rem"><b>${t('bWhy')}</b> ${esc(L(pk.why))}</p>
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
  function renderPlatforms() {
    $$('#platFilter .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.f === platFilter)));
    $$('#platFilter .chip').forEach((c) => { c.style.borderColor = c.dataset.f === platFilter ? 'var(--accent)' : ''; c.style.fontWeight = c.dataset.f === platFilter ? '700' : ''; });
    const list = D.platforms.map((p) => ({ p, s: trustScore(p) }))
      .filter(({ p }) => platFilter === 'all' || p.type === platFilter)
      .sort((a, b) => b.s - a.s);
    const typeKey = { certified: 'typeCertified', marketplace: 'typeMarketplace', classifieds: 'typeClassifieds' };
    $('#platGrid').innerHTML = list.map(({ p, s }) => `
      <article class="plat">
        <div class="plat-top">
          <div style="display:grid;gap:4px">
            <span class="badge ${p.type}">${t(typeKey[p.type])}</span>
            <h3><a href="${p.url}" target="_blank" rel="noopener">${esc(L(p.name))}</a></h3>
            ${p.example ? `<span class="sub">${esc(L(p.example))}</span>` : ''}
          </div>
          <div class="gauge" style="--v:${s};--c:${scoreColor(s)}" aria-label="${s}%"><span>${s}%</span></div>
        </div>
        <div class="pc">
          <div><b style="color:var(--ok)">${t('pros')}</b><ul>${L(p.pros).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
          <div><b style="color:var(--bad)">${t('cons')}</b><ul>${L(p.cons).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        </div>
        <p class="signal">${esc(L(p.signals))}</p>
        <details class="breakdown"><summary>${t('breakdown')}</summary>
          <div class="bars">${Object.keys(D.trustWeights).map((k) => `<div class="bar"><span>${t('c_' + k)}</span><i style="--v:${p.scores[k]}"></i><span class="num">${p.scores[k]}</span></div>`).join('')}</div>
        </details>
      </article>`).join('');
  }

  // ---------- seller checker ----------
  const sellerState = new Set();
  function renderSeller() {
    $('#sellerChecks').innerHTML = D.sellerSignals.map((s) => `
      <label class="check"><input type="checkbox" data-sid="${s.id}" ${sellerState.has(s.id) ? 'checked' : ''}><span>${esc(s[lang])}</span></label>`).join('');
    updateSeller();
  }
  function updateSeller() {
    const pct = D.sellerSignals.filter((s) => sellerState.has(s.id)).reduce((a, s) => a + s.w, 0);
    $('#sellerPct').textContent = pct + '%';
    const bar = $('#sellerBar');
    bar.style.width = pct + '%';
    bar.style.background = scoreColor(pct);
    const critical = !sellerState.has('nodeposit') || !sellerState.has('inspect');
    $('#sellerVerdict').textContent = pct >= 80 && !critical ? t('vHigh') : pct >= 50 && sellerState.has('nodeposit') ? t('vMid') : t('vLow');
    $('#sellerVerdict').style.color = scoreColor(pct >= 80 && !critical ? 90 : pct >= 50 && sellerState.has('nodeposit') ? 70 : 0);
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
    $('#stRequests').textContent = fmt(s.requests);
    $('#stRating').textContent = s.ratingCount ? `${fmt(s.ratingAvg)}★` : '–';
    $('#avgBig').textContent = s.ratingCount ? fmt(s.ratingAvg) : '–';
    $('#avgCount').textContent = s.ratingCount ? `${'★'.repeat(Math.round(s.ratingAvg))} · ${fmt(s.ratingCount)} ${t('ratings')}` : '';
    $('#demoNote').hidden = online;
    $('#reviews').innerHTML = s.recentReviews.length
      ? s.recentReviews.map((r) => `<div class="review"><div class="who"><span>${esc(r.name || t('guest'))}</span><span class="s">${'★'.repeat(r.stars)}</span></div>${esc(r.comment)}</div>`).join('')
      : `<div class="review muted">${t('noReviews')}</div>`;
  }
  function renderStars() {
    const star = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.6l-5.8 3 1.1-6.4-4.7-4.6 6.5-.9z"/></svg>';
    $('#stars').innerHTML = [1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${n === starPick}" aria-label="${n}" data-n="${n}" class="${n <= starPick ? 'on' : ''}">${star}</button>`).join('');
  }

  // ---------- UI helpers ----------
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(() => { el.hidden = true; }, 3200);
  }
  function setMode(m) {
    mode = m;
    $('#modeBudget').setAttribute('aria-pressed', String(m === 'budget'));
    $('#modeSpecific').setAttribute('aria-pressed', String(m === 'specific'));
    $('#specificFields').hidden = m !== 'specific';
    renderGuide();
  }
  function openModal(id) { const m = $('#' + id); m.hidden = false; const f = m.querySelector('input,button'); f && f.focus(); }
  function closeModal(id) { $('#' + id).hidden = true; }

  // ---------- events ----------
  $('#langBtn').addEventListener('click', () => { lang = lang === 'ar' ? 'en' : 'ar'; store.set('lang', lang); applyLang(); });
  budgetEl.addEventListener('input', renderGuide);
  $('#budgetChips').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { budgetEl.value = b.dataset.v; renderGuide(); } });
  $('#modeBudget').addEventListener('click', () => setMode('budget'));
  $('#modeSpecific').addEventListener('click', () => setMode('specific'));
  $$('[data-mode]').forEach((a) => a.addEventListener('click', () => setMode(a.dataset.mode)));
  ['make', 'model'].forEach((id) => $('#' + id).addEventListener('input', renderGuide));
  $('#platFilter').addEventListener('click', (e) => { const c = e.target.closest('[data-f]'); if (c) { platFilter = c.dataset.f; renderPlatforms(); } });
  $('#sellerChecks').addEventListener('change', (e) => { const id = e.target.dataset.sid; if (!id) return; e.target.checked ? sellerState.add(id) : sellerState.delete(id); updateSeller(); });

  $('#revealBtn').addEventListener('click', () => openModal('termsModal'));
  $('#openTerms').addEventListener('click', () => openModal('termsModal'));
  $('#openPrivacy').addEventListener('click', () => openModal('privacyModal'));
  $('#privacyClose').addEventListener('click', () => closeModal('privacyModal'));
  $('#termsCancel').addEventListener('click', () => closeModal('termsModal'));
  $('#termsCheck').addEventListener('change', (e) => { $('#termsAgree').disabled = !e.target.checked; });
  $('#termsAgree').addEventListener('click', async () => {
    const rec = { at: new Date().toISOString(), version: D.termsVersion };
    store.set('terms', rec);
    closeModal('termsModal');
    renderGuide();
    toast(t('revealed'));
    $('#best').scrollIntoView({ block: 'center' });
    try { await api('terms', { visitorId, version: D.termsVersion, requestId: store.get('lastRequest', '') }); } catch { /* demo mode */ }
  });
  $$('.modal').forEach((m) => m.addEventListener('click', (e) => { if (e.target === m) m.hidden = true; }));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal').forEach((m) => { m.hidden = true; }); });

  $('#stars').addEventListener('click', (e) => { const b = e.target.closest('[data-n]'); if (b) { starPick = Number(b.dataset.n); renderStars(); } });
  $('#rateBtn').addEventListener('click', async () => {
    if (!starPick) return toast(t('rateNeedStars'));
    const body = { visitorId, stars: starPick, name: $('#rName').value.trim().slice(0, 40), comment: $('#rComment').value.trim().slice(0, 500) };
    try { renderStats(await api('ratings', body)); }
    catch { const r = store.get('ratings', []); r.push({ ...body, at: new Date().toISOString() }); store.set('ratings', r); renderStats(localStats()); }
    starPick = 0; renderStars(); $('#rComment').value = '';
    toast(t('rateThanks'));
  });

  $('#reqForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target.elements;
    const msg = $('#formMsg');
    const phone = f.phone.value.replace(/[^\d+]/g, '');
    if (!f.name.value.trim() || phone.length < 9 || !f.consent.checked) {
      msg.className = 'form-msg err'; msg.textContent = t('errFields'); msg.hidden = false; return;
    }
    const body = {
      visitorId, mode, lang, name: f.name.value.trim(), phone, city: f.city.value,
      budget: Number(budgetEl.value), make: mode === 'specific' ? f.make.value : '', model: mode === 'specific' ? f.model.value : '',
      yearFrom: mode === 'specific' ? f.yearFrom.value : '', bodyType: f.bodyType.value, usage: f.usage.value,
      contact: f.contact.value, femaleAdvisor: f.femaleAdvisor.checked, firstCar: f.firstCar.checked,
      notes: f.notes.value.trim(), consent: true,
    };
    const btn = $('#submitBtn');
    btn.disabled = true; btn.dataset.busy = '1'; btn.textContent = t('sending');
    let text;
    try {
      const r = await api('requests', body);
      store.set('lastRequest', r.id);
      text = t('sentOk');
      refreshStats();
    } catch (err) {
      if (err.status === 400) text = t('errFields');
      else {
        const list = store.get('requests', []); list.push({ ...body, at: new Date().toISOString() }); store.set('requests', list);
        renderStats(localStats());
        text = t('sentLocal');
      }
    }
    btn.disabled = false; delete btn.dataset.busy; btn.textContent = t('submit');
    msg.className = 'form-msg ok'; msg.textContent = text; msg.hidden = false;
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
  if (io) ['request', 'platforms', 'safety', 'rate'].forEach((id) => io.observe($('#' + id)));
  if (io) io.observe($('.hero'));

  // ---------- boot ----------
  async function refreshStats() {
    try { renderStats(await api('stats')); } catch { renderStats(localStats()); }
  }
  async function recordVisit() {
    if (sessionStorageSafe('visited')) return refreshStats();
    const params = new URLSearchParams(location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign'].map((k) => params.get(k)).filter(Boolean).join('|');
    try {
      renderStats(await api('visit', { visitorId, page: location.pathname, lang, referrer: document.referrer, utm, screen: `${screen.width}x${screen.height}` }));
    } catch {
      store.set('visits', store.get('visits', 0) + 1);
      renderStats(localStats());
    }
  }
  function sessionStorageSafe(k) {
    try { if (sessionStorage.getItem('daleel:' + k)) return true; sessionStorage.setItem('daleel:' + k, '1'); } catch { /* ignore */ }
    return false;
  }

  applyLang();
  recordVisit();

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
