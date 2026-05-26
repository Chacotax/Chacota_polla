import React, { useEffect, useState } from "react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

export default function RankingPage() {
  const { user } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [idGrupo, setIdGrupo] = useState("");
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const g = await api.misGrupos(user.id_usuario);
    setGrupos(g);
    if (g[0]) {
      setIdGrupo(g[0].id_grupo);
      setRanking(await api.ranking(g[0].id_grupo));
    }
    setLoading(false);
  };

  useEffect(() => { load().catch(err => setError(err.message)); }, []);

  const changeGroup = async (value) => {
    setIdGrupo(value);
    setRanking(value ? await api.ranking(value) : []);
  };

  if (loading) return <Loading />;

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow">Competencia</span>
          <h2>Ranking por grupo</h2>
          <p>La tabla se calcula con los puntos de predicciones acertadas.</p>
        </div>
      </header>

      <Alert type="danger">{error}</Alert>

      <section className="panel">
        <div className="form compact">
          <label>Grupo</label>
          <select value={idGrupo} onChange={e => changeGroup(e.target.value)}>
            <option value="">Seleccione</option>
            {grupos.map(g => <option key={g.id_grupo} value={g.id_grupo}>{g.nombre}</option>)}
          </select>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Usuario</th>
                <th>Nombres</th>
                <th>Predicciones</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map(r => (
                <tr key={r.id_usuario}>
                  <td><strong>{r.posicion}</strong></td>
                  <td>{r.usuario}</td>
                  <td>{r.nombres} {r.apellidos}</td>
                  <td>{r.predicciones}</td>
                  <td><strong>{r.puntos}</strong></td>
                </tr>
              ))}
              {ranking.length === 0 && (
                <tr><td colSpan="5">Sin ranking todavía.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
