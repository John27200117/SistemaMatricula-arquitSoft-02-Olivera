# SDD-F02 — Registro, consulta y actualización de estudiantes

**Trazabilidad:** RF01; HU01. **Clasificación:** SPRINT_2. **Estado:** especificado; implementación pendiente.

## Objetivo y alcance

Permitir al apoderado consultar/actualizar su propio perfil y registrar, consultar y actualizar la información de estudiantes necesaria para presentar solicitudes. Los endpoints de perfil (`/users/me`) se incluyen únicamente para cubrir los datos propios de RF01; no permiten cambiar rol. Los campos obligatorios, validaciones de identidad y relación legal del apoderado no están definidos en los documentos; deberán confirmarse antes de implementarse.

## Actores y precondiciones

- Apoderado autenticado para crear/consultar/actualizar estudiantes vinculados.
- Apoderado autenticado para leer/actualizar solo su perfil.
- ADMINISTRADOR autenticado puede consultar datos de estudiante solo en el contexto de una solicitud autorizada.
- El usuario debe tener permiso sobre el estudiante. La cuenta puede registrar únicamente los vínculos autorizados por la política que se defina.

## Flujo principal

1. El apoderado consulta su perfil y actualiza los campos permitidos de sí mismo.
2. Abre su lista de estudiantes vinculados; el sistema devuelve solo los autorizados.
3. Registra los campos acordados; el backend valida formato y permisos.
4. El backend guarda el estudiante y vínculo según reglas confirmadas.
5. El apoderado consulta o actualiza un estudiante autorizado; el backend conserva los datos actualizados.

## Flujos alternativos

- Campo inválido: se indican los campos que deben corregirse, según esquema aprobado.
- Identificador no encontrado o no vinculado: operación denegada sin filtrar información privada.
- Conflicto de actualización: se informa que los datos cambiaron y se solicita recargar; control de versión por definir.

## Reglas de negocio

- No se inventa aquí un conjunto de datos personales requeridos ni una regla de identificación única.
- Cada lectura/escritura comprueba autorización en servidor.
- La solicitud de matrícula referencia un estudiante existente y autorizado.
- La conservación de historial y política de correcciones queda por confirmar.

## Criterios de aceptación

- Usuario autorizado registra y recupera estudiante.
- Usuario no vinculado no puede consultar/actualizarlo, aunque conozca su identificador.
- Datos que no cumplan el esquema confirmado no se persisten.
- Una solicitud se puede asociar al estudiante correcto sin confiar en la autorización declarada por el cliente.
- La actualización de perfil no permite cambiar identidad externa ni rol; campos del perfil aún requieren confirmación.

## Tareas técnicas

- Validar con el responsable del dominio los campos, reglas de unicidad y vínculo.
- Acordar los datos de perfil propio del apoderado y provisionamiento de cuentas Supabase Auth.
- Diseñar entidad/repositorio y DTOs de entrada/salida.
- Implementar autorización por propietario/rol, persistencia y errores consistentes.
- Cubrir reglas y permisos con pruebas Jest unitarias, integración y API.

Ver [modelo de datos](../modelo-de-datos.md) y [contratos REST](../contratos-api.md).
