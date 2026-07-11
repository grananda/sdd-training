// Variables mínimas para que la validación de env (Zod) no aborte al importar la
// app en los tests. Se aplican solo si no vienen ya del entorno.
process.env.SMTP_HOST ||= "localhost";
process.env.SMTP_PORT ||= "1025";
process.env.SMTP_SECURE ||= "false";
process.env.MAIL_FROM ||= "aidd-test <no-reply@example.com>";
process.env.WEB_ORIGIN ||= "http://localhost:5173";
