import type { RequestHandler } from "express";

import type { UserRole } from "../constants/roles";
import { AppError } from "../utils/AppError";

export const allowRoles =
  (...allowedRoles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) {
      next(new AppError(401, "Authentication is required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new AppError(403, "You do not have permission to access this resource"));
      return;
    }

    next();
  };
