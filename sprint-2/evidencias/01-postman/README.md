# Evidencias de pruebas API — Postman

**Estado:** PRUEBAS FUNCIONALES EJECUTADAS Y COLECCIÓN EXPORTADA.

Se realizaron verificaciones funcionales de los endpoints REST del módulo de matrícula utilizando Postman.

## 1. Endpoints verificados funcionalmente

- `GET /api/v1/enrollment-types`: consulta de tipos de matrícula.
- `GET /api/v1/vacancies`: consulta de vacantes.
- `POST /api/v1/enrollment-requests`: creación de solicitudes.
- `GET /api/v1/enrollment-requests`: consulta de solicitudes.
- `GET /api/v1/enrollment-requests/:id`: consulta de una solicitud específica.
- `POST /api/v1/enrollment-requests/:id/start-review`: inicio de revisión.
- `POST /api/v1/enrollment-requests/:id/observe`: observación de solicitud.
- `POST /api/v1/enrollment-requests/:id/resubmit`: subsanación y reenvío.
- `POST /api/v1/enrollment-requests/:id/approve`: aprobación de solicitud.
- `POST /api/v1/enrollment-requests/:id/reject`: rechazo de solicitud.

## 2. Escenarios funcionales verificados

- Creación de una solicitud de matrícula.
- Inicio de revisión.
- Observación y subsanación.
- Aprobación y registro de matrícula.
- Actualización de vacantes ocupadas después de una aprobación.
- Rechazo de una solicitud.
- Rechazo ante una solicitud duplicada.

## 3. Colección exportada

Se generó una colección de Postman a partir de la especificación OpenAPI del backend.

Archivo: `SistemaMatricula-Postman-Collection.json`.

La colección exportada contiene 11 solicitudes organizadas en 12 carpetas.

**Importante:** la exportación conserva la estructura de las solicitudes, pero no representa por sí sola una nueva ejecución de todos los endpoints.

## 4. Consideraciones y pendientes

Las verificaciones funcionales corresponden a pruebas manuales. No deben confundirse con pruebas automatizadas de contrato, pruebas de carga o pruebas concurrentes.

La autenticación integral con usuarios reales de Supabase y la autorización por roles siguen pendientes de validación de extremo a extremo.

## 5. Evidencias

- `SistemaMatricula-Postman-Collection.json`: colección exportada en formato Postman Collection v2.1.

**Conclusión:** Se realizaron verificaciones funcionales del flujo de matrícula y se conservó la colección de solicitudes de la API para su reutilización. Las pruebas automatizadas de contrato y otros escenarios de integración siguen pendientes.