# Prompts del roadmap — Servicio Web de Envío de Email (aidd-training)

> **Versión 1** · **Generado:** 2026-07-11 · Generado por `aisdd roadmap` (skill `aisdd-specs` v1.1.1).
> Prompts operativos para ejecutar las 7 fases de `docs/roadmap.md` con los comandos del skill `aisdd-specs`. Ejecutar **en orden**; cerrar cada change antes de abrir el siguiente.
>
> Cada fase sigue el mismo ciclo: `aisdd open change` → `aisdd implement change` → `aisdd close change`. La integración Jira está activa (`openspec/config.yaml`, sección `jira:`): `open` crea la sub-tarea bajo la Story de la HU principal, `implement` mueve sub-tarea y Story a In Progress, `close` las pasa a Done. El registro vive en `docs/jira-sync.md`.

## Reglas de contexto comunes a todas las fases

- **Pasar siempre:** la sección de la fase en `docs/roadmap.md` y las HU correspondientes de `docs/detalle-historias-usuario.md` (solo esas).
- **Pasar según la fase:** las secciones indicadas de `docs/arquitectura-base.md` y, en fases de UI, `docs/guia-estilos.md`.
- **No pasar nunca:** `docs/cliente-requisitos.md`, `docs/planificacion-proyecto.md`, `docs/sprint-plan.md`, `docs/plan-revision-hu.md` (capa de entrega: no aportan al diseño del change), ni el detalle de HU de fases futuras.
- El código relevante es siempre el ya archivado por los changes anteriores; no anticipar estructuras de fases posteriores.

---

## Fase 1 — Foundation: monorepo y Docker (`foundation`) · Sprint 1

- **HU:** HU-01, HU-02 (Stories Jira `AT-1`, `AT-2`; principal: HU-01).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 1); `docs/detalle-historias-usuario.md` (HU-01, HU-02); `docs/arquitectura-base.md` §3 (árbol de carpetas), §9 (health-check), §10 (Mailpit y variables de entorno).
- **Código relevante:** ninguno (repo sin código de aplicación).
- **No incluir:** lógica de envío, formulario, validaciones, saneamiento (fases 2–7); detalle de HU-03 en adelante.
- **División:** un solo change; no dividir (scaffolding cohesionado).

**Abrir:**
```text
aisdd open change foundation — Crear el walking skeleton del proyecto según docs/roadmap.md Fase 1 y docs/arquitectura-base.md §3: monorepo Turborepo + pnpm con apps/web (React + Vite + TypeScript + Tailwind), apps/api (Express + TypeScript) y packages/shared; docker-compose.yml con web + api + Mailpit (axllent/mailpit, puertos 1025/8025); .env.example con SMTP_*, MAIL_FROM, MAX_ATTACHMENT_SIZE_MB, PORT, WEB_ORIGIN; endpoint GET /api/health; tokens de diseño base de docs/guia-estilos.md. Cubre HU-01 y HU-02. Sin lógica de negocio.
```

**Implementar:**
```text
aisdd implement change foundation — Implementar el change según sus specs. Criterios de cierre: `docker compose up` levanta web + api + Mailpit; GET /api/health responde 200; pnpm dev/build funcionan vía Turborepo. Nota: node/pnpm solo están disponibles vía nvm (exportar el PATH antes de cualquier comando npm/pnpm/turbo).
```

**Cerrar:**
```text
aisdd close change foundation
```

---

## Fase 2 — Backend de envío SMTP y logs (`api-envio-smtp`) · Sprint 1

- **HU:** HU-03, HU-04 (Stories `AT-3`, `AT-4`; principal: HU-03).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 2); `docs/detalle-historias-usuario.md` (HU-03, HU-04); `docs/arquitectura-base.md` §5 (pipeline backend), §9 (contrato de `POST /api/send`), §10 (SMTP/Mailpit), §11 (observabilidad: qué loguear y qué no).
- **Código relevante:** `apps/api` y `docker-compose.yml` creados por `foundation`.
- **No incluir:** frontend (`apps/web`); adjunto, saneamiento y validación autoritativa (fases 6–7); `docs/guia-estilos.md`.
- **División:** un solo change (HU-04 es XS y vive dentro del pipeline de HU-03).

