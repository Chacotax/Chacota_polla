const DEFAULT_BASE_URL = "https://apiv3.apifootball.com/";
const DEFAULT_LEAGUE_ID = "28";

function nowIso() {
  return new Date().toISOString();
}

function getLeagueId(env) {
  return String(env.APIFOOTBALL_LEAGUE_ID || DEFAULT_LEAGUE_ID);
}

function getBaseUrl(env) {
  return env.APIFOOTBALL_BASE_URL || DEFAULT_BASE_URL;
}

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.result)) return data.result;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeCode(value, fallback = "SIN_CODIGO") {
  const code = normalizeText(value)
    .toUpperCase()
    .replaceAll("Á", "A")
    .replaceAll("É", "E")
    .replaceAll("Í", "I")
    .replaceAll("Ó", "O")
    .replaceAll("Ú", "U")
    .replaceAll("Ñ", "N")
    .replaceAll(" ", "_")
    .replaceAll("-", "_")
    .replaceAll("/", "_")
    .replaceAll(".", "")
    .replaceAll(",", "")
    .substring(0, 40);

  return code || fallback;
}

function buildFechaHora(match) {
  const fecha = normalizeText(match.match_date);
  const hora = normalizeText(match.match_time);

  if (fecha && hora) return `${fecha} ${hora}:00`;
  if (fecha) return `${fecha} 00:00:00`;

  return null;
}

function inferFaseFromMatch(match) {
  const round = normalizeText(match.match_round).toLowerCase();
  const status = normalizeText(match.match_status).toLowerCase();
  const value = `${round} ${status}`;

  if (
    !round ||
    round === "1" ||
    round === "2" ||
    round === "3" ||
    value.includes("group") ||
    value.includes("grupo")
  ) {
    return {
      codigo: "GRUPOS",
      nombre: "Fase de grupos",
      orden: 1
    };
  }

  if (
    value.includes("round of 32") ||
    value.includes("32") ||
    value.includes("dieciseis")
  ) {
    return {
      codigo: "DIECISEISAVOS",
      nombre: "Dieciseisavos de final",
      orden: 2
    };
  }

  if (
    value.includes("round of 16") ||
    value.includes("16") ||
    value.includes("octavos")
  ) {
    return {
      codigo: "OCTAVOS",
      nombre: "Octavos de final",
      orden: 3
    };
  }

  if (value.includes("quarter") || value.includes("cuartos")) {
    return {
      codigo: "CUARTOS",
      nombre: "Cuartos de final",
      orden: 4
    };
  }

  if (value.includes("semi") || value.includes("semifinal")) {
    return {
      codigo: "SEMIFINAL",
      nombre: "Semifinal",
      orden: 5
    };
  }

  if (value.includes("third") || value.includes("tercer")) {
    return {
      codigo: "TERCER_PUESTO",
      nombre: "Tercer puesto",
      orden: 6
    };
  }

  if (value.includes("final")) {
    return {
      codigo: "FINAL",
      nombre: "Final",
      orden: 7
    };
  }

  return {
    codigo: "GRUPOS",
    nombre: "Fase de grupos",
    orden: 1
  };
}

function inferGrupoFromMatch(match) {
  const raw =
    normalizeText(match.match_group) ||
    normalizeText(match.group_name) ||
    normalizeText(match.group) ||
    "";

  if (!raw) {
    return {
      codigo: "SIN_GRUPO",
      nombre: "Sin grupo",
      orden: 99
    };
  }

  const upper = raw.toUpperCase();

  const grupos = [
    ["A", "GROUP A", "GRUPO A", 1],
    ["B", "GROUP B", "GRUPO B", 2],
    ["C", "GROUP C", "GRUPO C", 3],
    ["D", "GROUP D", "GRUPO D", 4],
    ["E", "GROUP E", "GRUPO E", 5],
    ["F", "GROUP F", "GRUPO F", 6],
    ["G", "GROUP G", "GRUPO G", 7],
    ["H", "GROUP H", "GRUPO H", 8],
    ["I", "GROUP I", "GRUPO I", 9],
    ["J", "GROUP J", "GRUPO J", 10],
    ["K", "GROUP K", "GRUPO K", 11],
    ["L", "GROUP L", "GRUPO L", 12]
  ];

  for (const [codigo, en, es, orden] of grupos) {
    if (upper.includes(en) || upper.includes(es)) {
      return {
        codigo,
        nombre: `Grupo ${codigo}`,
        orden
      };
    }
  }

  return {
    codigo: normalizeCode(raw, "SIN_GRUPO"),
    nombre: raw,
    orden: 99
  };
}

