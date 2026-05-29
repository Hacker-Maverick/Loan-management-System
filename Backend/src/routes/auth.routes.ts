import { Router } from "express";

import { login, me, register } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validators";

export const authRouter = Router();

authRouter.post("/register", validateRequest(registerSchema), register);
authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.get("/me", authMiddleware, me);