**Abrir:**
```text
aisdd open change api-envio-smtp — Implementar POST /api/send según docs/roadmap.md Fase 2 y docs/arquitectura-base.md §5/§9: Nodemailer con transporter reutilizable y SMTP configurable solo por variables de entorno (config/env.ts validado con Zod), logging con pino del resultado de cada envío (resultado, destinatarios, asunto, timestamp; sin contenido ni secretos), contrato de error uniforme y CORS restringido a WEB_ORIGIN. Cubre HU-03 y HU-04. La validación autoritativa completa y el saneamiento quedan para el change endurecimiento-servidor; el adjunto para el change adjunto.
```

**Implementar:**
```text
aisdd implement change api-envio-smtp — Implementar el change según sus specs. Criterios de cierre: un POST /api/send de prueba entrega el correo en Mailpit (UI en :8025); logs correctos sin secretos; tests de integración del endpoint con Supertest en verde.
```

**Cerrar:**
```text
aisdd close change api-envio-smtp
```

---

## Fase 3 — UI de composición (`ui-composicion`) · Sprint 1

- **HU:** HU-05, HU-06, HU-07, HU-09, HU-10 (Stories `AT-5`, `AT-6`, `AT-7`, `AT-8`, `AT-9`; principal: HU-05).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 3); `docs/detalle-historias-usuario.md` (HU-05, HU-06, HU-07, HU-09, HU-10); `docs/arquitectura-base.md` §5 (capas frontend), §6 (componentes y relaciones), §8 (estado); `docs/guia-estilos.md` completa (tokens, componentes, accesibilidad).
- **Código relevante:** `apps/web` y `packages/shared` creados por `foundation`.
- **No incluir:** `apps/api` (no se toca); envío/feedback (fase 4); reglas de validación (fase 5); adjunto (fase 6).
- **División:** por defecto un change. **Si en el pre-flight el alcance resulta excesivo**, dividir en 2–3 changes dentro del Sprint 1, por componente: `ui-formulario-base` (HU-05 + HU-09), `ui-chips-destinatarios` (HU-06 + HU-07), `ui-editor-cuerpo` (HU-10) — en ese orden, y reflejar los nuevos slugs en `docs/jira-sync.md`.

**Abrir:**
```text
aisdd open change ui-composicion — Construir el formulario de composición según docs/roadmap.md Fase 3, docs/arquitectura-base.md §5/§6/§8 y docs/guia-estilos.md: EmailForm con React Hook Form; RecipientChips ×3 (Para/CC/CCO) con chips añadibles y borrables; SubjectField de una línea; BodyEditor con React Quill limitado a negrita, cursiva y listas; SubmitBar y hueco visible de AttachmentField sin lógica; esquema base del email en packages/shared (Zod). UI en español, accesibilidad WCAG 2.1 AA. Cubre HU-05, HU-06, HU-07, HU-09 y HU-10. Sin envío real, sin validación de entradas y sin lógica de adjunto.
```

**Implementar:**
```text
aisdd implement change ui-composicion — Implementar el change según sus specs. Criterios de cierre: el formulario renderiza todos los campos; las chips añaden/eliminan direcciones en los tres campos; el editor produce HTML solo con negrita/cursiva/listas; tests de componentes (React Testing Library) en verde.
```

**Cerrar:**
```text
aisdd close change ui-composicion
```

---

## Fase 4 — Envío desde la UI y feedback (`ui-envio-feedback`) · Sprint 1

