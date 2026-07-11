# Propuesta — ui-composicion

> Historias: HU-05 (formulario), HU-06 (Para chips), HU-07 (CC/CCO chips), HU-09 (asunto), HU-10 (cuerpo React Quill). Fase F1.
> Fase 3 del `docs/roadmap.md`. Sprint 1 · MVP (10–14 ago 2026).
> Construye sobre `foundation` (apps/web con React+Vite+Tailwind y tokens NTT DATA) y es paralela al backend de `api-envio-smtp`.

## Why

El backend ya envía correo (`POST /api/send`), pero `apps/web` solo tiene una página placeholder. Esta fase construye la **pantalla única de composición**: el formulario con todos los campos visibles (Para/CC/CCO, Asunto, Cuerpo) y el botón Enviar. Es el contenedor sobre el que se montan el envío desde la UI (fase 4), la validación de cliente (fase 5) y el adjunto (fase 6). Sin él, ninguna HU de UI posterior tiene dónde vivir.

## What Changes

- Se crea **`EmailForm`** (`apps/web/src/components/EmailForm.tsx`), contenedor del formulario orquestado con **React Hook Form**, con la pantalla única en **español** e identidad **NTT DATA** (tokens de `docs/guia-estilos.md`), y el layout: cabecera → Para → CC/CCO → Asunto → Cuerpo → barra de acción con **Enviar**. CC, CCO (y el futuro adjunto) se indican como **opcionales** (HU-05).
- Se crea **`RecipientChips`** (`components/RecipientChips.tsx`): campo de direcciones como **chips** eliminables; una dirección se añade al pulsar **Enter o coma**, y cada chip se puede quitar. Se usa tres veces (Para/CC/CCO); CC y CCO son opcionales y admiten varias direcciones (HU-06, HU-07). CCO se etiqueta como copia oculta (el comportamiento de entrega es del backend).
- Se crea **`SubjectField`** (`components/SubjectField.tsx`): asunto de **una sola línea**; al pegar texto con saltos de línea, se **normaliza** a una sola línea (HU-09).
- Se crea **`BodyEditor`** (`components/BodyEditor.tsx`): editor **React Quill** (paquete `react-quill-new`, compatible con React 18) con toolbar **acotado a negrita, cursiva y listas** (ordenada y no ordenada) y **salida HTML**; nada de enlaces, imágenes ni encabezados (HU-10).
- Se expone el **contrato de tipos del borrador de email** en `packages/shared` (`to[]`, `cc[]`, `bcc[]`, `subject`, `body`) como contrato compartido entre web y api, reemplazando el placeholder de `foundation`.
- Se integran los componentes en `App.tsx` (una sola ruta `/`) y se añaden **tests** (Vitest + React Testing Library): alta/baja de chips y separadores, normalización del asunto, y toolbar del editor limitado al set acordado.

**Fuera de alcance de esta fase (llega en fases posteriores):**
- **Validación de cliente** (formato de direcciones HU-08, obligatorios HU-14): **no** se implementa aquí. El `emailSchema` (Zod) completo en `shared` es la **fase 5** (`validacion-cliente`). En esta fase el formulario captura datos sin validarlos.
- **Envío real** (`useSendEmail`, `apiClient`, HU-15/HU-16): **fase 4** (`ui-envio-feedback`). El botón **Enviar se renderiza (HU-05) pero es inerte** (handler no-op) hasta la fase 4.
- **Adjunto** (`AttachmentField`, HU-11–13): **fase 6**.

## Capabilities

### New Capabilities

- `email-composition-form`: pantalla única de composición en español con identidad NTT DATA; contenedor RHF que compone los campos y muestra el botón Enviar (inerte en esta fase), con CC/CCO marcados como opcionales. Cubre HU-05.
- `recipient-chips`: entrada de direcciones como chips eliminables (alta con Enter/coma, varias por campo) para Para, CC y CCO. Cubre HU-06 y HU-07.
- `subject-field`: campo de asunto de una sola línea que normaliza saltos de línea al pegar. Cubre HU-09.
- `rich-text-body`: editor de cuerpo React Quill con formato acotado (negrita, cursiva, listas) y salida HTML. Cubre HU-10.

### Modified Capabilities

Ninguna. Las capabilities existentes (`monorepo-scaffolding`, `local-dev-environment`, `api-health-check`, `email-sending`, `send-logging`) no cambian; esta fase añade UI nueva y el contrato de tipos en `shared`.

## Impact

- **Código nuevo:** `apps/web/src/components/{EmailForm,RecipientChips,SubjectField,BodyEditor}.tsx`, integración en `App.tsx`, y el contrato de tipos en `packages/shared/src`. Tests de componentes nuevos.
- **Dependencias nuevas:** `react-hook-form` y `react-quill-new` (+ su CSS) en `apps/web`.
- **Sin validación, sin envío, sin adjunto** en este change (fronteras a fases 5/4/6).
- **Estado:** local a la pantalla con RHF; sin store global (arquitectura §8). Chips como arrays de direcciones expuestos a RHF; cuerpo como HTML.
- **Desbloquea:** el envío desde la UI y el feedback (fase 4), sobre este formulario.
