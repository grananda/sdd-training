import { Router } from "express";

/**
 * Health-check del backend. No depende de configuración SMTP ni de servicios
 * externos: sirve para verificar el skeleton y para el health-check de Docker.
 */
export const healthRouter: Router = Router();

healthRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
