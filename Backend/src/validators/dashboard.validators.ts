import { z } from "zod";

export const rejectLoanSchema = z.object({
  body: z.object({
    reason: z.string().trim().min(3, "Rejection reason must be at least 3 characters")
  })
});

export const recordPaymentSchema = z.object({
  body: z.object({
    utrNumber: z.string().trim().min(4, "UTR number must be at least 4 characters").toUpperCase(),
    amount: z.coerce.number().positive("Payment amount must be positive"),
    paymentDate: z.coerce.date()
  })
});

export type RejectLoanInput = z.infer<typeof rejectLoanSchema>["body"];
export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>["body"];
