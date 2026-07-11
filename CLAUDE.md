# CLAUDE.md

Guía para agentes IA (Claude Code) que trabajen en este repositorio.

## Qué es este proyecto

**aidd-training** — Servicio web con UI para **componer y enviar un email** desde un formulario: destinatarios Para/CC/CCO, asunto, cuerpo con formato enriquecido y un adjunto único. El backend realiza el **envío real vía SMTP**. Es un **proyecto de formación** para ejercitar el flujo AIDD de extremo a extremo; no es un producto de producción.

Estado actual: **planificación AIDD completa y aprobada**. Aún no hay código de aplicación; solo documentación en `docs/`. El backlog está volcado en Jira (ver abajo) y el siguiente paso es empezar a construir por el Sprint 1.

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

`apps/` y `packages/` aún no existen: los crea HU-01 (monorepo Turborepo + pnpm).

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

## Convenciones de código (cuando exista)

- **TypeScript** en frontend y backend.
- Validación crítica (campos obligatorios, formato de email, tipo/tamaño de adjunto) **también en el backend**: el frontend no es de fiar.
- **Sanear el HTML del cuerpo en el backend** antes de enviar (evitar XSS/inyección).
- **Nunca** hardcodear credenciales SMTP: solo por variables de entorno (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`…). No commitear secretos; usar `.env.example`.
- Adjunto: uno solo, tipos comunes, máx. **10 MB**.

## Reglas para agentes

- Responde y documenta en **español**; conserva en inglés nombres de comandos, ficheros, rutas, flags y términos técnicos.
- No inventes requisitos ni contexto: deriva de `docs/` o marca lo que falte como pendiente.
- No sobrescribas un documento aprobado sin avisar y confirmar; conserva IDs y decisiones ya registradas.
