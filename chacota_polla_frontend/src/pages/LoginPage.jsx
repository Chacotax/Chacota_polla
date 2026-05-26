import React, { useState } from "react";
import { Trophy } from "lucide-react";
import { api } from "../api/services";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    usuario: "admin",
    password: "Admin123*",
    nombres: "",
    apellidos: "",
    email: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const doLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form.usuario, form.password);
    } catch (err) {
      setError(err.message);
    }
  };

  const doRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await api.registrarUsuario({
        usuario: form.usuario,
        password: form.password,
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        rol: "PARTICIPANTE"
      });
      setMessage("Usuario creado. Ahora puedes iniciar sesión.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <section className="login-hero">
        <div className="hero-badge">
          <Trophy size={32} />
        </div>
        <h1>Chacota Polla Mundialista</h1>
        <p>
          Crea grupos, comparte códigos, registra predicciones y pelea el ranking como debe ser:
          con puntos claros y sin Excel clandestino.
        </p>
      </section>

      <section className="login-card">
        <div className="tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>Ingresar</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>Registrarme</button>
        </div>

        <Alert type="danger">{error}</Alert>
        <Alert type="success">{message}</Alert>

        {mode === "login" ? (
          <form onSubmit={doLogin} className="form">
            <label>Usuario</label>
            <input name="usuario" value={form.usuario} onChange={update} placeholder="admin" />

            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={update} placeholder="Admin123*" />

            <button className="btn primary">Ingresar</button>

          </form>
        ) : (
          <form onSubmit={doRegister} className="form">
            <label>Usuario</label>
            <input name="usuario" value={form.usuario} onChange={update} placeholder="jmeneses" />

            <label>Nombres</label>
            <input name="nombres" value={form.nombres} onChange={update} placeholder="Juan" />

            <label>Apellidos</label>
            <input name="apellidos" value={form.apellidos} onChange={update} placeholder="Meneses" />

            <label>Email opcional</label>
            <input name="email" value={form.email} onChange={update} placeholder="correo opcional" />

            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={update} placeholder="********" />

            <button className="btn primary">Crear usuario</button>
          </form>
        )}
      </section>
    </div>
  );
}
