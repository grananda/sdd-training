# Guía de estilos — Servicio Web de Envío de Email (aidd-training)

> **Versión 3** · **Generado:** 2026-07-08 11:57 CEST
> Documento de Fase 2 (AIDD · paso 2.3). Generado por `aidd style-guide`.
> Entrada: docs/detalle-historias-usuario.md + identidad de marca **NTT DATA**.
> **Aprobado (2026-07-08).**
>
> **Identidad visual:** corporativa **NTT DATA** (azul primario, rojo de acento, tipografía Inter). Resuelve el NFR-12, que quedaba pendiente de definir. **Objetivo de accesibilidad:** WCAG 2.1 AA. **Responsive:** desktop-first con adaptación a móvil.

## 1. Principios de diseño y UX

- **Claridad ante todo.** Es un formulario único; el usuario debe entender de un vistazo qué es obligatorio, qué es opcional y en qué estado está el envío. Jerarquía tipográfica y espaciado hacen el trabajo, no el color.
- **Sobrio y corporativo (NTT DATA).** Superficies neutras, azul de marca reservado a acciones primarias, foco y enlaces; el rojo de marca solo para error/peligro. Nada de degradados decorativos ni adornos.
- **Feedback inmediato y honesto.** Cada acción (validación, envío, éxito, error) tiene una respuesta visible y textual; los estados nunca se comunican solo con color (NFR de accesibilidad).
- **Interfaz en español** (NFR-01), copy directo y sin tecnicismos de cara al remitente.
- **Accesible por defecto.** Contraste AA, foco visible, semántica nativa y navegación por teclado en todos los controles (chips, toolbar, adjunto, enviar).
- **La guía manda sobre el prototipo.** El wireframe (paso 2.2) fijó estructura; aquí se fija el vestido visual definitivo.

## 2. Paleta de colores

**Marca NTT DATA**
| Rol | Valor | Uso |
|-----|-------|-----|
| Azul primario | `#0072CE` | Color de marca. Acentos, foco, enlaces, elementos activos. |
| Azul primario (acción) | `#005A9E` | Fondo de botones/acciones primarias (garantiza AA con texto blanco). |
| Azul oscuro (hover/pressed) | `#00457A` | Estado hover/pressed de la acción primaria. |
| Rojo NTT DATA | `#DA291C` | Acento de marca; base del color de error/peligro. |

**Neutros (superficies y texto)**
| Rol | Valor | Uso |
|-----|-------|-----|
| Fondo app | `#F4F6F8` | Fondo general de la página. |
| Superficie | `#FFFFFF` | Tarjetas, campos, panel del formulario. |
| Borde | `#D5DCE3` | Bordes de inputs, separadores. |
| Borde fuerte | `#9AA7B4` | Bordes en foco/hover de inputs. |
| Texto principal | `#1F2933` | Cuerpo y titulares (≈13:1 sobre blanco). |
| Texto secundario | `#52606D` | Etiquetas, ayudas, texto opcional (≈7:1 sobre blanco). |
| Texto deshabilitado | `#8A97A3` | Placeholders, estados disabled. |

**Estados semánticos** (fondo tenue + texto/borde accesibles)
| Estado | Texto/Icono | Fondo | Borde |
|--------|-------------|-------|-------|
| Éxito | `#1E7A46` | `#E7F4EC` | `#9AD5B4` |
| Error / peligro | `#C21B0E` | `#FDECEA` | `#F2B8B2` |
| Aviso | `#8A5A00` | `#FDF3E2` | `#E9C88A` |
| Información | `#005A9E` | `#E8F1FB` | `#A9CCEC` |

> Todos los pares texto/fondo cumplen contraste AA (≥4.5:1 texto normal). El color nunca es el único indicador de estado: se acompaña de icono y texto.

## 3. Tipografía, espaciado e iconografía

**Tipografía**
- Familia principal: **Inter** (marca NTT DATA), con fallback de sistema: `Inter, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- Pesos: 400 (regular), 500 (medium), 600 (semibold para titulares y botones).
- Escala (ratio ≈1.25, base 16px):

| Nivel | Tamaño | Line-height | Uso |
|-------|--------|-------------|-----|
| Display / H1 | 28px (1.75rem) | 1.3 | Título "Redactar correo". |
| H2 | 22px (1.375rem) | 1.35 | Secciones. |
| H3 | 18px (1.125rem) | 1.4 | Sub-bloques. |
| Body | 16px (1rem) | 1.5 | Texto e inputs. |
| Small | 14px (0.875rem) | 1.45 | Ayudas, contadores, mensajes de campo. |
| Caption | 12px (0.75rem) | 1.4 | Metadatos (tamaño de adjunto). |

- Longitud de línea en textos largos: 65–75ch. `tabular-nums` en tamaños/contadores.

**Espaciado** — escala base 4px:
`4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Espaciado variado por jerarquía (más aire entre bloques que dentro de un bloque).

