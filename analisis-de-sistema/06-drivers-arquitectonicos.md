# Drivers arquitectónicos

## 1. Drivers identificados

| ID | Driver arquitectónico | Origen | ¿Por qué influye en la arquitectura? |
|---|---|---|---|
| DA01 | Atender al menos 2000 usuarios concurrentes durante el periodo de matrícula, manteniendo los tiempos de respuesta propuestos. | AC01, AC03, RC06 | Requiere prever el aumento de capacidad del backend, optimizar consultas y utilizar caché para información consultada frecuentemente. |
| DA02 | Evitar matrículas duplicadas y que las confirmaciones simultáneas superen las vacantes disponibles. | RF13, AC06 | Requiere transacciones, restricciones de unicidad y control de concurrencia en la base de datos. La confirmación debe verificar el cupo sin depender de información almacenada en caché. |
| DA03 | Proteger la información personal y académica mediante permisos por rol y relación con el estudiante. | RF23, RF24, AC04 | Requiere autenticación y autorización en el backend, además de controles para acceder a documentos y registros académicos. |
| DA04 | Integrar IA sin impedir la continuidad del trámite cuando el proveedor falle. | RF10, RF26, AC07, RC05 | Requiere separar la integración con el proveedor, establecer tiempos de espera y conservar estados de revisión que permitan continuar mediante evaluación administrativa. |
| DA05 | Completar la matrícula mediante la plataforma, incluyendo documentos, subsanaciones y constancia. | RF03, RF04, RF07, RF08, RC10 | Requiere coordinar solicitudes, almacenamiento de documentos, historial de observaciones y generación de constancias. |
| DA06 | Mantener disponibles las operaciones principales durante la matrícula. | AC02, AC07 | Requiere monitoreo, recuperación ante fallos y aislamiento de errores de servicios externos para reducir su impacto en el sistema. |
| DA07 | Organizar la solución en tres capas y comunicar el frontend con el backend mediante una API REST. | RC03, RC04 | Determina la separación entre presentación, lógica de negocio y acceso a datos, así como los contratos de comunicación. |
| DA08 | Facilitar cambios en matrícula, validación documental y gestión académica. | AC05 | Favorece módulos con responsabilidades definidas y dependencias controladas dentro del monolito modular propuesto. |
| DA09 | Ajustar el despliegue a la condición de utilizar Cloudflare. | RC07 | Condiciona la selección de tecnologías y la distribución del frontend, backend, base de datos y almacenamiento según su compatibilidad. |