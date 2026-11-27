# Contratos REST — Sprint 2

**Estado general:** IMPLEMENTACIÓN PARCIAL Y CONTRATOS FUTUROS DOCUMENTADOS.

El backend NestJS implementa el prefijo `/api/v1`, expone endpoints funcionales para el módulo de matrícula y dispone de documentación Swagger/OpenAPI.

Este documento distingue entre:

- **Contratos implementados:** endpoints disponibles en el backend y documentados mediante Swagger.
- **Contratos propuestos:** diseños de endpoints y operaciones futuras que todavía no están implementados ni deben considerarse funcionalidades disponibles.

Los ejemplos JSON de las secciones de diseño son propuestas de contrato y no necesariamente representan los DTO o respuestas actuales del backend.

## 1. Endpoints implementados y estado de publicación

El backend expone los siguientes endpoints:

| Método | Endpoint | Acceso |
|---|---|---|
| GET | `/api/v1/health` | Público |
| GET | `/api/v1/enrollment-types` | Público |
| GET | `/api/v1/vacancies` | Público |
| POST | `/api/v1/enrollment-requests` | Protegido |
| GET | `/api/v1/enrollment-requests` | Protegido |
| GET | `/api/v1/enrollment-requests/:id` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/start-review` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/observe` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/resubmit` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/approve` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/reject` | Protegido |

La documentación Swagger está disponible en:

- Interfaz: `/api/docs`
- Documento OpenAPI JSON: `/api/docs-json`

Los endpoints protegidos documentan autenticación Bearer. La verificación integral con usuarios reales de Supabase y la autorización efectiva de todos los escenarios todavía requieren pruebas adicionales.

Las rutas propuestas en las secciones siguientes que no coincidan con esta tabla deben entenderse como diseño futuro, no como endpoints actualmente disponibles.

## Convenciones comunes

- Prefijo de API NestJS: `/api/v1` (propuesto).
- JSON UTF-8 para recursos; `multipart/form-data` para adjuntos.
- IDs en UUID es una propuesta técnica. Campos institucionales y enums pueden cambiar tras confirmación.
- La autenticación se propone mediante Supabase Auth en el cliente. Las operaciones protegidas envían `Authorization: Bearer <access_token>`. NestJS verifica la credencial y aplica autorización; el rol/vínculo no se confía al cuerpo enviado por cliente.
- Login y logout se realizan mediante Supabase Auth, **no son rutas de la API NestJS**. Alta/provisionamiento de usuarios y roles queda fuera del MVP.
- Toda operación autenticada que cree o modifique estado persistente exige el header `Idempotency-Key` (UUID o cadena opaca con límites de formato/tamaño por definir): creación/actualización de perfil/estudiante/vacante, creación de solicitud, revisión, observación, decisión, subsanación y carga de documento. Lecturas `GET` no lo requieren. El ámbito incluye método, ruta normalizada y recurso objetivo.
- NestJS calcula una huella del cuerpo canónico; en cargas incluye el contenido binario y metadatos relevantes. Misma clave, usuario autenticado, ámbito y huella devuelve el mismo código HTTP y cuerpo de la respuesta original, con `Idempotency-Replayed: true`, sin repetir el efecto. La misma clave y ámbito con huella diferente responde `409 IDEMPOTENCY_KEY_REUSED`. Una clave diferente inicia una operación nueva y se somete a validaciones/reglas normales.
- Si una clave ya está en procesamiento, no se duplica la operación: responder `409 IDEMPOTENCY_IN_PROGRESS` (opcionalmente `Retry-After` si la implementación conoce el tiempo de espera). Errores de negocio definitivos (p. ej. falta de vacante o estado incompatible) no son reintentables automáticamente; las respuestas terminales se reproducen para la misma clave. Errores transitorios pueden reintentarse con la misma clave y solo después de reintentar la transacción/recuperación completa. Retención/expiración de claves queda `PENDIENTE_DECISION_TECNICA`; no se fija duración.
- Para operaciones solo PostgreSQL, el registro idempotente, los cambios de negocio y la respuesta reproducible se confirman en una misma transacción. Para archivos, el contrato de coordinación es: registrar/reclamar la operación, guardar en almacenamiento privado con referencia determinista al registro, persistir metadatos y completar la respuesta; compensar el objeto si falla la persistencia, o dejar operación recuperable para reconciliación. No responder éxito mientras el archivo y sus metadatos no estén consistentes. La conducta ante fallos prolongados del proveedor queda pendiente de validación técnica.
- La administración de categorías y conjuntos de requisitos no tiene endpoints en Sprint 2. El cliente nunca envía una lista de requisitos ni selecciona `requirementSetId`; la API de creación resuelve la versión publicada en backend. La gestión administrativa de esas configuraciones se evalúa para un sprint futuro.
- Formato uniforme de error:

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "La solicitud no cumple la validación.",
  "details": [{ "field": "capacity", "issue": "Debe ser un entero no negativo." }],
  "path": "/api/v1/vacancies",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

`details` es una lista vacía si no aplica. Para no filtrar recursos, la política de responder `403` o `404` ante recurso ajeno debe ser uniforme y confirmarse antes de implementar.

## Paginación

`GET /students` y `GET /enrollment-requests` aceptan `page` (base 1, default `1`) y `pageSize` (default `20`, mínimo `1`, máximo `100`). Valores no enteros o fuera de rango reciben `400 VALIDATION_ERROR`. Respuesta:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

El total se calcula sobre el conjunto autorizado del actor; nunca revela conteos de recursos ajenos.

## Autenticación y autorización

Supabase Auth se encarga de inicio/cierre de sesión desde el cliente. El cliente conserva la credencial según la configuración elegida. En cada endpoint protegido, NestJS debe verificar credencial, rol y vínculo con estudiante/solicitud. Roles del MVP: `APODERADO`, `ADMINISTRADOR`. No hay endpoints de administración avanzada de cuentas/permisos.

## Perfil y estudiantes

### `GET /api/v1/users/me`

- **Objetivo/rol:** consultar el perfil propio; APODERADO o ADMINISTRADOR autenticado.
- **Parámetros/cuerpo:** ninguno. Identidad y rol se derivan del token validado, nunca de query/body.
- **Éxito:** `200 OK`; ejemplo: `{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","roles":["APODERADO"],"profile":{}}`.
- **Errores/validaciones:** `401` credencial inválida/expirada; no devolver secreto ni `auth_subject`.

### `PATCH /api/v1/users/me`

- **Objetivo/rol:** actualizar atributos permitidos del perfil propio; APODERADO o ADMINISTRADOR.
- **Parámetros:** ninguno. **DTO:** `profile` parcial; campos reales `PENDIENTE_CONFIRMACION`.
- **Ejemplo JSON:** `{"profile":{"campoPendienteConfirmacion":"valorDeEjemplo"}}`.
- **Éxito:** `200 OK`; ejemplo: `{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","roles":["APODERADO"],"profile":{"campoPendienteConfirmacion":"valorDeEjemplo"},"updatedAt":"2026-01-01T00:00:00.000Z"}`.
- **Errores/validaciones:** `400` campos/formato; `401`; `403` propiedad no editable. Rechazar cambios de rol, identidad Supabase o IDs de cuenta. Endpoint incluido por RF01/HU01; no es administración de cuentas.

### `GET /api/v1/students`

- **Objetivo/rol:** listar los estudiantes vinculados al APODERADO autenticado. La vista de trabajo del ADMINISTRADOR es la cola de solicitudes, no una lista global sin restricción.
- **Parámetros:** query `page`, `pageSize`; ambos opcionales con reglas de paginación. Filtros adicionales: no definidos.
- **Cuerpo:** ninguno.
- **Éxito:** `200 OK`.
- **Respuesta ejemplo:**

```json
{"items":[{"id":"11111111-1111-4111-8111-111111111111","data":{}}],"page":1,"pageSize":20,"totalItems":1,"totalPages":1}
```

- **Errores/validaciones:** `400` paginación inválida; `401` sesión no válida; `403` rol no admitido. `data` contiene solo campos aprobados, hoy `PENDIENTE_CONFIRMACION`.

### `POST /api/v1/students`

- **Objetivo/rol:** registrar estudiante y vínculo del usuario autenticado APODERADO.
- **Parámetros:** ninguno. **DTO de entrada:** objeto `data`; atributos institucionales pendientes.
- **Ejemplo JSON:**

```json
{"data":{"campoPendienteConfirmacion":"valorDeEjemplo"}}
```

- **Éxito:** `201 Created`; **DTO/ejemplo de salida:**

```json
{"id":"11111111-1111-4111-8111-111111111111","data":{"campoPendienteConfirmacion":"valorDeEjemplo"},"createdAt":"2026-01-01T00:00:00.000Z"}
```

- **Errores/validaciones:** `400` campos/formato; `401`; `403`; `409` duplicidad si la regla se confirma. Rechazar campos no permitidos al cerrar DTO. La propiedad de ejemplo no es un campo real aprobado.

### `GET /api/v1/students/{studentId}`

- **Objetivo/rol:** consultar estudiante; APODERADO vinculado. ADMINISTRADOR solo cuando el acceso está ligado a la revisión autorizada de una solicitud.
- **Parámetros:** path `studentId` UUID propuesto. **Cuerpo:** ninguno.
- **Éxito:** `200 OK`; ejemplo: `{"id":"11111111-1111-4111-8111-111111111111","data":{}}`.
- **Errores/validaciones:** `400` ID inválido; `401`; `403`/`404` según política anti-enumeración pendiente. Verificar vínculo en backend.

### `PATCH /api/v1/students/{studentId}`

- **Objetivo/rol:** actualizar campos permitidos; APODERADO vinculado. La edición administrativa no está incluida en el MVP documentado.
- **Parámetros:** path `studentId`; header `If-Match`/control de versión propuesto, por confirmar. DTO parcial `data`.
- **Ejemplo JSON:** `{"data":{"campoPendienteConfirmacion":"nuevoValorDeEjemplo"}}`.
- **Éxito:** `200 OK`; ejemplo: `{"id":"11111111-1111-4111-8111-111111111111","data":{"campoPendienteConfirmacion":"nuevoValorDeEjemplo"},"updatedAt":"2026-01-01T00:00:00.000Z"}`.
- **Errores/validaciones:** `400` campos inválidos; `401`; `403`/`404`; `409` versión conflictiva. Campos institucionales: `PENDIENTE_CONFIRMACION`.

## Vacantes

### `GET /api/v1/academic-catalog`

- **Objetivo/rol:** consultar periodos academicos y estructura de niveles, grados y secciones registradas. Endpoint de solo lectura y sin autenticacion en el MVP actual.
- **Parametros y cuerpo:** ninguno.
- **Exito:** `200 OK`.
- **Respuesta:** `{ "academicPeriods": [{ "id": "<uuid>", "academicYear": 2027 }], "educationLevels": [{ "id": "<uuid>", "code": "INICIAL", "displayName": "Inicial", "sortOrder": 1, "grades": [{ "id": "<uuid>", "displayName": "3 anos", "sortOrder": 1, "sections": [] }] }] }`. Incluye unicamente secciones registradas; la migracion inicial no crea secciones.
- **Errores/validaciones:** `500` error interno de consulta.

### `GET /api/v1/vacancies`

- **Objetivo/rol:** consultar disponibilidad; APODERADO y ADMINISTRADOR.
- **Parametros y cuerpo:** ninguno.
- **Exito:** `200 OK`; devuelve un arreglo, no un objeto `items`.
- **Respuesta:** cada elemento contiene `id`, `periodId`, `academicYear`, `educationLevelId`, `educationLevelName`, `gradeId`, `gradeName`, `sectionId`, `sectionName`, `capacity`, `occupiedCount`, `availableCount`, `hasAvailability`, `updatedAt` y los nombres obtenidos de relaciones persistidas.
- **Errores/validaciones:** `500` error interno de consulta. `availableCount` y `hasAvailability` son informativos y no autorizan una aprobacion.
### `POST /api/v1/vacancies`

- **Objetivo/rol:** crear capacidad de una oferta; cuenta con rol ADMINISTRADOR y permiso backend explícito para gestionar vacantes. El alcance individual requiere confirmación.
- **DTO de entrada:** `periodId`, `gradeId`, `sectionId`, `capacity`.
- **Ejemplo JSON:** `{"periodId":"33333333-3333-4333-8333-333333333333","gradeId":"44444444-4444-4444-8444-444444444444","sectionId":"55555555-5555-4555-8555-555555555555","capacity":30}`.
- **Éxito:** `201 Created`; ejemplo: `{"id":"22222222-2222-4222-8222-222222222222","capacity":30,"occupiedCount":0}`.
- **Errores/validaciones:** `400` UUID/capacidad inválidos o negativa; `401`; `403`; `404` referencias inexistentes; `409` oferta duplicada si se confirma unicidad periodo/sección. Catálogos: `PENDIENTE_CONFIRMACION`.

### `PATCH /api/v1/vacancies/{vacancyId}`

- **Objetivo/rol:** cambiar capacidad; cuenta con rol ADMINISTRADOR y permiso backend explícito para gestionar vacantes. El alcance individual requiere confirmación.
- **Parámetros:** path `vacancyId`; DTO `capacity` entero.
- **Ejemplo JSON:** `{"capacity":32}`.
- **Éxito:** `200 OK`; ejemplo: `{"id":"22222222-2222-4222-8222-222222222222","capacity":32,"occupiedCount":26}`.
- **Errores/validaciones:** `400` valor negativo/no entero; `401`; `403`; `404`; `409` si capacidad nueva queda bajo ocupación o existe conflicto. Regla operativa requiere confirmar política de reducción.

## Solicitudes de matrícula

### `POST /api/v1/enrollment-requests`

- **Objetivo/rol:** registrar solicitud; APODERADO vinculado.
- **DTO de entrada:** `studentId`, `vacancyId`; header `Idempotency-Key` obligatorio. No se envía `requirementSetId` ni la lista de requisitos. El caso de uso comprueba el vínculo vigente entre actor y estudiante, obtiene el periodo desde la oferta y resuelve el conjunto publicado correspondiente. La FK compuesta refuerza vínculo, periodo y conjunto. La fuente de la situación de matrícula y si se acepta una categoría candidata en el DTO quedan pendientes de confirmación; mientras tanto, el backend no confía en un valor arbitrario del cliente.
- **Ejemplo JSON:** `{"studentId":"11111111-1111-4111-8111-111111111111","vacancyId":"22222222-2222-4222-8222-222222222222"}`.
- **Éxito:** `201 Created`; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","studentId":"11111111-1111-4111-8111-111111111111","vacancyId":"22222222-2222-4222-8222-222222222222","periodId":"33333333-3333-4333-8333-333333333333","enrollmentTypeName":"Nombre configurado","requirementSet":{"id":"99999999-9999-4999-8999-999999999999","version":1},"status":"PENDIENTE","createdAt":"2026-01-01T00:00:00.000Z"}`.
- **Errores/validaciones:** `400` DTO/IDs/clave inválidos; `401`; `403` vínculo no autorizado; `404` estudiante/vacante; `409 IDEMPOTENCY_KEY_REUSED`, `IDEMPOTENCY_IN_PROGRESS`, `REQUIREMENT_SET_UNAVAILABLE` o conflicto de duplicidad según regla confirmada. Replay devuelve estado y cuerpo originales. Si no existe configuración aprobada aplicable, no se crea una solicitud sin requisitos. Crear solicitud no reserva ni aprueba cupo.

### `GET /api/v1/enrollment-requests`

- **Objetivo/rol:** consultar lista; APODERADO ve las propias/vinculadas, ADMINISTRADOR la cola según autorización.
- **Parámetros:** `page`, `pageSize`; filtros opcionales `status`, `studentId` (UUID). Status limitado al catálogo propuesto en SDD.
- **Cuerpo:** ninguno. **Éxito:** `200 OK`; ejemplo: `{"items":[{"id":"66666666-6666-4666-8666-666666666666","status":"PENDIENTE","studentId":"11111111-1111-4111-8111-111111111111"}],"page":1,"pageSize":20,"totalItems":1,"totalPages":1}`.
- **Errores/validaciones:** `400` filtro/paginación; `401`; `403`; los totales respetan alcance autorizado.

### `GET /api/v1/enrollment-requests/{requestId}`

- **Objetivo/rol:** consultar estado/detalle; apoderado vinculado o administrador.
- **Parámetros:** path `requestId` UUID propuesto. **Cuerpo:** ninguno.
- **Éxito:** `200 OK`; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","status":"EN_REVISION","studentId":"11111111-1111-4111-8111-111111111111","enrollmentTypeName":"Nombre configurado","requirementSet":{"id":"99999999-9999-4999-8999-999999999999","version":1},"requirements":[{"id":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","name":"Nombre configurado","required":true,"hasUpload":false}],"reviews":[]}`. `requirements` deriva de la versión fijada y `hasUpload` indica que existe un archivo asociado, no que fue aprobado.
- **Errores/validaciones:** `400` ID inválido; `401`; `403`/`404` según política anti-enumeración; solo devolver datos permitidos.

### `POST /api/v1/enrollment-requests/{requestId}/review`

- **Objetivo/rol:** iniciar y registrar una revisión humana, cambiando `PENDIENTE` a `EN_REVISION`; cuenta con rol ADMINISTRADOR y permiso backend explícito sobre la solicitud. Se incluye porque la máquina de estados exige una operación explícita; no amplía el alcance de RF09/HU08.
- **Parámetros:** path `requestId`; header `Idempotency-Key` obligatorio; sin cuerpo. Actor se obtiene de la credencial.
- **Éxito:** `200 OK`; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","status":"EN_REVISION","reviewId":"88888888-8888-4888-8888-888888888888"}`.
- **Errores/validaciones:** `400` ID/clave mal formados; `401`; `403`; `404`; `409` estado no es `PENDIENTE`, `IDEMPOTENCY_KEY_REUSED` o `IDEMPOTENCY_IN_PROGRESS`. Registrar actor y fecha. Un replay devuelve el mismo `200` y cuerpo originales.