**Iconografía**
- Set recomendado: **Lucide** (o Heroicons), trazo `1.5px`, tamaño base 20px (24px en acciones). Iconos decorativos con `aria-hidden="true"`; iconos con significado llevan `aria-label`.
- Iconos clave: negrita/cursiva/lista (toolbar), clip (adjunto), X (quitar chip/adjunto), check (éxito), alerta (error/aviso), spinner (enviando).

## 4. Design tokens CSS

```css
:root {
  /* Marca NTT DATA */
  --color-primary: #0072CE;
  --color-primary-action: #005A9E;
  --color-primary-hover: #00457A;
  --color-brand-red: #DA291C;

  /* Neutros */
  --color-bg: #F4F6F8;
  --color-surface: #FFFFFF;
  --color-border: #D5DCE3;
  --color-border-strong: #9AA7B4;
  --color-text: #1F2933;
  --color-text-muted: #52606D;
  --color-text-disabled: #8A97A3;

  /* Estados */
  --color-success-fg: #1E7A46;
  --color-success-bg: #E7F4EC;
  --color-success-border: #9AD5B4;
  --color-error-fg: #C21B0E;
  --color-error-bg: #FDECEA;
  --color-error-border: #F2B8B2;
  --color-warning-fg: #8A5A00;
  --color-warning-bg: #FDF3E2;
  --color-warning-border: #E9C88A;
  --color-info-fg: #005A9E;
  --color-info-bg: #E8F1FB;
  --color-info-border: #A9CCEC;

  /* Tipografía */
  --font-family-base: "Inter", -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-size-h1: 1.75rem;
  --font-size-h2: 1.375rem;
  --font-size-h3: 1.125rem;
  --font-size-body: 1rem;
  --font-size-small: 0.875rem;
  --font-size-caption: 0.75rem;
  --line-height-body: 1.5;
  --line-height-tight: 1.3;

  /* Espaciado (base 4px) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Radios */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-pill: 999px;   /* chips */

  /* Sombras (sutiles) */
  --shadow-sm: 0 1px 2px rgba(31, 41, 51, 0.06);
  --shadow-md: 0 4px 12px rgba(31, 41, 51, 0.10);

  /* Foco (accesibilidad) */
  --focus-ring: 0 0 0 3px rgba(0, 114, 206, 0.45);
  --focus-outline: 2px solid var(--color-primary);

  /* Layout */
  --container-max: 760px;        /* ancho de la hoja de composición */
  --control-min-target: 44px;    /* hit target mínimo AA */
}
```

## 5. Componentes base y pautas de uso

**Botones**
- **Primario** (Enviar): fondo `--color-primary-action`, texto blanco, `--radius-md`, padding `12px 20px`, peso 600. Hover `--color-primary-hover`. Foco `--focus-ring`. Disabled: fondo `--color-border`, texto `--color-text-disabled`, sin sombra.
- **Secundario** (p. ej. quitar adjunto): fondo transparente, borde `--color-border-strong`, texto `--color-text`. 
- **Terciario / icon-only** (borrar chip, toolbar): mínimo `44×44px` de área efectiva aunque el icono sea 20px; `aria-label` obligatorio.

**Campos de texto (Asunto) e inputs**
- Superficie blanca, borde `--color-border`, `--radius-md`, padding `10px 12px`, texto 16px. Foco: borde `--color-primary` + `--focus-ring`. Error: borde `--color-error-border`, mensaje bajo el campo con icono + texto (`aria-describedby`).
- Etiqueta siempre visible (no solo placeholder). Los campos opcionales se marcan con el texto "(opcional)", no solo por estilo.

**Chips de destinatarios (Para/CC/CCO)**
- Contenedor tipo input que envuelve chips + campo de escritura. Añadir con Enter o coma; cada chip es una `--radius-pill` con fondo `--color-info-bg`, texto `--color-text`, y botón X (`aria-label="Quitar <email>"`, target 44px).
- Chip con email inválido: borde/fondo de error y sufijo textual "(no válido)".
- **Para** es obligatorio; **CC/CCO** opcionales y colapsables.

**Editor de cuerpo (React Quill)**
- Toolbar minimalista: **negrita, cursiva, lista ordenada, lista no ordenada** (nada más; coherente con RF-06). Botones toggle con estado `aria-pressed`. Área de edición con `--radius-md`, min-height ~180px, padding `12px`.
- La salida HTML se **sanea en backend** (HU-17); el whitelist visual coincide con estas opciones.

