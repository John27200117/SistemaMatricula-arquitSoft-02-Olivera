# Informe de validación — Sprint 2

**Estado general:** VALIDACIÓN PARCIALMENTE EJECUTADA.

Se han realizado pruebas unitarias, verificaciones funcionales del flujo de matrícula, pruebas preliminares de rendimiento sobre el endpoint de salud y una revisión visual de Swagger. Sin embargo, todavía existen pruebas de integración, concurrencia y carga objetivo pendientes.

## 1. Resumen de estado

| Área | Método/herramienta | Estado | Evidencia |
|---|---|---|---|
| Reglas y dominio | Jest unitario | EJECUTADO | 7 suites y 32 pruebas aprobadas |
| Persistencia y transacciones | Prisma + PostgreSQL | PARCIAL | Migraciones aplicadas y flujo de matrícula probado; faltan pruebas de integración específicas |
| Contratos REST | Postman | EJECUTADO | Verificaciones funcionales del flujo de matrícula |
| Rendimiento del endpoint de salud | k6 | EJECUTADO | Pruebas preliminares con 5, 20 y 50 VUs |
| Carga mixta hasta 2.000 VUs | k6 | PENDIENTE | No ejecutada |
| Integridad de última vacante | Prueba concurrente sobre DB de prueba | PENDIENTE | No ejecutada |
| OpenAPI/Swagger | Revisión visual y exportación OpenAPI | VERIFICADO PARCIALMENTE | Swagger disponible, endpoints protegidos documentados con Bearer Auth, captura guardada y colección Postman exportada desde OpenAPI. Validación automatizada del contrato pendiente |
| Cobertura | Reporte Jest/CI | PENDIENTE | Sin medición ni umbral aprobado |

## 2. Registro de pruebas ejecutadas

### 2.1. Pruebas unitarias — Jest

**Fecha:** 26/11/2026  
**Resultado:** 9 suites aprobadas, 34 pruebas aprobadas y 0 fallidas.  
**Tiempo:** 3.07 segundos (última ejecución registrada).

Se verificaron los casos de uso de creación, revisión, observación, subsanación, aprobación y rechazo de solicitudes de matrícula, además del endpoint de salud.

Evidencia: `06-pruebas-y-validacion/pruebas-unitarias.md`.

### 2.2. Verificación funcional del flujo de matrícula

Se realizaron verificaciones funcionales mediante Postman sobre los endpoints del módulo de matrícula. Se comprobó el flujo de creación, revisión, observación, subsanación y resolución de solicitudes, incluyendo aprobación y rechazo.

También se verificó el incremento de vacantes ocupadas después de una aprobación.

Evidencia: `evidencias/01-postman/README.md`.

### 2.3. Pruebas preliminares de rendimiento — k6

**Fecha:** 26/11/2026  
**Entorno:** desarrollo local.  
**Endpoint:** `GET /api/v1/health`.  
**Duración por ejecución:** 30 segundos.  
**Pausa entre iteraciones:** 1 segundo.

| Usuarios virtuales | Solicitudes | Checks aprobados | Latencia promedio | p95 | Máximo |
|---:|---:|---:|---:|---:|---:|
| 5 | 150 | 100 % | 0.66 ms | 1.38 ms | 2.19 ms |
| 20 | 600 | 100 % | 0.77 ms | 1.92 ms | 3.01 ms |
| 50 | 1,500 | 100 % | 0.78 ms | 3.23 ms | 7.82 ms |

No se registraron solicitudes fallidas en estas ejecuciones.

Los resultados corresponden exclusivamente al endpoint de salud. No representan operaciones de matrícula ni permiten afirmar que el sistema soporte 2.000 usuarios concurrentes.

Evidencias:
- `evidencias/03-k6/resultado-health-5vus.json`
- `evidencias/03-k6/resultado-health-20vus.json`
- `evidencias/03-k6/resultado-health-50vus.json`

### 2.4. Revisión de Swagger

Se verificó visualmente la disponibilidad de Swagger y la documentación de autenticación Bearer en los endpoints protegidos.

Esta revisión no equivale a una validación automatizada completa del contrato OpenAPI.

Evidencia: `evidencias/04-swagger/README.md`.

## 3. Pruebas pendientes

Quedan pendientes las siguientes actividades:

- Pruebas de integración específicas con PostgreSQL para restricciones, relaciones y transacciones.
- Pruebas concurrentes de aprobación sobre la última vacante disponible.
- Prueba de carga mixta de operaciones de matrícula, consultas y otras interacciones hasta el objetivo de 2.000 usuarios virtuales concurrentes.
- Medición de cobertura de Jest y publicación de resultados mediante CI.
- Validación automatizada del contrato OpenAPI.
- Pruebas específicas de integración de caché y almacenamiento de documentos.

## 4. Métricas y criterios de rendimiento

Las métricas deben registrarse por separado para cada escenario:

- Usuarios virtuales concurrentes.
- Operaciones de negocio ejecutadas y su distribución.
- Solicitudes por segundo (RPS).
- Total de solicitudes.
- Latencias promedio y percentiles (p90 y p95).
- Porcentaje y cantidad de errores.
- Consumo de recursos del backend y la base de datos.

Los umbrales de latencia, duración y porcentaje de errores todavía deben definirse y aprobarse antes de realizar la validación final.

## 5. Conclusión

El Sprint 2 cuenta con evidencia de pruebas unitarias aprobadas, verificaciones funcionales del flujo de matrícula, revisión visual de Swagger y pruebas preliminares de rendimiento del endpoint de salud.

Sin embargo, la validación integral todavía está pendiente. En particular, no se ha demostrado la integridad bajo concurrencia ni la capacidad de atender 2.000 usuarios virtuales concurrentes realizando operaciones representativas del sistema.

Por tanto, no se afirma que el sistema cumpla todavía el objetivo de capacidad establecido. La validación final dependerá de ejecutar las pruebas pendientes y registrar sus resultados reproducibles.