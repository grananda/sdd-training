# Brief del cliente — Servicio Web de Envío de Email (aidd-training)

> Documento de Fase 0 (AIDD). Borrador colaborativo humano + IA.
> Entrada para la Fase 1 (AI Architect). **Aprobado (2026-07-09).**

## 1. Contexto y objetivos

- **Descripción del proyecto:** aplicación web con interfaz de usuario que permite componer y enviar un correo electrónico desde un formulario. El usuario redacta el mensaje (con formato enriquecido), define destinatarios y, opcionalmente, adjunta un documento; el backend realiza el envío real vía SMTP.
- **Problema que resuelve:** ofrecer una vía sencilla y guiada para enviar correos con formato y adjunto sin depender de un cliente de correo instalado, con la lógica de envío centralizada en un servicio propio.
- **Naturaleza del proyecto:** **proyecto de formación / práctica** (repositorio `aidd-training`). El objetivo es ejercitar el flujo AIDD de extremo a extremo sobre una funcionalidad acotada y realista; no es un producto destinado a producción pública.
- **Dominio funcional:** mensajería / correo electrónico transaccional iniciado por el usuario.

## 2. Usuarios y actores conocidos

- **Remitente (usuario final):** persona que abre la web, rellena el formulario de email y lo envía. Es el único rol identificado.
- **Sistema de correo saliente (SMTP):** actor externo que recibe el correo del backend y lo entrega. No es un usuario, pero es una dependencia clave.

No hay roles administrativos ni de gestión: el acceso es abierto (ver sección 4).

## 3. Stack tecnológico

**Decidido:**
- **Frontend:** React.
- **Backend:** Node.js + Express.
- **Monorepo:** Turborepo (workspaces para frontend, backend y, previsiblemente, paquetes compartidos).
- **Envío de correo:** Nodemailer contra **SMTP real configurable** mediante variables de entorno.
- **Editor de texto enriquecido:** **React Quill** (confirmado), con salida HTML.
- **Despliegue:** **solo local con Docker** (Docker Compose para levantar frontend + backend en local). Sin entorno cloud ni PaaS.
- **Idioma de la interfaz:** **español**.
- **Gestor de paquetes del monorepo:** **pnpm** (workspaces + Turborepo).
- **Lenguaje:** **TypeScript** (frontend y backend).
- **Estrategia de estilos del frontend:** **Tailwind CSS**.

**Por decidir:**
- Nada pendiente a nivel de stack. Cerrado.

## 4. Restricciones no negociables

**Funcionales / de producto (confirmadas):**
- Formulario de email con: **destinatario principal (Para)**, **asunto** y **cuerpo**.
- Soporte de destinatarios en **CC** y **CCO (BCC)**.
- **Cuerpo con formato enriquecido** (rich text / HTML), no solo texto plano.
- **Un único adjunto** por email (no múltiples).
- Límite del adjunto: **tipos comunes** (PDF, imágenes, ofimática — docx/xlsx/pptx…) y **máximo 10 MB**. No se exige límite de tamaño total adicional del email.

**Acceso / seguridad:**
- **Sin autenticación:** el formulario es de acceso abierto.
- **Sin medidas anti-abuso** (rate limiting, captcha) — aceptable por ser un proyecto de formación en despliegue local, no expuesto públicamente.
- Las **credenciales SMTP** se gestionan por **variables de entorno**, nunca en el código ni expuestas al frontend.
- El **HTML del cuerpo debe sanitizarse en el backend** antes del envío para evitar inyección/XSS.
- Validación de tipo y tamaño del adjunto en backend (no confiar solo en el frontend).

**Persistencia:**
- **Sin base de datos.** El envío es *fire-and-forget*; **solo se registra en logs** del servidor el resultado (éxito/error, destinatarios, asunto, timestamp). No se guarda el contenido para consulta posterior.

**Legales / RGPD:**
- **Sin requisitos legales/RGPD específicos** aplicables (proyecto de formación, sin datos reales de terceros ni retención de contenido).

## 5. Documentación, código y datos aportados

- **Ninguno a fecha de hoy.** El repositorio solo contenía `.claude/settings.local.json`; no había `docs/` previo, `README.md`, `AGENTS.md`, `CLAUDE.md` ni código.
- Todo el contexto proviene de la descripción verbal del usuario recogida en este brief.

## 6. Riesgos y ambigüedades

