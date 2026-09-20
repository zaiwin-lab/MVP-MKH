/* --------------------------------------------------------------------------
   Express portal copy, in Bahasa Malaysia and English.

   One rule governs this file: **only labels translate, never values.** Every
   option the customer picks is stored under its canonical Malay value, so a
   lead captured in English and a lead captured in Malay land in the same CRM
   column with the same string. Translating stored values would quietly split
   every report in two.
   -------------------------------------------------------------------------- */

export type Lang = "ms" | "en" | "zh" | "iba";

export const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: "en", label: "EN", full: "English" },
  { code: "ms", label: "BM", full: "Bahasa Malaysia" },
  { code: "zh", label: "\u4e2d", full: "\u4e2d\u6587" },
  { code: "iba", label: "IB", full: "Jaku Iban" },
];

/** The page prerenders in Malay, so this is also the server snapshot. */
export const DEFAULT_LANG: Lang = "ms";

type Copy = {
  htmlLang: string;
  brandPartners: string;
  programBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroBody: string;
  trust: [string, string, string];
  heroCta: string;
  heroPhotoAlt: string;
  statLabels: [string, string, string];
  statValues: [string, string, string];

  poweredBy: string;
  heroSecondary: string;
  heroProofs: { label: string; note: string }[];
  mockTitle: string;
  mockRange: string;
  mockRows: { label: string; value: string }[];
  mockFoot: string;

  processEyebrow: string;
  processTitle: string;
  processLede: string;
  process: { title: string; body: string }[];

  closerTitle: string;
  closerTitleTwo: string;
  closerLede: string;
  footerLanguage: string;
  footerRights: string;

  steps: [string, string, string, string, string];
  stepNav: string;
  currentStep: string;

  landTitle: string;
  landSupport: string;
  landPhotoAlt: string;
  fieldDivision: string;
  fieldArea: string;
  fieldAreaPlaceholder: string;
  fieldLandSize: string;
  fieldLandSizePlaceholder: string;
  fieldRemark: string;
  fieldRemarkPlaceholder: string;

  homeTitle: string;
  homeSupport: string;
  fieldHouseType: string;
  fieldBedrooms: string;
  fieldBathrooms: string;

  financeTitle: string;
  financeSupport: string;
  fieldFinancing: string;
  calcKicker: string;
  calcPrompt: string;
  calcBody: string;
  calcCta: string;

  guideTitle: string;
  guideSupport: string;
  guideLegend: string;

  aboutTitle: string;
  aboutSupport: string;
  fieldName: string;
  fieldNamePlaceholder: string;
  fieldPhone: string;
  fieldEmail: string;
  fieldHomeNumber: string;
  consentText: string;

  ctaKicker: string;
  ctaBody: string;
  ctaNoDocs: string;
  submit: string;
  submitting: string;
  errorCount: (n: number) => string;
  sendFailed: string;

  errName: string;
  errPhone: string;
  errEmail: string;
  errConsent: string;

  successKicker: string;
  successTitle: (firstName: string) => string;
  successBody: string;
  referenceLabel: string;
  nextSteps: [string, string, string, string];
  successFooter: string;
  successPhotoAlt: string;

  calcTitle: string;
  calcIntro: string;
  calcIncome: string;
  calcIncomePlaceholder: string;
  calcCommitments: string;
  calcCommitmentsPlaceholder: string;
  calcAge: string;
  calcAgePlaceholder: string;
  calcInvalid: string;
  calcResultLabel: string;
  calcInstalment: string;
  calcTenure: string;
  calcYears: string;
  calcAgeCapped: string;
  calcTargetLabel: (band: string) => string;
  calcComfortable: string;
  calcWithin: string;
  calcStretched: string;
  calcOverCommitted: string;
  calcDisclaimer: (rate: number, years: number) => string;
  calcTenureLabel: string;
  calcTenureYears: (n: number) => string;
  calcJointToggle: string;
  calcJointNote: string;
  calcSingle: string;
  calcJoint: string;
  calcSpouseIncome: string;
  calcSpouseCommitments: string;
  calcSpouseAge: string;
  calcSpouseAgePlaceholder: string;
  calcCappedByAge: (years: number) => string;
  calcCappedByProduct: (years: number) => string;
  calcJointBasis: (income: string) => string;
  themeLabel: string;
  themeDark: string;
  themeBright: string;
  calcRun: string;
  calcRerun: string;
  calcClose: string;
  calcDone: string;
  calcCloseLabel: string;

  footerNote: string;
  langLabel: string;
  bubbleCalc: string;
  bubbleWhatsApp: string;
  kobisSignature: string;
  waHandoffTitle: string;
  waHandoffBody: string;
  waHandoffCta: string;
  waIntro: (reference: string) => string;
};

