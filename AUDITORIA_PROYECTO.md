# Auditoría de la estructura y documentación del proyecto

> **Nota de vigencia:** este informe documenta la inspección del repositorio antes de su reorganización por sprints. Las rutas y el estado descritos son una fotografía histórica previa; para la organización actual, consulte [SDD.md](SDD.md).

**Proyecto:** Sistema de matrícula y gestión académica para el colegio Mariscal Cáceres, Ayacucho  
**Fecha de auditoría:** 23 de noviembre de 2026  
**Alcance:** inspección de solo lectura del repositorio y comparación con los objetivos del Sprint 2 indicados.

## 1. Estructura completa del repositorio

Fuera de `.git`, el proyecto contiene **5 carpetas, 20 archivos Markdown y un `.gitignore` vacío**. El árbol observado es:

```text
.
├── .gitignore
├── README.md
├── 01-analisis-de-sistema/
│   ├── 01-actores.md
│   ├── 02-historias-de-usuario.md
│   ├── 03-requisitos-funcionales.md
│   ├── 04-atributos-de-calidad.md
│   ├── 05-restricciones.md
│   ├── 06-drivers-arquitectonicos.md
│   ├── 07-decisiones-arquitectonicas.md
│   └── 08-escenarios-atributos-calidad.md
├── 02-arquitectura/
│   ├── arquitectura-inicial.md
│   ├── componentes-arquitectonicos.md
│   ├── estilo-arquitectonico.md
│   └── enfoque/
│       └── enfoque- arquitectonico.md
├── 03-diseno-de-software/
│   ├── diseno-interno-de-modulos.md
│   ├── patrones-de-diseno.md
│   └── principios-de-diseno.md
└── 04-modelo-c4/
    ├── nivel1-contexto-del-sistema.md
    ├── nivel2-contenedores.md
    ├── nivel3-componentes.md
    └── nivel4-codigo.md
```

Las cuatro carpetas existentes se llaman `01-analisis-de-sistema`, `02-arquitectura`, `03-diseno-de-software` y `04-modelo-c4`. La carpeta de diseño interno está directamente dentro de `03-diseno-de-software`; no existe una subcarpeta `diseño-interno`.

**Extensiones encontradas:** `.md` (20), `.gitignore` (1, archivo vacío). No se encontraron imágenes, diagramas como archivos independientes, PDF, Word, fuentes, archivos de configuración de aplicaciones ni otros recursos fuera de `.git`.

Hay diagramas **Mermaid incrustados en documentos Markdown**, entre ellos vistas de arquitectura, diagramas de clases y una secuencia del flujo de matrícula.

## 2. Inventario documental