**Adjunto**
- Zona de un único fichero: botón "Adjuntar" + al seleccionar muestra nombre, tamaño (`tabular-nums`, caption) y botón quitar. Máx. 10 MB y tipos permitidos (JPG, GIF, PDF, Word, Excel, PowerPoint); errores como banner de estado de error.

**Banners / feedback**
- Éxito, error, aviso e info usan los tokens de estado (§2) con icono + texto. Los cambios asíncronos (enviando, resultado) se anuncian con `aria-live="polite"`.

**Tarjeta / panel**
- El formulario vive en una superficie blanca con `--shadow-sm`, `--radius-lg`, ancho `--container-max` centrado sobre `--color-bg`.

## 6. Responsive y accesibilidad

**Breakpoints** (desktop-first, adaptando hacia abajo)
| Nombre | Ancho | Comportamiento |
|--------|-------|----------------|
| `lg` (desktop) | ≥1024px | Hoja centrada a `--container-max`; CC/CCO pueden ir en la misma fila. |
| `md` (tablet) | 640–1023px | Hoja a ancho casi completo con márgenes; campos apilados. |
| `sm` (móvil) | <640px | Una columna, padding reducido (`--space-4`), botón Enviar a ancho completo, toolbar del editor con scroll horizontal si no cabe. |

**Accesibilidad — WCAG 2.1 AA**
- **Contraste:** ≥4.5:1 texto normal, ≥3:1 texto grande y componentes UI. Paleta §2 verificada.
- **Foco visible:** `--focus-ring` en todos los controles (`:focus-visible`); nunca `outline:none` sin reemplazo.
- **Hit targets:** ≥44×44px en botones, chips (incluida su X), toolbar y adjunto.
- **Semántica:** `<header>/<main>/<aside>/<footer>`, `<label>` asociada a cada control, jerarquía de headings sin saltos, `<caption>` sr-only donde aplique.
- **Teclado:** orden lógico de tabulación, Enter envía el formulario, Esc descarta errores/menús, chips borrables con teclado.
- **ARIA con criterio:** `aria-live` en feedback asíncrono, `aria-describedby` en errores de campo, `aria-label` en botones icon-only, `aria-hidden` en iconos decorativos, `aria-pressed` en toggles del editor.
- **Estado nunca solo por color:** siempre icono + texto.
- **Movimiento:** respetar `prefers-reduced-motion`; transiciones de feedback <300ms; no animar propiedades de layout.

## 7. Estructura de pantallas y navegación

- **Aplicación de una sola pantalla** (el compositor). No hay navegación entre vistas: el flujo es lineal dentro del formulario.
- **Layout base:** cabecera con título → hoja de composición (Para → CC/CCO → Asunto → Cuerpo → Adjunto) → barra de acción (feedback + Enviar). Un solo `<main>` con el formulario; sin menú lateral en producción (el panel de estados del prototipo no forma parte del producto).
- **Flujo:** componer → validar (cliente) → enviar → resultado (éxito limpia el formulario; error lo conserva). Ver estados E1–E7 en `arquitectura-base-prototipo.md`.

## 8. Decisiones tomadas en el paso 2.3 (estilos)

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Origen de la identidad visual (NFR-12) | Base neutra provisional / Extraer de Figma / **Marca NTT DATA** | **Marca NTT DATA** (azul `#0072CE`, rojo `#DA291C`, Inter) | usuario | El usuario indica usar la identidad corporativa NTT DATA; deja de ser provisional. |
| 2 | Nivel de accesibilidad objetivo | **WCAG 2.1 AA** / AAA / Básico | **WCAG 2.1 AA** | usuario | Coherente con los NFR y con la variante v2 del prototipo; exigible y realista. |
| 3 | Soporte responsive | **Desktop-first + móvil** / Solo escritorio / Mobile-first | **Desktop-first con adaptación a móvil** | usuario | Uso principal en escritorio (despliegue local), pero adaptable. |
| 4 | Azul de marca para acciones con texto | Usar `#0072CE` / **Oscurecer a `#005A9E`** | **`#005A9E` en botones** | default | `#0072CE` con texto blanco no alcanza 4.5:1; el tono de acción sí cumple AA. |
| 5 | Uso del rojo NTT DATA | Acento general / **Solo error/peligro** | **Solo error/peligro** | default | Evita saturar la interfaz; reserva el rojo para estados críticos, con tono accesible `#C21B0E` en texto. |
| 6 | Set de iconografía | **Lucide** / Heroicons / Material | **Lucide** (recomendado, intercambiable) | default | Trazo limpio y ligero; no es bloqueante y puede sustituirse por Heroicons. |
