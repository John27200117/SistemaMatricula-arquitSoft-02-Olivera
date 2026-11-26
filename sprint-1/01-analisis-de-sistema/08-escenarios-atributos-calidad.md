# Escenarios de atributos de calidad del Sistema de Matrícula y Gestión Académica

## EQ-01. Rendimiento: consulta y registro durante el periodo de matrícula

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Rendimiento |
| **Fuente** | Apoderado |
| **Estímulo** | Usuarios virtuales concurrentes realizan una mezcla de operaciones del MVP: inicio de sesión, consulta de vacantes, registro/consulta de estudiantes, registro de solicitudes, consulta de estado y revisiones administrativas autorizadas. |
| **Condición** | Se ejecuta una prueba k6 con hasta 2000 usuarios virtuales concurrentes y datos sintéticos representativos. El sistema funciona con normalidad; el perfil y el entorno se documentan en cada ejecución. |
| **Respuesta esperada** | El sistema responde a las consultas y registra las solicitudes sin errores inesperados, dentro de los tiempos establecidos. |
| **Medida** | El objetivo confirmado es probar hasta 2000 usuarios virtuales concurrentes. Medir por separado VUs, operaciones de negocio, peticiones HTTP/s (RPS), peticiones acumuladas, latencias/percentiles y porcentaje de errores. Los objetivos heredados de 3 s para consultas y 5 s para registro son propuestas no aprobadas, pendientes de confirmación; no hay resultados. |
| **Verificación** | Ejecutar k6 con mezcla, rampa, pausas, duración, datos y recursos registrados. Reportar RPS, total de peticiones, latencia y errores por operación, además de los VUs; no inferir que 2000 VUs son 2000 RPS. |
| **Estado** | La cantidad objetivo de hasta 2000 usuarios concurrentes está confirmada. Perfil, entorno, duración, umbrales de latencia y error están pendientes. No ejecutado. |

## EQ-02. Disponibilidad: continuidad durante el periodo de matrícula

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Disponibilidad |
| **Fuente** | Apoderado o personal administrativo |
| **Estímulo** | El usuario intenta realizar una operación durante el horario habilitado para matrícula o cuando ocurre un fallo en un componente externo. |
| **Condición** | El sistema está desplegado y cuenta con monitoreo activo. |
| **Respuesta esperada** | El sistema mantiene disponibles las operaciones principales y comunica de forma controlada los errores cuando algún servicio no responde. |
| **Medida** | **Propuesta por validar:** disponibilidad del 99,5 % durante el horario habilitado para matrícula, medida mediante comprobaciones periódicas del acceso y de las operaciones principales. |
| **Verificación** | Revisar los registros de monitoreo y calcular los periodos de disponibilidad e interrupción durante el intervalo de evaluación definido. |
| **Estado** | Pendiente de aprobar la meta, definir las operaciones consideradas críticas y establecer las condiciones de mantenimiento programado. |

## EQ-03. Escalabilidad: aumento de usuarios concurrentes

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Escalabilidad |
| **Fuente** | Incremento de solicitudes de apoderados durante el periodo de matrícula |
| **Estímulo** | Aumenta la cantidad de usuarios virtuales con sesiones activas que interactúan simultáneamente con el sistema, llegando hasta 2000 VUs. No representa 2000 solicitudes de matrícula simultáneas ni 2000 peticiones HTTP por segundo. |
| **Condición** | Se realiza una prueba con datos, configuración, operaciones y recursos documentados. |
| **Respuesta esperada** | La arquitectura permite aumentar los recursos o las instancias del backend y ajustar la capacidad de almacenamiento, manteniendo los objetivos de rendimiento definidos. |
| **Medida** | Evaluar una carga de hasta 2000 VUs. Informar por separado concurrencia, RPS, peticiones acumuladas, tiempo de respuesta y porcentaje de errores. Los umbrales de respuesta de 3 s/5 s son propuestas heredadas no aprobadas; la capacidad real queda por demostrar mediante prueba. |
| **Verificación** | Aumentar progresivamente VUs con k6 y comparar tiempos de respuesta, tasa de errores, RPS y uso de recursos en cada nivel. Registrar configuración/infraestructura y mezcla de operaciones. |
| **Estado** | Pendiente de definir perfil, duración, umbrales y entorno; evaluar compatibilidad del escalado con el despliegue previsto. No ejecutado; no se afirma capacidad demostrada. |

## EQ-04. Seguridad: acceso a información y operaciones protegidas

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Seguridad |
| **Fuente** | Usuario sin sesión, con credenciales inválidas o sin permisos suficientes |
| **Estímulo** | El usuario intenta consultar o modificar información fuera de sus permisos, como acceder a datos de otro estudiante o confirmar una solicitud sin autorización. |
| **Condición** | Se realizan pruebas sobre las operaciones protegidas del sistema, incluyendo escenarios por rol y por relación con el estudiante. |
| **Respuesta esperada** | El sistema deniega la operación, no ejecuta el cambio solicitado y no expone información sensible en la respuesta. |
| **Medida** | Rechazar el 100 % de los intentos no autorizados incluidos en las pruebas definidas, sin exposición de datos personales, documentos ni registros académicos en las respuestas revisadas. |
| **Verificación** | Ejecutar pruebas de acceso por rol y por relación con el estudiante, revisar las respuestas del sistema y comprobar que no se expongan datos sensibles. |
| **Estado** | Pendiente de definir los permisos por tipo de usuario, las operaciones protegidas y los casos de prueba específicos. |

