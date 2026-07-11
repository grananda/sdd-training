# Decisiones — ui-composicion

Pre-flight de apertura (`aisdd open change`). La arquitectura (`docs/arquitectura-base.md` §3/§6/§8) y la guía de estilos ya fijaban los componentes, el estado local con RHF y la identidad NTT DATA; el pre-flight se centró en la librería del editor y en las fronteras con las fases 4 y 5.

## editor-react-quill-new

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: HU-10 pide "React Quill"; el paquete clásico `react-quill` v2 usa `findDOMNode` (warnings en React 18 StrictMode) y está sin mantenimiento activo. `apps/web` usa React 18.3.
- **Pregunta**: ¿Qué paquete uso para el editor del cuerpo?
- **Opciones evaluadas**:
  - a) `react-quill-new` (fork mantenido, React 18/19, sin findDOMNode)
  - b) `react-quill` clásico v2
- **Decision**: a) `react-quill-new`
- **Justificación**: misma API y salida HTML, compatible con React 18 sin warnings; cumple "React Quill" sin arrastrar deuda.

## shared-solo-tipos

- **Fecha**: 2026-07-11
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: el roadmap pone "esquema base en shared" en la fase 3 y el `emailSchema` (Zod) completo en la fase 5 (`validacion-cliente`, HU-08/HU-14).
- **Pregunta**: ¿Qué meto en `packages/shared` ahora?
- **Opciones evaluadas**:
  - a) Solo los tipos del contrato (`EmailDraft`)
  - b) Tipos + esquema Zod base
- **Decision**: a) Solo tipos del contrato; "cada cosa en su momento" — la validación Zod es la fase 5.
- **Justificación**: respeta el faseado; evita adelantar la validación que su fase especifica formalmente.

## boton-enviar-inerte

- **Fecha**: 2026-07-11
- **Tipo**: confirmacion
- **Origen**: usuario
- **Contexto**: el envío real (`useSendEmail`/`apiClient`, HU-15/HU-16) es la fase 4; HU-05 exige que el botón Enviar se vea.
- **Pregunta**: ¿Qué hace el botón Enviar en esta fase 3?
- **Opciones evaluadas**:
  - a) Presente pero inerte (handler no-op) hasta la fase 4
  - b) Cablear un submit mínimo ya
- **Decision**: a) Presente pero inerte
- **Justificación**: la UI queda visualmente completa (HU-05) sin solapar con la fase 4 de envío/feedback.
