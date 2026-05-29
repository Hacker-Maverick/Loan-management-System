import type { RequestHandler } from "express";

import {
  createLoanApplication,
  getBorrowerProfile,
  listBorrowerLoans,
  saveSalarySlip,
  upsertBorrowerProfile
} from "../services/borrower.service";

export const submitBorrowerProfile: RequestHandler = async (req, res, next) => {
  try {
    const result = await upsertBorrowerProfile(req.user!.id, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getMyBorrowerProfile: RequestHandler = async (req, res, next) => {
  try {
    const profile = await getBorrowerProfile(req.user!.id);
    res.json({ profile });
  } catch (error) {
    next(error);
  }
};

export const uploadSalarySlip: RequestHandler = async (req, res, next) => {
  try {
    const document = await saveSalarySlip(req.user!.id, req.file);
    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
};

export const applyForLoan: RequestHandler = async (req, res, next) => {
  try {
    const loan = await createLoanApplication(req.user!.id, req.body);
    res.status(201).json({ loan });
  } catch (error) {
    next(error);
  }
};

export const getMyLoans: RequestHandler = async (req, res, next) => {
  try {
    const loans = await listBorrowerLoans(req.user!.id);
    res.json({ loans });
  } catch (error) {
    next(error);
  }
};