const ms: Copy = {
  htmlLang: "ms-MY",
  brandPartners: "EG Megah Holdings × KOBIS Berhad",
  programBadge: "Program Pemilikan Rumah",
  heroTitle: "Jom Kita Mulakan!",
  heroTitleAccent: "Perjalanan Membina Rumah Impian Anda.",
  heroBody:
    "Kongsikan beberapa maklumat ringkas. Kami akan memahami tanah, pilihan rumah dan sasaran pembiayaan anda, kemudian team kami guide langkah seterusnya.",
  trust: ["Percuma", "Ringkas", "Dipandu"],
  heroCta: "Mula Sekarang",
  heroPhotoAlt:
    "Rumah dua tingkat moden dengan serambi berpilar dan halaman berumput.",
  statLabels: ["Masa diperlukan", "Dokumen sekarang", "Kos pendaftaran"],
  statValues: ["2 minit", "Tiada", "Percuma"],

  poweredBy: "Dikuasakan oleh EG Megah Holdings",
  heroSecondary: "Lihat cara ia berfungsi",
  heroProofs: [
    { label: "Percuma sepenuhnya", note: "Tiada bayaran pendaftaran" },
    { label: "2 minit sahaja", note: "Borang ringkas, bukan borang bank" },
    { label: "Tiada dokumen", note: "Belum perlu apa-apa sekarang" },
  ],
  mockTitle: "Anggaran Kelayakan",
  mockRange: "RM586,011 \u2013 RM747,669",
  mockRows: [
    { label: "Ansuran bulanan", value: "RM3,300" },
    { label: "Tempoh", value: "30 tahun" },
    { label: "Jenis", value: "Bersama pasangan" },
  ],
  mockFoot: "Contoh anggaran. Cuba dengan angka anda sendiri.",


  processEyebrow: "Proses",
  processTitle: "Siap dalam 2 minit",
  processLede: "Tiga langkah mudah sebelum consultant kami hubungi anda.",
  process: [
    {
      title: "Isi borang ringkas",
      body: "Kongsikan tanah, pilihan rumah dan sasaran pembiayaan anda. Semua ruangan awal adalah pilihan.",
    },
    {
      title: "Kami semak dan sediakan",
      body: "Team kami nilai maklumat anda dan sediakan cadangan rumah serta laluan pembiayaan yang sesuai.",
    },
    {
      title: "Consultant hubungi anda",
      body: "Mengikut kaedah pilihan anda, lengkap dengan process flow dan senarai dokumen.",
    },
  ],

  closerTitle: "Rumah anda",
  closerTitleTwo: "bermula di sini.",
  closerLede:
    "Sertai keluarga Sarawak yang sedang membina rumah sendiri bersama My Kenyalang Homes.",
  footerLanguage: "Bahasa",
  footerRights: "Hak cipta terpelihara.",

  steps: ["Tanah", "Rumah", "Bajet", "Guide", "Siap"],
  stepNav: "Langkah perjalanan",
  currentStep: "(langkah semasa)",

  landTitle: "Tanah Anda",
  landSupport: "Tak pasti? Tak mengapa, semua ruangan ini adalah pilihan.",
  landPhotoAlt: "Pandangan udara lot tanah yang telah dibahagi di Sarawak.",
  fieldDivision: "Bahagian / Division",
  fieldArea: "Kawasan / Area",
  fieldAreaPlaceholder: "Contoh: Samariang / Matang / Satok",
  fieldLandSize: "Anggaran Saiz Tanah",
  fieldLandSizePlaceholder: "Contoh: 0.5 acre / 8 points / 3,000 sq ft",
  fieldRemark: "Catatan / Remark",
  fieldRemarkPlaceholder: "Apa-apa maklumat tambahan",

  homeTitle: "Rumah Pilihan Anda",
  homeSupport: "Beri kami gambaran ringkas rumah impian anda.",
  fieldHouseType: "Jenis Rumah",
  fieldBedrooms: "Jumlah Bilik",
  fieldBathrooms: "Bilik Air / Tandas",

  financeTitle: "Sasaran Pembiayaan",
  financeSupport: "Pilih anggaran pembiayaan yang anda sasarkan.",
  fieldFinancing: "Anggaran Pembiayaan",
  calcKicker: "Pilihan · Semak dalam 60 saat",
  calcPrompt: "Nak tahu anggaran kelayakan anda?",
  calcBody: "Cuba AI Financing Calculator untuk anggaran awal.",
  calcCta: "Cuba AI Calculator",

  guideTitle: "Bagaimana Anda Mahu Kami Guide?",
  guideSupport: "Pilih kaedah konsultasi yang paling sesuai untuk anda.",
  guideLegend: "Kaedah konsultasi",

  aboutTitle: "Tentang Anda",
  aboutSupport: "Supaya kami boleh daftarkan anda dan guide langkah seterusnya.",
  fieldName: "Nama Penuh",
  fieldNamePlaceholder: "Nama seperti dalam IC",
  fieldPhone: "No. Telefon",
  fieldEmail: "Email",
  fieldHomeNumber: "Ini Adalah Rumah:",
  consentText:
    "Saya bersetuju untuk dihubungi oleh My Kenyalang Homes berkenaan pemilikan rumah dan pembiayaan.",

  ctaKicker: "Anda Hampir Selesai",
  ctaBody: "Hantar sekali. Kami guide langkah seterusnya.",
  ctaNoDocs: "Tiada dokumen diperlukan sekarang.",
  submit: "Hantar & Mulakan Perjalanan Saya",
  submitting: "Menghantar…",
  errorCount: (n) => `Sila lengkapkan ${n} ruangan di atas.`,
  sendFailed:
    "Maaf, penghantaran tidak berjaya. Sila semak sambungan internet anda dan cuba sekali lagi.",

  errName: "Sila masukkan nama penuh anda.",
  errPhone: "Sila masukkan no. telefon yang boleh dihubungi.",
  errEmail: "Sila masukkan alamat email yang sah.",
  errConsent: "Sila tandakan persetujuan untuk kami hubungi anda.",

  successKicker: "Perjalanan Anda Telah Bermula",
  successTitle: (name) => (name ? `Terima Kasih, ${name}.` : "Terima Kasih."),
  successBody: "Maklumat anda telah diterima.",
  referenceLabel: "Rujukan Anda",
  nextSteps: [
    "Consultant kami akan menghubungi anda mengikut kaedah pilihan anda.",
    "Email rasmi Process Flow dan Documents Checklist akan dihantar.",
    "Anda bersedia untuk proses semakan dan submission pembiayaan.",
    "EG Megah boleh menyediakan cadangan rumah berdasarkan keperluan dan sasaran pembiayaan anda.",
  ],
  successFooter:
    "Tiada dokumen diperlukan sekarang. Simpan nombor rujukan anda untuk memudahkan rujukan bersama consultant kami.",
  successPhotoAlt: "Matahari terbenam di atas Sungai Sarawak, Kuching.",

  calcTitle: "AI Financing Calculator",
  calcIntro:
    "Isi maklumat ringkas untuk anggaran awal. Ini bukan kelulusan pembiayaan.",
  calcIncome: "Pendapatan Kasar Bulanan (RM)",
  calcIncomePlaceholder: "Contoh: 5000",
  calcCommitments: "Komitmen Bulanan Sedia Ada (RM)",
  calcCommitmentsPlaceholder: "Contoh: 800 (kereta, PTPTN, kad kredit)",
  calcAge: "Umur Anda",
  calcAgePlaceholder: "Contoh: 32",
  calcInvalid:
    "Masukkan pendapatan bulanan dan umur antara 18 hingga 65 untuk mendapatkan anggaran.",
  calcResultLabel: "Anggaran Pembiayaan",
  calcInstalment: "Anggaran ansuran bulanan",
  calcTenure: "Tempoh",
  calcYears: "tahun",
  calcAgeCapped: "had umur 70",
  calcTargetLabel: (band) => `Sasaran anda (${band})`,
  calcComfortable: "Selesa",
  calcWithin: "Dalam julat",
  calcStretched: "Agak ketat",
  calcOverCommitted:
    "Berdasarkan angka ini, komitmen sedia ada anda sudah menggunakan sebahagian besar pendapatan. Consultant kami boleh bantu lihat pilihan yang ada.",
  calcDisclaimer: (rate, years) =>
    `Anggaran sahaja, berdasarkan kadar indikatif ${rate}% setahun, margin pembiayaan 90% dan tempoh ${years} tahun, dengan DSR 55-65% yang biasa digunakan bank. Bukan kelulusan pembiayaan. Keputusan sebenar ditentukan oleh bank.`,
  calcTenureLabel: "Tempoh Pembiayaan Dipilih",
  calcTenureYears: (n) => `${n} tahun`,
  calcJointToggle: "Pemohon",
  calcJointNote:
    "Pembiayaan bersama menggabungkan pendapatan dan komitmen anda berdua. Tempoh dikira ikut pemohon yang lebih berumur.",
  calcSingle: "Sendiri",
  calcJoint: "Bersama Pasangan",
  calcSpouseIncome: "Pendapatan Kasar Pasangan (RM)",
  calcSpouseCommitments: "Komitmen Bulanan Pasangan (RM)",
  calcSpouseAge: "Umur Pasangan",
  calcSpouseAgePlaceholder: "Contoh: 30",
  calcCappedByAge: (years) =>
    `dihadkan kepada ${years} tahun oleh had umur 70`,
  calcCappedByProduct: (years) => `maksimum ${years} tahun`,
  calcJointBasis: (income) => `Berdasarkan pendapatan bersama ${income}`,
  themeLabel: "Tema paparan",
  themeDark: "Gelap",
  themeBright: "Cerah",
  calcRun: "Kira Anggaran Saya",
  calcRerun: "Kira Semula",
  calcClose: "Tutup",
  calcDone: "Selesai, Teruskan",
  calcCloseLabel: "Tutup kalkulator",

  footerNote:
    "Maklumat yang anda kongsikan digunakan untuk menghubungi anda berkenaan pemilikan rumah dan pembiayaan sahaja.",
  langLabel: "Pilih bahasa",
  bubbleCalc: "AI Calculator",
  bubbleWhatsApp: "WhatsApp",
  kobisSignature: "Direka & Dibina oleh KOBIS Berhad",
  waHandoffTitle: "Mahu terus berbual?",
  waHandoffBody:
    "Hantar ringkasan anda terus ke WhatsApp kami. Semua maklumat sudah diisi \u2014 anda cuma perlu tekan hantar.",
  waHandoffCta: "Buka WhatsApp",
  waIntro: (reference) =>
    `Hai My Kenyalang Homes. Saya baru hantar borang pendaftaran. Rujukan saya ${reference}.`,
};

