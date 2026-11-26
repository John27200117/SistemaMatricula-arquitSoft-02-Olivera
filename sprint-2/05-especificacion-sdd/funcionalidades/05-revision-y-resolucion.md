# SDD-F05 — Revisión y resolución administrativa

**Trazabilidad:** RF09, RF11, RF12, RF13; HU08. **Clasificación:** SPRINT_2 para revisión humana. HU07 y RF10 (asistencia de IA) FUTURO y fuera de esta especificación. **Estado:** propuesta; implementación pendiente.

## Objetivo y alcance

Permitir al personal autorizado revisar una solicitud y decidir aprobarla, observarla o rechazarla. Una aprobación bloquea/actualiza la solicitud y la vacante en PostgreSQL dentro de una única operación transaccional; la verificación de capacidad y su consumo son atómicos. Una consulta previa de disponibilidad no es suficiente para autorizarla. No se definen criterios de admisión ni documentos institucionales.

Esta especificación es exclusivamente de revisión humana. La asistencia automatizada de documentos (HU07/RF10) no participa en el flujo ni en las decisiones del Sprint 2.

## Actores y precondiciones

- Personal administrativo autenticado con permiso de resolución.
- En el MVP, el rol inicial autorizado es `ADMINISTRADOR`; permisos granulares futuros están fuera del alcance.
- Solicitud existente en estado compatible con la acción.
- Para aprobar, datos/documentos requeridos por la política institucional configurada y capacidad vigente verificable; la lista de requerimientos está pendiente de confirmación.

## Alcance mínimo de autorización administrativa

La tabla expresa capacidades candidatas del MVP, no una política institucional confirmada. NestJS verifica permiso en cada endpoint y alcance sobre la solicitud; ocultar controles del frontend no concede seguridad.

| Rol propuesto | Consultar estudiantes/solicitudes | Revisar, observar o resolver | Gestionar vacantes |
|---|---|---|---|
| `APODERADO` | Solo estudiantes vinculados y solicitudes asociadas | No | No |
| `ADMINISTRADOR` | Solicitudes necesarias para una tarea autorizada; acceso global a toda la cola pendiente de confirmación | Operaciones habilitadas explícitamente para el MVP; cuáles puede ejecutar cada rol siguen pendientes | Solo si el permiso administrativo correspondiente está asignado |

Queda `PENDIENTE_CONFIRMACION` si todo administrador puede consultar toda la cola, si existirán solicitudes asignadas a revisores específicos y qué operaciones administrativas tendrá cada rol. Sprint 2 no implementa asignaciones ni un motor avanzado de permisos; hasta cerrar la matriz, el backend aplica denegación por defecto a operaciones sin permiso explícito.

## Flujo principal

1. Personal autorizado consulta la cola/detalle de solicitudes.
2. Revisa datos y documentos manualmente.
3. Selecciona aprobar, observar o rechazar e ingresa la información de decisión que se confirme.
4. Para observar o rechazar, el backend valida transición/permisos y registra decisión e historial.
5. Para aprobar, el backend inicia transacción, bloquea y vuelve a leer la solicitud y la vacante en PostgreSQL, comprueba duplicidad, consume capacidad mediante actualización condicional y registra matrícula, decisión e historial atómicamente.
6. El sistema responde con el estado resultante y el identificador de operación.
7. Apoderado consulta el estado actualizado. Notificaciones automáticas quedan fuera del sprint.

## Contrato de aplicación y persistencia para aprobación

- El caso de uso de aplicación `AprobarSolicitudUseCase` recibe el identificador de solicitud, actor autenticado y comando con clave idempotente. Coordina autorización, solicita al dominio validar la transición y delega la operación indivisible al puerto de aplicación `AprobacionMatriculaTransaccional`.
- El puerto expresa la operación como una unidad: volver a leer/validar estado y datos de solicitud, validar capacidad vigente, consumir un cupo condicionalmente, crear matrícula, actualizar estado, insertar decisión/historial y completar el registro idempotente. Devuelve resultado tipado para éxito, conflicto de negocio o error técnico.
- Infraestructura implementa el puerto con Prisma y PostgreSQL. El adaptador encapsula `$transaction`, aislamiento configurado, bloqueos de filas, actualización condicional y traducción de errores. El caso de uso no depende de Prisma ni de SQL.
- Controladores solo validan/transfieren HTTP, identidad autenticada y DTO al caso de uso. No contienen SQL, bloqueos, llamadas directas a Prisma ni lógica de aprobación. Entidades de dominio expresan invariantes/transiciones y no acceden a base de datos, red ni proveedores. Repositorios ordinarios no deben partir la aprobación en escrituras independientes fuera de la unidad transaccional.
- En implementación se verificará cómo ejecutar los bloqueos PostgreSQL necesarios con la versión de Prisma seleccionada. SQL, orden de bloqueo, errores transitorios y límite/backoff quedan encapsulados en infraestructura. Cada reintento inicia la transacción completa y vuelve a leer el estado.

## Flujos alternativos

- Falta vacante, matrícula duplicada o conflicto concurrente: rollback; no confirmar ni consumir capacidad y reportar conflicto.
- Solicitud cambió desde la lectura: rechazar resolución obsoleta o pedir recarga, según control de versión acordado.
- Personal sin permiso o estado no elegible: denegación sin mutación.
- Observación: solicitud pasa al estado de corrección definido y queda disponible al apoderado.
- Rechazo: se registra como decisión humana con motivo/campos por confirmar.
- Falla de DB: operación atómica no se confirma; se devuelve error recuperable sin reportar éxito.

