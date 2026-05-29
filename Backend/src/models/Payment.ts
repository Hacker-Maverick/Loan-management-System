import { Schema, model, Types } from "mongoose";

export interface IPayment {
  loanId: Types.ObjectId;
  borrowerId: Types.ObjectId;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
  recordedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    loanId: {
      type: Schema.Types.ObjectId,
      ref: "Loan",
      required: true
    },
    borrowerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    utrNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    paymentDate: {
      type: Date,
      required: true
    },
    recordedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ utrNumber: 1 }, { unique: true });
paymentSchema.index({ loanId: 1, paymentDate: -1 });

export const Payment = model<IPayment>("Payment", paymentSchema);
