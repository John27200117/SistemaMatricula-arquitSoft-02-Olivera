# SDD — Sprint 2

## Objetivo

Especificar un MVP funcional del proceso de matrícula antes de implementar. El MVP cubre autenticación y acceso por roles, gestión básica de estudiantes, consulta/gestión de vacantes, solicitudes y documentos, revisión administrativa, resolución y consulta de estado.

La institución es un caso de estudio académico. No se han validado con el colegio requisitos documentales, criterios de admisión, estados institucionales, calendario, campos obligatorios ni políticas de retención. Esos datos permanecen por confirmar y no se presuponen en estas especificaciones.

## Actores

- **APODERADO:** usuario autenticado que gestiona sus datos, estudiantes vinculados, vacantes y solicitudes asociadas.
- **ADMINISTRADOR:** usuario autenticado autorizado para revisar/resolver solicitudes y realizar las operaciones administrativas incluidas en el MVP.

`APODERADO` y `ADMINISTRADOR` son una propuesta mínima de roles para el MVP, no una estructura institucional confirmada ni una lista cerrada. El modelo permite incorporar más roles por catálogo/asignación y políticas de backend. El administrador no tendrá en Sprint 2 una interfaz avanzada para crear usuarios, definir permisos o administrar roles. Estudiante, docente y dirección conservan sus requisitos de alcance general, pero sus funciones académicas no forman parte del MVP descrito aquí.

## Clasificación y trazabilidad de requisitos

| Identificador original | Clasificación | Alcance en Sprint 2 |
|---|---|---|
| RF01 | SPRINT_2 | Consulta/actualización del perfil propio del apoderado y registro/consulta/actualización de estudiantes; atributos y vínculo por confirmar. |
| RF02 | SPRINT_2 | Consulta de vacantes por grado/sección; calendario y criterios de publicación por confirmar. |
| RF03 | SPRINT_2 | Registro de solicitud vinculada a estudiante y periodo. |
| RF04 | SPRINT_2 | Adjuntar y consultar documentos asociados a una configuración versionada de requisitos; categorías, documentos, obligatoriedad, formatos y tamaños oficiales por confirmar. |
| RF05 | SPRINT_2 | Consulta de estado de solicitud. |
| RF06 | FUTURO | Notificaciones no forman parte del alcance funcional confirmado. |
| RF07 | SPRINT_2 | Subsanación de información/documentos observados e historial necesario para continuar el trámite. |
| RF08 | FUTURO | Generación/descarga de constancia fuera del alcance confirmado del MVP. |
| RF09 | SPRINT_2 | Revisión administrativa humana de solicitudes y documentos (HU08). |
| RF10 | FUTURO | Revisión asistida por IA; no se implementa en Sprint 2 y corresponde a HU07. |
| RF11 | SPRINT_2 | Registrar observación y solicitar corrección; contenido de políticas por confirmar. |
| RF12 | SPRINT_2 | Decisión administrativa de aprobar o rechazar; la observación se especifica con RF11. |
| RF13 | SPRINT_2 | Verificación transaccional de vacante real y prevención de duplicidad antes de aprobar. Las reglas institucionales restantes están pendientes. |
| RF14 | SPRINT_2 | Gestión de vacantes por grado/sección en el límite necesario para el MVP; periodos y demás campos por confirmar. |
| RF15–RF22 | FUTURO | Cursos, docentes, asignaciones, asistencia, calificaciones e informes académicos fuera del flujo MVP. |
| RF23 | PENDIENTE_CONFIRMACION | La administración avanzada de cuentas, roles y permisos excede el MVP. APODERADO y ADMINISTRADOR son roles iniciales propuestos y extensibles, no estructura institucional confirmada. RF23 se conserva sin eliminarse. |
| RF24 | SPRINT_2 | Autenticación con Supabase Auth propuesta y autorización en NestJS por los dos roles iniciales y el vínculo apoderado-estudiante. |
| RF25 | PENDIENTE_CONFIRMACION | Parámetros generales; solo se decidirá si son necesarios para operar el MVP. |
| RF26 | FUTURO | Asistente virtual; no se implementa en Sprint 2. |

La clasificación no borra ni reemplaza los requisitos originales. Debe actualizarse con una decisión trazable si cambia el alcance. Requisitos documentales y criterios institucionales no se deducen de RF04 ni de la lista de funcionalidades.

## Trazabilidad de historias vinculadas al MVP

| Historia | Clasificación/alcance | Requisito y especificación |
|---|---|---|
| HU01 | SPRINT_2 | RF01; SDD-F02 — estudiante, campos por confirmar. |
| HU02 | SPRINT_2 | RF02; SDD-F03 — consulta de vacantes. |
| HU03 | SPRINT_2 | RF03–RF04; SDD-F04 — solicitud y adjuntos. |
| HU04 | Parcial SPRINT_2 | RF05 — consulta de estado (SDD-F04); notificaciones de RF06 quedan FUTURO. |
| HU05 | SPRINT_2 | RF07; SDD-F04 — subsanación. |
| HU06 | FUTURO | RF08 — constancia. |
| HU07 | FUTURO | RF10 — asistencia de IA. No se traza a revisión humana. |
| HU08 | SPRINT_2 | RF09, RF11–RF13; SDD-F05 — revisión y decisión humana. |
| HU09 | Parcial SPRINT_2 | RF14 — vacantes necesarias para MVP (SDD-F03); gestión completa de periodos/estructura `PENDIENTE_CONFIRMACION`. |
| HU17 | Parcial SPRINT_2 | RF24 — autenticación y control de acceso (SDD-F01). La administración avanzada de cuentas/roles de RF23 queda `PENDIENTE_CONFIRMACION`. |

