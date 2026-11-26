# SDD-F04 — Solicitudes, documentos y subsanación

**Trazabilidad:** RF03, RF04, RF05, RF07; HU03–HU05. **Clasificación:** SPRINT_2. **Estado:** especificado; implementación pendiente.

## Objetivo y alcance

Permitir registrar y consultar solicitudes de matrícula de un estudiante autorizado, adjuntar/consultar documentos y actualizar la información observada. Cada solicitud se vincula con el conjunto versionado de requisitos que le aplica para su situación y periodo; no se determinan categorías oficiales, tipos de documento, formatos, tamaños, fechas, campos obligatorios ni reglas institucionales.

## Actores y precondiciones

- Apoderado autenticado y autorizado respecto del estudiante.
- El estudiante existe y se identifica el periodo/grado/sección de acuerdo con la configuración confirmada.
- Personal administrativo puede consultar solicitudes asignadas a su permiso.

## Flujo principal

1. El apoderado inicia una solicitud con `Idempotency-Key` para un estudiante autorizado.
2. NestJS vincula la identidad autenticada con la cuenta interna; el caso de uso comprueba que existe un vínculo vigente entre esa cuenta y el estudiante. No basta con verificar por separado la existencia de ambos.
3. El backend determina/valida la situación de matrícula usando la regla institucional confirmada y resuelve el conjunto publicado para esa situación y el periodo de la vacante. El cliente no envía `requirementSetId` ni decide la lista de documentos obligatorios.
4. En la misma unidad transaccional, el caso de uso fija en la solicitud el identificador inmutable de la versión aplicable y persiste el periodo para validar correspondencia con vacante y conjunto mediante restricciones compuestas. Una publicación concurrente se serializa con esta resolución: la solicitud conserva íntegra una sola versión.
5. El backend valida los campos contra el esquema aprobado, sin aprobar ni reservar vacante.
6. El apoderado adjunta documentos permitidos según la configuración de esa versión, cada carga con su propia `Idempotency-Key`; cuando se asocia un archivo a un requisito, el backend verifica que el ítem pertenezca al conjunto fijado en la solicitud.
7. El backend guarda archivos en almacenamiento privado y metadatos/referencias en PostgreSQL, coordinando ambos recursos con reclamación idempotente, confirmación de metadatos y compensación/reconciliación ante fallos.
8. La solicitud se registra con estado pendiente de revisión y queda consultable por el apoderado junto con los requisitos versionados aplicables.
9. Si se observa, el apoderado consulta la observación y presenta corrección/documento actualizado usando una nueva clave para esa operación. La solicitud conserva la versión de requisitos original; una nueva publicación nunca cambia retroactivamente requisitos ya fijados.

## Flujos alternativos

- Campo o archivo fuera de configuración: rechazar antes de asociarlo y devolver error validable.
- Falla al guardar archivo: no dejar una solicitud que referencie un archivo inexistente.
- Falla DB luego del guardado de archivo: ejecutar compensación/limpieza segura de archivo huérfano; operación recuperable.
- Reintento con misma clave, actor, ámbito y cuerpo: devolver resultado original sin repetir el efecto. Reutilizar clave y ámbito con un cuerpo distinto se rechaza con `409 IDEMPOTENCY_KEY_REUSED`; operación concurrente en procesamiento no se ejecuta por duplicado. La retención queda pendiente de decisión técnica.
- Documento no autorizado o solicitud ajena: denegar acceso sin revelar referencia privada.
- Subsanación fuera de estado permitido: rechazar según transiciones que se confirmen.
- No existe conjunto publicado para el tipo/periodo o el servidor no puede determinar/validar la situación: no crear la solicitud con requisitos vacíos; responder conflicto/configuración no disponible y solicitar resolución administrativa.
- Se publica una nueva versión mientras hay solicitudes en trámite: las solicitudes existentes conservan su referencia/version; solo nuevas solicitudes resuelven la versión vigente.

## Reglas de negocio

