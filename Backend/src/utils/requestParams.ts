import type { Request } from "express";

import { AppError } from "./AppError";

export const getRequiredParam = (req: Request, name: string) => {
  const value = req.params[name];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AppError(400, `Missing route parameter: ${name}`);
  }

  return value;
};