| Ruta | Título o tema | Propósito y contenido principal |
|---|---|---|
| `README.md` | Sistema de Matrícula y Gestión Académica | Presenta el proyecto, el caso de estudio, al integrante, el curso, la universidad y el semestre. Describe la solución como aplicación web, con arquitectura de tres capas y backend monolítico modular. |
| `01-analisis-de-sistema/01-actores.md` | Sin título Markdown | Tabla de seis actores: apoderado, estudiante, personal administrativo, docente, dirección y administrador. Resume lo que cada uno necesita realizar. |
| `01-analisis-de-sistema/02-historias-de-usuario.md` | Historias de usuario | Diecinueve historias, HU01–HU19, que abarcan matrícula, documentos, gestión académica, reportes, acceso y asistente virtual. |
| `01-analisis-de-sistema/03-requisitos-funcionales.md` | Requisitos funcionales | Veintiséis requisitos, RF01–RF26, y tabla de relación entre historias de usuario y requisitos. Incluye matrícula, asistencia, calificaciones, IA, reportes y administración. |
| `01-analisis-de-sistema/04-atributos-de-calidad.md` | Atributos de calidad | Escenarios resumidos para rendimiento, disponibilidad, escalabilidad, seguridad, mantenibilidad, integridad, tolerancia a fallos y usabilidad; propone formas de validarlos. |
| `01-analisis-de-sistema/05-restricciones.md` | Restricciones del sistema | Diez restricciones: aplicación web, Git/GitHub, REST, tres capas, IA, caché, Cloudflare, SDD, pruebas y matrícula virtual. |
| `01-analisis-de-sistema/06-drivers-arquitectonicos.md` | Drivers arquitectónicos | Nueve drivers derivados de calidad, requisitos y restricciones: concurrencia, integridad, seguridad, IA, continuidad, capas, cambios y despliegue. |
| `01-analisis-de-sistema/07-decisiones-arquitectonicas.md` | Decisiones arquitectónicas | Diez ADR, ADR-001–ADR-010: monolito modular, Clean Architecture, caché, IA por adaptadores, transacciones, autorización, estados, monitoreo, REST y compatibilidad con Cloudflare. |
| `01-analisis-de-sistema/08-escenarios-atributos-calidad.md` | Escenarios de atributos de calidad del Sistema de Matrícula y Gestión Académica | Ocho escenarios detallados, EQ-01–EQ-08, con fuente, estímulo, respuesta, medida, verificación y estado pendiente. |
| `02-arquitectura/arquitectura-inicial.md` | Arquitectura inicial del sistema | Vista conceptual de tres capas, módulos, datos, caché, documentos e integraciones propuestas. Registra supuestos y discrepancias pendientes; aclara que no hay despliegue acreditado. |
| `02-arquitectura/componentes-arquitectonicos.md` | Componentes arquitectónicos | Resume responsabilidades e interfaces propuestas para Web, API, módulos, persistencia, documentos y caché. Los niveles C4 se desarrollan aparte. |
| `02-arquitectura/estilo-arquitectonico.md` | Estilo arquitectónico | Documenta cliente-servidor con API REST y backend monolítico modular, responsabilidades, integridad, ventajas, límites y pendientes tecnológicos. |
| `02-arquitectura/enfoque/enfoque- arquitectonico.md` | Enfoque arquitectónico | Explica Clean Architecture, sus áreas, dependencias permitidas y un ejemplo del flujo de matrícula. Aclara que no selecciona framework. El nombre del archivo contiene un espacio después del guion. |
| `03-diseno-de-software/diseno-interno-de-modulos.md` | Diseño interno de módulos | Propone estructura conceptual del backend y desarrolla Matrícula: entidades, contratos, casos de uso, flujo, pseudocódigo y manejo de fallos. Declara que no representa código existente. |
| `03-diseno-de-software/patrones-de-diseno.md` | Patrones de diseño | Propone Repository y Adapter, y Decorator como opción para materializar la caché. Distingue decisiones de propuestas y deja tecnologías por confirmar. |
| `03-diseno-de-software/principios-de-diseno.md` | Principios de diseño SOLID | Describe la aplicación propuesta de los cinco principios a Matrícula e IA y cómo se comprobarían cuando exista código. |
| `04-modelo-c4/nivel1-contexto-del-sistema.md` | Nivel 1: contexto del sistema | Diagrama de contexto con actores, sistema y servicios externos propuestos. Declara que los procesos no han sido validados en campo. |
| `04-modelo-c4/nivel2-contenedores.md` | Nivel 2: contenedores | Propone aplicación web, backend, base relacional, caché, almacenamiento privado e integraciones. PostgreSQL y Redis aparecen como candidatos, no como elecciones definitivas. |
| `04-modelo-c4/nivel3-componentes.md` | Nivel 3: componentes | Desglosa los módulos del backend y sus interfaces y relaciones propuestas, incluidos datos, IA, caché y notificaciones. |
| `04-modelo-c4/nivel4-codigo.md` | Nivel 4: código | Modelo propuesto de clases y secuencia para registrar, revisar y resolver solicitudes. Señala que no es implementación ejecutable y deja reglas y tecnologías pendientes. |

## 3. Estado de la documentación del Sprint 1

### `01-analisis-de-sistema`

Es la carpeta con los artefactos de requisitos más completos: actores, historias, requisitos funcionales, restricciones, drivers, ADR y escenarios de calidad. Hay trazabilidad entre historias y requisitos.

Conviene actualizarla al concretar el alcance del Sprint 2. Los documentos cubren funciones amplias —asistencia, calificaciones, IA, reportes, notificaciones y roles—, pero el repositorio no indica qué subconjunto tendrá la primera versión funcional. Las metas de calidad aparecen como propuestas por validar y aún no tienen evidencia.

**Conservar:** las historias, los requisitos, los drivers y las decisiones como base de trazabilidad. Revisar y registrar las decisiones cuando haya tecnologías seleccionadas o cambie el alcance.

