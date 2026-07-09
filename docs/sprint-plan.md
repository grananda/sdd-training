# Plan de sprints — Servicio Web de Envío de Email (aidd-training)

> **Versión 2** · **Generado:** 2026-07-09 10:55 CEST
> Documento de Planificación de entrega (AIDD · paso 3.5.2). Generado por `aidd sprint-planning`.
> Fuentes: docs/planificacion-proyecto.md, docs/detalle-historias-usuario.md, docs/plan-revision-hu.md, docs/mapa-historias-usuario.md.
> **Aprobado (2026-07-09).** Volcado a Jira el 2026-07-09 (proyecto `AT`, board 34): Sprint 1 = `AT-1`…`AT-11`, Sprint 2 = `AT-12`…`AT-18`.
>
> **Aviso (modo degradado):** no existe `docs/roadmap.md`. El faseado por presupuesto de contexto lo produce el AI Lead con `native-ai roadmap` (Fase 3), que no se ha ejecutado. Este plan usa como unidades de trabajo las **18 HU** del mapa/detalle (fases F0–F4) y no respeta un faseado por contexto de modelo. La unidad rastreable de entrega es la **HU** (Story); los **changes** (sub-tareas de ejecución) los abrirá después el AI Lead.

## 1. Parámetros de planificación

| Parámetro | Valor |
|-----------|-------|
| Equipo / capacidad | **1 dev full-stack + IA** (Claude Code), del plan de recursos. ~5 días-persona reales por sprint de 1 semana. |
| Velocity | **Esfuerzo real con IA** (comprimido). La IA genera; el coste no comprimible es dirigir, revisar y validar. |
| Duración de sprint | **1 semana** (5 días laborables). Derivada de la **carga real**, no fija. |
| Nº de ciclos | **2 sprints**. Lo marca el **gate del MVP** (F1 demoable) y la separación núcleo/endurecimiento, **no** la suma de tallas. |
| Carga total | **~6,1 días-persona reales con IA** (24,5 d bruto humano de referencia). |
| Gate de entrada | **Revisión entrelazada**: cada sprint revisa/valida sus HU en las 2 reuniones de su inicio (lun/mar) y construye el resto de la semana (ver §4 y `plan-revision-hu.md`). |
| Inicio | **Sprint 1: 10-ago-2026** · **Sprint 2: 17-ago-2026**. Semana previa (3–7 ago): arranque (kickoff, revisión doc. cliente, setup). |

**Por qué esta forma:** la carga real es muy pequeña (~6 d-persona). No se hace "un change = un sprint": se agrupan las HU en **2 sprints** porque hay **un corte duro natural** —el **MVP de composición y envío (F1)**, demoable/validable— que separa el núcleo del endurecimiento (F2–F4). La duración de 1 semana llena razonablemente la capacidad de 1 persona (Sprint 1 ≈ 3,6 d reales; Sprint 2 ≈ 2,5 d reales), sin relleno ni sobrecarga.

## 2. Unidades de trabajo

Esfuerzo **real con IA** (planificación) y **bruto humano** (referencia). Perfil único: full-stack dev; validación con la persona/rol de la revisión (TI para F0/F4, negocio para F1–F3).

| HU | Descripción | Fase | Real IA | Bruto | Talla | Perfil / validación |
|----|-------------|------|---------|-------|-------|---------------------|
| HU-01 | Monorepo Turborepo+pnpm | F0 | 0,2 d | 1,5 d | S | Full-stack / TI |
| HU-02 | Docker Compose (+ Mailpit) | F0 | 0,2 d | 1,5 d | S | Full-stack / TI |
| HU-03 | Endpoint Nodemailer/SMTP | F0 | 0,8 d | 3 d | M | Full-stack / TI |
| HU-04 | Logs del envío | F0 | 0,1 d | 0,5 d | XS | Full-stack / TI |
| HU-05 | Formulario de composición | F1 | 0,4 d | 1,5 d | S | Full-stack / negocio |
| HU-06 | Chips Para | F1 | 0,8 d | 3 d | M | Full-stack / negocio |
| HU-07 | CC/CCO (reutiliza chips) | F1 | 0,1 d | 0,5 d | XS | Full-stack / negocio |
| HU-09 | Asunto | F1 | 0,1 d | 0,5 d | XS | Full-stack / negocio |
| HU-10 | Cuerpo React Quill | F1 | 0,4 d | 1,5 d | S | Full-stack / negocio |
| HU-15 | Envío directo | F1 | 0,1 d | 0,5 d | XS | Full-stack / negocio |
| HU-16 | Feedback de resultado | F1 | 0,4 d | 1,5 d | S | Full-stack / negocio |
| HU-08 | Validación de formato (direcciones) | F2 | 0,1 d | 0,5 d | XS | Full-stack / negocio+TI |
| HU-14 | Campos obligatorios | F2 | 0,1 d | 0,5 d | XS | Full-stack / negocio |
| HU-11 | Adjuntar documento | F3 | 0,4 d | 1,5 d | S | Full-stack / negocio+TI |
| HU-12 | Validación de tipo (MIME real) | F3 | 0,5 d | 1,5 d | S | Full-stack / negocio+TI |
| HU-13 | Validación de tamaño | F3 | 0,1 d | 0,5 d | XS | Full-stack / negocio+TI |
| HU-17 | Saneamiento HTML (backend) | F4 | 0,8 d | 3 d | M | Full-stack / seguridad (TI) |
| HU-18 | Validación en servidor (autoritativa) | F4 | 0,5 d | 1,5 d | S | Full-stack / seguridad (TI) |
| | **Total** | | **6,1 d** | **24,5 d** | | |

