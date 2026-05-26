import { fail, ok } from "../utils/response.js";
import { obtenerMapaMundial } from "../services/mundial.service.js";

export async function mundialRoutes(request, env, path, method) {
  try {
    if (method === "GET" && path === "/api/mundial/mapa") {
      return ok(await obtenerMapaMundial(env.DB));
    }

    if (method === "GET" && path === "/api/mundial/grupos") {
      const rs = await env.DB.prepare(
        `SELECT mg.*,
                COUNT(e.id_equipo) AS equipos
         FROM mundial_grupos mg
         LEFT JOIN equipos e ON e.id_grupo_mundial = mg.id_grupo_mundial AND e.estado = 1
         GROUP BY mg.id_grupo_mundial
         ORDER BY mg.orden`
      ).all();
      return ok(rs.results || []);
    }

    if (method === "GET" && path === "/api/mundial/fixture") {
      const rs = await env.DB.prepare(
        `SELECT p.*,
                el.nombre AS equipo_local,
                ev.nombre AS equipo_visitante,
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
