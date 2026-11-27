# Evidencias de pruebas de rendimiento — k6

**Estado:** EJECUTADO PARCIALMENTE.

Se realizaron pruebas preliminares de rendimiento sobre el endpoint de salud del backend:

`GET /api/v1/health`

## 1. Configuración de las pruebas

- Herramienta: Grafana k6.
- Entorno: desarrollo local.
- Fecha: 26/11/2026.
- Duración por ejecución: 30 segundos.
- Pausa entre iteraciones: 1 segundo.
- Escenarios ejecutados: 5, 20 y 50 usuarios virtuales (VUs).

## 2. Resultados obtenidos

| Usuarios virtuales | Solicitudes | Checks aprobados | Latencia promedio | p95 | Máximo |
|---:|---:|---:|---:|---:|---:|
| 5 | 150 | 100 % | 0.66 ms | 1.38 ms | 2.19 ms |
| 20 | 600 | 100 % | 0.77 ms | 1.92 ms | 3.01 ms |
| 50 | 1,500 | 100 % | 0.78 ms | 3.23 ms | 7.82 ms |

No se registraron solicitudes fallidas en las tres ejecuciones.

## 3. Archivos de evidencia

- `resultado-health-5vus.json`: resultados de la prueba con 5 VUs.
- `resultado-health-20vus.json`: resultados de la prueba con 20 VUs.
- `resultado-health-50vus.json`: resultados de la prueba con 50 VUs.

## 4. Interpretación y limitaciones

Las pruebas muestran que el endpoint de salud respondió correctamente durante los escenarios ejecutados.

Sin embargo, estas pruebas son preliminares y no representan operaciones reales de matrícula, consultas de vacantes ni transacciones sobre PostgreSQL.

**Queda pendiente:**
- Pruebas de carga con operaciones representativas del sistema.
- Escenario progresivo hasta el objetivo de 2.000 usuarios virtuales concurrentes.
- Evaluación de concurrencia e integridad de las vacantes.
- Registro de consumo de recursos y definición de umbrales de rendimiento.

Por tanto, estos resultados no demuestran que el sistema soporte todavía 2.000 usuarios concurrentes.