## Estados y transiciones propuestos

Los estados y reglas siguientes son una propuesta de diseño, no política oficial del colegio. Su aprobación institucional está `PENDIENTE_CONFIRMACION`.

| Estado | Significado propuesto |
|---|---|
| `PENDIENTE` | Solicitud presentada o subsanada y esperando revisión administrativa. |
| `EN_REVISION` | Administrador inició revisión humana. |
| `OBSERVADA` | Administrador solicita corrección o información; apoderado puede subsanar. |
| `APROBADA` | Decisión administrativa aprobada y matrícula/cupo confirmados atómicamente. |
| `RECHAZADA` | Decisión administrativa de rechazo registrada; motivo según política por confirmar. |

| Estado actual | Acción/actor | Estado siguiente | Condición |
|---|---|---|---|
| — | Presentar solicitud / apoderado | `PENDIENTE` | Autenticado, vínculo válido y datos aceptados por esquema aún por confirmar. |
| `PENDIENTE` | Iniciar revisión / administrador | `EN_REVISION` | Solicitud accesible y estado vigente. |
| `EN_REVISION` | Observar / administrador | `OBSERVADA` | Registrar comentario solicitado; campos obligatorios por confirmar. |
| `OBSERVADA` | Subsanar y volver a presentar / apoderado vinculado | `PENDIENTE` | Guardar actualización/documentos y registrar evento de subsanación. |
| `EN_REVISION` | Aprobar / administrador | `APROBADA` | Vacante real y unicidad confirmadas en transacción PostgreSQL. |
| `EN_REVISION` | Rechazar / administrador | `RECHAZADA` | Motivo y reglas de decisión por confirmar. |

`APROBADA` y `RECHAZADA` se proponen terminales; reapertura, cancelación, cambio de vacante y corrección después de aprobación no están definidos. Solo se cambia el estado tras confirmar el evento/persistencia asociado. Una subsanación vuelve a `PENDIENTE` para que un administrador inicie una revisión nueva; el historial conserva la observación anterior.

## Reglas de negocio

- La IA y la caché no deciden admisión ni vacantes.
- La disponibilidad de aprobación se verifica en la fuente transaccional, nunca con dato cacheado.
- No se aprueba usando una comprobación de vacante hecha antes de iniciar la transacción. La lectura protegida, condición de capacidad, incremento/consumo, matrícula, estado e historial forman una sola operación atómica.
- Prevención de sobrecupo y unicidad por estudiante/periodo deben hacerse cumplir en DB además de la lógica de aplicación.
- La observación es una resolución administrativa; aprobación/rechazo y sus motivos/campos deben ajustarse a política confirmada.
- Cada operación de escritura requiere clave idempotente; el mismo actor/ámbito/clave/huella reproduce el resultado original, una huella distinta produce conflicto y una operación en procesamiento no se ejecuta de nuevo. Los errores de negocio no generan reintentos automáticos; solo errores transitorios pueden provocar reintento de la transacción completa.
- Se requiere historial de decisión auditable; contenido y retención exactos por confirmar.

## Criterios de aceptación

- Personal autorizado puede observar/rechazar según permisos y estado permitido.
- Una aprobación exitosa registra decisión y matrícula/consumo de cupo atómicamente.
- Dos aprobaciones concurrentes para la última vacante no producen más matrículas que la capacidad.
- La segunda operación que espera el bloqueo revalida el valor actual de capacidad; no puede consumir la misma última vacante.
- No existe matrícula duplicada del estudiante en el mismo periodo.
- Falta de cupo, conflicto o error de DB no deja una aprobación parcial.
- Un interbloqueo o error de serialización, si ocurre, revierte el intento completo; un eventual reintento repite toda la transacción con datos recién leídos.
- Una repetición con la misma clave, actor, ámbito y huella no crea otra matrícula ni evento y devuelve el resultado original; clave y ámbito con otra huella se rechazan.
- El apoderado puede consultar el estado vigente de su solicitud.
- Las únicas transiciones aplicadas son las de la tabla; una transición no listada no cambia el estado.
- Una subsanación desde `OBSERVADA` vuelve a `PENDIENTE` y conserva la revisión/observación anterior.
- Ninguna recomendación de IA crea una observación ni aprueba/rechaza una solicitud en Sprint 2.

## Tareas técnicas

- Confirmar estados, transiciones, datos de auditoría y criterios de elegibilidad.
- Definir el contrato del puerto `AprobacionMatriculaTransaccional` y las salidas tipadas para éxito, conflicto de negocio y error técnico.
- Implementar en infraestructura el adaptador Prisma/PostgreSQL con restricciones únicas, orden de bloqueos y transacción atómica completa.
- Implementar `AprobarSolicitudUseCase` sin SQL ni dependencia de Prisma y concurrencia/idempotencia de resolución.
- Añadir pruebas unitarias, integración concurrente y contrato API de permisos y errores.

Ver [modelo de datos](../modelo-de-datos.md), [pruebas API](../../06-pruebas-y-validacion/pruebas-api.md) y [pruebas de carga](../../06-pruebas-y-validacion/pruebas-de-carga.md).

**Criterios bloqueados:** validar catálogo/transiciones con la institución, motivo obligatorio de rechazo, contenido de observaciones, reglas de elegibilidad y reapertura de decisiones terminales.
