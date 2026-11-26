# SDD-F01 — Inicio de sesión y control de acceso

**Trazabilidad:** RF24; HU17 (parcial). RF23 se conserva, pero su administración avanzada de cuentas/roles/permisos queda `PENDIENTE_CONFIRMACION`. **Clasificación:** SPRINT_2 para inicio de sesión y autorización básica. **Estado:** propuesto; implementación pendiente.

## Objetivo y alcance

Permitir el inicio de sesión mediante Supabase Auth y limitar operaciones mediante autorización en NestJS. `APODERADO` y `ADMINISTRADOR` son una propuesta mínima inicial para el MVP, no una estructura institucional confirmada. El modelo usa un catálogo de roles y asignaciones separadas para que otros roles puedan añadirse luego sin rediseñar cuentas ni arquitectura. Autenticación responde quién es el usuario; autorización determina qué operación y recurso puede usar. NestJS verifica credencial, rol y relación con el recurso en cada endpoint protegido. No se implementa gestión avanzada de roles/permisos en el MVP.

## Actores y precondiciones

- APODERADO y ADMINISTRADOR como roles iniciales propuestos, sujetos a validación institucional.
- Las cuentas/roles se provisionan por mecanismo operativo que queda por decidir; no hay interfaz de gestión administrativa avanzada.
- Para iniciar sesión, la identidad debe existir y estar habilitada en Supabase Auth conforme a configuración pendiente.
- Para consultar o modificar recursos, debe existir una identidad autenticada y contar con permiso sobre el recurso.

## Flujo principal

1. El cliente inicia sesión mediante Supabase Auth y obtiene la credencial de sesión según el mecanismo configurado.
2. El cliente envía la credencial al backend NestJS en cada endpoint protegido.
3. Un guard/autenticador NestJS valida firma/validez de la credencial Supabase y obtiene el sujeto autenticado.
4. El backend vincula de manera segura el sujeto autenticado (`auth_subject`) con la cuenta interna y obtiene sus asignaciones de rol desde almacenamiento confiable; ignora roles enviados por el cliente.
5. Una política/guard de autorización aplica los roles asignados y comprueba propiedad/vínculo del recurso. Para un apoderado, la consulta o modificación requiere que el estudiante/solicitud esté asociado a su cuenta.
6. El cierre de sesión se solicita a Supabase Auth desde el cliente; expiración/revocación y almacenamiento seguro requieren configuración.

## Flujos alternativos

- Credenciales inválidas: respuesta genérica de no autenticado, sin revelar si la cuenta existe.
- Cuenta deshabilitada o Supabase Auth no disponible: no se concede sesión; respuesta y recuperación técnica por definir.
- Usuario autenticado sin permiso o sin vínculo requerido: se deniega la operación y no se devuelve información protegida.
- Sesión vencida o inválida: se requiere autenticación de nuevo.

## Reglas de negocio

- El backend, no el frontend, es autoridad para autenticación/autorización.
- Ocultar botones o restringir pantallas no es control de acceso: NestJS verifica cada llamada, incluso si se invoca directamente fuera del frontend.
- La identidad autenticada se vincula a la cuenta interna mediante `auth_subject` único y asignaciones de rol de confianza; el cliente no puede elegir su cuenta o rol enviando IDs en el body.
- Un apoderado solo consulta o modifica estudiantes y solicitudes asociados a su cuenta. NestJS valida el vínculo en el backend en cada lectura y escritura.
- Al crear una solicitud, el caso de uso de aplicación comprueba que el actor autenticado tiene un vínculo vigente con ese estudiante; no basta con consultar por separado si existen la cuenta y el estudiante. La vigencia se evalúa en backend con la regla institucional que se confirme. La FK compuesta entre remitente/estudiante y `GUARDIAN_STUDENT` refuerza la asociación persistida, pero por sí sola no representa temporalidad mientras el modelo no tenga atributos de vigencia.
- `APODERADO` gestiona sus datos y solicitudes asociadas; el vínculo se valida en backend.
- `ADMINISTRADOR` es un rol inicial propuesto, pero no implica por sí solo que todas las cuentas administrativas tengan el mismo alcance. Revisar/resolver solicitudes o gestionar vacantes exige autorización backend explícita para esa operación y recurso; el alcance por cuenta sigue pendiente de confirmación institucional.
- Los nombres y cantidad de roles son provisionales. Añadir roles posteriormente debe hacerse en el catálogo y políticas de autorización sin codificar una lista exhaustiva en entidades, DTOs o lógica central.
- No se habilita administración avanzada de cuentas, roles o permisos (RF23 completo); provisionamiento inicial y permisos granulares quedan pendientes.
- Supabase Auth autentica; NestJS aplica autorización. Tener sesión válida no implica permiso para todo recurso.

## Criterios de aceptación

- Una identidad válida de Supabase Auth puede autenticarse; credenciales inválidas no habilitan acceso.
- Las operaciones sin autenticación se deniegan.
- Un apoderado no puede acceder a un estudiante no vinculado modificando identificadores enviados por el cliente.
- La credencial de una identidad no asociada a una cuenta interna válida no obtiene permisos del MVP.
- Agregar un nuevo código de rol al catálogo no requiere cambiar el modelo de usuario; sus permisos se habilitan solo mediante políticas backend explícitas.
- Un `APODERADO` no puede revisar/resolver solicitudes ni gestionar vacantes. Un `ADMINISTRADOR` solo puede realizar esas operaciones cuando el permiso correspondiente esté concedido y el recurso esté dentro de su alcance autorizado.
- Las respuestas de error no exponen credenciales, tokens o datos personales ajenos.

## Tareas técnicas

- Configurar Supabase Auth y decidir cliente/sesión y provisionamiento de las dos categorías de usuario.
- Implementar en NestJS verificación de credencial, guards de rol y validaciones de vínculo.
- Definir manejo y almacenamiento de secretos/configuración.
- Añadir pruebas unitarias, integración y API para casos permitidos y denegados, incluyendo intento de crear solicitud sin vínculo, con vínculo de otra cuenta y con vínculo no vigente cuando la regla institucional esté definida.

Ver [contratos REST](../contratos-api.md) y [plan de pruebas](../../06-pruebas-y-validacion/plan-de-pruebas.md).

**Bloqueos de aceptación:** confirmar mecanismo de provisionamiento, permisos administrativos incluidos en MVP, manejo de expiración/revocación y política de vínculo apoderado-estudiante. HU17/RF23 no quedan satisfechos en su alcance completo por esta especificación parcial.