## EQ-05. Mantenibilidad: cambios en reglas sin afectar otras funciones

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Mantenibilidad |
| **Fuente** | Equipo de desarrollo |
| **Estímulo** | Se modifica una regla de validación documental o se actualiza una condición para confirmar una matrícula. |
| **Condición** | El sistema está organizado en módulos con responsabilidades definidas y dispone de pruebas para las funciones afectadas. |
| **Respuesta esperada** | El cambio se concentra en el módulo responsable sin afectar el funcionamiento de matrícula ni de gestión académica, salvo que exista una dependencia justificada. |
| **Medida** | Las pruebas del módulo modificado y las pruebas de regresión acordadas deben aprobarse. Las dependencias entre módulos deben respetar las reglas de Clean Architecture establecidas. |
| **Verificación** | Revisar los cambios de código, ejecutar las pruebas de regresión e inspeccionar las dependencias entre capas y módulos. |
| **Estado** | Pendiente de definir las reglas de dependencias obligatorias y las pruebas de regresión mínimas para los cambios en cada módulo. |

## EQ-06. Integridad de datos: confirmación de matrícula ante acceso concurrente

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Integridad de datos |
| **Fuente** | Múltiples apoderados |
| **Estímulo** | Varias solicitudes de matrícula compiten simultáneamente por la última vacante disponible en una sección. |
| **Condición** | El sistema está en operación durante el periodo de matrícula y se ejecutan confirmaciones concurrentes sobre el mismo grado y sección. |
| **Respuesta esperada** | El sistema confirma únicamente la matrícula que corresponde al cupo disponible. No genera matrículas duplicadas ni supera la capacidad de la sección. |
| **Medida** | En todas las pruebas de confirmación simultánea ejecutadas, el número de matrículas confirmadas no debe superar las vacantes disponibles y no deben existir registros duplicados para el mismo estudiante en el mismo periodo. |
| **Verificación** | Ejecutar pruebas de confirmación concurrente, revisar los registros de matrícula y verificar que las restricciones de unicidad y control de vacantes funcionan correctamente. |
| **Estado** | Pendiente de definir los escenarios de prueba de concurrencia y el entorno de ejecución. |

## EQ-07. Tolerancia a fallos: continuidad ante fallo del servicio de IA

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Tolerancia a fallos |
| **Fuente** | Proveedor externo de inteligencia artificial |
| **Estímulo** | El servicio de IA falla o supera el tiempo de espera configurado durante la revisión de documentos de una solicitud. |
| **Condición** | El sistema está en operación y una solicitud de matrícula está pendiente de revisión documental. |
| **Respuesta esperada** | El sistema conserva la solicitud, informa que la revisión automática está pendiente y permite continuar el trámite mediante revisión administrativa manual. |
| **Medida** | En los escenarios de fallo simulado del servicio de IA, el sistema no debe perder solicitudes ni bloquear el trámite. El personal administrativo debe poder continuar la revisión en todos los casos probados. |
| **Verificación** | Simular fallos y demoras del servicio de IA, verificar que las solicitudes se conservan, que el mensaje al personal es claro y que el flujo administrativo continúa sin interrupciones. |
| **Estado** | Pendiente de definir los tiempos de espera configurables y los escenarios de simulación de fallo. |

## EQ-08. Usabilidad: registro de solicitud por apoderado

| Elemento | Descripción |
|---|---|
| **Atributo de calidad** | Usabilidad |
| **Fuente** | Apoderado |
| **Estímulo** | El apoderado intenta completar el registro de una solicitud de matrícula adjuntando los documentos requeridos. |
| **Condición** | Se realiza una prueba de usabilidad con cinco usuarios representativos utilizando documentos de prueba, sin asistencia del evaluador. |
| **Respuesta esperada** | El apoderado completa el proceso de registro sin confusiones graves, utilizando únicamente la interfaz del sistema. |
| **Medida** | Al menos cuatro de los cinco usuarios representativos deben completar el registro de una solicitud con documentos de prueba en un máximo de 10 minutos, sin asistencia del evaluador. |
| **Verificación** | Ejecutar la prueba con usuarios representativos, registrar el tiempo de completitud, los errores cometidos y los puntos de fricción identificados. |
| **Estado** | Pendiente de definir el perfil de los usuarios de prueba, los documentos de prueba y el protocolo de evaluación. |

---

## Resumen de escenarios

| Código | Atributo de calidad | Qué se busca comprobar |
|---|---|---|
| EQ-01 | Rendimiento | Que el sistema responda dentro de los tiempos establecidos durante el periodo de matrícula. |
| EQ-02 | Disponibilidad | Que las operaciones principales estén disponibles durante el horario habilitado para matrícula. |
| EQ-03 | Escalabilidad | Que el sistema soporte hasta 2000 usuarios concurrentes dentro de los límites de rendimiento definidos. |
| EQ-04 | Seguridad | Que las operaciones protegidas no puedan ejecutarse sin la autorización correspondiente. |
| EQ-05 | Mantenibilidad | Que los cambios en las reglas del sistema puedan realizarse sin afectar innecesariamente otras funciones. |
| EQ-06 | Integridad de datos | Que la confirmación concurrente de matrículas no genere duplicados ni supere las vacantes disponibles. |
| EQ-07 | Tolerancia a fallos | Que el fallo del servicio de IA no bloquee el trámite ni provoque pérdida de solicitudes. |
| EQ-08 | Usabilidad | Que los apoderados puedan completar el registro de una solicitud sin asistencia y dentro del tiempo establecido. |

