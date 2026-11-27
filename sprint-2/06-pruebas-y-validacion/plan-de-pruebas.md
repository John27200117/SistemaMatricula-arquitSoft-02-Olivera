# Plan de pruebas y validación — Sprint 2

**Estado general:** PLANIFICADO Y PARCIALMENTE EJECUTADO.

El plan contempla la validación del MVP de matrícula. Se ejecutaron pruebas unitarias, verificaciones funcionales mediante Postman, pruebas preliminares de rendimiento sobre el endpoint de salud y una revisión visual de Swagger. Las pruebas de integración específicas, concurrencia y carga integral permanecen pendientes.

## 1. Alcance

Validar el MVP especificado: autenticación y roles, estudiantes, vacantes, solicitudes y documentos, revisión, resolución, consulta de estado e integridad concurrente.

La IA y las funciones de gestión académica son futuras y no se consideran implementaciones verificadas de Sprint 2.

## 2. Niveles y herramientas

| Nivel | Herramienta | Estado y cobertura |
|---|---|---|
| Unitario | Jest | EJECUTADO PARCIALMENTE. 7 suites y 32 pruebas aprobadas. Casos de uso de matrícula y endpoint de salud. |
| Integración | Jest y PostgreSQL de prueba | PENDIENTE. Faltan pruebas específicas de repositorios, restricciones y transacciones reales. |
| API | Postman | EJECUTADO. Verificaciones funcionales del flujo de matrícula y colección exportada. |
| Carga | k6 | EJECUTADO PARCIALMENTE. Pruebas preliminares de 5, 20 y 50 VUs sobre el endpoint de salud. La carga mixta hasta 2.000 VUs está pendiente. |
| Documentación API | Swagger/OpenAPI | VERIFICADO PARCIALMENTE. Documentación disponible y revisión visual realizada. Validación automatizada del contrato pendiente. |
| CI | GitHub Actions | PENDIENTE. No se ha verificado un flujo automatizado de integración continua. |

## 3. Escenarios principales

Los siguientes escenarios constituyen el plan de validación. Su inclusión no significa que todos hayan sido ejecutados.

1. Autenticación, consulta de vacantes, registro de estudiante y solicitud, adjunto de documentos y consulta de estado.
2. Intentos de consultar o modificar estudiantes y solicitudes ajenos, verificando la denegación de acceso.
3. Revisión administrativa, observación, subsanación y nueva revisión.
4. Rechazo de solicitudes y conservación del historial.
5. Aprobación de solicitudes con actualización consistente de la matrícula y la vacante.

