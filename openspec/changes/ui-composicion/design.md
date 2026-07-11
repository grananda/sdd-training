# Diseño técnico — ui-composicion

> Alineado con `docs/arquitectura-base.md` §3 (árbol web), §6 (componentes), §8 (estado local con RHF) y §11 (accesibilidad WCAG 2.1 AA), y con los tokens de `docs/guia-estilos.md`. Solo la parte de esta fase: formulario + campos, sin validación, sin envío, sin adjunto.

## 1. Punto de partida

`foundation` dejó en `apps/web`: React 18 + Vite + TypeScript, Tailwind v3 configurado, `src/styles/tokens.css` con los design tokens NTT DATA, `App.tsx` placeholder y el harness Vitest + React Testing Library. `packages/shared` exporta un placeholder.

## 2. Componentes y responsabilidades

Todos en `apps/web/src/components/`, orquestados por `EmailForm` con **React Hook Form** (estado local; sin store global, arquitectura §8).

### 2.1 `EmailForm.tsx` (HU-05)
- Contenedor RHF (`useForm`) con los valores del borrador: `to: string[]`, `cc: string[]`, `bcc: string[]`, `subject: string`, `body: string` (HTML).
- Layout de la pantalla única (una sola ruta `/`): cabecera → `RecipientChips` Para → `RecipientChips` CC/CCO → `SubjectField` → `BodyEditor` → barra de acción con el botón **Enviar**.
- Marca CC y CCO como **opcionales** en la UI. Interfaz en **español**, identidad **NTT DATA** (tokens/Tailwind).
- **Botón Enviar inerte** en esta fase: `handleSubmit(onSubmit)` con `onSubmit` no-op (placeholder documentado); el cableado real (`useSendEmail` → `POST /api/send`) llega en la fase 4. No se implementa `preventDefault`/envío real más allá de evitar el submit nativo del navegador.

### 2.2 `RecipientChips.tsx` (HU-06, HU-07)
- Campo controlado (vía RHF `Controller`) que gestiona un **array de direcciones** como chips.
- **Alta**: al pulsar **Enter** o **coma**, el texto actual se añade como chip y se limpia el input. **Baja**: cada chip tiene un control para eliminarlo (y Backspace con input vacío borra el último, deseable por accesibilidad de teclado).
- Reutilizable para Para (obligatorio conceptualmente, pero **sin validación** en esta fase), CC y CCO (opcionales). Props: `label`, `value`, `onChange`, `optional`, `helpText`.
- **Sin validación de formato** en esta fase (HU-08, fase 5): un texto se acepta como chip tal cual. La marca de "copia oculta" de CCO es informativa; la entrega BCC la hace el backend.
- Accesibilidad: `label` asociado, chips borrables por teclado, hit targets ≥44px, foco visible.

### 2.3 `SubjectField.tsx` (HU-09)
- Input de una sola línea enlazado a RHF. Al **pegar** (o introducir) texto con saltos de línea, se **normaliza** colapsando `\r?\n`+ a un espacio, de modo que el valor nunca contiene saltos.
- Sin obligatoriedad en esta fase (HU-14, fase 5).

### 2.4 `BodyEditor.tsx` (HU-10)
- Editor **React Quill** usando **`react-quill-new`** (compatible con React 18, sin `findDOMNode`).
- Toolbar **acotado**: `bold`, `italic`, lista ordenada y no ordenada. **Nada más** (ni enlaces, ni imágenes, ni encabezados) — se configura `modules.toolbar` con solo ese set y `formats` restringido para que Quill no conserve otros formatos pegados.
- **Salida HTML**: el valor (`onChange` de Quill) se guarda como string HTML en el campo `body` de RHF. El saneamiento del HTML es del backend (HU-17, fase 7); aquí no se sanea.
- Importa el CSS del tema (`react-quill-new/dist/quill.snow.css`).

## 3. Contrato de tipos en `packages/shared`

- Se reemplaza el placeholder por el **contrato de tipos** del borrador de email:
  ```ts
  export interface EmailDraft {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string; // HTML
  }
  ```
- **Solo tipos** en esta fase (decisión de pre-flight): el `emailSchema` (Zod) con reglas de obligatorios y formato es la **fase 5** (`validacion-cliente`, HU-08/HU-14). Web lo usa como tipo de los valores de RHF; api lo podrá reutilizar cuando convenga.

## 4. Estado (arquitectura §8)

- **Local a la pantalla** con RHF; sin Redux/Zustand/Context de app.
- **Chips**: estado interno de `RecipientChips`, expuesto a RHF como `string[]`.
- **Cuerpo**: string HTML en RHF.
- **Sin estado de envío** en esta fase (eso es `useSendEmail`, fase 4).

## 5. Estrategia de test (Vitest + RTL)

- `RecipientChips`: escribir + Enter añade chip; coma añade chip; botón/tecla elimina chip; admite varias direcciones.
- `SubjectField`: pegar texto con `\n` deja el valor en una sola línea.
- `BodyEditor`: el toolbar solo ofrece el set acordado (no hay botones de enlace/imagen/encabezado); escribir produce HTML en el valor.
- `EmailForm`: render de la pantalla con todos los campos y el botón Enviar; CC/CCO marcados como opcionales; el botón no dispara envío (inerte).

## 6. Fuera de alcance (trazabilidad de fronteras)

| Preocupación | HU | Fase |
|--------------|----|----|
| Validación de formato de direcciones | HU-08 | 5 |
| Campos obligatorios antes de enviar | HU-14 | 5 |
| `emailSchema` (Zod) completo en shared | HU-08/HU-14 | 5 |
| Envío desde la UI y feedback | HU-15/HU-16 | 4 |
| Adjunto único + validación cliente | HU-11–13 | 6 |
| Saneamiento del HTML del cuerpo | HU-17 | 7 |
