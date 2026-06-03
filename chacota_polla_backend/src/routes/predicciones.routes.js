import { fail, ok, readBody } from "../utils/response.js";
import {
  guardarPrediccion,
  listarGoleadoresPartido,
  listarMisPredicciones,
  registrarResultado
} from "../services/puntaje.service.js";

export async function prediccionesRoutes(request, env, path, method) {
  try {
    if (method === "GET" && path === "/api/predicciones/mis") {
      const url = new URL(request.url);

      const id_usuario = url.searchParams.get("id_usuario");
      const id_grupo = url.searchParams.get("id_grupo");

      return ok(
        await listarMisPredicciones(
          env.DB,
          id_usuario ? Number(id_usuario) : null,
          id_grupo ? Number(id_grupo) : null
        ),
        "Predicciones obtenidas"
      );
    }

    if (method === "GET" && path === "/api/admin/resultados/goleadores") {
      const url = new URL(request.url);
      const id_partido = url.searchParams.get("id_partido");

      return ok(
        await listarGoleadoresPartido(
          env.DB,
          id_partido ? Number(id_partido) : null
        ),
        "Goleadores del partido obtenidos"
      );
    }

    if (method === "POST" && path === "/api/predicciones") {
      return ok(
        await guardarPrediccion(env.DB, await readBody(request)),
        "Predicción guardada"
      );
    }

    if (method === "POST" && path === "/api/admin/resultados") {
      return ok(
        await registrarResultado(env.DB, await readBody(request)),
        "Resultado registrado y puntajes recalculados"
      );
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}