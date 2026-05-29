import { Router } from "express";

import {
  applyForLoan,
  getMyBorrowerProfile,
  getMyLoans,
  submitBorrowerProfile,
  uploadSalarySlip
} from "../controllers/borrower.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { allowRoles } from "../middleware/roleMiddleware";
import { salarySlipUpload } from "../middleware/uploadMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
  borrowerProfileSchema,
  loanApplicationSchema
} from "../validators/borrower.validators";

export const borrowerRouter = Router();

borrowerRouter.use(authMiddleware, allowRoles("BORROWER", "ADMIN"));

borrowerRouter.post("/profile", validateRequest(borrowerProfileSchema), submitBorrowerProfile);
borrowerRouter.get("/profile", getMyBorrowerProfile);
borrowerRouter.post("/salary-slip", salarySlipUpload.single("salarySlip"), uploadSalarySlip);
borrowerRouter.post("/loans", validateRequest(loanApplicationSchema), applyForLoan);
borrowerRouter.get("/loans", getMyLoans);
