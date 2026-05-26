import { first, run } from "../utils/sql.js";

export async function guardarPrediccion(db, payload) {
  const {
    id_grupo,
    id_usuario,
    id_partido,
    equipo_ganador_predicho = null,
    goles_local_predicho = null,
    goles_visitante_predicho = null,
    goleadores = []
  } = payload;

  if (!id_grupo || !id_usuario || !id_partido) {
    throw new Error("Debe enviar id_grupo, id_usuario e id_partido.");
  }

  const participante = await first(
    db,
    "SELECT id_grupo_participante FROM grupo_participantes WHERE id_grupo = ? AND id_usuario = ? AND estado = 1",
    [id_grupo, id_usuario]
  );
  if (!participante) throw new Error("El usuario no pertenece a este grupo.");

  const partido = await first(db, "SELECT * FROM partidos WHERE id_partido = ?", [id_partido]);
  if (!partido) throw new Error("Partido no encontrado.");

  if (partido.estado_partido !== "PENDIENTE") {
    throw new Error("El partido ya inició o finalizó. No se puede modificar la predicción.");
  }

  const existente = await first(
    db,
    "SELECT id_prediccion FROM predicciones WHERE id_grupo = ? AND id_usuario = ? AND id_partido = ?",
    [id_grupo, id_usuario, id_partido]
  );

  let id_prediccion;
  if (existente) {
    id_prediccion = existente.id_prediccion;
    await run(
      db,
      `UPDATE predicciones
       SET equipo_ganador_predicho = ?, goles_local_predicho = ?, goles_visitante_predicho = ?, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id_prediccion = ?`,
      [equipo_ganador_predicho, goles_local_predicho, goles_visitante_predicho, id_prediccion]
    );
    await run(db, "DELETE FROM prediccion_goleadores WHERE id_prediccion = ?", [id_prediccion]);
  } else {
    const result = await run(
      db,
      `INSERT INTO predicciones
       (id_grupo, id_usuario, id_partido, equipo_ganador_predicho, goles_local_predicho, goles_visitante_predicho)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_grupo, id_usuario, id_partido, equipo_ganador_predicho, goles_local_predicho, goles_visitante_predicho]
    );
    id_prediccion = result.meta.last_row_id;
  }

  for (const g of goleadores || []) {
    const idJugador = typeof g === "object" ? g.id_jugador : g;
    const goles = typeof g === "object" ? (g.goles_predichos || 1) : 1;
    if (idJugador) {
      await run(
        db,
        "INSERT OR IGNORE INTO prediccion_goleadores (id_prediccion, id_jugador, goles_predichos) VALUES (?, ?, ?)",
        [id_prediccion, idJugador, goles]
      );
    }
  }

  return { id_prediccion };
}

export async function registrarResultado(db, payload) {
  const {
    id_partido,
    goles_local,
    goles_visitante,
    ganador_equipo_id = null,
    goleadores = []
  } = payload;

  if (!id_partido && id_partido !== 0) throw new Error("Debe enviar id_partido.");

  await run(
    db,
    `UPDATE partidos
     SET goles_local = ?, goles_visitante = ?, ganador_equipo_id = ?, estado_partido = 'FINALIZADO'
     WHERE id_partido = ?`,
    [goles_local, goles_visitante, ganador_equipo_id, id_partido]
  );

  await run(db, "DELETE FROM partido_goleadores WHERE id_partido = ?", [id_partido]);

  for (const g of goleadores || []) {
    await run(
      db,
      `INSERT INTO partido_goleadores (id_partido, id_jugador, id_equipo, minuto, tipo_gol)
       VALUES (?, ?, ?, ?, ?)`,
      [id_partido, g.id_jugador || null, g.id_equipo || null, g.minuto || null, g.tipo_gol || "NORMAL"]
    );
  }

  await recalcularPartido(db, id_partido);
  return { id_partido, recalculado: true };
}

export async function recalcularPartido(db, id_partido) {
  const partido = await first(db, "SELECT * FROM partidos WHERE id_partido = ?", [id_partido]);
  if (!partido || partido.estado_partido !== "FINALIZADO") {
    throw new Error("El partido no está finalizado.");
  }

  const predRs = await db.prepare("SELECT * FROM predicciones WHERE id_partido = ? AND estado = 1").bind(id_partido).all();
  const goleadoresRs = await db.prepare("SELECT id_jugador FROM partido_goleadores WHERE id_partido = ?").bind(id_partido).all();
  const goleadoresReales = new Set((goleadoresRs.results || []).map(g => Number(g.id_jugador)));

  for (const pred of predRs.results || []) {
    let total = 0;
    const detalles = [];

    if (Number(pred.equipo_ganador_predicho) === Number(partido.ganador_equipo_id)) {
      total += 1;
      detalles.push(["GANADOR", 1, "Acertó equipo ganador"]);
    } else {
      detalles.push(["GANADOR", 0, "No acertó equipo ganador"]);
    }

    if (Number(pred.goles_local_predicho) === Number(partido.goles_local)) {
      total += 1;
      detalles.push(["GOLES_LOCAL", 1, "Acertó goles del equipo local"]);
    } else {
      detalles.push(["GOLES_LOCAL", 0, "No acertó goles del equipo local"]);
    }

    if (Number(pred.goles_visitante_predicho) === Number(partido.goles_visitante)) {
      total += 1;
      detalles.push(["GOLES_VISITANTE", 1, "Acertó goles del equipo visitante"]);
    } else {
      detalles.push(["GOLES_VISITANTE", 0, "No acertó goles del equipo visitante"]);
    }

    if (
      Number(pred.goles_local_predicho) === Number(partido.goles_local) &&
      Number(pred.goles_visitante_predicho) === Number(partido.goles_visitante)
    ) {
      total += 1;
      detalles.push(["MARCADOR_EXACTO", 1, "Acertó marcador exacto"]);
    } else {
      detalles.push(["MARCADOR_EXACTO", 0, "No acertó marcador exacto"]);
    }

    const predGolsRs = await db.prepare("SELECT id_jugador FROM prediccion_goleadores WHERE id_prediccion = ?").bind(pred.id_prediccion).all();
    let golesJugador = 0;
    for (const pg of predGolsRs.results || []) {
      if (goleadoresReales.has(Number(pg.id_jugador))) {
        golesJugador += 1;
      }
    }
    total += golesJugador;
    detalles.push(["GOLEADORES", golesJugador, `Acertó ${golesJugador} goleador(es)`]);

    const existing = await first(db, "SELECT id_puntaje FROM puntajes WHERE id_grupo = ? AND id_usuario = ? AND id_partido = ?", [pred.id_grupo, pred.id_usuario, pred.id_partido]);

    let id_puntaje;
    if (existing) {
      id_puntaje = existing.id_puntaje;
      await run(db, "UPDATE puntajes SET total_puntos = ?, fecha_calculo = CURRENT_TIMESTAMP WHERE id_puntaje = ?", [total, id_puntaje]);
      await run(db, "DELETE FROM puntaje_detalle WHERE id_puntaje = ?", [id_puntaje]);
    } else {
      const result = await run(
        db,
        "INSERT INTO puntajes (id_grupo, id_usuario, id_partido, total_puntos) VALUES (?, ?, ?, ?)",
        [pred.id_grupo, pred.id_usuario, pred.id_partido, total]
      );
      id_puntaje = result.meta.last_row_id;
    }

    for (const [criterio, puntos, descripcion] of detalles) {
      await run(
        db,
        "INSERT INTO puntaje_detalle (id_puntaje, criterio, puntos, descripcion) VALUES (?, ?, ?, ?)",
        [id_puntaje, criterio, puntos, descripcion]
      );
    }
  }

  return { id_partido, predicciones_recalculadas: (predRs.results || []).length };
}

export async function rankingGrupo(db, id_grupo) {
  const rs = await db.prepare(
    `SELECT u.id_usuario,
            u.usuario,
            u.nombres,
            u.apellidos,
            COALESCE(SUM(p.total_puntos), 0) AS puntos,
            COUNT(DISTINCT pr.id_prediccion) AS predicciones
     FROM grupo_participantes gp
     INNER JOIN usuarios u ON u.id_usuario = gp.id_usuario
     LEFT JOIN puntajes p ON p.id_grupo = gp.id_grupo AND p.id_usuario = gp.id_usuario
     LEFT JOIN predicciones pr ON pr.id_grupo = gp.id_grupo AND pr.id_usuario = gp.id_usuario
     WHERE gp.id_grupo = ? AND gp.estado = 1
     GROUP BY u.id_usuario
     ORDER BY puntos DESC, predicciones DESC, u.usuario ASC`
  ).bind(id_grupo).all();

  return (rs.results || []).map((r, index) => ({ posicion: index + 1, ...r }));
}
