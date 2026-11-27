# Evidencias de Sprint 2

Esta carpeta reúne las evidencias de implementación y validación del Sprint 2.

**Estado general:** evidencias disponibles parcialmente. Se han ejecutado pruebas funcionales, unitarias y preliminares de rendimiento. Algunas validaciones adicionales continúan pendientes.

## 1. Organización de evidencias

- `01-postman/`: verificaciones funcionales de los endpoints REST y colección exportada en formato Postman Collection v2.1.
- `02-jest/`: resultados de pruebas automatizadas. Se registraron 7 suites y 32 pruebas aprobadas.
- `03-k6/`: scripts y resultados JSON de pruebas preliminares del endpoint de salud con 5, 20 y 50 usuarios virtuales.
- `04-swagger/`: documentación de Swagger/OpenAPI, con verificación visual de endpoints y autenticación Bearer.

## 2. Evidencias disponibles

- **Jest:** 7 suites y 32 pruebas aprobadas, sin fallos. Resultado conservado en `02-jest/resultado-jest-26-11-2026.txt`.
- **k6:** tres ejecuciones preliminares con resultados JSON para 5, 20 y 50 usuarios virtuales.
- **Postman:** verificaciones funcionales del flujo de matrícula y colección exportada en `01-postman/SistemaMatricula-Postman-Collection.json`.
- **Swagger:** documentación interactiva disponible y verificada visualmente. Captura conservada en `04-swagger/`.

## 3. Actividades pendientes

- Incorporar reportes de cobertura Jest.
- Ejecutar pruebas de integración específicas con PostgreSQL.
- Realizar pruebas de carga con operaciones representativas del sistema hasta el objetivo de 2.000 usuarios concurrentes.
- Ejecutar pruebas de concurrencia sobre la última vacante.
- Exportar y validar automáticamente la especificación OpenAPI.
- Validar la autenticación y autorización de extremo a extremo con usuarios reales de Supabase.

## 4. Consideraciones de seguridad

No incluir secretos, credenciales, tokens de autenticación ni datos personales reales en los archivos de evidencia.

**Conclusión:** el Sprint 2 cuenta con evidencias reproducibles de pruebas unitarias, verificaciones funcionales de API, documentación Swagger y pruebas preliminares de rendimiento. La validación integral todavía requiere completar las actividades pendientes.