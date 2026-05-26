PRAGMA foreign_keys = OFF;

DELETE FROM puntaje_detalle;
DELETE FROM puntajes;

DELETE FROM prediccion_goleadores;
DELETE FROM predicciones;

DELETE FROM partido_goleadores;
DELETE FROM partido_eventos;
DELETE FROM partidos;

DELETE FROM jugadores;
DELETE FROM equipos;

DELETE FROM grupo_participantes;
DELETE FROM grupos_polla;

DELETE FROM usuarios;

DELETE FROM api_sync_log;
DELETE FROM api_config;

DELETE FROM estadios;
DELETE FROM fases;
DELETE FROM mundial_grupos;
DELETE FROM mundiales;

DELETE FROM sqlite_sequence
WHERE name IN (
  'puntaje_detalle',
  'puntajes',
  'prediccion_goleadores',
  'predicciones',
  'partido_goleadores',
  'partido_eventos',
  'partidos',
  'jugadores',
  'equipos',
  'grupo_participantes',
  'grupos_polla',
  'usuarios',
  'api_sync_log',
  'api_config',
  'estadios',
  'fases',
  'mundial_grupos',
  'mundiales'
);

PRAGMA foreign_keys = ON;