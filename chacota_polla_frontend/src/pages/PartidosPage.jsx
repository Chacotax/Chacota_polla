import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Flag,
  Goal,
  Shirt,
  Trophy,
  UserRound
} from "lucide-react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

const POSITION_ORDER = [
  "Arqueros",
  "Defensas",
  "Mediocampistas",
  "Delanteros",
  "Otros"
];

function normalizePosition(posicion = "") {
  const p = String(posicion).toLowerCase();

  if (p.includes("goal") || p.includes("keeper") || p.includes("arquero") || p.includes("portero")) {
    return "Arqueros";
  }

  if (p.includes("defender") || p.includes("defensa") || p.includes("back")) {
    return "Defensas";
  }

  if (p.includes("midfielder") || p.includes("midfield") || p.includes("mediocamp")) {
    return "Mediocampistas";
  }

  if (p.includes("forward") || p.includes("striker") || p.includes("winger") || p.includes("delanter")) {
    return "Delanteros";
  }

  return "Otros";
}

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

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
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

function PlayerJerseyCard({ jugador, active, onClick }) {
  const nombre = getPlayerName(jugador);
  const posicion = jugador.posicion || "Sin posición";
  const dorsal = jugador.dorsal || "--";

  return (
      <button
          type="button"
          className={`jersey-player-card ${active ? "active" : ""}`}
          onClick={onClick}
      >
        <div className="jersey-visual">
          <div className="jersey-shirt">
            <Shirt size={42} />
            <strong>{dorsal}</strong>
          </div>
        </div>

        <div className="jersey-info">
          <strong>{nombre}</strong>
          <span>{posicion}</span>
        </div>

        <div className="jersey-footer">
          <UserRound size={14} />
          <small>Seleccionar goleador</small>
        </div>
      </button>
  );
}

