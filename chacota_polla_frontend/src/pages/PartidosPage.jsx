import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Flag,
  Goal,
  Lock,
  Shirt,
  Trophy,
  UserRound,
  Download
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

const MAX_GOLEADORES = 3;

function getPlayerName(jugador) {
  return (
    jugador?.nombre_popular ||
    [jugador?.nombre, jugador?.apellido].filter(Boolean).join(" ") ||
    "Jugador"
  );
}

function getTeamShortName(name = "") {
  if (!name) return "Equipo";
  return name.length > 18 ? `${name.slice(0, 18)}...` : name;
}

function formatMatchDate(value) {
  if (!value) return "Sin fecha";

  const raw = String(value);
  const date = new Date(
    raw.includes("T") && /Z$|[+-]\d{2}:\d{2}$/.test(raw)
      ? raw
      : `${raw.replace(" ", "T")}-05:00`
  );

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function parseMatchDate(value) {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const date = new Date(
    raw.includes("T") && /Z$|[+-]\d{2}:\d{2}$/.test(raw)
      ? raw
      : `${raw.replace(" ", "T")}-05:00`
  );

  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizarEstadoPartido(estado) {
  return String(estado || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
}

function partidoPermitePrediccion(partido) {
  if (!partido) return false;

  const estado = normalizarEstadoPartido(partido.estado_partido);
  const estadoPermitido = ["PENDIENTE", "NOT_STARTED", "NOTSTARTED", "NS"].includes(estado);

  const fecha = parseMatchDate(partido.fecha_hora);
  if (!fecha) return estadoPermitido;

  const limite = new Date(fecha.getTime() - 5 * 60 * 1000);

  return estadoPermitido && new Date() < limite;
}

function TeamFlag({ src, alt, size = 34 }) {
  if (!src) {
    return (
      <div
        className="team-flag team-flag-placeholder"
        style={{ width: size, height: size }}
      >
        <Flag size={16} />
      </div>
    );
  }

  return (
    <img
      className="team-flag"
      src={src}
      alt={alt || "Bandera"}
      style={{ width: size, height: size }}
    />
  );
}

function PlayerBetCard({ jugador, active, disabled, onClick, teamName }) {
  const nombre = getPlayerName(jugador);
  const posicion = jugador.posicion || "Sin posición";
  const dorsal = jugador.dorsal || "--";

  return (
    <button
      type="button"
      className={`bet-player-card ${active ? "active" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="bet-player-shirt">
        <Shirt size={38} />
        <strong>{dorsal}</strong>
      </div>

      <div className="bet-player-info">
        <strong>{nombre}</strong>
        <span>{posicion}</span>
        <small>{teamName || "Equipo"}</small>
      </div>

      <div className="bet-player-check">
        <UserRound size={13} />
        <span>{active ? "Seleccionado" : "Elegir"}</span>
      </div>
    </button>
  );
}

function getPredictionLabelByGoals(prediccion, partido) {
  const golesLocal = Number(prediccion?.goles_local_predicho ?? 0);
  const golesVisitante = Number(prediccion?.goles_visitante_predicho ?? 0);

  if (golesLocal > golesVisitante) {
    return `Gana ${partido?.equipo_local || "Local"}`;
  }

  if (golesVisitante > golesLocal) {
    return `Gana ${partido?.equipo_visitante || "Visitante"}`;
  }

  return "Empate";
}

function normalizarGoleadores(goleadores) {
  if (!Array.isArray(goleadores)) return [];

  return goleadores
    .map((g) => {
      if (typeof g === "object") {
        return Number(g.id_jugador);
      }

      return Number(g);
    })
    .filter(Boolean);
}

export default function PartidosPage() {
  const { user } = useAuth();

  const [partidos, setPartidos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [predicciones, setPredicciones] = useState([]);
  const [prediccionesGrupo, setPrediccionesGrupo] = useState([]);
  const [loadingPredicciones, setLoadingPredicciones] = useState(false);

  const [form, setForm] = useState({
    id_grupo: "",
    id_partido: "",
    goles_local_predicho: 0,
    goles_visitante_predicho: 0,
    goleadores: []
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getPrediccionPartido = (idPartido, idGrupo = null) => {
    return predicciones.find((p) => {
      const mismoPartido = Number(p.id_partido) === Number(idPartido);

      if (!idGrupo) {
        return mismoPartido;
      }

      return mismoPartido && Number(p.id_grupo) === Number(idGrupo);
    });
  };

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [p, g, j, pr] = await Promise.all([
        api.partidos(),
        api.misGrupos(user.id_usuario),
        api.jugadores(),
        api.misPredicciones(user.id_usuario)
      ]);

      const gruposData = Array.isArray(g) ? g : [];

      setPartidos(Array.isArray(p) ? p : []);
      setGrupos(gruposData);
      setJugadores(Array.isArray(j) ? j : []);
      setPredicciones(Array.isArray(pr) ? pr : []);

      if (gruposData.length > 0) {
        setForm((prev) => ({
          ...prev,
          id_grupo: prev.id_grupo || String(gruposData[0].id_grupo)
        }));
      }
    } catch (err) {
      setError(err.message || "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const partidoSeleccionado = useMemo(() => {
    return partidos.find(
      (p) => Number(p.id_partido) === Number(form.id_partido)
    );
  }, [partidos, form.id_partido]);

  const jugadoresPartido = useMemo(() => {
    if (!partidoSeleccionado) return [];

    const local = Number(partidoSeleccionado.id_equipo_local);
    const visitante = Number(partidoSeleccionado.id_equipo_visitante);

    return jugadores.filter((j) =>
      [local, visitante].includes(Number(j.id_equipo))
    );
  }, [jugadores, partidoSeleccionado]);

  const prediccionAbierta = partidoPermitePrediccion(partidoSeleccionado);

  const resultadoCalculado = useMemo(() => {
    if (!partidoSeleccionado) {
      return {
        tipo: "",
        idGanador: null,
        label: "Selecciona un partido"
      };
    }

    const golesLocal = Number(form.goles_local_predicho || 0);
    const golesVisitante = Number(form.goles_visitante_predicho || 0);

    if (golesLocal > golesVisitante) {
      return {
        tipo: "GANADOR",
        idGanador: Number(partidoSeleccionado.id_equipo_local),
        label: `Gana ${partidoSeleccionado.equipo_local || "local"}`
      };
    }

    if (golesVisitante > golesLocal) {
      return {
        tipo: "GANADOR",
        idGanador: Number(partidoSeleccionado.id_equipo_visitante),
        label: `Gana ${partidoSeleccionado.equipo_visitante || "visitante"}`
      };
    }

    return {
      tipo: "EMPATE",
      idGanador: null,
      label: "Empate"
    };
  }, [
    form.goles_local_predicho,
    form.goles_visitante_predicho,
    partidoSeleccionado
  ]);

  const cargarPrediccionesGlobales = async (idPartido) => {
    if (!idPartido) return;
    setLoadingPredicciones(true);
    try {
      // Obtenemos todos los grupos del sistema para ver todas las apuestas
      const todosLosGrupos = await api.grupos();
      const gruposArray = Array.isArray(todosLosGrupos) ? todosLosGrupos : [];
      
      // Intentamos cargar de todos los grupos del sistema
      const promesas = gruposArray.map(g => api.prediccionesPartido(idPartido, g.id_grupo));
      const resultados = await Promise.all(promesas);
      
      // Aplanamos y quitamos duplicados por id_usuario
      const todas = resultados.flat();
      const unicas = [];
      const mapa = new Map();
      
      for (const p of todas) {
        if (p && !mapa.has(p.id_usuario)) {
          mapa.set(p.id_usuario, true);
          unicas.push(p);
        }
      }
      
      setPrediccionesGrupo(unicas);
    } catch (err) {
      console.error("Error al cargar predicciones globales:", err);
    } finally {
      setLoadingPredicciones(false);
    }
  };

  const selectMatch = (p) => {
    const prediccionGuardada = getPrediccionPartido(
      p.id_partido,
      form.id_grupo
    );

    setForm((prev) => ({
      ...prev,
      id_partido: p.id_partido,
      goles_local_predicho: prediccionGuardada?.goles_local_predicho ?? 0,
      goles_visitante_predicho:
        prediccionGuardada?.goles_visitante_predicho ?? 0,
      goleadores: normalizarGoleadores(prediccionGuardada?.goleadores)
    }));

    setPrediccionesGrupo([]);
    setMessage("");
    setError("");

    // Si el partido está cerrado, cargamos apuestas de todos los grupos
    const abierto = partidoPermitePrediccion(p);
    if (!abierto) {
      cargarPrediccionesGlobales(p.id_partido);
    }
  };

  const cargarPrediccionesGrupo = async (idPartido, idGrupo) => {
    if (!idPartido || !idGrupo) return;

    setLoadingPredicciones(true);
    try {
      const data = await api.prediccionesPartido(idPartido, idGrupo);
      setPrediccionesGrupo(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar predicciones del grupo:", err);
      setPrediccionesGrupo([]);
    } finally {
      setLoadingPredicciones(false);
    }
  };

  const toggleScorer = (idJugador) => {
    if (!prediccionAbierta) return;

    const id = Number(idJugador);

    setForm((prev) => {
      const exists = prev.goleadores.includes(id);

      if (!exists && prev.goleadores.length >= MAX_GOLEADORES) {
        setError(`Solo puedes seleccionar hasta ${MAX_GOLEADORES} jugadores goleadores.`);
        return prev;
      }

      setError("");

      return {
        ...prev,
        goleadores: exists
          ? prev.goleadores.filter((x) => Number(x) !== id)
          : [...prev.goleadores, id]
      };
    });
  };

  const getPlayerTeamName = (jugador) => {
    if (!partidoSeleccionado) return "";

    if (
      Number(jugador.id_equipo) ===
      Number(partidoSeleccionado.id_equipo_local)
    ) {
      return partidoSeleccionado.equipo_local;
    }

    if (
      Number(jugador.id_equipo) ===
      Number(partidoSeleccionado.id_equipo_visitante)
    ) {
      return partidoSeleccionado.equipo_visitante;
    }

    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.id_grupo) {
      setError("Debes seleccionar un grupo de polla.");
      return;
    }

    if (!form.id_partido) {
      setError("Debes seleccionar un partido.");
      return;
    }

    if (!prediccionAbierta) {
      setError("La predicción está cerrada. El partido ya inició o está por iniciar.");
      return;
    }

    if (form.goleadores.length > MAX_GOLEADORES) {
      setError(`Solo puedes seleccionar hasta ${MAX_GOLEADORES} jugadores goleadores.`);
      return;
    }

    try {
      await api.guardarPrediccion({
        id_usuario: user.id_usuario,
        id_grupo: Number(form.id_grupo),
        id_partido: Number(form.id_partido),
        equipo_ganador_predicho: resultadoCalculado.idGanador,
        resultado_predicho: resultadoCalculado.tipo,
        goles_local_predicho: Number(form.goles_local_predicho),
        goles_visitante_predicho: Number(form.goles_visitante_predicho),
        goleadores: form.goleadores.map(Number)
      });

      setMessage("Predicción guardada correctamente.");

      const nuevasPredicciones = await api.misPredicciones(user.id_usuario);
      setPredicciones(Array.isArray(nuevasPredicciones) ? nuevasPredicciones : []);
    } catch (err) {
      setError(err.message || "No se pudo guardar la predicción.");
    }
  };

  const renderSavedPredictionCard = (prediccion, partido) => {
    if (!prediccion || !partido) return null;

    return (
      <div className="fixture-saved-prediction">
        <span>Tu predicción</span>

        <div className="fixture-saved-score">
          <strong>{getTeamShortName(partido.equipo_local || "Local")}</strong>

          <b>
            {prediccion.goles_local_predicho ?? 0} -{" "}
            {prediccion.goles_visitante_predicho ?? 0}
          </b>

          <strong>
            {getTeamShortName(partido.equipo_visitante || "Visitante")}
          </strong>
        </div>

        <small>{getPredictionLabelByGoals(prediccion, partido)}</small>
      </div>
    );
  };

  const handleDownloadPDF = () => {
    if (!partidoSeleccionado || prediccionesGrupo.length === 0) return;

    const doc = new jsPDF();
    const title = `Apuestas: ${partidoSeleccionado.equipo_local} vs ${partidoSeleccionado.equipo_visitante}`;
    const dateStr = formatMatchDate(partidoSeleccionado.fecha_hora);

    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(11);
    doc.text(`Fecha: ${dateStr}`, 14, 30);
    doc.text(`Reporte: Todas las apuestas del sistema`, 14, 37);

    const tableData = prediccionesGrupo.map(p => [
      `${p.nombres} ${p.apellidos}`,
      `${p.goles_local_predicho} - ${p.goles_visitante_predicho}`
    ]);

    autoTable(doc, {
      startY: 45,
      head: [["Nombre", "Predicción"]],
      body: tableData,
    });

    doc.save(`apuestas_${partidoSeleccionado.equipo_local}_vs_${partidoSeleccionado.equipo_visitante}.pdf`);
  };

  const renderPredictionPanel = (mobile = false) => {
    if (!partidoSeleccionado) return null;

    // Si es móvil y NO es el renderizado móvil explícito, retornamos null
    // para evitar duplicidad de tarjetas una debajo de otra.
    const isMobileViewport = window.innerWidth <= 768;
    if (isMobileViewport && !mobile) return null;
    if (!isMobileViewport && mobile) return null;

    const showOthers = !prediccionAbierta;

    return (
      <div className={`prediction-container-flex ${mobile ? "mobile-v" : "desktop-v"}`}>
        <section
          className={`panel prediction-panel ${
            mobile ? "mobile-inline-prediction" : "desktop-prediction-panel"
          }`}
        >
          <div className="panel-title">
            <h3>Mi predicción</h3>
            {!prediccionAbierta && (
              <span className="prediction-closed-badge">
                <Lock size={14} /> Predicción cerrada
              </span>
            )}
          </div>

          <form className="form prediction-form" onSubmit={submit}>
            <div className="prediction-form-grid prediction-form-grid-single">
              <div>
                <label>Grupo de polla</label>
                <select
                  value={form.id_grupo}
                  onChange={(e) => {
                    const nuevoGrupo = e.target.value;
                    const prediccionGuardada = form.id_partido
                      ? getPrediccionPartido(form.id_partido, nuevoGrupo)
                      : null;

                    setForm({
                      ...form,
                      id_grupo: nuevoGrupo,
                      goles_local_predicho:
                        prediccionGuardada?.goles_local_predicho ?? 0,
                      goles_visitante_predicho:
                        prediccionGuardada?.goles_visitante_predicho ?? 0,
                      goleadores: normalizarGoleadores(
                        prediccionGuardada?.goleadores
                      )
                    });

                    // Cargar apuestas de otros si está cerrado
                    if (!partidoPermitePrediccion(partidoSeleccionado)) {
                      cargarPrediccionesGrupo(form.id_partido, nuevoGrupo);
                    }
                  }}
                >
                  <option value="">Seleccione</option>
                  {grupos.map((g) => (
                    <option key={g.id_grupo} value={g.id_grupo}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prediction-summary-card">
                <span>Resultado calculado</span>
                <strong>{resultadoCalculado.label}</strong>
                <small>Se interpreta automáticamente según el marcador.</small>
              </div>
            </div>

            <div className="prediction-score-grid pro-score-grid">
              <div className="score-team-card">
                <div className="score-team-head no-flag">
                  <div>
                    <strong>{partidoSeleccionado.equipo_local || "Local"}</strong>
                    <small>Local</small>
                  </div>
                </div>

                <input
                  type="number"
                  min="0"
                  value={form.goles_local_predicho}
                  disabled={!prediccionAbierta}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      goles_local_predicho: e.target.value
                    })
                  }
                  aria-label={`Goles de ${partidoSeleccionado.equipo_local || "local"}`}
                />
              </div>

              <div className="score-team-card">
                <div className="score-team-head no-flag">
                  <div>
                    <strong>
                      {partidoSeleccionado.equipo_visitante || "Visitante"}
                    </strong>
                    <small>Visitante</small>
                  </div>
                </div>

                <input
                  type="number"
                  min="0"
                  value={form.goles_visitante_predicho}
                  disabled={!prediccionAbierta}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      goles_visitante_predicho: e.target.value
                    })
                  }
                  aria-label={`Goles de ${partidoSeleccionado.equipo_visitante || "visitante"}`}
                />
              </div>
            </div>

            <div className="scorers-section">
              <div className="section-headline scorers-headline-row">
                <div>
                  <h4>¿Por quién apostar?</h4>
                  <p>
                    Puedes elegir hasta 3 jugadores. Cada acierto suma 1 punto y cada fallo resta 1.
                  </p>
                </div>

                <strong className="scorers-counter">
                  {form.goleadores.length}/{MAX_GOLEADORES}
                </strong>
              </div>

              {jugadoresPartido.length === 0 ? (
                <div className="empty-player-state">
                  <Goal size={30} />
                  <p>No hay jugadores cargados para este partido.</p>
                </div>
              ) : (
                <div className="single-players-carousel">
                  {jugadoresPartido.map((j) => {
                    const active = form.goleadores.includes(Number(j.id_jugador));

                    return (
                      <PlayerBetCard
                        key={j.id_jugador}
                        jugador={j}
                        active={active}
                        disabled={!prediccionAbierta}
                        teamName={getPlayerTeamName(j)}
                        onClick={() => toggleScorer(j.id_jugador)}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="prediction-actions">
              <button className="btn primary" type="submit" disabled={!prediccionAbierta}>
                {prediccionAbierta ? "Guardar predicción" : "Predicción cerrada"}
              </button>
            </div>
          </form>
        </section>

        {showOthers && (
          <section className="panel others-predictions-panel">
            <div className="panel-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Apuestas generales</h3>
              {prediccionesGrupo.length > 0 && (
                <button 
                  className="btn btn-icon-only" 
                  onClick={handleDownloadPDF}
                  title="Descargar PDF"
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '4px' }}
                >
                  <Download size={20} />
                </button>
              )}
            </div>
            {loadingPredicciones ? (
              <Loading />
            ) : prediccionesGrupo.length === 0 ? (
              <p className="empty-state">No hay más apuestas registradas.</p>
            ) : (
              <div className="others-predictions-list">
                {prediccionesGrupo
                  .filter((p) => Number(p.id_usuario) !== Number(user.id_usuario))
                  .map((p) => (
                    <div key={p.id_usuario} className="other-prediction-item">
                      <div className="user-info">
                        <strong>{p.nombres} {p.apellidos}</strong>
                        <small>@{p.usuario}</small>
                      </div>
                      <div className="user-score">
                        <span className="score-pill">
                          {p.goles_local_predicho} - {p.goles_visitante_predicho}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}
      </div>
    );
  };

  if (loading) return <Loading />;

  return (
    <div className="partidos-page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Fixture y predicciones</span>
          <h2>Partidos</h2>
          <p>
            Registra marcador y hasta 3 posibles goleadores. Si ya apostaste, tu predicción aparece en el fixture.
          </p>
        </div>
      </header>

      <Alert type="success">{message}</Alert>
      <Alert type="danger">{error}</Alert>

      <div className="partidos-layout">
        <section className="panel fixture-panel">
          <div className="panel-title">
            <h3>Fixture</h3>
          </div>

          <div className="match-list modern-match-list">
            {partidos.map((p) => {
              const selected = Number(form.id_partido) === Number(p.id_partido);
              const prediccionGuardada = getPrediccionPartido(p.id_partido, form.id_grupo);
              const abierto = partidoPermitePrediccion(p);

              return (
                <div className="match-with-prediction" key={p.id_partido}>
                  <button
                    type="button"
                    className={`match-card pro-match-card ${selected ? "selected" : ""}`}
                    onClick={() => selectMatch(p)}
                  >
                    <div className="match-main-row">
                      <div className="team-compact">
                        <TeamFlag
                          src={p.bandera_local || p.bandera_url_local}
                          alt={p.equipo_local}
                          size={34}
                        />
                        <strong>
                          {getTeamShortName(p.equipo_local || "Por definir")}
                        </strong>
                      </div>

                      <span className="match-vs-pill">VS</span>

                      <div className="team-compact right">
                        <strong>
                          {getTeamShortName(p.equipo_visitante || "Por definir")}
                        </strong>
                        <TeamFlag
                          src={p.bandera_visitante || p.bandera_url_visitante}
                          alt={p.equipo_visitante}
                          size={34}
                        />
                      </div>
                    </div>

                    <div className="match-meta-grid">
                      <span>
                        <CalendarDays size={14} />
                        {formatMatchDate(p.fecha_hora)}
                      </span>

                      <span>
                        <Trophy size={14} />
                        {p.fase || p.fase_nombre || "Sin fase"}
                      </span>

                      <span>
                        <Flag size={14} />
                        {p.grupo_nombre || "Sin grupo"}
                      </span>
                    </div>

                    <div className="match-status-row">
                      <small>{p.ciudad || "Por definir"}</small>
                      <em className={!abierto ? "closed" : ""}>
                        {abierto ? p.estado_partido || "Pendiente" : "Cerrado"}
                      </em>
                    </div>

                    {prediccionGuardada && renderSavedPredictionCard(prediccionGuardada, p)}
                  </button>

                  {/* Renderizado móvil: aparece justo debajo del partido seleccionado */}
                  {selected && renderPredictionPanel(true)}
                </div>
              );
            })}
          </div>
        </section>

        {/* Renderizado desktop: panel lateral */}
        <section className="prediction-panel-desktop-wrapper">
          {partidoSeleccionado && renderPredictionPanel(false)}
        </section>
      </div>
    </div>
  );
}
