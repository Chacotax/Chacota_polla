import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

export default function GruposPage() {
  const { user } = useAuth();

  const [grupos, setGrupos] = useState([]);
  const [formCrear, setFormCrear] = useState({
    nombre: "",
    descripcion: "",
    max_participantes: 10,
    monto_apuesta: 0
  });
  const [codigo, setCodigo] = useState("");
  const [cupoEdit, setCupoEdit] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const esAdmin = useMemo(() => {
    return String(user?.rol || "").toUpperCase() === "ADMIN";
  }, [user]);

  const load = async () => {
    if (!user?.id_usuario) return;

    setLoading(true);
    try {
      const data = await api.misGrupos(user.id_usuario);
      setGrupos(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch((err) => {
      setError(err.message);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id_usuario]);

  const crear = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!esAdmin) {
      setError("Solo el administrador puede crear grupos.");
      return;
    }

    try {
      const g = await api.crearGrupo({
        ...formCrear,
        id_administrador: user.id_usuario,
        max_participantes: Number(formCrear.max_participantes),
        monto_apuesta: Number(formCrear.monto_apuesta)
      });

      setMessage(`Grupo creado. Código: ${g.codigo_invitacion}`);
      setFormCrear({
        nombre: "",
        descripcion: "",
        max_participantes: 10,
        monto_apuesta: 0
      });

      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const unirse = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const g = await api.unirseGrupo({
        codigo_invitacion: codigo.trim().toUpperCase(),
        id_usuario: user.id_usuario
      });

      setMessage(`Te uniste al grupo ${g.nombre}.`);
      setCodigo("");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const actualizarCupo = async (g) => {
    setError("");
    setMessage("");

    if (!esAdmin) {
      setError("Solo el administrador puede actualizar cupos.");
      return;
    }

    try {
      await api.actualizarCupo(g.id_grupo, {
        id_administrador: user.id_usuario,
        max_participantes: Number(cupoEdit[g.id_grupo] || g.max_participantes)
      });

      setMessage("Cupo actualizado.");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
      <div>
        <header className="page-header">
          <div>
            <span className="eyebrow">Grupos privados</span>
            <h2>Mis grupos de polla</h2>
            <p>
              {esAdmin
                  ? "Administra grupos privados y controla los cupos de participación."
                  : "Únete a un grupo usando un código de invitación."}
            </p>
          </div>
        </header>

        <Alert type="success">{message}</Alert>
        <Alert type="danger">{error}</Alert>

        <div className="two-columns">
          {esAdmin && (
              <section className="panel">
                <div className="panel-title">
                  <h3>Crear grupo</h3>
                </div>

                <form className="form" onSubmit={crear}>
                  <label>Nombre del grupo</label>
                  <input
                      value={formCrear.nombre}
                      onChange={(e) =>
                          setFormCrear({ ...formCrear, nombre: e.target.value })
                      }
                      placeholder="Polla de la oficina"
                  />

                  <label>Descripción</label>
                  <textarea
                      value={formCrear.descripcion}
                      onChange={(e) =>
                          setFormCrear({ ...formCrear, descripcion: e.target.value })
                      }
                      placeholder="Grupo interno"
                  />

                  <label>Máximo de participantes</label>
                  <input
                      type="number"
                      min="1"
                      value={formCrear.max_participantes}
                      onChange={(e) =>
                          setFormCrear({
                            ...formCrear,
                            max_participantes: e.target.value
                          })
                      }
                  />

                  <label>Monto referencial</label>
                  <input
                      type="number"
                      min="0"
                      value={formCrear.monto_apuesta}
                      onChange={(e) =>
                          setFormCrear({
                            ...formCrear,
                            monto_apuesta: e.target.value
                          })
                      }
                  />

                  <button className="btn primary">Crear grupo</button>
                </form>
              </section>
          )}

          <section className="panel">
            <div className="panel-title">
              <h3>Unirme por código</h3>
            </div>

            <form className="form" onSubmit={unirse}>
              <label>Código de invitación</label>
              <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  placeholder="CHACOTA2026"
              />
              <button className="btn primary">Unirme</button>
            </form>
          </section>
        </div>

        <section className="panel">
          <div className="panel-title">
            <h3>{esAdmin ? "Grupos administrados" : "Grupos donde participo"}</h3>
          </div>

          <div className="cards-grid">
            {grupos.map((g) => {
              const esAdminDelGrupo =
                  esAdmin && Number(g.id_administrador) === Number(user.id_usuario);

              return (
                  <div className="group-card" key={g.id_grupo}>
                    <h4>{g.nombre}</h4>
                    <p>{g.descripcion}</p>

                    {esAdminDelGrupo && (
                        <div className="code-box">{g.codigo_invitacion}</div>
                    )}

                    <div className="group-meta">
                  <span>
                    {g.participantes}/{g.max_participantes} participantes
                  </span>
                      <span>Admin: {g.administrador_usuario}</span>
                    </div>

                    {esAdminDelGrupo && (
                        <div className="inline-form">
                          <input
                              type="number"
                              min={g.participantes}
                              value={cupoEdit[g.id_grupo] ?? g.max_participantes}
                              onChange={(e) =>
                                  setCupoEdit({
                                    ...cupoEdit,
                                    [g.id_grupo]: e.target.value
                                  })
                              }
                          />
                          <button
                              className="btn small"
                              onClick={() => actualizarCupo(g)}
                          >
                            Actualizar cupo
                          </button>
                        </div>
                    )}
                  </div>
              );
            })}

            {grupos.length === 0 && (
                <p className="muted">
                  {esAdmin
                      ? "Todavía no has creado grupos."
                      : "Todavía no perteneces a ningún grupo. Ingresa un código para unirte."}
                </p>
            )}
          </div>
        </section>
      </div>
  );
}