import multer from "multer";

import { MAX_UPLOAD_SIZE_BYTES } from "../constants/loan";
import { AppError } from "../utils/AppError";

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);

export const salarySlipUpload = multer({
  storage: multer.memoryStorage(),
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
