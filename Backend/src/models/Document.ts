import { Schema, model, Types } from "mongoose";

import { DOCUMENT_TYPES, type DocumentType } from "../constants/loan";

export interface IDocument {
  userId: Types.ObjectId;
  type: DocumentType;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  publicId: string;
  resourceType: string;
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
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    resourceType: {
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
