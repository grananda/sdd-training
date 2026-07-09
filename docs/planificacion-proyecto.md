# Planificación de proyecto (recursos) — Servicio Web de Envío de Email (aidd-training)

> **Versión 5** · **Generado:** 2026-07-09 08:17 CEST
> Documento de Planificación de entrega (AIDD). Generado por `aidd project-plan`.
> Fuentes: docs/arquitectura-base.md, docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md.
> Insumo de `aidd sprint-planning`. **Aprobado (2026-07-09).**
>
> Planifica el **QUÉ se necesita** (recursos), no el CUÁNDO (eso es `aidd sprint-planning`). Modelo de equipo **híbrido**: perfiles tradicionales mapeados a roles SDD, con la IA (Claude Code) como acelerador transversal. Equipo objetivo: **1 dev full-stack + IA**. Costes **cualitativos con rangos**.

## 1. Objetivo y resumen

Construir una app web de **una sola pantalla** para componer y enviar un correo (Para/CC/CCO, asunto, cuerpo enriquecido, un adjunto) con **envío real vía SMTP**, monorepo Turborepo+pnpm, backend Express y frontend React, desplegada **solo en local con Docker** y **sin persistencia** (ver `arquitectura-base.md`).

**Resumen de recursos:** una persona **full-stack** cubriendo los roles de front, back y validación, con **Claude Code** como copiloto (acelerador de código, tests y documentación). Stack **100% open source** salvo el proveedor SMTP de producción (pendiente) y la eventual licencia de Docker Desktop en organizaciones grandes. Infraestructura mínima: entorno **local** con Docker Compose (web + api + Mailpit). **Sin BD, sin cloud, sin backups**.

**Esfuerzo (doble estimación, §5-§6):** con la **escala de tallas de puntos fijos** (XS 0,5 · S 1,5 · M 3 · L 5 · XL 8 días) y tras la re-estimación por historia (**3 M + 8 S + 7 XS**), el trabajo suma **24,5 días-persona** en modo **humano clásico** (total **exacto**, sin rangos); el **mismo trabajo con IA** como recurso se estima en **~6,1 días-persona**, es decir **~75% menos** (**factor ≈ x4,0**). La cifra con IA es una **hipótesis con supuestos**, no un dato cerrado.

## 2. Perfiles y equipo recomendado

Un único recurso humano lleva varios "sombreros"; se mapean a roles SDD para trazabilidad.

| Perfil (tradicional) | Rol SDD | Responsabilidades | Skills concretos (ligados al stack/NFR) | Dedicación |
|----------------------|---------|-------------------|-----------------------------------------|------------|
| **Full-stack developer** (principal) | AI Lead Front + AI Lead Back + AI Developer | Implementa web, api y `packages/shared`; integra el flujo de envío; escribe tests. | React + TypeScript, Tailwind, React Quill, React Hook Form, Zod; Express + TS, Nodemailer, Multer, sanitize-html, file-type, pino; Turborepo + pnpm; Docker Compose. | Alta (rol principal) |
| **Arquitecto (a tiempo parcial)** | AI Architect | Custodia la arquitectura base y la guía de estilos; valida decisiones técnicas. | Diseño de sistemas, seguridad (XSS/saneamiento, validación en servidor), accesibilidad AA. | Baja (ya hecho el grueso en Fase 2) |
| **Validador / QA (a tiempo parcial)** | Outcome Validator | Verifica criterios de aceptación `[IMPRESCINDIBLE]`, accesibilidad AA y el recorrido E1–E7. | Vitest, RTL, Supertest, Playwright; auditoría WCAG 2.1 AA (foco, contraste, teclado). | Media (por fase) |
| **IA — Claude Code** | Acelerador transversal (AIDD/SDD) | Genera código, tests y documentación; asiste en refactor y revisión. No sustituye la decisión ni la validación humana. | Recurso, no persona. Requiere suscripción (ver §3). | Continua |

> En un equipo de 1 persona, los tres sombreros humanos recaen en el mismo dev; se listan por separado para dejar clara la dedicación por tipo de trabajo. Escalar a 2–3 personas separaría front/back y QA (ver §8).

## 3. Software, herramientas y licencias

