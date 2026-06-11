import { first, run } from "../utils/sql.js";
import { createPassword, verifyPassword } from "../utils/security.js";

export async function actualizarPerfilUsuario(db, payload) {
  const { id_usuario, usuario } = payload;

  if (!id_usuario) {
    throw new Error("Debe enviar id_usuario.");
  }

  if (!usuario || !String(usuario).trim()) {
    throw new Error("Debe ingresar un nombre de usuario.");
  }

  const usuarioLimpio = String(usuario).trim();

  const existe = await first(
    db,
    `SELECT id_usuario
     FROM usuarios
     WHERE LOWER(usuario) = LOWER(?)
       AND id_usuario <> ?`,
    [usuarioLimpio, id_usuario]
  );

  if (existe) {
    throw new Error("Ese nombre de usuario ya está en uso.");
  }

  await run(
    db,
    `UPDATE usuarios
     SET usuario = ?
     WHERE id_usuario = ?`,
    [usuarioLimpio, id_usuario]
  );

  return {
    id_usuario: Number(id_usuario),
    usuario: usuarioLimpio
  };
}

export async function cambiarPasswordUsuario(db, payload) {
  const { id_usuario, password_actual, password_nuevo } = payload;

  if (!id_usuario) {
    throw new Error("Debe enviar id_usuario.");
  }

  if (!password_actual || !password_nuevo) {
    throw new Error("Debe ingresar contraseña actual y nueva contraseña.");
  }

  if (String(password_nuevo).length < 6) {
    throw new Error("La nueva contraseña debe tener mínimo 6 caracteres.");
  }

  const user = await first(
    db,
    `SELECT id_usuario, password_hash, password_salt
     FROM usuarios
     WHERE id_usuario = ?
       AND estado = 1`,
    [id_usuario]
  );

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const passwordValido = await verifyPassword(
    password_actual,
    user.password_salt,
    user.password_hash
  );

  if (!passwordValido) {
    throw new Error("La contraseña actual es incorrecta.");
  }

  const nuevaPassword = await createPassword(password_nuevo);

  await run(
    db,
    `UPDATE usuarios
     SET password_hash = ?,
         password_salt = ?
     WHERE id_usuario = ?`,
    [
      nuevaPassword.password_hash,
      nuevaPassword.password_salt,
      id_usuario
    ]
  );

  return {
    id_usuario: Number(id_usuario),
    actualizado: true
  };
}

export async function resetearPasswordUsuario(db, payload) {
  const { id_usuario, password_nuevo } = payload;

  if (!id_usuario) {
    throw new Error("Debe enviar id_usuario.");
  }

  if (!password_nuevo || String(password_nuevo).length < 6) {
    throw new Error("Debe ingresar una contraseña nueva de mínimo 6 caracteres.");
  }

  const user = await first(
    db,
    `SELECT id_usuario
     FROM usuarios
     WHERE id_usuario = ?
       AND estado = 1`,
    [id_usuario]
  );

  if (!user) {
    throw new Error("Usuario no encontrado.");
  }

  const nuevaPassword = await createPassword(password_nuevo);

  await run(
    db,
    `UPDATE usuarios
     SET password_hash = ?,
         password_salt = ?
     WHERE id_usuario = ?`,
    [
      nuevaPassword.password_hash,
      nuevaPassword.password_salt,
      id_usuario
    ]
  );

  return {
    id_usuario: Number(id_usuario),
    reseteado: true
  };
}