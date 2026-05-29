import { Router } from "express";

import {
  approveSanctionLoan,
  getCollectionLoans,
  getDisbursementLoans,
  getLoan,
  getSalesLeads,
  getSanctionLoans,
  getSummary,
  markLoanDisbursed,
  recordCollectionPayment,
  rejectSanctionLoan
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { allowRoles } from "../middleware/roleMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { recordPaymentSchema, rejectLoanSchema } from "../validators/dashboard.validators";

export const dashboardRouter = Router();

dashboardRouter.use(authMiddleware);

dashboardRouter.get("/summary", allowRoles("ADMIN"), getSummary);
dashboardRouter.get(
  "/loans/:id",
  allowRoles("ADMIN", "SANCTION", "DISBURSEMENT", "COLLECTION"),
  getLoan
);

dashboardRouter.get("/sales/leads", allowRoles("SALES", "ADMIN"), getSalesLeads);

dashboardRouter.get("/sanction/loans", allowRoles("SANCTION", "ADMIN"), getSanctionLoans);
dashboardRouter.patch(
  "/sanction/loans/:id/approve",
  allowRoles("SANCTION", "ADMIN"),
  approveSanctionLoan
);
dashboardRouter.patch(
  "/sanction/loans/:id/reject",
  allowRoles("SANCTION", "ADMIN"),
  validateRequest(rejectLoanSchema),
  rejectSanctionLoan
);

dashboardRouter.get(
  "/disbursement/loans",
  allowRoles("DISBURSEMENT", "ADMIN"),
  getDisbursementLoans
);
dashboardRouter.patch(
  "/disbursement/loans/:id/disburse",
  allowRoles("DISBURSEMENT", "ADMIN"),
  markLoanDisbursed
);

dashboardRouter.get("/collection/loans", allowRoles("COLLECTION", "ADMIN"), getCollectionLoans);
dashboardRouter.post(
  "/collection/loans/:id/payments",
  allowRoles("COLLECTION", "ADMIN"),
  validateRequest(recordPaymentSchema),
  recordCollectionPayment
);
