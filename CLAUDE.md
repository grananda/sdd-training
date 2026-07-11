# CLAUDE.md

Guía para agentes IA (Claude Code) que trabajen en este repositorio.

## Qué es este proyecto

**aidd-training** — Servicio web con UI para **componer y enviar un email** desde un formulario: destinatarios Para/CC/CCO, asunto, cuerpo con formato enriquecido y un adjunto único. El backend realiza el **envío real vía SMTP**. Es un **proyecto de formación** para ejercitar el flujo AIDD de extremo a extremo; no es un producto de producción.

Estado actual (rama `workshop`): planificación AIDD aprobada **y construcción en curso vía AISDD/OpenSpec**. Ya hay código: **fases 1–4 del roadmap completas** (foundation, api-envio-smtp, ui-composicion, ui-envio-feedback) → **hito MVP F1 alcanzado** (componer y enviar un correo de extremo a extremo, verificado contra Mailpit). Pendientes: **fase 5 `validacion-cliente`** (HU-08/HU-14), **fase 6 `adjunto`** (HU-11–13), **fase 7 `endurecimiento-servidor`** (HU-17/HU-18). Ver la sección "Workshop en vivo (AISDD)" más abajo.

## Stack (decidido)

- **Frontend:** React + TypeScript + Tailwind CSS. Editor de cuerpo: **React Quill** (salida HTML).
- **Backend:** Node.js + Express + TypeScript. Envío con **Nodemailer** sobre SMTP configurable.
- **Monorepo:** Turborepo con **pnpm** (workspaces).
- **Despliegue:** solo local con **Docker** (Docker Compose). Sin cloud/PaaS.
- **Persistencia:** ninguna (sin BD); el envío es *fire-and-forget* con traza solo en logs.
- **Idioma de la UI:** español.

## Estructura prevista

```
apps/web/       # Frontend React (formulario, editor React Quill)
apps/api/       # Backend Express (endpoint de envío, Nodemailer, saneamiento HTML)
packages/       # Código compartido (tipos/validaciones), config opcional
docs/           # Documentación AIDD (fuente de verdad)
docs/html/      # Vistas HTML complementarias (generadas por booster-docs)
docs/prototipo/ # Prototipo mockeado para validación con cliente (booster-ux)
docs/xlsx/      # Vistas Excel complementarias (generadas por aidd hu-review-plan)
```

`apps/web`, `apps/api` y `packages/shared` **ya existen** (los creó la fase `foundation`).

## Metodología AIDD

Este repo sigue el flujo **AIDD (AI Driven Development)** mediante skills `aidd *`. Cada paso lee el documento del paso anterior y produce el siguiente en `docs/`. **El Markdown es la única fuente de verdad**; los `.html` de `docs/html/` son vistas complementarias para consumo humano y no deben editarse a mano.

Documentos y estado. **Todos aprobados a 2026-07-09**; la planificación está cerrada.

| Documento | Fase / paso | Skill | Estado |
|-----------|-------------|-------|--------|
| `docs/cliente-requisitos.md` | Fase 0 · brief | `aidd client-requirements` | Aprobado (2026-07-09) |
| `docs/requisitos.md` | Fase 1 · 1.1 · requisitos formales (RF/NFR) | `aidd requirements` | Aprobado (2026-07-03; re-aprobado 2026-07-07 tras enmienda) |
| `docs/mapa-historias-usuario.md` | Fase 1 · 1.2 · mapa de HU | `aidd user-stories` | Aprobado (2026-07-07) |
| `docs/detalle-historias-usuario.md` | Fase 1 · 1.3 · detalle de HU | `aidd user-story-details` | Aprobado (2026-07-09) |
| `docs/plan-revision-hu.md` | Fase 1 · 1.4 · plan de revisión de HU | `aidd hu-review-plan` | Aprobado (2026-07-09) |
| `docs/arquitectura-base-prototipo.md` | Fase 2 · 2.1 · arquitectura del prototipo | `aidd prototype-architecture` | Aprobado (2026-07-08) |
| `docs/guia-estilos.md` | Fase 2 · 2.3 · guía de estilos | `aidd style-guide` | Aprobado (2026-07-08) |
| `docs/propuesta-arquitectura-base.md` | Fase 2 · 2.3 · propuesta de arquitectura | `aidd architecture-proposal` | Aprobado (2026-07-08) |
| `docs/arquitectura-base.md` | Fase 2 · 2.4 · arquitectura definitiva | `aidd architecture` | Aprobado (2026-07-08) |
| `docs/planificacion-proyecto.md` | Fase 3.5 · 3.5.1 · recursos | `aidd project-plan` | Aprobado (2026-07-09) |
| `docs/sprint-plan.md` | Fase 3.5 · 3.5.2 · sprints | `aidd sprint-planning` | Aprobado (2026-07-09) |

