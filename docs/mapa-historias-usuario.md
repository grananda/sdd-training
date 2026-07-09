# Mapa de historias de usuario — Servicio Web de Envío de Email (aidd-training)

> Documento de Fase 1 (AIDD · paso 1.2). Generado por `aidd user-stories`.
> Entrada: docs/requisitos.md. Salida hacia: docs/detalle-historias-usuario.md.
> **Aprobado (2026-07-07).**

## 1. Personas / roles de usuario

| Rol | Objetivo principal | Contexto de uso |
|-----|--------------------|-----------------|
| **Remitente (usuario final)** | Enviar un correo con formato y (opcionalmente) un adjunto de forma rápida, sin abrir un cliente de correo externo. | Accede a la web (sin login), rellena un formulario y envía. Uso puntual en local. |
| **Equipo de desarrollo** *(rol técnico, historias enabler de F0)* | Disponer de la base técnica (monorepo, backend de envío, Docker) para soportar el flujo del remitente. | Fase de foundation. |
| **Responsable de seguridad** *(perspectiva, no usuario)* | Garantizar que el envío es seguro (saneamiento, validación en servidor, secretos por env). | Se materializa en F4 (seguridad y endurecimiento). |

## 2. Backbone de actividades

Recorrido del remitente, de izquierda a derecha:

1. **Acceder** al formulario de composición.
2. **Definir destinatarios** (Para, CC, CCO).
3. **Redactar** el mensaje (asunto + cuerpo con formato).
4. **Adjuntar** un documento (opcional).
5. **Enviar** y **ver el resultado** (éxito/error).

Actividades de soporte (no visibles al usuario): configurar SMTP, sanear el cuerpo, validar en servidor, registrar en logs.

## 3. Historias por fase

### F0 — Foundation (base técnica)

- **Objetivo:** dejar el monorepo y el servicio de envío operativos en local para soportar el flujo del remitente.
- **Criterio de salida:** la app arranca con Docker Compose; el backend expone un endpoint de envío que manda un correo de prueba vía SMTP configurable y registra el resultado en logs.

| ID | Historia | RF | MoSCoW |
|----|----------|----|--------|
| HU-01 | Como equipo de desarrollo, quiero un monorepo Turborepo + pnpm con apps `web` (React + TS + Tailwind) y `api` (Express + TS) para tener la base del proyecto. | (enabler; soporte RF-01, RF-06) | Must |
| HU-02 | Como equipo de desarrollo, quiero levantar la aplicación en local con Docker Compose para poder ejecutar y probar el servicio. | (enabler; NFR-08) | Must |
| HU-03 | Como equipo de desarrollo, quiero un endpoint de envío en el backend que use Nodemailer con SMTP configurable por variables de entorno para poder enviar correos. | RF-13, NFR-03, NFR-09 | Must |
| HU-04 | Como equipo de desarrollo, quiero registrar en logs el resultado de cada envío (sin persistir el contenido) para tener trazabilidad operativa. | RF-15, NFR-06 | Should |

### F1 — Composición y envío del email (núcleo, happy path)

- **Objetivo:** el remitente compone (formulario con Para/CC/CCO, asunto, cuerpo enriquecido) y envía el correo, con feedback de resultado. Sin validación de entradas todavía.
- **Criterio de salida:** desde la UI se puede componer y enviar un correo con formato (destinatarios, asunto, cuerpo enriquecido); el envío es directo; la UI muestra éxito/error. Quedan fuera de esta fase la validación de entradas (F2), el adjunto (F3) y el endurecimiento en servidor (F4).

| ID | Historia | RF | MoSCoW |
|----|----------|----|--------|
| HU-05 | Como remitente, quiero ver un formulario con Para, CC, CCO, Asunto, Cuerpo y Adjunto para redactar un email. | RF-01 | Must |
| HU-06 | Como remitente, quiero indicar una o varias direcciones en **Para** para enviar a los destinatarios que necesite. | RF-02 | Must |
| HU-07 | Como remitente, quiero añadir una o varias direcciones en **CC** y **CCO** (opcionales) para incluir copias visibles y ocultas. | RF-03 | Must |
| HU-09 | Como remitente, quiero escribir el **asunto** en una línea para titular el correo. | RF-05 | Must |
| HU-10 | Como remitente, quiero redactar el **cuerpo** con un editor minimalista (negrita, cursiva, listas) para dar formato al mensaje. | RF-06 | Must |
| HU-15 | Como remitente, quiero **enviar directamente** al pulsar Enviar, sin confirmación ni vista previa, para un flujo ágil. | RF-11 | Could |
| HU-16 | Como remitente, quiero **feedback claro de éxito o error** tras enviar para saber si el correo salió. | RF-14 | Must |

### F2 — Validación de entradas del formulario

- **Objetivo:** validar en el cliente las entradas del formulario antes de permitir el envío: formato de las direcciones y campos obligatorios.
- **Criterio de salida:** no se puede enviar si faltan **Para, Asunto o Cuerpo**, ni si alguna dirección (Para/CC/CCO) tiene formato inválido; se muestran errores claros junto a los campos. La validación es de cliente; la autoritativa en servidor llega en F4.

| ID | Historia | RF | MoSCoW |
|----|----------|----|--------|
| HU-08 | Como remitente, quiero que se valide el **formato** de cada dirección de correo para evitar envíos a direcciones inválidas. | RF-04 | Must |
| HU-14 | Como remitente, quiero que el sistema exija **Para, Asunto y Cuerpo** antes de enviar para no mandar correos incompletos. | RF-10 | Must |

