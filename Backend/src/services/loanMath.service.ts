import { INTEREST_RATE_ANNUAL } from "../constants/loan";

export const calculateLoanRepayment = (amount: number, tenureDays: number) => {
  const interestAmount = Number(
    ((amount * INTEREST_RATE_ANNUAL * tenureDays) / (365 * 100)).toFixed(2)
  );
  const totalRepayment = Number((amount + interestAmount).toFixed(2));

  return {
    interestRateAnnual: INTEREST_RATE_ANNUAL,
    interestAmount,
    totalRepayment
  };
};
