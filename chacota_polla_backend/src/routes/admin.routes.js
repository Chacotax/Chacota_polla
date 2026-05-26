import { fail, ok } from "../utils/response.js";
import {
  syncEquiposApiFootball,
  syncJugadoresApiFootball,
  syncPartidosApiFootball
} from "../services/apiFootball.service.js";

export async function adminRoutes(request, env, path, method) {
  try {
    if (method === "POST" && path === "/api/admin/sync/equipos") {
      const result = await syncEquiposApiFootball(env.DB, env);

      return ok(result, "Sync equipos ejecutado correctamente");
    }

    if (method === "POST" && path === "/api/admin/sync/jugadores") {
      const url = new URL(request.url);

      const offset = Number(url.searchParams.get("offset") || 0);
      const limit = Number(url.searchParams.get("limit") || 1);

      const result = await syncJugadoresApiFootball(env.DB, env, {
        offset,
        limit
      });

      return ok(result, "Sync jugadores ejecutado correctamente");
    }

    if (method === "POST" && path === "/api/admin/sync/partidos") {
      const url = new URL(request.url);

      const offset = Number(url.searchParams.get("offset") || 0);
      const limit = Number(url.searchParams.get("limit") || 1);

      const result = await syncPartidosApiFootball(env.DB, env, {
        offset,
        limit
      });

      return ok(result, "Sync partidos ejecutado correctamente");
    }

    if (method === "GET" && path === "/api/admin/sync/logs") {
      const rs = await env.DB.prepare(`
        SELECT *
        FROM api_sync_log
        ORDER BY fecha_inicio DESC
        LIMIT 100
      `).all();

      return ok(rs.results || []);
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}