const en: Copy = {
  htmlLang: "en-MY",
  brandPartners: "EG Megah Holdings × KOBIS Berhad",
  programBadge: "Home Ownership Programme",
  heroTitle: "Let's Begin.",
  heroTitleAccent: "The Journey To Your Own Home.",
  heroBody:
    "Share a few quick details. We will understand your land, your preferred home and your financing target, then our team guides you through what comes next.",
  trust: ["Free", "Quick", "Guided"],
  heroCta: "Start Now",
  heroPhotoAlt:
    "A modern double-storey home with a columned porch and a lawn.",
  statLabels: ["Time needed", "Documents now", "Registration cost"],
  statValues: ["2 minutes", "None", "Free"],

  poweredBy: "Powered by EG Megah Holdings",
  heroSecondary: "See how it works",
  heroProofs: [
    { label: "Completely free", note: "No registration fee" },
    { label: "Two minutes", note: "A short form, not a bank form" },
    { label: "No documents", note: "Nothing needed from you yet" },
  ],
  mockTitle: "Eligibility Estimate",
  mockRange: "RM586,011 \u2013 RM747,669",
  mockRows: [
    { label: "Monthly instalment", value: "RM3,300" },
    { label: "Tenure", value: "30 years" },
    { label: "Type", value: "Joint with spouse" },
  ],
  mockFoot: "An example. Try it with your own figures.",


  processEyebrow: "Process",
  processTitle: "Done in two minutes",
  processLede: "Three simple steps before our consultant calls you.",
  process: [
    {
      title: "Fill the short form",
      body: "Share your land, preferred home and financing target. Everything in the early sections is optional.",
    },
    {
      title: "We review and prepare",
      body: "Our team assesses what you sent and prepares home proposals and a financing route that fits.",
    },
    {
      title: "A consultant contacts you",
      body: "By the method you chose, with the process flow and document checklist in hand.",
    },
  ],

  closerTitle: "Your home",
  closerTitleTwo: "starts here.",
  closerLede:
    "Join the Sarawak families building their own homes with My Kenyalang Homes.",
  footerLanguage: "Language",
  footerRights: "All rights reserved.",

  steps: ["Land", "Home", "Budget", "Guide", "Done"],
  stepNav: "Journey steps",
  currentStep: "(current step)",

  landTitle: "Your Land",
  landSupport: "Not sure yet? That is fine, every field here is optional.",
  landPhotoAlt: "An aerial view of subdivided land plots in Sarawak.",
  fieldDivision: "Division",
  fieldArea: "Area",
  fieldAreaPlaceholder: "e.g. Samariang / Matang / Satok",
  fieldLandSize: "Approximate Land Size",
  fieldLandSizePlaceholder: "e.g. 0.5 acre / 8 points / 3,000 sq ft",
  fieldRemark: "Remark",
  fieldRemarkPlaceholder: "Anything else we should know",

  homeTitle: "Your Preferred Home",
  homeSupport: "Give us a quick picture of the home you have in mind.",
  fieldHouseType: "Home Type",
  fieldBedrooms: "Bedrooms",
  fieldBathrooms: "Bathrooms",

  financeTitle: "Financing Target",
  financeSupport: "Pick the financing range you are aiming for.",
  fieldFinancing: "Financing Range",
  calcKicker: "Optional · Check in 60 seconds",
  calcPrompt: "Want an idea of what you qualify for?",
  calcBody: "Try the AI Financing Calculator for an initial estimate.",
  calcCta: "Try AI Calculator",

  guideTitle: "How Would You Like Us To Guide You?",
  guideSupport: "Choose the way that suits you best.",
  guideLegend: "Consultation method",

  aboutTitle: "About You",
  aboutSupport: "So we can register you and guide the next step.",
  fieldName: "Full Name",
  fieldNamePlaceholder: "Name as per IC",
  fieldPhone: "Phone Number",
  fieldEmail: "Email",
  fieldHomeNumber: "This Home Is My:",
  consentText:
    "I agree to be contacted by My Kenyalang Homes about home ownership and financing.",

  ctaKicker: "You Are Almost Done",
  ctaBody: "Send once. We guide the next step.",
  ctaNoDocs: "No documents needed right now.",
  submit: "Send & Start My Journey",
  submitting: "Sending…",
  errorCount: (n) => `Please complete ${n} field${n === 1 ? "" : "s"} above.`,
  sendFailed:
    "Sorry, that did not send. Please check your internet connection and try once more.",

  errName: "Please enter your full name.",
  errPhone: "Please enter a phone number we can reach you on.",
  errEmail: "Please enter a valid email address.",
  errConsent: "Please tick the box so we may contact you.",

  successKicker: "Your Journey Has Started",
  successTitle: (name) => (name ? `Thank You, ${name}.` : "Thank You."),
  successBody: "We have received your details.",
  referenceLabel: "Your Reference",
  nextSteps: [
    "Our consultant will contact you using the method you chose.",
    "An official email with the Process Flow and Documents Checklist will follow.",
    "You will be ready for the financing review and submission.",
    "EG Megah can prepare home proposals based on your needs and financing target.",
  ],
  successFooter:
    "No documents are needed right now. Keep your reference number handy when you speak with our consultant.",
  successPhotoAlt: "Sunset over the Sarawak River in Kuching.",

  calcTitle: "AI Financing Calculator",
  calcIntro:
    "A few quick details for an initial estimate. This is not a financing approval.",
  calcIncome: "Gross Monthly Income (RM)",
  calcIncomePlaceholder: "e.g. 5000",
  calcCommitments: "Existing Monthly Commitments (RM)",
  calcCommitmentsPlaceholder: "e.g. 800 (car, study loan, credit card)",
  calcAge: "Your Age",
  calcAgePlaceholder: "e.g. 32",
  calcInvalid:
    "Enter your monthly income and an age between 18 and 65 to see an estimate.",
  calcResultLabel: "Estimated Financing",
  calcInstalment: "Estimated monthly instalment",
  calcTenure: "Tenure",
  calcYears: "years",
  calcAgeCapped: "capped at age 70",
  calcTargetLabel: (band) => `Your target (${band})`,
  calcComfortable: "Comfortable",
  calcWithin: "Within range",
  calcStretched: "A stretch",
  calcOverCommitted:
    "On these figures your existing commitments already take up most of your income. Our consultant can help you look at the options.",
  calcDisclaimer: (rate, years) =>
    `An estimate only, based on an indicative ${rate}% per year, a 90% margin of finance and a ${years} year tenure, against the 55-65% debt service ratio banks typically apply. Not a financing approval. The bank makes the actual decision.`,
  calcTenureLabel: "Preferred Financing Tenure",
  calcTenureYears: (n) => `${n} years`,
  calcJointToggle: "Applicant",
  calcJointNote:
    "A joint application pools both incomes and both commitments. The tenure is set by whichever of you is older.",
  calcSingle: "Just Me",
  calcJoint: "With Spouse",
  calcSpouseIncome: "Spouse Gross Monthly Income (RM)",
  calcSpouseCommitments: "Spouse Monthly Commitments (RM)",
  calcSpouseAge: "Spouse Age",
  calcSpouseAgePlaceholder: "e.g. 30",
  calcCappedByAge: (years) => `capped at ${years} years by the age-70 limit`,
  calcCappedByProduct: (years) => `${years} years maximum`,
  calcJointBasis: (income) => `Based on a combined income of ${income}`,
  themeLabel: "Display theme",
  themeDark: "Dark",
  themeBright: "Bright",
  calcRun: "Calculate My Estimate",
  calcRerun: "Recalculate",
  calcClose: "Close",
  calcDone: "Done, Continue",
  calcCloseLabel: "Close calculator",

  footerNote:
    "What you share is used only to contact you about home ownership and financing.",
  langLabel: "Choose language",
  bubbleCalc: "AI Calculator",
  bubbleWhatsApp: "WhatsApp",
  kobisSignature: "Designed & Built by KOBIS Berhad",
  waHandoffTitle: "Prefer to chat now?",
  waHandoffBody:
    "Send your summary straight to our WhatsApp. Everything is filled in already \u2014 you only press send.",
  waHandoffCta: "Open WhatsApp",
  waIntro: (reference) =>
    `Hi My Kenyalang Homes. I have just submitted the registration form. My reference is ${reference}.`,
};

