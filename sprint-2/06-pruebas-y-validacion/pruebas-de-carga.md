# Pruebas de carga — k6

**Objetivo de capacidad confirmado:** evaluar hasta **2.000 usuarios virtuales concurrentes**.  
**Estado:** escenario diseñado; NO EJECUTADO. No existe prueba ni resultado que demuestre que el sistema alcance el objetivo.

## Qué significa la métrica

- **Usuarios concurrentes/VUs:** sesiones virtuales activas al mismo tiempo, cada una ejecutando una secuencia de operaciones con pausas/perfil por definir.
- **Solicitudes de matrícula simultáneas:** operaciones concretas de alta/aprobación coincidentes; no se deducen del total de VUs y requieren escenario separado.
- **Peticiones HTTP por segundo (RPS):** tasa generada, resultante de operaciones, pasos, pausas y latencias. No se fija como 2.000.
- **Peticiones acumuladas:** total de solicitudes HTTP durante la ventana; depende de la duración y perfil. No equivale a VUs.
- **Tiempo de respuesta:** latencia por petición y percentiles; no está aprobado un umbral.
- **Porcentaje de errores:** proporción de peticiones fallidas/incorrectas; el límite aceptable queda pendiente.

## Escenario de carga progresivo

Usar k6 con fases progresivas: comprobación funcional de baja carga, línea base, incrementos de concurrencia y evaluación hasta 2.000 VUs. Las cantidades por etapa, ramp-up, duración y pausas/think time son **parámetros pendientes de acordar**; la prueba debe registrar la configuración y no omitir el incremento gradual. La mezcla incluirá operaciones de consulta y matrícula: inicio de sesión/autorización, consulta de vacantes, lectura/creación de estudiantes, registro de solicitudes, adjuntos según entorno, consulta de estado y revisión/aprobación administrativa. Las proporciones de cada operación y los datos semilla deben acordarse antes de ejecutar.

No convertir 2.000 usuarios en 2.000 requests/s. Reportar por separado VUs máximos, RPS observado, peticiones totales, latencias p50/p95/p99 y porcentaje de errores global y por operación. k6 aporta `http_reqs`, `http_req_duration`, `http_req_failed` y checks; exportar el resumen/series configuradas. Los umbrales de aceptación quedan pendientes, no se simulan como resultados.

## Escenario de integridad independiente

Con capacidad limitada en ambiente de prueba, iniciar más aprobaciones concurrentes que vacantes restantes. La aserción es que las aprobaciones confirmadas no superan capacidad, no duplican estudiante/periodo y operaciones fallidas no dejan consumo parcial. Esta prueba valida integridad y no representa el perfil general de 2.000 usuarios.

## Parámetros pendientes y reporte

Confirmar entorno, hardware/plan de Supabase, datos, porcentaje de cada operación, think time, duración, ramp-up, objetivo de latencia y tasa de error permitida. Los tiempos de 3 s/5 s que aparecen como propuesta heredada en Sprint 1 no están aprobados. No hay RPS esperado ni resultados medidos.

## Observabilidad durante la carga

Recoger métricas sincronizadas con cada etapa de k6, usando mecanismos previstos (selección final pendiente):

| Componente | Métricas | Mecanismo previsto |
|---|---|---|
| Backend NestJS/Node.js | CPU, memoria RSS/heap, reinicios, latencia por ruta, errores y conexiones activas | Métricas del proceso Node.js y middleware/interceptor NestJS. Para serie temporal, elegir una solución de métricas/observabilidad compatible con el despliegue; herramienta final `PENDIENTE_CONFIRMACION`. |
| PostgreSQL/Supabase | Conexiones activas/esperando, consultas lentas, duración/errores y saturación del pool | Panel/métricas del servicio Supabase y vistas PostgreSQL como `pg_stat_activity`; `pg_stat_statements` si está habilitado y disponible. Confirmar permisos/retención en el plan elegido. |
| Caché NestJS en memoria | hits/misses, expiraciones, invalidaciones, errores, uso de memoria | Instrumentar el wrapper/adaptador de caché (contadores y duración); Nest Cache Manager local no se asume como panel de métricas listo. |
| Carga HTTP | RPS, total de requests, p50/p95/p99, fallos/checks | Métricas nativas de k6 y exportación del resumen/series de cada ejecución. |

Sin las métricas del backend/DB/cache no se podrá atribuir degradaciones ni concluir capacidad. No se fijan límites ni se afirma que los mecanismos estén instalados.

Guardar script y salida k6 (resumen, configuración, fecha, versión y recursos) en `../evidencias/03-k6/` sin secretos ni datos reales. Informe final: **PENDIENTE / NO EJECUTADO**.
