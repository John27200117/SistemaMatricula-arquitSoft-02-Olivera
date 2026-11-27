## Tecnologías y herramientas del Sprint 2

El Sprint 2 cuenta con una implementación inicial del backend y una estructura de persistencia para el proceso de matrícula.

**Backend implementado:**
- Node.js y TypeScript.
- NestJS como framework backend.
- Arquitectura de monolito modular y organización basada en Clean Architecture.
- API REST con documentación interactiva Swagger/OpenAPI.
- Prisma ORM 7.10.1.
- PostgreSQL alojado en Supabase.
- Supabase Auth configurado para la verificación de tokens y autorización por roles en el backend.

**Persistencia implementada:**
- Modelos de datos definidos mediante Prisma.
- Migraciones previas aplicadas en PostgreSQL. La migracion local del catalogo academico se genero y reviso, pero no se aplico.
- Servicio de conexión a la base de datos integrado en NestJS.

**Pruebas y validación:**
- Jest para pruebas unitarias y e2e.
- Postman para verificaciones funcionales de endpoints.
- k6 para pruebas preliminares de rendimiento.
- Git y GitHub para control de versiones.

**Frontend:**
React, Vite, TypeScript y Tailwind CSS están implementados en la interfaz inicial; el frontend consume el catálogo académico y las vacantes desde la API. Los flujos restantes y su validación funcional siguen pendientes.

**Pendientes técnicos:**
- Verificación integral de autenticación con usuarios reales de Supabase.
- Implementación y validación de la estrategia de caché.
- Pruebas de integración específicas con PostgreSQL.
- Pruebas de carga representativas hasta el objetivo de 2.000 usuarios concurrentes.
- Configuración y verificación de integración continua mediante GitHub Actions.

Las tecnologías enumeradas como implementadas corresponden al estado del proyecto al 27/11/2026. Su mención no implica que todas las funcionalidades previstas estén terminadas ni validadas.

## Evolución arquitectónica desde Sprint 1

Los documentos de Sprint 1 se conservan como línea base histórica del proyecto. En esa etapa se encontraban pendientes varias decisiones tecnológicas y de implementación.

Durante Sprint 2 se concretó la dirección tecnológica y se implementó una primera versión funcional del backend del sistema de matrícula.

| Área | Estado al cierre de la revisión de Sprint 2 |
|---|---|
| Arquitectura | Cliente-servidor, monolito modular y organización basada en Clean Architecture. |
| Backend | Implementado con NestJS, Node.js y TypeScript. |
| API REST | Endpoints del módulo de matrícula implementados y documentados mediante Swagger. |
| Base de datos | PostgreSQL en Supabase, gestionado mediante Prisma ORM. Migraciones aplicadas. |
| Autenticación | Integración con Supabase Auth configurada en el backend. Validación integral con usuarios reales pendiente. |
| Autorización | Guards y control de acceso por roles implementados en NestJS. Validación integral pendiente. |
| Frontend | Interfaz inicial con React, Vite, TypeScript y Tailwind CSS; consulta catálogo académico y vacantes mediante la API. Flujos restantes pendientes. |
| Pruebas unitarias | Jest configurado y ejecutado: 9 suites y 34 pruebas aprobadas. |
| Pruebas funcionales | Verificaciones del flujo de matrícula mediante Postman. |
| Rendimiento | Pruebas preliminares con k6 sobre el endpoint de salud, con 5, 20 y 50 VUs. |
| Documentación API | Swagger operativo y verificado visualmente. |
| Caché | Estrategia documentada; implementación y validación pendientes de confirmar. |
| Integración continua | GitHub Actions pendiente de configuración y verificación. |
| Despliegue | No se declara despliegue de producción en Sprint 2. |

### Decisiones técnicas que orientan la implementación

- Mantener un backend organizado como monolito modular.
- Separar responsabilidades mediante Clean Architecture.
- Exponer las operaciones del sistema mediante una API REST.
- Utilizar PostgreSQL como base de datos relacional y Prisma como ORM.
- Mantener la autenticación mediante Supabase Auth y realizar la autorización desde el backend.
- Aplicar controles de integridad y transacciones en las operaciones críticas de matrícula.
- Mantener una estrategia de caché para las consultas que lo requieran, pendiente de implementación y validación.

### Aspectos técnicos pendientes de verificación

Continúan pendientes la implementación del frontend, la validación integral de autenticación con usuarios reales, las pruebas de integración específicas con PostgreSQL, la concurrencia sobre la última vacante, la estrategia de caché, la integración continua y las pruebas de carga representativas hasta el objetivo de 2.000 usuarios concurrentes.

Esta evolución representa el avance de implementación respecto de Sprint 1, sin modificar los documentos históricos ni afirmar que las funcionalidades pendientes ya están terminadas.

## Supuestos y pendientes

- **Capacidad:** el objetivo establecido es atender hasta 2.000 usuarios concurrentes. No representa 2.000 solicitudes simultáneas ni 2.000 peticiones por segundo. Su cumplimiento todavía no ha sido demostrado.
- **Rendimiento:** los tiempos de respuesta, duración de las pruebas, tasa de error aceptable y distribución de operaciones requieren definición y validación.
- **Reglas institucionales:** los campos obligatorios, documentos requeridos, políticas de admisión, calendario académico, transiciones definitivas de estados y políticas de retención deben confirmarse con la institución. No se presuponen reglas no verificadas.
- **Inteligencia artificial y gestión académica:** permanecen fuera del alcance funcional del Sprint 2. Se conservan los requisitos RF10, RF15–RF22 y RF26 para futuras etapas.
- **Gestión de requisitos:** el modelo contempla conjuntos de requisitos versionados y asociados a las solicitudes. No se implementaron endpoints de administración de categorías, conjuntos y publicación durante el Sprint 2.
- **Roles y autorización:** APODERADO y ADMINISTRADOR son roles iniciales propuestos, no una estructura institucional confirmada. La autorización se realiza en el backend. La validación integral con usuarios reales de Supabase y la definición del alcance administrativo individual siguen pendientes.
- **Autenticación:** el backend cuenta con integración configurada para verificar tokens de Supabase Auth. Falta completar y documentar la validación de extremo a extremo con usuarios reales y sus roles asociados en la base de datos.
- **Idempotencia:** el modelo contempla registros de idempotencia. La política completa de retención y su validación ante solicitudes concurrentes requieren pruebas adicionales.
- **Flujo de matrícula:** se implementaron operaciones para crear, consultar, revisar, observar, subsanar, aprobar y rechazar solicitudes. Se verificaron escenarios funcionales, pero las pruebas concurrentes y la integridad bajo carga siguen pendientes.
- **Aprobación:** la operación debe mantener la consistencia entre vacantes, matrícula, estado de solicitud, historial e idempotencia mediante una transacción. La validación específica de concurrencia sobre la última vacante todavía no se ha realizado.
- **Frontend:** interfaz inicial implementada; consulta el catalogo academico y las vacantes. Los demas flujos funcionales y su validacion movil siguen pendientes.
- **Caché y almacenamiento:** la estrategia de caché y la integración completa de almacenamiento de documentos requieren implementación o verificación adicional.
- **Despliegue y operación:** no se declara despliegue de producción ni capacidad operativa comprobada. La configuración de despliegue, observabilidad e integración continua permanece pendiente.

Estos puntos deben actualizarse cuando existan decisiones institucionales confirmadas o nuevas evidencias de implementación y pruebas.
