export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      ...extraHeaders
    }
  });
}

export function ok(data = {}, message = "OK") {
  return json({ ok: true, message, data });
}

export function fail(message = "Error", status = 400, details = null) {
  return json({ ok: false, message, details }, status);
}

export function notFound() {
  return fail("Ruta no encontrada", 404);
}

export async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}
