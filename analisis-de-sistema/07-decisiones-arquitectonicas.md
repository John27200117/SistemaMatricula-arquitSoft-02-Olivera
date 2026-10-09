# Decisiones arquitectónicas


| ID | Decisión arquitectónica | Driver relacionado | Justificación | Resultado |
|---|---|---|---|---|
| ADR-001 | Monolito modular | DA01 – Concurrencia y escalabilidad; DA08 – Mantenibilidad | Organizar las funcionalidades en módulos dentro de una misma aplicación desplegable, facilitando su evolución y el aumento de capacidad del backend. | Módulos de Usuarios, Estudiantes, Matrícula, Validación Documental, Gestión Académica y Reportes. |
| ADR-002 | Clean Architecture | DA08 – Mantenibilidad | Separar las reglas de matrícula de la interfaz, la base de datos y los servicios externos. | Capas de Dominio, Aplicación, Infraestructura y Presentación, con dependencias hacia el núcleo del negocio. |
| ADR-003 | Estrategia de caché | DA01 – Concurrencia y escalabilidad | Reducir consultas repetitivas durante el periodo de matrícula. | Caché para información de consulta frecuente, como grados, secciones y requisitos documentales. |
| ADR-004 | Integración de IA mediante interfaces y adaptadores | DA04 – Integración de IA y continuidad del trámite | Desacoplar la revisión documental del proveedor de IA y permitir la evaluación administrativa cuando el servicio falle. | Interfaz de revisión documental, adaptador del proveedor y manejo de tiempos de espera y fallos. |
| ADR-005 | Transacciones y control de concurrencia | DA02 – Integridad de matrículas y vacantes | Evitar matrículas duplicadas y que las confirmaciones simultáneas superen las vacantes disponibles. | Confirmación transaccional de matrícula, restricciones de unicidad y verificación de vacantes en la base de datos. |
| ADR-006 | Autenticación y autorización por rol y relación con el estudiante | DA03 – Protección de información | Restringir el acceso a datos personales, documentos y registros académicos según los permisos del usuario. | Controles de acceso en el backend para apoderados, personal autorizado y administradores. |
| ADR-007 | Gestión del flujo de matrícula mediante estados | DA05 – Matrícula completamente virtual | Coordinar solicitudes, documentos, observaciones y subsanaciones hasta la emisión de la constancia. | Estados de solicitud, transiciones controladas e historial del proceso. |
| ADR-008 | Monitoreo y recuperación ante fallos | DA06 – Disponibilidad | Detectar errores y reducir el impacto de fallos de servicios externos sobre las operaciones principales. | Registros de errores, comprobaciones de salud y procedimientos de recuperación. |
| ADR-009 | Organización en capas y comunicación mediante API REST | DA07 – Capas y API REST | Separar las responsabilidades de presentación, negocio y acceso a datos, definiendo contratos entre frontend y backend. | Aplicación web conectada al backend mediante API REST y responsabilidades internas organizadas con Clean Architecture. |
| ADR-010 | Despliegue compatible con Cloudflare | DA09 – Restricción de despliegue | Seleccionar tecnologías y distribuir los componentes considerando su compatibilidad con el entorno requerido. | Plan de despliegue del frontend, backend, base de datos y almacenamiento según las capacidades de los servicios seleccionados. |

## Consideraciones de las decisiones

- El monolito modular no garantiza por sí solo atender 2000 usuarios
  concurrentes. Esta capacidad deberá comprobarse mediante pruebas
  de carga.

- La confirmación de una matrícula consultará y actualizará las
  vacantes en la base de datos dentro de una transacción, sin depender
  de valores almacenados en caché.

- La IA asistirá en la revisión documental. El personal autorizado
  conservará la decisión final y podrá continuar el trámite cuando
  el proveedor no esté disponible.

- Clean Architecture desarrollará la separación inicial en capas,
  distinguiendo las reglas del Dominio, los casos de uso de Aplicación
  y los adaptadores de Presentación e Infraestructura.

- Los servicios concretos de despliegue se definirán después de
  verificar su compatibilidad con Cloudflare.