## 3. Mapa de dependencias y prerequisitos

- **Cadena F0 (secuencial):** HU-01 → HU-02 → HU-03 → HU-04. HU-03 necesita Mailpit (HU-02) para envío en dev.
- **F1 sobre F0:** HU-05 (← HU-01); HU-06 (← HU-05); HU-07 (← HU-05, HU-06); HU-09, HU-10 (← HU-05); HU-15 (← HU-05, HU-03); HU-16 (← HU-03, HU-15).
- **F2 sobre F1:** HU-08 (← HU-06, HU-07); HU-14 (← HU-05, HU-06, HU-09, HU-10).
- **F3 sobre F0/F1:** HU-11 (← HU-05, HU-03); HU-12, HU-13 (← HU-11).
- **F4 sobre F0/F1/F3:** HU-17 (← HU-03, HU-10); HU-18 (← HU-03, HU-11).
- **Revisión entrelazada:** cada HU se revisa/cierra en la reunión de inicio de su sprint (lun/mar) antes de construirse esa misma semana; no hay campaña previa. Ver §4 y `plan-revision-hu.md`.
- **No bloqueante:** proveedor SMTP de producción sin definir; dev usa Mailpit.

Con 1 dev, la cadena es intrínsecamente secuencial: no hay paralelización real; el orden de arriba marca el calendario dentro de cada sprint.

## 4. Distribución en sprints

### Sprint 1 — Núcleo: Foundation + MVP de composición y envío (F0 + F1)
- **Fechas:** 10-ago → 14-ago-2026 (1 semana).
- **Revisión (inicio de sprint):** lun 10-ago técnica de F0 (HU-01, 02, 03, 04); mar 11-ago funcional de F1 (HU-05, 06, 07, 09, 10, 15, 16). Build mié–vie.
- **Objetivo:** desde la UI se puede **componer y enviar** un correo con formato (Para/CC/CCO, asunto, cuerpo enriquecido) sobre la base técnica (monorepo, Docker, endpoint SMTP), con feedback de resultado. **MVP demoable.**
- **Unidades:** HU-01, HU-02, HU-03, HU-04 (F0) · HU-05, HU-06, HU-07, HU-09, HU-10, HU-15, HU-16 (F1).
- **Carga real vs capacidad:** **3,6 d reales** frente a ~5 d de capacidad (1 dev × 1 semana). Holgado; absorbe las reuniones de inicio, la integración y la demo.
- **Asignación:** full-stack dev (todas); validación funcional con negocio y técnica con TI en las reuniones de inicio.
- **Definition of Done:** criterios `[IMPRESCINDIBLE]` de F0 y F1 cumplidos; `docker compose up` levanta web+api+Mailpit; envío real a Mailpit visible; interfaz en español; tests unit (shared) + componentes (RTL) + integración del endpoint (Supertest) en verde; demo del happy path E1→E2→E6 el vie 14-ago.

