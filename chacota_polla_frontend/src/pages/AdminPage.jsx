import React, { useEffect, useState } from "react";
import {
  KeyRound,
  RefreshCw,
  Save,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import { api } from "../api/services";
import Alert from "../components/Alert";

export default function AdminPage() {
  const [logs, setLogs] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [equipo, setEquipo] = useState({
    nombre: "",
    nombre_corto: "",
    codigo_fifa: "",
    id_grupo_mundial: 1
  });

  const [usuarioReset, setUsuarioReset] = useState(null);
  const [passwordReset, setPasswordReset] = useState("");
  const [passwordResetConfirmar, setPasswordResetConfirmar] = useState("");
  const [reseteandoPassword, setReseteandoPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLogs(await api.syncLogs().catch(() => []));
    setEquipos(await api.equipos().catch(() => []));
    setUsuarios(await api.usuarios().catch(() => []));
  };

  useEffect(() => {
    load();
  }, []);

  const limpiarMensajes = () => {
    setMessage("");
    setError("");
  };

  const sync = async (tipo) => {
    limpiarMensajes();

    try {
      if (tipo === "equipos") await api.syncEquipos();
      if (tipo === "partidos") await api.syncPartidos();
      if (tipo === "jugadores") await api.syncJugadores();

      setMessage(`Sync ${tipo} ejecutado correctamente.`);
      await load();
    } catch (err) {
      setError(err.message || `No se pudo ejecutar sync de ${tipo}.`);
    }
  };

  const abrirModalResetPassword = (usuario) => {
    limpiarMensajes();
    setUsuarioReset(usuario);
    setPasswordReset("");
    setPasswordResetConfirmar("");
  };

  const cerrarModalResetPassword = () => {
    setUsuarioReset(null);
    setPasswordReset("");
    setPasswordResetConfirmar("");
    setReseteandoPassword(false);
  };

  const resetearPassword = async () => {
    limpiarMensajes();

    if (!usuarioReset) return;

    if (!passwordReset || passwordReset.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (passwordReset !== passwordResetConfirmar) {
      setError("La contraseña y la confirmación no coinciden.");
      return;
    }

    try {
      setReseteandoPassword(true);

      await api.resetearPasswordUsuario({
        id_usuario: usuarioReset.id_usuario,
        password_nuevo: passwordReset
      });

      setMessage(
          `Contraseña de ${usuarioReset.usuario} reseteada correctamente.`
      );

      cerrarModalResetPassword();
      await load();
    } catch (err) {
      setError(err.message || "No se pudo resetear la contraseña.");
    } finally {
      setReseteandoPassword(false);
    }
  };

  const crearEquipo = async (e) => {
    e.preventDefault();
    limpiarMensajes();

    try {
      await apiEquiposPost(equipo);

      setMessage("Equipo registrado manualmente.");
      setEquipo({
        nombre: "",
        nombre_corto: "",
        codigo_fifa: "",
        id_grupo_mundial: 1
      });

      await load();
    } catch (err) {
      setError(err.message || "No se pudo registrar el equipo.");
    }
  };

  const apiEquiposPost = async (payload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/equipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        id_grupo_mundial: Number(payload.id_grupo_mundial)
      })
    });

    const data = await res.json();

    if (!data.ok) throw new Error(data.message);

    return data.data;
  };

  const nombreCompleto = (usuario) => {
    const nombre = [usuario?.nombres, usuario?.apellidos]
        .filter(Boolean)
        .join(" ")
        .trim();

    return nombre || usuario?.usuario || "Usuario";
  };

  return (
      <div>
        <header className="page-header">
          <div>
            <span className="eyebrow">Administración</span>
            <h2>Panel de control</h2>
            <p>
              Sincroniza información, carga equipos manuales y administra accesos
              de usuarios.
            </p>
          </div>
        </header>

        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="danger">{error}</Alert>}



        <div className="two-columns">

          <section className="panel">
            <div className="panel-title">
              <h3>Usuarios registrados</h3>
            </div>

            <div className="admin-users-list">
              {usuarios.length === 0 && (
                  <div className="admin-empty">
                    No hay usuarios registrados.
                  </div>
              )}

              {usuarios.map((usuario) => (
                  <div className="admin-user-row" key={usuario.id_usuario}>
                    <div className="admin-user-avatar">
                      <UserRound size={18} />
                    </div>

                    <div className="admin-user-info">
                      <strong>{nombreCompleto(usuario)}</strong>
                      <small>
                        {usuario.usuario} · {usuario.rol || "USER"}
                      </small>
                    </div>

                    <button
                        type="button"
                        className="btn small"
                        onClick={() => abrirModalResetPassword(usuario)}
                    >
                      <KeyRound size={15} />
                      Resetear
                    </button>
                  </div>
              ))}
            </div>
          </section>
        </div>



        {usuarioReset && (
            <div className="modal-backdrop">
              <div className="modal-card admin-password-modal">
                <div className="modal-head">
                  <div>
                    <span className="eyebrow">Administrador</span>
                    <h3>Resetear contraseña</h3>
                  </div>

                  <button
                      type="button"
                      className="icon-button"
                      onClick={cerrarModalResetPassword}
                  >
                    <X size={18} />
                  </button>
                </div>

                <p>
                  Nueva contraseña para{" "}
                  <strong>{nombreCompleto(usuarioReset)}</strong>
                </p>

                <label className="form-label">
                  Nueva contraseña
                  <input
                      type="password"
                      value={passwordReset}
                      onChange={(e) => setPasswordReset(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      autoFocus
                  />
                </label>

                <label className="form-label">
                  Confirmar contraseña
                  <input
                      type="password"
                      value={passwordResetConfirmar}
                      onChange={(e) => setPasswordResetConfirmar(e.target.value)}
                      placeholder="Repite la contraseña"
                  />
                </label>

                <div className="modal-actions">
                  <button
                      type="button"
                      className="btn"
                      onClick={cerrarModalResetPassword}
                  >
                    Cancelar
                  </button>

                  <button
                      type="button"
                      className="btn primary"
                      onClick={resetearPassword}
                      disabled={reseteandoPassword}
                  >
                    <ShieldCheck size={16} />
                    {reseteandoPassword ? "Guardando..." : "Guardar contraseña"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}