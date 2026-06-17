import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createPassword } from "../src/utils/security.js";

const DB_NAME = "chacota_polla";
const OUTPUT_FILE = path.resolve("./reset_passwords_dni_generado.sql");

function escapeSql(value) {
  return String(value ?? "").replaceAll("'", "''");
}

function runCommand(command) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"]
  });
}

function runSqlJson(sql) {
  const oneLineSql = sql.replace(/\s+/g, " ").trim();
  const safeSql = oneLineSql.replaceAll('"', '\\"');

  const command = `npx wrangler d1 execute ${DB_NAME} --remote --json --command="${safeSql}"`;

  return runCommand(command);
}

function obtenerUsuarios() {
  const raw = runSqlJson(`
    SELECT
      id_usuario,
      usuario
    FROM usuarios
    WHERE id_usuario > 5
      AND estado = 1
      AND usuario IS NOT NULL
      AND TRIM(usuario) <> ''
    ORDER BY id_usuario;
  `);

  const parsed = JSON.parse(raw);

  return parsed?.[0]?.results || parsed?.results || [];
}

async function generarSql(usuarios) {
  let sql = "";

  sql += "PRAGMA foreign_keys = ON;\n\n";
  sql += "-- Reset de contraseñas: usuario = DNI y contraseña = DNI\n";
  sql += "-- No modifica los primeros 5 usuarios\n";
  sql += "-- Generado usando createPassword() del backend\n\n";

  for (const item of usuarios) {
    const idUsuario = Number(item.id_usuario);
    const usuario = String(item.usuario || "").trim();

    if (!idUsuario || !usuario) continue;

    const password = usuario;

    const { salt, hash } = await createPassword(password);

    sql += `UPDATE usuarios
SET
  usuario = '${escapeSql(usuario)}',
  password_hash = '${escapeSql(hash)}',
  password_salt = '${escapeSql(salt)}',
  rol = 'PARTICIPANTE',
  estado = 1
WHERE id_usuario = ${idUsuario};

`;
  }

  return sql;
}

function ejecutarArchivoSql() {
  const command = `npx wrangler d1 execute ${DB_NAME} --remote --file="${OUTPUT_FILE}"`;

  return execSync(command, {
    encoding: "utf8",
    stdio: "inherit"
  });
}

async function main() {
  console.log("Buscando usuarios desde id_usuario > 5...");

  const usuarios = obtenerUsuarios();

  console.log(`Usuarios encontrados: ${usuarios.length}`);

  if (!usuarios.length) {
    console.log("No hay usuarios para actualizar.");
    return;
  }

  console.log("Generando SQL con createPassword() real del backend...");

  const sql = await generarSql(usuarios);

  fs.writeFileSync(OUTPUT_FILE, sql, "utf8");

  console.log(`Archivo generado: ${OUTPUT_FILE}`);
  console.log("Ejecutando SQL en Cloudflare D1...");

  ejecutarArchivoSql();

  console.log("----------------------------------------");
  console.log("Proceso terminado correctamente.");
  console.log(`Usuarios actualizados: ${usuarios.length}`);
  console.log("----------------------------------------");
  console.log("Cada usuario desde id_usuario > 5 ahora tiene:");
  console.log("usuario = DNI");
  console.log("password = DNI");
}

main().catch((error) => {
  console.error("ERROR GENERAL:");
  console.error(error.message);
  process.exit(1);
});