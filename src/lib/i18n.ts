/* --------------------------------------------------------------------------
   Express portal copy, in Bahasa Malaysia and English.

   One rule governs this file: **only labels translate, never values.** Every
   option the customer picks is stored under its canonical Malay value, so a
   lead captured in English and a lead captured in Malay land in the same CRM
   column with the same string. Translating stored values would quietly split
   every report in two.
   -------------------------------------------------------------------------- */

export type Lang = "ms" | "en";

export const LANGS: { code: Lang; label: string; full: string }[] = [
  { code: "ms", label: "BM", full: "Bahasa Malaysia" },
  { code: "en", label: "EN", full: "English" },
];

/** The page prerenders in Malay, so this is also the server snapshot. */
export const DEFAULT_LANG: Lang = "ms";

type Copy = {
  htmlLang: string;
  brandPartners: string;
  expressBadge: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroBody: string;
  trust: [string, string, string];
  heroCta: string;
  heroPhotoAlt: string;
  statLabels: [string, string, string];
  statValues: [string, string, string];

  reasonsTitle: string;
  reasons: { title: string; body: string }[];

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
  optional: string;

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
  calcRun: string;
  calcRerun: string;
  calcClose: string;
  calcDone: string;
  calcCloseLabel: string;

  footerNote: string;
  langLabel: string;
};

const ms: Copy = {
  htmlLang: "ms-MY",
  brandPartners: "EG Megah Holdings × KOBIS Berhad",
  expressBadge: "Express Journey",
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

  reasonsTitle: "4 Sebab Untuk Mula Hari Ini",
  reasons: [
    {
      title: "Tanah anda dinilai dahulu",
      body: "Kami lihat lokasi dan saiz tanah anda sebelum cadangkan apa-apa rumah.",
    },
    {
      title: "Rumah yang padan",
      body: "Cadangan direka mengikut bilangan bilik dan bajet yang anda sasarkan.",
    },
    {
      title: "Pembiayaan dipandu",
      body: "Kami terangkan proses bank dan dokumen yang perlu, langkah demi langkah.",
    },
    {
      title: "Satu team, satu rujukan",
      body: "Seorang consultant menguruskan perjalanan anda dari mula hingga kunci.",
    },
  ],

  steps: ["Tanah", "Rumah", "Pembiayaan", "Guide", "Selesai"],
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
  optional: "Pilihan",

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
  calcCta: "Cuba AI",

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
    "Isi tiga maklumat ringkas untuk anggaran awal. Ini bukan kelulusan pembiayaan.",
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
    `Anggaran sahaja, berdasarkan kadar indikatif ${rate}% setahun, margin 90% dan tempoh ${years} tahun. Bukan kelulusan pembiayaan. Keputusan sebenar ditentukan oleh bank.`,
  calcRun: "Kira Anggaran Saya",
  calcRerun: "Kira Semula",
  calcClose: "Tutup",
  calcDone: "Selesai, Teruskan",
  calcCloseLabel: "Tutup kalkulator",

  footerNote:
    "My Kenyalang Homes, Express Journey. Maklumat yang anda kongsikan digunakan untuk menghubungi anda berkenaan pemilikan rumah dan pembiayaan sahaja.",
  langLabel: "Pilih bahasa",
};

const en: Copy = {
  htmlLang: "en-MY",
  brandPartners: "EG Megah Holdings × KOBIS Berhad",
  expressBadge: "Express Journey",
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

  reasonsTitle: "4 Reasons To Start Today",
  reasons: [
    {
      title: "Your land comes first",
      body: "We look at where your land is and how big it is before proposing any home.",
    },
    {
      title: "A home that fits",
      body: "Proposals are shaped around the rooms you need and the budget you have in mind.",
    },
    {
      title: "Financing, explained",
      body: "We walk you through the bank process and the documents needed, step by step.",
    },
    {
      title: "One team, one reference",
      body: "A single consultant handles your journey from the first call to the keys.",
    },
  ],

  steps: ["Land", "Home", "Financing", "Guide", "Done"],
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
  optional: "Optional",

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
  calcCta: "Try AI",

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
    "Three quick details for an initial estimate. This is not a financing approval.",
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
    `An estimate only, based on an indicative ${rate}% per year, a 90% margin of finance and a ${years} year tenure. Not a financing approval. The bank makes the actual decision.`,
  calcRun: "Calculate My Estimate",
  calcRerun: "Recalculate",
  calcClose: "Close",
  calcDone: "Done, Continue",
  calcCloseLabel: "Close calculator",

  footerNote:
    "My Kenyalang Homes, Express Journey. What you share is used only to contact you about home ownership and financing.",
  langLabel: "Choose language",
};

export const COPY: Record<Lang, Copy> = { ms, en };
