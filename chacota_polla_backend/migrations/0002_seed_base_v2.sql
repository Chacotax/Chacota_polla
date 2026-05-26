PRAGMA foreign_keys = ON;

INSERT OR IGNORE INTO roles (nombre, descripcion) VALUES
('ADMIN', 'Administrador general del sistema'),
('ORGANIZADOR', 'Creador o administrador de grupo de polla'),
('PARTICIPANTE', 'Usuario participante');

INSERT OR IGNORE INTO usuarios (
  id_usuario,
  usuario,
  password_hash,
  password_salt,
  nombres,
  apellidos,
  email,
  rol,
  estado
) VALUES (
  1,
  'admin',
  'f849f611f6f29b098afed9c564593463122717fe55f9dc8f945fe1e2edd54921',
  'chacota-admin-salt-v2',
  'Administrador',
  'Chacota',
  'admin@chacota.pe',
  'ADMIN',
  1
);

INSERT OR IGNORE INTO mundiales (
  id_mundial,
  nombre,
  anio,
  paises_sede,
  fecha_inicio,
  fecha_fin,
  estado
)
VALUES (
  1,
  'Copa Mundial FIFA 2026',
  2026,
  'Estados Unidos, México y Canadá',
  '2026-06-11',
  '2026-07-19',
  'PLANIFICADO'
);

INSERT OR IGNORE INTO fases (
  id_fase,
  codigo,
  nombre,
  orden
) VALUES
(1, 'GRUPOS', 'Fase de grupos', 1),
(2, 'DIECISEISAVOS', 'Dieciseisavos de final', 2),
(3, 'OCTAVOS', 'Octavos de final', 3),
(4, 'CUARTOS', 'Cuartos de final', 4),
(5, 'SEMIFINAL', 'Semifinal', 5),
(6, 'TERCER_PUESTO', 'Tercer puesto', 6),
(7, 'FINAL', 'Final', 7);

INSERT OR IGNORE INTO mundial_grupos (
  id_grupo_mundial,
  id_mundial,
  codigo,
  nombre,
  orden
) VALUES
(1, 1, 'A', 'Grupo A', 1),
(2, 1, 'B', 'Grupo B', 2),
(3, 1, 'C', 'Grupo C', 3),
(4, 1, 'D', 'Grupo D', 4),
(5, 1, 'E', 'Grupo E', 5),
(6, 1, 'F', 'Grupo F', 6),
(7, 1, 'G', 'Grupo G', 7),
(8, 1, 'H', 'Grupo H', 8),
(9, 1, 'I', 'Grupo I', 9),
(10, 1, 'J', 'Grupo J', 10),
(11, 1, 'K', 'Grupo K', 11),
(12, 1, 'L', 'Grupo L', 12);

INSERT OR IGNORE INTO estadios (
  id_estadio,
  nombre,
  ciudad,
  pais,
  capacidad,
  estado
) VALUES (
  1,
  'Estadio por confirmar',
  'Por confirmar',
  'Por confirmar',
  NULL,
  1
);

INSERT OR IGNORE INTO grupos_polla (
  id_grupo,
  nombre,
  descripcion,
  codigo_invitacion,
  id_administrador,
  max_participantes,
  monto_apuesta,
  estado
)
VALUES (
  1,
  'Polla Chacota Principal',
  'Grupo inicial para pruebas administrativas',
  'CHACOTA2026',
  1,
  20,
  0,
  1
);

INSERT OR IGNORE INTO grupo_participantes (
  id_grupo,
  id_usuario,
  rol_grupo,
  estado
)
VALUES (
  1,
  1,
  'ADMIN_GRUPO',
  1
);

INSERT OR IGNORE INTO api_config (
  proveedor,
  base_url,
  api_key_alias,
  estado
)
VALUES (
  'apifootball',
  'https://apiv3.apifootball.com/',
  'APIFOOTBALL_KEY',
  1
);