/* --------------------------------------------------------------------------
   Chinese (Simplified). Financial terms follow Malaysian banking usage:
   "\u6bdb\u6536\u5165" for gross income, "\u4f9b\u6b3e" for the monthly instalment,
   "\u8d37\u6b3e\u5e74\u9650" for tenure.
   -------------------------------------------------------------------------- */
const zh: Copy = {
  htmlLang: "zh-MY",
  brandPartners: "EG Megah Holdings \u00d7 KOBIS Berhad",
  programBadge: "\u7f6e\u4e1a\u8ba1\u5212",
  heroTitle: "\u5f00\u59cb\u5427\uff01",
  heroTitleAccent: "\u5efa\u9020\u60a8\u68a6\u60f3\u5bb6\u56ed\u7684\u65c5\u7a0b\u3002",
  heroBody:
    "\u53ea\u9700\u586b\u5199\u51e0\u9879\u7b80\u5355\u8d44\u6599\u3002\u6211\u4eec\u4f1a\u4e86\u89e3\u60a8\u7684\u571f\u5730\u3001\u623f\u5c4b\u504f\u597d\u548c\u8d37\u6b3e\u76ee\u6807\uff0c\u7136\u540e\u7531\u6211\u4eec\u7684\u56e2\u961f\u5f15\u5bfc\u60a8\u8fdb\u884c\u4e0b\u4e00\u6b65\u3002",
  trust: ["\u5b8c\u5168\u514d\u8d39", "\u7b80\u5355\u5feb\u6377", "\u5168\u7a0b\u5f15\u5bfc"],
  heroCta: "\u7acb\u5373\u5f00\u59cb",
  heroPhotoAlt: "",
  statLabels: ["\u6240\u9700\u65f6\u95f4", "\u73b0\u9700\u6587\u4ef6", "\u767b\u8bb0\u8d39\u7528"],
  statValues: ["2 \u5206\u949f", "\u65e0", "\u514d\u8d39"],

  poweredBy: "\u7531 EG Megah Holdings \u652f\u6301",
  heroSecondary: "\u4e86\u89e3\u8fd0\u4f5c\u65b9\u5f0f",
  heroProofs: [
    { label: "\u5b8c\u5168\u514d\u8d39", note: "\u65e0\u9700\u767b\u8bb0\u8d39" },
    { label: "\u53ea\u9700\u4e24\u5206\u949f", note: "\u7b80\u77ed\u8868\u683c\uff0c\u4e0d\u662f\u94f6\u884c\u8868\u683c" },
    { label: "\u65e0\u9700\u6587\u4ef6", note: "\u73b0\u9636\u6bb5\u4e0d\u9700\u63d0\u4ea4\u4efb\u4f55\u8d44\u6599" },
  ],
  mockTitle: "\u8d37\u6b3e\u80fd\u529b\u4f30\u7b97",
  mockRange: "RM586,011 \u2013 RM747,669",
  mockRows: [
    { label: "\u6bcf\u6708\u4f9b\u6b3e", value: "RM3,300" },
    { label: "\u8d37\u6b3e\u5e74\u9650", value: "30 \u5e74" },
    { label: "\u7c7b\u578b", value: "\u4e0e\u914d\u5076\u8054\u540d" },
  ],
  mockFoot: "\u6b64\u4e3a\u793a\u4f8b\u3002\u8bf7\u7528\u60a8\u81ea\u5df1\u7684\u6570\u5b57\u8bd5\u7b97\u3002",


  processEyebrow: "\u6d41\u7a0b",
  processTitle: "\u4e24\u5206\u949f\u5b8c\u6210",
  processLede: "\u987e\u95ee\u8054\u7edc\u60a8\u4e4b\u524d\uff0c\u53ea\u6709\u4e09\u4e2a\u7b80\u5355\u6b65\u9aa4\u3002",
  process: [
    {
      title: "\u586b\u5199\u7b80\u77ed\u8868\u683c",
      body: "\u5206\u4eab\u60a8\u7684\u571f\u5730\u3001\u623f\u5c4b\u504f\u597d\u548c\u8d37\u6b3e\u76ee\u6807\u3002\u524d\u9762\u51e0\u9879\u5747\u4e3a\u9009\u586b\u3002",
    },
    {
      title: "\u6211\u4eec\u5ba1\u6838\u5e76\u51c6\u5907",
      body: "\u56e2\u961f\u4f1a\u8bc4\u4f30\u60a8\u63d0\u4f9b\u7684\u8d44\u6599\uff0c\u51c6\u5907\u5408\u9002\u7684\u623f\u5c4b\u65b9\u6848\u548c\u8d37\u6b3e\u8def\u5f84\u3002",
    },
    {
      title: "\u987e\u95ee\u8054\u7edc\u60a8",
      body: "\u6309\u60a8\u9009\u62e9\u7684\u65b9\u5f0f\uff0c\u5e76\u9644\u4e0a\u6d41\u7a0b\u8bf4\u660e\u548c\u6587\u4ef6\u6e05\u5355\u3002",
    },
  ],

  closerTitle: "\u60a8\u7684\u5bb6",
  closerTitleTwo: "\u4ece\u8fd9\u91cc\u5f00\u59cb\u3002",
  closerLede: "\u52a0\u5165\u6b63\u5728\u4e0e My Kenyalang Homes \u5efa\u9020\u81ea\u5df1\u5bb6\u56ed\u7684\u7802\u62c9\u8d8a\u5bb6\u5ead\u3002",
  footerLanguage: "\u8bed\u8a00",
  footerRights: "\u7248\u6743\u6240\u6709\u3002",

  steps: ["\u571f\u5730", "\u623f\u5c4b", "\u9884\u7b97", "\u5f15\u5bfc", "\u5b8c\u6210"],
  stepNav: "\u65c5\u7a0b\u6b65\u9aa4",
  currentStep: "\uff08\u5f53\u524d\u6b65\u9aa4\uff09",

  landTitle: "\u60a8\u7684\u571f\u5730",
  landSupport: "\u8fd8\u4e0d\u786e\u5b9a\uff1f\u6ca1\u5173\u7cfb\uff0c\u8fd9\u91cc\u6bcf\u4e00\u9879\u90fd\u662f\u9009\u586b\u7684\u3002",
  landPhotoAlt: "",
  fieldDivision: "\u7701\u5206 / Division",
  fieldArea: "\u5730\u533a / Area",
  fieldAreaPlaceholder: "\u4f8b\u5982\uff1aSamariang / Matang / Satok",
  fieldLandSize: "\u571f\u5730\u9762\u79ef\uff08\u4f30\u8ba1\uff09",
  fieldLandSizePlaceholder: "\u4f8b\u5982\uff1a0.5 acre / 8 points / 3,000 sq ft",
  fieldRemark: "\u5907\u6ce8",
  fieldRemarkPlaceholder: "\u5176\u4ed6\u60f3\u8ba9\u6211\u4eec\u77e5\u9053\u7684\u8d44\u6599",

  homeTitle: "\u60a8\u5fc3\u4eea\u7684\u623f\u5c4b",
  homeSupport: "\u7b80\u5355\u544a\u8bc9\u6211\u4eec\u60a8\u60f3\u8981\u7684\u623f\u5b50\u3002",
  fieldHouseType: "\u623f\u5c4b\u7c7b\u578b",
  fieldBedrooms: "\u623f\u95f4\u6570\u76ee",
  fieldBathrooms: "\u6d74\u5ba4 / \u536b\u751f\u95f4",

  financeTitle: "\u8d37\u6b3e\u76ee\u6807",
  financeSupport: "\u9009\u62e9\u60a8\u6240\u9884\u671f\u7684\u8d37\u6b3e\u8303\u56f4\u3002",
  fieldFinancing: "\u8d37\u6b3e\u8303\u56f4",
  calcKicker: "\u9009\u586b \u00b7 60 \u79d2\u5185\u5b8c\u6210",
  calcPrompt: "\u60f3\u77e5\u9053\u81ea\u5df1\u7684\u8d37\u6b3e\u80fd\u529b\u5417\uff1f",
  calcBody: "\u8bd5\u7528 AI \u8d37\u6b3e\u8ba1\u7b97\u5668\u83b7\u53d6\u521d\u6b65\u4f30\u7b97\u3002",
  calcCta: "\u8bd5\u7528 AI \u8ba1\u7b97\u5668",

  guideTitle: "\u5e0c\u671b\u6211\u4eec\u5982\u4f55\u8054\u7edc\u60a8\uff1f",
  guideSupport: "\u9009\u62e9\u6700\u9002\u5408\u60a8\u7684\u65b9\u5f0f\u3002",
  guideLegend: "\u54a8\u8be2\u65b9\u5f0f",

  aboutTitle: "\u5173\u4e8e\u60a8",
  aboutSupport: "\u4ee5\u4fbf\u6211\u4eec\u4e3a\u60a8\u767b\u8bb0\u5e76\u5f15\u5bfc\u4e0b\u4e00\u6b65\u3002",
  fieldName: "\u5168\u540d",
  fieldNamePlaceholder: "\u4e0e\u8eab\u4efd\u8bc1\u4e0a\u76f8\u540c\u7684\u540d\u5b57",
  fieldPhone: "\u8054\u7edc\u7535\u8bdd",
  fieldEmail: "\u7535\u90ae",
  fieldHomeNumber: "\u8fd9\u662f\u6211\u7684\uff1a",
  consentText:
    "\u6211\u540c\u610f My Kenyalang Homes \u5c31\u8d2d\u623f\u4e0e\u8d37\u6b3e\u4e8b\u5b9c\u8054\u7edc\u6211\u3002",

  ctaKicker: "\u5feb\u5b8c\u6210\u4e86",
  ctaBody: "\u63d0\u4ea4\u4e00\u6b21\uff0c\u5176\u4f59\u4ea4\u7ed9\u6211\u4eec\u3002",
  ctaNoDocs: "\u73b0\u5728\u65e0\u9700\u4efb\u4f55\u6587\u4ef6\u3002",
  submit: "\u63d0\u4ea4\u5e76\u5f00\u59cb\u6211\u7684\u65c5\u7a0b",
  submitting: "\u63d0\u4ea4\u4e2d\u2026",
  errorCount: (n) => `\u8bf7\u5b8c\u6210\u4e0a\u65b9 ${n} \u9879\u8d44\u6599\u3002`,
  sendFailed:
    "\u62b1\u6b49\uff0c\u63d0\u4ea4\u5931\u8d25\u3002\u8bf7\u68c0\u67e5\u7f51\u7edc\u8fde\u63a5\u540e\u518d\u8bd5\u4e00\u6b21\u3002",

  errName: "\u8bf7\u586b\u5199\u60a8\u7684\u5168\u540d\u3002",
  errPhone: "\u8bf7\u586b\u5199\u53ef\u8054\u7edc\u7684\u7535\u8bdd\u53f7\u7801\u3002",
  errEmail: "\u8bf7\u586b\u5199\u6709\u6548\u7684\u7535\u90ae\u5730\u5740\u3002",
  errConsent: "\u8bf7\u52fe\u9009\u4ee5\u4fbf\u6211\u4eec\u8054\u7edc\u60a8\u3002",

  successKicker: "\u60a8\u7684\u65c5\u7a0b\u5df2\u5f00\u59cb",
  successTitle: (name) => (name ? `\u8c22\u8c22\u60a8\uff0c${name}\u3002` : "\u8c22\u8c22\u60a8\u3002"),
  successBody: "\u6211\u4eec\u5df2\u6536\u5230\u60a8\u7684\u8d44\u6599\u3002",
  referenceLabel: "\u60a8\u7684\u7f16\u53f7",
  nextSteps: [
    "\u6211\u4eec\u7684\u987e\u95ee\u4f1a\u6309\u60a8\u9009\u62e9\u7684\u65b9\u5f0f\u8054\u7edc\u60a8\u3002",
    "\u6d41\u7a0b\u8bf4\u660e\u548c\u6587\u4ef6\u6e05\u5355\u5c06\u4ee5\u7535\u90ae\u5bc4\u51fa\u3002",
    "\u60a8\u5c06\u505a\u597d\u8d37\u6b3e\u5ba1\u6838\u4e0e\u63d0\u4ea4\u7684\u51c6\u5907\u3002",
    "EG Megah \u53ef\u4ee5\u6839\u636e\u60a8\u7684\u9700\u6c42\u548c\u8d37\u6b3e\u76ee\u6807\u51c6\u5907\u623f\u5c4b\u65b9\u6848\u3002",
  ],
  successFooter:
    "\u73b0\u5728\u65e0\u9700\u4efb\u4f55\u6587\u4ef6\u3002\u4e0e\u987e\u95ee\u6c9f\u901a\u65f6\u8bf7\u51c6\u5907\u597d\u60a8\u7684\u7f16\u53f7\u3002",
  successPhotoAlt: "",

  calcTitle: "AI \u8d37\u6b3e\u8ba1\u7b97\u5668",
  calcIntro:
    "\u586b\u5199\u51e0\u9879\u8d44\u6599\u5373\u53ef\u83b7\u5f97\u521d\u6b65\u4f30\u7b97\u3002\u6b64\u4e3a\u4f30\u7b97\uff0c\u5e76\u975e\u8d37\u6b3e\u6279\u51c6\u3002",
  calcIncome: "\u6bcf\u6708\u6bdb\u6536\u5165\uff08RM\uff09",
  calcIncomePlaceholder: "\u4f8b\u5982\uff1a5000",
  calcCommitments: "\u73b0\u6709\u6bcf\u6708\u627f\u62c5\uff08RM\uff09",
  calcCommitmentsPlaceholder: "\u4f8b\u5982\uff1a800\uff08\u8f66\u8d37\u3001\u5b66\u8d37\u3001\u4fe1\u7528\u5361\uff09",
  calcAge: "\u60a8\u7684\u5e74\u9f84",
  calcAgePlaceholder: "\u4f8b\u5982\uff1a32",
  calcInvalid:
    "\u8bf7\u586b\u5199\u6bcf\u6708\u6536\u5165\uff0c\u5e74\u9f84\u987b\u572818\u81f365\u5c81\u4e4b\u95f4\u3002",
  calcResultLabel: "\u8d37\u6b3e\u4f30\u7b97",
  calcInstalment: "\u6bcf\u6708\u4f9b\u6b3e\uff08\u4f30\u7b97\uff09",
  calcTenure: "\u8d37\u6b3e\u5e74\u9650",
  calcYears: "\u5e74",
  calcAgeCapped: "\u53d770\u5c81\u4e0a\u9650\u6240\u9650",
  calcTargetLabel: (band) => `\u60a8\u7684\u76ee\u6807\uff08${band}\uff09`,
  calcComfortable: "\u5bbd\u88d5",
  calcWithin: "\u5728\u8303\u56f4\u5185",
  calcStretched: "\u7565\u7d27",
  calcOverCommitted:
    "\u4ee5\u8fd9\u4e9b\u6570\u5b57\u6765\u770b\uff0c\u73b0\u6709\u627f\u62c5\u5df2\u5360\u7528\u5927\u90e8\u5206\u6536\u5165\u3002\u6211\u4eec\u7684\u987e\u95ee\u53ef\u4ee5\u534f\u52a9\u60a8\u770b\u770b\u9009\u9879\u3002",
  calcDisclaimer: (rate, years) =>
    `\u4ec5\u4e3a\u4f30\u7b97\uff0c\u57fa\u4e8e\u53c2\u8003\u5229\u7387\u6bcf\u5e74 ${rate}%\u3001\u8d37\u6b3e\u6bd4\u4f8b 90% \u548c ${years} \u5e74\u5e74\u9650\uff0c\u5e76\u4ee5\u94f6\u884c\u5e38\u7528\u7684 55-65% \u507f\u503a\u6bd4\u7387\u8ba1\u7b97\u3002\u6b64\u4e3a\u4f30\u7b97\uff0c\u5e76\u975e\u8d37\u6b3e\u6279\u51c6\uff0c\u6700\u7ec8\u7531\u94f6\u884c\u51b3\u5b9a\u3002`,
  calcTenureLabel: "\u9009\u62e9\u8d37\u6b3e\u5e74\u9650",
  calcTenureYears: (n) => `${n} \u5e74`,
  calcJointToggle: "\u7533\u8bf7\u4eba",
  calcJointNote:
    "\u8054\u540d\u7533\u8bf7\u4f1a\u5408\u5e76\u4e24\u4eba\u7684\u6536\u5165\u548c\u627f\u62c5\u3002\u5e74\u9650\u4ee5\u5e74\u957f\u7684\u4e00\u4f4d\u4e3a\u51c6\u3002",
  calcSingle: "\u53ea\u6709\u6211",
  calcJoint: "\u4e0e\u914d\u5076",
  calcSpouseIncome: "\u914d\u5076\u6bcf\u6708\u6bdb\u6536\u5165\uff08RM\uff09",
  calcSpouseCommitments: "\u914d\u5076\u6bcf\u6708\u627f\u62c5\uff08RM\uff09",
  calcSpouseAge: "\u914d\u5076\u5e74\u9f84",
  calcSpouseAgePlaceholder: "\u4f8b\u5982\uff1a30",
  calcCappedByAge: (years) => `\u53d770\u5c81\u4e0a\u9650\u6240\u9650\uff0c\u4e3a ${years} \u5e74`,
  calcCappedByProduct: (years) => `\u6700\u957f ${years} \u5e74`,
  calcJointBasis: (income) => `\u57fa\u4e8e\u5408\u5e76\u6536\u5165 ${income}`,
  themeLabel: "\u663e\u793a\u4e3b\u9898",
  themeDark: "\u6df1\u8272",
  themeBright: "\u6d45\u8272",
  calcRun: "\u8ba1\u7b97\u6211\u7684\u4f30\u7b97",
  calcRerun: "\u91cd\u65b0\u8ba1\u7b97",
  calcClose: "\u5173\u95ed",
  calcDone: "\u5b8c\u6210\uff0c\u7ee7\u7eed",
  calcCloseLabel: "\u5173\u95ed\u8ba1\u7b97\u5668",

  footerNote:
    "\u60a8\u63d0\u4f9b\u7684\u8d44\u6599\u4ec5\u7528\u4e8e\u5c31\u8d2d\u623f\u4e0e\u8d37\u6b3e\u4e8b\u5b9c\u8054\u7edc\u60a8\u3002",
  langLabel: "\u9009\u62e9\u8bed\u8a00",
  bubbleCalc: "AI \u8ba1\u7b97\u5668",
  bubbleWhatsApp: "WhatsApp",
  kobisSignature: "\u7531 KOBIS Berhad \u8bbe\u8ba1\u4e0e\u5f00\u53d1",
  waHandoffTitle: "\u60f3\u73b0\u5728\u5c31\u804a\uff1f",
  waHandoffBody:
    "\u628a\u60a8\u7684\u6458\u8981\u76f4\u63a5\u53d1\u5230\u6211\u4eec\u7684 WhatsApp\u3002\u5185\u5bb9\u5df2\u7ecf\u586b\u597d\uff0c\u60a8\u53ea\u9700\u6309\u53d1\u9001\u3002",
  waHandoffCta: "\u6253\u5f00 WhatsApp",
  waIntro: (reference) =>
    `\u60a8\u597d My Kenyalang Homes\u3002\u6211\u521a\u63d0\u4ea4\u4e86\u767b\u8bb0\u8868\u683c\uff0c\u6211\u7684\u7f16\u53f7\u662f ${reference}\u3002`,
};
/* --------------------------------------------------------------------------
   Iban. Written to be read by a Sarawakian speaker, not transliterated from
   Malay word for word. Administrative terms that Iban borrows unchanged
   (Bahagian, telefon, email) are left as they are.

   NOT NATIVE-REVIEWED. Have an Iban speaker read this before ad spend starts.
   -------------------------------------------------------------------------- */
