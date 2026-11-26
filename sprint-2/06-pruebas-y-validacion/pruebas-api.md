# Pruebas de API

**Herramienta prevista:** Postman. **Estado:** NO EJECUTADO; endpoints son contratos propuestos.

## Colecciones previstas

- Supabase Auth/sesión: credencial válida/inválida, sesión vencida y logout mediante el cliente del proveedor; NestJS debe rechazar tokens inválidos/expirados. No guardar credenciales ni tokens en colección compartida.
- Estudiantes: CRUD permitido, vínculo correcto, intento con otro estudiante, validación y conflicto.
- Vacantes: consulta por filtros, actualización permitida/denegada, caché expirada/invalidez.
- Solicitudes/documentos: registro, consulta de lista/detalle, versión del conjunto fijada por backend, detalle de ítems obligatorios/opcionales, upload asociado al conjunto de la solicitud, acceso no autorizado, tipo/tamaño configurable, fallo de almacenamiento y subsanación.
- Revisión humana: transiciones `PENDIENTE → EN_REVISION → OBSERVADA → PENDIENTE`, aprobación/rechazo desde `EN_REVISION`, transiciones no permitidas, rol insuficiente, falta de vacante, duplicidad y contención concurrente. IA no forma parte de la colección Sprint 2.

## Aserciones

- Código HTTP y esquema JSON coinciden con `../05-especificacion-sdd/contratos-api.md` después de aprobar el contrato.
- Respuestas no revelan estudiante/documentos ajenos, secretos ni almacenamiento público.
- Solicitud creada permanece pendiente y no reserva vacante.
- Fallo/conflicto de aprobación no devuelve éxito ni deja actualización parcial.
- Idempotencia: misma clave/actor/ámbito/cuerpo reproduce el mismo estado y respuesta sin repetir efecto; mismo ámbito/clave con cuerpo distinto devuelve `409 IDEMPOTENCY_KEY_REUSED`; petición concurrente sobre operación `PROCESSING` no duplica el efecto; error terminal de negocio se reproduce; error transitorio puede recuperarse con la misma clave.
- Configuración de requisitos: una solicitud no acepta `requirementSetId` ni lista de documentos elegida por cliente; una nueva publicación no altera el detalle de solicitudes anteriores; conjunto de otro periodo/tipo y ausencia de configuración aplicable se rechazan.
- Documentos: un `requirementItemId` de otra versión no se puede asociar a la solicitud; `hasUpload` solo indica adjunto y no aprobación documental.
- El rol se deriva de la identidad/datos autorizados en servidor; no aceptar un rol indicado en el body.

Los datos de prueba serán sintéticos y reiniciables. No almacenar tokens ni credenciales en la colección compartida. Versionar la colección Postman y resultados en `../evidencias/01-postman/`. No hay colección o resultado actual.
