# Análisis de base de datos y caché — Sprint 2

**Estado general:** BASE DE DATOS IMPLEMENTADA PARCIALMENTE; ESTRATEGIA DE CACHÉ DOCUMENTADA, PERO PENDIENTE DE IMPLEMENTACIÓN.

## 1. PostgreSQL en Supabase y Prisma

### Estado de implementación

- **PostgreSQL:** base de datos configurada en Supabase y conectada al backend.
- **Prisma:** ORM instalado y configurado. Se utiliza Prisma 7.10.1 con el adaptador PostgreSQL.
- **Modelo de datos:** schema de Prisma definido con 17 modelos de aplicación.
- **Migraciones:** tres migraciones aplicadas correctamente en la base de datos.
- **Persistencia:** servicio de Prisma integrado en el módulo principal de NestJS.
- **Verificación:** `prisma migrate status` confirmó que el esquema de la base de datos está actualizado.

### Estrategia de persistencia

PostgreSQL es la fuente de verdad para solicitudes, estados, vacantes, matrículas, usuarios y demás entidades persistentes.

Se definieron claves primarias, relaciones, restricciones e índices en el modelo de datos. También se incorporaron restricciones para proteger determinadas condiciones de integridad, como la capacidad y ocupación de vacantes.

La aprobación de solicitudes incluye la actualización de la matrícula y de la ocupación de vacantes. El flujo funcional fue probado y se verificó el incremento de vacantes ocupadas después de una aprobación.

**Limitaciones pendientes:**

- Pruebas de integración específicas con PostgreSQL para verificar restricciones, relaciones y transacciones.
- Prueba concurrente de aprobación sobre la última vacante disponible.
- Verificación de rollback ante errores y conflictos.
- Revisión de consultas e índices mediante `EXPLAIN` con datos representativos.
- Confirmación de límites de conexión y configuración de pooling para el entorno de despliegue.

No se afirma que la integridad bajo concurrencia esté completamente demostrada.

## 2. Estrategia inicial de caché en memoria

### Estado

La estrategia de caché está documentada, pero su implementación y medición permanecen pendientes.

Se propone utilizar NestJS Cache Manager con almacenamiento en memoria local del proceso para lecturas repetidas de vacantes y catálogos públicos o configurados.

La duración del TTL debe ser explícita y configurable. Sus valores definitivos se establecerán después de evaluar la frecuencia de actualización y los requisitos de frescura de los datos.

### Límites previstos

- La caché local no se comparte entre procesos o instancias.
- Los datos almacenados se pierden al reiniciar el proceso.
- Cada instancia podría mantener valores diferentes.
- El consumo de memoria requiere límites y observabilidad.
- La invalidación distribuida no está resuelta mediante una caché local.
- Un TTL reduce la ventana de obsolescencia, pero no garantiza consistencia inmediata.
- No se deben almacenar documentos ni observaciones o datos personales en la caché inicial.

### Expiración, invalidación y fallback propuestos

- Las entradas vencerán mediante TTL.
- Se invalidarán las claves afectadas después de crear o actualizar vacantes o modificar configuraciones relacionadas.
- La construcción de claves deberá centralizarse para evitar omisiones.
- Ante un cache miss, se consultará PostgreSQL y se podrá llenar nuevamente la caché.
- Si la caché falla, se evaluará la recuperación mediante PostgreSQL cuando la operación lo permita, registrando el error técnico.
- La aprobación de solicitudes nunca deberá depender de una disponibilidad obtenida exclusivamente desde caché: la disponibilidad debe comprobarse en PostgreSQL dentro de la operación transaccional.

Estas medidas son parte del diseño previsto y no deben presentarse como funcionalidades ya implementadas o probadas.

## 3. Evolución tecnológica

Redis se mantiene como alternativa futura si las pruebas de carga, un despliegue con varias instancias o los requisitos de coherencia demuestran que la caché local es insuficiente.

No se adopta Redis de inicio ni se afirma que sea necesario sin resultados de medición.

## 4. Conclusión

En Sprint 2 se implementó la conexión de PostgreSQL en Supabase, la configuración de Prisma, el modelo de datos y la aplicación de migraciones. También se verificó funcionalmente el flujo de matrícula y la actualización de la ocupación de vacantes.

La caché en memoria permanece como estrategia documentada, pendiente de implementación y validación. Asimismo, faltan pruebas específicas de integración, rollback y concurrencia para demostrar la integridad completa de las operaciones sobre PostgreSQL.