### `POST /api/v1/enrollment-requests/{requestId}/documents`

- **Objetivo/rol:** adjuntar archivo a solicitud; apoderado vinculado, administrador según permiso.
- **Parámetros/DTO:** path `requestId`; header `Idempotency-Key` obligatorio; `multipart/form-data`, campo `file` (binario) y `requirementItemId` cuando el archivo se presenta para un requisito configurado. El backend verifica que el ítem pertenezca al conjunto fijado por la solicitud. Si se admiten adjuntos generales sin ítem, queda pendiente de confirmación. Nombre, tipo MIME y tamaño máximos: `PENDIENTE_CONFIRMACION`.
- **Ejemplo de respuesta JSON:** `{"id":"77777777-7777-4777-8777-777777777777","requestId":"66666666-6666-4666-8666-666666666666","requirementItemId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","version":1,"uploadedAt":"2026-01-01T00:00:00.000Z"}`. `requirementItemId` es `null` solo si se habilitan adjuntos generales.
- **Éxito:** `201 Created`.
- **Errores/validaciones:** `400` faltan campos/archivo/clave; `401`; `403`/`404`; `409` estado no permite adjuntar, `IDEMPOTENCY_KEY_REUSED` o `IDEMPOTENCY_IN_PROGRESS`; `413` excede límite; `415` tipo no permitido; `503` almacenamiento. Replay devuelve el `201` y cuerpo originales sin volver a cargar. En una falla recuperable, no se devuelve `201` ni queda metadato apuntando a un objeto ausente; los límites se activan al configurarse.

