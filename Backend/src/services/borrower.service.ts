import { Types } from "mongoose";

import { BorrowerProfile } from "../models/BorrowerProfile";
import { Document } from "../models/Document";
import { Loan } from "../models/Loan";
import { AppError } from "../utils/AppError";
import type {
  BorrowerProfileInput,
  LoanApplicationInput
} from "../validators/borrower.validators";
import { runBre } from "./bre.service";
import { uploadSalarySlipToCloudinary } from "./cloudinary.service";
import { calculateLoanRepayment } from "./loanMath.service";

export const upsertBorrowerProfile = async (userId: string, input: BorrowerProfileInput) => {
  const normalizedInput = {
    ...input,
    pan: input.pan.toUpperCase()
  };
  const breResult = runBre(normalizedInput);

  const profile = await BorrowerProfile.findOneAndUpdate(
    { userId },
    {
      ...normalizedInput,
      userId,
      breStatus: breResult.status,
      breFailureReasons: breResult.failureReasons
    },
    {
      upsert: true,
      new: true,
      runValidators: true
    }
  );

  return {
    profile,
    bre: breResult
  };
};

export const getBorrowerProfile = async (userId: string) => {
  return BorrowerProfile.findOne({ userId });
};

export const saveSalarySlip = async (userId: string, file: Express.Multer.File | undefined) => {
  if (!file) {
    throw new AppError(400, "Salary slip file is required");
  }

  const uploadResult = await uploadSalarySlipToCloudinary(file, userId);

  const document = await Document.create({
    userId,
    type: "SALARY_SLIP",
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type
  });

  return document;
};

export const createLoanApplication = async (userId: string, input: LoanApplicationInput) => {
  const profile = await BorrowerProfile.findOne({ userId });

  if (!profile) {
    throw new AppError(400, "Complete personal details before applying for a loan");
  }

  if (profile.breStatus !== "PASSED") {
    throw new AppError(400, `BRE failed: ${profile.breFailureReasons.join(", ")}`);
  }

  const salarySlip = await Document.findOne({ userId, type: "SALARY_SLIP" }).sort({ createdAt: -1 });

  if (!salarySlip) {
    throw new AppError(400, "Upload a salary slip before applying for a loan");
  }

  const activeLoan = await Loan.findOne({
    borrowerId: userId,
    status: { $in: ["APPLIED", "SANCTIONED", "DISBURSED"] }
  });

  if (activeLoan) {
    throw new AppError(409, "You already have an active loan application");
  }

  const repayment = calculateLoanRepayment(input.amount, input.tenureDays);

  const loan = await Loan.create({
    borrowerId: new Types.ObjectId(userId),
    borrowerProfileId: profile._id,
    salarySlipId: salarySlip._id,
    amount: input.amount,
    tenureDays: input.tenureDays,
    ...repayment,
    status: "APPLIED"
  });

  return loan;
};

export const listBorrowerLoans = async (userId: string) => {
  return Loan.find({ borrowerId: userId }).sort({ createdAt: -1 });
};
