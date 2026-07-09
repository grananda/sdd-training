# Notas · Redactar correo (wireframe editorial v1)

**Escena.** Un consultor proyecta esta pantalla en una sala de reunión, con luz diurna de ventana, durante la sesión de validación de requisitos con el cliente; por eso el tema es **light**.

**Color strategy.** Escala de grises tintada en frío (OKLCH, hue ~260) sin color de marca ni logotipo. Nunca #000 ni #fff puros: papel `oklch(0.985 …)`, tinta `oklch(0.285 …)`. Único gris más oscuro reservado al botón primario (`oklch(0.345 …)`). Avisos y éxito son neutros con chroma mínimo (apenas rojizo/frío), no colores plenos.

**Tema.** Light, coherente con la escena de sala.

**Top-2 anti-reflejo.**
1. No es la típica ventana de cliente de correo en cajas: es una **hoja de composición** con campos ruled por hairlines y etiquetas en columna-margen (grid 92px), jerarquía tipográfica real (asunto en `lede`, cuerpo en `body`).
2. Espaciado **variado** (paddings distintos por sección: cabecera pb-5, cuerpo py-6, campos py-5) y cuerpo limitado a 68ch; nada de padding uniforme ni grid de cards idénticas.

**Interactivo.** Chips en Para/CC/CCO (añadir con Intro o coma, borrar con × o Backspace, email inválido marcado). Toolbar del cuerpo (B, I, listas) cosmética sobre contenteditable. Adjunto simulado (seleccionar → nombre+tamaño+quitar). Envío mock con `setTimeout` ~1s. Panel de control lateral fuerza E1–E7.
