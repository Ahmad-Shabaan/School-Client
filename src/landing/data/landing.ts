import type {
  ContactField,
  ContactRow,
  FaqItem,
  LandingSlide,
  NavLink,
  Pillar,
  ServiceLink,
  SheikhCard,
} from "@/landing/types/landing";

export const brandName = "المدرسة النُّعمانية";
export const brandMark = "س";
export const loginLabel = "تسجيل الدخول";

export const navLinks: NavLink[] = [
  { href: "#school", label: "عن المدرسة" },
  { href: "#sheikhs", label: "هيئة التدريس" },
  { href: "#knowledge", label: "المقررات" },
  { href: "#inquiries", label: "الاستفسارات" },
  { href: "#faq", label: "الأسئلة المتكررة" },
];

export const headingEyebrowDots = 3;

export const heroTitleBefore = "طريقك نحو";
export const heroTitleHighlight = "العلم الشرعي الأصيل";

export const heroSlides: LandingSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=85",
    alt: "إعلان أكاديمية السلطان الحنفي",
  },
  {
    src: "https://images.unsplash.com/photo-1752900385454-7876eec9c326?auto=format&fit=crop&w=1400&q=85",
    alt: "إعلان أكاديمية السلطان الحنفي",
  },
  {
    src: "https://images.unsplash.com/photo-1585036156171-384164a8c675?auto=format&fit=crop&w=1400&q=85",
    alt: "إعلان أكاديمية السلطان الحنفي",
  },
];

export const slideOrdinals = ["الأول", "الثاني", "الثالث"];

export const slidePrevLabel = "الصورة السابقة";
export const slideNextLabel = "الصورة التالية";

export const aboutHeading = "عن المدرسة";

export const aboutText =
  "تأسست أكاديمية السلطان الحنفي لتكون منارة للعلم الشرعي في العصر الرقمي. " +
  "نؤمن بأن طلب العلم فريضة، ولذلك جمعنا بين أصالة المنهج وحداثة الوسيلة، " +
  "لنقدّم دروسًا منهجية ودورات متخصصة ومقارئ قرآنية بإشراف نخبة من المشايخ " +
  "المجازين، وصولًا إلى إجازة موثقة بسند متصل.";

export const sheikhsHeading = "هيئة التدريس";
export const sheikhsLede =
  "نخبة من المشايخ والمعلمات المجازين، بخبرة تمتد لعقود في التدريس والتأصيل العلمي.";

export const sheikhs: SheikhCard[] = [
  {
    initial: "ع",
    name: "الشيخ د. عبدالله الرحمن",
    role: "أستاذ التفسير وعلوم القرآن",
    bio: "مجاز بالقراءات العشر، وله خبرة تزيد عن 20 عامًا في التدريس الأكاديمي.",
  },
  {
    initial: "م",
    name: "الشيخ محمد السالم",
    role: "أستاذ الفقه وأصوله",
    bio: "متخصص في الفقه المقارن، أشرف على تخريج مئات الطلبة في الدورات التأصيلية.",
  },
  {
    initial: "ف",
    name: "الشيخة فاطمة الزهراء",
    role: "أستاذة العقيدة (القسم النسائي)",
    bio: "متخصصة في العقيدة الإسلامية، تقدّم شروحًا ميسرة للمتون العلمية.",
  },
];

export const knowledgeHeading = "العلوم الشرعية";

export const pillars: Pillar[] = [
  {
    letter: "ف",
    title: "الفقه وأصوله",
    description: "فهم الأحكام الشرعية العملية ودليلها.",
  },
  {
    letter: "ع",
    title: "العقيدة",
    description: "تثبيت أصول الإيمان بفهم سلف الأمة.",
  },
  {
    letter: "ت",
    title: "التفسير",
    description: "تدبر كتاب الله وفهم معانيه.",
  },
  {
    letter: "ل",
    title: "اللغة العربية",
    description: "أداة فهم النصوص الشرعية على وجهها الصحيح.",
  },
];

export const knowledgeText =
  "إن طلب العلم الشرعي من أسمى الغايات وأشرف المقاصد؛ به يُعرف الله ويُعبد، " +
  "وبه تُعرف الأحكام وتستقيم الحياة. نحرص في الأكاديمية على تقديم علم صافٍ " +
  "مستمد من الكتاب والسنة، ليكون زادًا للطالب في دنياه وآخرته.";

