import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { authRouter } from "./routes/auth.routes";
import { borrowerRouter } from "./routes/borrower.routes";
import { healthRouter } from "./routes/health.routes";

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/borrower", borrowerRouter);
app.use("/api/health", healthRouter);

app.use(notFoundHandler);
app.use(errorHandler);