async function callApiFootball(env, params = {}) {
  if (!env.APIFOOTBALL_KEY) {
    throw new Error("Falta configurar el secret APIFOOTBALL_KEY");
  }

  const url = new URL(getBaseUrl(env));

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  url.searchParams.set("APIkey", env.APIFOOTBALL_KEY);

  const response = await fetch(url.toString());
  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `APIfootball no devolvió JSON. Respuesta: ${text.slice(0, 300)}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `APIfootball respondió HTTP ${response.status}: ${text.slice(0, 300)}`
    );
  }

  if (data && data.error) {
    throw new Error(`APIfootball error: ${JSON.stringify(data.error)}`);
  }

  return data;
}

async function safeLog(db, tipoSync, estado, mensaje, fechaInicio) {
  try {
    await db
      .prepare(`
        INSERT INTO api_sync_log (
          proveedor,
          tipo_sync,
          estado,
          mensaje,
          fecha_inicio,
          fecha_fin
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `)
      .bind("apifootball", tipoSync, estado, mensaje, fechaInicio, nowIso())
      .run();
  } catch (error) {
    console.log("No se pudo registrar api_sync_log:", error.message);
  }
}

async function getTableColumns(db, tableName) {
  const rs = await db.prepare(`PRAGMA table_info(${tableName})`).all();
  return (rs.results || []).map((row) => row.name);
}

function pickExistingColumns(data, columns) {
  const picked = {};

  Object.entries(data).forEach(([key, value]) => {
    if (columns.includes(key)) {
      picked[key] = value;
    }
  });

  return picked;
}

async function insertDynamic(db, tableName, data) {
  const columns = await getTableColumns(db, tableName);
  const picked = pickExistingColumns(data, columns);
  const keys = Object.keys(picked);

  if (keys.length === 0) {
    throw new Error(`No hay columnas válidas para insertar en ${tableName}`);
  }

  const placeholders = keys.map(() => "?").join(", ");

  const sql = `
    INSERT INTO ${tableName} (${keys.join(", ")})
    VALUES (${placeholders})
  `;

  await db.prepare(sql).bind(...keys.map((key) => picked[key])).run();
}

async function updateDynamic(db, tableName, data, whereColumn, whereValue) {
  const columns = await getTableColumns(db, tableName);
  const picked = pickExistingColumns(data, columns);

  delete picked[whereColumn];

  const keys = Object.keys(picked);
  if (keys.length === 0) return;

  const setSql = keys.map((key) => `${key} = ?`).join(", ");

  const sql = `
    UPDATE ${tableName}
    SET ${setSql}
    WHERE ${whereColumn} = ?
  `;

  await db
    .prepare(sql)
    .bind(...keys.map((key) => picked[key]), whereValue)
    .run();
}

/* ======================================================
   MUNDIAL
====================================================== */

async function getOrCreateMundialId(db, env) {
  const anio = 2026;
  const apiLeagueId = getLeagueId(env);

  const existente = await db
    .prepare(`
      SELECT id_mundial
      FROM mundiales
      WHERE anio = ?
      LIMIT 1
    `)
    .bind(anio)
    .first();

  if (existente) return existente.id_mundial;

  await insertDynamic(db, "mundiales", {
    nombre: "Copa Mundial FIFA 2026",
    anio,
    pais_sede: "Estados Unidos / México / Canadá",
    paises_sede: "Estados Unidos, México y Canadá",
    fecha_inicio: "2026-06-11",
    fecha_fin: "2026-07-19",
    api_league_id: apiLeagueId,
    estado: "PLANIFICADO",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  });

  const creado = await db
    .prepare(`
      SELECT id_mundial
      FROM mundiales
      WHERE anio = ?
      LIMIT 1
    `)
    .bind(anio)
    .first();

  if (!creado) throw new Error("No se pudo crear el Mundial 2026");

  return creado.id_mundial;
}

/* ======================================================
   FASES / GRUPOS / ESTADIOS
====================================================== */

async function getOrCreateFaseId(db, faseInfo) {
  const codigo = normalizeCode(faseInfo.codigo || "GRUPOS", "GRUPOS");
  const nombre = normalizeText(faseInfo.nombre || "Fase de grupos");
  const orden = Number(faseInfo.orden || 1);

  const existente = await db
    .prepare(`
      SELECT id_fase
      FROM fases
      WHERE LOWER(codigo) = LOWER(?)
         OR LOWER(nombre) = LOWER(?)
      LIMIT 1
    `)
    .bind(codigo, nombre)
    .first();

  if (existente) return existente.id_fase;

  await insertDynamic(db, "fases", {
    codigo,
    nombre,
    orden,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  });

  const creado = await db
    .prepare(`
      SELECT id_fase
      FROM fases
      WHERE LOWER(codigo) = LOWER(?)
         OR LOWER(nombre) = LOWER(?)
      LIMIT 1
    `)
    .bind(codigo, nombre)
    .first();

  if (!creado) throw new Error(`No se pudo crear la fase: ${nombre}`);

  return creado.id_fase;
}

async function getOrCreateGrupoMundialId(db, idMundial, grupoInfo = {}) {
  const codigo = normalizeCode(grupoInfo.codigo || "SIN_GRUPO", "SIN_GRUPO");
  const nombre = normalizeText(grupoInfo.nombre || "Sin grupo");
  const orden = Number(grupoInfo.orden || (codigo === "SIN_GRUPO" ? 99 : 1));

  const existente = await db
    .prepare(`
      SELECT id_grupo_mundial
      FROM mundial_grupos
      WHERE id_mundial = ?
        AND (
          LOWER(codigo) = LOWER(?)
          OR LOWER(nombre) = LOWER(?)
        )
      LIMIT 1
    `)
    .bind(idMundial, codigo, nombre)
    .first();

  if (existente) return existente.id_grupo_mundial;

  await insertDynamic(db, "mundial_grupos", {
    id_mundial: idMundial,
    codigo,
    nombre,
    orden,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  });

  const creado = await db
    .prepare(`
      SELECT id_grupo_mundial
      FROM mundial_grupos
      WHERE id_mundial = ?
        AND (
          LOWER(codigo) = LOWER(?)
          OR LOWER(nombre) = LOWER(?)
        )
      LIMIT 1
    `)
    .bind(idMundial, codigo, nombre)
    .first();

  if (!creado) throw new Error(`No se pudo crear el grupo mundial: ${nombre}`);

  return creado.id_grupo_mundial;
}

async function getOrCreateEstadioId(db, nombreEstadio = "", ciudad = "") {
  const nombre = normalizeText(nombreEstadio || "Estadio por definir");
  const ciudadFinal = normalizeText(ciudad || "Por definir");

  const existente = await db
    .prepare(`
      SELECT id_estadio
      FROM estadios
      WHERE LOWER(nombre) = LOWER(?)
      LIMIT 1
    `)
    .bind(nombre)
    .first();

  if (existente) return existente.id_estadio;

  await insertDynamic(db, "estadios", {
    nombre,
    ciudad: ciudadFinal,
    pais: "",
    capacidad: null,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  });

  const creado = await db
    .prepare(`
      SELECT id_estadio
      FROM estadios
      WHERE LOWER(nombre) = LOWER(?)
      LIMIT 1
    `)
    .bind(nombre)
    .first();

  if (!creado) throw new Error(`No se pudo crear el estadio: ${nombre}`);

  return creado.id_estadio;
}

/* ======================================================
   EQUIPOS
====================================================== */

async function findEquipoByApiId(db, apiTeamId) {
  const columns = await getTableColumns(db, "equipos");

  if (!columns.includes("api_team_id")) return null;

  return await db
    .prepare(`
      SELECT *
      FROM equipos
      WHERE api_team_id = ?
      LIMIT 1
    `)
    .bind(String(apiTeamId))
    .first();
}

async function findEquipoByNombre(db, nombre) {
  return await db
    .prepare(`
      SELECT *
      FROM equipos
      WHERE LOWER(nombre) = LOWER(?)
      LIMIT 1
    `)
    .bind(nombre)
    .first();
}

async function findEquipoIdByApiIdOrNombre(db, apiTeamId, nombreEquipo) {
  let equipo = null;

  if (apiTeamId) equipo = await findEquipoByApiId(db, apiTeamId);
  if (!equipo && nombreEquipo) equipo = await findEquipoByNombre(db, nombreEquipo);

  return equipo ? equipo.id_equipo : null;
}

async function updateEquipoGrupoMundial(db, idEquipo, idGrupoMundial, grupoNombre = "") {
  if (!idEquipo || !idGrupoMundial) return;

  if (normalizeText(grupoNombre).toUpperCase() === "SIN GRUPO") {
    return;
  }

  await updateDynamic(
    db,
    "equipos",
    {
      id_grupo_mundial: idGrupoMundial,
      grupo_mundial: grupoNombre,
      fecha_actualizacion: nowIso()
    },
    "id_equipo",
    idEquipo
  );
}

async function upsertEquipo(db, team, idMundial, grupoInfo = null) {
  const apiTeamId = String(team.team_key || team.team_id || "");
  const nombre = normalizeText(team.team_name);
  const nombreCorto = normalizeText(team.team_name);
  const pais = normalizeText(team.team_country || team.country_name);
  const logo = normalizeText(team.team_badge);
  const fundado = normalizeText(team.team_founded);

  const venueName = normalizeText(team.venue?.venue_name);
  const venueAddress = normalizeText(team.venue?.venue_address);
  const venueCity = normalizeText(team.venue?.venue_city);

  if (!apiTeamId && !nombre) return { skipped: true };

  let existente = null;

  if (apiTeamId) existente = await findEquipoByApiId(db, apiTeamId);
  if (!existente && nombre) existente = await findEquipoByNombre(db, nombre);

  let idGrupoMundial = null;
  let grupoNombre = "";

  if (grupoInfo) {
    idGrupoMundial = await getOrCreateGrupoMundialId(db, idMundial, grupoInfo);
    grupoNombre = grupoInfo.nombre;
  } else if (!existente) {
    const sinGrupo = {
      codigo: "SIN_GRUPO",
      nombre: "Sin grupo",
      orden: 99
    };

    idGrupoMundial = await getOrCreateGrupoMundialId(db, idMundial, sinGrupo);
    grupoNombre = "Sin grupo";
  }

  const data = {
    id_mundial: idMundial,
    api_team_id: apiTeamId,
    nombre,
    nombre_corto: nombreCorto,
    codigo_fifa: "",
    pais,
    bandera_url: logo,
    logo_url: logo,
    team_founded: fundado,
    venue_name: venueName,
    venue_address: venueAddress,
    venue_city: venueCity,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  };

  if (idGrupoMundial) {
    data.id_grupo_mundial = idGrupoMundial;
    data.grupo_mundial = grupoNombre;
  }

  if (existente) {
    await updateDynamic(db, "equipos", data, "id_equipo", existente.id_equipo);

    return {
      inserted: false,
      updated: true,
      skipped: false,
      id_equipo: existente.id_equipo,
      nombre
    };
  }

  await insertDynamic(db, "equipos", data);

  return {
    inserted: true,
    updated: false,
    skipped: false,
    nombre
  };
}

async function ensureEquipoFromMatch(db, apiTeamId, nombre, idMundial, grupoInfo = null) {
  if (!apiTeamId && !nombre) return null;

  let equipo = null;

  if (apiTeamId) equipo = await findEquipoByApiId(db, apiTeamId);
  if (!equipo && nombre) equipo = await findEquipoByNombre(db, nombre);

  if (equipo) {
    if (grupoInfo && grupoInfo.codigo !== "SIN_GRUPO") {
      const idGrupoMundial = await getOrCreateGrupoMundialId(db, idMundial, grupoInfo);
      await updateEquipoGrupoMundial(db, equipo.id_equipo, idGrupoMundial, grupoInfo.nombre);
    }

    return equipo.id_equipo;
  }

  await upsertEquipo(
    db,
    {
      team_key: apiTeamId,
      team_id: apiTeamId,
      team_name: nombre,
      team_country: ""
    },
    idMundial,
    grupoInfo
  );

  equipo = apiTeamId
    ? await findEquipoByApiId(db, apiTeamId)
    : await findEquipoByNombre(db, nombre);

  return equipo ? equipo.id_equipo : null;
}

/* ======================================================
   JUGADORES
====================================================== */

async function findJugadorByApiId(db, apiPlayerId) {
  const columns = await getTableColumns(db, "jugadores");

  if (!columns.includes("api_player_id")) return null;

  return await db
    .prepare(`
      SELECT *
      FROM jugadores
      WHERE api_player_id = ?
      LIMIT 1
    `)
    .bind(String(apiPlayerId))
    .first();
}

async function findJugadorByEquipoYNombre(db, idEquipo, nombreCompleto) {
  const columns = await getTableColumns(db, "jugadores");

  const nombreColumn = columns.includes("nombre_completo")
    ? "nombre_completo"
    : columns.includes("nombre_popular")
      ? "nombre_popular"
      : "nombre";

  return await db
    .prepare(`
      SELECT *
      FROM jugadores
      WHERE id_equipo = ?
        AND LOWER(${nombreColumn}) = LOWER(?)
      LIMIT 1
    `)
    .bind(idEquipo, nombreCompleto)
    .first();
}

async function upsertJugador(db, player, idEquipo) {
  const apiPlayerId = String(player.player_key || player.player_id || "");
  const nombreCompleto = normalizeText(player.player_name);
  const dorsal = normalizeText(player.player_number);
  const posicion = normalizeText(player.player_type || player.player_position);
  const foto = normalizeText(player.player_image);
  const pais = normalizeText(player.player_country);
  const edad = normalizeText(player.player_age);
  const fechaNacimiento = normalizeText(player.player_birthdate);

  if (!apiPlayerId && !nombreCompleto) return { skipped: true };

  const partes = nombreCompleto.split(" ");
  const nombre = partes.shift() || nombreCompleto;
  const apellido = partes.join(" ");

  const data = {
    id_equipo: idEquipo,
    api_player_id: apiPlayerId,
    nombre,
    apellido,
    nombre_completo: nombreCompleto,
    nombre_popular: nombreCompleto,
    dorsal,
    posicion,
    foto_url: foto,
    pais,
    edad,
    fecha_nacimiento: fechaNacimiento,
    confirmado: 0,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  };

  let existente = null;

  if (apiPlayerId) existente = await findJugadorByApiId(db, apiPlayerId);

  if (!existente && idEquipo && nombreCompleto) {
    existente = await findJugadorByEquipoYNombre(db, idEquipo, nombreCompleto);
  }

  if (existente) {
    await updateDynamic(db, "jugadores", data, "id_jugador", existente.id_jugador);

    return {
      inserted: false,
      updated: true,
      skipped: false,
      id_jugador: existente.id_jugador,
      nombre: nombreCompleto
    };
  }

  await insertDynamic(db, "jugadores", data);

  return {
    inserted: true,
    updated: false,
    skipped: false,
    nombre: nombreCompleto
  };
}

/* ======================================================
   PARTIDOS
====================================================== */

async function findPartidoByApiId(db, apiMatchId) {
  const columns = await getTableColumns(db, "partidos");

  if (!columns.includes("api_match_id")) return null;

  return await db
    .prepare(`
      SELECT *
      FROM partidos
      WHERE api_match_id = ?
      LIMIT 1
    `)
    .bind(String(apiMatchId))
    .first();
}

async function findPartidoByEquiposYFecha(db, idEquipoLocal, idEquipoVisitante, fechaHora) {
  const columns = await getTableColumns(db, "partidos");

  if (
    !columns.includes("id_equipo_local") ||
    !columns.includes("id_equipo_visitante") ||
    !columns.includes("fecha_hora")
  ) {
    return null;
  }

  if (!idEquipoLocal || !idEquipoVisitante || !fechaHora) return null;

  return await db
    .prepare(`
      SELECT *
      FROM partidos
      WHERE id_equipo_local = ?
        AND id_equipo_visitante = ?
        AND fecha_hora = ?
      LIMIT 1
    `)
    .bind(idEquipoLocal, idEquipoVisitante, fechaHora)
    .first();
}

async function findPartidoExistente(db, apiMatchId, idEquipoLocal, idEquipoVisitante, fechaHora) {
  let existente = null;

  if (apiMatchId) existente = await findPartidoByApiId(db, apiMatchId);

  if (!existente) {
    existente = await findPartidoByEquiposYFecha(
      db,
      idEquipoLocal,
      idEquipoVisitante,
      fechaHora
    );
  }

  return existente;
}

async function upsertPartido(db, match, leagueId, idMundial) {
  const apiMatchId = String(match.match_id || "");
  if (!apiMatchId) return { skipped: true };

  const faseInfo = inferFaseFromMatch(match);
  const grupoInfo = inferGrupoFromMatch(match);

  const apiLocalId = String(match.match_hometeam_id || "");
  const apiVisitanteId = String(match.match_awayteam_id || "");

  const nombreLocal = normalizeText(match.match_hometeam_name);
  const nombreVisitante = normalizeText(match.match_awayteam_name);

  const idEquipoLocal = await ensureEquipoFromMatch(
    db,
    apiLocalId,
    nombreLocal,
    idMundial,
    grupoInfo
  );

  const idEquipoVisitante = await ensureEquipoFromMatch(
    db,
    apiVisitanteId,
    nombreVisitante,
    idMundial,
    grupoInfo
  );

  const idFase = await getOrCreateFaseId(db, faseInfo);
  const idGrupoMundial = await getOrCreateGrupoMundialId(db, idMundial, grupoInfo);

  const nombreEstadio =
    normalizeText(match.match_stadium) ||
    normalizeText(match.venue_name) ||
    "Estadio por definir";

  const ciudadEstadio =
    normalizeText(match.match_country) ||
    normalizeText(match.venue_city) ||
    "Por definir";

  const idEstadio = await getOrCreateEstadioId(db, nombreEstadio, ciudadEstadio);

  const fechaHora = buildFechaHora(match);

  const golesLocal =
    match.match_hometeam_score !== "" &&
    match.match_hometeam_score !== null &&
    match.match_hometeam_score !== undefined
      ? Number(match.match_hometeam_score)
      : null;

  const golesVisitante =
    match.match_awayteam_score !== "" &&
    match.match_awayteam_score !== null &&
    match.match_awayteam_score !== undefined
      ? Number(match.match_awayteam_score)
      : null;

  const estadoPartido = normalizeText(match.match_status || "Pendiente");

  const data = {
    id_mundial: idMundial,
    id_fase: idFase,
    id_grupo_mundial: idGrupoMundial,
    id_grupo: idGrupoMundial,
    id_equipo_local: idEquipoLocal,
    id_equipo_visitante: idEquipoVisitante,
    id_estadio: idEstadio,

    api_match_id: apiMatchId,
    api_league_id: String(leagueId),

    equipo_local_nombre: nombreLocal,
    equipo_visitante_nombre: nombreVisitante,

    fecha_hora: fechaHora,
    fecha_partido: match.match_date || "",
    hora_partido: match.match_time || "",
    fecha: match.match_date || "",
    hora: match.match_time || "",
    timezone: match.match_timezone || "America/Lima",

    estadio: nombreEstadio,
    ciudad: ciudadEstadio,
    fase: faseInfo.nombre,
    fase_nombre: faseInfo.nombre,
    grupo_mundial: grupoInfo.nombre,
    grupo_nombre: grupoInfo.nombre,

    goles_local: golesLocal,
    goles_visitante: golesVisitante,

    estado_partido: estadoPartido,
    estado: "1",
    fecha_registro: nowIso(),
    fecha_actualizacion: nowIso()
  };

  const existente = await findPartidoExistente(
    db,
    apiMatchId,
    idEquipoLocal,
    idEquipoVisitante,
    fechaHora
  );

  if (existente) {
    await updateDynamic(db, "partidos", data, "id_partido", existente.id_partido);

    return {
      inserted: false,
      updated: true,
      skipped: false,
      id_partido: existente.id_partido,
      partido: `${nombreLocal} vs ${nombreVisitante}`
    };
  }

  await insertDynamic(db, "partidos", data);

  return {
    inserted: true,
    updated: false,
    skipped: false,
    partido: `${nombreLocal} vs ${nombreVisitante}`
  };
}

/* ======================================================
   EXPORTS PRINCIPALES
====================================================== */

export async function syncEquiposApiFootball(db, env) {
  const fechaInicio = nowIso();
  const leagueId = getLeagueId(env);

  try {
    const idMundial = await getOrCreateMundialId(db, env);

    const data = await callApiFootball(env, {
      action: "get_teams",
      league_id: leagueId
    });

    const equipos = normalizeList(data);

    let insertados = 0;
    let actualizados = 0;
    let omitidos = 0;

    for (const team of equipos) {
      const result = await upsertEquipo(db, team, idMundial, null);

      if (result.inserted) insertados++;
      else if (result.updated) actualizados++;
      else omitidos++;
    }

    await safeLog(
      db,
      "EQUIPOS",
      "OK",
      `Equipos sincronizados. Insertados: ${insertados}, actualizados: ${actualizados}, omitidos: ${omitidos}`,
      fechaInicio
    );

    return {
      league_id: leagueId,
      id_mundial: idMundial,
      total_api: equipos.length,
      insertados,
      actualizados,
      omitidos
    };
  } catch (error) {
    await safeLog(db, "EQUIPOS", "ERROR", error.message, fechaInicio);
    throw error;
  }
}

export async function syncJugadoresApiFootball(db, env, options = {}) {
  const fechaInicio = nowIso();

  try {
    const offset = Number(options.offset || 0);
    const limit = Number(options.limit || 1);

    const equiposRs = await db
      .prepare(`
        SELECT
          id_equipo,
          nombre,
          api_team_id
        FROM equipos
        WHERE api_team_id IS NOT NULL
          AND api_team_id <> ''
        ORDER BY id_equipo
        LIMIT ?
        OFFSET ?
      `)
      .bind(limit, offset)
      .all();

    const equiposProcesar = equiposRs.results || [];

    if (equiposProcesar.length === 0) {
      await safeLog(
        db,
        "JUGADORES",
        "OK",
        `No hay equipos pendientes para sincronizar jugadores. Offset: ${offset}`,
        fechaInicio
      );

      return {
        offset,
        limit,
        equipos_procesados: 0,
        procesados_en_esta_llamada: 0,
        siguiente_offset: offset + limit,
        terminado: true,
        jugadores_insertados: 0,
        jugadores_actualizados: 0,
        jugadores_omitidos: 0
      };
    }

    let equiposProcesados = 0;
    let jugadoresInsertados = 0;
    let jugadoresActualizados = 0;
    let jugadoresOmitidos = 0;

    for (const equipo of equiposProcesar) {
      const apiTeamId = String(equipo.api_team_id || "");

      if (!apiTeamId) {
        jugadoresOmitidos++;
        continue;
      }

      const data = await callApiFootball(env, {
        action: "get_teams",
        team_id: apiTeamId
      });

      const equiposApi = normalizeList(data);
      const equipoApi = equiposApi[0];

      if (!equipoApi) {
        jugadoresOmitidos++;
        continue;
      }

      const players = Array.isArray(equipoApi.players)
        ? equipoApi.players
        : [];

      equiposProcesados++;

      for (const player of players) {
        const result = await upsertJugador(db, player, equipo.id_equipo);

        if (result.inserted) jugadoresInsertados++;
        else if (result.updated) jugadoresActualizados++;
        else jugadoresOmitidos++;
      }
    }

    const totalEquiposRs = await db
      .prepare(`
        SELECT COUNT(*) AS total
        FROM equipos
        WHERE api_team_id IS NOT NULL
          AND api_team_id <> ''
      `)
      .first();

    const totalEquipos = Number(totalEquiposRs?.total || 0);
    const siguienteOffset = offset + limit;

    await safeLog(
      db,
      "JUGADORES",
      "OK",
      `Jugadores sincronizados. Insertados: ${jugadoresInsertados}, actualizados: ${jugadoresActualizados}, omitidos: ${jugadoresOmitidos}`,
      fechaInicio
    );

    return {
      total_equipos: totalEquipos,
      offset,
      limit,
      procesados_en_esta_llamada: equiposProcesar.length,
      siguiente_offset: siguienteOffset,
      terminado: siguienteOffset >= totalEquipos,
      equipos_procesados: equiposProcesados,
      jugadores_insertados: jugadoresInsertados,
      jugadores_actualizados: jugadoresActualizados,
      jugadores_omitidos: jugadoresOmitidos
    };
  } catch (error) {
    await safeLog(db, "JUGADORES", "ERROR", error.message, fechaInicio);
    throw error;
  }
}

export async function syncPartidosApiFootball(db, env, options = {}) {
  const fechaInicio = nowIso();
  const leagueId = getLeagueId(env);

  try {
    const idMundial = await getOrCreateMundialId(db, env);

    const data = await callApiFootball(env, {
      action: "get_events",
      league_id: leagueId,
      from: "2026-06-01",
      to: "2026-07-31",
      timezone: env.APIFOOTBALL_TIMEZONE || "America/Lima"
    });

    const partidos = normalizeList(data);

    const offset = Number(options.offset || 0);
    const limit = Number(options.limit || 10);

    const partidosProcesar = partidos.slice(offset, offset + limit);

    let insertados = 0;
    let actualizados = 0;
    let omitidos = 0;

    for (const match of partidosProcesar) {
      const result = await upsertPartido(db, match, leagueId, idMundial);

      if (result.inserted) insertados++;
      else if (result.updated) actualizados++;
      else omitidos++;
    }

    await safeLog(
      db,
      "PARTIDOS",
      "OK",
      `Partidos sincronizados. Insertados: ${insertados}, actualizados: ${actualizados}, omitidos: ${omitidos}`,
      fechaInicio
    );

    return {
      league_id: leagueId,
      id_mundial: idMundial,
      total_api: partidos.length,
      offset,
      limit,
      procesados_en_esta_llamada: partidosProcesar.length,
      siguiente_offset: offset + limit,
      terminado: offset + limit >= partidos.length,
      insertados,
      actualizados,
      omitidos
    };
  } catch (error) {
    await safeLog(db, "PARTIDOS", "ERROR", error.message, fechaInicio);
    throw error;
  }
}