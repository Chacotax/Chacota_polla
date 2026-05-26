PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS roles (
  id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  estado INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  nombres TEXT NOT NULL,
  apellidos TEXT,
  email TEXT,
  rol TEXT NOT NULL DEFAULT 'PARTICIPANTE',
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_registro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_login TEXT
);

CREATE TABLE IF NOT EXISTS mundiales (
  id_mundial INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  anio INTEGER NOT NULL,
  paises_sede TEXT,
  fecha_inicio TEXT,
  fecha_fin TEXT,
  estado TEXT NOT NULL DEFAULT 'PLANIFICADO'
);

CREATE TABLE IF NOT EXISTS fases (
  id_fase INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  orden INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS mundial_grupos (
  id_grupo_mundial INTEGER PRIMARY KEY AUTOINCREMENT,
  id_mundial INTEGER NOT NULL,
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  orden INTEGER NOT NULL,
  FOREIGN KEY (id_mundial) REFERENCES mundiales(id_mundial)
);

CREATE TABLE IF NOT EXISTS estadios (
  id_estadio INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  ciudad TEXT,
  pais TEXT,
  capacidad INTEGER,
  latitud REAL,
  longitud REAL,
  api_id TEXT,
  estado INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS equipos (
  id_equipo INTEGER PRIMARY KEY AUTOINCREMENT,
  id_mundial INTEGER NOT NULL,
  id_grupo_mundial INTEGER,
  nombre TEXT NOT NULL,
  nombre_corto TEXT,
  codigo_fifa TEXT,
  bandera_url TEXT,
  confederacion TEXT,
  ranking_fifa INTEGER,
  api_id TEXT,
  confirmado INTEGER NOT NULL DEFAULT 0,
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_sync TEXT,
  FOREIGN KEY (id_mundial) REFERENCES mundiales(id_mundial),
  FOREIGN KEY (id_grupo_mundial) REFERENCES mundial_grupos(id_grupo_mundial)
);

CREATE TABLE IF NOT EXISTS jugadores (
  id_jugador INTEGER PRIMARY KEY AUTOINCREMENT,
  id_equipo INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT,
  nombre_popular TEXT,
  dorsal INTEGER,
  posicion TEXT,
  fecha_nacimiento TEXT,
  altura TEXT,
  peso TEXT,
  foto_url TEXT,
  api_id TEXT,
  confirmado INTEGER NOT NULL DEFAULT 0,
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_sync TEXT,
  FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo)
);

CREATE TABLE IF NOT EXISTS partidos (
  id_partido INTEGER PRIMARY KEY AUTOINCREMENT,
  id_mundial INTEGER NOT NULL,
  id_fase INTEGER NOT NULL,
  id_grupo_mundial INTEGER,
  id_equipo_local INTEGER,
  id_equipo_visitante INTEGER,
  id_estadio INTEGER,
  fecha_hora TEXT,
  ciudad TEXT,
  fase_nombre TEXT,
  grupo_nombre TEXT,
  goles_local INTEGER,
  goles_visitante INTEGER,
  ganador_equipo_id INTEGER,
  estado_partido TEXT NOT NULL DEFAULT 'PENDIENTE',
  api_id TEXT,
  fecha_sync TEXT,
  FOREIGN KEY (id_mundial) REFERENCES mundiales(id_mundial),
  FOREIGN KEY (id_fase) REFERENCES fases(id_fase),
  FOREIGN KEY (id_grupo_mundial) REFERENCES mundial_grupos(id_grupo_mundial),
  FOREIGN KEY (id_equipo_local) REFERENCES equipos(id_equipo),
  FOREIGN KEY (id_equipo_visitante) REFERENCES equipos(id_equipo),
  FOREIGN KEY (id_estadio) REFERENCES estadios(id_estadio)
);

CREATE TABLE IF NOT EXISTS partido_goleadores (
  id_partido_goleador INTEGER PRIMARY KEY AUTOINCREMENT,
  id_partido INTEGER NOT NULL,
  id_jugador INTEGER,
  id_equipo INTEGER,
  minuto INTEGER,
  tipo_gol TEXT DEFAULT 'NORMAL',
  api_id TEXT,
  FOREIGN KEY (id_partido) REFERENCES partidos(id_partido),
  FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador),
  FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo)
);

