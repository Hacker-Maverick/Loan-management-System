import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import { env } from "../config/env";
import { MAX_UPLOAD_SIZE_BYTES } from "../constants/loan";
import { AppError } from "../utils/AppError";

const salarySlipUploadDir = path.resolve(env.UPLOAD_DIR, "salary-slips");
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

fs.mkdirSync(salarySlipUploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, salarySlipUploadDir);
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeFileName = `${req.user?.id ?? "unknown"}-${Date.now()}${extension}`;
    callback(null, safeFileName);
  }
});

export const salarySlipUpload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_BYTES
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new AppError(400, "Salary slip must be a PDF, JPG, or PNG file"));
      return;
    }

    callback(null, true);
  }
});