Las demás historias (HU10–HU16, HU18–HU19) mantienen sus requisitos originales y no forman parte del MVP: gestión/consulta académica, parámetros generales y asistente virtual quedan futuros o pendientes según RF15–RF22, RF25 y RF26.

## Enlaces de especificación

- [Autenticación y control de acceso](funcionalidades/01-autenticacion-y-acceso.md)
- [Estudiantes](funcionalidades/02-estudiantes.md)
- [Vacantes](funcionalidades/03-vacantes.md)
- [Solicitudes, documentos y subsanación](funcionalidades/04-solicitudes-y-documentos.md)
- [Revisión y resolución administrativa](funcionalidades/05-revision-y-resolucion.md)
- [Modelo de datos](modelo-de-datos.md)
- [Contratos REST, preparados para OpenAPI](contratos-api.md)
- [Interfaces y navegación](interfaces-y-navegacion.md)

## Decisiones tecnológicas previstas

El stack de trabajo establecido para planificar el sprint es React, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, React Hook Form, Zod; Node.js LTS, NestJS, TypeScript y Clean Architecture en monolito modular; PostgreSQL alojado en Supabase y Prisma; NestJS Cache Manager con caché inicial en memoria. Jest, Postman, k6 y GitHub Actions se usarán para validar cuando la implementación exista. Estas son decisiones previstas, no evidencia de instalación o ejecución.

## Evolución arquitectónica desde Sprint 1

Los documentos de Sprint 1 se conservan como línea base histórica: allí se registraba como pendiente seleccionar framework, proveedor relacional, caché y despliegue. Para orientar Sprint 2, las tecnologías de la primera columna concretan esa selección como dirección prevista. Esta evolución no reescribe ni contradice el estado histórico de Sprint 1.

| Estado para Sprint 2 | Decisiones |
|---|---|
| Dirección tecnológica adoptada para planificar el MVP; implementación pendiente | Frontend React + Vite + TypeScript; backend Node.js LTS + NestJS + TypeScript; API REST; monolito modular; Clean Architecture; PostgreSQL en Supabase mediante Prisma; caché inicial local con NestJS Cache Manager; autenticación propuesta con Supabase Auth y autorización en NestJS. |
| Herramientas previstas para validar una implementación | Jest, Postman, k6 y GitHub Actions. No están instaladas ni configuradas. |
| Decisiones de diseño para implementar | FK compuestas para correspondencia grado/sección, periodo/vacante/requisitos, apoderado/estudiante, solicitud/matrícula y documento/ítem de requisitos; catálogo extensible y conjunto de requisitos versionado, fijado por cada solicitud; unicidad matrícula por solicitud y estudiante/periodo; `IDEMPOTENCY_RECORD` común; aprobación por caso de uso y puerto transaccional de infraestructura. Detalles en [modelo de datos](modelo-de-datos.md), [contratos REST](contratos-api.md), [F04](funcionalidades/04-solicitudes-y-documentos.md) y [F05](funcionalidades/05-revision-y-resolucion.md). |
| Detalles técnicos/institucionales aún por confirmar/verificar | Vigencia del vínculo apoderado-estudiante; catálogo de situaciones, fuente y regla para determinarlas, documentos/obligatoriedad, vigencia intraperiodo y carga inicial de configuración; alcance de cada administrador y posible asignación de solicitudes; retención de idempotencia/documentos; esquema/migraciones, política Supabase Auth/provisionamiento, caché, almacenamiento, conexiones, observabilidad, despliegue y compatibilidad de bloqueos PostgreSQL con la versión Prisma. |

La compatibilidad de Supabase/backend con el requisito de despliegue Cloudflare de Sprint 1 **no está verificada**. No se declara despliegue, escalabilidad ni operación comprobados.

## Supuestos y pendientes

- 2.000 usuarios concurrentes es el objetivo confirmado de carga. No representa solicitudes simultáneas, peticiones por segundo ni peticiones acumuladas.
- Los tiempos de respuesta, duración de prueba, tasa de error aceptable y perfil de operaciones todavía requieren confirmación.
- Campos, documentos requeridos, política de admisión, ciclo de periodo, transición de estados, política de sesión y retención de documentos requieren definición. La propuesta de estados está en F05 y aún requiere validación institucional.
- IA y asistencia académica permanecen futuras, conservando RF10, RF15–RF22 y RF26 en la línea base de Sprint 1.
- La resolución backend y el vínculo inmutable de la versión de requisitos con cada solicitud forman parte del diseño del MVP. No hay endpoints de administración de categorías/conjuntos en Sprint 2; la interfaz/API mínima de configuración y publicación queda para sprint futuro. No se crean categorías ni documentos institucionales de ejemplo.
- `APODERADO` y `ADMINISTRADOR` son roles iniciales propuestos, no estructura institucional confirmada; la autorización siempre se comprueba en backend. El alcance administrativo individual y la consulta global de la cola siguen pendientes.
- Repetir una operación persistente con la misma clave, usuario, ámbito y cuerpo reproduce su respuesta; las claves con distinto cuerpo se rechazan. La retención no está definida.
- La aprobación debe completar cupo, matrícula, estado, historial e idempotencia atómicamente; el objetivo de 2.000 VUs continúa pendiente de demostración en una prueba real.
