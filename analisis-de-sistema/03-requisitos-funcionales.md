# Requisitos funcionales

## 1. Requisitos del sistema

| ID | Requisito funcional |
|---|---|
| RF01 | El sistema debe permitir al apoderado registrar y actualizar sus datos y los del estudiante a su cargo. |
| RF02 | El sistema debe permitir consultar requisitos, fechas y vacantes de matrícula por grado y periodo académico. |
| RF03 | El sistema debe permitir registrar una solicitud de matrícula vinculada al estudiante y al periodo académico. |
| RF04 | El sistema debe permitir adjuntar y consultar los documentos requeridos para la solicitud de matrícula. |
| RF05 | El sistema debe permitir consultar el estado y el historial de una solicitud de matrícula. |
| RF06 | El sistema debe enviar notificaciones sobre observaciones, cambios de estado y confirmación de matrícula. |
| RF07 | El sistema debe permitir corregir los datos observados y presentar documentos de subsanación, conservando el historial de revisión. |
| RF08 | El sistema debe permitir generar y descargar una constancia cuando la matrícula esté confirmada. |
| RF09 | El sistema debe permitir al personal administrativo consultar y revisar las solicitudes y sus documentos. |
| RF10 | El sistema debe utilizar un servicio de IA para apoyar la revisión preliminar de documentos y mostrar las inconsistencias detectadas al personal administrativo. |
| RF11 | El sistema debe permitir registrar observaciones en una solicitud e indicar qué información debe corregirse. |
| RF12 | El sistema debe permitir al personal autorizado confirmar o rechazar solicitudes, registrando el responsable, la fecha y el motivo de la decisión. |
| RF13 | El sistema debe verificar los requisitos y la disponibilidad de vacantes antes de confirmar una matrícula, evitando superar el cupo o duplicar la matrícula del estudiante en el mismo periodo. |
| RF14 | El sistema debe permitir gestionar periodos académicos, fechas de matrícula, grados, secciones y sus vacantes. |
| RF15 | El sistema debe permitir registrar y actualizar cursos y datos de docentes. |
| RF16 | El sistema debe permitir asignar docentes a cursos y secciones de un periodo académico. |
| RF17 | El sistema debe permitir a cada docente consultar sus cursos, secciones y estudiantes asignados. |
| RF18 | El sistema debe permitir a los docentes registrar y actualizar la asistencia de los estudiantes de sus asignaciones. |
| RF19 | El sistema debe permitir a los docentes registrar y actualizar calificaciones y observaciones académicas de sus asignaciones. |
| RF20 | El sistema debe permitir al estudiante consultar su matrícula, cursos, asistencia, calificaciones y observaciones académicas. |
| RF21 | El sistema debe permitir al apoderado consultar la asistencia, calificaciones y observaciones de los estudiantes vinculados a su cuenta. |
| RF22 | El sistema debe permitir a la dirección consultar y exportar reportes y estadísticas de matrícula, asistencia y desempeño académico, filtrados por periodo, grado y sección. |
| RF23 | El sistema debe permitir al administrador gestionar cuentas de usuario, roles y permisos. |
| RF24 | El sistema debe permitir autenticar a los usuarios y autorizar sus operaciones según su rol y su relación con la información solicitada. |
| RF25 | El sistema debe permitir al administrador configurar parámetros generales, como los formatos y tamaños permitidos para los documentos adjuntos. |
| RF26 | El sistema debe ofrecer un asistente virtual que responda consultas sobre requisitos y pasos de matrícula a partir de la información configurada para el proceso. |

## 2. Relación entre historias de usuario y requisitos funcionales

| Historia de usuario | Requisitos relacionados |
|---|---|
| HU01: Registrar y actualizar datos | RF01 |
| HU02: Consultar requisitos, fechas y vacantes | RF02 |
| HU03: Solicitar matrícula y adjuntar documentos | RF03, RF04 |
| HU04: Consultar el estado y recibir notificaciones | RF05, RF06 |
| HU05: Corregir observaciones | RF07 |
| HU06: Descargar constancia de matrícula | RF08 |
| HU07: Revisar solicitudes con apoyo de IA | RF09, RF10 |
| HU08: Observar y resolver solicitudes | RF11, RF12, RF13 |
| HU09: Gestionar la organización de la matrícula | RF14 |
| HU10: Gestionar cursos, docentes y asignaciones | RF15, RF16 |
| HU11: Consultar asignaciones docentes | RF17 |
| HU12: Registrar asistencia | RF18 |
| HU13: Registrar calificaciones y observaciones | RF19 |
| HU14: Consultar la situación académica del estudiante | RF20 |
| HU15: Consultar información del estudiante a cargo | RF21 |
| HU16: Consultar reportes y estadísticas | RF22 |
| HU17: Gestionar cuentas, roles y permisos | RF23, RF24 |
| HU18: Configurar la plataforma | RF25 |
| HU19: Consultar al asistente virtual | RF26 |