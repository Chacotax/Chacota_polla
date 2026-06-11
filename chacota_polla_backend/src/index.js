import { adminRoutes } from "./routes/admin.routes.js";
import { authRoutes } from "./routes/auth.routes.js";
import { catalogosRoutes } from "./routes/catalogos.routes.js";
import { gruposRoutes } from "./routes/grupos.routes.js";
import { mundialRoutes } from "./routes/mundial.routes.js";
import { prediccionesRoutes } from "./routes/predicciones.routes.js";
import { json, notFound } from "./utils/response.js";
import { usuariosRoutes } from "./routes/usuarios.routes.js";

function normalizeApiFootballList(data) {
  if (Array.isArray(data)) return data;

  if (data && Array.isArray(data.result)) return data.result;

  if (data && Array.isArray(data.data)) return data.data;

  return [];
}

function buildApiFootballUrl(env, params = {}) {
  const baseUrl = env.APIFOOTBALL_BASE_URL || "https://apiv2.apifootball.com/";

  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  url.searchParams.set("APIkey", env.APIFOOTBALL_KEY);

  return url.toString();
}

async function callApiFootball(env, params = {}) {
  if (!env.APIFOOTBALL_BASE_URL) {
    return {
      ok: false,
      status: 500,
      error: "Falta configurar APIFOOTBALL_BASE_URL en wrangler.toml"
    };
  }

  if (!env.APIFOOTBALL_KEY) {
    return {
      ok: false,
      status: 500,
      error: "Falta configurar el secret APIFOOTBALL_KEY en Cloudflare Workers"
    };
  }

  const apiUrl = buildApiFootballUrl(env, params);
  const apiResponse = await fetch(apiUrl);

  const contentType = apiResponse.headers.get("content-type") || "";
  const rawText = await apiResponse.text();

  let data = null;

  if (contentType.includes("application/json")) {
    try {
      data = JSON.parse(rawText);
    } catch (error) {
      return {
        ok: false,
        status: 502,
        error: "APIfootball respondió JSON inválido",
        rawPreview: rawText.slice(0, 700)
      };
    }
  } else {
    return {
      ok: false,
      status: 502,
      error: "APIfootball no devolvió JSON",
      contentType,
      rawPreview: rawText.slice(0, 700)
    };
  }

  if (!apiResponse.ok) {
    return {
      ok: false,
      status: apiResponse.status,
      error: "APIfootball respondió con error HTTP",
      data
    };
  }

  return {
    ok: true,
    status: apiResponse.status,
    data,
    url: apiUrl.replace(env.APIFOOTBALL_KEY, "********")
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") {
      return json({ ok: true });
    }

    if (method === "GET" && path === "/health") {
      return json({
        ok: true,
        app: env.APP_NAME || "Polla UP Mundialista",
        status: "running",
        provider: env.API_PROVIDER || "apifootball",
        apiBaseUrl: env.APIFOOTBALL_BASE_URL || null
      });
    }

    // ======================================================
    // API FOOTBALL V2 - Test de conexión
    //
    // GET /api/admin/api-football/test
    // ======================================================
    if (method === "GET" && path === "/api/admin/api-football/test") {
      try {
        const result = await callApiFootball(env, {
          action: "get_countries"
        });

        if (!result.ok) {
          return json(
            {
              ok: false,
              message: result.error,
              status: result.status,
              contentType: result.contentType || null,
              rawPreview: result.rawPreview || null,
              data: result.data || null
            },
            result.status || 500
          );
        }

        const lista = normalizeApiFootballList(result.data);

        return json({
          ok: true,
          message: "Conexión con APIfootball correcta",
          total: lista.length,
          data: lista.slice(0, 30),
          debug: {
            provider: "apifootball-v2",
            baseUrl: env.APIFOOTBALL_BASE_URL,
            responseKeys:
              result.data &&
              typeof result.data === "object" &&
              !Array.isArray(result.data)
                ? Object.keys(result.data)
                : []
          }
        });
      } catch (error) {
        return json(
          {
            ok: false,
            message: "Error probando APIfootball",
            error: error.message
          },
          500
        );
      }
    }

    // ======================================================
    // API FOOTBALL V2 - Buscar ligas / competiciones
    //
    // GET /api/admin/api-football/leagues
    // GET /api/admin/api-football/leagues?search=world
    // GET /api/admin/api-football/leagues?search=cup
    // ======================================================
    if (method === "GET" && path === "/api/admin/api-football/leagues") {
      try {
        const search = (url.searchParams.get("search") || "")
          .trim()
          .toLowerCase();

        const result = await callApiFootball(env, {
          action: "get_leagues"
        });

        if (!result.ok) {
          return json(
            {
              ok: false,
              message: result.error,
              status: result.status,
              contentType: result.contentType || null,
              rawPreview: result.rawPreview || null,
              data: result.data || null
            },
            result.status || 500
          );
        }

        const lista = normalizeApiFootballList(result.data);

        const filtrado = search
          ? lista.filter((item) => {
              const leagueName = String(item.league_name || "").toLowerCase();
              const countryName = String(item.country_name || "").toLowerCase();
              const leagueId = String(item.league_id || "").toLowerCase();
              const countryId = String(item.country_id || "").toLowerCase();

              return (
                leagueName.includes(search) ||
                countryName.includes(search) ||
                leagueId.includes(search) ||
                countryId.includes(search)
              );
            })
          : lista;

        return json({
          ok: true,
          total: filtrado.length,
          data: filtrado.slice(0, 150),
          debug: {
            provider: "apifootball-v2",
            baseUrl: env.APIFOOTBALL_BASE_URL,
            responseKeys:
              result.data &&
              typeof result.data === "object" &&
              !Array.isArray(result.data)
                ? Object.keys(result.data)
                : []
          }
        });
      } catch (error) {
        return json(
          {
            ok: false,
            message: "Error consultando ligas de APIfootball",
            error: error.message
          },
          500
        );
      }
    }

    // ======================================================
    // API FOOTBALL V2 - Equipos por league_id
    //
    // GET /api/admin/api-football/teams?league_id=123
    // ======================================================
    if (method === "GET" && path === "/api/admin/api-football/teams") {
      try {
        const leagueId =
          url.searchParams.get("league_id") || env.APIFOOTBALL_LEAGUE_ID;

        if (!leagueId) {
          return json(
            {
              ok: false,
              message:
                "Falta league_id. Usa ?league_id=ID o configura APIFOOTBALL_LEAGUE_ID en wrangler.toml"
            },
            400
          );
        }

        const result = await callApiFootball(env, {
          action: "get_teams",
          league_id: leagueId
        });

        if (!result.ok) {
          return json(
            {
              ok: false,
              message: result.error,
              status: result.status,
              rawPreview: result.rawPreview || null,
              data: result.data || null
            },
            result.status || 500
          );
        }

        const lista = normalizeApiFootballList(result.data);

        return json({
          ok: true,
          league_id: leagueId,
          total: lista.length,
          data: lista,
          debug: {
            provider: "apifootball-v2",
            responseKeys:
              result.data &&
              typeof result.data === "object" &&
              !Array.isArray(result.data)
                ? Object.keys(result.data)
                : []
          }
        });
      } catch (error) {
        return json(
          {
            ok: false,
            message: "Error consultando equipos de APIfootball",
            error: error.message
          },
          500
        );
      }
    }

    // ======================================================
    // API FOOTBALL V2 - Partidos / fixture por league_id
    //
    // GET /api/admin/api-football/events?league_id=123&from=2026-06-01&to=2026-07-31
    // ======================================================
    if (method === "GET" && path === "/api/admin/api-football/events") {
      try {
        const leagueId =
          url.searchParams.get("league_id") || env.APIFOOTBALL_LEAGUE_ID;

        const from = url.searchParams.get("from") || "2026-06-01";
        const to = url.searchParams.get("to") || "2026-07-31";

        if (!leagueId) {
          return json(
            {
              ok: false,
              message:
                "Falta league_id. Usa ?league_id=ID o configura APIFOOTBALL_LEAGUE_ID en wrangler.toml"
            },
            400
          );
        }

        const result = await callApiFootball(env, {
          action: "get_events",
          from,
          to,
          league_id: leagueId,
          timezone: env.APIFOOTBALL_TIMEZONE || "America/Lima"
        });

        if (!result.ok) {
          return json(
            {
              ok: false,
              message: result.error,
              status: result.status,
              rawPreview: result.rawPreview || null,
              data: result.data || null
            },
            result.status || 500
          );
        }

        const lista = normalizeApiFootballList(result.data);

        return json({
          ok: true,
          league_id: leagueId,
          from,
          to,
          total: lista.length,
          data: lista,
          debug: {
            provider: "apifootball-v2",
            responseKeys:
              result.data &&
              typeof result.data === "object" &&
              !Array.isArray(result.data)
                ? Object.keys(result.data)
                : []
          }
        });
      } catch (error) {
        return json(
          {
            ok: false,
            message: "Error consultando partidos de APIfootball",
            error: error.message
          },
          500
        );
      }
    }

    const handlers = [
      authRoutes,
      mundialRoutes,
      catalogosRoutes,
      gruposRoutes,
      prediccionesRoutes,
      adminRoutes,
        usuariosRoutes
    ];

    for (const handler of handlers) {
      const response = await handler(request, env, path, method, url);
      if (response) return response;
    }

    return notFound();
  }
};