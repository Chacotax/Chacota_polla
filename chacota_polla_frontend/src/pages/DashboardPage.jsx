import React, { useEffect, useState } from "react";
import { CalendarDays, Shield, Trophy, Users } from "lucide-react";
import { api } from "../api/services";
import StatCard from "../components/StatCard";
import Loading from "../components/Loading";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([api.mapaMundial(), api.misGrupos(user.id_usuario)])
      .then(([mapa, grupos]) => setData({ mapa, grupos }))
      .catch(console.error);
  }, [user.id_usuario]);

  if (!data) return <Loading />;

  const partidos = data.mapa.fixture || [];
  const equipos = data.mapa.grupos?.flatMap(g => g.equipos || []) || [];

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow">Panel principal</span>
          <h2>Bienvenido, {user.nombres}</h2>
          <p>Resumen operativo de la polla mundialista.</p>
        </div>
        <button className="btn primary" onClick={() => onNavigate("grupos")}>Gestionar mis grupos</button>
      </header>

      <div className="stats-grid">
        <StatCard title="Equipos cargados" value={equipos.length} subtitle="Desde BD/API" icon={<Shield />} />
        <StatCard title="Partidos" value={partidos.length} subtitle="Fixture registrado" icon={<CalendarDays />} />
        <StatCard title="Mis grupos" value={data.grupos.length} subtitle="Activos" icon={<Users />} />
        <StatCard title="Ranking" value="Activo" subtitle="Por grupo" icon={<Trophy />} />
      </div>

      <section className="panel">
        <div className="panel-title">
          <h3>Próximos partidos</h3>
          <button className="btn ghost" onClick={() => onNavigate("partidos")}>Ver fixture</button>
        </div>

        <div className="match-list">
          {partidos.slice(0, 5).map(p => (
            <div className="match-card" key={p.id_partido}>
              <div>
                <strong>{p.equipo_local || "Por definir"}</strong>
                <span>vs</span>
                <strong>{p.equipo_visitante || "Por definir"}</strong>
              </div>
              <small>{p.fase} · {p.grupo_nombre || ""} · {p.fecha_hora || "Sin fecha"}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
