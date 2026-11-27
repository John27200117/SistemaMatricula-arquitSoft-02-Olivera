# Evidencias Swagger/OpenAPI

**Estado:** IMPLEMENTADO Y VERIFICADO VISUALMENTE.

La API REST del sistema cuenta con documentación interactiva generada mediante Swagger/OpenAPI desde NestJS.

## 1. Acceso a Swagger

URL local:

`http://localhost:3000/api/docs`

La documentación permite visualizar los endpoints disponibles, sus métodos HTTP y sus rutas.

## 2. Autenticación

Se configuró el esquema de autenticación Bearer en Swagger mediante `addBearerAuth()`.

Se verificó visualmente:

- La disponibilidad del botón **Authorize**.
- La identificación de los endpoints protegidos mediante candados.
- La documentación de autenticación en las operaciones protegidas del módulo de matrícula.

La configuración documenta el envío de un token Bearer. Esto no significa que el inicio de sesión ni la autenticación integral con usuarios reales de Supabase hayan sido validados de extremo a extremo.

## 3. Endpoints documentados

Se encuentran documentadas las operaciones principales del módulo de matrícula:

- Consulta de tipos de matrícula.
- Consulta de vacantes.
- Creación y consulta de solicitudes.
- Inicio de revisión.
- Observación y subsanación.
- Aprobación y rechazo de solicitudes.

## 4. Evidencias

- URL de acceso: `http://localhost:3000/api/docs`.
- Configuración de autenticación Bearer en `src/bootstrap.ts`.
- Documentación de endpoints mediante decoradores Swagger en el controlador de matrícula.

Se recomienda conservar capturas de pantalla de la interfaz Swagger, incluyendo la lista de endpoints y el botón Authorize.

## 5. Pendientes

- Exportar y conservar el documento OpenAPI generado.
- Realizar una validación automatizada del contrato.
- Verificar la autenticación y autorización de extremo a extremo con usuarios reales de Supabase.

**Conclusión:** Swagger está operativo y fue verificado visualmente. La validación automatizada del contrato y la autenticación integral siguen pendientes.