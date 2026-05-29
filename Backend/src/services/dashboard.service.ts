import { Types } from "mongoose";

import { LOAN_STATUSES, type LoanStatus } from "../constants/loan";
import { BorrowerProfile } from "../models/BorrowerProfile";
import { Loan } from "../models/Loan";
import { Payment } from "../models/Payment";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";
import type {
  RecordPaymentInput,
  RejectLoanInput
} from "../validators/dashboard.validators";

const loanPopulate = [
  { path: "borrowerId", select: "fullName email role" },
  { path: "borrowerProfileId" },
  { path: "salarySlipId" }
];

const getLoanOrThrow = async (loanId: string) => {
  if (!Types.ObjectId.isValid(loanId)) {
    throw new AppError(400, "Invalid loan id");
  }

  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new AppError(404, "Loan not found");
  }

  return loan;
};

export const getLoanPaymentSummary = async (loanId: string) => {
  const payments = await Payment.find({ loanId }).sort({ paymentDate: -1 });
  const totalPaid = Number(payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2));
  const loan = await Loan.findById(loanId);
  const outstandingBalance = loan
    ? Number(Math.max(loan.totalRepayment - totalPaid, 0).toFixed(2))
    : 0;

  return {
    payments,
    totalPaid,
    outstandingBalance
  };
};

export const listSalesLeads = async () => {
  const borrowers = await User.find({ role: "BORROWER", isActive: true })
    .select("fullName email createdAt")
    .sort({ createdAt: -1 });
  const loans = await Loan.find({ borrowerId: { $in: borrowers.map((borrower) => borrower._id) } })
    .select("borrowerId")
    .lean();
  const borrowerIdsWithLoans = new Set(loans.map((loan) => loan.borrowerId.toString()));
  const profiles = await BorrowerProfile.find({
    userId: { $in: borrowers.map((borrower) => borrower._id) }
  }).lean();
  const profileByUserId = new Map(profiles.map((profile) => [profile.userId.toString(), profile]));

  return borrowers
    .filter((borrower) => !borrowerIdsWithLoans.has(borrower.id))
    .map((borrower) => ({
      id: borrower.id,
      fullName: borrower.fullName,
      email: borrower.email,
      createdAt: borrower.createdAt,
      profile: profileByUserId.get(borrower.id) ?? null
    }));
};

export const listLoansByStatus = async (statuses: LoanStatus[]) => {
  return Loan.find({ status: { $in: statuses } })
    .populate(loanPopulate)
    .sort({ createdAt: -1 });
};

export const approveLoan = async (loanId: string, actorId: string) => {
  const loan = await getLoanOrThrow(loanId);

  if (loan.status !== "APPLIED") {
    throw new AppError(400, "Only applied loans can be sanctioned");
  }

  loan.status = "SANCTIONED";
  loan.sanctionedBy = new Types.ObjectId(actorId);
  loan.sanctionedAt = new Date();
  loan.rejectedBy = undefined;
  loan.rejectedAt = undefined;
  loan.rejectionReason = undefined;

  await loan.save();
  return Loan.findById(loan.id).populate(loanPopulate);
};

export const rejectLoan = async (loanId: string, actorId: string, input: RejectLoanInput) => {
  const loan = await getLoanOrThrow(loanId);

  if (loan.status !== "APPLIED") {
    throw new AppError(400, "Only applied loans can be rejected");
  }

  loan.status = "REJECTED";
  loan.rejectedBy = new Types.ObjectId(actorId);
  loan.rejectedAt = new Date();
  loan.rejectionReason = input.reason;

  await loan.save();
  return Loan.findById(loan.id).populate(loanPopulate);
};

export const disburseLoan = async (loanId: string, actorId: string) => {
  const loan = await getLoanOrThrow(loanId);

  if (loan.status !== "SANCTIONED") {
    throw new AppError(400, "Only sanctioned loans can be disbursed");
  }

  loan.status = "DISBURSED";
  loan.disbursedBy = new Types.ObjectId(actorId);
  loan.disbursedAt = new Date();

  await loan.save();
  return Loan.findById(loan.id).populate(loanPopulate);
};

export const recordPayment = async (loanId: string, actorId: string, input: RecordPaymentInput) => {
  const loan = await getLoanOrThrow(loanId);

  if (loan.status !== "DISBURSED") {
    throw new AppError(400, "Payments can only be recorded for disbursed loans");
  }

  const existingPayment = await Payment.findOne({ utrNumber: input.utrNumber });

  if (existingPayment) {
    throw new AppError(409, "UTR number already exists");
  }

  const paymentSummary = await getLoanPaymentSummary(loan.id);

  if (input.amount > paymentSummary.outstandingBalance) {
    throw new AppError(400, "Payment amount cannot exceed outstanding balance");
  }

  const payment = await Payment.create({
    loanId: loan._id,
    borrowerId: loan.borrowerId,
    utrNumber: input.utrNumber,
    amount: Number(input.amount.toFixed(2)),
    paymentDate: input.paymentDate,
    recordedBy: new Types.ObjectId(actorId)
  });

  const updatedSummary = await getLoanPaymentSummary(loan.id);

  if (updatedSummary.outstandingBalance === 0) {
    loan.status = "CLOSED";
    loan.closedAt = new Date();
    await loan.save();
  }

  const updatedLoan = await Loan.findById(loan.id).populate(loanPopulate);

  return {
    payment,
    loan: updatedLoan,
    totalPaid: updatedSummary.totalPaid,
    outstandingBalance: updatedSummary.outstandingBalance
  };
};

export const getDashboardSummary = async () => {
  const statusCounts = await Loan.aggregate<{ _id: LoanStatus; count: number }>([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  const countsByStatus = Object.fromEntries(LOAN_STATUSES.map((status) => [status, 0]));

  for (const item of statusCounts) {
    countsByStatus[item._id] = item.count;
  }

  const salesLeadCount = (await listSalesLeads()).length;

  return {
    salesLeadCount,
    loanCounts: countsByStatus
  };
};

export const getLoanDetails = async (loanId: string) => {
  const loan = await getLoanOrThrow(loanId);
  const populatedLoan = await Loan.findById(loan.id).populate(loanPopulate);
  const paymentSummary = await getLoanPaymentSummary(loan.id);

  return {
    loan: populatedLoan,
    ...paymentSummary
  };
};
