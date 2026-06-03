import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Flag,
  Goal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Trophy
} from "lucide-react";
import { api } from "../api/services";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

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

function getPlayerName(jugador) {
  return (
      jugador?.nombre_popular ||
      [jugador?.nombre, jugador?.apellido].filter(Boolean).join(" ") ||
      "Jugador"
  );
}

function TeamFlag({ src, alt }) {
  if (!src) {
    return (
        <div className="admin-team-flag placeholder">
          <Flag size={16} />
        </div>
    );
  }

  return <img className="admin-team-flag" src={src} alt={alt || "Bandera"} />;
}

function getEstadoResultado(partido) {
  const estado = String(partido?.estado_partido || "").toUpperCase();

  if (estado === "FINALIZADO") return "Finalizado";
  if (estado === "IN_PLAY" || estado === "EN_JUEGO") return "En juego";

  if (
      estado === "PENDIENTE" ||
      estado === "NOT STARTED" ||
      estado === "NOT_STARTED"
  ) {
    return "Pendiente";
  }

  return partido?.estado_partido || "Pendiente";
}

function crearTempId(prefix = "goleador") {
  return `${prefix}-${Date.now()}-${Math.random()}`;
}

export default function AdminResultadosPage() {
  const [partidos, setPartidos] = useState([]);
  const [jugadores, setJugadores] = useState([]);
  const [idPartido, setIdPartido] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    goles_local: 0,
    goles_visitante: 0,
    goleadores: []
  });

  const partidoSeleccionado = useMemo(() => {
    return partidos.find((p) => Number(p.id_partido) === Number(idPartido));
  }, [partidos, idPartido]);

  const jugadoresPartido = useMemo(() => {
    if (!partidoSeleccionado) return [];

    const local = Number(partidoSeleccionado.id_equipo_local);
    const visitante = Number(partidoSeleccionado.id_equipo_visitante);

    return jugadores.filter((j) =>
        [local, visitante].includes(Number(j.id_equipo))
    );
  }, [jugadores, partidoSeleccionado]);

  const jugadoresFiltrados = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    if (!term) return jugadoresPartido;

    return jugadoresPartido.filter((j) => {
      const nombre = getPlayerName(j).toLowerCase();
      const equipo = String(j.equipo || "").toLowerCase();
      const dorsal = String(j.dorsal || "").toLowerCase();

      return (
          nombre.includes(term) ||
          equipo.includes(term) ||
          dorsal.includes(term)
      );
    });
  }, [jugadoresPartido, busqueda]);

  const resultadoCalculado = useMemo(() => {
    if (!partidoSeleccionado) {
      return {
        ganador_equipo_id: null,
        label: "Selecciona un partido"
      };
    }

    const gl = Number(form.goles_local || 0);
    const gv = Number(form.goles_visitante || 0);

    if (gl > gv) {
      return {
        ganador_equipo_id: Number(partidoSeleccionado.id_equipo_local),
        label: `Gana ${partidoSeleccionado.equipo_local || "local"}`
      };
    }

    if (gv > gl) {
      return {
        ganador_equipo_id: Number(partidoSeleccionado.id_equipo_visitante),
        label: `Gana ${partidoSeleccionado.equipo_visitante || "visitante"}`
      };
    }

    return {
      ganador_equipo_id: null,
      label: "Empate"
    };
  }, [form.goles_local, form.goles_visitante, partidoSeleccionado]);

  const cargarDatos = async () => {
    setLoading(true);
    setError("");

    try {
      const [p, j] = await Promise.all([
        api.partidosAdmin ? api.partidosAdmin() : api.partidos(),
        api.jugadores()
      ]);

      setPartidos(Array.isArray(p) ? p : []);
      setJugadores(Array.isArray(j) ? j : []);
    } catch (err) {
      setError(err.message || "No se pudo cargar información para resultados.");
    } finally {
      setLoading(false);
    }
  };

  const cargarGoleadoresResultado = async (idPartidoResultado) => {
    if (!idPartidoResultado || !api.goleadoresResultado) return [];

    try {
      const data = await api.goleadoresResultado(idPartidoResultado);

      if (!Array.isArray(data)) return [];

      return data.map((g) => ({
        tempId: crearTempId(g.id_partido_goleador || g.id_jugador || "gol"),
        id_partido_goleador: g.id_partido_goleador
            ? Number(g.id_partido_goleador)
            : null,
        id_jugador: g.id_jugador ? Number(g.id_jugador) : null,
        id_equipo: g.id_equipo ? Number(g.id_equipo) : null,
        nombre: g.nombre || "Jugador",
        equipo: g.equipo || "Equipo",
        minuto: g.minuto ?? "",
        tipo_gol: g.tipo_gol || "NORMAL"
      }));
    } catch (err) {
      console.error("Error al cargar goleadores del resultado:", err);
      return [];
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const seleccionarPartido = async (partido) => {
    setIdPartido(partido.id_partido);
    setBusqueda("");
    setMessage("");
    setError("");

    const goleadoresGuardados = await cargarGoleadoresResultado(
        partido.id_partido
    );

    setForm({
      goles_local: partido.goles_local ?? 0,
      goles_visitante: partido.goles_visitante ?? 0,
      goleadores: goleadoresGuardados
    });
  };

  const agregarGoleador = (jugador) => {
    setForm((prev) => ({
      ...prev,
      goleadores: [
        ...prev.goleadores,
        {
          tempId: crearTempId(jugador.id_jugador),
          id_jugador: Number(jugador.id_jugador),
          id_equipo: Number(jugador.id_equipo),
          nombre: getPlayerName(jugador),
          equipo: jugador.equipo || getEquipoJugador(jugador),
          minuto: "",
          tipo_gol: "NORMAL"
        }
      ]
    }));
  };

  const getEquipoJugador = (jugador) => {
    if (!partidoSeleccionado || !jugador) return jugador?.equipo || "Equipo";

    if (
        Number(jugador.id_equipo) ===
        Number(partidoSeleccionado.id_equipo_local)
    ) {
      return partidoSeleccionado.equipo_local || jugador.equipo || "Local";
    }

    if (
        Number(jugador.id_equipo) ===
        Number(partidoSeleccionado.id_equipo_visitante)
    ) {
      return (
          partidoSeleccionado.equipo_visitante || jugador.equipo || "Visitante"
      );
    }

    return jugador.equipo || "Equipo";
  };

  const actualizarGoleador = (tempId, field, value) => {
    setForm((prev) => ({
      ...prev,
      goleadores: prev.goleadores.map((g) =>
          g.tempId === tempId ? { ...g, [field]: value } : g
      )
    }));
  };

  const quitarGoleador = (tempId) => {
    setForm((prev) => ({
      ...prev,
      goleadores: prev.goleadores.filter((g) => g.tempId !== tempId)
    }));
  };

  const guardarResultado = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!partidoSeleccionado) {
      setError("Selecciona un partido.");
      return;
    }

    const golesLocal = Number(form.goles_local);
    const golesVisitante = Number(form.goles_visitante);

    if (
        Number.isNaN(golesLocal) ||
        golesLocal < 0 ||
        Number.isNaN(golesVisitante) ||
        golesVisitante < 0
    ) {
      setError("Los goles deben ser números válidos mayores o iguales a cero.");
      return;
    }

    try {
      setSaving(true);

      await api.registrarResultado({
        id_partido: Number(partidoSeleccionado.id_partido),
        goles_local: golesLocal,
        goles_visitante: golesVisitante,
        ganador_equipo_id: resultadoCalculado.ganador_equipo_id,
        goleadores: form.goleadores.map((g) => ({
          id_jugador: Number(g.id_jugador),
          id_equipo: Number(g.id_equipo),
          minuto: g.minuto === "" ? null : Number(g.minuto),
          tipo_gol: g.tipo_gol || "NORMAL"
        }))
      });

      setMessage("Resultado registrado y puntajes recalculados correctamente.");

      const idPartidoActual = Number(partidoSeleccionado.id_partido);

      await cargarDatos();

      const goleadoresGuardados = await cargarGoleadoresResultado(
          idPartidoActual
      );

      setIdPartido(idPartidoActual);

      setForm((prev) => ({
        ...prev,
        goles_local: golesLocal,
        goles_visitante: golesVisitante,
        goleadores: goleadoresGuardados
      }));
    } catch (err) {
      setError(err.message || "No se pudo registrar el resultado.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
      <div className="admin-results-page">
        <header className="page-header admin-results-header">
          <div>
            <span className="eyebrow">Administración</span>
            <h2>Registrar resultados</h2>
            <p>
              Ingresa el marcador final, selecciona los goleadores y recalcula los
              puntajes de la polla.
            </p>
          </div>

          <button
              type="button"
              className="btn secondary"
              onClick={cargarDatos}
              disabled={saving}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </header>

        <Alert type="success">{message}</Alert>
        <Alert type="danger">{error}</Alert>

        <div className="admin-results-layout">
          <section className="panel admin-match-panel">
            <div className="panel-title">
              <h3>Partidos</h3>
            </div>

            <div className="admin-match-list">
              {partidos.map((p) => {
                const active = Number(idPartido) === Number(p.id_partido);

                return (
                    <button
                        type="button"
                        key={p.id_partido}
                        className={`admin-match-card ${active ? "active" : ""}`}
                        onClick={() => seleccionarPartido(p)}
                    >
                      <div className="admin-match-teams">
                        <div>
                          <TeamFlag
                              src={p.bandera_local || p.bandera_url_local}
                              alt={p.equipo_local}
                          />
                          <strong>{p.equipo_local || "Local"}</strong>
                        </div>

                        <span>
                      {p.goles_local ?? "-"} : {p.goles_visitante ?? "-"}
                    </span>

                        <div className="right">
                          <strong>{p.equipo_visitante || "Visitante"}</strong>
                          <TeamFlag
                              src={p.bandera_visitante || p.bandera_url_visitante}
                              alt={p.equipo_visitante}
                          />
                        </div>
                      </div>

                      <div className="admin-match-meta">
                        <small>
                          <CalendarDays size={13} />
                          {formatMatchDate(p.fecha_hora)}
                        </small>
                        <em>{getEstadoResultado(p)}</em>
                      </div>
                    </button>
                );
              })}
            </div>
          </section>

          <section className="panel admin-result-form-panel">
            <div className="panel-title">
              <h3>Resultado del partido</h3>
            </div>

            {!partidoSeleccionado ? (
                <div className="admin-empty-result">
                  <Trophy size={42} />
                  <h3>Selecciona un partido</h3>
                  <p>Luego podrás registrar marcador y goleadores.</p>
                </div>
            ) : (
                <form className="admin-result-form" onSubmit={guardarResultado}>
                  <div className="admin-result-hero">
                    <div className="admin-result-team">
                      <TeamFlag
                          src={
                              partidoSeleccionado.bandera_local ||
                              partidoSeleccionado.bandera_url_local
                          }
                          alt={partidoSeleccionado.equipo_local}
                      />
                      <strong>{partidoSeleccionado.equipo_local || "Local"}</strong>
                      <small>Local</small>
                    </div>

                    <div className="admin-result-score">
                      <input
                          type="number"
                          min="0"
                          value={form.goles_local}
                          onChange={(e) =>
                              setForm({ ...form, goles_local: e.target.value })
                          }
                      />
                      <span>VS</span>
                      <input
                          type="number"
                          min="0"
                          value={form.goles_visitante}
                          onChange={(e) =>
                              setForm({ ...form, goles_visitante: e.target.value })
                          }
                      />
                    </div>

                    <div className="admin-result-team right">
                      <TeamFlag
                          src={
                              partidoSeleccionado.bandera_visitante ||
                              partidoSeleccionado.bandera_url_visitante
                          }
                          alt={partidoSeleccionado.equipo_visitante}
                      />
                      <strong>
                        {partidoSeleccionado.equipo_visitante || "Visitante"}
                      </strong>
                      <small>Visitante</small>
                    </div>
                  </div>

                  <div className="admin-result-summary">
                    <CheckCircle2 size={20} />
                    <div>
                      <span>Resultado calculado</span>
                      <strong>{resultadoCalculado.label}</strong>
                    </div>
                  </div>

                  <div className="admin-scorers-block">
                    <div className="admin-section-head">
                      <div>
                        <h4>Goleadores</h4>
                        <p>
                          Agrega cada jugador que anotó. Puedes repetir jugador si
                          hizo más de un gol.
                        </p>
                      </div>
                    </div>

                    <div className="admin-player-search">
                      <Search size={17} />
                      <input
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                          placeholder="Buscar jugador por nombre, dorsal o equipo..."
                      />
                    </div>

                    <div className="admin-player-picker">
                      {jugadoresFiltrados.map((j) => (
                          <button
                              type="button"
                              key={j.id_jugador}
                              onClick={() => agregarGoleador(j)}
                          >
                            <Plus size={15} />
                            <span>{getPlayerName(j)}</span>
                            <small>{getEquipoJugador(j)}</small>
                          </button>
                      ))}

                      {jugadoresFiltrados.length === 0 && (
                          <div className="admin-no-players">
                            No hay jugadores para este partido.
                          </div>
                      )}
                    </div>

                    <div className="admin-selected-scorers">
                      {form.goleadores.map((g, index) => (
                          <article key={g.tempId} className="admin-selected-scorer">
                            <div className="admin-selected-scorer-main">
                              <Goal size={18} />
                              <div>
                                <strong>
                                  {index + 1}. {g.nombre}
                                </strong>
                                <small>{g.equipo}</small>
                              </div>
                            </div>

                            <input
                                type="number"
                                min="1"
                                max="130"
                                placeholder="Min."
                                value={g.minuto}
                                onChange={(e) =>
                                    actualizarGoleador(
                                        g.tempId,
                                        "minuto",
                                        e.target.value
                                    )
                                }
                            />

                            <select
                                value={g.tipo_gol}
                                onChange={(e) =>
                                    actualizarGoleador(
                                        g.tempId,
                                        "tipo_gol",
                                        e.target.value
                                    )
                                }
                            >
                              <option value="NORMAL">Normal</option>
                              <option value="PENAL">Penal</option>
                              <option value="AUTOGOL">Autogol</option>
                            </select>

                            <button
                                type="button"
                                className="admin-remove-scorer"
                                onClick={() => quitarGoleador(g.tempId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </article>
                      ))}

                      {form.goleadores.length === 0 && (
                          <div className="admin-no-scorers">
                            Todavía no agregaste goleadores.
                          </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-result-actions">
                    <button type="submit" className="btn primary" disabled={saving}>
                      <Save size={18} />
                      {saving ? "Guardando..." : "Guardar resultado"}
                    </button>
                  </div>
                </form>
            )}
          </section>
        </div>
      </div>
  );
}