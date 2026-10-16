# Componentes arquitectónicos — Sistema de Matrícula y Gestión Académica

Modelo C4 · Estilo: monolito modular en capas

---

## Nivel 1 — Diagrama de contexto

Muestra quién interactúa con el sistema y con qué servicios externos se integra.

```mermaid
flowchart TB
    Apoderado["**Apoderado**\n[Persona]\nRegistra solicitudes, adjunta documentos\ny consulta el estado de la matrícula."]
    Estudiante["**Estudiante**\n[Persona]\nConsulta su matrícula, cursos,\nasistencia y calificaciones."]
    Personal["**Personal administrativo**\n[Persona]\nRevisa solicitudes, registra observaciones\ny confirma o rechaza matrículas."]
    Docente["**Docente**\n[Persona]\nRegistra asistencia, calificaciones\ny observaciones académicas."]
    Direccion["**Dirección**\n[Persona]\nConsulta reportes y estadísticas\nde matrícula y desempeño académico."]
    Admin["**Administrador del sistema**\n[Persona]\nGestiona cuentas, roles, permisos\ny parámetros de configuración."]

    SistemaMatricula["**Sistema de Matrícula\ny Gestión Académica**\n[Sistema de software]\nPermite gestionar el proceso de matrícula\nvirtual y el seguimiento académico."]

    IA["**Servicio de IA**\n[Sistema externo]\nRevisión preliminar de documentos\ny asistente virtual de consultas."]
    Notificaciones["**Servicio de notificaciones**\n[Sistema externo]\nEnvía notificaciones sobre cambios\nde estado y observaciones."]
    RENIEC["**Verificación de identidad**\n[Sistema externo]\nRENIEC (autorizada) o simulada\nsegún disponibilidad de acceso."]

    Apoderado -- Usa --> SistemaMatricula
    Estudiante -- Usa --> SistemaMatricula
    Personal -- Usa --> SistemaMatricula
    Docente -- Usa --> SistemaMatricula
    Direccion -- Usa --> SistemaMatricula
    Admin -- Usa --> SistemaMatricula

    SistemaMatricula -- "Revisión documental\ny asistente virtual" --> IA
    SistemaMatricula -- "Notifica cambios\nde estado" --> Notificaciones
    SistemaMatricula -. "Verificación de identidad\n(condicional)" .-> RENIEC
```

**Notas:**
- La línea discontinua hacia RENIEC indica una integración condicional: depende de contar con acceso autorizado. Si no se obtiene, el sistema utilizará un servicio simulado identificado como tal (RC11).
- Todos los actores acceden al sistema mediante un navegador web, sin necesidad de instalar una aplicación de escritorio (RC01).

---

## Nivel 2 — Diagrama de contenedores

Muestra los contenedores tecnológicos que componen el sistema y cómo se comunican.

```mermaid
flowchart TB
    Usuarios["Apoderado, Estudiante, Personal administrativo,\nDocente, Dirección, Administrador"]

    subgraph SISTEMA["Sistema de Matrícula y Gestión Académica"]
        WebApp["**Aplicación web**\n[Contenedor: SPA]\nInterfaz para todos los actores.\nConectada al backend mediante HTTPS/JSON."]

        Backend["**API Matrícula**\n[Contenedor: monolito modular]\nExpone la API REST, contiene los módulos\nde negocio y aplica Clean Architecture."]

        BD[("**Base de datos**\n[Contenedor: PostgreSQL]\nAlmacena usuarios, estudiantes,\nsolicitudes, matrículas y vacantes.")]

        Cache[("**Caché**\n[Contenedor: Redis]\nAlmacena en memoria información\nconsultada frecuentemente.")]

        Documentos["**Almacenamiento de documentos**\n[Contenedor]\nConserva los archivos adjuntos\ny las constancias generadas."]
    end

    IA["**Servicio de IA**\n[Sistema externo]"]
    Notificaciones["**Servicio de notificaciones**\n[Sistema externo]"]
    RENIEC["**Verificación de identidad**\n[Sistema externo]"]

    Usuarios -- "Usa\n[HTTPS]" --> WebApp
    WebApp -- "Llama a la API\n[HTTPS/JSON]" --> Backend
    Backend -- "Lee y escribe\n[SQL]" --> BD
    Backend -- "Consulta y almacena\ninformación frecuente" --> Cache
    Backend -- "Almacena y recupera\ndocumentos" --> Documentos
    Backend -- "Revisión documental\ny asistente virtual\n[HTTPS/REST]" --> IA
    Backend -- "Envía notificaciones\n[HTTPS/REST]" --> Notificaciones
    Backend -. "Verificación de identidad\n(condicional)\n[HTTPS/REST]" .-> RENIEC
```

**Notas:**
- El backend se despliega como una sola unidad (monolito modular); los módulos de negocio no se despliegan como servicios independientes.
- La caché almacena información de consulta frecuente como grados, secciones, requisitos documentales y vacantes disponibles, pero la confirmación de matrícula verifica el cupo directamente en la base de datos (ADR-003, ADR-005).
- El frontend se despliega en Cloudflare; la ubicación del backend, la base de datos y el almacenamiento se definirá según compatibilidad con los servicios seleccionados (RC07, ADR-010).

---

## Nivel 3 — Diagrama de componentes