| Categoría | Herramienta | Coste | Ligado a |
|-----------|-------------|-------|----------|
| Lenguaje/runtime | Node.js LTS, TypeScript | **Open source** | Stack backend/tooling (`arquitectura-base.md` §1) |
| Monorepo | Turborepo, pnpm | **Open source** | Restricción `requisitos.md` §5 (HU-01) |
| Frontend | React, Vite, Tailwind CSS, React Quill, React Hook Form, Zod | **Open source** | HU-05…HU-16, RF-06, guía de estilos |
| Backend | Express, Nodemailer, Multer, sanitize-html, file-type, pino, cors, dotenv | **Open source** | HU-03, HU-11–13, HU-17, HU-18, HU-04 |
| Contrato compartido | Zod | **Open source** | `packages/shared` (HU-18, NFR-11) |
| Testing | Vitest, React Testing Library, Supertest, Playwright | **Open source** | Estrategia de testing (propuesta §4) |
| Contenedores | Docker + Docker Compose | **OSS engine**; Docker Desktop **con coste** en orgs grandes (alternativas OSS: Colima/Podman) | Despliegue (NFR-08, HU-02) |
| SMTP de desarrollo | Mailpit (`axllent/mailpit`) | **Open source** | SMTP dev (arquitectura §10) |
| SMTP de producción | Proveedor por definir (Gmail app pwd / transaccional) | **Coste variable — pendiente** | RF-13, `requisitos.md` §7/§8 |
| Repo / CI | Git + hosting (p. ej. GitHub) + CI (p. ej. GitHub Actions) | **Free tier** suele bastar; coste si privado/mayor volumen | Buena práctica (recomendación) |
| IDE + calidad | VS Code, ESLint, Prettier | **Open source / gratuito** | Buena práctica (recomendación) |
| **IA** | **Claude Code** | **Coste de suscripción** (orden: plan mensual por usuario) | Recurso acelerador (modelo híbrido) |

**Órdenes de magnitud:** el desarrollo es prácticamente **coste-cero en licencias** (todo OSS). Los únicos costes reales: **suscripción de Claude Code** (bajo, por usuario/mes), **proveedor SMTP** de producción (desde gratuito/al uso hasta plan transaccional, pendiente) y, si aplica en la organización, **Docker Desktop** (evitable con Colima/Podman).

## 4. Infraestructura y entornos

- **Desarrollo (único entorno real):** local con **Docker Compose** levantando `web` + `api` + **Mailpit** (SMTP `1025` / UI `8025`). Config por `.env` a partir de `.env.example`, sin secretos en el repo (NFR-03). CORS a `WEB_ORIGIN`.
- **Pre/Pro:** **fuera de alcance** — despliegue solo local (NFR-08). Si en el futuro se publicara, sería el punto de extensión (hosting de contenedores + proveedor SMTP real + SPF/DKIM).
- **Almacenamiento y backups:** **no aplica** — sin base de datos ni persistencia de correos (NFR-06). Única traza: logs de servidor (efímeros).
- **Red/acceso:** servicio local no expuesto; sin auth ni anti-abuso por alcance (NFR-04/05).
- **Secretos:** credenciales SMTP solo por variables de entorno; nunca commiteadas (NFR-03).

## 5. Estimación de esfuerzo — humano clásico vs IA

Dos estimaciones **en paralelo** por historia y fase, para poder contrastarlas. Talla del detalle de historias con la **escala de puntos fijos** (XS 0,5 d · S 1,5 d · M 3 d · L 5 d · XL 8 d; 1 d = jornada de 8 h). El **humano clásico** es la **suma exacta** de los puntos (sin rangos ni punto medio); **con IA** el mismo trabajo asumiendo Claude Code como recurso, con **compresión según la naturaleza de la tarea** (no un % plano).

