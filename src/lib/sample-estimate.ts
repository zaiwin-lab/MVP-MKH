import { calculateEligibility, formatRM } from "./eligibility";

/* --------------------------------------------------------------------------
   The figure shown on the hero preview card.

   It is computed from the same DSR model the calculator runs, not typed in.
   A hand-written marketing number drifts the moment a rate or a cap changes,
   and then the headline figure and the calculator disagree in front of the
   customer. Change the inputs below and the card follows.

   The couple is deliberately ordinary for Sarawak: two modest incomes and a
   car loan between them. A figure most families can see themselves in does
   more for a landing page than a large one that reads as out of reach.
   -------------------------------------------------------------------------- */

export const SAMPLE_INPUT = {
  monthlyIncome: 3000,
  existingCommitments: 700,
  age: 32,
  preferredBudget: 350_000,
  financingPeriodYears: 30,
  joint: { monthlyIncome: 2000, existingCommitments: 500, age: 30 },
};

const result = calculateEligibility(SAMPLE_INPUT);

export const SAMPLE_ESTIMATE = {
  range: `${formatRM(result.lowerFinancing)} – ${formatRM(result.upperFinancing)}`,
  instalment: formatRM(result.indicativeInstalment),
  tenureYears: result.effectiveTenureYears,
  householdIncome: formatRM(result.householdIncome),
};
