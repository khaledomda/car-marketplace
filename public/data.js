// Daleel content data. Scores and price ranges are editorial estimates
// (September 2026) and should be reviewed by the team every quarter.
window.DALEEL_DATA = {
  termsVersion: '2026-09',

  // Trust score = weighted sum of six criteria (0–100 each).
  trustWeights: {
    inspection: 25, // car inspected before listing/sale
    warranty: 20, // warranty or return window
    sellerCheck: 15, // seller identity / dealer verification
    reviews: 20, // public review sentiment and app ratings
    transparency: 10, // condition reports, history, clear pricing
    support: 10, // transfer help, after-sale support
  },

  platforms: [
    {
      id: 'dealer-cpo',
      name: { ar: 'برامج الوكلاء المعتمدة للسيارات المستعملة', en: 'Authorized dealer certified pre-owned' },
      example: { ar: 'مثل عبداللطيف جميل (تويوتا ولكزس) وبقية الوكلاء', en: 'e.g. Abdul Latif Jameel (Toyota, Lexus) and other brand dealers' },
      url: 'https://www.toyota.com.sa',
      type: 'certified',
      scores: { inspection: 95, warranty: 95, sellerCheck: 100, reviews: 80, transparency: 90, support: 90 },
      pros: {
        ar: ['فحص من الوكيل وضمان رسمي', 'سجل صيانة معروف', 'أوراق نظامية ونقل ملكية مضمون'],
        en: ['Dealer inspection and official warranty', 'Known service history', 'Clean paperwork and safe transfer'],
      },
      cons: { ar: ['أغلى من السوق المفتوح بـ ٨–١٥٪', 'خيارات قليلة تحت ٤٠ ألف'], en: ['8–15% above open-market prices', 'Few options under 40,000 SAR'] },
      signals: { ar: 'تقييمات الوكلاء عادةً إيجابية على خرائط Google', en: 'Dealer branches usually rate well on Google Maps' },
    },
    {
      id: 'syarah',
      name: { ar: 'سيارة (Syarah)', en: 'Syarah' },
      url: 'https://syarah.com',
      type: 'certified',
      scores: { inspection: 95, warranty: 95, sellerCheck: 90, reviews: 70, transparency: 90, support: 85 },
      pros: {
        ar: ['فحص أكثر من ٢٠٠ نقطة', 'ضمان سنة وإرجاع خلال ١٠ أيام', 'توصيل للباب وتمويل'],
        en: ['200+ point inspection', '1-year warranty, 10-day return', 'Home delivery and financing'],
      },
      cons: { ar: ['الأسعار أعلى من حراج', 'تقييمات Trustpilot ضعيفة (عينة صغيرة)'], en: ['Prices above Haraj', 'Weak Trustpilot score (small sample)'] },
      signals: { ar: 'تقييم التطبيق ٤٫٦ (حسب الشركة) · Trustpilot ١٫٨ من ٢١ مراجعة', en: 'App rating 4.6 (company-reported) · Trustpilot 1.8 from 21 reviews' },
    },
    {
      id: 'carswitch',
      name: { ar: 'كار سويتش (CarSwitch)', en: 'CarSwitch KSA' },
      url: 'https://ksa.carswitch.com/en',
      type: 'certified',
      scores: { inspection: 95, warranty: 80, sellerCheck: 85, reviews: 85, transparency: 85, support: 85 },
      pros: {
        ar: ['خدمة SafeSwitch: فحص ٢٠٠ نقطة وتقرير حالة', 'يساعدك في نقل الملكية', 'ضمان مجاني بشروط'],
        en: ['SafeSwitch: 200-point inspection and condition report', 'Helps with ownership transfer', 'Free warranty with conditions'],
      },
      cons: { ar: ['الضمان فقط للسيارات أقل من ١٢ سنة و٢٠٠ ألف كم', 'مخزون أقل من حراج'], en: ['Warranty only under 12 years and 200,000 km', 'Smaller stock than Haraj'] },
      signals: { ar: 'من أعلى المنصات تقييماً في المنطقة حسب الشركة', en: 'Among the highest-rated platforms in the region (company-reported)' },
    },
    {
      id: 'motory',
      name: { ar: 'موتري (Motory)', en: 'Motory' },
      url: 'https://ksa.motory.com/en/',
      type: 'marketplace',
      scores: { inspection: 55, warranty: 50, sellerCheck: 75, reviews: 75, transparency: 75, support: 70 },
      pros: { ar: ['معارض ووكلاء وأفراد', 'مقارنة مواصفات وطلب تمويل', 'متجر Motory بسيارات مختارة'], en: ['Dealers, showrooms and individuals', 'Spec comparison and financing', 'Shop by Motory curated stock'] },
      cons: { ar: ['إعلانات الأفراد بدون فحص', 'تحقق من المعرض بنفسك'], en: ['Private listings are not inspected', 'Verify the showroom yourself'] },
      signals: { ar: 'تقييمات تطبيق جيدة، شكاوى قليلة', en: 'Good app ratings, few complaints' },
    },
    {
      id: 'yallamotor',
      name: { ar: 'يلا موتور (YallaMotor)', en: 'YallaMotor KSA' },
      url: 'https://ksa.yallamotor.com/used-cars',
      type: 'marketplace',
      scores: { inspection: 55, warranty: 45, sellerCheck: 70, reviews: 75, transparency: 80, support: 65 },
      pros: { ar: ['أسعار مرجعية ومراجعات للسيارات', 'آلاف الإعلانات', 'خدمات فحص وتمويل'], en: ['Price guides and car reviews', 'Thousands of listings', 'Inspection and financing services'] },
      cons: { ar: ['جودة الإعلانات متفاوتة', 'الضمان غير متوفر غالباً'], en: ['Listing quality varies', 'Usually no warranty'] },
      signals: { ar: 'علامة معروفة خليجياً منذ سنوات', en: 'Well-known Gulf brand for years' },
    },
    {
      id: 'haraj',
      name: { ar: 'حراج', en: 'Haraj' },
      url: 'https://haraj.com.sa',
      type: 'classifieds',
      scores: { inspection: 10, warranty: 5, sellerCheck: 45, reviews: 70, transparency: 45, support: 30 },
      pros: { ar: ['أكبر عدد سيارات في المملكة', 'أفضل الأسعار للميزانيات الصغيرة', 'تقييم البائع وعمر الحساب ظاهر'], en: ['Largest car stock in the Kingdom', 'Best prices for small budgets', 'Seller rating and account age visible'] },
      cons: { ar: ['لا يوجد فحص ولا ضمان', 'حالات نصب معروفة: لا تحوّل عربون أبداً'], en: ['No inspection, no warranty', 'Known scams: never send a deposit'] },
      signals: { ar: 'تطبيق محبوب وسهل، مع تحذيرات متكررة من النصب', en: 'Popular, easy app, with repeated scam warnings' },
    },
    {
      id: 'opensooq',
      name: { ar: 'السوق المفتوح (OpenSooq)', en: 'OpenSooq' },
      url: 'https://sa.opensooq.com/en/cars/cars-for-sale',
      type: 'classifieds',
      scores: { inspection: 10, warranty: 5, sellerCheck: 40, reviews: 65, transparency: 50, support: 30 },
      pros: { ar: ['إعلانات كثيرة في كل المدن', 'فلترة بالسعر والسنة'], en: ['Many listings in every city', 'Price and year filters'] },
      cons: { ar: ['بدون فحص أو ضمان', 'إعلانات مكررة وقديمة'], en: ['No inspection or warranty', 'Duplicate and stale ads'] },
      signals: { ar: 'مفيد للمقارنة السعرية', en: 'Useful for price comparison' },
    },
  ],

  officialChecks: [
    { name: { ar: 'تقرير موجز (Mojaz)', en: 'Mojaz history report' }, url: 'https://www.tameeni.com/en/car/mojaz', what: { ar: 'عدد الملاك، الحوادث، الصيانة', en: 'Owners, accidents, service records' } },
    { name: { ar: 'نجم', en: 'Najm' }, url: 'https://www.najm.sa/en/caseinquiry', what: { ar: 'الاستعلام عن الحوادث', en: 'Accident case inquiry' } },
    { name: { ar: 'أبشر', en: 'Absher' }, url: 'https://www.absher.sa', what: { ar: 'نقل الملكية الإلكتروني والمخالفات', en: 'Online ownership transfer and violations' } },
  ],

  // Budget tiers in SAR. `pick` is the blurred best option.
  tiers: [
    {
      min: 0, max: 10000,
      label: { ar: 'ميزانية اقتصادية', en: 'Starter budget' },
      models: ['Hyundai Accent 2010–2013', 'Toyota Yaris 2009–2012', 'Nissan Sunny 2011–2014', 'Kia Rio 2011–2013'],
      where: ['haraj', 'opensooq'],
      expect: { ar: 'عمر ١٢–١٦ سنة، ممشى ٢٢٠–٣٢٠ ألف كم. ركّز على المكينة والقير، لا على الشكل.', en: '12–16 years old, 220–320k km. Focus on engine and gearbox, not looks.' },
      pick: { model: 'Toyota Yaris 2011–2012', km: 250000, price: [7000, 9500], open: 0.85, why: { ar: 'أرخص صيانة وقطع متوفرة في كل مكان، ومكينة ١٫٥ تتحمل.', en: 'Cheapest to maintain, parts everywhere, durable 1.5 engine.' } },
    },
    {
      min: 10000, max: 20000,
      label: { ar: 'ميزانية ذكية', en: 'Smart budget' },
      models: ['Hyundai Accent 2015–2017', 'Nissan Sunny 2016–2018', 'Toyota Corolla 2011–2013', 'Kia Cerato 2014–2015'],
      where: ['haraj', 'motory', 'opensooq'],
      expect: { ar: 'عمر ٨–١١ سنة، ممشى ١٨٠–٢٥٠ ألف كم.', en: '8–11 years old, 180–250k km.' },
      pick: { model: 'Toyota Corolla 2012–2013 (1.8)', km: 210000, price: [15000, 19000], open: 0.88, why: { ar: 'أعلى قيمة إعادة بيع في فئتها وأقل أعطال.', en: 'Best resale value in its class, fewest breakdowns.' } },
    },
    {
      min: 20000, max: 35000,
      label: { ar: 'فئة الموظف', en: 'Commuter class' },
      models: ['Toyota Corolla 2016–2018', 'Hyundai Elantra 2017–2019', 'Kia Cerato 2018–2019', 'Toyota Yaris 2018–2020'],
      where: ['syarah', 'carswitch', 'motory', 'haraj'],
      expect: { ar: 'عمر ٦–٩ سنوات، ممشى ١٢٠–٢٠٠ ألف كم. هنا تبدأ السيارات المفحوصة بالضمان.', en: '6–9 years old, 120–200k km. Inspected cars with warranty start here.' },
      pick: { model: 'Toyota Corolla 2017–2018', km: 160000, price: [28000, 34000], open: 0.9, why: { ar: 'موثوقة جداً، وتلقاها مفحوصة بضمان في سيارة وكار سويتش.', en: 'Very reliable, and available inspected with warranty on Syarah and CarSwitch.' } },
    },
    {
      min: 35000, max: 60000,
      label: { ar: 'فئة العائلة', en: 'Family class' },
      models: ['Toyota Camry 2017–2019', 'Toyota Corolla 2020–2021', 'Hyundai Sonata 2018–2020', 'Kia K5 2021'],
      where: ['syarah', 'carswitch', 'dealer-cpo', 'motory'],
      expect: { ar: 'عمر ٤–٧ سنوات، ممشى ٨٠–١٥٠ ألف كم.', en: '4–7 years old, 80–150k km.' },
      pick: { model: 'Toyota Camry 2018–2019 GL', km: 130000, price: [46000, 56000], open: 0.9, why: { ar: 'مساحة عائلية، صيانة معروفة، وتنباع بسرعة لو احتجت تبيعها.', en: 'Family space, known maintenance, and sells fast if you need to.' } },
    },
    {
      min: 60000, max: 100000,
      label: { ar: 'فئة الـ SUV', en: 'SUV class' },
      models: ['Toyota Camry 2021–2022', 'Hyundai Tucson 2021–2022', 'Toyota RAV4 2019–2020', 'Toyota Fortuner 2018–2019'],
      where: ['dealer-cpo', 'syarah', 'carswitch', 'motory'],
      expect: { ar: 'عمر ٣–٦ سنوات، ممشى ٥٠–١٢٠ ألف كم. ابحث عن بقية ضمان الوكيل.', en: '3–6 years old, 50–120k km. Look for remaining dealer warranty.' },
      pick: { model: 'Toyota RAV4 2020', km: 95000, price: [72000, 88000], open: 0.92, why: { ar: 'SUV اقتصادية بالبنزين، مرتفعة ومريحة للمدينة والسفر.', en: 'Fuel-efficient SUV, high seating, good for city and road trips.' } },
    },
    {
      min: 100000, max: 180000,
      label: { ar: 'فئة الفخامة', en: 'Premium class' },
      models: ['Toyota Land Cruiser 2015–2017', 'Toyota Prado 2019–2021', 'Lexus ES 2020–2021', 'Toyota Camry 2023–2024'],
      where: ['dealer-cpo', 'syarah', 'carswitch'],
      expect: { ar: 'عمر ٢–٩ سنوات حسب الموديل. اطلب سجل صيانة الوكيل كاملاً.', en: '2–9 years depending on model. Ask for the full dealer service record.' },
      pick: { model: 'Toyota Prado 2020 TXL', km: 110000, price: [115000, 138000], open: 0.9, why: { ar: 'تحتفظ بقيمتها، قوية على الطرق الطويلة، وقطعها متوفرة.', en: 'Holds its value, strong on long roads, parts widely available.' } },
    },
    {
      min: 180000, max: Infinity,
      label: { ar: 'فئة VIP', en: 'VIP class' },
      models: ['Toyota Land Cruiser 2020–2021', 'Lexus LX 2017–2019', 'GMC Yukon 2021–2022', 'Toyota Prado 2023'],
      where: ['dealer-cpo', 'syarah', 'carswitch'],
      expect: { ar: 'فحص وكيل إلزامي، وتأكد من عدم وجود حوادث عبر موجز.', en: 'Dealer inspection is a must; confirm no accidents through Mojaz.' },
      pick: { model: 'Toyota Land Cruiser 2021 GXR', km: 90000, price: [210000, 250000], open: 0.92, why: { ar: 'الأعلى طلباً وقيمة إعادة البيع الأفضل في السوق السعودي.', en: 'Most in-demand, best resale value in the Saudi market.' } },
    },
  ],

  sellerSignals: [
    { id: 'age', w: 15, ar: 'عمر الحساب أكثر من سنة', en: 'Account is over 1 year old' },
    { id: 'rating', w: 15, ar: 'تقييم البائع جيد وعليه تقييمات حقيقية', en: 'Seller has good, real ratings' },
    { id: 'price', w: 15, ar: 'السعر قريب من السوق (مو رخيص بشكل مريب)', en: 'Price is close to market (not suspiciously cheap)' },
    { id: 'inspect', w: 20, ar: 'يوافق على الفحص في مركز تختاره أنت', en: 'Agrees to inspection at a centre you choose' },
    { id: 'nodeposit', w: 15, ar: 'ما يطلب عربون قبل ما تشوف السيارة', en: 'Does not ask for a deposit before you see the car' },
    { id: 'absher', w: 10, ar: 'يوافق على نقل الملكية عبر أبشر', en: 'Agrees to transfer ownership through Absher' },
    { id: 'docs', w: 10, ar: 'الاستمارة والفحص الدوري ساريين وباسمه', en: 'Registration and periodic inspection valid and in their name' },
  ],

  cities: [
    ['riyadh', 'الرياض', 'Riyadh'], ['jeddah', 'جدة', 'Jeddah'], ['dammam', 'الدمام', 'Dammam'],
    ['khobar', 'الخبر', 'Khobar'], ['makkah', 'مكة المكرمة', 'Makkah'], ['madinah', 'المدينة المنورة', 'Madinah'],
    ['qassim', 'القصيم', 'Qassim'], ['abha', 'أبها', 'Abha'], ['tabuk', 'تبوك', 'Tabuk'],
    ['hail', 'حائل', 'Hail'], ['jazan', 'جازان', 'Jazan'], ['other', 'مدينة أخرى', 'Other city'],
  ],
};