export const inquiriesHeading = "هل لديك استفسار؟";
export const inquiriesLede =
  "فريق الدعم وإدارة المدرسة متواجدون دائمًا للرد على أسئلتك ومساعدتك في التسجيل.";

export const contactTitle = "بيانات التواصل";
export const contactDescription =
  "راسلنا مباشرة أو استخدم النموذج، وسيتم الرد خلال يوم عمل واحد.";

export const contactRows: ContactRow[] = [
  {
    icon: "email",
    title: "البريد الإلكتروني",
    value: "info@sultan-academy.com",
    ltr: true,
  },
  {
    icon: "phone",
    title: "الهاتف / واتساب",
    value: "+20 100 000 0000",
    ltr: true,
  },
  {
    icon: "clock",
    title: "أوقات العمل",
    value: "السبت – الخميس، 8 ص – 8 م",
  },
];

export const contactFields: ContactField[] = [
  { label: "الاسم الكريم", placeholder: "اكتب اسمك" },
  { label: "البريد الإلكتروني", placeholder: "example@mail.com", type: "email" },
  {
    label: "موضوع الاستفسار",
    placeholder: "مثال: التسجيل في دورة التفسير",
  },
  {
    label: "تفاصيل الاستفسار",
    placeholder: "اكتب استفسارك هنا...",
    textarea: true,
    rows: 4,
  },
];

export const sendLabel = "إرسال الاستفسار";

export const faqHeading = "الأسئلة المتكررة";

export const faqItems: FaqItem[] = [
  {
    question: "كيف يمكنني التسجيل في الدورات؟",
    answer:
      'يمكن للطالب التسجيل من خلال الضغط على زر "تسجيل الدخول" أعلى الصفحة، ' +
      "إنشاء حساب جديد، ثم التوجه إلى صفحة الدورات لاختيار الدورة المناسبة.",
    defaultOpen: true,
  },
  {
    question: "هل الدروس النسائية مفصولة تمامًا؟",
    answer:
      "نعم، توفّر المنصة بيئة مخصصة ومستقلة للقسم النسائي بإشراف معلمات " +
      "ومحفّظات مجازات، لضمان الخصوصية التامة.",
  },
  {
    question: "هل الدورات مجانية أم مدفوعة؟",
    answer:
      "يوجد لدينا مسارات مجانية بالكامل، إلى جانب بعض البرامج المتخصصة " +
      "التي تتطلب رسومًا رمزية.",
  },
  {
    question: "هل يوجد شهادات أو إجازات بعد إتمام المقرأة؟",
    answer:
      "بالتأكيد، يُمنح الطالب إجازة بسند متصل إلى النبي ﷺ بعد اجتيازه " +
      "اختبارات الختمة المقررة بنجاح.",
  },
];

export const footerName = "أكاديمية السلطان الحنفي";

export const footerBlurb =
  "طريقك نحو العلم الشرعي المؤصل وفق منهج علمي رصين، على يد نخبة من " +
  "المشايخ والمتخصصين، لتيسير طلب العلم للجميع في كل مكان.";

export const footerQuickTitle = "روابط سريعة";
export const footerContactTitle = "تواصل معنا";

export const footerLinks: NavLink[] = [
  { href: "#school", label: "عن المدرسة" },
  { href: "#sheikhs", label: "المشايخ" },
  { href: "#knowledge", label: "العلوم الشرعية" },
  { href: "#inquiries", label: "استفسارات" },
  { href: "#faq", label: "الأسئلة المتكررة" },
];

export const footerContacts: { value: string; ltr?: boolean }[] = [
  { value: "info@sultan-academy.com", ltr: true },
  { value: "+20 100 000 0000", ltr: true },
  { value: "السبت – الخميس، 8 ص – 8 م" },
];

export const copyrightLine = `جميع الحقوق محفوظة © 2026 ${footerName}`;

export const servicesTitle = "مزيد من الخدمات";

export const servicesLinks: ServiceLink[] = [
  { href: "#", label: "شروط القبول" },
  { href: "#", label: "الدورات" },
  { href: "#", label: "الدروس النسائية" },
  { href: "#", label: "إجازات القرآن" },
  { href: "#", label: "المقرأة" },
  { href: "#", label: "مجالس الرواية والإسناد" },
  { href: "#", label: "دروس اللغة العربية" },
];