- **HU:** HU-15, HU-16 (Stories `AT-10`, `AT-11`; principal: HU-16).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 4); `docs/detalle-historias-usuario.md` (HU-15, HU-16); `docs/arquitectura-base.md` §7 (flujos de éxito y error), §9 (contrato de respuesta); `docs/guia-estilos.md` (banner/feedback, `aria-live`).
- **Código relevante:** `apps/web/src/components` (fase 3) y el contrato real de `POST /api/send` (fase 2).
- **No incluir:** reglas de validación (fase 5); adjunto (fase 6); internals del backend más allá del contrato de respuesta.
- **División:** un solo change. Cierra el **hito MVP F1 demoable** (demo vie 14-ago).

**Abrir:**
```text
aisdd open change ui-envio-feedback — Conectar el formulario con el backend según docs/roadmap.md Fase 4 y docs/arquitectura-base.md §7/§9: hook useSendEmail con estado idle|sending|success|error; apiClient que monta FormData y hace POST /api/send; errorMap de código a mensaje en español; FeedbackBanner accesible (aria-live); envío directo al pulsar Enviar sin confirmación ni vista previa; botón deshabilitado durante el envío; limpiar el formulario tras éxito y conservar los datos tras error. Cubre HU-15 y HU-16.
```

**Implementar:**
```text
aisdd implement change ui-envio-feedback — Implementar el change según sus specs. Criterios de cierre: happy path completo desde la UI hasta Mailpit con banner de éxito; con SMTP caído se muestra banner de error y los datos se conservan; MVP del Sprint 1 demoable (E1→E2→E6).
```

**Cerrar:**
```text
aisdd close change ui-envio-feedback
```

---

## Fase 5 — Validación de cliente (`validacion-cliente`) · Sprint 2

- **HU:** HU-08, HU-14 (Stories `AT-12`, `AT-13`; principal: HU-14).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 5); `docs/detalle-historias-usuario.md` (HU-08, HU-14); `docs/arquitectura-base.md` §2 (contrato único compartido) y §5 (resolver Zod en RHF); `docs/guia-estilos.md` (mensajes de error junto a campos).
- **Código relevante:** `packages/shared/src/email.schema.ts` y `apps/web/src/components/EmailForm.tsx` (+ campos).
- **No incluir:** `apps/api` (la validación de servidor es fase 7); reglas de adjunto (fase 6).
- **División:** un solo change (0,2 d; no fragmentar más).

**Abrir:**
```text
aisdd open change validacion-cliente — Completar la validación de cliente según docs/roadmap.md Fase 5: en packages/shared, emailSchema (Zod) con obligatorios Para/Asunto/Cuerpo y formato de dirección de email para Para/CC/CCO; conectarlo como resolver de React Hook Form; bloquear el envío si hay errores y mostrarlos de forma accesible junto a cada campo, en español. Cubre HU-08 y HU-14. La validación autoritativa en servidor queda para el change endurecimiento-servidor.
```

**Implementar:**
```text
aisdd implement change validacion-cliente — Implementar el change según sus specs. Criterios de cierre: no se puede enviar con Para/Asunto/Cuerpo vacíos ni con direcciones inválidas en ninguno de los tres campos; errores visibles junto a los campos; tests unit del esquema en packages/shared y de componentes en verde.
```

**Cerrar:**
```text
aisdd close change validacion-cliente
```

---

## Fase 6 — Adjunto único con validaciones (`adjunto`) · Sprint 2

- **HU:** HU-11, HU-12, HU-13 (Stories `AT-14`, `AT-15`, `AT-16`; principal: HU-11).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 6); `docs/detalle-historias-usuario.md` (HU-11, HU-12, HU-13); `docs/arquitectura-base.md` §4 (módulo Adjunto), §5 (upload en el pipeline), §11 (límite en Multer).
- **Código relevante:** `apps/web/src/components/AttachmentField.tsx` (hueco de fase 3), `packages/shared`, `apps/api/src/middleware/upload.ts` y `services/mailer.ts`.
- **No incluir:** saneamiento HTML (fase 7); `docs/guia-estilos.md` completa (solo el patrón de campo de fichero y mensajes de error).
- **División:** un solo change: cliente y transporte del adjunto van juntos para que la HU sea demostrable extremo a extremo (fichero visible en Mailpit).

