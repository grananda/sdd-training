import { Router } from "express";
import { sendController } from "../controllers/send.controller.js";

/**
 * Ruta de envío de correo. El parser JSON se aplica globalmente en `app.ts`
 * (`express.json()`), así que aquí solo se registra el endpoint.
 */
export const sendRouter: Router = Router();

sendRouter.post("/send", sendController);
