import { fail, ok, readBody } from "../utils/response.js";
import { actualizarCupo, crearGrupo, listarGrupos, misGrupos, unirsePorCodigo } from "../services/grupos.service.js";
import { rankingGrupo } from "../services/puntaje.service.js";

export async function gruposRoutes(request, env, path, method, url) {
  try {
    if (method === "GET" && path === "/api/grupos") {
      return ok(await listarGrupos(env.DB));
    }

    if (method === "GET" && path === "/api/grupos/mis-grupos") {
      const id_usuario = url.searchParams.get("usuario");
      return ok(await misGrupos(env.DB, id_usuario));
    }

    if (method === "POST" && path === "/api/grupos") {
      return ok(await crearGrupo(env.DB, await readBody(request)), "Grupo creado");
    }

    if (method === "POST" && path === "/api/grupos/unirse") {
      return ok(await unirsePorCodigo(env.DB, await readBody(request)), "Te uniste al grupo");
    }

    const cupoMatch = path.match(/^\/api\/grupos\/(\d+)\/cupo$/);
    if (method === "PUT" && cupoMatch) {
      return ok(await actualizarCupo(env.DB, Number(cupoMatch[1]), await readBody(request)), "Cupo actualizado");
    }

    const rankingMatch = path.match(/^\/api\/grupos\/(\d+)\/ranking$/);
    if (method === "GET" && rankingMatch) {
      return ok(await rankingGrupo(env.DB, Number(rankingMatch[1])));
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}
