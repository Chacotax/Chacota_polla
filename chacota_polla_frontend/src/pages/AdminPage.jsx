import React, { useEffect, useMemo, useState } from "react";
import {
  KeyRound,
  Search,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import { api } from "../api/services";
import Alert from "../components/Alert";

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([]);

  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [usuarioReset, setUsuarioReset] = useState(null);
  const [passwordReset, setPasswordReset] = useState("");
  const [passwordResetConfirmar, setPasswordResetConfirmar] = useState("");
  const [reseteandoPassword, setReseteandoPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setUsuarios(await api.usuarios().catch(() => []));
  };

  useEffect(() => {
    load();
  }, []);

  const limpiarMensajes = () => {
    setMessage("");
    setError("");
  };

  const usuariosFiltrados = useMemo(() => {
    const term = busquedaUsuario.trim().toLowerCase();

    if (!term) return usuarios.slice(0, 15);

    return usuarios
        .filter((u) => {
          const texto = [
            u.usuario,
            u.nombres,
            u.apellidos,
            u.email,
            u.rol,
            u.dni
          ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return texto.includes(term);
        })
        .slice(0, 30);
  }, [usuarios, busquedaUsuario]);

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
            <p>Administra usuarios y resetea contraseñas cuando sea necesario.</p>
          </div>
        </header>

        {message && <Alert type="success">{message}</Alert>}
        {error && <Alert type="danger">{error}</Alert>}

        <section className="panel">
          <div className="panel-title">
            <h3>Usuarios registrados</h3>
          </div>

          <div className="admin-search-box">
            <Search size={18} />
            <input
                type="text"
                value={busquedaUsuario}
                onChange={(e) => setBusquedaUsuario(e.target.value)}
                placeholder="Buscar por usuario, nombre, apellido, DNI o rol..."
            />
          </div>

          <div className="admin-users-summary">
          <span>
            Mostrando <strong>{usuariosFiltrados.length}</strong> de{" "}
            <strong>{usuarios.length}</strong> usuarios
          </span>

            {!busquedaUsuario && usuarios.length > 15 && (
                <small>Escribe en el buscador para encontrar más usuarios.</small>
            )}
          </div>

          <div className="admin-users-list compact">
            {usuariosFiltrados.length === 0 && (
                <div className="admin-empty">No se encontraron usuarios.</div>
            )}

            {usuariosFiltrados.map((usuario) => (
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