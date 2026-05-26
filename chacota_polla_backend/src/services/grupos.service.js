import { randomCode } from "../utils/security.js";
import { first, run } from "../utils/sql.js";

export async function crearGrupo(db, payload) {
  const {
    nombre,
    descripcion = "",
    id_administrador,
    max_participantes = 10,
    monto_apuesta = 0
  } = payload;

  if (!nombre || !id_administrador) {
    throw new Error("Debe enviar nombre e id_administrador.");
  }

  const admin = await first(db, "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1", [id_administrador]);
  if (!admin) throw new Error("Administrador no encontrado.");

  let codigo = randomCode("POLLA", 6);
  for (let i = 0; i < 5; i++) {
    const exists = await first(db, "SELECT id_grupo FROM grupos_polla WHERE codigo_invitacion = ?", [codigo]);
    if (!exists) break;
    codigo = randomCode("POLLA", 6);
  }

  const result = await run(
    db,
    `INSERT INTO grupos_polla (nombre, descripcion, codigo_invitacion, id_administrador, max_participantes, monto_apuesta, estado)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [nombre, descripcion, codigo, id_administrador, max_participantes, monto_apuesta]
  );

  const id_grupo = result.meta.last_row_id;

  await run(
    db,
    `INSERT OR IGNORE INTO grupo_participantes (id_grupo, id_usuario, rol_grupo, estado)
     VALUES (?, ?, 'ADMIN_GRUPO', 1)`,
    [id_grupo, id_administrador]
  );

  return { id_grupo, nombre, codigo_invitacion: codigo, max_participantes };
}

export async function unirsePorCodigo(db, payload) {
  const { codigo_invitacion, id_usuario } = payload;
  if (!codigo_invitacion || !id_usuario) {
    throw new Error("Debe enviar codigo_invitacion e id_usuario.");
  }

  const grupo = await first(db, "SELECT * FROM grupos_polla WHERE codigo_invitacion = ? AND estado = 1", [codigo_invitacion.trim().toUpperCase()]);
  if (!grupo) throw new Error("Código de grupo inválido o grupo inactivo.");

  const usuario = await first(db, "SELECT id_usuario FROM usuarios WHERE id_usuario = ? AND estado = 1", [id_usuario]);
  if (!usuario) throw new Error("Usuario no encontrado.");

  const existe = await first(db, "SELECT id_grupo_participante FROM grupo_participantes WHERE id_grupo = ? AND id_usuario = ? AND estado = 1", [grupo.id_grupo, id_usuario]);
  if (existe) throw new Error("El usuario ya pertenece a este grupo.");

  const conteo = await first(db, "SELECT COUNT(*) AS total FROM grupo_participantes WHERE id_grupo = ? AND estado = 1", [grupo.id_grupo]);
  if ((conteo?.total || 0) >= grupo.max_participantes) {
    throw new Error("El grupo ya llegó al máximo de participantes.");
  }

  await run(
    db,
    "INSERT INTO grupo_participantes (id_grupo, id_usuario, rol_grupo, estado) VALUES (?, ?, 'PARTICIPANTE', 1)",
    [grupo.id_grupo, id_usuario]
  );

  return { id_grupo: grupo.id_grupo, nombre: grupo.nombre, codigo_invitacion: grupo.codigo_invitacion };
}

export async function actualizarCupo(db, id_grupo, payload) {
  const { id_administrador, max_participantes } = payload;
  if (!id_administrador || !max_participantes) throw new Error("Debe enviar id_administrador y max_participantes.");

  const grupo = await first(db, "SELECT * FROM grupos_polla WHERE id_grupo = ?", [id_grupo]);
  if (!grupo) throw new Error("Grupo no encontrado.");

  if (Number(grupo.id_administrador) !== Number(id_administrador)) {
    throw new Error("Solo el administrador del grupo puede cambiar el cupo.");
  }

  const conteo = await first(db, "SELECT COUNT(*) AS total FROM grupo_participantes WHERE id_grupo = ? AND estado = 1", [id_grupo]);
  if (Number(max_participantes) < Number(conteo.total || 0)) {
    throw new Error(`No puede reducir el cupo por debajo de los participantes actuales (${conteo.total}).`);
  }

  await run(db, "UPDATE grupos_polla SET max_participantes = ? WHERE id_grupo = ?", [max_participantes, id_grupo]);
  return { id_grupo, max_participantes };
}

export async function misGrupos(db, id_usuario) {
  const rs = await db.prepare(
    `SELECT g.*,
            u.usuario AS administrador_usuario,
            COUNT(gp2.id_grupo_participante) AS participantes
     FROM grupo_participantes gp
     INNER JOIN grupos_polla g ON g.id_grupo = gp.id_grupo
     INNER JOIN usuarios u ON u.id_usuario = g.id_administrador
     LEFT JOIN grupo_participantes gp2 ON gp2.id_grupo = g.id_grupo AND gp2.estado = 1
     WHERE gp.id_usuario = ? AND gp.estado = 1 AND g.estado = 1
     GROUP BY g.id_grupo
     ORDER BY g.fecha_registro DESC`
  ).bind(id_usuario).all();
  return rs.results || [];
}

export async function listarGrupos(db) {
  const rs = await db.prepare(
    `SELECT g.*,
            u.usuario AS administrador_usuario,
            COUNT(gp.id_grupo_participante) AS participantes
     FROM grupos_polla g
     INNER JOIN usuarios u ON u.id_usuario = g.id_administrador
     LEFT JOIN grupo_participantes gp ON gp.id_grupo = g.id_grupo AND gp.estado = 1
     WHERE g.estado = 1
     GROUP BY g.id_grupo
     ORDER BY g.fecha_registro DESC`
  ).all();
  return rs.results || [];
}
