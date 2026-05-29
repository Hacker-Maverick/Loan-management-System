import { Schema, model, Types } from "mongoose";

import { LOAN_STATUSES, type LoanStatus } from "../constants/loan";

export interface ILoan {
  borrowerId: Types.ObjectId;
  borrowerProfileId: Types.ObjectId;
  salarySlipId: Types.ObjectId;
  amount: number;
  tenureDays: number;
  interestRateAnnual: number;
  interestAmount: number;
  totalRepayment: number;
  status: LoanStatus;
  sanctionedBy?: Types.ObjectId;
  sanctionedAt?: Date;
  rejectedBy?: Types.ObjectId;
  rejectedAt?: Date;
  rejectionReason?: string;
  disbursedBy?: Types.ObjectId;
  disbursedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    borrowerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "BorrowerProfile",
      required: true
    },
    salarySlipId: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    tenureDays: {
      type: Number,
      required: true
    },
    interestRateAnnual: {
      type: Number,
      required: true
    },
    interestAmount: {
      type: Number,
      required: true
    },
    totalRepayment: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: LOAN_STATUSES,
      required: true,
      default: "APPLIED"
    },
    sanctionedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    sanctionedAt: Date,
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    rejectedAt: Date,
    rejectionReason: String,
    disbursedBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    disbursedAt: Date,
    closedAt: Date
  },
  {
    timestamps: true
  }
);

loanSchema.index({ borrowerId: 1, status: 1 });
loanSchema.index({ status: 1, createdAt: -1 });

export const Loan = model<ILoan>("Loan", loanSchema);
