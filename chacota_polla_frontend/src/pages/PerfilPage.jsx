import React, { useState } from "react";
import {
    KeyRound,
    Save,
    ShieldCheck,
    UserRound
} from "lucide-react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function PerfilPage() {
    const { user } = useAuth();

    const [usuario, setUsuario] = useState(user?.usuario || "");
    const [passwordActual, setPasswordActual] = useState("");
    const [passwordNuevo, setPasswordNuevo] = useState("");
    const [passwordConfirmar, setPasswordConfirmar] = useState("");

    const [loadingPerfil, setLoadingPerfil] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const limpiarMensajes = () => {
        setMessage("");
        setError("");
    };

    const guardarPerfil = async (e) => {
        e.preventDefault();
        limpiarMensajes();

        if (!usuario.trim()) {
            setError("Ingresa un nombre de usuario.");
            return;
        }

        try {
            setLoadingPerfil(true);

            await api.actualizarPerfil({
                id_usuario: user.id_usuario,
                usuario: usuario.trim()
            });

            setMessage("Usuario actualizado correctamente. Cierra sesión y vuelve a ingresar para ver el cambio reflejado.");
        } catch (err) {
            setError(err.message || "No se pudo actualizar el usuario.");
        } finally {
            setLoadingPerfil(false);
        }
    };

    const cambiarPassword = async (e) => {
        e.preventDefault();
        limpiarMensajes();

        if (!passwordActual || !passwordNuevo || !passwordConfirmar) {
            setError("Completa todos los campos de contraseña.");
            return;
        }

        if (passwordNuevo.length < 6) {
            setError("La nueva contraseña debe tener mínimo 6 caracteres.");
            return;
        }

        if (passwordNuevo !== passwordConfirmar) {
            setError("La nueva contraseña y la confirmación no coinciden.");
            return;
        }

        try {
            setLoadingPassword(true);

            await api.cambiarPassword({
                id_usuario: user.id_usuario,
                password_actual: passwordActual,
                password_nuevo: passwordNuevo
            });

            setPasswordActual("");
            setPasswordNuevo("");
            setPasswordConfirmar("");

            setMessage("Contraseña actualizada correctamente.");
        } catch (err) {
            setError(err.message || "No se pudo cambiar la contraseña.");
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <div className="profile-page">
            <header className="page-header">
                <div>
                    <span className="eyebrow">Mi cuenta</span>
                    <h2>Mi perfil</h2>
                    <p>
                        Actualiza tu nombre de usuario y cambia tu contraseña de acceso.
                    </p>
                </div>
            </header>

            {message && <Alert type="success" message={message} />}
            {error && <Alert type="error" message={error} />}

            <section className="profile-grid">
                <form className="profile-card" onSubmit={guardarPerfil}>
                    <div className="profile-card-head">
                        <div className="profile-icon">
                            <UserRound size={24} />
                        </div>

                        <div>
                            <h3>Datos de usuario</h3>
                            <p>Cambia tu nombre de usuario para iniciar sesión.</p>
                        </div>
                    </div>

                    <label className="form-label">
                        Usuario actual
                        <input
                            type="text"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            placeholder="Nombre de usuario"
                        />
                    </label>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loadingPerfil}
                    >
                        <Save size={18} />
                        {loadingPerfil ? "Guardando..." : "Guardar usuario"}
                    </button>
                </form>

                <form className="profile-card" onSubmit={cambiarPassword}>
                    <div className="profile-card-head">
                        <div className="profile-icon">
                            <KeyRound size={24} />
                        </div>

                        <div>
                            <h3>Cambiar contraseña</h3>
                            <p>Ingresa tu contraseña actual y define una nueva.</p>
                        </div>
                    </div>

                    <label className="form-label">
                        Contraseña actual
                        <input
                            type="password"
                            value={passwordActual}
                            onChange={(e) => setPasswordActual(e.target.value)}
                            placeholder="Contraseña actual"
                        />
                    </label>

                    <label className="form-label">
                        Nueva contraseña
                        <input
                            type="password"
                            value={passwordNuevo}
                            onChange={(e) => setPasswordNuevo(e.target.value)}
                            placeholder="Nueva contraseña"
                        />
                    </label>

                    <label className="form-label">
                        Confirmar nueva contraseña
                        <input
                            type="password"
                            value={passwordConfirmar}
                            onChange={(e) => setPasswordConfirmar(e.target.value)}
                            placeholder="Repite la nueva contraseña"
                        />
                    </label>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loadingPassword}
                    >
                        <ShieldCheck size={18} />
                        {loadingPassword ? "Actualizando..." : "Cambiar contraseña"}
                    </button>
                </form>
            </section>
        </div>
    );
}