Muestra los módulos internos del backend, sus responsabilidades y cómo se relacionan entre sí y con los sistemas externos.

```mermaid
flowchart TB
    WebApp["Aplicación web\n[Contenedor: SPA]"]

    subgraph BACK["API Matrícula [Contenedor: monolito modular]"]
        direction TB

        API["**API REST**\n[Componente: rutas + middlewares]\nExpone /api/v1, valida la entrada\ny autentica mediante JWT."]

        subgraph MOD["Módulos de negocio"]
            direction TB

            U["**Usuarios**\n[Componente: módulo]\nRegistro, autenticación y roles."]
            E["**Estudiantes**\n[Componente: módulo]\nInformación de estudiantes\ny apoderados."]
            M["**Matrícula**\n[Componente: módulo]\nSolicitudes, estados, vacantes\ny confirmación de matrícula."]
            VD["**Validación Documental**\n[Componente: módulo]\nRevisión de documentos,\nobservaciones y coordinación con IA."]
            GA["**Gestión Académica**\n[Componente: módulo]\nPeriodos, grados, secciones,\ncursos, docentes y asignaciones."]
            SEG["**Seguimiento Académico**\n[Componente: módulo]\nAsistencia, calificaciones\ny observaciones académicas."]
            REP["**Reportes**\n[Componente: módulo]\nEstadísticas de matrícula,\nasistencia y desempeño."]
            AV["**Asistente Virtual**\n[Componente: módulo]\nResponde consultas sobre requisitos\ny pasos de matrícula mediante IA."]
        end

        INF["**Acceso a datos y adaptadores**\n[Componente: infraestructura]\nRepositorios, caché, almacenamiento\nde documentos y adaptadores externos."]
    end

    BD[("Base de datos\n[PostgreSQL]")]
    Cache[("Caché\n[Redis]")]
    Documentos["Almacenamiento\nde documentos"]
    IA["Servicio de IA\n[Sistema externo]"]
    Notificaciones["Servicio de notificaciones\n[Sistema externo]"]
    RENIEC["Verificación de identidad\n[Sistema externo]"]

    WebApp -- "Llama a la API\n[HTTPS/JSON]" --> API

    API --> U
    API --> E
    API --> M
    API --> VD
    API --> GA
    API --> SEG
    API --> REP
    API --> AV

    U -- "Valida cuenta\ny permisos" --> M
    U -- "Valida cuenta\ny permisos" --> VD
    E -- "Proporciona datos\ndel estudiante" --> M
    M -- "Verifica vacantes\ny confirma" --> GA
    M -- "Publica cambio\nde estado" --> Notificaciones
    VD -- "Solicita revisión\ndocumental" --> IA
    AV -- "Consulta información\ndel proceso" --> IA
    SEG -- "Consulta asignaciones\ndocentes" --> GA

    U --> INF
    E --> INF
    M --> INF
    VD --> INF
    GA --> INF
    SEG --> INF
    REP --> INF
    AV --> INF

    INF -- "Lee y escribe\n[SQL]" --> BD
    INF -- "Consulta frecuente" --> Cache
    INF -- "Almacena y recupera\ndocumentos" --> Documentos
    INF -. "Verificación de identidad\n(condicional)" .-> RENIEC
```

**Notas:**
- Cada componente es un módulo del monolito: todos se despliegan juntos (ADR-001).
- Un módulo accede a otro solo a través de su interfaz pública (servicio), nunca directamente a sus tablas.
- La confirmación de matrícula verifica las vacantes en la base de datos dentro de una transacción, sin depender de la caché (ADR-005).
- La integración con IA es utilizada por Validación Documental (RF10) y por el Asistente Virtual (RF26). Si el servicio falla, Validación Documental conserva la solicitud y permite continuar mediante revisión administrativa (ADR-004, AC07).
- La línea discontinua hacia Verificación de identidad indica integración condicional (RC11).

---

## Resumen de contenedores y componentes

| Elemento | Tipo | Responsabilidad principal |
|---|---|---|
| Aplicación web | Contenedor (SPA) | Interfaz de usuario para todos los actores |
| API Matrícula | Contenedor (monolito modular) | Backend principal del sistema |
| Base de datos | Contenedor (PostgreSQL) | Persistencia de datos del sistema |
| Caché | Contenedor (Redis) | Consultas frecuentes de información no crítica |
| Almacenamiento de documentos | Contenedor | Archivos adjuntos y constancias generadas |
| Usuarios | Componente / módulo | Autenticación, roles y permisos |
| Estudiantes | Componente / módulo | Datos de estudiantes y apoderados |
| Matrícula | Componente / módulo | Solicitudes, estados, vacantes y confirmación |
| Validación Documental | Componente / módulo | Revisión de documentos con apoyo de IA |
| Gestión Académica | Componente / módulo | Periodos, grados, secciones, cursos y docentes |
| Seguimiento Académico | Componente / módulo | Asistencia, calificaciones y observaciones |
| Reportes | Componente / módulo | Estadísticas y exportaciones para la dirección |
| Asistente Virtual | Componente / módulo | Chatbot de consultas sobre el proceso de matrícula |
| Acceso a datos y adaptadores | Componente (infraestructura) | Repositorios, caché, documentos y adaptadores externos |