const iba: Copy = {
  htmlLang: "iba-MY",
  brandPartners: "EG Megah Holdings \u00d7 KOBIS Berhad",
  programBadge: "Program Pengempu Rumah",
  heroTitle: "Aram Kitai Berengkah!",
  heroTitleAccent: "Pejalai Ngaga Rumah Impian Nuan.",
  heroBody:
    "Beri kami sekeda penerang ti mudah. Kami deka nemu pasal tanah, rumah ti dikedeka nuan enggau bajet pinjam nuan, udah nya pengawa kami nunjuk jalai ti berikut.",
  trust: ["Percuma", "Mudah", "Ditunjuk"],
  heroCta: "Berengkah Diatu",
  heroPhotoAlt: "",
  statLabels: ["Jam ti diguna", "Surat diatu", "Rega daftar"],
  statValues: ["2 minit", "Nadai", "Percuma"],

  poweredBy: "Disukung EG Megah Holdings",
  heroSecondary: "Peda baka ni iya bejalai",
  heroProofs: [
    { label: "Percuma magang", note: "Nadai rega daftar" },
    { label: "Semina dua minit", note: "Borang mudah, ukai borang bank" },
    { label: "Nadai surat", note: "Nadai utai diminta diatu" },
  ],
  mockTitle: "Anggar Pengelayak Pinjam",
  mockRange: "RM586,011 \u2013 RM747,669",
  mockRows: [
    { label: "Bayar tiap bulan", value: "RM3,300" },
    { label: "Lama pinjam", value: "30 taun" },
    { label: "Jenis", value: "Enggau kaban bini/laki" },
  ],
  mockFoot: "Tu chunto aja. Uji enggau nambar nuan empu.",


  processEyebrow: "Jalai",
  processTitle: "Tembu dalam dua minit",
  processLede: "Tiga tikas ti mudah sebedau consultant kami ngabas nuan.",
  process: [
    {
      title: "Isi borang ti mudah",
      body: "Beri kami penerang pasal tanah, rumah ti dikedeka enggau bajet pinjam nuan. Semua ti dulu nya pilih aja.",
    },
    {
      title: "Kami meda lalu nyendia",
      body: "Pengawa kami meda penerang nuan lalu nyendia saran rumah enggau jalai pinjam ti ngena.",
    },
    {
      title: "Consultant ngabas nuan",
      body: "Nitih chara ti dipilih nuan, enggau jalai pengawa sereta senarai surat.",
    },
  ],

  closerTitle: "Rumah nuan",
  closerTitleTwo: "berengkah ditu.",
  closerLede:
    "Sama enggau bala sebilik Sarawak ti benung ngaga rumah sida empu enggau My Kenyalang Homes.",
  footerLanguage: "Jaku",
  footerRights: "Semua hak ditagang.",

  steps: ["Tanah", "Rumah", "Bajet", "Tunjuk", "Tembu"],
  stepNav: "Tikas pejalai",
  currentStep: "(tikas diatu)",

  landTitle: "Tanah Nuan",
  landSupport: "Apin tentu? Nadai nama, semua ruang tu nya pilih aja.",
  landPhotoAlt: "",
  fieldDivision: "Bahagian / Division",
  fieldArea: "Endur / Area",
  fieldAreaPlaceholder: "Chunto: Samariang / Matang / Satok",
  fieldLandSize: "Anggar Besai Tanah",
  fieldLandSizePlaceholder: "Chunto: 0.5 acre / 8 points / 3,000 sq ft",
  fieldRemark: "Penerang Tambah",
  fieldRemarkPlaceholder: "Nama-nama penerang ti bukai",

  homeTitle: "Rumah Pilih Nuan",
  homeSupport: "Beri kami gambar ti mudah pasal rumah impian nuan.",
  fieldHouseType: "Jenis Rumah",
  fieldBedrooms: "Penyampau Bilik",
  fieldBathrooms: "Bilik Ai / Jamban",

  financeTitle: "Bajet Pinjam",
  financeSupport: "Pilih anggar pinjam ti dikira nuan.",
  fieldFinancing: "Anggar Pinjam",
  calcKicker: "Pilih \u00b7 Peda dalam 60 saat",
  calcPrompt: "Deka nemu anggar pengelayak nuan?",
  calcBody: "Uji AI Financing Calculator kena ngambi anggar ti dulu.",
  calcCta: "Uji AI Calculator",

  guideTitle: "Baka Ni Nuan Deka Kami Nunjuk?",
  guideSupport: "Pilih chara ti pemadu ngena ke nuan.",
  guideLegend: "Chara berandau",

  aboutTitle: "Pasal Nuan",
  aboutSupport: "Ngambika kami ulih ndaftar nuan lalu nunjuk jalai ti berikut.",
  fieldName: "Nama Penuh",
  fieldNamePlaceholder: "Nama baka ba IC",
  fieldPhone: "No. Telefon",
  fieldEmail: "Email",
  fieldHomeNumber: "Tu Rumah:",
  consentText:
    "Aku setuju diabas My Kenyalang Homes pasal pengempu rumah enggau pinjam.",

  ctaKicker: "Nuan Mimit Agi Tembu",
  ctaBody: "Kirim sekali. Kami nunjuk jalai ti berikut.",
  ctaNoDocs: "Nadai surat diguna diatu.",
  submit: "Kirim & Berengkah Pejalai Aku",
  submitting: "Benung ngirim\u2026",
  errorCount: (n) => `Tulung penuhka ${n} ruang ba atas.`,
  sendFailed:
    "Maaf, pengirim nya enda menyana. Tulung peda sambung internet nuan lalu uji baru.",

  errName: "Tulung isi nama penuh nuan.",
  errPhone: "Tulung isi no. telefon ti ulih diabas.",
  errEmail: "Tulung isi alamat email ti betul.",
  errConsent: "Tulung tanda kotak tu ngambika kami ulih ngabas nuan.",

  successKicker: "Pejalai Nuan Udah Berengkah",
  successTitle: (name) => (name ? `Terima Kasih, ${name}.` : "Terima Kasih."),
  successBody: "Penerang nuan udah diterima kami.",
  referenceLabel: "Nombor Nuan",
  nextSteps: [
    "Consultant kami deka ngabas nuan nitih chara ti dipilih nuan.",
    "Email resmi pasal jalai pengawa enggau senarai surat deka dikirim.",
    "Nuan udah sedia kena pengawa meda enggau ngirim pinjam.",
    "EG Megah ulih nyendia saran rumah nitih pengguna enggau bajet pinjam nuan.",
  ],
  successFooter:
    "Nadai surat diguna diatu. Simpan nombor nuan kena berandau enggau consultant kami.",
  successPhotoAlt: "",

  calcTitle: "AI Financing Calculator",
  calcIntro:
    "Isi sekeda penerang ti mudah kena ngambi anggar ti dulu. Tu ukai pengelulus pinjam.",
  calcIncome: "Pendapat Kasar Tiap Bulan (RM)",
  calcIncomePlaceholder: "Chunto: 5000",
  calcCommitments: "Tanggung Tiap Bulan Ti Bisi (RM)",
  calcCommitmentsPlaceholder: "Chunto: 800 (kereta, PTPTN, kad kredit)",
  calcAge: "Umur Nuan",
  calcAgePlaceholder: "Chunto: 32",
  calcInvalid:
    "Isi pendapat tiap bulan enggau umur entara 18 ngagai 65 kena ngambi anggar.",
  calcResultLabel: "Anggar Pinjam",
  calcInstalment: "Anggar bayar tiap bulan",
  calcTenure: "Lama pinjam",
  calcYears: "taun",
  calcAgeCapped: "ditagang had umur 70",
  calcTargetLabel: (band) => `Bajet nuan (${band})`,
  calcComfortable: "Lantang",
  calcWithin: "Dalam julat",
  calcStretched: "Sikit ketat",
  calcOverCommitted:
    "Nitih nambar tu, tanggung ti bisi udah ngena mayuh ari pendapat nuan. Consultant kami ulih nulung meda pilihan ti bisi.",
  calcDisclaimer: (rate, years) =>
    `Anggar aja, nitih kadar ${rate}% tiap taun, margin pinjam 90% enggau lama ${years} taun, nitih DSR 55-65% ti biasa dikena bank. Tu ukai pengelulus pinjam. Pemutus ti amat datai ari bank.`,
  calcTenureLabel: "Lama Pinjam Ti Dipilih",
  calcTenureYears: (n) => `${n} taun`,
  calcJointToggle: "Orang ti minta",
  calcJointNote:
    "Pinjam sama nyampur pendapat enggau tanggung seduai. Lama pinjam dikira nitih orang ti tuai agi.",
  calcSingle: "Aku Aja",
  calcJoint: "Enggau Kaban",
  calcSpouseIncome: "Pendapat Kasar Kaban (RM)",
  calcSpouseCommitments: "Tanggung Tiap Bulan Kaban (RM)",
  calcSpouseAge: "Umur Kaban",
  calcSpouseAgePlaceholder: "Chunto: 30",
  calcCappedByAge: (years) => `ditagang had umur 70, nyadi ${years} taun`,
  calcCappedByProduct: (years) => `pemanjai ${years} taun`,
  calcJointBasis: (income) => `Nitih pendapat sama ${income}`,
  themeLabel: "Chara paparan",
  themeDark: "Petang",
  themeBright: "Terang",
  calcRun: "Kira Anggar Aku",
  calcRerun: "Kira Baru",
  calcClose: "Tutup",
  calcDone: "Tembu, Teruska",
  calcCloseLabel: "Tutup calculator",

  footerNote:
    "Penerang ti dibagi nuan semina dikena kena ngabas nuan pasal pengempu rumah enggau pinjam.",
  langLabel: "Pilih jaku",
  bubbleCalc: "AI Calculator",
  bubbleWhatsApp: "WhatsApp",
  kobisSignature: "Digaga sereta dibuat KOBIS Berhad",
  waHandoffTitle: "Deka berandau diatu?",
  waHandoffBody:
    "Kirim ringkasan nuan terus ngagai WhatsApp kami. Semua udah diisi \u2014 nuan semina nekan kirim.",
  waHandoffCta: "Buka WhatsApp",
  waIntro: (reference) =>
    `Halo My Kenyalang Homes. Aku baru ngirim borang daftar. Nombor aku ${reference}.`,
};

export const COPY: Record<Lang, Copy> = { ms, en, zh, iba };