- Registrar solicitud no confirma matrícula ni reserva vacante.
- El almacenamiento es privado; no se devuelven rutas públicas permanentes.
- No se infieren documentos requeridos ni criterios de admisión.
- `ENROLLMENT_TYPE` es un catálogo extensible, no un enum en código. `REQUIREMENT_SET` fija tipo, periodo y versión; sus ítems contienen nombre/definición de documento y marca obligatoria/opcional. La versión publicada es inmutable; un cambio crea una nueva versión.
- Al presentar, el backend resuelve la versión publicada y la persiste en `ENROLLMENT_REQUEST`. El detalle de la solicitud deriva los requisitos de esa referencia histórica, de modo que las actualizaciones de configuración no alteran solicitudes anteriores.
- El origen de la clasificación del estudiante (derivación de datos confiables o categoría propuesta por usuario y validada) y los criterios de elegibilidad son `PENDIENTE_CONFIRMACION`. Ningún identificador de conjunto o lista de requisitos enviada por el frontend se acepta como autoridad.
- La aplicación de requisitos del MVP requiere filas de configuración aprobadas en base de datos. La administración CRUD/publicación por interfaz se deja para un sprint futuro; el mecanismo inicial controlado de carga/configuración y sus responsables aún deben acordarse. Sin configuración aplicable, el backend falla de forma cerrada y no presenta la solicitud.
- Se debe definir la estrategia para coordinar PostgreSQL y almacenamiento de objetos, ya que no necesariamente comparten transacción.
- La integridad de la asociación remitente/estudiante se refuerza con FK compuesta hacia `GUARDIAN_STUDENT`; el caso de uso valida adicionalmente la vigencia. La representación de vigencia depende de confirmación institucional y no se inventa un campo ahora.
- `IDEMPOTENCY_RECORD` es la fuente común para claves y respuestas reproducibles. Para cargas se registra la operación, se almacena el archivo privado con referencia determinista, se persisten metadatos y se completa la operación; ante fallo se compensa el objeto o se deja para reconciliación. No se devuelve éxito con un archivo ausente o metadatos huérfanos.
- IA queda fuera de este sprint; la revisión descrita es administrativa humana.

## Criterios de aceptación

- El apoderado crea y consulta solicitudes solo de estudiantes autorizados.
- La solicitud recién registrada queda pendiente de revisión y visible en el estado acordado.
- Cada solicitud conserva el tipo, periodo y versión del conjunto de requisitos que el backend resolvió al presentarla; el historial permite identificar cuáles documentos eran obligatorios/opcionales en esa versión.
- Una publicación posterior no cambia los requisitos asociados a solicitudes ya presentadas; nuevas solicitudes usan la única versión publicada aplicable al tipo/periodo.
- Cambios publicados de forma concurrente con una presentación no mezclan ítems de versiones diferentes; la solicitud se fija íntegramente a una versión.
- El backend rechaza un conjunto que no corresponda al periodo o situación validada y no confía en una selección de requisitos del cliente.
- Documentos se adjuntan y recuperan mediante autorización, sin acceso público permanente.
- Fallo de almacenamiento o base de datos no deja referencias inconsistentes sin mecanismo de recuperación documentado; ninguna respuesta de éxito precede a la consistencia entre objeto y metadatos.
- Repetir una operación con la misma clave y cuerpo reproduce su resultado; clave/ámbito con cuerpo diferente produce conflicto y no repite el efecto.
- La subsanación conserva la relación con la solicitud y permite revisión posterior.

## Tareas técnicas

- Confirmar cómo se determina la situación de matrícula y el catálogo/documentos/obligatoriedad oficiales; definir la carga inicial de configuración.
- Implementar tablas de tipos, conjuntos versionados e ítems; resolución backend y referencia inmutable en la solicitud.
- Confirmar esquema funcional, estados/transiciones, límites de archivo y retención.
- Implementar casos de uso y transacción de metadatos en NestJS/Prisma.
- Configurar almacenamiento privado; proveedor pendiente de seleccionar.
- Implementar la tabla común de idempotencia, su huella/ámbito y replay para solicitudes, subsanaciones y cargas; coordinar almacenamiento privado con compensación/reconciliación.
- Probar autorización, carga, descarga autorizada, errores y subsanación.

## Alcance de configuración

**Sprint 2:** modelo extensible, validación/resolución en backend, asociación de cada solicitud con una versión publicada y lectura de requisitos desde esa versión. Se requiere disponer de configuración inicial aprobada para habilitar el alta; no se inventan filas de categorías ni documentos.

**Sprint futuro:** interfaz/API administrativa mínima para dar de alta/desactivar situaciones, preparar borradores de conjuntos, agregar/editar ítems obligatorios u opcionales y publicar versiones por periodo. La publicación no edita versiones ya referenciadas. No se propone en este sprint un motor de reglas, asignación avanzada de aprobadores ni permisos granulares nuevos; la autorización seguirá el modelo del MVP y el alcance administrativo pendiente.

## Responsabilidades según Clean Architecture

El caso de uso de aplicación `RegistrarSolicitudUseCase` obtiene del actor y de datos confiables la situación validada y solicita al puerto de aplicación `RequirementConfigurationRepository` la versión publicada para esa situación/periodo. El caso de uso fija `requirement_set_id` en la solicitud y valida que la referencia coincida con periodo y vacante. Infraestructura implementa el puerto de lectura con Prisma/PostgreSQL y aplica las restricciones relacionales descritas en el modelo. El controlador traduce HTTP y no selecciona requisitos; el dominio recibe la versión ya resuelta y no consulta SQL ni proveedores externos. Los casos de uso para editar/publicar configuración solo se añadirían cuando se apruebe el alcance administrativo futuro.

Ver [contratos REST](../contratos-api.md) y [interfaces](../interfaces-y-navegacion.md).