| Fase / Historia | Talla | Humano clásico | Con IA | Diferencia |
|-----------------|-------|----------------|--------|-----------|
| **F0 · Foundation** | | **6,5 d** | **1,3 d** | **-5,2 (-80%)** |
| F0 / HU-01 Monorepo Turborepo+pnpm | S | 1,5 d | 0,2 d | -1,3 (-87%) |
| F0 / HU-02 Docker Compose | S | 1,5 d | 0,2 d | -1,3 (-87%) |
| F0 / HU-03 Endpoint Nodemailer/SMTP | M | 3 d | 0,8 d | -2,2 (-73%) |
| F0 / HU-04 Logs de envío | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| **F1 · Composición y envío** | | **9 d** | **2,3 d** | **-6,7 (-74%)** |
| F1 / HU-05 Formulario | S | 1,5 d | 0,4 d | -1,1 (-73%) |
| F1 / HU-06 Chips Para | M | 3 d | 0,8 d | -2,2 (-73%) |
| F1 / HU-07 CC/CCO (reutiliza chips) | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| F1 / HU-09 Asunto | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| F1 / HU-10 Cuerpo React Quill | S | 1,5 d | 0,4 d | -1,1 (-73%) |
| F1 / HU-15 Envío directo | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| F1 / HU-16 Feedback resultado | S | 1,5 d | 0,4 d | -1,1 (-73%) |
| **F2 · Validación de entradas** | | **1 d** | **0,2 d** | **-0,8 (-80%)** |
| F2 / HU-08 Formato de direcciones | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| F2 / HU-14 Campos obligatorios | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| **F3 · Adjunto** | | **3,5 d** | **1,0 d** | **-2,5 (-71%)** |
| F3 / HU-11 Adjuntar documento | S | 1,5 d | 0,4 d | -1,1 (-73%) |
| F3 / HU-12 Validación de tipo (MIME real) | S | 1,5 d | 0,5 d | -1,0 (-67%) |
| F3 / HU-13 Validación de tamaño | XS | 0,5 d | 0,1 d | -0,4 (-80%) |
| **F4 · Seguridad y endurecimiento** | | **4,5 d** | **1,3 d** | **-3,2 (-71%)** |
| F4 / HU-17 Saneamiento HTML | M | 3 d | 0,8 d | -2,2 (-73%) |
| F4 / HU-18 Validación en servidor | S | 1,5 d | 0,5 d | -1,0 (-67%) |
| **Total** | **3 M + 8 S + 7 XS** | **24,5 d-persona** | **6,1 d-persona** | **-18,4 (-75%)** |

- **Esfuerzo humano clásico**: deriva de las tallas de `docs/detalle-historias-usuario.md` con la **escala de puntos fijos** (en este proyecto: XS = 0,5 d, S = 1,5 d, M = 3 d; sin L/XL). Tras la re-estimación con la nueva granularidad (3 M + 8 S + 7 XS), el total es **exacto: 24,5 d**, sin rangos ni punto medio. Es volumen de trabajo, no calendario.
- **Esfuerzo estimado con IA**: el mismo trabajo con Claude Code como recurso. La IA genera el grueso; **lo no comprimible es dirigir, revisar y validar** (PR, criterios de aceptación, e2e, accesibilidad, seguridad). **Compresión por naturaleza de la tarea**:
  - **Alta** (boilerplate/scaffolding/CRUD): monorepo, Docker, CC/CCO reutilizando chips, Asunto, logs, validaciones simples → comprimen ~80-87%.
  - **Media** (integración estándar): endpoint Nodemailer, formulario, chips, React Quill, adjunto → comprimen ~73%.
  - **Baja/moderada** (seguridad y validación críticas, MIME real): saneamiento, validación en servidor, tipo de adjunto → comprimen ~67-73% porque exigen revisión y pruebas cuidadosas que la IA no elimina.
- Es una **estimación con supuestos** (§8); no es un dato cerrado.

## 6. KPIs de esfuerzo (diferencia humano vs IA)

Calculados de forma consistente con la tabla de §5.

| KPI | Valor |
|-----|-------|
| Esfuerzo humano total | **24,5 d-persona** (exacto, escala de puntos fijos) |
| Esfuerzo con IA total | **6,1 d-persona** |
| Ahorro absoluto | **~18,4 d-persona** |
| Reducción (%) | **~75%** |
| Factor de aceleración | **≈ x4,0** |
| Fase con mayor ahorro | **F0 · Foundation (-80%)** (empata con F2) — scaffolding/boilerplate y validaciones simples, muy comprimibles |
| Fase con menor ahorro | **F3 · Adjunto / F4 · Seguridad (-71%)** — MIME real, multipart y validación de seguridad exigen más revisión |

> Lectura: la IA no "hace la mitad del trabajo con un botón". Comprime mucho lo repetitivo (arranque del proyecto, componentes estándar, validaciones simples) y **poco** lo que exige criterio humano (seguridad, accesibilidad, validación de aceptación). Por eso el ahorro es alto pero no total, y varía por fase.

## 7. Dependencias y prerequisitos de recursos

Antes de empezar a construir:

1. **Estación de trabajo** con Node.js LTS, pnpm y Docker (o Colima/Podman) instalados.
2. **Acceso a Claude Code** (suscripción activa) — recurso del modelo híbrido y base de la estimación con IA.
3. **Repositorio Git** + CI configurados (recomendado).
4. **`.env`** derivado de `.env.example`; **Mailpit** para el SMTP de desarrollo (resuelve el envío sin proveedor real).
5. **Perfil full-stack** disponible con los skills de §2.

