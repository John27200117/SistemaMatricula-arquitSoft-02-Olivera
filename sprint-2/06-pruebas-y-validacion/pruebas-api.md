# Pruebas de API — Sprint 2

**Estado general:** EJECUTADO PARCIALMENTE.

Se realizaron verificaciones funcionales mediante Postman sobre el flujo de matrícula. También se exportó una colección desde la documentación OpenAPI generada por Swagger. Sin embargo, no todos los endpoints ni escenarios de seguridad e integración han sido validados.

## 1. Herramientas y evidencias

- **Herramienta:** Postman.
- **Documentación API:** Swagger/OpenAPI.
- **Colección exportada:** `../evidencias/01-postman/SistemaMatricula-Postman-Collection.json`.
- **Formato:** Postman Collection v2.1.
- **Contenido exportado:** 11 solicitudes organizadas en 12 carpetas.

La exportación desde OpenAPI permite disponer de la estructura de solicitudes, pero no demuestra que todas hayan sido ejecutadas satisfactoriamente.

## 2. Endpoints disponibles

El backend expone los siguientes endpoints del módulo de matrícula:

| Método | Endpoint | Acceso documentado |
|---|---|---|
| GET | `/api/v1/enrollment-types` | Público |
| GET | `/api/v1/academic-catalog` | Publico |
| GET | `/api/v1/vacancies` | Público |
| POST | `/api/v1/enrollment-requests` | Protegido |
| GET | `/api/v1/enrollment-requests` | Protegido |
| GET | `/api/v1/enrollment-requests/:id` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/start-review` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/observe` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/resubmit` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/approve` | Protegido |
| POST | `/api/v1/enrollment-requests/:id/reject` | Protegido |

La protección de los endpoints se documenta mediante autenticación Bearer en Swagger. La validación integral con usuarios reales de Supabase permanece pendiente.

## 3. Verificaciones funcionales realizadas

Mediante Postman se verificaron las siguientes operaciones:

1. Creación de una solicitud de matrícula.
2. Inicio de revisión administrativa.
3. Observación de una solicitud.
4. Subsanación y reenvío de la solicitud.
5. Inicio de una nueva revisión.
6. Aprobación de una solicitud.
7. Incremento de la cantidad de vacantes ocupadas después de la aprobación.
8. Rechazo de otra solicitud.
9. Consulta del historial y estado de las solicitudes.
10. Rechazo de una solicitud duplicada según las reglas implementadas.

Estas verificaciones permitieron comprobar el flujo funcional principal del módulo de matrícula.

## 4. Escenarios pendientes de validación

### Autenticación y autorización

- Inicio de sesión con credenciales válidas e inválidas.
- Rechazo de tokens vencidos o inválidos.
- Validación de permisos con usuarios reales de Supabase.
- Verificación de acceso por rol y relación entre apoderado y estudiante.
- Intentos de acceso a solicitudes y estudiantes ajenos.

La integración de verificación de tokens está configurada en el backend, pero las pruebas de extremo a extremo con usuarios reales permanecen pendientes.

### Estudiantes y vacantes
- Consulta de `GET /api/v1/academic-catalog`: año académico, niveles, grados y secciones presentes; no se esperan secciones inventadas.
- Consulta de `GET /api/v1/vacancies`: respuesta de arreglo con año y nombres relacionados, junto a capacidad y disponibilidad.

- Operaciones CRUD de estudiantes y validaciones de sus relaciones.
- Verificacion de nombres y datos asociados devueltos por la consulta de vacantes; el endpoint actual no ofrece filtros.
- Actualización de vacantes y autorización correspondiente.
- Pruebas de expiración e invalidación de caché.

No se deben considerar implementadas operaciones que todavía no están disponibles en el backend.

### Solicitudes y documentos

- Validación de carga y almacenamiento de documentos.
- Asociación de documentos con los requisitos correspondientes.
- Validación de tipos y tamaños de archivos.
- Recuperación ante fallos del almacenamiento.
- Protección de documentos frente a accesos no autorizados.

### Revisión y resolución

- Transiciones no permitidas entre estados.
- Rechazo por rol insuficiente.
- Aprobación sin vacantes disponibles.
- Duplicidad y competencia concurrente por la última vacante.
- Verificación de idempotencia en solicitudes repetidas y escenarios concurrentes.

## 5. Aserciones y criterios de validación

Las pruebas posteriores deberán comprobar:

- Que los códigos HTTP y esquemas JSON coincidan con los contratos API aprobados.
- Que las respuestas no expongan información de estudiantes o documentos ajenos.
- Que una solicitud creada permanezca pendiente y no reserve una vacante antes de su aprobación.
- Que un conflicto o fallo de aprobación no deje actualizaciones parciales.
- Que las solicitudes duplicadas no produzcan efectos repetidos.
- Que los roles se obtengan de la identidad y autorización verificadas por el backend, no de valores enviados libremente por el cliente.
- Que la disponibilidad de vacantes utilizada para aprobar sea comprobada desde PostgreSQL dentro de la operación transaccional.

Los escenarios de idempotencia, documentos y concurrencia deben validarse mediante pruebas específicas antes de considerarse acreditados.

## 6. Datos de prueba y seguridad

Los datos utilizados en las verificaciones deben ser sintéticos y reiniciables.

No se deben incluir credenciales, tokens de acceso, claves privadas ni secretos en colecciones compartidas o evidencias.

La colección Postman y los resultados se conservan en `../evidencias/01-postman/`.

## 7. Conclusión

En Sprint 2 se verificó funcionalmente el flujo principal de matrícula mediante Postman y se exportó la colección de solicitudes desde OpenAPI.

La validación de autenticación con usuarios reales, permisos por rol, operaciones de estudiantes, almacenamiento de documentos, idempotencia y concurrencia todavía requiere pruebas específicas.

**Estado final:** PRUEBAS DE API EJECUTADAS PARCIALMENTE. La colección exportada constituye evidencia de la estructura de solicitudes, mientras que las verificaciones funcionales documentadas respaldan únicamente los escenarios efectivamente probados.