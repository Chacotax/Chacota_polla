# Chacota Polla Backend V2

Backend serverless para Cloudflare Workers + D1.

## Cambios V2

- Login por `usuario`, no por email.
- Contraseña hasheada con `salt + SHA-256`.
- Grupos creados por administrador.
- Usuarios se unen a grupos usando `codigo_invitacion`.
- Administrador puede aumentar o reducir `max_participantes`.
- Mapa del Mundial: grupos, equipos, fixture, sedes y fases.
- Estructura lista para sincronizar equipos, partidos y jugadores desde API externa.
- Carga manual conservada por si la API falla.

## Instalación

```bash
npm install
```

## Crear BD

```bash
npm run d1:create
```

Copia el `database_id` en `wrangler.toml`.

## Reset remoto completo

```bash
npm run d1:reset
```

## Desplegar

```bash
npm run deploy
```

## Usuario inicial

```txt
usuario: admin
password: Admin123*
```

La contraseña se valida contra un hash SHA-256 con salt incluido en el seed.

## Endpoints principales

```txt
POST /api/auth/login
GET  /api/auth/me

GET  /api/mundial/mapa
GET  /api/mundial/grupos
GET  /api/mundial/fixture

GET  /api/equipos
GET  /api/jugadores?equipo=1
GET  /api/partidos

POST /api/grupos
GET  /api/grupos/mis-grupos?usuario=1
POST /api/grupos/unirse
PUT  /api/grupos/:id/cupo

POST /api/predicciones
GET  /api/grupos/:id/ranking

POST /api/admin/sync/equipos
POST /api/admin/sync/partidos
POST /api/admin/sync/jugadores
```

## Login ejemplo

```bash
curl -X POST https://TU_WORKER.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"admin","password":"Admin123*"}'
```
