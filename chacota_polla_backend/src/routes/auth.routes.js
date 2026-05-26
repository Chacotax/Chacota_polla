import { fail, ok, readBody } from "../utils/response.js";
import { listarUsuarios, login, registrarUsuario } from "../services/auth.service.js";

export async function authRoutes(request, env, path, method) {
  try {
    if (method === "POST" && path === "/api/auth/login") {
      return ok(await login(env.DB, await readBody(request)), "Login correcto");
    }

    if (method === "POST" && path === "/api/usuarios") {
      return ok(await registrarUsuario(env.DB, await readBody(request)), "Usuario registrado");
    }

    if (method === "GET" && path === "/api/usuarios") {
      return ok(await listarUsuarios(env.DB));
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}
