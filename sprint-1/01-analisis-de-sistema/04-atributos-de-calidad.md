# Atributos de calidad

## 1. Escenario principal
Durante el periodo de matrícula, numerosos apoderados pueden consultar
vacantes, registrar solicitudes y revisar su estado simultáneamente.

El sistema debe atender esta demanda, proteger la información y mantener
la consistencia de las matrículas y vacantes.

## 2. Atributos y escenarios de calidad

| ID | Atributo | Escenario de calidad |
|---|---|---|
| AC01 | Rendimiento | Durante una prueba con hasta 2000 usuarios virtuales concurrentes que realizan una mezcla definida de operaciones —inicio de sesión, consultas de vacantes, registro de estudiantes y solicitudes, consultas de estado y revisión administrativa— se medirán por separado usuarios concurrentes, operaciones, peticiones HTTP por segundo, peticiones acumuladas, tiempos de respuesta y errores. Los 3 segundos para consultas y 5 segundos para registro que figuraban en la propuesta anterior son objetivos no aprobados y pendientes de confirmación; no son resultados medidos. |
| AC02 | Disponibilidad | Durante el horario habilitado para matrícula, el sistema debe alcanzar una disponibilidad objetivo del 99,5 %, medida mediante comprobaciones periódicas del acceso y de las operaciones principales. |
| AC03 | Escalabilidad | Ante un incremento de carga hasta 2000 usuarios virtuales concurrentes, la arquitectura debe permitir evaluar el aumento de recursos o instancias del backend y ajustar la capacidad de almacenamiento. El perfil de carga, entorno, duración y objetivos de rendimiento están pendientes de confirmación. La cifra no significa 2000 solicitudes de matrícula simultáneas ni 2000 peticiones HTTP por segundo, y la capacidad no se considera demostrada hasta ejecutar y reportar pruebas. |
| AC04 | Seguridad | Cuando un usuario intente consultar o modificar información fuera de sus permisos, el sistema debe denegar la operación. Las pruebas deben comprobar que estudiantes, apoderados y docentes acceden únicamente a la información que les corresponde. |
| AC05 | Mantenibilidad | Cuando se modifique una regla de validación documental, el cambio debe concentrarse en el módulo responsable y conservar el funcionamiento de matrícula y gestión académica, comprobado mediante pruebas de regresión. |
| AC06 | Integridad de datos | Cuando varias solicitudes compitan por la última vacante, el sistema debe confirmar únicamente la matrícula que corresponda al cupo disponible. No debe generar matrículas duplicadas ni superar la capacidad de la sección. |
| AC07 | Tolerancia a fallos | Si el servicio de IA falla o supera el tiempo de espera configurado, el sistema debe conservar la solicitud, informar que la revisión automática está pendiente y permitir continuar mediante revisión administrativa. |
| AC08 | Usabilidad | En una prueba con cinco usuarios representativos, al menos cuatro deben completar el registro de una solicitud con documentos de prueba en un máximo de 10 minutos, sin asistencia del evaluador. |

## 3. Validación propuesta
- Rendimiento y escalabilidad: pruebas con k6 hasta 2000 usuarios virtuales concurrentes; informar VUs, mezcla de operaciones, RPS, peticiones acumuladas, latencia y porcentaje de errores por separado. Perfil, duración, recursos y umbrales quedan pendientes; no hay resultados medidos.
- Disponibilidad: monitoreo durante un intervalo de evaluación definido.
- Seguridad: pruebas de acceso por rol y por relación con el estudiante.
- Mantenibilidad: modificación controlada y pruebas de regresión.
- Integridad: pruebas de confirmación simultánea y solicitudes repetidas.
- Tolerancia a fallos: simulación de errores y demoras del servicio de IA.
- Usabilidad: ejecución de tareas con usuarios representativos.