### `GET /api/v1/enrollment-requests/{requestId}/documents`

- **Objetivo/rol:** listar metadatos; apoderado vinculado o administrador.
- **Parámetros:** path `requestId`; sin cuerpo.
- **Éxito:** `200 OK`; ejemplo: `{"items":[{"id":"77777777-7777-4777-8777-777777777777","requirementItemId":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa","version":1,"uploadedAt":"2026-01-01T00:00:00.000Z"}]}`. No incluir `storage_key` ni URL pública.
- **Errores/validaciones:** `400`; `401`; `403`/`404`. No incluir `storage_key` ni URL pública.

### `GET /api/v1/enrollment-requests/{requestId}/documents/{documentId}`

- **Objetivo/rol:** recuperar archivo privado autorizado; apoderado vinculado o administrador.
- **Parámetros:** path `requestId`, `documentId`; sin cuerpo.
- **Éxito:** `200 OK`, stream binario con `Content-Type` y `Content-Disposition` seguros (tipo/nombre por definir), no JSON.
- **Errores/validaciones:** `400` IDs; `401`; `403`/`404`; `503` fallo de almacenamiento. Verificar que documento pertenezca a la solicitud.

### `POST /api/v1/enrollment-requests/{requestId}/observations`

- **Objetivo/rol:** registrar observación humana; cuenta con rol ADMINISTRADOR y permiso backend explícito sobre la solicitud.
- **Parámetros:** path `requestId`; header `Idempotency-Key` obligatorio. **DTO de entrada:** `comment` string no vacío; límites/plantilla y si hay campos estructurados son `PENDIENTE_CONFIRMACION`.
- **Ejemplo JSON:** `{"comment":"Se requiere una corrección indicada por el revisor."}`.
- **Éxito:** `200 OK`; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","status":"OBSERVADA","reviewId":"88888888-8888-4888-8888-888888888888"}`.
- **Errores/validaciones:** `400` comentario/clave inválidos; `401`; `403`; `404`; `409` estado no permite observar, `IDEMPOTENCY_KEY_REUSED` o `IDEMPOTENCY_IN_PROGRESS`. Replay devuelve respuesta original. Una observación es decisión humana, no IA.

