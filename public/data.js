// Afdal Al-Maaroud (أفضل المعروض) content data. Scores and price ranges are editorial estimates
// (September 2026) and should be reviewed by the team every quarter.
// Every text has ar / en / ur versions.
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
      name: { ar: 'برامج الوكلاء المعتمدة للسيارات المستعملة', en: 'Authorized dealer certified pre-owned', ur: 'ڈیلرز کے مصدقہ استعمال شدہ گاڑیوں کے پروگرام' },
      example: { ar: 'مثل عبداللطيف جميل (تويوتا ولكزس) وبقية الوكلاء', en: 'e.g. Abdul Latif Jameel (Toyota, Lexus) and other brand dealers', ur: 'مثلاً عبداللطیف جمیل (ٹویوٹا، لیکسس) اور دیگر ڈیلرز' },
      url: 'https://www.toyota.com.sa',
      type: 'certified',
      scores: { inspection: 95, warranty: 95, sellerCheck: 100, reviews: 80, transparency: 90, support: 90 },
      pros: {
        ar: ['فحص من الوكيل وضمان رسمي', 'سجل صيانة معروف', 'أوراق نظامية ونقل ملكية مضمون'],
        en: ['Dealer inspection and official warranty', 'Known service history', 'Clean paperwork and safe transfer'],
        ur: ['ڈیلر کا معائنہ اور سرکاری وارنٹی', 'معلوم سروس ہسٹری', 'درست کاغذات اور محفوظ منتقلی'],
      },
      cons: {
        ar: ['أغلى من السوق المفتوح بـ ٨–١٥٪', 'خيارات قليلة تحت ٤٠ ألف'],
        en: ['8–15% above open-market prices', 'Few options under 40,000 SAR'],
        ur: ['کھلی مارکیٹ سے 8–15٪ مہنگی', '40,000 ریال سے کم میں کم آپشنز'],
      },
      signals: { ar: 'تقييمات الوكلاء عادةً إيجابية على خرائط Google', en: 'Dealer branches usually rate well on Google Maps', ur: 'ڈیلر برانچز کی گوگل میپس پر ریٹنگ عموماً اچھی ہوتی ہے' },
    },
    {
      id: 'syarah',
      name: { ar: 'سيارة (Syarah)', en: 'Syarah', ur: 'سیارہ (Syarah)' },
      url: 'https://syarah.com',
      type: 'certified',
      scores: { inspection: 95, warranty: 95, sellerCheck: 90, reviews: 70, transparency: 90, support: 85 },
      pros: {
        ar: ['فحص أكثر من ٢٠٠ نقطة', 'ضمان سنة وإرجاع خلال ١٠ أيام', 'توصيل للباب وتمويل'],
        en: ['200+ point inspection', '1-year warranty, 10-day return', 'Home delivery and financing'],
        ur: ['200 سے زیادہ نکات پر معائنہ', 'ایک سال وارنٹی، 10 دن میں واپسی', 'گھر تک ڈیلیوری اور فنانسنگ'],
      },
      cons: {
        ar: ['الأسعار أعلى من حراج', 'تقييمات Trustpilot ضعيفة (عينة صغيرة)'],
        en: ['Prices above Haraj', 'Weak Trustpilot score (small sample)'],
        ur: ['قیمتیں حراج سے زیادہ', 'Trustpilot اسکور کمزور (کم ریویوز)'],
      },
      signals: {
        ar: 'تقييم التطبيق ٤٫٦ (حسب الشركة) · Trustpilot ١٫٨ من ٢١ مراجعة',
        en: 'App rating 4.6 (company-reported) · Trustpilot 1.8 from 21 reviews',
        ur: 'ایپ ریٹنگ 4.6 (کمپنی کے مطابق) · Trustpilot 1.8، صرف 21 ریویوز',
      },
    },
    {
      id: 'carswitch',
      name: { ar: 'كار سويتش (CarSwitch)', en: 'CarSwitch KSA', ur: 'کار سوئچ (CarSwitch)' },
      url: 'https://ksa.carswitch.com/en',
      type: 'certified',
      scores: { inspection: 95, warranty: 80, sellerCheck: 85, reviews: 85, transparency: 85, support: 85 },
      pros: {
        ar: ['خدمة SafeSwitch: فحص ٢٠٠ نقطة وتقرير حالة', 'يساعدك في نقل الملكية', 'ضمان مجاني بشروط'],
        en: ['SafeSwitch: 200-point inspection and condition report', 'Helps with ownership transfer', 'Free warranty with conditions'],
        ur: ['SafeSwitch: 200 نکات پر معائنہ اور حالت کی رپورٹ', 'ملکیت کی منتقلی میں مدد', 'شرائط کے ساتھ مفت وارنٹی'],
      },
      cons: {
        ar: ['الضمان فقط للسيارات أقل من ١٢ سنة و٢٠٠ ألف كم', 'مخزون أقل من حراج'],
        en: ['Warranty only under 12 years and 200,000 km', 'Smaller stock than Haraj'],
        ur: ['وارنٹی صرف 12 سال اور 2 لاکھ کلومیٹر سے کم پر', 'حراج سے کم گاڑیاں'],
      },
      signals: {
        ar: 'من أعلى المنصات تقييماً في المنطقة حسب الشركة',
        en: 'Among the highest-rated platforms in the region (company-reported)',
        ur: 'خطے کے سب سے زیادہ ریٹڈ پلیٹ فارمز میں سے (کمپنی کے مطابق)',
      },
    },
    {
      id: 'soum',
      name: { ar: 'سوم (Soum)', en: 'Soum', ur: 'سوم (Soum)' },
      url: 'https://soum.sa/ar/%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA',
      type: 'marketplace',
      minBudget: 20000, // Soum's cars start from about 20,000 SAR
      scores: { inspection: 70, warranty: 85, sellerCheck: 80, reviews: 70, transparency: 75, support: 85 },
      pros: {
        ar: ['إرجاع خلال ١٠ أيام', 'تقسيط بدون فوائد وتوصيل للبيت', 'أسعار تبدأ من حوالي ٢٠ ألف ريال'],
        en: ['10-day return', 'Interest-free installments and home delivery', 'Prices start around 20,000 SAR'],
        ur: ['10 دن میں واپسی', 'بغیر سود قسطیں اور گھر تک ڈیلیوری', 'قیمتیں تقریباً 20,000 ریال سے شروع'],
      },
      cons: {
        ar: ['لا يوجد خيارات تحت ٢٠ ألف', 'مخزون أقل من حراج'],
        en: ['Nothing under 20,000 SAR', 'Smaller stock than Haraj'],
        ur: ['20,000 ریال سے کم کچھ نہیں', 'حراج سے کم گاڑیاں'],
      },
      signals: {
        ar: 'منصة سعودية معروفة، والتقسيط مناسب لو معك دفعة أولى بسيطة',
        en: 'Known Saudi platform; installments help if you only have a small down payment',
        ur: 'معروف سعودی پلیٹ فارم؛ اگر آپ کے پاس تھوڑی ابتدائی رقم ہو تو قسطیں مددگار ہیں',
      },
    },
    {
      id: 'motory',
      name: { ar: 'موتري (Motory)', en: 'Motory', ur: 'موٹری (Motory)' },
      url: 'https://ksa.motory.com/en/',
      type: 'marketplace',
      scores: { inspection: 55, warranty: 50, sellerCheck: 75, reviews: 75, transparency: 75, support: 70 },
      pros: {
        ar: ['معارض ووكلاء وأفراد', 'مقارنة مواصفات وطلب تمويل', 'متجر Motory بسيارات مختارة'],
        en: ['Dealers, showrooms and individuals', 'Spec comparison and financing', 'Shop by Motory curated stock'],
        ur: ['ڈیلرز، شورومز اور افراد', 'خصوصیات کا موازنہ اور فنانسنگ', 'Shop by Motory کی منتخب گاڑیاں'],
      },
      cons: {
        ar: ['إعلانات الأفراد بدون فحص', 'تحقق من المعرض بنفسك'],
        en: ['Private listings are not inspected', 'Verify the showroom yourself'],
        ur: ['انفرادی اشتہارات کا معائنہ نہیں ہوتا', 'شوروم کی تصدیق خود کریں'],
      },
      signals: { ar: 'تقييمات تطبيق جيدة، شكاوى قليلة', en: 'Good app ratings, few complaints', ur: 'ایپ ریٹنگ اچھی، شکایات کم' },
    },
    {
      id: 'yallamotor',
      name: { ar: 'يلا موتور (YallaMotor)', en: 'YallaMotor KSA', ur: 'یلا موٹر (YallaMotor)' },
      url: 'https://ksa.yallamotor.com/used-cars',
      type: 'marketplace',
      scores: { inspection: 55, warranty: 45, sellerCheck: 70, reviews: 75, transparency: 80, support: 65 },
      pros: {
        ar: ['أسعار مرجعية ومراجعات للسيارات', 'آلاف الإعلانات', 'خدمات فحص وتمويل'],
        en: ['Price guides and car reviews', 'Thousands of listings', 'Inspection and financing services'],
        ur: ['قیمتوں کی رہنمائی اور گاڑیوں کے ریویوز', 'ہزاروں اشتہارات', 'معائنہ اور فنانسنگ کی سہولت'],
      },
      cons: {
        ar: ['جودة الإعلانات متفاوتة', 'الضمان غير متوفر غالباً'],
        en: ['Listing quality varies', 'Usually no warranty'],
        ur: ['اشتہارات کا معیار مختلف', 'عموماً وارنٹی نہیں'],
      },
      signals: { ar: 'علامة معروفة خليجياً منذ سنوات', en: 'Well-known Gulf brand for years', ur: 'خلیج میں برسوں سے معروف نام' },
    },
    {
      id: 'haraj',
      name: { ar: 'حراج', en: 'Haraj', ur: 'حراج (Haraj)' },
      url: 'https://haraj.com.sa',
      type: 'classifieds',
      scores: { inspection: 10, warranty: 5, sellerCheck: 45, reviews: 70, transparency: 45, support: 30 },
      pros: {
        ar: ['أكبر عدد سيارات في المملكة', 'أفضل الأسعار للميزانيات الصغيرة', 'تقييم البائع وعمر الحساب ظاهر'],
        en: ['Largest car stock in the Kingdom', 'Best prices for small budgets', 'Seller rating and account age visible'],
        ur: ['مملکت میں سب سے زیادہ گاڑیاں', 'چھوٹے بجٹ کے لیے بہترین قیمتیں', 'بیچنے والے کی ریٹنگ اور اکاؤنٹ کی عمر نظر آتی ہے'],
      },
      cons: {
        ar: ['لا يوجد فحص ولا ضمان', 'حالات نصب معروفة: لا تحوّل عربون أبداً'],
        en: ['No inspection, no warranty', 'Known scams: never send a deposit'],
        ur: ['نہ معائنہ، نہ وارنٹی', 'دھوکے کے واقعات: کبھی بیعانہ نہ بھیجیں'],
      },
      signals: {
        ar: 'تطبيق محبوب وسهل، مع تحذيرات متكررة من النصب',
        en: 'Popular, easy app, with repeated scam warnings',
        ur: 'مقبول اور آسان ایپ، مگر دھوکے کی بار بار شکایات',
      },
    },
    {
      id: 'opensooq',
      name: { ar: 'السوق المفتوح (OpenSooq)', en: 'OpenSooq', ur: 'اوپن سوق (OpenSooq)' },
      url: 'https://sa.opensooq.com/en/cars/cars-for-sale',
      type: 'classifieds',
      scores: { inspection: 10, warranty: 5, sellerCheck: 40, reviews: 65, transparency: 50, support: 30 },
      pros: {
        ar: ['إعلانات كثيرة في كل المدن', 'فلترة بالسعر والسنة'],
        en: ['Many listings in every city', 'Price and year filters'],
        ur: ['ہر شہر میں بہت سے اشتہارات', 'قیمت اور سال کے فلٹرز'],
      },
      cons: {
        ar: ['بدون فحص أو ضمان', 'إعلانات مكررة وقديمة'],
        en: ['No inspection or warranty', 'Duplicate and stale ads'],
        ur: ['نہ معائنہ نہ وارنٹی', 'دہرائے ہوئے اور پرانے اشتہارات'],
      },
      signals: { ar: 'مفيد للمقارنة السعرية', en: 'Useful for price comparison', ur: 'قیمتوں کے موازنے کے لیے مفید' },
    },
  ],

  officialChecks: [
    { name: { ar: 'تقرير موجز (Mojaz)', en: 'Mojaz history report', ur: 'موجز (Mojaz) ہسٹری رپورٹ' }, url: 'https://www.tameeni.com/en/car/mojaz', what: { ar: 'عدد الملاك، الحوادث، الصيانة', en: 'Owners, accidents, service records', ur: 'مالکان، حادثات، سروس ریکارڈ' } },
    { name: { ar: 'نجم', en: 'Najm', ur: 'نجم (Najm)' }, url: 'https://www.najm.sa/en/caseinquiry', what: { ar: 'الاستعلام عن الحوادث', en: 'Accident case inquiry', ur: 'حادثات کی معلومات' } },
    { name: { ar: 'أبشر', en: 'Absher', ur: 'ابشر (Absher)' }, url: 'https://www.absher.sa', what: { ar: 'نقل الملكية الإلكتروني والمخالفات', en: 'Online ownership transfer and violations', ur: 'آن لائن ملکیت کی منتقلی اور جرمانے' } },
  ],

  // Budget tiers in SAR. `pick` is the blurred best option.
  tiers: [
    {
      min: 0, max: 10000,
      label: { ar: 'ميزانية اقتصادية', en: 'Starter budget', ur: 'ابتدائی بجٹ' },
      models: ['Hyundai Accent 2010–2013', 'Toyota Yaris 2009–2012', 'Nissan Sunny 2011–2014', 'Kia Rio 2011–2013'],
      where: ['haraj', 'opensooq'],
      expect: {
        ar: 'عمر ١٢–١٦ سنة، ممشى ٢٢٠–٣٢٠ ألف كم. ركّز على المكينة والقير، لا على الشكل.',
        en: '12–16 years old, 220–320k km. Focus on engine and gearbox, not looks.',
        ur: '12–16 سال پرانی، 2.2–3.2 لاکھ کلومیٹر۔ انجن اور گیئر باکس پر توجہ دیں، شکل پر نہیں۔',
      },
      pick: { model: 'Toyota Yaris 2011–2012', km: 250000, price: [7000, 9500], open: 0.85, why: {
        ar: 'أرخص صيانة وقطع متوفرة في كل مكان، ومكينة ١٫٥ تتحمل.',
        en: 'Cheapest to maintain, parts everywhere, durable 1.5 engine.',
        ur: 'سب سے سستی مرمت، پرزے ہر جگہ دستیاب، اور 1.5 انجن مضبوط۔',
      } },
    },
    {
      min: 10000, max: 20000,
      label: { ar: 'ميزانية ذكية', en: 'Smart budget', ur: 'سمارٹ بجٹ' },
      models: ['Hyundai Accent 2015–2017', 'Nissan Sunny 2016–2018', 'Toyota Corolla 2011–2013', 'Kia Cerato 2014–2015'],
      where: ['haraj', 'motory', 'opensooq'],
      expect: { ar: 'عمر ٨–١١ سنة، ممشى ١٨٠–٢٥٠ ألف كم.', en: '8–11 years old, 180–250k km.', ur: '8–11 سال پرانی، 1.8–2.5 لاکھ کلومیٹر۔' },
      pick: { model: 'Toyota Corolla 2012–2013 (1.8)', km: 210000, price: [15000, 19000], open: 0.88, why: {
        ar: 'أعلى قيمة إعادة بيع في فئتها وأقل أعطال.',
        en: 'Best resale value in its class, fewest breakdowns.',
        ur: 'اپنی کلاس میں بہترین ری سیل ویلیو اور سب سے کم خرابیاں۔',
      } },
    },
    {
      min: 20000, max: 35000,
      label: { ar: 'فئة الموظف', en: 'Commuter class', ur: 'روزمرہ سفر کی کلاس' },
      models: ['Toyota Corolla 2016–2018', 'Hyundai Elantra 2017–2019', 'Kia Cerato 2018–2019', 'Toyota Yaris 2018–2020'],
      where: ['syarah', 'carswitch', 'soum', 'haraj'],
      expect: {
        ar: 'عمر ٦–٩ سنوات، ممشى ١٢٠–٢٠٠ ألف كم. هنا تبدأ السيارات المفحوصة بالضمان.',
        en: '6–9 years old, 120–200k km. Inspected cars with warranty start here.',
        ur: '6–9 سال پرانی، 1.2–2 لاکھ کلومیٹر۔ یہاں سے وارنٹی والی معائنہ شدہ گاڑیاں شروع ہوتی ہیں۔',
      },
      pick: { model: 'Toyota Corolla 2017–2018', km: 160000, price: [28000, 34000], open: 0.9, why: {
        ar: 'موثوقة جداً، وتلقاها مفحوصة بضمان في سيارة وكار سويتش.',
        en: 'Very reliable, and available inspected with warranty on Syarah and CarSwitch.',
        ur: 'بہت قابلِ اعتماد، اور سیارہ اور کار سوئچ پر معائنہ شدہ وارنٹی کے ساتھ ملتی ہے۔',
      } },
    },
    {
      min: 35000, max: 60000,
      label: { ar: 'فئة العائلة', en: 'Family class', ur: 'فیملی کلاس' },
      models: ['Toyota Camry 2017–2019', 'Toyota Corolla 2020–2021', 'Hyundai Sonata 2018–2020', 'Kia K5 2021'],
      where: ['syarah', 'carswitch', 'soum', 'dealer-cpo'],
      expect: { ar: 'عمر ٤–٧ سنوات، ممشى ٨٠–١٥٠ ألف كم.', en: '4–7 years old, 80–150k km.', ur: '4–7 سال پرانی، 80 ہزار–1.5 لاکھ کلومیٹر۔' },
      pick: { model: 'Toyota Camry 2018–2019 GL', km: 130000, price: [46000, 56000], open: 0.9, why: {
        ar: 'مساحة عائلية، صيانة معروفة، وتنباع بسرعة لو احتجت تبيعها.',
        en: 'Family space, known maintenance, and sells fast if you need to.',
        ur: 'فیملی کے لیے جگہ، معلوم مرمت، اور ضرورت پڑے تو جلد بک جاتی ہے۔',
      } },
    },
    {
      min: 60000, max: 100000,
      label: { ar: 'فئة الـ SUV', en: 'SUV class', ur: 'SUV کلاس' },
      models: ['Toyota Camry 2021–2022', 'Hyundai Tucson 2021–2022', 'Toyota RAV4 2019–2020', 'Toyota Fortuner 2018–2019'],
      where: ['dealer-cpo', 'syarah', 'carswitch', 'soum'],
      expect: {
        ar: 'عمر ٣–٦ سنوات، ممشى ٥٠–١٢٠ ألف كم. ابحث عن بقية ضمان الوكيل.',
        en: '3–6 years old, 50–120k km. Look for remaining dealer warranty.',
        ur: '3–6 سال پرانی، 50 ہزار–1.2 لاکھ کلومیٹر۔ ڈیلر کی باقی وارنٹی تلاش کریں۔',
      },
      pick: { model: 'Toyota RAV4 2020', km: 95000, price: [72000, 88000], open: 0.92, why: {
        ar: 'SUV اقتصادية بالبنزين، مرتفعة ومريحة للمدينة والسفر.',
        en: 'Fuel-efficient SUV, high seating, good for city and road trips.',
        ur: 'کم پیٹرول خرچ کرنے والی SUV، اونچی سیٹنگ، شہر اور سفر دونوں کے لیے اچھی۔',
      } },
    },
    {
      min: 100000, max: 180000,
      label: { ar: 'فئة الفخامة', en: 'Premium class', ur: 'پریمیم کلاس' },
      models: ['Toyota Land Cruiser 2015–2017', 'Toyota Prado 2019–2021', 'Lexus ES 2020–2021', 'Toyota Camry 2023–2024'],
      where: ['dealer-cpo', 'syarah', 'carswitch'],
      expect: {
        ar: 'عمر ٢–٩ سنوات حسب الموديل. اطلب سجل صيانة الوكيل كاملاً.',
        en: '2–9 years depending on model. Ask for the full dealer service record.',
        ur: 'ماڈل کے لحاظ سے 2–9 سال۔ ڈیلر کا مکمل سروس ریکارڈ مانگیں۔',
      },
      pick: { model: 'Toyota Prado 2020 TXL', km: 110000, price: [115000, 138000], open: 0.9, why: {
        ar: 'تحتفظ بقيمتها، قوية على الطرق الطويلة، وقطعها متوفرة.',
        en: 'Holds its value, strong on long roads, parts widely available.',
        ur: 'قیمت برقرار رکھتی ہے، لمبے سفر میں مضبوط، پرزے عام دستیاب۔',
      } },
    },
    {
      min: 180000, max: Infinity,
      label: { ar: 'فئة VIP', en: 'VIP class', ur: 'VIP کلاس' },
      models: ['Toyota Land Cruiser 2020–2021', 'Lexus LX 2017–2019', 'GMC Yukon 2021–2022', 'Toyota Prado 2023'],
      where: ['dealer-cpo', 'syarah', 'carswitch'],
      expect: {
        ar: 'فحص وكيل إلزامي، وتأكد من عدم وجود حوادث عبر موجز.',
        en: 'Dealer inspection is a must; confirm no accidents through Mojaz.',
        ur: 'ڈیلر کا معائنہ لازمی ہے؛ موجز کے ذریعے حادثات نہ ہونے کی تصدیق کریں۔',
      },
      pick: { model: 'Toyota Land Cruiser 2021 GXR', km: 90000, price: [210000, 250000], open: 0.92, why: {
        ar: 'الأعلى طلباً وقيمة إعادة البيع الأفضل في السوق السعودي.',
        en: 'Most in-demand, best resale value in the Saudi market.',
        ur: 'سعودی مارکیٹ میں سب سے زیادہ مانگ اور بہترین ری سیل ویلیو۔',
      } },
    },
  ],

  sellerSignals: [
    { id: 'age', w: 15, ar: 'عمر الحساب أكثر من سنة', en: 'Account is over 1 year old', ur: 'اکاؤنٹ ایک سال سے پرانا ہے' },
    { id: 'rating', w: 15, ar: 'تقييم البائع جيد وعليه تقييمات حقيقية', en: 'Seller has good, real ratings', ur: 'بیچنے والے کی اچھی اور حقیقی ریٹنگز ہیں' },
    { id: 'price', w: 15, ar: 'السعر قريب من السوق (مو رخيص بشكل مريب)', en: 'Price is close to market (not suspiciously cheap)', ur: 'قیمت مارکیٹ کے قریب ہے (مشکوک حد تک سستی نہیں)' },
    { id: 'inspect', w: 20, ar: 'يوافق على الفحص في مركز تختاره أنت', en: 'Agrees to inspection at a centre you choose', ur: 'آپ کی پسند کے مرکز پر معائنے پر راضی ہے' },
    { id: 'nodeposit', w: 15, ar: 'ما يطلب عربون قبل ما تشوف السيارة', en: 'Does not ask for a deposit before you see the car', ur: 'گاڑی دیکھنے سے پہلے بیعانہ نہیں مانگتا' },
    { id: 'absher', w: 10, ar: 'يوافق على نقل الملكية عبر أبشر', en: 'Agrees to transfer ownership through Absher', ur: 'ابشر کے ذریعے ملکیت منتقل کرنے پر راضی ہے' },
    { id: 'docs', w: 10, ar: 'الاستمارة والفحص الدوري ساريين وباسمه', en: 'Registration and periodic inspection valid and in their name', ur: 'استمارہ اور فحص دوری درست اور اسی کے نام پر ہیں' },
  ],

  // [value, ar, en, ur]
  cities: [
    ['madinah', 'المدينة المنورة', 'Madinah', 'مدینہ منورہ'], ['riyadh', 'الرياض', 'Riyadh', 'ریاض'], ['jeddah', 'جدة', 'Jeddah', 'جدہ'], ['dammam', 'الدمام', 'Dammam', 'دمام'],
    ['khobar', 'الخبر', 'Khobar', 'الخبر'], ['makkah', 'مكة المكرمة', 'Makkah', 'مکہ مکرمہ'],
    ['qassim', 'القصيم', 'Qassim', 'قصیم'], ['abha', 'أبها', 'Abha', 'ابہا'], ['tabuk', 'تبوك', 'Tabuk', 'تبوک'],
    ['hail', 'حائل', 'Hail', 'حائل'], ['jazan', 'جازان', 'Jazan', 'جازان'], ['other', 'مدينة أخرى', 'Other city', 'دوسرا شہر'],
  ],
};

