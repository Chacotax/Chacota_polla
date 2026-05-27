import React, { useEffect, useState } from "react";
import { api } from "../api/services";
import Loading from "../components/Loading";

export default function MundialPage() {
  const [mapa, setMapa] = useState(null);

  useEffect(() => {
    api.mapaMundial().then(setMapa).catch(console.error);
  }, []);

  if (!mapa) return <Loading />;

  return (
    <div>
      <header className="page-header">
        <div>
          <span className="eyebrow">Mapa del Mundial</span>
          <h2>{mapa.mundial?.nombre}</h2>
          <p>{mapa.mundial?.paises_sede} · {mapa.mundial?.fecha_inicio} al {mapa.mundial?.fecha_fin}</p>
        </div>
      </header>

      <section className="panel">

        <div className="groups-grid">
          {mapa.grupos.map(g => (
            <div className="world-group" key={g.id_grupo_mundial}>
              <div className="world-group-head">
                <strong>{g.nombre}</strong>
                <span>{g.codigo}</span>
              </div>
              {(g.equipos || []).length === 0 ? (
                <p className="muted">Pendiente de equipos</p>
              ) : (
                g.equipos.map(e => (
                  <div className="team-row" key={e.id_equipo}>
                    <span className="flag">{e.bandera_url ? <img src={e.bandera_url} /> : "🏳️"}</span>
                    <div>
                      <strong>{e.nombre}</strong>
                      <small>{e.codigo_fifa || e.nombre_corto || "Sin código"}</small>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
