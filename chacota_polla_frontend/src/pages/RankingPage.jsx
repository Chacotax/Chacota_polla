import React, { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Medal,
  RefreshCw,
  Shield,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users
} from "lucide-react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

function getDisplayName(row) {
  return (
      [row.nombres, row.apellidos].filter(Boolean).join(" ") ||
      row.usuario ||
      "Usuario"
  );
}

function getInitials(row) {
  const name = getDisplayName(row);

  return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join("")
      .toUpperCase();
}

function getMedalIcon(position) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return `#${position}`;
}

function getPodiumClass(position) {
  if (position === 1) return "ranking-podium-card first";
  if (position === 2) return "ranking-podium-card second";
  if (position === 3) return "ranking-podium-card third";
  return "ranking-podium-card";
}

export default function RankingPage() {
  const { user } = useAuth();

  const [grupos, setGrupos] = useState([]);
  const [rankingEmpresa, setRankingEmpresa] = useState([]);
  const [rankingGrupos, setRankingGrupos] = useState([]);
  const [ranking, setRanking] = useState([]);

  const [idGrupo, setIdGrupo] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async (grupoId) => {
    if (!grupoId) {
      setRanking([]);
      return;
    }

    setLoadingRanking(true);
    setError("");

    try {
      const data = await api.ranking(grupoId);
      setRanking(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudo cargar el ranking del grupo.");
      setRanking([]);
    } finally {
      setLoadingRanking(false);
    }
  };

  const cargarInicial = async () => {
    setLoading(true);
    setError("");

    try {
      const [misGrupos, generalGrupos, generalEmpresa] = await Promise.all([
        api.misGrupos(user.id_usuario),
        api.rankingGeneralGrupos(),
        api.rankingGeneralEmpresa()
      ]);

      const gruposData = Array.isArray(misGrupos) ? misGrupos : [];
      const rankingGruposData = Array.isArray(generalGrupos)
          ? generalGrupos
          : [];
      const rankingEmpresaData = Array.isArray(generalEmpresa)
          ? generalEmpresa
          : [];

      setGrupos(gruposData);
      setRankingGrupos(rankingGruposData);
      setRankingEmpresa(rankingEmpresaData);

      const grupoInicial =
          gruposData[0]?.id_grupo || rankingGruposData[0]?.id_grupo || "";

      if (grupoInicial) {
        setIdGrupo(String(grupoInicial));
        await cargarRanking(grupoInicial);
      }
    } catch (err) {
      setError(err.message || "No se pudo cargar el ranking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInicial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grupoSeleccionado = useMemo(() => {
    return (
        grupos.find((g) => Number(g.id_grupo) === Number(idGrupo)) ||
        rankingGrupos.find((g) => Number(g.id_grupo) === Number(idGrupo))
    );
  }, [grupos, rankingGrupos, idGrupo]);

  const topTres = useMemo(() => {
    const ordenado = [...ranking].sort(
        (a, b) => Number(a.posicion || 0) - Number(b.posicion || 0)
    );

    const primero = ordenado.find((x) => Number(x.posicion) === 1);
    const segundo = ordenado.find((x) => Number(x.posicion) === 2);
    const tercero = ordenado.find((x) => Number(x.posicion) === 3);

    return [segundo, primero, tercero].filter(Boolean);
  }, [ranking]);

  const miRanking = useMemo(() => {
    if (!user?.id_usuario) return null;

    return ranking.find(
        (x) => Number(x.id_usuario) === Number(user.id_usuario)
    );
  }, [ranking, user]);

  const totalJugadores = ranking.length;

  const totalPredicciones = useMemo(() => {
    return ranking.reduce(
        (acc, item) => acc + Number(item.predicciones || 0),
        0
    );
  }, [ranking]);

  const mejorPuntaje = useMemo(() => {
    if (ranking.length === 0) return 0;

    return Math.max(...ranking.map((x) => Number(x.puntos || 0)));
  }, [ranking]);

  const promedioPuntos = useMemo(() => {
    if (ranking.length === 0) return "0.0";

    const total = ranking.reduce(
        (acc, item) => acc + Number(item.puntos || 0),
        0
    );

    return (total / ranking.length).toFixed(1);
  }, [ranking]);

  const handleGrupoChange = async (value) => {
    setIdGrupo(String(value));
    await cargarRanking(value);
  };

  const actualizarTodo = async () => {
    setLoadingRanking(true);
    setError("");

    try {
      const [generalGrupos, generalEmpresa] = await Promise.all([
        api.rankingGeneralGrupos(),
        api.rankingGeneralEmpresa(),
        idGrupo ? cargarRanking(idGrupo) : Promise.resolve()
      ]);

      setRankingGrupos(Array.isArray(generalGrupos) ? generalGrupos : []);
      setRankingEmpresa(Array.isArray(generalEmpresa) ? generalEmpresa : []);
    } catch (err) {
      setError(err.message || "No se pudo actualizar el ranking.");
    } finally {
      setLoadingRanking(false);
    }
  };

  if (loading) return <Loading />;

  return (
      <div className="ranking-page">
        <header className="ranking-header">
          <div>
            <span className="eyebrow">Competencia</span>
            <h2>Ranking</h2>
            <p>
              Revisa el ranking general de la empresa, compara grupos y consulta
              el detalle del grupo seleccionado.
            </p>
          </div>

          <button
              type="button"
              className="ranking-refresh-btn"
              onClick={actualizarTodo}
              disabled={loadingRanking}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </header>

        <Alert type="danger">{error}</Alert>



        <section className="ranking-company-section">
          <div className="ranking-section-title">
            <Trophy size={18} />
            <span>Ranking general de la empresa</span>
            <small>{rankingEmpresa.length} jugadores</small>
          </div>

          <div className="ranking-list company-ranking-list">
            {rankingEmpresa.map((item) => {
              const isMe =
                  Number(item.id_usuario) === Number(user?.id_usuario);

              return (
                  <article
                      key={item.id_usuario}
                      className={`ranking-list-row ${isMe ? "me" : ""}`}
                  >
                    <div className="ranking-position">
                      {Number(item.posicion) <= 3 ? (
                          <span>{getMedalIcon(Number(item.posicion))}</span>
                      ) : (
                          <strong>#{item.posicion}</strong>
                      )}
                    </div>

                    <div className="ranking-user-avatar">{getInitials(item)}</div>

                    <div className="ranking-user-info">
                      <strong>
                        {getDisplayName(item)}
                        {isMe && <em>Tú</em>}
                      </strong>
                      <span>@{item.usuario}</span>
                    </div>

                    <div className="ranking-predictions-count">
                      <Users size={16} />
                      <span>{Number(item.grupos_participa || 0)} grupos</span>
                    </div>

                    <div className="ranking-predictions-count">
                      <UserRound size={16} />
                      <span>{Number(item.predicciones || 0)} pred.</span>
                    </div>

                    <div className="ranking-row-points">
                      <strong>{Number(item.puntos || 0)}</strong>
                      <span>pts</span>
                    </div>
                  </article>
              );
            })}

            {rankingEmpresa.length === 0 && (
                <div className="ranking-empty-inline">
                  Todavía no hay puntajes generales en la empresa.
                </div>
            )}
          </div>
        </section>

        <section className="ranking-groups-section">
          <div className="ranking-section-title">
            <Medal size={18} />
            <span>Ranking general de grupos</span>
            <small>{rankingGrupos.length} grupos</small>
          </div>

          <div className="ranking-groups-list">
            {rankingGrupos.map((grupo) => (
                <article
                    key={grupo.id_grupo}
                    className={`ranking-group-row ${
                        Number(grupo.id_grupo) === Number(idGrupo) ? "active" : ""
                    }`}
                >
                  <div className="ranking-group-position">
                    {Number(grupo.posicion) <= 3 ? (
                        <span>{getMedalIcon(Number(grupo.posicion))}</span>
                    ) : (
                        <strong>#{grupo.posicion}</strong>
                    )}
                  </div>

                  <div className="ranking-group-info">
                    <strong>{grupo.grupo}</strong>
                    <span>{Number(grupo.cantidad_jugadores || 0)} jugadores</span>
                  </div>

                  <div className="ranking-group-metric">
                    <small>Total puntos</small>
                    <strong>{Number(grupo.total_puntos || 0)}</strong>
                  </div>

                  <div className="ranking-group-metric">
                    <small>Promedio</small>
                    <strong>
                      {Number(grupo.promedio_puntos || 0).toFixed(2)}
                    </strong>
                  </div>

                  <button
                      type="button"
                      className="ranking-group-view-btn"
                      onClick={() => handleGrupoChange(grupo.id_grupo)}
                  >
                    Ver grupo
                  </button>
                </article>
            ))}

            {rankingGrupos.length === 0 && (
                <div className="ranking-empty-inline">
                  No hay grupos creados todavía.
                </div>
            )}
          </div>
        </section>

        {ranking.length === 0 ? (
            <section className="ranking-empty-card">
              <Trophy size={42} />
              <h3>No hay ranking disponible</h3>
              <p>
                Cuando se calculen puntajes, aparecerá el podio del grupo
                seleccionado.
              </p>
            </section>
        ) : (
            <>
              <section className="ranking-podium-section">
                <div className="ranking-section-title centered">
                  <Trophy size={18} />
                  <span>Top 3 del grupo</span>
                </div>

                <div className="ranking-podium-grid">
                  {topTres.map((item) => (
                      <article
                          key={item.id_usuario}
                          className={getPodiumClass(Number(item.posicion))}
                      >
                        <div className="podium-medal">
                          <span>{getMedalIcon(Number(item.posicion))}</span>
                        </div>

                        <div className="podium-avatar">{getInitials(item)}</div>

                        <strong>{getDisplayName(item)}</strong>
                        <small>@{item.usuario}</small>

                        <div className="podium-points">
                          {Number(item.puntos || 0)}
                          <span>puntos</span>
                        </div>
                      </article>
                  ))}
                </div>
              </section>



              {miRanking && (
                  <section className="my-ranking-card">
                    <div>
                      <span>Tu desempeño</span>
                      <strong>#{miRanking.posicion}</strong>
                      <small>Posición actual</small>
                    </div>

                    <div>
                      <span>Puntos</span>
                      <strong>{Number(miRanking.puntos || 0)}</strong>
                      <small>Total acumulado</small>
                    </div>

                    <div>
                      <span>Predicciones</span>
                      <strong>{Number(miRanking.predicciones || 0)}</strong>
                      <small>Registradas</small>
                    </div>
                  </section>
              )}

              <section className="ranking-list-section">
                <div className="ranking-section-title">
                  <Sparkles size={18} />
                  <span>Ranking completo del grupo</span>
                  <small>{ranking.length} jugadores</small>
                </div>

                <div className="ranking-list">
                  {ranking.map((item) => {
                    const isMe =
                        Number(item.id_usuario) === Number(user?.id_usuario);

                    return (
                        <article
                            key={item.id_usuario}
                            className={`ranking-list-row ${isMe ? "me" : ""}`}
                        >
                          <div className="ranking-position">
                            {Number(item.posicion) <= 3 ? (
                                <span>{getMedalIcon(Number(item.posicion))}</span>
                            ) : (
                                <strong>#{item.posicion}</strong>
                            )}
                          </div>

                          <div className="ranking-user-avatar">
                            {getInitials(item)}
                          </div>

                          <div className="ranking-user-info">
                            <strong>
                              {getDisplayName(item)}
                              {isMe && <em>Tú</em>}
                            </strong>
                            <span>@{item.usuario}</span>
                          </div>

                          <div className="ranking-predictions-count">
                            <UserRound size={16} />
                            <span>{Number(item.predicciones || 0)} pred.</span>
                          </div>

                          <div className="ranking-row-points">
                            <strong>{Number(item.puntos || 0)}</strong>
                            <span>pts</span>
                          </div>
                        </article>
                    );
                  })}
                </div>
              </section>
            </>
        )}
      </div>
  );
}