// ---------- search catalog ----------
// Makes and models with the slugs each platform uses in its URLs and the Arabic
// word sellers write in Haraj ads. body: sedan | suv | pickup | van.
window.DALEEL_DATA.catalog = [
  { slug: 'toyota', en: 'Toyota', ar: 'تويوتا', models: [
    ['camry', 'Camry', 'كامري', 'sedan'], ['corolla', 'Corolla', 'كورولا', 'sedan'], ['yaris', 'Yaris', 'يارس', 'sedan'],
    ['avalon', 'Avalon', 'افالون', 'sedan'], ['land-cruiser', 'Land Cruiser', 'لاند كروزر', 'suv'], ['prado', 'Prado', 'برادو', 'suv'],
    ['rav4', 'RAV4', 'راف فور', 'suv'], ['fortuner', 'Fortuner', 'فورتشنر', 'suv'], ['hilux', 'Hilux', 'هايلكس', 'pickup'],
    ['innova', 'Innova', 'انوفا', 'van'] ] },
  { slug: 'hyundai', en: 'Hyundai', ar: 'هونداي', models: [
    ['accent', 'Accent', 'اكسنت', 'sedan'], ['elantra', 'Elantra', 'النترا', 'sedan'], ['sonata', 'Sonata', 'سوناتا', 'sedan'],
    ['azera', 'Azera', 'ازيرا', 'sedan'], ['tucson', 'Tucson', 'توسان', 'suv'], ['santa-fe', 'Santa Fe', 'سنتافي', 'suv'],
    ['creta', 'Creta', 'كريتا', 'suv'] ] },
  { slug: 'kia', en: 'Kia', ar: 'كيا', models: [
    ['rio', 'Rio', 'ريو', 'sedan'], ['pegas', 'Pegas', 'بيجاس', 'sedan'], ['cerato', 'Cerato', 'سيراتو', 'sedan'],
    ['k5', 'K5', 'K5', 'sedan'], ['sportage', 'Sportage', 'سبورتاج', 'suv'], ['sorento', 'Sorento', 'سورينتو', 'suv'],
    ['carnival', 'Carnival', 'كرنفال', 'van'] ] },
  { slug: 'nissan', en: 'Nissan', ar: 'نيسان', models: [
    ['sunny', 'Sunny', 'صني', 'sedan'], ['sentra', 'Sentra', 'سنترا', 'sedan'], ['altima', 'Altima', 'التيما', 'sedan'],
    ['patrol', 'Patrol', 'باترول', 'suv'], ['x-trail', 'X-Trail', 'اكس تريل', 'suv'], ['pathfinder', 'Pathfinder', 'باثفايندر', 'suv'],
    ['navara', 'Navara', 'نافارا', 'pickup'] ] },
  { slug: 'honda', en: 'Honda', ar: 'هوندا', models: [
    ['civic', 'Civic', 'سيفيك', 'sedan'], ['accord', 'Accord', 'اكورد', 'sedan'], ['cr-v', 'CR-V', 'CRV', 'suv'] ] },
  { slug: 'lexus', en: 'Lexus', ar: 'لكزس', models: [
    ['es', 'ES', 'لكزس ES', 'sedan'], ['ls', 'LS', 'لكزس LS', 'sedan'], ['rx', 'RX', 'لكزس RX', 'suv'],
    ['gx', 'GX', 'لكزس GX', 'suv'], ['lx', 'LX', 'لكزس LX', 'suv'] ] },
  { slug: 'chevrolet', en: 'Chevrolet', ar: 'شفروليه', models: [
    ['malibu', 'Malibu', 'ماليبو', 'sedan'], ['captiva', 'Captiva', 'كابتيفا', 'suv'], ['tahoe', 'Tahoe', 'تاهو', 'suv'],
    ['silverado', 'Silverado', 'سلفرادو', 'pickup'] ] },
  { slug: 'gmc', en: 'GMC', ar: 'جمس', models: [
    ['yukon', 'Yukon', 'يوكن', 'suv'], ['sierra', 'Sierra', 'سييرا', 'pickup'] ] },
  { slug: 'ford', en: 'Ford', ar: 'فورد', models: [
    ['taurus', 'Taurus', 'تورس', 'sedan'], ['explorer', 'Explorer', 'اكسبلورر', 'suv'], ['expedition', 'Expedition', 'اكسبديشن', 'suv'],
    ['f-150', 'F-150', 'F150', 'pickup'] ] },
  { slug: 'mazda', en: 'Mazda', ar: 'مازدا', models: [
    ['cx-5', 'CX-5', 'مازدا CX5', 'suv'], ['cx-9', 'CX-9', 'مازدا CX9', 'suv'] ] },
  { slug: 'mitsubishi', en: 'Mitsubishi', ar: 'ميتسوبيشي', models: [
    ['attrage', 'Attrage', 'اتراج', 'sedan'], ['lancer', 'Lancer', 'لانسر', 'sedan'], ['pajero', 'Pajero', 'باجيرو', 'suv'] ] },
];

