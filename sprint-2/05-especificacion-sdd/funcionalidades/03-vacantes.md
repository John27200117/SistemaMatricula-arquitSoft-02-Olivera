# SDD-F03 — Consulta y gestión de vacantes

**Trazabilidad:** RF02, RF13, RF14; HU02, HU08, HU09. **Clasificación:** SPRINT_2. **Estado:** especificado; implementación pendiente.

## Objetivo y alcance

Permitir consultar vacantes por grado y sección y permitir al personal autorizado registrar/actualizar su disponibilidad para operar el MVP. No se fijan capacidad, criterios de asignación, fechas ni estructura institucional; estos valores requieren confirmación.

## Actores y precondiciones

- Apoderado autenticado consulta vacantes publicadas.
- Personal administrativo autorizado gestiona vacantes.
- Una vacante corresponde a la estructura de grado/sección/periodo que se confirme.

## Flujo principal

1. El usuario solicita vacantes usando filtros disponibles.
2. El backend obtiene disponibilidad de la base de datos y responde con los campos públicos acordados.
3. El administrador actualiza la capacidad/disponibilidad mediante operación autorizada.
4. El sistema valida la operación y persiste el cambio.
5. La caché de consulta, si está habilitada, se invalida o queda sujeta a TTL; no interviene en la decisión final de matrícula.

## Flujos alternativos

- Grado/sección inexistente o no disponible: resultado vacío o error de validación según contrato acordado.
- Actualización por usuario sin permiso: denegación sin mutación.
- Error de caché: consulta a base de datos; un error de caché no cambia el valor autoritativo.
- Conflicto de concurrencia entre cambio de capacidad y aprobación: la aprobación vuelve a verificar la base de datos en transacción.

## Reglas de negocio

- La base de datos es fuente de verdad para disponibilidad.
- No se aprueba matrícula basándose en una cifra de caché.
- Un cambio de capacidad no puede dejar la matrícula confirmada por encima del valor permitido; tratamiento de reducciones por confirmar.
- Fechas, criterios y políticas de exposición de disponibilidad están pendientes.

## Criterios de aceptación

- Apoderado autorizado consulta disponibilidad por filtros válidos.
- Solo rol autorizado modifica datos de vacantes.
- Tras cambios, las consultas reflejan el valor actualizado dentro del TTL/invalidez configurados.
- La aprobación concurrente de última vacante no excede la capacidad ni duplica matrícula.

## Tareas técnicas

- Confirmar significado y esquema de grado, sección, periodo y capacidad.
- Diseñar restricciones de integridad e índices de búsqueda.
- Implementar caché de lectura en memoria con TTL configurable e invalidación tras cambios.
- Implementar aprobación transaccional contra PostgreSQL y probar concurrencia.

Ver [modelo de datos](../modelo-de-datos.md), [estrategia DB/caché](../../06-pruebas-y-validacion/analisis-base-datos-cache.md) y [pruebas de carga](../../06-pruebas-y-validacion/pruebas-de-carga.md).