### `POST /api/v1/enrollment-requests/{requestId}/decision`

- **Objetivo/rol:** aprobar o rechazar; cuenta con rol ADMINISTRADOR y permiso backend explícito sobre la solicitud.
- **Parámetros:** path `requestId`; header `Idempotency-Key` obligatorio. **DTO de entrada:** `decision` enum `APROBADA` o `RECHAZADA`; `reason` opcional/obligatorio según política pendiente.
- **Ejemplo JSON válido:** `{"decision":"RECHAZADA","reason":"Motivo por confirmar según política institucional."}`.
- **Éxito:** `200 OK`; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","status":"RECHAZADA","reviewId":"88888888-8888-4888-8888-888888888888"}`. Al aprobar, NestJS/PostgreSQL bloquea y revalida la solicitud y vacante dentro de una única transacción; solo si la actualización condicional consume capacidad se insertan matrícula, historial y estado `APROBADA`. Una comprobación previa fuera de esa transacción no autoriza la aprobación.
- **Errores/validaciones:** `400` enum/body/clave; `401`; `403`; `404`; `409` estado, falta de vacante, duplicidad, `IDEMPOTENCY_KEY_REUSED` o `IDEMPOTENCY_IN_PROGRESS`; `500` fallo inesperado sin datos internos. Replay devuelve la respuesta original. No reportar aprobación si la transacción falla; errores transitorios solo reintentan la operación completa.

