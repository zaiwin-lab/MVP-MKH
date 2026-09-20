/* --------------------------------------------------------------------------
   Indicative financing eligibility.

   This is a transparent Debt Service Ratio (DSR) estimate, not a bank
   decision. It exists so an applicant can sanity-check their position before
   committing to an application. Every assumption below is deliberately
   conservative and surfaced to the user in the results panel.
   -------------------------------------------------------------------------- */

/** Indicative profit/interest rate used for the estimate (% per annum). */
export const INDICATIVE_RATE = 4.3;

/** Banks here commonly cap total commitments at 60-70% of gross income. */
const DSR_CONSERVATIVE = 0.55;
const DSR_OPTIMISTIC = 0.65;

/** Financing typically ends by this age, which caps the tenure. */
const MAX_AGE_AT_MATURITY = 70;

/** Typical margin of finance — the applicant funds the remainder. */
const MARGIN_OF_FINANCE = 0.9;

/** Longest tenure offered. Banks here go to 35; this product stops at 30. */
export const MAX_TENURE_YEARS = 30;

export type EligibilityInput = {
  monthlyIncome: number;
  existingCommitments: number;
  age: number;
  preferredBudget: number;
  financingPeriodYears: number;
  /**
   * A joint application with a spouse or co-applicant. Incomes and
   * commitments are pooled, which is what lifts the affordable range; the
   * tenure is then governed by whichever applicant is older, because the
   * age-at-maturity cap has to hold for both of them.
   */
  joint?: {
    monthlyIncome: number;
    existingCommitments: number;
    age: number;
  };
};

export type EligibilityResult = {
  /** Tenure actually usable once the age cap is applied. */
  effectiveTenureYears: number;
  /** True when age shortened the requested tenure. */
  tenureWasCapped: boolean;
  lowerFinancing: number;
  upperFinancing: number;
  lowerPropertyValue: number;
  upperPropertyValue: number;
  /** Monthly instalment at the midpoint of the range. */
  indicativeInstalment: number;
  /** DSR the applicant's preferred budget would imply, as a percentage. */
  budgetDsrPercent: number;
  /**
   * How the preferred budget sits against the DSR band financiers use:
   *  comfortable - below the band, well within reach
   *  within      - inside the band financiers typically consider
   *  stretched   - above the band, likely to be questioned
   */
  budgetAssessment: "comfortable" | "within" | "stretched";
  /** Commitments already exceed what income can service. */
  overCommitted: boolean;
  /** Pooled gross monthly income used for the assessment. */
  householdIncome: number;
  /** Pooled monthly commitments used for the assessment. */
  householdCommitments: number;
  /** The age the tenure cap was applied to: the older applicant on a joint. */
  governingAge: number;
  /** True when a co-applicant's figures were included. */
  isJoint: boolean;
  /** Why the tenure came out shorter than asked for, when it did. */
  tenureCapReason: "none" | "age" | "product";
};

/**
 * Present value of an annuity — how much can be borrowed for a given monthly
 * payment, rate and number of months.
 */
function presentValue(payment: number, monthlyRate: number, months: number) {
  if (months <= 0 || payment <= 0) return 0;
  if (monthlyRate === 0) return payment * months;
  return (payment * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
}

/** Monthly instalment for a given principal, rate and number of months. */
export function monthlyInstalment(
  principal: number,
  monthlyRate: number,
  months: number,
) {
  if (months <= 0 || principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

export function calculateEligibility(
  input: EligibilityInput,
): EligibilityResult {
  const { preferredBudget, joint } = input;

  /* A joint application is assessed on the pooled position: both incomes and
     both sets of commitments. This is what banks here do, and it is why a
     couple qualifies for more than either of them would alone. */
  const isJoint = Boolean(joint && joint.monthlyIncome > 0);
  const monthlyIncome = input.monthlyIncome + (isJoint ? joint!.monthlyIncome : 0);
  const existingCommitments =
    input.existingCommitments + (isJoint ? joint!.existingCommitments : 0);

  /* The age-at-maturity cap has to hold for both borrowers, so the older one
     governs the tenure. Taking the younger would quote a term no bank would
     actually write. */
  const governingAge =
    isJoint && joint!.age > 0 ? Math.max(input.age, joint!.age) : input.age;

  const ageHeadroomYears = Math.max(0, MAX_AGE_AT_MATURITY - governingAge);
  const requestedYears = Math.max(0, input.financingPeriodYears);
  const effectiveTenureYears = Math.max(
    0,
    Math.min(requestedYears, MAX_TENURE_YEARS, ageHeadroomYears),
  );
  const tenureCapReason: EligibilityResult["tenureCapReason"] =
    effectiveTenureYears >= requestedYears
      ? "none"
      : ageHeadroomYears < Math.min(requestedYears, MAX_TENURE_YEARS)
        ? "age"
        : "product";

  const months = effectiveTenureYears * 12;
  const monthlyRate = INDICATIVE_RATE / 100 / 12;

  const lowerPayment = monthlyIncome * DSR_CONSERVATIVE - existingCommitments;
  const upperPayment = monthlyIncome * DSR_OPTIMISTIC - existingCommitments;

  const lowerFinancing = Math.max(
    0,
    presentValue(lowerPayment, monthlyRate, months),
  );
  const upperFinancing = Math.max(
    0,
    presentValue(upperPayment, monthlyRate, months),
  );

  const lowerPropertyValue = lowerFinancing / MARGIN_OF_FINANCE;
  const upperPropertyValue = upperFinancing / MARGIN_OF_FINANCE;

  const midFinancing = (lowerFinancing + upperFinancing) / 2;
  const indicativeInstalment = monthlyInstalment(
    midFinancing,
    monthlyRate,
    months,
  );

  // What DSR would the applicant's own target budget imply?
  const budgetInstalment = monthlyInstalment(
    preferredBudget * MARGIN_OF_FINANCE,
    monthlyRate,
    months,
  );
  const budgetDsrPercent =
    monthlyIncome > 0
      ? ((budgetInstalment + existingCommitments) / monthlyIncome) * 100
      : 0;

  return {
    effectiveTenureYears,
    tenureWasCapped: tenureCapReason !== "none",
    tenureCapReason,
    householdIncome: monthlyIncome,
    householdCommitments: existingCommitments,
    governingAge,
    isJoint,
    lowerFinancing,
    upperFinancing,
    lowerPropertyValue,
    upperPropertyValue,
    indicativeInstalment,
    budgetDsrPercent,
    budgetAssessment:
      budgetDsrPercent <= DSR_CONSERVATIVE * 100
        ? "comfortable"
        : budgetDsrPercent <= DSR_OPTIMISTIC * 100
          ? "within"
          : "stretched",
    overCommitted: upperPayment <= 0,
  };
}

const RM = new Intl.NumberFormat("en-MY", {
  style: "currency",
  currency: "MYR",
  maximumFractionDigits: 0,
});

export function formatRM(value: number) {
  return RM.format(Math.round(value));
}
