import { SHARED_PACKAGE } from "@aidd/shared";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./logger.js";

/**
 * Punto de arranque del backend. Levanta el servidor Express en el puerto
 * configurado (PORT). El import de `@aidd/shared` prueba la resolución del
 * workspace compartido desde la api.
 */
const app = createApp();

app.listen(env.PORT, () => {
  logger.info(
    { port: env.PORT, webOrigin: env.WEB_ORIGIN, shared: SHARED_PACKAGE },
    "aidd-api escuchando",
  );
});
