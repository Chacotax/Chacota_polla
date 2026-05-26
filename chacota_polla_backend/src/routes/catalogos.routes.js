import { fail, ok, readBody } from "../utils/response.js";
import { run } from "../utils/sql.js";

export async function catalogosRoutes(request, env, path, method, url) {
  try {
    if (method === "GET" && path === "/api/equipos") {
      const rs = await env.DB.prepare(
        `SELECT e.*, mg.codigo AS grupo_codigo, mg.nombre AS grupo_nombre
         FROM equipos e
         LEFT JOIN mundial_grupos mg ON mg.id_grupo_mundial = e.id_grupo_mundial
         WHERE e.estado = 1
         ORDER BY mg.orden, e.nombre`
      ).all();
      return ok(rs.results || []);
    }

    if (method === "POST" && path === "/api/equipos") {
      const b = await readBody(request);
      const result = await run(
        env.DB,
        `INSERT INTO equipos (id_mundial, id_grupo_mundial, nombre, nombre_corto, codigo_fifa, bandera_url, confederacion, confirmado, estado)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [b.id_grupo_mundial || null, b.nombre, b.nombre_corto || null, b.codigo_fifa || null, b.bandera_url || null, b.confederacion || null, b.confirmado ? 1 : 0]
      );
      return ok({ id_equipo: result.meta.last_row_id }, "Equipo registrado");
    }

    if (method === "GET" && path === "/api/jugadores") {
      const equipo = url.searchParams.get("equipo");
      let sql = `SELECT j.*, e.nombre AS equipo FROM jugadores j INNER JOIN equipos e ON e.id_equipo = j.id_equipo WHERE j.estado = 1`;
      const params = [];
      if (equipo) {
        sql += " AND j.id_equipo = ?";
        params.push(equipo);
      }
      sql += " ORDER BY e.nombre, j.dorsal, j.nombre";
      const rs = await env.DB.prepare(sql).bind(...params).all();
      return ok(rs.results || []);
    }

    if (method === "POST" && path === "/api/jugadores") {
      const b = await readBody(request);
      const result = await run(
        env.DB,
        `INSERT INTO jugadores (id_equipo, nombre, apellido, nombre_popular, dorsal, posicion, foto_url, confirmado, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [b.id_equipo, b.nombre, b.apellido || "", b.nombre_popular || "", b.dorsal || null, b.posicion || "", b.foto_url || "", b.confirmado ? 1 : 0]
      );
      return ok({ id_jugador: result.meta.last_row_id }, "Jugador registrado");
    }

    if (method === "GET" && path === "/api/partidos") {
      const rs = await env.DB.prepare(
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
         ORDER BY p.fecha_hora`
      ).all();
      return ok(rs.results || []);
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}