### Sprint 2 — Endurecimiento: validación + adjunto + seguridad (F2 + F3 + F4)
- **Fechas:** 17-ago → 21-ago-2026 (1 semana).
- **Revisión (inicio de sprint):** lun 17-ago funcional de F2+F3 (HU-14, 08, 11, 12, 13); mar 18-ago técnica de F2/F3/F4 (HU-08, 11, 12, 13, 18, 17). Build mié–vie.
- **Objetivo:** el producto queda **completo y endurecido**: validación de entradas (cliente), adjunto único con límites, y **saneamiento + validación autoritativa en servidor**. Recorrido E1–E7 completo.
- **Unidades:** HU-08, HU-14 (F2) · HU-11, HU-12, HU-13 (F3) · HU-17, HU-18 (F4).
- **Carga real vs capacidad:** **2,5 d reales** frente a ~5 d de capacidad. Por debajo de capacidad, pero el ciclo se justifica por el **gate del MVP** (no se rellena estirando la duración; deja margen para el endurecimiento de seguridad, que exige revisión cuidadosa).
- **Asignación:** full-stack dev; validación de seguridad (HU-17/HU-18) con el rol de seguridad (TI).
- **Definition of Done:** criterios `[IMPRESCINDIBLE]` de F2–F4 cumplidos; validación de cliente y **autoritativa en servidor** operativas; adjunto con tipo (MIME real) y tamaño (10 MiB); saneamiento del cuerpo con whitelist; e2e del recorrido E1–E7 (Playwright, opcional) sobre Mailpit; accesibilidad AA verificada.

## 5. Hitos y entregables

| Hito | Cuándo | Entregable / validación |
|------|--------|-------------------------|
| **MVP F1 listo** | Fin Sprint 1 (14-ago) | Componer y enviar un correo con formato desde la UI (happy path), sobre Docker + SMTP. Demo al cliente. |
| **Producto endurecido** | Fin Sprint 2 (21-ago) | Validación cliente+servidor, adjunto con límites, saneamiento y validación autoritativa. Recorrido E1–E7 completo. |

## 6. Riesgos de planificación y supuestos

**Riesgos**
- **Revisión entrelazada (riesgo de agenda):** cada sprint revisa sus HU en las reuniones de inicio (lun/mar) y construye la misma semana. Exige disponibilidad de negocio y TI el **10–11 ago** y el **17–18 ago**; **si esas sesiones se caen, se retrasa solo ese sprint**, no toda una campaña. Blindar esas fechas en agosto (vacaciones).
- **Roadmap ausente (modo degradado):** sin faseado por contexto del AI Lead; si al generar el roadmap los cortes de change difieren, habría que reconciliar este plan.
- **Equipo de 1 persona:** cadena secuencial sin paralelización; cualquier ausencia detiene el sprint (bus factor). Mitiga la IA.
- **Proveedor SMTP de producción sin definir:** no bloquea dev (Mailpit); bloquearía un envío real en un despliegue real.
- **Estimación real con IA = hipótesis:** si la compresión no se cumple (código que hay que rehacer, seguridad más costosa), la carga sube hacia el bruto; hay margen de capacidad en ambos sprints para absorberlo.

**Supuestos**
- Duración de sprint 1 semana y capacidad ~5 d/persona, derivadas de la carga real.
- Fechas: arranque 3–7 ago; Sprint 1 10–14 ago; Sprint 2 17–21 ago (revisión al inicio de cada sprint).
- Unidades = HU completas; no se parten entre sprints.

## 7. Decisiones tomadas

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Base de velocity | **Real con IA** / Bruto humano / Ambas | **Real con IA (~6,1 d)** | usuario | Coherente con el modelo híbrido (IA como recurso) del plan de proyecto. |
| 2 | Nº de ciclos | **2 sprints (MVP + endurecimiento)** / 3 por bloque / 1 con checkpoint | **2 sprints** | usuario | El corte es el gate del MVP (F1), no la suma de tallas; F0 solo quedaría muy por debajo de capacidad. |
| 3 | Encaje con la revisión de HU | Dev tras campaña previa / **Revisión entrelazada por sprint** | **Revisión entrelazada: cada sprint valida sus HU al inicio** | usuario | Evita el waterfall de una campaña previa de 4 semanas para un build de ~6 días; se revisa just-in-time lo que cada sprint construye. |
| 4 | Duración de sprint | Fija 2 semanas / **1 semana (derivada de carga)** | **1 semana** | default | Sprint 1 ≈ 3,6 d y Sprint 2 ≈ 2,5 d reales llenan razonablemente 1 semana de 1 dev; 2 semanas dejarían ociosa la capacidad. |
| 5 | Faseado sin roadmap | **Modo degradado (mapa+detalle)** / Parar hasta roadmap | **Modo degradado** | default | Permite planificar ya; se avisa de que no hay faseado por contexto del AI Lead y habrá que reconciliar si se genera el roadmap. |
