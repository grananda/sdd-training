# Registro de sincronización con Jira (`jira-sync.md`)

Fuente de verdad del mapeo **HU ↔ change (OpenSpec) ↔ issue (Jira)**. Lo consumen los comandos `aisdd open/implement/close change`: leen este registro antes de crear o transicionar nada en Jira (regla de oro: no duplicar sub-tareas ni revertir estados).

> **Reconstruido el 2026-07-11.** El volcado original a Jira (2026-07-09, vía MCP `jira-agile`) creó los sprints y las 18 Stories pero no persistió este registro. Se reconstruyó leyendo las Stories desde Jira (solo lectura; ninguna issue creada ni recreada) y cruzando el ID de HU del summary con `docs/mapa-historias-usuario.md`.

## Coordenadas Jira

- Site: `grananda.atlassian.net` · proyecto **AT** ("AIDD-Training", team-managed) · board **34**
- Sprint 1 · MVP (F0+F1) — id `35` (10–14 ago 2026)
- Sprint 2 · Endurecimiento — id `68` (17–21 ago 2026)
- Tipos de issue: HU = `Story` · change = `Subtask` (¡no `Sub-task` en este proyecto!)
- La configuración operativa vive en `openspec/config.yaml`, sección `jira:`.

## Mapeo HU ↔ Story ↔ change

Los `change(s)` quedan pendientes de `aisdd roadmap` (aún no generado); las sub-tareas las creará `aisdd open change`.

| HU | Story (Jira) | Sprint | change(s) | Sub-tarea(s) (Jira) | estado |
|----|--------------|--------|-----------|---------------------|--------|
| HU-01 | AT-1 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-02 | AT-2 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-03 | AT-3 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-04 | AT-4 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-05 | AT-5 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-06 | AT-6 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-07 | AT-7 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-08 | AT-12 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-09 | AT-8 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-10 | AT-9 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-11 | AT-14 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-12 | AT-15 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-13 | AT-16 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-14 | AT-13 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-15 | AT-10 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-16 | AT-11 | Sprint 1 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-17 | AT-17 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |
| HU-18 | AT-18 | Sprint 2 | (pendiente de roadmap) | (pendiente) | to_do |

Estado leído de Jira en la reconstrucción: las 18 Stories en **To Do**, sin sub-tareas existentes.

## Convenciones de estado

- `to_do` → Story creada, change sin arrancar.
- `in_progress` → `aisdd implement change` movió la sub-tarea y su Story a In Progress.
- `done` → `aisdd close change` cerró la sub-tarea (la Story pasa a Done solo cuando **todas** sus sub-tareas están Done).
