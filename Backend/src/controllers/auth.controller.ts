import type { RequestHandler } from "express";

import { getAuthUserById, loginUser, registerBorrower } from "../services/auth.service";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const result = await registerBorrower(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    const user = await getAuthUserById(req.user!.id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};
