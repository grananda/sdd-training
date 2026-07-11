# AGENTS.md

<!-- BEGIN aisdd-specs commands (auto-generado, no editar a mano) -->
## Comandos aisdd

Skill `aisdd-specs` v1.0.1. Invoca estos comandos para trabajar con especificaciones AISDD / OpenSpec (prefijo primario `aisdd`; `native-ai <cmd>` sigue funcionando como alias legacy):

- `aisdd init` — inicializa OpenSpec, comprueba dependencias y registra el contexto del proyecto (incluida la capa de entrega de AIDD).
- `aisdd roadmap` — fasea el desarrollo (alineado al `docs/sprint-plan.md` si existe) y genera `docs/roadmap.md`, `docs/prompts-roadmap-native-ai.md` y la seccion `roadmap` de `openspec/config.yaml`.
- `aisdd open change <what-you-want-to-build>` — pre-flight de dudas y creacion del cambio OpenSpec.
- `aisdd implement change <what-you-want-to-build>` — pre-flight de dudas y aplicacion de instrucciones del cambio.
- `aisdd close change <what-you-want-to-build>` — archiva el cambio OpenSpec.
- `aisdd prototype-ux [what-you-want-to-build]` — genera prototipos UX con `booster-ux`.
- `aisdd uml <what-you-want-to-build>` — genera el HTML de diagramas del cambio con `booster-uml`.
<!-- END aisdd-specs commands -->
