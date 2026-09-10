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

export type EligibilityInput = {
  monthlyIncome: number;
  existingCommitments: number;
  age: number;
  preferredBudget: number;
  financingPeriodYears: number;
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
  const { monthlyIncome, existingCommitments, age, preferredBudget } = input;

  const headroomYears = Math.max(0, MAX_AGE_AT_MATURITY - age);
  const effectiveTenureYears = Math.max(
    0,
    Math.min(input.financingPeriodYears, headroomYears),
  );
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
    tenureWasCapped: effectiveTenureYears < input.financingPeriodYears,
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