export default function PartidosPage() {
  const { user } = useAuth();

  const [partidos, setPartidos] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [jugadores, setJugadores] = useState([]);

  const [form, setForm] = useState({
    id_grupo: "",
    id_partido: "",
    equipo_ganador_predicho: "",
    goles_local_predicho: 0,
    goles_visitante_predicho: 0,
    goleadores: []
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const [p, g, j] = await Promise.all([
        api.partidos(),
        api.misGrupos(user.id_usuario),
        api.jugadores()
      ]);

      setPartidos(Array.isArray(p) ? p : []);
      setGrupos(Array.isArray(g) ? g : []);
      setJugadores(Array.isArray(j) ? j : []);
    } catch (err) {
      setError(err.message || "No se pudo cargar la información.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const partidoSeleccionado = useMemo(() => {
    return partidos.find((p) => Number(p.id_partido) === Number(form.id_partido));
  }, [partidos, form.id_partido]);

  const jugadoresPartido = useMemo(() => {
    if (!partidoSeleccionado) return [];

    const local = Number(partidoSeleccionado.id_equipo_local);
    const visitante = Number(partidoSeleccionado.id_equipo_visitante);

    return jugadores.filter((j) =>
        [local, visitante].includes(Number(j.id_equipo))
    );
  }, [jugadores, partidoSeleccionado]);

  const jugadoresLocal = useMemo(() => {
    if (!partidoSeleccionado) return [];

    return jugadoresPartido.filter(
        (j) => Number(j.id_equipo) === Number(partidoSeleccionado.id_equipo_local)
    );
  }, [jugadoresPartido, partidoSeleccionado]);

  const jugadoresVisitante = useMemo(() => {
    if (!partidoSeleccionado) return [];

    return jugadoresPartido.filter(
        (j) => Number(j.id_equipo) === Number(partidoSeleccionado.id_equipo_visitante)
    );
  }, [jugadoresPartido, partidoSeleccionado]);

  const groupPlayersByPosition = (lista) => {
    const grouped = {};
    POSITION_ORDER.forEach((p) => {
      grouped[p] = [];
    });

    lista.forEach((j) => {
      const key = normalizePosition(j.posicion);
      grouped[key].push(j);
    });

    return grouped;
  };

  const localByPosition = useMemo(
      () => groupPlayersByPosition(jugadoresLocal),
      [jugadoresLocal]
  );

  const visitanteByPosition = useMemo(
      () => groupPlayersByPosition(jugadoresVisitante),
      [jugadoresVisitante]
  );

  const selectMatch = (p) => {
    setForm((prev) => ({
      ...prev,
      id_partido: p.id_partido,
      equipo_ganador_predicho: "",
      goles_local_predicho: 0,
      goles_visitante_predicho: 0,
      goleadores: []
    }));

    setMessage("");
    setError("");
  };

  const toggleScorer = (idJugador) => {
    const id = Number(idJugador);

    setForm((prev) => {
      const exists = prev.goleadores.includes(id);

      return {
        ...prev,
        goleadores: exists
            ? prev.goleadores.filter((x) => Number(x) !== id)
            : [...prev.goleadores, id]
      };
    });
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

    if (form.equipo_ganador_predicho === "") {
      setError("Debes seleccionar local, empate o visitante.");
      return;
    }

    try {
      await api.guardarPrediccion({
        id_usuario: user.id_usuario,
        id_grupo: Number(form.id_grupo),
        id_partido: Number(form.id_partido),
        equipo_ganador_predicho:
            form.equipo_ganador_predicho === "EMPATE"
                ? 0
                : Number(form.equipo_ganador_predicho),
        goles_local_predicho: Number(form.goles_local_predicho),
        goles_visitante_predicho: Number(form.goles_visitante_predicho),
        goleadores: form.goleadores.map(Number)
      });

      setMessage("Predicción guardada correctamente.");
    } catch (err) {
      setError(err.message || "No se pudo guardar la predicción.");
    }
  };

  const renderPlayersCarousel = (title, teamName, flagUrl, groupedPlayers) => {
    const total = POSITION_ORDER.reduce(
        (acc, position) => acc + (groupedPlayers[position]?.length || 0),
        0
    );

    return (
        <div className="team-scorers-block">
          <div className="team-scorers-header">
            <div className="team-scorers-title">
              <TeamFlag src={flagUrl} alt={teamName} size={38} />
              <div>
                <h4>{title}</h4>
                <p>{teamName}</p>
              </div>
            </div>

            <span>{total} jugadores</span>
          </div>

          {POSITION_ORDER.map((position) => {
            const list = groupedPlayers[position] || [];
            if (!list.length) return null;

            return (
                <div className="scorer-position-row" key={position}>
                  <div className="scorer-position-title">
                    <strong>{position}</strong>
                    <small>{list.length} disponible(s)</small>
                  </div>

                  <div className="jersey-carousel">
                    {list.map((j) => {
                      const active = form.goleadores.includes(Number(j.id_jugador));

                      return (
                          <PlayerJerseyCard
                              key={j.id_jugador}
                              jugador={j}
                              active={active}
                              onClick={() => toggleScorer(j.id_jugador)}
                          />
                      );
                    })}
                  </div>
                </div>
            );
          })}
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
              Selecciona un partido. Al hacerlo se habilitará el formulario para
              registrar tu pronóstico.
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

                return (
                    <button
                        type="button"
                        className={`match-card pro-match-card ${selected ? "selected" : ""}`}
                        key={p.id_partido}
                        onClick={() => selectMatch(p)}
                    >
                      <div className="match-main-row">
                        <div className="team-compact">
                          <TeamFlag
                              src={p.bandera_local || p.bandera_url_local}
                              alt={p.equipo_local}
                              size={34}
                          />
                          <strong>{getTeamShortName(p.equipo_local || "Por definir")}</strong>
                        </div>

                        <span className="match-vs-pill">VS</span>

                        <div className="team-compact right">
                          <strong>{getTeamShortName(p.equipo_visitante || "Por definir")}</strong>
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
                        <em>{p.estado_partido || "Pendiente"}</em>
                      </div>
                    </button>
                );
              })}
            </div>
          </section>

          {partidoSeleccionado && (
              <section className="panel prediction-panel">
                <div className="panel-title">
                  <h3>Mi predicción</h3>
                </div>

                <form className="form prediction-form" onSubmit={submit}>
                  <div className="prediction-hero">
                    <div className="prediction-team">
                      <TeamFlag
                          src={
                              partidoSeleccionado.bandera_local ||
                              partidoSeleccionado.bandera_url_local
                          }
                          alt={partidoSeleccionado.equipo_local}
                          size={56}
                      />
                      <div>
                        <strong>{partidoSeleccionado.equipo_local || "Por definir"}</strong>
                        <small>Local</small>
                      </div>
                    </div>

                    <div className="prediction-center">
                      <span className="prediction-vs">VS</span>
                      <small>{formatMatchDate(partidoSeleccionado.fecha_hora)}</small>
                      <small>{partidoSeleccionado.grupo_nombre || "Sin grupo"}</small>
                    </div>

                    <div className="prediction-team right">
                      <div>
                        <strong>
                          {partidoSeleccionado.equipo_visitante || "Por definir"}
                        </strong>
                        <small>Visitante</small>
                      </div>

                      <TeamFlag
                          src={
                              partidoSeleccionado.bandera_visitante ||
                              partidoSeleccionado.bandera_url_visitante
                          }
                          alt={partidoSeleccionado.equipo_visitante}
                          size={56}
                      />
                    </div>
                  </div>

                  <div className="prediction-form-grid">
                    <div>
                      <label>Grupo de polla</label>
                      <select
                          value={form.id_grupo}
                          onChange={(e) =>
                              setForm({ ...form, id_grupo: e.target.value })
                          }
                      >
                        <option value="">Seleccione</option>
                        {grupos.map((g) => (
                            <option key={g.id_grupo} value={g.id_grupo}>
                              {g.nombre}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Resultado predicho</label>
                      <select
                          value={form.equipo_ganador_predicho}
                          onChange={(e) =>
                              setForm({
                                ...form,
                                equipo_ganador_predicho: e.target.value
                              })
                          }
                      >
                        <option value="">Seleccione</option>
                        <option value={partidoSeleccionado.id_equipo_local}>
                          Gana {partidoSeleccionado.equipo_local}
                        </option>
                        <option value="EMPATE">Empate</option>
                        <option value={partidoSeleccionado.id_equipo_visitante}>
                          Gana {partidoSeleccionado.equipo_visitante}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="prediction-score-grid">
                    <div className="score-input-card">
                      <label>Goles local</label>
                      <input
                          type="number"
                          min="0"
                          value={form.goles_local_predicho}
                          onChange={(e) =>
                              setForm({
                                ...form,
                                goles_local_predicho: e.target.value
                              })
                          }
                      />
                    </div>

                    <div className="score-input-card">
                      <label>Goles visitante</label>
                      <input
                          type="number"
                          min="0"
                          value={form.goles_visitante_predicho}
                          onChange={(e) =>
                              setForm({
                                ...form,
                                goles_visitante_predicho: e.target.value
                              })
                          }
                      />
                    </div>
                  </div>

                  <div className="scorers-section">
                    <div className="section-headline">
                      <h4>Goleadores</h4>
                      <p>
                        Elige los posibles anotadores. Usa el carrusel por posición.
                      </p>
                    </div>

                    {jugadoresPartido.length === 0 ? (
                        <div className="empty-player-state">
                          <Goal size={30} />
                          <p>No hay jugadores cargados para este partido.</p>
                        </div>
                    ) : (
                        <div className="players-area">
                          {renderPlayersCarousel(
                              "Plantel local",
                              partidoSeleccionado.equipo_local,
                              partidoSeleccionado.bandera_local ||
                              partidoSeleccionado.bandera_url_local,
                              localByPosition
                          )}

                          {renderPlayersCarousel(
                              "Plantel visitante",
                              partidoSeleccionado.equipo_visitante,
                              partidoSeleccionado.bandera_visitante ||
                              partidoSeleccionado.bandera_url_visitante,
                              visitanteByPosition
                          )}
                        </div>
                    )}
                  </div>

                  <div className="prediction-actions">
                    <button className="btn primary" type="submit">
                      Guardar predicción
                    </button>
                  </div>
                </form>
              </section>
          )}
        </div>
      </div>
  );
}