Dependencias entre recursos:
- El **envío real en producción** depende del **proveedor SMTP + credenciales** (pendiente) — no bloquea el desarrollo (Mailpit cubre dev).
- La **estimación con IA** depende de disponer de Claude Code; sin ese recurso, aplica la columna de esfuerzo humano clásico.
- La **validación de accesibilidad AA** depende de que el sombrero de **Outcome Validator** tenga tiempo asignado por fase (no dejarlo al final).

## 8. Riesgos de recursos y supuestos

**Riesgos**
- **Equipo de 1 persona (bus factor / sin paralelización):** cualquier ausencia detiene el proyecto y F0→F4 es secuencial. Mitiga la IA como copiloto; escalar a 2–3 (front/back + QA) si el calendario aprieta.
- **Proveedor SMTP de producción sin definir:** no bloquea el desarrollo (Mailpit), pero **bloquea el envío real en un despliegue real** hasta decidirlo. **[Pendiente, no bloqueante en dev]**
- **Entregabilidad con SMTP real** (SPF/DKIM, spam): riesgo si algún día se usa un proveedor real; irrelevante en local con Mailpit.
- **Licencia de Docker Desktop** en organizaciones grandes: coste evitable con Colima/Podman (OSS).
- **Concentración de roles:** el mismo dev decide y valida; conviene reservar tiempo explícito de QA/accesibilidad para no auto-validarse con sesgo.

**Supuestos**
- Modelo híbrido con 1 dev full-stack + IA, según decisión del usuario.
- Alcance estable (18 HU, F0–F4) tras aprobar la Fase 2; sin persistencia, sin cloud.
- Costes tratados cualitativamente; no se aportaron tarifas.
- **Supuestos de la compresión por IA (§5):** dev competente con Claude Code; el código generado se revisa y valida (no se acepta a ciegas); las tareas de seguridad y accesibilidad conservan su coste de validación humana. La cifra con IA es una **hipótesis**, no un compromiso.

## 9. Decisiones tomadas

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Modelo de equipo | Roles SDD+IA / Tradicionales / **Híbrido** | **Híbrido** (perfiles tradicionales mapeados a roles SDD + IA transversal) | usuario | Da perfiles reconocibles y a la vez traza a los roles SDD; refleja a Claude Code como acelerador. |
| 2 | Tamaño de equipo | **1 dev full-stack + IA** / Pequeño 2-3 / Completo 4+ | **1 dev full-stack + IA** | usuario | Realista para 18 HU acotadas en un proyecto de formación; la IA cubre throughput. |
| 3 | Tratamiento de costes | **Cualitativo con rangos** / Cifras concretas | **Cualitativo con rangos** | usuario | Sin tarifas aportadas; se marca OSS vs coste y órdenes de magnitud. |
| 4 | Alternativa a Docker Desktop | Asumir Docker Desktop / **Señalar Colima/Podman** | **Señalar alternativa OSS** | default | Evita coste de licencia en organizaciones grandes sin cambiar la arquitectura. |
| 5 | Entornos pre/pro | Incluir / **Solo dev local** | **Solo dev local** | default | La arquitectura fija despliegue solo local (NFR-08); pre/pro quedan como extensión futura. |
| 6 | Métrica de estimación | Rangos S/M/L / **Escala de tallas de puntos fijos (skill 1.9.0)** | **Puntos fijos** (XS 0,5 · S 1,5 · M 3 · L 5 · XL 8 d) | usuario | El usuario cambió la métrica; el total humano pasa a ser **exacto** en lugar del rango 36-63. |
| 7 | Re-estimación con la nueva granularidad | Mantener 9 M + 9 S / **Re-etiquetar con XS** | **Re-estimado a 3 M + 8 S + 7 XS** (13 HU bajan de talla; ninguna sube) | usuario | Con XS disponible, las historias triviales (input único, reuso de componente, validación simple) encajan mejor; el total humano baja de 40,5 a **24,5 d**. HU/fases/criterios intactos. |
| 8 | Doble estimación humano vs IA | Estimación única / **Doble estimación con KPIs** | **Doble estimación con KPIs** | default (skill 1.8.0+) | El humano clásico (24,5 d) es el volumen de trabajo; la columna con IA (~6,1 d) da la cifra realista, con el desglose por naturaleza de tarea. |
| 9 | Base de la compresión por IA | % plano / **Por naturaleza de la tarea** | **Por naturaleza de la tarea** (alta/media/baja) | default | Boilerplate/validaciones simples comprimen ~80-87%; seguridad/validación crítica ~67-73%; refleja que la revisión humana no se elimina. |
