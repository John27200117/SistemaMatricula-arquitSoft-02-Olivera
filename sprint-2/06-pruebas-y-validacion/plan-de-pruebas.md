# Plan de pruebas y validación — Sprint 2

**Estado general:** planificado; no hay código, pruebas ejecutadas ni evidencias todavía.

## Alcance

Validar el MVP especificado: sesión/roles, estudiantes, vacantes, solicitudes/documentos, revisión, resolución, consulta de estado e integridad concurrente. IA y funciones académicas son futuras y no se prueban como implementaciones de Sprint 2.

## Niveles y herramientas previstas

| Nivel | Herramienta prevista | Cobertura |
|---|---|---|
| Unitario | Jest | Entidades, casos de uso, validaciones, transiciones y autorización aislada mediante dobles. |
| Integración | Jest y entorno PostgreSQL de prueba | Repositorios Prisma, restricciones, transacción de aprobación, almacenamiento/adaptadores simulados. |
| API | Postman (colección versionada) | Contratos HTTP, códigos, permisos, entradas válidas/ inválidas y flujo de matrícula. |
| Carga | k6 | Fases progresivas hasta 2.000 VUs; mezcla de consultas y operaciones de matrícula. Capturar RPS, total de requests, p50/p95/p99, errores y métricas de backend, PostgreSQL y caché. |
| CI | GitHub Actions | Ejecución automatizada de lint/build/pruebas/cobertura una vez implementado el proyecto. |

## Escenarios principales

1. Apoderado autentica, consulta vacantes, registra estudiante y solicitud, adjunta documentos y consulta estado.
2. Apoderado intenta consultar o modificar estudiante/solicitud ajenos; se deniega sin filtrar datos.
3. Personal administrativo revisa y observa; apoderado subsana; personal revisa de nuevo.
4. Personal rechaza solicitud permitida y queda historial consistente.
5. Personal aprueba con vacante; matrícula y cupo quedan confirmados atómicamente.
6. Dos solicitudes compiten por el último cupo; no se excede capacidad ni se duplica estudiante/periodo.
7. DB o almacenamiento falla en registro/adjunto; no quedan referencias inconsistentes sin recuperación.
8. Caché expira, se invalida o falla; la consulta usa DB como fallback y aprobación siempre consulta DB.
9. Carga mixta de usuarios concurrentes: login, consulta vacantes, estudiantes, registrar solicitudes, estado y revisiones autorizadas.
10. El backend resuelve el conjunto publicado para situación/periodo, lo fija al presentar y devuelve sus requisitos; si no hay configuración aplicable, rechaza el alta sin solicitud parcial.
11. Tras publicar otra versión, las solicitudes previas conservan nombres/obligatoriedad originales y las nuevas fijan la versión vigente; se rechaza asociar a la solicitud un ítem de otro conjunto.
12. Repeticiones idempotentes devuelven la respuesta original; distinta huella con la misma clave produce conflicto; errores transitorios de persistencia no dejan solicitud/documento parcial y el reintento seguro no duplica efectos.

## Criterios y datos aún por acordar

- Los 2.000 usuarios son **usuarios virtuales concurrentes** simulando sesiones activas y operaciones; no son 2.000 matrículas simultáneas, RPS ni peticiones acumuladas.
- Perfil de operaciones, pausas/think time, duración, ramp-up, datos semilla, recursos del entorno y ventana de prueba están pendientes.
- Durante carga se deben recoger CPU/memoria y métricas por ruta del backend; conexiones/consultas de PostgreSQL; hits/misses/expiración/error y memoria de caché. Mecanismos candidatos están descritos en `pruebas-de-carga.md`; herramienta final de serie temporal y permisos de Supabase están pendientes.
- Para requisitos configurables se necesitan conjuntos de prueba sintéticos con varias situaciones/versiones/periodos, sin asumir nombres ni documentos reales del colegio; validar FK compuestas, publicación única por tipo/periodo y conservación de solicitudes históricas.
- Los SLO de latencia por percentil, RPS resultante esperado, porcentaje máximo de error y tiempos máximos no se fijan aquí. Los 3 s/5 s del documento previo son propuestas pendientes de aprobación, no objetivos validados ni resultados.
- La política de cobertura mínima debe aprobarse antes de usar un umbral de CI. No se afirma un porcentaje actual.
- Las pruebas de carga deben ejecutarse en entorno controlado, no contra producción ni con datos personales reales.

## Evidencias y estado

Guardar colecciones y reportes sin secretos en `../evidencias/01-postman`, `02-jest`, `03-k6` y `04-swagger`. Estado actual: **PENDIENTE / NO EJECUTADO** en todos los niveles.
