# Arquitectura inicial

## Arquitectura en tres capas

El sistema de matrícula y gestión académica se organizará utilizando una arquitectura de tres capas, separando las responsabilidades de presentación, lógica de negocio y acceso a datos.

### Capa de Presentación

Esta capa se encarga de la interacción entre el usuario y el sistema.

- Aplicación Web
- API REST

### Capa de Lógica de Negocio

Esta capa contiene las principales funcionalidades y reglas del sistema.

- Usuarios
- Estudiantes y apoderados
- Matrícula
- Validación documental
- Organización académica
- Seguimiento académico
- Reportes
- Asistencia virtual

### Capa de Datos

Esta capa se encarga del almacenamiento y consulta de la información.

- Base de datos

## Responsabilidades de las capas

| Capa | Pregunta que responde |
|---|---|
| Presentación | ¿Cómo interactúa el usuario? |
| Lógica de negocio | ¿Qué hace el sistema? |
| Datos | ¿Dónde se almacena la información? |