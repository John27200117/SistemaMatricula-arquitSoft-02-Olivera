# Pruebas unitarias e integración — Jest

**Estado general:** EJECUTADO PARCIALMENTE.

Se cuenta con una suite de pruebas Jest configurada y ejecutada satisfactoriamente. Las pruebas actuales verifican principalmente reglas de negocio de los casos de uso del módulo de matrícula.

## 1. Pruebas unitarias ejecutadas

**Herramienta:** Jest  
**Fecha de ejecucion:** 27/11/2026

| Archivo de prueba | Resultado |
|---|---|
| `approve-enrollment-request.use-case.spec.ts` | APROBADO |
| `create-enrollment-request.use-case.spec.ts` | APROBADO |
| `resubmit-enrollment-request.use-case.spec.ts` | APROBADO |
| `observe-enrollment-request.use-case.spec.ts` | APROBADO |
| `reject-enrollment-request.use-case.spec.ts` | APROBADO |
| `start-review.use-case.spec.ts` | APROBADO |
| `health.e2e-spec.ts` | APROBADO |
| `get-academic-catalog.use-case.spec.ts` | APROBADO |
| `prisma-enrollment-catalog.repository.spec.ts` | APROBADO |

**Resultado de ejecución:**

- Suites aprobadas: 9 de 9.
- Pruebas aprobadas: 34 de 34.
- Pruebas fallidas: 0.
- Tiempo de ejecucion: 3.84 segundos.
- Comando utilizado: `npm.cmd test -- --runInBand`.

Las pruebas de los casos de uso verifican comportamientos de la lógica de matrícula. La suite también incluye `health.e2e-spec.ts`, que verifica el endpoint de salud de la aplicación mediante una prueba de extremo a extremo (E2E).

Por tanto, las 9 suites aprobadas incluyen pruebas unitarias de los casos de uso y una prueba E2E del endpoint de salud.

## Cobertura agregada para catalogo academico

- El caso de uso devuelve los periodos y niveles/grados/secciones entregados por el puerto.
- El repositorio Prisma mapea nombres relacionados y el periodo academico de las vacantes.

## 2. Pruebas unitarias pendientes de ampliar

Se consideran actividades pendientes:

- Validación de comandos, DTO y traducción de errores.
- Autorización por rol y relación entre apoderado y estudiante.
- Cobertura específica de las reglas de transición de solicitudes.
- Verificación de duplicidad y disponibilidad de vacantes en escenarios adicionales.
- Pruebas de caché: hit, miss, expiración TTL, invalidación y fallback ante fallos.
- Adaptadores de documentos: errores y acceso denegado.
- Pruebas específicas de autenticación y autorización con Supabase.

Se deben utilizar repositorios o puertos falsos/en memoria cuando corresponda. Estas pruebas no deben presentarse como evidencia de transacciones reales de PostgreSQL.

## 3. Pruebas de integración pendientes

- Conexión de Prisma a PostgreSQL de prueba y verificación de claves foráneas, restricciones únicas e índices relevantes.
- Transacción de aprobación completa y rollback ante falta de vacantes, duplicidad o errores.
- Prueba concurrente sobre la última vacante, verificando que la capacidad nunca se supere.
- Integración de carga de documentos con un proveedor de almacenamiento de prueba y compensación ante fallos.
- Verificación de invalidación de caché después de cambios en vacantes o configuración.

## 4. Cobertura y CI

La medición de cobertura por archivo y módulo está **PENDIENTE**. No se ha establecido un umbral mínimo aprobado.

También queda pendiente configurar o verificar un flujo de GitHub Actions que ejecute las pruebas y publique los resultados como artefacto.

**Estado actual:** suite Jest ejecutada satisfactoriamente (9 suites y 34 pruebas aprobadas), pero cobertura y pruebas de integración completas todavía pendientes.