### `02-arquitectura`

Describe el estilo, el enfoque y los componentes propuestos; también relaciona decisiones previas con una vista de tres capas y Clean Architecture. La carpeta actual se llama `02-arquitectura`, aunque la estructura indicada inicialmente la nombraba `02-arquitectura-software`.

**Requiere actualización:** concretar las elecciones tecnológicas que siguen pendientes y asegurar que las vistas correspondan a lo que se implemente. Corregir además las referencias a rutas antiguas descritas en el apartado 6.

**Conservar:** las vistas conceptuales y su distinción explícita entre decisiones aprobadas, candidatos y supuestos. PostgreSQL, Redis, OpenRouter y un proveedor cloud no deben presentarse como implementados.

### `03-diseno-de-software`

Contiene diseño interno, patrones y principios SOLID. El diseño de matrícula es ilustrativo e incluye pseudocódigo y límites de transacción entre base y archivos. No es especificación ejecutable ni código fuente.

**Requiere actualización:** alinearlo con el alcance del Sprint 2 y los contratos que se implementen. Si se elabora un SDD separado, relacionarlo con estas vistas para evitar mantener especificaciones duplicadas.

**Conservar:** el flujo de matrícula, la separación propuesta por responsabilidades, los patrones seleccionados y la aclaración de que SOLID todavía debe comprobarse contra código real.

### `04-modelo-c4`

Tiene los cuatro niveles: contexto, contenedores, componentes y código. Los documentos especifican que son propuestas, identifican servicios externos no confirmados y enlazan niveles entre sí.

**Requiere actualización:** revisar los diagramas a medida que se elijan tecnologías, endpoints y límites concretos de los módulos. Corregir sus enlaces rotos a las carpetas de análisis y arquitectura.

**Conservar:** los cuatro niveles y las etiquetas que distinguen lo propuesto de lo existente. El nivel 4 cubre principalmente Matrícula e IA, no el sistema completo.

## 4. Arquitectura y tecnologías documentadas

**Decisiones o enfoques documentados:**

- Cliente-servidor, con aplicación web y backend monolítico modular.
- API REST entre frontend y backend.
- Clean Architecture para ordenar Dominio, Aplicación, Presentación e Infraestructura dentro de los módulos.
- Separación conceptual en tres capas en el nivel de sistema. Los documentos explican que esta vista agrupa las cuatro áreas de Clean Architecture; no necesariamente es una contradicción.
- Módulos propuestos: Usuarios, Estudiantes, Matrícula, Validación Documental/IA, Gestión Académica y Reportes.
- Base de datos como autoridad para confirmar vacantes; transacción y restricciones de unicidad propuestas para evitar sobrecupos y duplicados.
- Caché para lecturas frecuentes, sin usarla para confirmar vacantes.
- Integraciones externas de IA y notificaciones mediante adaptadores; continuidad manual ante fallos de IA.
- Patrones Repository y Adapter; Decorator como opción para la caché.
- Aplicación propuesta de SOLID.

**Candidatos, no tecnologías implementadas:** PostgreSQL para base relacional, Redis para caché y OpenRouter para IA aparecen como opciones por evaluar. El framework del frontend, el lenguaje y framework del backend, el proveedor de almacenamiento, la autenticación/sesiones y la ubicación concreta de los servicios siguen por definir. Cloudflare figura como restricción de despliegue, pero los documentos no acreditan un despliegue realizado.

## 5. Estado del código fuente

En la copia de trabajo **no se encontró código fuente ni configuración de una aplicación**.

- **Frontend:** no hay estructura ni archivos de aplicación web.
- **Backend/API:** no hay implementación ni rutas REST.
- **Base de datos:** no hay esquema, migraciones, scripts, conexión ni datos.
- **Pruebas:** no hay suites automatizadas ni configuración de herramientas de prueba.
- **OpenAPI/Swagger:** no hay especificación ni configuración de documentación de API.
- **Configuración del proyecto:** solo está el `.gitignore`, que está vacío; no hay manifiestos de dependencias, configuración de entorno o build.
- **Documentación:** sí hay un `README.md`, pero funciona como presentación breve del proyecto, no como índice completo de documentos o guía para ejecutar una aplicación.

