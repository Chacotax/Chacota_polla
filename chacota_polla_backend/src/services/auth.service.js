import { createPassword, makeToken, verifyPassword } from "../utils/security.js";
import { first, run } from "../utils/sql.js";

export async function login(db, payload) {
  const { usuario, password } = payload;
  if (!usuario || !password) throw new Error("Debe ingresar usuario y contraseña.");

  const user = await first(db, "SELECT * FROM usuarios WHERE usuario = ? AND estado = 1", [usuario]);
  if (!user) throw new Error("Usuario o contraseña incorrectos.");

  const valid = await verifyPassword(password, user.password_salt, user.password_hash);
  if (!valid) throw new Error("Usuario o contraseña incorrectos.");

  await run(db, "UPDATE usuarios SET fecha_ultimo_login = CURRENT_TIMESTAMP WHERE id_usuario = ?", [user.id_usuario]);

  delete user.password_hash;
  delete user.password_salt;

  return {
    token: makeToken(user),
    usuario: user
  };
}

export async function registrarUsuario(db, payload) {
  const { usuario, password, nombres, apellidos = "", email = "", rol = "PARTICIPANTE" } = payload;
  if (!usuario || !password || !nombres) {
    throw new Error("Debe enviar usuario, password y nombres.");
  }

  const exists = await first(db, "SELECT id_usuario FROM usuarios WHERE usuario = ?", [usuario]);
  if (exists) throw new Error("El usuario ya existe.");

  const { salt, hash } = await createPassword(password);

  const result = await run(
    db,
    `INSERT INTO usuarios (usuario, password_hash, password_salt, nombres, apellidos, email, rol, estado)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
    [usuario, hash, salt, nombres, apellidos, email, rol]
  );

  return {
    id_usuario: result.meta.last_row_id,
    usuario,
    nombres,
    apellidos,
    email,
    rol
  };
}

export async function listarUsuarios(db) {
  const rs = await db.prepare(
    `SELECT id_usuario, usuario, nombres, apellidos, email, rol, estado, fecha_registro
     FROM usuarios
     ORDER BY fecha_registro DESC`
  ).all();
  return rs.results || [];
}
