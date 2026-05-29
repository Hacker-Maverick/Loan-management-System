import { Schema, model, Types } from "mongoose";

import { BRE_STATUSES, EMPLOYMENT_MODES, type BreStatus, type EmploymentMode } from "../constants/loan";

export interface IBorrowerProfile {
  userId: Types.ObjectId;
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  breStatus: BreStatus;
  breFailureReasons: string[];
  createdAt: Date;
  updatedAt: Date;
}

const borrowerProfileSchema = new Schema<IBorrowerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    pan: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    monthlySalary: {
      type: Number,
      required: true,
      min: 0
    },
    employmentMode: {
      type: String,
      enum: EMPLOYMENT_MODES,
      required: true
    },
    breStatus: {
      type: String,
      enum: BRE_STATUSES,
      required: true,
      default: "PENDING"
    },
    breFailureReasons: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

borrowerProfileSchema.index({ userId: 1 }, { unique: true });
borrowerProfileSchema.index({ pan: 1 });

export const BorrowerProfile = model<IBorrowerProfile>("BorrowerProfile", borrowerProfileSchema);
