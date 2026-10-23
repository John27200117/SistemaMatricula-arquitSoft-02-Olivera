# Restricciones del sistema

## 1. Restricciones identificadas

| ID | Restricción | Descripción |
|---|---|---|
| RC01 | Aplicación web | El sistema debe ser accesible mediante un navegador web, sin requerir la instalación de una aplicación de escritorio. |
| RC02 | Control de versiones | El código y la documentación deben gestionarse mediante Git y mantenerse en un repositorio de GitHub. |
| RC03 | API REST | La comunicación entre el frontend y el backend debe realizarse mediante una API REST. |
| RC04 | Arquitectura en capas | Para este entregable, el sistema debe organizarse en tres capas: presentación, lógica de negocio y datos, según lo solicitado en la guía. |
| RC05 | Incorporación de IA | El proyecto debe integrar inteligencia artificial para apoyar la revisión preliminar de documentos y la atención de consultas. |
| RC06 | Uso de caché | La solución debe incorporar caché para reducir consultas repetidas. La confirmación de vacantes debe utilizar información consistente de la base de datos. |
| RC07 | Despliegue | El proyecto debe contemplar el despliegue en Cloudflare indicado para el curso. La ubicación del backend, la base de datos y los archivos deberá definirse según la compatibilidad de los servicios seleccionados. |
| RC08 | Desarrollo guiado por especificaciones | El desarrollo debe seguir el enfoque SDD solicitado en el curso, documentando el comportamiento esperado antes de implementar las funcionalidades. |
| RC09 | Pruebas obligatorias | El proyecto debe incluir pruebas unitarias, de integración y de carga, con evidencia de los resultados obtenidos. |
| RC10 | Matrícula virtual | El flujo propuesto debe permitir presentar documentos, corregir observaciones y obtener la constancia mediante la plataforma, sin introducir pasos presenciales obligatorios. |
| RC11 | Acceso a servicios externos | La verificación de identidad mediante RENIEC queda condicionada a disponer de acceso autorizado. Si no se obtiene, el prototipo utilizará un servicio simulado identificado como tal. |