Ficheros complementarios, **no editar a mano**: `docs/html/*.html` (vistas de `booster-docs`), `docs/xlsx/plan-revision-hu.xlsx`, `docs/plan-revision-hu.json` (datos del plan de revisión) y `docs/.aidd-doc-meta.json` (versionado interno de los skills).

**`docs/roadmap.md` generado (2026-07-11)** con `aisdd roadmap`: 7 fases (una por change OpenSpec) alineadas a los 2 sprints, **sin conflictos** con el sprint plan — el aviso de *modo degradado* del `sprint-plan.md` queda resuelto sin necesidad de re-ejecutar `aidd sprint-planning`. Los prompts operativos por fase están en `docs/prompts-roadmap-native-ai.md` y el índice de fases en `openspec/config.yaml` (sección `roadmap`, clave `change_hint`).

Convenciones de los documentos:
- IDs trazables y estables: `RF-XX` (funcionales), `NFR-XX` (no funcionales), `HU-XX`/`US-XX` (historias). No reutilizar un ID para otro requisito.
- Cada documento requiere **aprobación humana** antes del handoff al siguiente paso.
- Tras editar un `.md` de `docs/`, regenerar su vista HTML con `booster-docs` (ver abajo).

## Backlog en Jira

El sprint plan está volcado en Jira y **Jira es la fuente de verdad del avance**; `docs/sprint-plan.md` lo es del plan.

- Site `grananda.atlassian.net` · proyecto **`AT`** ("AIDD-Training", team-managed) · board **34**.
- **Sprint 1 · MVP (F0+F1)** (id 35, 10–14 ago 2026): `AT-1`…`AT-11`.
- **Sprint 2 · Endurecimiento** (id 68, 17–21 ago 2026): `AT-12`…`AT-18`.
- Una Story por HU, etiquetada con `aidd`, su fase (`F0`…`F4`), su talla (`talla-XS/S/M`) y su sprint.

Se opera con el MCP `jira-agile` (el MCP oficial de Atlassian no crea sprints). Dos trampas conocidas: el **nombre de un sprint debe tener menos de 30 caracteres** (si no, `jira_update_sprint` falla con un error genérico), y `jira_batch_create_issues` **no admite `labels`** (hay que usar `jira_create_issue` con `additional_fields`).

## Regenerar las vistas HTML

Las vistas de `docs/html/` se generan con el skill `booster-docs`. Invocación directa del script:

```bash
python3 "<ruta-plugin>/skills/booster-docs/scripts/render_docs_html.py" \
  --input docs/requisitos.md --output docs/html/requisitos.html
```

El script auto-detecta el tipo de documento y añade KPIs y chips de color. No modifica el `.md`.

## Workshop en vivo (AISDD/OpenSpec)

La construcción se hace por **changes de OpenSpec** con el skill `aisdd` (una fase del roadmap = un change). En el workshop se hace `foundation` con los alumnos y se sigue con los changes restantes en vivo.

**Entorno**
- **Node/pnpm solo vía nvm**: exporta el PATH antes de cualquier `openspec`/`pnpm`/`turbo`/`node`:
  `export PATH="/home/jfernandez/.nvm/versions/node/v24.16.0/bin:$PATH"`. `openspec` (v1.5.0) solo es visible con ese PATH.
- Verificación e2e con Mailpit: `docker compose up -d mailpit` (SMTP `1025`, UI `8025`).

