export async function all(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).all();
}

export async function first(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).first();
}

export async function run(db, sql, params = []) {
  return await db.prepare(sql).bind(...params).run();
}