CREATE TABLE IF NOT EXISTS partido_eventos (
  id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
  id_partido INTEGER NOT NULL,
  id_equipo INTEGER,
  id_jugador INTEGER,
  minuto INTEGER,
  tipo_evento TEXT NOT NULL,
  descripcion TEXT,
  api_id TEXT,
  FOREIGN KEY (id_partido) REFERENCES partidos(id_partido)
);

CREATE TABLE IF NOT EXISTS grupos_polla (
  id_grupo INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  codigo_invitacion TEXT NOT NULL UNIQUE,
  id_administrador INTEGER NOT NULL,
  max_participantes INTEGER NOT NULL DEFAULT 10,
  monto_apuesta REAL DEFAULT 0,
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_registro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administrador) REFERENCES usuarios(id_usuario)
);

CREATE TABLE IF NOT EXISTS grupo_participantes (
  id_grupo_participante INTEGER PRIMARY KEY AUTOINCREMENT,
  id_grupo INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  rol_grupo TEXT NOT NULL DEFAULT 'PARTICIPANTE',
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_union TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES grupos_polla(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  UNIQUE (id_grupo, id_usuario)
);

CREATE TABLE IF NOT EXISTS predicciones (
  id_prediccion INTEGER PRIMARY KEY AUTOINCREMENT,
  id_grupo INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  id_partido INTEGER NOT NULL,
  equipo_ganador_predicho INTEGER,
  goles_local_predicho INTEGER,
  goles_visitante_predicho INTEGER,
  estado INTEGER NOT NULL DEFAULT 1,
  bloqueado INTEGER NOT NULL DEFAULT 0,
  fecha_registro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TEXT,
  FOREIGN KEY (id_grupo) REFERENCES grupos_polla(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_partido) REFERENCES partidos(id_partido),
  UNIQUE (id_grupo, id_usuario, id_partido)
);

CREATE TABLE IF NOT EXISTS prediccion_goleadores (
  id_prediccion_goleador INTEGER PRIMARY KEY AUTOINCREMENT,
  id_prediccion INTEGER NOT NULL,
  id_jugador INTEGER NOT NULL,
  goles_predichos INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (id_prediccion) REFERENCES predicciones(id_prediccion),
  FOREIGN KEY (id_jugador) REFERENCES jugadores(id_jugador),
  UNIQUE (id_prediccion, id_jugador)
);

CREATE TABLE IF NOT EXISTS puntajes (
  id_puntaje INTEGER PRIMARY KEY AUTOINCREMENT,
  id_grupo INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  id_partido INTEGER NOT NULL,
  total_puntos INTEGER NOT NULL DEFAULT 0,
  fecha_calculo TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_grupo) REFERENCES grupos_polla(id_grupo),
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_partido) REFERENCES partidos(id_partido),
  UNIQUE (id_grupo, id_usuario, id_partido)
);

CREATE TABLE IF NOT EXISTS puntaje_detalle (
  id_puntaje_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
  id_puntaje INTEGER NOT NULL,
  criterio TEXT NOT NULL,
  puntos INTEGER NOT NULL DEFAULT 0,
  descripcion TEXT,
  FOREIGN KEY (id_puntaje) REFERENCES puntajes(id_puntaje)
);

CREATE TABLE IF NOT EXISTS api_config (
  id_api_config INTEGER PRIMARY KEY AUTOINCREMENT,
  proveedor TEXT NOT NULL,
  base_url TEXT NOT NULL,
  api_key_alias TEXT,
  estado INTEGER NOT NULL DEFAULT 1,
  fecha_registro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS api_sync_log (
  id_sync INTEGER PRIMARY KEY AUTOINCREMENT,
  proveedor TEXT NOT NULL,
  tipo_sync TEXT NOT NULL,
  estado TEXT NOT NULL,
  mensaje TEXT,
  fecha_inicio TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_fin TEXT
);

CREATE INDEX IF NOT EXISTS idx_usuarios_usuario ON usuarios(usuario);
CREATE INDEX IF NOT EXISTS idx_equipos_grupo ON equipos(id_grupo_mundial);
CREATE INDEX IF NOT EXISTS idx_partidos_fecha ON partidos(fecha_hora);
CREATE INDEX IF NOT EXISTS idx_grupos_codigo ON grupos_polla(codigo_invitacion);
CREATE INDEX IF NOT EXISTS idx_ranking_grupo ON puntajes(id_grupo, id_usuario);
