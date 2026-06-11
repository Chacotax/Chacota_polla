import React, { useState } from "react";
import {
  Trophy,
  Users,
  Map,
  CalendarDays,
  Shield,
  LogOut,
  Home,
  Settings,
  ClipboardCheck,
  MessageCircle,
  Menu,
  X,
  BookOpen,
  UserRound
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const nav = [
  { key: "dashboard", label: "Inicio", icon: Home },
  { key: "mundial", label: "Mapa Mundial", icon: Map },
  { key: "partidos", label: "Partidos", icon: CalendarDays },
  { key: "grupos", label: "Mis grupos", icon: Users },
  { key: "ranking", label: "Ranking", icon: Trophy },
  { key: "reglas", label: "Reglas", icon: BookOpen },
  { key: "perfil", label: "Mi perfil", icon: UserRound },
  { key: "resultados", label: "Resultados", icon: ClipboardCheck, admin: true },
  { key: "admin", label: "Admin", icon: Settings, admin: true }
];

const WHATSAPP_NUMBER = "51922921490";
const WHATSAPP_MESSAGE =
    "Hola, quiero solicitar la creación de un nuevo grupo para la polla mundialista.";

export default function Layout({ active, onNavigate, children }) {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      WHATSAPP_MESSAGE
  )}`;

  const handleNavigate = (key) => {
    onNavigate(key);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
  };

  return (
      <div className="app-shell">
        <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        {sidebarOpen && (
            <button
                type="button"
                className="sidebar-backdrop"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
            />
        )}

        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          <div className="sidebar-mobile-head">
            <div className="brand compact">
              <div className="brand-icon">
                <Trophy size={22} />
              </div>
              <div>
                <h1>La Polla UP</h1>
                <p>Mundialista 2026</p>
              </div>
            </div>

            <button
                type="button"
                className="sidebar-close-button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
            >
              <X size={20} />
            </button>
          </div>

          <div className="brand desktop-brand">
            <div className="brand-icon">
              <Trophy size={22} />
            </div>
            <div>
              <h1>La Polla UP</h1>
              <p>Mundialista 2026</p>
            </div>
          </div>

          <nav className="nav">
            {nav
                .filter((n) => !n.admin || isAdmin)
                .map((item) => {
                  const Icon = item.icon;

                  return (
                      <button
                          type="button"
                          key={item.key}
                          className={`nav-item ${active === item.key ? "active" : ""}`}
                          onClick={() => handleNavigate(item.key)}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </button>
                  );
                })}
          </nav>

          {!isAdmin && (
              <div className="sidebar-help-card">
                <div className="sidebar-help-icon">
                  <MessageCircle size={18} />
                </div>

                <div className="sidebar-help-content">
                  <strong>¿Quieres crear un grupo?</strong>
                  <p>
                    Solicítalo al administrador por WhatsApp para habilitar uno
                    nuevo.
                  </p>

                  <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sidebar-help-button"
                  >
                    Escribir al WhatsApp
                  </a>
                </div>
              </div>
          )}

          <div className="sidebar-user">
            <div className="avatar">
              <Shield size={18} />
            </div>

            <div>
              <strong>{user?.usuario}</strong>
              <small>{user?.rol}</small>
            </div>

            <button
                type="button"
                className="icon-button"
                onClick={handleLogout}
                title="Salir"
            >
              <LogOut size={18} />
            </button>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>
  );
}