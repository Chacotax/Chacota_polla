import { fail, ok, readBody } from "../utils/response.js";
import { guardarPrediccion, registrarResultado } from "../services/puntaje.service.js";

export async function prediccionesRoutes(request, env, path, method) {
  try {
    if (method === "POST" && path === "/api/predicciones") {
      return ok(await guardarPrediccion(env.DB, await readBody(request)), "Predicción guardada");
    }

    if (method === "POST" && path === "/api/admin/resultados") {
      return ok(await registrarResultado(env.DB, await readBody(request)), "Resultado registrado y puntajes recalculados");
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}
