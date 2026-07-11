# aidd-training

Repositorio de **formación en SDD** (Spec Driven Development) que arranca desde una planificación ya completa generada con **AIDD** (AI Driven Development).

El producto de ejemplo es un **servicio web para componer y enviar un email**: destinatarios Para/CC/CCO, asunto, cuerpo con formato enriquecido y un adjunto único. El backend envía de verdad vía SMTP. No es un producto de producción.

> **Estado:** planificación cerrada y SDD en marcha. El **walking skeleton** (fase `foundation`) ya está en el repo: monorepo Turborepo + pnpm con `apps/web`, `apps/api` y `packages/shared`, `GET /api/health`, tooling y Docker. Aún sin lógica de negocio (composición y envío llegan en fases posteriores). Ver **Arranque local** más abajo.

## Punto de partida (lo que ya existe)

Toda la fase de definición y diseño está hecha y **aprobada**. El Markdown de [docs/](docs/) es la única fuente de verdad; los `.html` y `.xlsx` son vistas complementarias y no se editan a mano.

| Qué | Dónde |
|-----|-------|
| Brief, requisitos (RF/NFR) e historias de usuario (HU-01…HU-18) | [docs/](docs/) |
| Arquitectura, guía de estilos y prototipo mockeado | [docs/](docs/), [docs/prototipo/](docs/prototipo/) |
| Plan de recursos y plan de sprints | [docs/planificacion-proyecto.md](docs/planificacion-proyecto.md), [docs/sprint-plan.md](docs/sprint-plan.md) |
| Backlog: 2 sprints y 18 Stories | Jira, proyecto `AT` |

Detalle completo del estado y las convenciones en [CLAUDE.md](CLAUDE.md).

El faseado por contexto está en [docs/roadmap.md](docs/roadmap.md) (7 fases alineadas a los 2 sprints, sin conflictos con el plan). Los prompts operativos por fase, en [docs/prompts-roadmap-native-ai.md](docs/prompts-roadmap-native-ai.md).

## Flujo SDD

SDD se opera con el skill `native-ai-specs`, que envuelve a [OpenSpec](https://github.com/fission-ai/openspec). La unidad de trabajo es el **change**: una HU se realiza con uno o varios changes.

Requisito previo: `npm install -g @fission-ai/openspec@latest` (lo instala `native-ai init` si falta).

### Pasos

| # | Paso | Comando | Produce |
|---|------|---------|---------|
| 1 | Inicializar | `native-ai init` | `openspec/`, `config.yaml`, `AGENTS.md` |
| 2 | Fasear el desarrollo | `native-ai roadmap` | `docs/roadmap.md`, `docs/prompts-roadmap-native-ai.md` |
| 3 | Abrir un change | `native-ai open change <qué-construir>` | `proposal.md`, `design.md`, `spec.md` |
| 4 | Implementarlo | `native-ai implement change <qué-construir>` | código |
| 5 | Cerrarlo | `native-ai close change <qué-construir>` | change archivado |

Los pasos 3–5 se repiten por cada change hasta terminar el desarrollo. `docs/prompts-roadmap-native-ai.md` (paso 2) deja escritos los prompts exactos de cada fase.

### Comandos auxiliares

| Comando | Para qué |
|---------|----------|
| `native-ai prototype-ux [change]` | Prototipos de pantalla con `booster-ux` |
| `native-ai uml [change]` | Diagramas UML del change con `booster-uml` |

### Cómo se comporta

- **Pre-flight de dudas.** `open change` e `implement change` preguntan antes de escribir (máximo 7 dudas) y registran lo decidido en `openspec/changes/<change>/decisions.md`.
- **Auditoría.** Cada comando escribe una entrada en `openspec/audit/YYYY-MM.jsonl` con hashes de entrada/salida, modelo y decisiones humanas.
- **Jira (opcional).** Si `openspec/config.yaml` tiene sección `jira` y el MCP de Atlassian está disponible: `open change` crea una sub-tarea bajo la Story de su HU, `implement change` la mueve a *In Progress* y `close change` a *Done* (la Story padre solo cuando todas sus sub-tareas lo estén). Sin configurar, todo funciona igual y la sincronización se omite.

## Stack

React + TypeScript + Tailwind (con React Quill para el cuerpo) · Node.js + Express + TypeScript (con Nodemailer) · monorepo Turborepo + pnpm · Docker Compose en local, con Mailpit como SMTP de desarrollo. Sin base de datos.

## Arranque local

Requisitos: **Node ≥ 22** y **pnpm** (en este entorno solo vía `nvm`: exporta el PATH antes de cualquier `pnpm`/`turbo`), y **Docker** + **Docker Compose**.

```bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"   # si usas nvm
corepack enable                                     # habilita el pnpm fijado
pnpm install
```

**Regla de ejecución:** el **despliegue** es solo Docker (NFR-08). La app puede iterarse de forma nativa en desarrollo, pero **la infraestructura (Mailpit y cualquier dependencia futura) siempre corre en Docker**.

### Modo nativo (recomendado para iterar)

```bash
docker compose up -d mailpit     # solo la infra: SMTP :1025, UI http://localhost:8025
cp .env.example .env             # una vez; los valores por defecto ya sirven para el modo nativo
pnpm dev                         # web http://localhost:5173 + api http://localhost:3000 (en paralelo)
```

Verificación: `curl http://localhost:3000/api/health` → `{"status":"ok"}`.

### Modo full Docker (verificación / despliegue local)

```bash
docker compose up                # web + api + mailpit
```

El servicio `api` sobreescribe `SMTP_HOST=mailpit` para resolver Mailpit por la red de Docker.

### Scripts

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Arranca `web` + `api` en desarrollo (Turborepo, en paralelo). |
| `pnpm build` | Construye todos los workspaces. |
| `pnpm test` | Ejecuta las suites (Vitest: RTL en web, Supertest en api). |
| `pnpm lint` / `pnpm typecheck` | Linter / chequeo de tipos. |

## Seguridad

Las credenciales SMTP van **solo por variables de entorno**, nunca en el código ni commiteadas: usa `.env.example` como plantilla. El HTML del cuerpo se sanea en el backend y toda validación crítica se repite en servidor.
