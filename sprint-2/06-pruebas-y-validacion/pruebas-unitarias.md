# Pruebas unitarias e integración — Jest

**Estado:** NO EJECUTADO; no existe aplicación ni configuración Jest en el repositorio.

## Unitarias propuestas

- Validación de comandos/DTO y traducción de errores.
- Autorización por rol y relación apoderado-estudiante.
- Reglas de transición de solicitud: pendiente, observada, subsanada, aprobada/rechazada (catálogo final por confirmar).
- Lógica de caso de uso de solicitud sin aprobación/reserva al crear.
- Aprobación delega verificación autoritativa al puerto de persistencia y maneja falta de vacante/duplicidad.
- Caché de lectura: hit, miss, TTL vencido, invalidación y fallback cuando el almacén falla.
- Adaptadores de documentos: errores y acceso denegado; sin IA en Sprint 2.

Usar repositorios/puertos falsos o en memoria en unitarias. No simular que esas pruebas acreditan transacciones reales de PostgreSQL.

## Integración propuestas

- Prisma conectado a PostgreSQL de prueba; verificar FK, restricciones únicas e índices relevantes.
- Transacción de aprobación completa y rollback por falta de cupo, duplicidad o error.
- Carrera concurrente sobre última vacante, con múltiples operaciones concurrentes contra DB; medir que la capacidad nunca se supera.
- Integración de carga de documentos con proveedor de almacenamiento de prueba y compensación ante fallos.
- Verificación de invalidación de caché después de cambios de vacantes/configuración.

## Cobertura y CI

Jest debe generar cobertura por archivo/módulo y publicarla como artefacto de CI. El umbral de cobertura es **PENDIENTE**: no hay porcentaje aprobado ni medición existente. GitHub Actions ejecutará pruebas una vez que aplicación y workflows estén implementados. Resultado actual: **sin suite, sin cobertura medida, NO EJECUTADO**.
