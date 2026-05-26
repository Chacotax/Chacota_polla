PRAGMA foreign_keys = ON;

-- =====================================================
-- ASIGNACIÓN OFICIAL DE GRUPOS MUNDIAL 2026
-- Tabla: equipos
-- Campo a actualizar: id_grupo_mundial
-- =====================================================

-- Primero limpiamos asignaciones incorrectas tipo SIN_GRUPO
UPDATE equipos
SET id_grupo_mundial = NULL
WHERE id_mundial = 1;

-- =========================
-- GRUPO A
-- Mexico, South Africa, Korea Republic, Czechia
-- =========================
UPDATE equipos
SET id_grupo_mundial = 1
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'mexico',
    'south africa',
    'korea republic',
    'czechia'
  );

-- =========================
-- GRUPO B
-- Canada, Bosnia-Herzegovina, Qatar, Switzerland
-- =========================
UPDATE equipos
SET id_grupo_mundial = 2
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'canada',
    'bosnia-herzegovina',
    'bosnia herzegovina',
    'qatar',
    'switzerland'
  );

-- =========================
-- GRUPO C
-- Brazil, Morocco, Haiti, Scotland
-- =========================
UPDATE equipos
SET id_grupo_mundial = 3
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'brazil',
    'morocco',
    'haiti',
    'scotland'
  );

-- =========================
-- GRUPO D
-- United States, Paraguay, Australia, Türkiye
-- =========================
UPDATE equipos
SET id_grupo_mundial = 4
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'united states',
    'usa',
    'paraguay',
    'australia',
    'türkiye',
    'turkiye',
    'turkey'
  );

-- =========================
-- GRUPO E
-- Germany, Curaçao, Ivory Coast, Ecuador
-- =========================
UPDATE equipos
SET id_grupo_mundial = 5
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'germany',
    'curaçao',
    'curacao',
    'ivory coast',
    'côte d’ivoire',
    'cote d''ivoire',
    'ecuador'
  );

-- =========================
-- GRUPO F
-- Netherlands, Japan, Sweden, Tunisia
-- =========================
UPDATE equipos
SET id_grupo_mundial = 6
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'netherlands',
    'japan',
    'sweden',
    'tunisia'
  );

-- =========================
-- GRUPO G
-- Belgium, Egypt, Iran, New Zealand
-- =========================
UPDATE equipos
SET id_grupo_mundial = 7
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'belgium',
    'egypt',
    'iran',
    'ir iran',
    'new zealand'
  );

-- =========================
-- GRUPO H
-- Spain, Cabo Verde, Saudi Arabia, Uruguay
-- =========================
UPDATE equipos
SET id_grupo_mundial = 8
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'spain',
    'cabo verde',
    'cape verde',
    'saudi arabia',
    'uruguay'
  );

-- =========================
-- GRUPO I
-- France, Senegal, Iraq, Norway
-- =========================
UPDATE equipos
SET id_grupo_mundial = 9
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'france',
    'senegal',
    'iraq',
    'norway'
  );

-- =========================
-- GRUPO J
-- Argentina, Algeria, Austria, Jordan
-- =========================
UPDATE equipos
SET id_grupo_mundial = 10
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'argentina',
    'algeria',
    'austria',
    'jordan'
  );

-- =========================
-- GRUPO K
-- Portugal, Uzbekistan, Colombia, Congo DR
-- =========================
UPDATE equipos
SET id_grupo_mundial = 11
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'portugal',
    'uzbekistan',
    'colombia',
    'congo dr',
    'dr congo',
    'congo democratic republic'
  );

-- =========================
-- GRUPO L
-- England, Ghana, Croatia, Panama
-- =========================
UPDATE equipos
SET id_grupo_mundial = 12
WHERE id_mundial = 1
  AND LOWER(TRIM(nombre)) IN (
    'england',
    'ghana',
    'croatia',
    'panama'
  );



-- Eliminamos SIN_GRUPO si ya no se usa
DELETE FROM mundial_grupos
WHERE codigo = 'SIN_GRUPO'
  AND id_grupo_mundial NOT IN (
    SELECT DISTINCT id_grupo_mundial
    FROM equipos
    WHERE id_grupo_mundial IS NOT NULL

    UNION

    SELECT DISTINCT id_grupo_mundial
    FROM partidos
    WHERE id_grupo_mundial IS NOT NULL
  );