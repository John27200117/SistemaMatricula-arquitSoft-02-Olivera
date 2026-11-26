# Análisis de base de datos y caché — Sprint 2

**Estado:** estrategia tecnológica prevista; no implementada ni medida.

## PostgreSQL en Supabase y Prisma

- **PostgreSQL** es la base relacional prevista y **Supabase** el servicio de alojamiento previsto; ningún proyecto/esquema está conectado en este repositorio.
- **Prisma** es el ORM previsto para schema, acceso tipado y migraciones; no hay dependencia/schema/migración instalados.
- PostgreSQL será autoridad para solicitudes, estado, vacantes y aprobaciones.
- Aplicar claves foráneas, índices de búsqueda y restricciones únicas para prevenir duplicidad. Las combinaciones exactas dependen de la definición de periodo, sección, estudiante y política institucional.
- Revisar índices para consultas por estado, estudiante/periodo y vacante por periodo/sección con `EXPLAIN` y datos representativos antes de afirmar beneficio.
- Aprobación dentro de transacción: comprobar duplicado, asegurar cupo con bloqueo/actualización condicional segura, crear matrícula, actualizar ocupación e historial; rollback ante conflicto.
- Confirmar estrategia de pooling/límites de conexión de Supabase y compatibilidad del despliegue elegido. No se ejecutaron migraciones ni se alteró base de datos.

## Caché inicial en memoria

Se prevé usar NestJS Cache Manager con almacenamiento en memoria local del proceso para lecturas repetidas de vacantes y catálogos públicos/configurados. Configurar claves por filtros y contexto; **TTL debe ser explícito y configurable**, pero su duración está pendiente de medición/confirmación.

### Límites

- Caché local por instancia: no se comparte entre procesos/instancias y cada una puede tener valores distintos.
- Se pierde al reiniciar; consumo de memoria requiere límites/observabilidad.
- La invalidación distribuida no se obtiene con un cache manager local; requiere estrategia si hay varias instancias.
- TTL reduce la ventana de obsolescencia, pero no garantiza consistencia inmediata.
- No guardar documentos ni observaciones/datos personales en la caché inicial.

### Expiración, invalidación y fallback

- Las entradas vencen por TTL. TTL específico y objetivo de frescura pendientes.
- Invalidar claves afectadas después de crear/actualizar vacantes o cambiar configuración relacionada; centralizar la construcción de clave para evitar omisiones.
- En cache miss, leer PostgreSQL y llenar caché. Si la caché falla, degradar a PostgreSQL cuando sea seguro y registrar métrica técnica.
- **Aprobación nunca lee cupo desde caché**: recalcula/verifica la disponibilidad autoritativa dentro de la transacción PostgreSQL.

## Evolución

Redis queda como alternativa futura si pruebas de carga, despliegue multi-instancia o requerimientos de coherencia demuestran la necesidad. No se adopta de inicio ni se declara superior sin medición.