La revisión no encontró archivos que no pudieran leerse. Git no reportó cambios pendientes al momento de la inspección.

## 6. Vacíos para cumplir el Sprint 2

Al comparar el contenido actual con los requisitos de Sprint 2 indicados:

- **Primera versión funcional:** falta implementar frontend, backend y persistencia. Tampoco hay un alcance de MVP/Sprint 2 definido en archivos.
- **Respeto a la arquitectura:** existe diseño propuesto, pero todavía no hay código contra el cual comprobarlo.
- **SDD:** no se encontró un documento titulado SDD ni especificaciones por funcionalidad o endpoint. `RC08` usa SDD como “desarrollo guiado por especificaciones”; el objetivo del Sprint 2 también solicita elaborar Software Design Document. Conviene aclarar esa doble acepción y organizar las especificaciones previas a la implementación.
- **REST y OpenAPI/Swagger:** no hay endpoints implementados ni contrato OpenAPI. Los documentos hablan de API REST a nivel arquitectónico, sin rutas, esquemas request/response, códigos de error o autenticación detallada.
- **Base de datos y caché:** hay decisiones conceptuales y candidatos, pero no un análisis comparativo concluido, esquema físico, estrategia de índices, caducidad/invalidez de caché ni mediciones.
- **SOLID:** está explicado como propuesta; no hay código para evaluar su aplicación.
- **Jest:** no hay dependencias ni configuración. Tampoco hay pruebas unitarias, integración o resultados.
- **Atributos de calidad:** están definidos escenarios y verificaciones propuestas, pero faltan resultados. `RC09` menciona pruebas unitarias, integración y carga; la documentación debe traducirse a herramientas, escenarios y evidencia del Sprint 2.
- **Referencias internas:** varios enlaces Markdown apuntan a rutas inexistentes, como `../analisis-de-sistema/...` en vez de la carpeta existente `../01-analisis-de-sistema/...`. También hay enlaces `../arquitectura/...` donde la carpeta actual es `../02-arquitectura/...`. El documento SOLID enlaza un nombre de archivo de enfoque sin el espacio que sí aparece en el nombre real. Estas referencias están desactualizadas y dificultan navegar la documentación.
- **Alcance y cifras:** `08-escenarios-atributos-calidad.md` usa 2.000 usuarios concurrentes, mientras que `arquitectura-inicial.md` dice que el encargo menciona 2.000 por hora. El mismo documento de arquitectura indica que asistencia está en el análisis, pero que el encargo actual la deja opcional. Esas diferencias están registradas como pendientes, pero requieren una fuente de decisión y una resolución clara para Sprint 2.
- **Alcance de IA:** los requisitos incluyen revisión documental y asistente virtual, pero el diseño mantiene el alcance de RF26 “por confirmar”. Falta decidir si ambos forman parte de la primera versión y precisar sus límites.

## 7. Recomendaciones

1. Mantener las cuatro carpetas existentes y usar un índice general para presentar su orden, propósito y enlaces válidos. El README puede servir como entrada al índice y a una futura guía de ejecución cuando haya código.
2. Conservar los artefactos del Sprint 1 como línea base y actualizar su estado —propuesto, confirmado, implementado o validado— conforme avance Sprint 2.
3. Añadir la documentación propia del Sprint 2 de forma que no duplique los requisitos ni las vistas C4: especificaciones SDD vinculadas a historias/requisitos, contrato OpenAPI y evidencias de pruebas/atributos de calidad.
4. Registrar decisiones tecnológicas y sus consecuencias antes de describirlas como parte de la implementación. En particular, resolver base de datos, caché, almacenamiento, framework, autenticación y despliegue.
5. Resolver explícitamente las discrepancias de alcance y carga: 2.000 concurrentes frente a 2.000 por hora; asistencia opcional o incluida; y alcance de IA/RF26.
6. Corregir los enlaces Markdown para que apunten a las rutas reales actuales, incluido el archivo de enfoque con su nombre exacto.
7. Cuando exista código, actualizar C4 niveles 2–4 y el diseño interno para que reflejen la estructura real; conservar lo conceptual donde todavía no existan decisiones o componentes ejecutables.

---

Este informe registra el estado observado durante la auditoría. No se realizaron modificaciones al código ni a la documentación fuente como parte de la inspección.