- **Entregabilidad del correo (SMTP real):** proveedores como Gmail/Outlook aplican políticas estrictas (contraseñas de aplicación, SPF/DKIM, límites de envío). Riesgo de que los correos se marquen como spam o sean rechazados. *Impacto: bajo en formación con SMTP de pruebas; a tener en cuenta si se usa un SMTP real.*
- **Seguridad del HTML enriquecido:** sin sanitización el cuerpo es un vector de XSS y de inyección en el correo. Mitigado por la decisión de sanitizar en backend.
- **Formulario abierto sin anti-abuso:** riesgo teórico de uso como *open relay* / envío no autorizado. **Aceptado** dado el alcance de formación y el despliegue local no expuesto; a revisar si alguna vez se publica.
- **Adjuntos maliciosos:** aunque se limite tipo y tamaño, un adjunto puede contener malware. El servicio no lo analiza; se asume responsabilidad del remitente.
- **Ausencia de persistencia:** sin historial en BD no hay trazabilidad más allá de los logs; no se puede reintentar ni auditar el contenido enviado. *Aceptado por alcance.*

## 7. Preguntas clave abiertas

Todas las preguntas clave de la Fase 0 han quedado resueltas (ver sección 10). No hay preguntas bloqueantes pendientes para arrancar la Fase 1.

## 8. Información adicional necesaria del cliente

Para el arranque de Fase 1 no hay información bloqueante pendiente. Quedan por confirmar en fases posteriores (no bloqueantes):

- Datos/credenciales del **servidor SMTP** de referencia (host, puerto, TLS, usuario) o uso de un SMTP de pruebas (Mailtrap/Ethereal) durante el desarrollo.
- Preferencia definitiva de **TypeScript vs JavaScript** y **gestor de paquetes** para el monorepo.
- Cualquier **guía de marca/estilo** o requisito visual para la UI (colores, logotipo, tipografía).

## 9. Estructura inicial propuesta

Monorepo Turborepo con separación front/back y paquete compartido, orquestado en local con Docker:

```
aidd-training/
├── apps/
│   ├── web/            # Frontend React (formulario de email, editor React Quill)
│   └── api/            # Backend Node + Express (endpoint de envío, Nodemailer, sanitización)
├── packages/
│   ├── shared/         # Tipos/validaciones compartidas (esquema del email, límites de adjunto)
│   └── config/         # Config compartida (eslint, tsconfig) — opcional
├── docs/               # Documentación AIDD (este brief y los de fases siguientes)
│   └── html/           # Vistas HTML complementarias (booster-docs)
├── docker-compose.yml  # Levanta web + api en local
├── turbo.json
├── package.json        # Workspaces
└── .env.example        # Variables SMTP (sin secretos reales)
```

## 10. Decisiones tomadas en Fase 0

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Mecanismo de envío de email | Sandbox / SMTP real configurable / Proveedor API | **SMTP real configurable (Nodemailer + env vars)** | usuario | El usuario opta por envío real parametrizable por entorno. |
| 2 | Control de acceso | Sin auth / Login básico / SSO-OAuth | **Sin autenticación (formulario abierto)** | usuario | Simplicidad; alcance de formación. |
| 3 | Límites del adjunto | Comunes 10 MB / Cualquiera límite alto / Solo PDF | **Tipos comunes, máx 10 MB** | usuario | Equilibrio entre flexibilidad y seguridad; 10 MB bastan. |
| 4 | Persistencia de enviados | Sin persistencia / Historial en BD / Solo logs | **Solo logs** | usuario | Trazabilidad operativa mínima sin introducir base de datos. |
| 5 | Editor de texto enriquecido | React Quill / TipTap / Lexical | **React Quill (salida HTML)** | usuario | Confirmado por el usuario; integración sencilla con React. |
| 6 | Tratamiento del HTML del cuerpo | Sanitizar en backend / No sanitizar | **Sanitizar en backend antes de enviar** | default | Requisito de seguridad para evitar XSS/inyección. |
| 7 | Naturaleza del proyecto | Formación / Uso real | **Proyecto de formación** | usuario | Repositorio `aidd-training`; ejercicio del flujo AIDD. |
| 8 | Modelo de despliegue | Local con Docker / Contenedores en cloud / PaaS | **Solo local con Docker** | usuario | Suficiente para el alcance de formación. |
| 9 | Requisitos legales / RGPD | Sí / No | **Ninguno aplicable** | usuario | Sin datos reales ni retención de contenido. |
| 10 | Límite de tamaño total del email | Sí / No (solo adjunto) | **Solo el límite de 10 MB del adjunto** | usuario | No se requiere límite total adicional. |
| 11 | Idioma de la interfaz | Español / Inglés / Otro | **Español** | usuario | Indicado por el usuario. |
| 12 | Medidas anti-abuso | Sí (rate limiting/captcha) / No | **Ninguna** | usuario | Despliegue local no expuesto; alcance de formación. |
| 13 | Gestor de paquetes del monorepo | npm / pnpm / yarn | **pnpm** | usuario | Buena afinidad con Turborepo y workspaces. |
| 14 | Lenguaje | JavaScript / TypeScript | **TypeScript** | usuario | Tipado en frontend y backend. |
| 15 | Estrategia de estilos del frontend | CSS Modules / Tailwind / Librería de componentes | **Tailwind CSS** | usuario | Elegido por el usuario. |