**Bucle por change (`aisdd open → implement → close`)**
1. `aisdd open change <slug>`: pre-flight de dudas (máx. 7), `openspec new change <slug>`, se rellenan `proposal.md`/`design.md`/`specs/**/spec.md` (deltas `## ADDED Requirements`, `#### Scenario` con 4 `#`)/`tasks.md`/`decisions.md`; `openspec validate <slug> --strict`; UML con `booster-uml` si lo amerita.
2. `aisdd implement change <slug>`: pre-flight; se escribe el código y los tests; se verifica de verdad (`pnpm build` + `pnpm test` + e2e contra Mailpit), no solo tests.
3. `aisdd close change <slug>`: `openspec archive <slug> --yes` (consolida specs en `openspec/specs/`).
- Cada paso deja **una entrada de auditoría** en `openspec/audit/YYYY-MM.jsonl` y **un commit + un tag** numerado.
- **Marca cada frontera** de fase en proposal/design (qué se aplaza a fases posteriores) y respétala.

**Ramas y tags** (Jira-free por diseño en `workshop`)
- `main`: base intacta. `workshop`: rama de **referencia/solución**, con **un tag por comando**, numerados: `01-init`, `02-roadmap`, luego `NN-<slug>-open/implement/close` (foundation=03–05, y **cada fase +3**: api-envio-smtp=06–08, ui-composicion=09–11, ui-envio-feedback=12–14; la siguiente, `validacion-cliente`=15–17). Ramas de trabajo (alumnos) salen de `main` o de un tag; **no se trabaja sobre `workshop`**.
- Remoto: `git@github.com:grananda/sdd-training.git` (ojo, se llama `sdd-training`). `.claude/` y `openspec/audit/` van en `.gitignore` de `workshop`.

**Sincronización con Jira (manual en `workshop`)**
- `workshop` **no tiene sección `jira:`** en `openspec/config.yaml`, así que los comandos `aisdd` **no tocan Jira**: hay que sincronizar el board **a mano** por cada change (modelo Story directa: `implement`→In Progress, `close`→Done; asignar al usuario del MCP). Site `grananda.atlassian.net`, proyecto `AT`, board 34; transiciones In Progress=21, Done=51.
- Mapeo HU↔Story: HU-01→AT-1 … HU-07→AT-7, **HU-09→AT-8, HU-10→AT-9, HU-15→AT-10, HU-16→AT-11**, HU-08→AT-12, HU-14→AT-13, HU-11→AT-14, HU-12→AT-15, HU-13→AT-16, HU-17→AT-17, HU-18→AT-18.

## Convenciones de código (ya establecidas)

- **TypeScript** en todo el monorepo. `apps/api`: ESM con **imports `.js`** (moduleResolution NodeNext). `apps/web`: **sin extensión** (moduleResolution Bundler, Vite). Contrato compartido en `packages/shared` (`EmailDraft`).
- **Identidad NTT DATA**: design tokens en `apps/web/src/styles/tokens.css`, expuestos a Tailwind en `tailwind.config.ts` (solo colores/fuente/radios mapeados; para tamaños/estado usa utilidades por defecto o estilo inline con las CSS vars).
- **Tests**: Vitest + Supertest (api) y Vitest + React Testing Library (web). En web se **mockea `react-quill-new`** (Quill no rinde en jsdom) y el toolbar se valida por su config exportada; en api se **mockea el transporter de Nodemailer**. Sin `@testing-library/user-event`: usar `fireEvent`.
- **Editor de cuerpo**: paquete **`react-quill-new`** (React 18, sin `findDOMNode`), toolbar acotado a negrita/cursiva/listas, salida HTML.
- **Front→back**: `apiClient` llama a `VITE_API_BASE_URL` (default `http://localhost:3000`), cross-origin; la api ya tiene CORS para `WEB_ORIGIN`.
- Validación crítica (obligatorios, formato de email, tipo/tamaño de adjunto) **también en el backend** (fase 5+): el frontend no es de fiar.
- **Sanear el HTML del cuerpo en el backend** antes de enviar (fase 7, HU-17).
- **Nunca** hardcodear credenciales SMTP: solo por variables de entorno (`SMTP_*`, `MAIL_FROM`…). No commitear secretos; usar `.env.example`.
- Adjunto (fase 6): uno solo, tipos comunes, máx. **10 MB**.

## Reglas para agentes

- Responde y documenta en **español**; conserva en inglés nombres de comandos, ficheros, rutas, flags y términos técnicos.
- No inventes requisitos ni contexto: deriva de `docs/` o marca lo que falte como pendiente.
- No sobrescribas un documento aprobado sin avisar y confirmar; conserva IDs y decisiones ya registradas.
