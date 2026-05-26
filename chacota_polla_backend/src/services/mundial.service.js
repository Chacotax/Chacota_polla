export async function obtenerMapaMundial(db) {
  const mundial = await db.prepare("SELECT * FROM mundiales WHERE id_mundial = 1").first();

  const gruposRs = await db.prepare(
    `SELECT * FROM mundial_grupos WHERE id_mundial = 1 ORDER BY orden`
  ).all();

  const equiposRs = await db.prepare(
    `SELECT e.*, mg.codigo AS grupo_codigo, mg.nombre AS grupo_nombre
     FROM equipos e
     LEFT JOIN mundial_grupos mg ON mg.id_grupo_mundial = e.id_grupo_mundial
     WHERE e.id_mundial = 1 AND e.estado = 1
     ORDER BY mg.orden, e.nombre`
  ).all();

  const partidosRs = await db.prepare(
    `SELECT p.*,
            el.nombre AS equipo_local,
            ev.nombre AS equipo_visitante,
            el.bandera_url AS bandera_local,
            ev.bandera_url AS bandera_visitante,
            es.nombre AS estadio,
            f.nombre AS fase
     FROM partidos p
     LEFT JOIN equipos el ON el.id_equipo = p.id_equipo_local
     LEFT JOIN equipos ev ON ev.id_equipo = p.id_equipo_visitante
     LEFT JOIN estadios es ON es.id_estadio = p.id_estadio
     LEFT JOIN fases f ON f.id_fase = p.id_fase
     WHERE p.id_mundial = 1
     ORDER BY p.fecha_hora`
  ).all();

  const grupos = (gruposRs.results || []).map(g => ({
    ...g,
    equipos: (equiposRs.results || []).filter(e => e.id_grupo_mundial === g.id_grupo_mundial)
  }));

  const fases = {};
  for (const p of partidosRs.results || []) {
    const key = p.fase || p.fase_nombre || "Sin fase";
    if (!fases[key]) fases[key] = [];
    fases[key].push(p);
  }

  return {
    mundial,
    grupos,
    fixture: partidosRs.results || [],
    fases
  };
}
