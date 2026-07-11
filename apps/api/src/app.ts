import express, { type Express } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.route.js";
import { sendRouter } from "./routes/send.route.js";
import { errorHandler } from "./middleware/error-handler.js";

/**
 * Construye la app Express: CORS (restringido a WEB_ORIGIN), parser JSON, las
 * rutas bajo `/api` (health-check y envío `POST /api/send`) y el error handler
 * uniforme al final. La validación de dominio, el adjunto y el saneamiento del
 * cuerpo llegan en fases posteriores (HU-18/HU-11–13/HU-17).
 */
export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.WEB_ORIGIN }));
  app.use(express.json());

  app.use("/api", healthRouter);
  app.use("/api", sendRouter);

  // El error handler va después de las rutas para capturar sus errores.
  app.use(errorHandler);

  return app;
}
