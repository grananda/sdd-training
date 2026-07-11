# Tareas — ui-composicion

Orden por dependencia: contrato compartido → dependencias → componentes (chips, asunto, editor) → contenedor → integración → verificación. `node`/`pnpm` solo vía nvm: exportar el PATH antes de cada comando.

## 1. Contrato compartido y dependencias

- [x] 1.1 Reemplazar el placeholder de `packages/shared/src` por el tipo `EmailDraft` (`to[]`, `cc[]`, `bcc[]`, `subject`, `body`) y exportarlo (sin Zod; la validación es la fase 5)
- [x] 1.2 Añadir `react-hook-form` y `react-quill-new` a `apps/web` (`pnpm --filter @aidd/web add ...`)

## 2. Componentes de campo

- [x] 2.1 `components/RecipientChips.tsx`: array de direcciones como chips; alta con Enter/coma, baja por control y Backspace; props `label`/`value`/`onChange`/`optional`/`helpText`; sin validación de formato
- [x] 2.2 `components/SubjectField.tsx`: input de una línea que normaliza saltos de línea al pegar/introducir
- [x] 2.3 `components/BodyEditor.tsx`: React Quill (`react-quill-new`) con toolbar y `formats` acotados a negrita, cursiva y listas; salida HTML; importar el CSS `quill.snow.css`

## 3. Contenedor e integración

- [x] 3.1 `components/EmailForm.tsx`: contenedor RHF con `EmailDraft` como valores; layout cabecera → Para → CC/CCO → Asunto → Cuerpo → barra Enviar; CC/CCO opcionales; español; tokens NTT DATA
- [x] 3.2 Botón Enviar **inerte**: `handleSubmit` con `onSubmit` no-op documentado (cableado real en la fase 4); evitar el submit nativo del navegador
- [x] 3.3 Montar `EmailForm` en `App.tsx` (ruta única `/`), retirando el placeholder de foundation

## 4. Tests (Vitest + RTL)

- [x] 4.1 `RecipientChips`: Enter añade chip, coma añade chip, eliminar quita chip, admite varias direcciones
- [x] 4.2 `SubjectField`: pegar texto con `\n` deja el valor en una sola línea
- [x] 4.3 `BodyEditor`: el toolbar solo ofrece el set acordado (sin enlace/imagen/encabezado); escribir produce HTML
- [x] 4.4 `EmailForm`: render con todos los campos y botón Enviar; CC/CCO marcados opcionales; Enviar no dispara petición

## 5. Verificación (criterios de cierre)

- [x] 5.1 `pnpm build` y `pnpm test` en verde vía Turborepo
- [x] 5.2 Prueba manual (`pnpm dev`): la pantalla muestra Para/CC/CCO (chips), Asunto y Cuerpo (editor con B/I/listas), en español y con estilo NTT DATA
- [x] 5.3 Revisar que no hay validación ni envío ni adjunto en esta fase (fronteras a fases 5/4/6) y que el botón Enviar es inerte
