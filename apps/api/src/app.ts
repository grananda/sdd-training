import express, { type Express } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.route.js";

/**
 * Construye la app Express. En la fase `foundation` solo monta CORS (restringido
 * a WEB_ORIGIN), el parser JSON y el health-check. El endpoint de envío
 * (`POST /api/send`) y el resto del pipeline llegan en fases posteriores.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.use("/api", healthRouter);

  return app;
}