### F3 — Adjunto

- **Objetivo:** añadir el adjunto único con sus validaciones de tipo y tamaño.
- **Criterio de salida:** se puede adjuntar un único documento al correo y se valida su tipo y tamaño (máx. 10 MB) antes de enviar. La validación de adjunto es aún de cliente; el endurecimiento en servidor llega en F4.

| ID | Historia | RF | MoSCoW |
|----|----------|----|--------|
| HU-11 | Como remitente, quiero **adjuntar un único documento** (opcional) al email. | RF-07 | Must |
| HU-12 | Como remitente, quiero que se valide el **tipo** del adjunto (JPG, GIF, PDF, Word, Excel, PowerPoint) para no enviar formatos no permitidos. | RF-08 | Must |
| HU-13 | Como remitente, quiero que se valide el **tamaño** del adjunto (máx. 10 MB) para no exceder el límite. | RF-09 | Must |

### F4 — Seguridad y endurecimiento de servidor

- **Objetivo:** elevar la seguridad del envío al backend: saneamiento del cuerpo y validación autoritativa en servidor.
- **Criterio de salida:** el backend **sanea** el HTML del cuerpo y **valida en servidor** (obligatorios, formato de email, tipo/tamaño del adjunto), quedando la validación de cliente como conveniencia. El flujo del remitente queda operativo y seguro de extremo a extremo.

| ID | Historia | RF | MoSCoW |
|----|----------|----|--------|
| HU-17 | Como responsable de seguridad, quiero que el backend **sanee el HTML** del cuerpo antes de enviar para prevenir XSS/inyección. | RF-12, NFR-02 | Must |
| HU-18 | Como responsable de seguridad, quiero que el backend **valide en servidor** (obligatorios, formato de email, tipo/tamaño de adjunto) para no fiar la validación al cliente. | RF-16, NFR-11 | Must |

## 4. Priorización MoSCoW (fases de producto F1–F4)

> Las fases de producto (F1 a F4) forman el MVP funcional; casi todo es **Must** porque cada pieza fue solicitada explícitamente por el cliente. Se distinguen los matices secundarios.

- **Must:** HU-01, HU-02, HU-03, HU-05, HU-06, HU-07, HU-08, HU-09, HU-10, HU-11, HU-12, HU-13, HU-14, HU-16, HU-17, HU-18.
- **Should:** HU-04 (logging: valioso pero el envío funciona sin él).
- **Could:** HU-15 (envío directo: es el comportamiento por defecto; apenas requiere trabajo específico).
- **Won't (esta fase):** autenticación, anti-abuso, persistencia/historial/reintentos, múltiples adjuntos, plantillas/borradores/programación, despliegue cloud, antivirus de adjuntos, i18n más allá del español (ver §6 "Fuera de esta fase" en `docs/requisitos.md`).

## 5. Trazabilidad RF → historias

| RF | Historia(s) | Cubierto |
|----|-------------|----------|
| RF-01 | HU-05 | ✅ |
| RF-02 | HU-06 | ✅ |
| RF-03 | HU-07 | ✅ |
| RF-04 | HU-08 | ✅ |
| RF-05 | HU-09 | ✅ |
| RF-06 | HU-10 | ✅ |
| RF-07 | HU-11 | ✅ |
| RF-08 | HU-12 | ✅ |
| RF-09 | HU-13 | ✅ |
| RF-10 | HU-14 | ✅ |
| RF-11 | HU-15 | ✅ |
| RF-12 | HU-17 | ✅ |
| RF-13 | HU-03 | ✅ |
| RF-14 | HU-16 | ✅ |
| RF-15 | HU-04 | ✅ |
| RF-16 | HU-18 | ✅ |

**Cobertura: 16/16 RF.** No hay requisitos funcionales sin historia.

## 6. Preguntas abiertas y pendientes

- Ninguna **bloqueante** para arrancar el paso 1.3.
- Pendiente de configuración (no de requisitos): variables/proveedor SMTP (heredado de `docs/requisitos.md` §8) — afecta a HU-03 en su puesta en marcha, no a su definición.

## 7. Decisiones tomadas en el paso 1.2

| # | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|----------|----------|----------|--------|---------------|
| 1 | Faseado del trabajo | Una sola fase MVP / F0 + F1 / **Cinco ciclos (F0 + F1 + F2 + F3 + F4)** | **Cinco ciclos: F0 foundation + F1 composición y envío + F2 validación de entradas + F3 adjunto + F4 seguridad y endurecimiento** | humano | Ciclos pequeños a petición humana: este proyecto de formación se usa en un **workshop** que necesita más ciclos cortos que recorrer. La división respeta límites de valor —composición/envío (F1), validación de entradas (F2), adjunto (F3) y seguridad en servidor (F4)—, de modo que cada ciclo entrega algo demostrable. La validación del adjunto (HU-12/HU-13) **no** se subdivide para no fragmentar en exceso. |
| 2 | Nivel de prioridad de las fases de producto (F1–F4) | Casi todo Must / Reparto amplio MoSCoW | **Casi todo Must, con Should/Could puntuales** | default | Cada pieza (CC/CCO, formato, adjunto) fue pedida explícitamente por el cliente; son núcleo del MVP. |
| 3 | Tratamiento de seguridad como historias | Diluido en otras / Historias propias | **Historias propias (HU-17, HU-18)** | default | Hace explícitos y verificables el saneamiento y la validación en servidor. |
