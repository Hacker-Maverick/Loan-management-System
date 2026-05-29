import { Schema, model, Types } from "mongoose";

import { DOCUMENT_TYPES, type DocumentType } from "../constants/loan";

export interface IDocument {
  userId: Types.ObjectId;
  type: DocumentType;
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

documentSchema.index({ userId: 1, type: 1 });

export const Document = model<IDocument>("Document", documentSchema);
