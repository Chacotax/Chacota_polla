import { fail, ok, readBody } from "../utils/response.js";
import {
  actualizarPerfilUsuario,
  cambiarPasswordUsuario,
  resetearPasswordUsuario
} from "../services/usuarios.service.js";

export async function usuariosRoutes(request, env, path, method) {
  try {
    if (method === "PUT" && path === "/api/usuarios/perfil") {
      return ok(
        await actualizarPerfilUsuario(env.DB, await readBody(request)),
        "Perfil actualizado correctamente"
      );
    }

    if (method === "PUT" && path === "/api/usuarios/cambiar-password") {
      return ok(
        await cambiarPasswordUsuario(env.DB, await readBody(request)),
        "Contraseña actualizada correctamente"
      );
    }

    if (method === "PUT" && path === "/api/admin/usuarios/reset-password") {
      return ok(
        await resetearPasswordUsuario(env.DB, await readBody(request)),
        "Contraseña reseteada correctamente"
      );
    }

    return null;
  } catch (e) {
    return fail(e.message);
  }
}