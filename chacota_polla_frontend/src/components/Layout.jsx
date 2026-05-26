import React from "react";
import {
  Trophy,
  Users,
  Map,
  CalendarDays,
  Shield,
  LogOut,
  Home,
  Settings
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const nav = [
  { key: "dashboard", label: "Inicio", icon: Home },
  { key: "mundial", label: "Mapa Mundial", icon: Map },
  { key: "partidos", label: "Partidos", icon: CalendarDays },
  { key: "grupos", label: "Mis grupos", icon: Users },
  { key: "ranking", label: "Ranking", icon: Trophy },
  { key: "admin", label: "Admin", icon: Settings, admin: true }
];

export default function Layout({ active, onNavigate, children }) {
  const { user, logout, isAdmin } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Trophy size={22} /></div>
          <div>
            <h1>Chacota Polla</h1>
            <p>Mundialista 2026</p>
          </div>
        </div>

        <nav className="nav">
          {nav.filter(n => !n.admin || isAdmin).map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`nav-item ${active === item.key ? "active" : ""}`}
                onClick={() => onNavigate(item.key)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar"><Shield size={18} /></div>
          <div>
            <strong>{user?.usuario}</strong>
            <small>{user?.rol}</small>
          </div>
          <button className="icon-button" onClick={logout} title="Salir">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
