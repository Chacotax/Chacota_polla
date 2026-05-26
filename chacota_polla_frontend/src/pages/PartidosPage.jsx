import React, { useEffect, useState } from "react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

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
    const [p, g, j] = await Promise.all([
      api.partidos(),
      api.misGrupos(user.id_usuario),
      api.jugadores()
    ]);
    setPartidos(p);
    setGrupos(g);
    setJugadores(j);
    setLoading(false);
  };

  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  const selectMatch = (p) => {
    setForm({
      ...form,
      id_partido: p.id_partido,
      equipo_ganador_predicho: p.id_equipo_local || "",
      goles_local_predicho: 0,
      goles_visitante_predicho: 0,
      goleadores: []
    });
    setMessage("");
    setError("");
  };

  const toggleScorer = (id) => {
    const exists = form.goleadores.includes(id);
    setForm({
      ...form,
      goleadores: exists ? form.goleadores.filter(x => x !== id) : [...form.goleadores, id]
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await api.guardarPrediccion({
        ...form,
        id_usuario: user.id_usuario,
        id_grupo: Number(form.id_grupo),
        id_partido: Number(form.id_partido),
        equipo_ganador_predicho: Number(form.equipo_ganador_predicho),
        goles_local_predicho: Number(form.goles_local_predicho),
        goles_visitante_predicho: Number(form.goles_visitante_predicho),
        goleadores: form.goleadores
      });
      setMessage("Predicción guardada correctamente.");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  const partidoSeleccionado = partidos.find(p => Number(p.id_partido) === Number(form.id_partido));
  const jugadoresPartido = partidoSeleccionado
    ? jugadores.filter(j => [partidoSeleccionado.id_equipo_local, partidoSeleccionado.id_equipo_visitante].includes(j.id_equipo))
    : [];

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow">Fixture y predicciones</span>
          <h2>Partidos</h2>
          <p>Selecciona un partido y registra tu pronóstico.</p>
        </div>
      </header>

      <Alert type="success">{message}</Alert>
      <Alert type="danger">{error}</Alert>

      <div className="two-columns">
        <section className="panel">
          <div className="panel-title"><h3>Fixture</h3></div>
          <div className="match-list">
            {partidos.map(p => (
              <button className={`match-card clickable ${Number(form.id_partido) === p.id_partido ? "selected" : ""}`} key={p.id_partido} onClick={() => selectMatch(p)}>
                <div>
                  <strong>{p.equipo_local || "Por definir"}</strong>
                  <span>vs</span>
                  <strong>{p.equipo_visitante || "Por definir"}</strong>
                </div>
                <small>{p.fase} · {p.grupo_nombre || ""} · {p.fecha_hora || "Sin fecha"}</small>
                <em>{p.estado_partido}</em>
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><h3>Mi predicción</h3></div>
          {!partidoSeleccionado ? (
            <p className="muted">Selecciona un partido para apostar.</p>
          ) : (
            <form className="form" onSubmit={submit}>
              <label>Grupo de polla</label>
              <select value={form.id_grupo} onChange={e => setForm({ ...form, id_grupo: e.target.value })}>
                <option value="">Seleccione</option>
                {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
              </select>

              <label>Ganador</label>
              <select value={form.equipo_ganador_predicho} onChange={e => setForm({ ...form, equipo_ganador_predicho: e.target.value })}>
                <option value={partidoSeleccionado.id_equipo_local}>{partidoSeleccionado.equipo_local}</option>
                <option value={partidoSeleccionado.id_equipo_visitante}>{partidoSeleccionado.equipo_visitante}</option>
              </select>

              <div className="score-grid">
                <div>
                  <label>Goles local</label>
                  <input type="number" min="0" value={form.goles_local_predicho} onChange={e => setForm({ ...form, goles_local_predicho: e.target.value })} />
                </div>
                <div>
                  <label>Goles visitante</label>
                  <input type="number" min="0" value={form.goles_visitante_predicho} onChange={e => setForm({ ...form, goles_visitante_predicho: e.target.value })} />
                </div>
              </div>

              <label>Goleadores</label>
              <div className="chip-list">
                {jugadoresPartido.map(j => (
                  <button type="button" key={j.id_jugador} className={`chip ${form.goleadores.includes(j.id_jugador) ? "active" : ""}`} onClick={() => toggleScorer(j.id_jugador)}>
                    {j.nombre_popular || `${j.nombre} ${j.apellido || ""}`}
                  </button>
                ))}
                {jugadoresPartido.length === 0 && <small>No hay jugadores cargados para este partido.</small>}
              </div>

              <button className="btn primary">Guardar predicción</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