### `POST /api/v1/enrollment-requests/{requestId}/resubmissions`

- **Objetivo/rol:** volver a presentar correcciones; APODERADO vinculado a solicitud `OBSERVADA`.
- **Parámetros:** path `requestId`; header `Idempotency-Key` obligatorio. **DTO de entrada:** `corrections` objeto con campos acordados y `documentIds` opcional; esquema de campos: `PENDIENTE_CONFIRMACION`.
- **Ejemplo JSON:** `{"corrections":{"campoPendienteConfirmacion":"valorActualizado"},"documentIds":["77777777-7777-4777-8777-777777777777"]}`.
- **Éxito:** `200 OK` inequívoco; ejemplo: `{"id":"66666666-6666-4666-8666-666666666666","status":"PENDIENTE","resubmittedAt":"2026-01-01T00:00:00.000Z"}`.
- **Errores/validaciones:** `400` corrección/IDs/clave; `401`; `403`; `404`; `409` estado distinto de `OBSERVADA`, documento ajeno o conflicto idempotente. Replay devuelve respuesta original. La nueva revisión administrativa ocurre por transición `PENDIENTE` → `EN_REVISION`.

## Validaciones transversales

- Validar DTOs de entrada en NestJS (tipo, presencia, límites y propiedades permitidas) y volver a verificar en dominio permisos, estado y reglas de negocio.
- No confiar en `role`, `roles`, `guardianUserId`, `occupiedCount` o propietario enviados por cliente; derivarlos de la identidad verificada y almacenamiento autorizado.
- Los campos, formatos, tamaños, comentarios, identificadores institucionales y política de duplicidad marcados como pendientes requieren decisión antes de cerrar OpenAPI.
- Fallos deben usar el esquema uniforme; nunca revelar tokens, stack traces, datos de otro estudiante ni claves de almacenamiento.
- Las respuestas de ejemplo no sustituyen al esquema OpenAPI. Al implementar NestJS, documentar DTOs, esquema Bearer, tipos, códigos y respuestas con Swagger y validar el documento generado. Swagger está implementado y disponible. La documentación OpenAPI se genera desde NestJS. La validación automatizada de todos los contratos y la correspondencia completa entre los ejemplos propuestos y los DTO implementados permanecen pendientes.
