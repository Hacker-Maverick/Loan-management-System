import { UploadApiResponse } from "cloudinary";

import { cloudinary } from "../config/cloudinary";

export const uploadSalarySlipToCloudinary = (file: Express.Multer.File, userId: string) => {
  const resourceType = file.mimetype === "application/pdf" ? "raw" : "image";

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "lms/salary-slips",
        public_id: `${userId}-${Date.now()}`,
        resource_type: resourceType,
        use_filename: false
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};
