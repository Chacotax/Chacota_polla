PRAGMA foreign_keys = ON;

-- =====================================================
-- ASIGNACIÓN DE GRUPOS MUNDIAL 2026
-- 48 equipos / 12 grupos / 4 equipos por grupo
-- Según el orden actual de id_equipo
-- =====================================================

UPDATE equipos
SET id_grupo_mundial = CASE
  -- Grupo A
  WHEN id_equipo BETWEEN 1 AND 4 THEN 1

  -- Grupo B
  WHEN id_equipo BETWEEN 5 AND 8 THEN 2

  -- Grupo C
  WHEN id_equipo BETWEEN 9 AND 12 THEN 3

  -- Grupo D
  WHEN id_equipo BETWEEN 13 AND 16 THEN 4

  -- Grupo E
  WHEN id_equipo BETWEEN 17 AND 20 THEN 5

  -- Grupo F
  WHEN id_equipo BETWEEN 21 AND 24 THEN 6

  -- Grupo G
  WHEN id_equipo BETWEEN 25 AND 28 THEN 7

  -- Grupo H
  WHEN id_equipo BETWEEN 29 AND 32 THEN 8

  -- Grupo I
  WHEN id_equipo BETWEEN 33 AND 36 THEN 9

  -- Grupo J
  WHEN id_equipo BETWEEN 37 AND 40 THEN 10

  -- Grupo K
  WHEN id_equipo BETWEEN 41 AND 44 THEN 11

  -- Grupo L
  WHEN id_equipo BETWEEN 45 AND 48 THEN 12

  ELSE id_grupo_mundial
END
WHERE id_mundial = 1;

-- Eliminar el grupo "Sin grupo" si ya no está siendo usado
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