import { http } from "./http";

export const api = {
  login: (payload) => http.post("/api/auth/login", payload),
  registrarUsuario: (payload) => http.post("/api/usuarios", payload),
  usuarios: () => http.get("/api/usuarios"),

  // PERFIL / CONTRASEÑA
  actualizarPerfil: (payload) =>
      http.put("/api/usuarios/perfil", payload),

  cambiarPassword: (payload) =>
      http.put("/api/usuarios/cambiar-password", payload),

  resetearPasswordUsuario: (payload) =>
      http.put("/api/admin/usuarios/reset-password", payload),

  mapaMundial: () => http.get("/api/mundial/mapa"),
  equipos: () => http.get("/api/equipos"),

  jugadores: (equipo) =>
      http.get(`/api/jugadores${equipo ? `?equipo=${equipo}` : ""}`),

  partidos: () => http.get("/api/partidos"),

  // Para la vista de administración de resultados
  partidosAdmin: () => http.get("/api/partidos"),

  goleadoresResultado: (idPartido) =>
      http.get(`/api/admin/resultados/goleadores?id_partido=${idPartido}`),

  grupos: () => http.get("/api/grupos"),

  misGrupos: (idUsuario) =>
      http.get(`/api/grupos/mis-grupos?usuario=${idUsuario}`),

  crearGrupo: (payload) => http.post("/api/grupos", payload),

  unirseGrupo: (payload) => http.post("/api/grupos/unirse", payload),

  actualizarCupo: (idGrupo, payload) =>
      http.put(`/api/grupos/${idGrupo}/cupo`, payload),

  ranking: (idGrupo) => http.get(`/api/grupos/${idGrupo}/ranking`),

  rankingGeneralGrupos: () => http.get("/api/grupos/ranking-general"),

  rankingGeneralEmpresa: () => http.get("/api/grupos/ranking-empresa"),

  guardarPrediccion: (payload) => http.post("/api/predicciones", payload),

  misPredicciones: (idUsuario, idGrupo = null) => {
    const params = new URLSearchParams();

    params.append("id_usuario", idUsuario);

    if (idGrupo) {
      params.append("id_grupo", idGrupo);
    }

    return http.get(`/api/predicciones/mis?${params.toString()}`);
  },

  registrarResultado: (payload) => http.post("/api/admin/resultados", payload),

  syncEquipos: () => http.post("/api/admin/sync/equipos", {}),
  syncPartidos: () => http.post("/api/admin/sync/partidos", {}),
  syncJugadores: () => http.post("/api/admin/sync/jugadores", {}),
  syncLogs: () => http.get("/api/admin/sync/logs")
};