**Abrir:**
```text
aisdd open change adjunto — Añadir el adjunto único según docs/roadmap.md Fase 6 y docs/arquitectura-base.md §4/§5: attachment.rules.ts en packages/shared (tipos permitidos JPG, GIF, PDF, Word, Excel, PowerPoint y límite 10 MiB) como fuente única; AttachmentField funcional con validación de tipo y tamaño en cliente y mensajes claros; en el backend, Multer memoryStorage con 1 fichero y límite de 10 MiB, pasando el adjunto a Nodemailer. Cubre HU-11, HU-12 y HU-13. El rechazo autoritativo por MIME real (file-type) queda para el change endurecimiento-servidor.
```

**Implementar:**
```text
aisdd implement change adjunto — Implementar el change según sus specs. Criterios de cierre: un correo con adjunto llega a Mailpit con el fichero visible; el cliente rechaza tipos no permitidos y ficheros de más de 10 MiB con aviso claro; tests en verde.
```

**Cerrar:**
```text
aisdd close change adjunto
```

---

## Fase 7 — Endurecimiento de servidor (`endurecimiento-servidor`) · Sprint 2

- **HU:** HU-17, HU-18 (Stories `AT-17`, `AT-18`; principal: HU-18).
- **Documentos a pasar:** `docs/roadmap.md` (Fase 7); `docs/detalle-historias-usuario.md` (HU-17, HU-18); `docs/arquitectura-base.md` §5 (pipeline completo), §11 (seguridad: whitelist de saneamiento, MIME real, contrato de error).
- **Código relevante:** todo `apps/api/src` (pipeline de fase 2 + upload de fase 6) y `packages/shared` (esquema completo de fases 5–6).
- **No incluir:** `apps/web` (no se toca; la validación de cliente ya existe y pasa a ser conveniencia); `docs/guia-estilos.md`.
- **División:** un solo change. Si el pre-flight lo aconseja, dividir en `saneamiento-html` (HU-17) y `validacion-servidor` (HU-18), ambos dentro del Sprint 2. Cierra el **hito producto endurecido (21-ago)**.

**Abrir:**
```text
aisdd open change endurecimiento-servidor — Endurecer el backend según docs/roadmap.md Fase 7 y docs/arquitectura-base.md §11: sanitizer.ts con sanitize-html y whitelist estricta (b/strong, i/em, ul, ol, li, p, br; eliminar script, atributos on*, iframes, enlaces e imágenes); middleware validate.ts con el emailSchema de packages/shared como validación autoritativa (obligatorios, formato de email, tamaño de adjunto); attachment.ts con verificación de tipo por MIME real usando file-type; respuestas 4xx { ok:false, code } ante peticiones que burlan el cliente, sin filtrar secretos. Cubre HU-17 y HU-18.
```

**Implementar:**
```text
aisdd implement change endurecimiento-servidor — Implementar el change según sus specs. Criterios de cierre: una petición directa al endpoint (curl, sin UI) con campos inválidos o adjunto prohibido es rechazada con 4xx y código; un cuerpo con <script> u onclick llega saneado a Mailpit; e2e del recorrido E1–E7 (Playwright, opcional) sobre Mailpit; revisión de seguridad con TI cerrada.
```

**Cerrar:**
```text
aisdd close change endurecimiento-servidor
```

---

## Después de la fase 7

Con los 7 changes archivados, el producto cumple las 18 HU (F0–F4) y los dos hitos del `sprint-plan.md`. Pasos manuales que quedan fuera de los changes: demo del MVP (14-ago), demo final (21-ago) y decisión pendiente del proveedor SMTP de producción (`arquitectura-base.md` §13, no bloqueante).
