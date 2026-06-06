import { first, run } from "../utils/sql.js";

function normalizarEstadoPartido(estado) {
  return String(estado || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function partidoPermitePrediccion(estado) {
  const estadoNormalizado = normalizarEstadoPartido(estado);

  return [
    "PENDIENTE",
    "NOT_STARTED",
    "NOTSTARTED",
    "NS"
  ].includes(estadoNormalizado);
}

function parseFechaPartidoPeru(fechaHora) {
  if (!fechaHora) return null;

  const raw = String(fechaHora).trim();
  if (!raw) return null;

  if (raw.includes("T") && /Z$|[+-]\d{2}:\d{2}$/.test(raw)) {
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const normalizada = raw.replace(" ", "T");
  const date = new Date(`${normalizada}-05:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function partidoAunNoInicio(fechaHora, minutosBloqueo = 60) {
  const fechaPartido = parseFechaPartidoPeru(fechaHora);

  if (!fechaPartido) return true;

  const ahora = new Date();
  const limite = new Date(fechaPartido.getTime() - minutosBloqueo * 60 * 1000);

  return ahora < limite;
}

function puedeGuardarPrediccion(partido) {
  return (
    partidoPermitePrediccion(partido.estado_partido) &&
    partidoAunNoInicio(partido.fecha_hora, 60)
  );
}

function calcularEquipoGanadorPredicho(
  golesLocal,
  golesVisitante,
  idEquipoLocal,
  idEquipoVisitante
) {
  const gl = Number(golesLocal);
  const gv = Number(golesVisitante);

  if (Number.isNaN(gl) || Number.isNaN(gv)) {
    return null;
  }

  if (gl > gv) return idEquipoLocal;
  if (gv > gl) return idEquipoVisitante;

  return null;
}

function normalizarGoleadoresPayload(goleadores = []) {
  const ids = [];

  for (const g of goleadores || []) {
    const idJugador = typeof g === "object" ? g.id_jugador : g;
    const numero = Number(idJugador);

    if (numero && !ids.includes(numero)) {
      ids.push(numero);
    }
  }

  return ids;
}

function normalizarGoleadoresBD(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((x) => Number(x))
    .filter(Boolean);
}

function resultadoReal(partido) {
  const gl = Number(partido.goles_local);
  const gv = Number(partido.goles_visitante);

  if (Number.isNaN(gl) || Number.isNaN(gv)) return null;
  if (gl > gv) return Number(partido.id_equipo_local);
  if (gv > gl) return Number(partido.id_equipo_visitante);

  return null;
}

function resultadoPredicho(prediccion, partido) {
  const gl = Number(prediccion.goles_local_predicho);
  const gv = Number(prediccion.goles_visitante_predicho);

  if (Number.isNaN(gl) || Number.isNaN(gv)) return null;
  if (gl > gv) return Number(partido.id_equipo_local);
  if (gv > gl) return Number(partido.id_equipo_visitante);

  return null;
}

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

  const goleadoresNormalizados = normalizarGoleadoresPayload(goleadores);

  if (goleadoresNormalizados.length > 3) {
    throw new Error("Solo puedes seleccionar hasta 3 jugadores goleadores.");
  }

  const participante = await first(
    db,
    `SELECT id_grupo_participante
     FROM grupo_participantes
     WHERE id_grupo = ?
       AND id_usuario = ?
       AND estado = 1`,
    [id_grupo, id_usuario]
  );

  if (!participante) {
    throw new Error("El usuario no pertenece a este grupo.");
  }

  const partido = await first(
    db,
    `SELECT *
     FROM partidos
     WHERE id_partido = ?`,
    [id_partido]
  );

  if (!partido) {
    throw new Error("Partido no encontrado.");
  }

  if (!puedeGuardarPrediccion(partido)) {
    throw new Error("La predicción está cerrada. El partido ya inició o está por iniciar.");
  }

  const ganadorCalculado = calcularEquipoGanadorPredicho(
    goles_local_predicho,
    goles_visitante_predicho,
    partido.id_equipo_local,
    partido.id_equipo_visitante
  );

  const ganadorFinal =
    equipo_ganador_predicho !== null &&
    equipo_ganador_predicho !== undefined &&
    equipo_ganador_predicho !== ""
      ? equipo_ganador_predicho
      : ganadorCalculado;

  const existente = await first(
    db,
    `SELECT id_prediccion
     FROM predicciones
     WHERE id_grupo = ?
       AND id_usuario = ?
       AND id_partido = ?
       AND estado = 1`,
    [id_grupo, id_usuario, id_partido]
  );

  let id_prediccion;

  if (existente) {
    id_prediccion = existente.id_prediccion;

    await run(
      db,
      `UPDATE predicciones
       SET equipo_ganador_predicho = ?,
           goles_local_predicho = ?,
           goles_visitante_predicho = ?,
           fecha_actualizacion = datetime('now', '-5 hours')
       WHERE id_prediccion = ?`,
      [
        ganadorFinal,
        goles_local_predicho,
        goles_visitante_predicho,
        id_prediccion
      ]
    );

    await run(
      db,
      `DELETE FROM prediccion_goleadores
       WHERE id_prediccion = ?`,
      [id_prediccion]
    );
  } else {
    const result = await run(
      db,
      `INSERT INTO predicciones
       (
         id_grupo,
         id_usuario,
         id_partido,
         equipo_ganador_predicho,
         goles_local_predicho,
         goles_visitante_predicho,
         fecha_registro
       )
       VALUES (?, ?, ?, ?, ?, ?, datetime('now', '-5 hours'))`,
      [
        id_grupo,
        id_usuario,
        id_partido,
        ganadorFinal,
        goles_local_predicho,
        goles_visitante_predicho
      ]
    );

    id_prediccion = result.meta.last_row_id;
  }

  for (const idJugador of goleadoresNormalizados) {
    await run(
      db,
      `INSERT OR IGNORE INTO prediccion_goleadores
       (
         id_prediccion,
         id_jugador,
         goles_predichos
       )
       VALUES (?, ?, 1)`,
      [id_prediccion, idJugador]
    );
  }

  return {
    id_prediccion,
    equipo_ganador_predicho: ganadorFinal,
    goleadores: goleadoresNormalizados
  };
}

export async function listarMisPredicciones(db, id_usuario, id_grupo = null) {
  if (!id_usuario) {
    throw new Error("Debe enviar id_usuario.");
  }

  const params = [id_usuario];
  let filtroGrupo = "";

  if (id_grupo) {
    filtroGrupo = " AND p.id_grupo = ? ";
    params.push(id_grupo);
  }

  const rs = await db
    .prepare(
      `SELECT p.id_prediccion,
              p.id_grupo,
              p.id_usuario,
              p.id_partido,
              p.equipo_ganador_predicho,
              p.goles_local_predicho,
              p.goles_visitante_predicho,
              p.bloqueado,
              p.fecha_registro,
              p.fecha_actualizacion,
              GROUP_CONCAT(pg.id_jugador) AS goleadores
       FROM predicciones p
       LEFT JOIN prediccion_goleadores pg
              ON pg.id_prediccion = p.id_prediccion
       WHERE p.id_usuario = ?
         AND p.estado = 1
         ${filtroGrupo}
       GROUP BY p.id_prediccion
       ORDER BY p.fecha_registro DESC`
    )
    .bind(...params)
    .all();

  return (rs.results || []).map((p) => ({
    ...p,
    goles_local_predicho: Number(p.goles_local_predicho ?? 0),
    goles_visitante_predicho: Number(p.goles_visitante_predicho ?? 0),
    equipo_ganador_predicho:
      p.equipo_ganador_predicho === null ||
      p.equipo_ganador_predicho === undefined
        ? null
        : Number(p.equipo_ganador_predicho),
    goleadores: normalizarGoleadoresBD(p.goleadores)
  }));
}

export async function registrarResultado(db, payload) {
  const {
    id_partido,
    goles_local,
    goles_visitante,
    ganador_equipo_id = null,
    goleadores = []
  } = payload;

  if (!id_partido && id_partido !== 0) {
    throw new Error("Debe enviar id_partido.");
  }

  const ganadorCalculado =
    Number(goles_local) > Number(goles_visitante)
      ? ganador_equipo_id
      : Number(goles_visitante) > Number(goles_local)
        ? ganador_equipo_id
        : null;

  await run(
    db,
    `UPDATE partidos
     SET goles_local = ?,
         goles_visitante = ?,
         ganador_equipo_id = ?,
         estado_partido = 'FINALIZADO'
     WHERE id_partido = ?`,
    [
      goles_local,
      goles_visitante,
      ganadorCalculado,
      id_partido
    ]
  );

  await run(
    db,
    `DELETE FROM partido_goleadores
     WHERE id_partido = ?`,
    [id_partido]
  );

  for (const g of goleadores || []) {
    await run(
      db,
      `INSERT INTO partido_goleadores
       (
         id_partido,
         id_jugador,
         id_equipo,
         minuto,
         tipo_gol
       )
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_partido,
        g.id_jugador || null,
        g.id_equipo || null,
        g.minuto || null,
        g.tipo_gol || "NORMAL"
      ]
    );
  }

  await recalcularPartido(db, id_partido);

  return {
    id_partido,
    recalculado: true
  };
}

export async function recalcularPartido(db, id_partido) {
  const partido = await first(
    db,
    `SELECT *
     FROM partidos
     WHERE id_partido = ?`,
    [id_partido]
  );

  if (!partido || partido.estado_partido !== "FINALIZADO") {
    throw new Error("El partido no está finalizado.");
  }

  const predRs = await db
    .prepare(
      `SELECT *
       FROM predicciones
       WHERE id_partido = ?
         AND estado = 1`
    )
    .bind(id_partido)
    .all();

  const goleadoresRs = await db
    .prepare(
      `SELECT DISTINCT id_jugador
       FROM partido_goleadores
       WHERE id_partido = ?
         AND id_jugador IS NOT NULL`
    )
    .bind(id_partido)
    .all();

  const goleadoresReales = new Set(
    (goleadoresRs.results || []).map((g) => Number(g.id_jugador))
  );

  const ganadorReal = resultadoReal(partido);

  for (const pred of predRs.results || []) {
    let total = 0;
    const detalles = [];

    const predLocal = Number(pred.goles_local_predicho);
    const predVisitante = Number(pred.goles_visitante_predicho);
    const realLocal = Number(partido.goles_local);
    const realVisitante = Number(partido.goles_visitante);

    const marcadorExacto =
      predLocal === realLocal &&
      predVisitante === realVisitante;

    const ganadorPredicho = resultadoPredicho(pred, partido);

    const acertoResultado =
      ganadorPredicho === ganadorReal ||
      (ganadorPredicho === null && ganadorReal === null);

    if (marcadorExacto) {
      total += 5;
      detalles.push([
        "MARCADOR_EXACTO",
        5,
        `Acertó el score exacto: ${realLocal} - ${realVisitante}`
      ]);
    } else if (acertoResultado) {
      total += 3;
      detalles.push([
        "RESULTADO",
        3,
        "Acertó el resultado del partido"
      ]);
    } else {
      detalles.push([
        "RESULTADO",
        0,
        "No acertó el resultado del partido"
      ]);
    }

    const predGolsRs = await db
      .prepare(
        `SELECT pg.id_jugador,
                COALESCE(j.nombre_popular, TRIM(COALESCE(j.nombre, '') || ' ' || COALESCE(j.apellido, ''))) AS jugador
         FROM prediccion_goleadores pg
         LEFT JOIN jugadores j
                ON j.id_jugador = pg.id_jugador
         WHERE pg.id_prediccion = ?`
      )
      .bind(pred.id_prediccion)
      .all();

    for (const pg of predGolsRs.results || []) {
      const idJugador = Number(pg.id_jugador);
      const nombreJugador = pg.jugador || `Jugador ${idJugador}`;

      if (goleadoresReales.has(idJugador)) {
        total += 1;
        detalles.push([
          "GOLEADOR_ACERTADO",
          1,
          `Acertó goleador: ${nombreJugador}`
        ]);
      } else {
        total -= 1;
        detalles.push([
          "GOLEADOR_FALLADO",
          -1,
          `No acertó goleador: ${nombreJugador}`
        ]);
      }
    }

    const existing = await first(
      db,
      `SELECT id_puntaje
       FROM puntajes
       WHERE id_grupo = ?
         AND id_usuario = ?
         AND id_partido = ?`,
      [pred.id_grupo, pred.id_usuario, pred.id_partido]
    );

    let id_puntaje;

    if (existing) {
      id_puntaje = existing.id_puntaje;

      await run(
        db,
        `UPDATE puntajes
         SET total_puntos = ?,
             fecha_calculo = datetime('now', '-5 hours')
         WHERE id_puntaje = ?`,
        [total, id_puntaje]
      );

      await run(
        db,
        `DELETE FROM puntaje_detalle
         WHERE id_puntaje = ?`,
        [id_puntaje]
      );
    } else {
      const result = await run(
        db,
        `INSERT INTO puntajes
         (
           id_grupo,
           id_usuario,
           id_partido,
           total_puntos,
           fecha_calculo
         )
         VALUES (?, ?, ?, ?, datetime('now', '-5 hours'))`,
        [pred.id_grupo, pred.id_usuario, pred.id_partido, total]
      );

      id_puntaje = result.meta.last_row_id;
    }

    for (const [criterio, puntos, descripcion] of detalles) {
      await run(
        db,
        `INSERT INTO puntaje_detalle
         (
           id_puntaje,
           criterio,
           puntos,
           descripcion
         )
         VALUES (?, ?, ?, ?)`,
        [id_puntaje, criterio, puntos, descripcion]
      );
    }
  }

  return {
    id_partido,
    predicciones_recalculadas: (predRs.results || []).length
  };
}

export async function rankingGrupo(db, id_grupo) {
  const rs = await db
    .prepare(
      `SELECT u.id_usuario,
              u.usuario,
              u.nombres,
              u.apellidos,
              COALESCE(puntos.total_puntos, 0) AS puntos,
              COALESCE(preds.predicciones, 0) AS predicciones
       FROM grupo_participantes gp
       INNER JOIN usuarios u
               ON u.id_usuario = gp.id_usuario
       LEFT JOIN (
              SELECT id_grupo,
                     id_usuario,
                     SUM(total_puntos) AS total_puntos
              FROM puntajes
              WHERE id_grupo = ?
              GROUP BY id_grupo, id_usuario
       ) puntos
              ON puntos.id_grupo = gp.id_grupo
             AND puntos.id_usuario = gp.id_usuario
       LEFT JOIN (
              SELECT id_grupo,
                     id_usuario,
                     COUNT(DISTINCT id_prediccion) AS predicciones
              FROM predicciones
              WHERE id_grupo = ?
                AND estado = 1
              GROUP BY id_grupo, id_usuario
       ) preds
              ON preds.id_grupo = gp.id_grupo
             AND preds.id_usuario = gp.id_usuario
       WHERE gp.id_grupo = ?
         AND gp.estado = 1
       ORDER BY puntos DESC,
                predicciones DESC,
                u.usuario ASC`
    )
    .bind(id_grupo, id_grupo, id_grupo)
    .all();

  return (rs.results || []).map((r, index) => ({
    posicion: index + 1,
    ...r,
    puntos: Number(r.puntos || 0),
    predicciones: Number(r.predicciones || 0)
  }));
}

export async function rankingGeneralEmpresa(db) {
  const rs = await db
    .prepare(
      `SELECT
          u.id_usuario,
          u.usuario,
          u.nombres,
          u.apellidos,
          COALESCE(SUM(p.total_puntos), 0) AS puntos,
          COUNT(DISTINCT p.id_partido) AS partidos_puntuados,
          COUNT(DISTINCT pr.id_prediccion) AS predicciones,
          COUNT(DISTINCT gp.id_grupo) AS grupos_participa
       FROM usuarios u
       INNER JOIN grupo_participantes gp
               ON gp.id_usuario = u.id_usuario
              AND gp.estado = 1
       LEFT JOIN puntajes p
              ON p.id_usuario = u.id_usuario
             AND p.id_grupo = gp.id_grupo
       LEFT JOIN predicciones pr
              ON pr.id_usuario = u.id_usuario
             AND pr.id_grupo = gp.id_grupo
             AND pr.estado = 1
       WHERE u.estado = 1
       GROUP BY u.id_usuario
       ORDER BY puntos DESC,
                predicciones DESC,
                u.usuario ASC`
    )
    .all();

  return (rs.results || []).map((r, index) => ({
    posicion: index + 1,
    id_usuario: Number(r.id_usuario),
    usuario: r.usuario,
    nombres: r.nombres,
    apellidos: r.apellidos,
    puntos: Number(r.puntos || 0),
    partidos_puntuados: Number(r.partidos_puntuados || 0),
    predicciones: Number(r.predicciones || 0),
    grupos_participa: Number(r.grupos_participa || 0)
  }));
}

export async function listarGoleadoresPartido(db, id_partido) {
  if (!id_partido) {
    throw new Error("Debe enviar id_partido.");
  }

  const rs = await db
    .prepare(
      `SELECT
          pg.id_partido_goleador,
          pg.id_partido,
          pg.id_jugador,
          pg.id_equipo,
          pg.minuto,
          pg.tipo_gol,
          j.nombre,
          j.apellido,
          j.nombre_popular,
          j.dorsal,
          e.nombre AS equipo
       FROM partido_goleadores pg
       LEFT JOIN jugadores j
              ON j.id_jugador = pg.id_jugador
       LEFT JOIN equipos e
              ON e.id_equipo = pg.id_equipo
       WHERE pg.id_partido = ?
       ORDER BY
          CASE WHEN pg.minuto IS NULL THEN 999 ELSE pg.minuto END,
          pg.id_partido_goleador ASC`
    )
    .bind(id_partido)
    .all();

  return (rs.results || []).map((g) => ({
    id_partido_goleador: Number(g.id_partido_goleador),
    id_partido: Number(g.id_partido),
    id_jugador: g.id_jugador ? Number(g.id_jugador) : null,
    id_equipo: g.id_equipo ? Number(g.id_equipo) : null,
    minuto: g.minuto ?? "",
    tipo_gol: g.tipo_gol || "NORMAL",
    nombre:
      g.nombre_popular ||
      [g.nombre, g.apellido].filter(Boolean).join(" ") ||
      "Jugador",
    equipo: g.equipo || "Equipo"
  }));
}

export async function rankingGeneralGrupos(db) {
  const rs = await db
    .prepare(
      `SELECT g.id_grupo,
              g.nombre AS grupo,
              COUNT(DISTINCT gp.id_usuario) AS cantidad_jugadores,
              COALESCE(SUM(puntos.total_puntos), 0) AS total_puntos,
              COALESCE(SUM(preds.predicciones), 0) AS total_predicciones
       FROM grupos_polla g
       LEFT JOIN grupo_participantes gp
              ON gp.id_grupo = g.id_grupo
             AND gp.estado = 1
       LEFT JOIN (
              SELECT id_grupo,
                     id_usuario,
                     SUM(total_puntos) AS total_puntos
              FROM puntajes
              GROUP BY id_grupo, id_usuario
       ) puntos
              ON puntos.id_grupo = gp.id_grupo
             AND puntos.id_usuario = gp.id_usuario
       LEFT JOIN (
              SELECT id_grupo,
                     id_usuario,
                     COUNT(DISTINCT id_prediccion) AS predicciones
              FROM predicciones
              WHERE estado = 1
              GROUP BY id_grupo, id_usuario
       ) preds
              ON preds.id_grupo = gp.id_grupo
             AND preds.id_usuario = gp.id_usuario
       WHERE g.estado = 1
       GROUP BY g.id_grupo, g.nombre
       ORDER BY
         CASE
           WHEN COUNT(DISTINCT gp.id_usuario) = 0 THEN 0
           ELSE COALESCE(SUM(puntos.total_puntos), 0) * 1.0 / COUNT(DISTINCT gp.id_usuario)
         END DESC,
         total_puntos DESC,
         cantidad_jugadores DESC,
         g.nombre ASC`
    )
    .all();

  return (rs.results || []).map((r, index) => {
    const cantidadJugadores = Number(r.cantidad_jugadores || 0);
    const totalPuntos = Number(r.total_puntos || 0);

    return {
      posicion: index + 1,
      id_grupo: r.id_grupo,
      grupo: r.grupo,
      cantidad_jugadores: cantidadJugadores,
      total_puntos: totalPuntos,
      promedio_puntos:
        cantidadJugadores === 0
          ? 0
          : Number((totalPuntos / cantidadJugadores).toFixed(2)),
      total_predicciones: Number(r.total_predicciones || 0)
    };
  });
}