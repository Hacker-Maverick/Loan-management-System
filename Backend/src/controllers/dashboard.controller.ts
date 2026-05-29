import type { RequestHandler } from "express";

import {
  approveLoan,
  disburseLoan,
  getDashboardSummary,
  getLoanDetails,
  listLoansByStatus,
  listSalesLeads,
  recordPayment,
  rejectLoan
} from "../services/dashboard.service";
import { getRequiredParam } from "../utils/requestParams";

export const getSalesLeads: RequestHandler = async (_req, res, next) => {
  try {
    const leads = await listSalesLeads();
    res.json({ leads });
  } catch (error) {
    next(error);
  }
};

export const getSanctionLoans: RequestHandler = async (_req, res, next) => {
  try {
    const loans = await listLoansByStatus(["APPLIED"]);
    res.json({ loans });
  } catch (error) {
    next(error);
  }
};

export const approveSanctionLoan: RequestHandler = async (req, res, next) => {
  try {
    const loan = await approveLoan(getRequiredParam(req, "id"), req.user!.id);
    res.json({ loan });
  } catch (error) {
    next(error);
  }
};

export const rejectSanctionLoan: RequestHandler = async (req, res, next) => {
  try {
    const loan = await rejectLoan(getRequiredParam(req, "id"), req.user!.id, req.body);
    res.json({ loan });
  } catch (error) {
    next(error);
  }
};

export const getDisbursementLoans: RequestHandler = async (_req, res, next) => {
  try {
    const loans = await listLoansByStatus(["SANCTIONED"]);
    res.json({ loans });
  } catch (error) {
    next(error);
  }
};

export const markLoanDisbursed: RequestHandler = async (req, res, next) => {
  try {
    const loan = await disburseLoan(getRequiredParam(req, "id"), req.user!.id);
    res.json({ loan });
  } catch (error) {
    next(error);
  }
};

export const getCollectionLoans: RequestHandler = async (_req, res, next) => {
  try {
    const loans = await listLoansByStatus(["DISBURSED"]);
    res.json({ loans });
  } catch (error) {
    next(error);
  }
};

export const recordCollectionPayment: RequestHandler = async (req, res, next) => {
  try {
    const result = await recordPayment(getRequiredParam(req, "id"), req.user!.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getSummary: RequestHandler = async (_req, res, next) => {
  try {
    const summary = await getDashboardSummary();
    res.json({ summary });
  } catch (error) {
    next(error);
  }
};

export const getLoan: RequestHandler = async (req, res, next) => {
  try {
    const result = await getLoanDetails(getRequiredParam(req, "id"));
    res.json(result);
  } catch (error) {
    next(error);
  }
};
