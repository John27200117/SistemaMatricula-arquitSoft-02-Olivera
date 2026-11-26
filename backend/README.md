# Backend

Backend REST independiente del **Sistema de matrícula y gestión académica**. Se implementa con NestJS, TypeScript y el adaptador HTTP Express, organizado por módulos y capas Clean Architecture. Las entidades de dominio y casos de uso no dependen de NestJS.

## Requisitos

- Node.js LTS (validado localmente con Node `v24.21.0`).
- npm (validado localmente con `11.19.0`; en PowerShell se usan los comandos `npm.cmd`).

## Ejecutar

Desde esta carpeta:

```powershell
npm.cmd install
npm.cmd run start:dev
```

- API de comprobación: `GET http://localhost:3000/api/v1/health`
- Swagger/OpenAPI: `http://localhost:3000/api/docs`

El endpoint de health solo indica que la aplicación está activa; no comprueba PostgreSQL, Supabase ni otros servicios.

## Scripts

```text
npm.cmd run start:dev  # desarrollo con recarga
npm.cmd run build      # compilar
npm.cmd run start:prod # ejecutar la compilación
npm.cmd test           # pruebas Jest
npm.cmd run test:e2e   # prueba HTTP de health
```

## Arquitectura

- `src/modules/`: módulos funcionales organizados por capas `domain`, `application` y `presentation`.
- `src/shared/`: puertos y adaptadores técnicos compartidos.
- `src/main.ts` y `src/bootstrap.ts`: composición y configuración HTTP de NestJS.

El módulo `health` es un ejemplo mínimo; no implica estado de dependencias externas. NestJS usa Express por defecto y el adaptador se selecciona explícitamente. CORS está deshabilitado; se configurará con orígenes concretos al integrar el frontend.

Todavía no se configura Prisma, PostgreSQL, Supabase Auth, caché, almacenamiento de documentos ni lógica institucional de matrícula.

## Documentación del proyecto

- [Índice general](../SDD.md)
- [Especificación funcional del Sprint 2](../sprint-2/05-especificacion-sdd/README.md)
- [Diseño interno de módulos y Clean Architecture (Sprint 1)](../sprint-1/03-diseno-de-software/diseno-interno-de-modulos.md)