// Features the buyer can tick. `q` is the word sellers write in ads (used in deep search).
window.DALEEL_DATA.features = [
  { id: 'auto', q: 'اوتوماتيك', ar: 'قير أوتوماتيك', en: 'Automatic', ur: 'آٹومیٹک گیئر' },
  { id: 'full', q: 'فل كامل', ar: 'فل كامل', en: 'Full option', ur: 'فل آپشن' },
  { id: 'agency', q: 'صيانة وكالة', ar: 'صيانة وكالة', en: 'Dealer-serviced', ur: 'ڈیلر سے سروس شدہ' },
  { id: 'saudi', q: 'سعودي', ar: 'سعودي (وكالة)', en: 'Saudi spec', ur: 'سعودی اسپیک' },
  { id: 'owner', q: 'مالك واحد', ar: 'مالك واحد', en: 'Single owner', ur: 'ایک مالک' },
  { id: 'noacc', q: 'بدون حوادث', ar: 'بدون حوادث', en: 'No accidents', ur: 'بغیر حادثے' },
  { id: 'sunroof', q: 'فتحة سقف', ar: 'فتحة سقف', en: 'Sunroof', ur: 'سن روف' },
  { id: 'leather', q: 'جلد', ar: 'مقاعد جلد', en: 'Leather seats', ur: 'چمڑے کی سیٹیں' },
  { id: 'camera', q: 'كاميرا خلفية', ar: 'كاميرا خلفية', en: 'Rear camera', ur: 'ریئر کیمرہ' },
  { id: 'cruise', q: 'مثبت سرعة', ar: 'مثبت سرعة', en: 'Cruise control', ur: 'کروز کنٹرول' },
  { id: 'nav', q: 'شاشة', ar: 'شاشة وملاحة', en: 'Screen & navigation', ur: 'اسکرین اور نیویگیشن' },
  { id: 'hybrid', q: 'هايبرد', ar: 'هايبرد', en: 'Hybrid', ur: 'ہائبرڈ' },
  { id: 'diesel', q: 'ديزل', ar: 'ديزل', en: 'Diesel', ur: 'ڈیزل' },
  { id: 'warranty', q: 'ضمان', ar: 'عليها ضمان', en: 'Under warranty', ur: 'وارنٹی میں' },
];

// City names as each platform writes them in URLs (only cities with a known format).
window.DALEEL_DATA.cityUrls = {
  haraj: { riyadh: 'الرياض', jeddah: 'جده', dammam: 'الشرقيه', khobar: 'الشرقيه', makkah: 'مكه', madinah: 'المدينه', qassim: 'القصيم', abha: 'ابها', tabuk: 'تبوك', hail: 'حائل', jazan: 'جازان' },
  carswitch: { riyadh: 'riyadh', jeddah: 'jeddah' },
  opensooq: { riyadh: 'riyadh', jeddah: 'jeddah', dammam: 'dammam' },
  motory: { riyadh: 'riyadh-haraj', jeddah: 'jeddah-haraj', dammam: 'dammam-haraj' },
};
