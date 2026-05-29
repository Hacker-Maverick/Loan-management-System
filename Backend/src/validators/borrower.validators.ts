import { z } from "zod";

import {
  EMPLOYMENT_MODES,
  MAX_LOAN_AMOUNT,
  MAX_TENURE_DAYS,
  MIN_LOAN_AMOUNT,
  MIN_TENURE_DAYS
} from "../constants/loan";

export const borrowerProfileSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters"),
    pan: z.string().trim().toUpperCase(),
    dateOfBirth: z.coerce.date(),
    monthlySalary: z.coerce.number().positive("Monthly salary must be positive"),
    employmentMode: z.enum(EMPLOYMENT_MODES)
  })
});

export const loanApplicationSchema = z.object({
  body: z.object({
    amount: z.coerce
      .number()
      .min(MIN_LOAN_AMOUNT, `Loan amount must be at least ${MIN_LOAN_AMOUNT}`)
      .max(MAX_LOAN_AMOUNT, `Loan amount must not exceed ${MAX_LOAN_AMOUNT}`),
    tenureDays: z.coerce
      .number()
      .int("Tenure must be a whole number of days")
      .min(MIN_TENURE_DAYS, `Tenure must be at least ${MIN_TENURE_DAYS} days`)
      .max(MAX_TENURE_DAYS, `Tenure must not exceed ${MAX_TENURE_DAYS} days`)
  })
});

export type BorrowerProfileInput = z.infer<typeof borrowerProfileSchema>["body"];
export type LoanApplicationInput = z.infer<typeof loanApplicationSchema>["body"];
