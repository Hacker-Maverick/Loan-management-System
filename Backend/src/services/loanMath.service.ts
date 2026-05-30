import { INTEREST_RATE_ANNUAL } from "../constants/loan";

export const calculateLoanRepayment = (amount: number, tenureDays: number) => {
  const interestAmount = Math.round(
    (amount * INTEREST_RATE_ANNUAL * tenureDays) / (365 * 100)
  );
  const totalRepayment = amount + interestAmount;

  return {
    interestRateAnnual: INTEREST_RATE_ANNUAL,
    interestAmount,
    totalRepayment
  };
};
