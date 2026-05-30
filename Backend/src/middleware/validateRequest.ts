import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

export const validateRequest =
  (schema: ZodTypeAny): RequestHandler =>
  (req, _res, next) => {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.params !== undefined) req.params = parsed.params;
    if (parsed.query !== undefined) req.query = parsed.query;
    next();
  };
