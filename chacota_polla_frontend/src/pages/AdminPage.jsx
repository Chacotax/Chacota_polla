import React, { useEffect, useState } from "react";
import { api } from "../api/services";
import Alert from "../components/Alert";

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [equipo, setEquipo] = useState({ nombre: "", nombre_corto: "", codigo_fifa: "", id_grupo_mundial: 1 });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLogs(await api.syncLogs().catch(() => []));
    setEquipos(await api.equipos().catch(() => []));
  };

  useEffect(() => { load(); }, []);

  const sync = async (tipo) => {
    setError(""); setMessage("");
    try {
      if (tipo === "equipos") await api.syncEquipos();
      if (tipo === "partidos") await api.syncPartidos();
      if (tipo === "jugadores") await api.syncJugadores();
      setMessage(`Sync ${tipo} ejecutado. Por ahora queda como placeholder hasta configurar API key.`);
      await load();
    } catch (err) { setError(err.message); }
  };

  const crearEquipo = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await apiEquiposPost(equipo);
      setMessage("Equipo registrado manualmente.");
      setEquipo({ nombre: "", nombre_corto: "", codigo_fifa: "", id_grupo_mundial: 1 });
      await load();
    } catch (err) { setError(err.message); }
  };

  const apiEquiposPost = async (payload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/equipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, id_grupo_mundial: Number(payload.id_grupo_mundial) })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message);
    return data.data;
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow">Administración</span>
          <h2>Panel de control</h2>
          <p>Sincroniza información desde API externa o carga datos manuales.</p>
        </div>
      </header>

      <Alert type="success">{message}</Alert>
      <Alert type="danger">{error}</Alert>

      <section className="panel">
        <div className="panel-title"><h3>Sincronización API</h3></div>
        <div className="action-row">
          <button className="btn primary" onClick={() => sync("equipos")}>Sync equipos</button>
          <button className="btn primary" onClick={() => sync("partidos")}>Sync partidos</button>
          <button className="btn primary" onClick={() => sync("jugadores")}>Sync jugadores</button>
        </div>
        <p className="muted">
          Para sincronización real se debe configurar la API key en Cloudflare Workers como variable secreta:
          API_FOOTBALL_KEY.
        </p>
      </section>

      <div className="two-columns">
        <section className="panel">
          <div className="panel-title"><h3>Registrar equipo manual</h3></div>
          <form className="form" onSubmit={crearEquipo}>
            <label>Nombre</label>
            <input value={equipo.nombre} onChange={e => setEquipo({ ...equipo, nombre: e.target.value })} />
            <label>Nombre corto</label>
            <input value={equipo.nombre_corto} onChange={e => setEquipo({ ...equipo, nombre_corto: e.target.value })} />
            <label>Código FIFA</label>
            <input value={equipo.codigo_fifa} onChange={e => setEquipo({ ...equipo, codigo_fifa: e.target.value })} />
            <label>Grupo mundial</label>
            <select value={equipo.id_grupo_mundial} onChange={e => setEquipo({ ...equipo, id_grupo_mundial: e.target.value })}>
              {Array.from({ length: 12 }).map((_, i) => <option key={i + 1} value={i + 1}>Grupo {String.fromCharCode(65 + i)}</option>)}
            </select>
            <button className="btn primary">Guardar equipo</button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-title"><h3>Equipos cargados</h3></div>
          <div className="simple-list">
            {equipos.map(e => <div key={e.id_equipo}><strong>{e.nombre}</strong><small>{e.grupo_nombre || "Sin grupo"}</small></div>)}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-title"><h3>Logs de sincronización</h3></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Estado</th><th>Mensaje</th></tr></thead>
            <tbody>
              {logs.map(l => <tr key={l.id_sync}><td>{l.fecha_inicio}</td><td>{l.tipo_sync}</td><td>{l.estado}</td><td>{l.mensaje}</td></tr>)}
              {logs.length === 0 && <tr><td colSpan="4">Sin logs.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
