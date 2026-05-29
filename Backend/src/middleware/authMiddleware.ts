import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

import { env } from "../config/env";
import { type UserRole, USER_ROLES } from "../constants/roles";
import { User } from "../models/User";
import { AppError } from "../utils/AppError";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

const isUserRole = (role: unknown): role is UserRole =>
  typeof role === "string" && USER_ROLES.includes(role as UserRole);

export const authMiddleware: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication token is required");
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!payload.id || !payload.email || !isUserRole(payload.role)) {
      throw new AppError(401, "Invalid authentication token");
    }

    const user = await User.findById(payload.id).select("_id email role isActive");

    if (!user || !user.isActive) {
      throw new AppError(401, "User account is not active");
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Invalid or expired authentication token"));
  }
};
