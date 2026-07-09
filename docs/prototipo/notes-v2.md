# Notas — Redactar correo (v2, Web Interface Guidelines)

Wireframe de baja fidelidad, solo grises, sin marca. Fuente: guidelines de Vercel (WebFetch OK).

## Top-5 reglas aplicadas
1. **Semántica nativa primero**: landmarks `header/main/aside/footer`, `<h1>`→`<h2>` sin saltos, `<label for>` en todos los controles, `role="toolbar"` en el formato del cuerpo.
2. **Foco visible universal**: `:focus-visible` con halo de 3px (#111827, ≥3:1) y `focus-within` en las cajas de chips; nunca `outline:none` sin reemplazo.
3. **Errores accesibles sin layout shift**: `aria-describedby` por campo, `role="alert"`, slot de error con `min-height` reservado; `validate()` hace auto-focus al primer campo inválido.
4. **Async anunciado**: región de feedback con `aria-live` (polite éxito/enviando, assertive error) situada sobre la barra; envío mock con `setTimeout(~1s)`.
5. **Objetivos táctiles ≥44px** (`.hit`) en botones, inputs, chips y su "×"; `prefers-reduced-motion` desactiva el spinner de "Enviando".

## Decisiones semánticas
- Chips gestionados en JS: añadir con Enter/coma, borrar con botón (`aria-label`) o Backspace; Enter en chip no envía el formulario.
- Icon-only con `aria-label` (B/I/listas, quitar adjunto, borrar chip); iconos decorativos con `aria-hidden`.
- Estado nunca solo por color: obligatorio/opcional en texto, "(no válido)" en chip, marcas ⚠/✓/✕ en avisos.

## Qué es interactivo
Chips (add/remove teclado+ratón), toolbar (execCommand B/I/OL/UL), adjuntar/quitar fichero, Enviar (valida→spinner→éxito/error según panel), Esc descarta errores/feedback, panel E1–E7 (`aria-pressed`/`aria-current`). `?state=E2..E7` prefija estado.

## Contraste verificado (sobre blanco/#f9fafb, AA)
- Texto principal #1f2937 ≈ 12.6:1 · secundario #4b5563 ≈ 7.5:1 (ambos ≥4.5:1).
- Bordes/UI #9ca3af y halo de foco #111827 ≥3:1. Botón Enviar: blanco sobre #1f2937 ≈ 12.6:1.
