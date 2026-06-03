import React from "react";
import {
  Ban,
  CheckCircle2,
  ClipboardList,
  Goal,
  Medal,
  ShieldCheck,
  Target,
  Trophy,
  Users
} from "lucide-react";

const reglas = [
  {
    icon: Trophy,
    title: "Resultado del partido",
    points: "+1 punto",
    text: "Si aciertas ganador o empate, sumas 1 punto."
  },
  {
    icon: Target,
    title: "Marcador exacto",
    points: "+2 puntos adicionales",
    text: "Si aciertas el score completo, sumas 2 puntos adicionales."
  },
  {
    icon: Goal,
    title: "Goleadores",
    points: "+1 / -1 por jugador",
    text: "Puedes elegir hasta 3 jugadores. Cada jugador acertado suma 1 punto y cada jugador fallado resta 1 punto."
  },
  {
    icon: Ban,
    title: "Cierre de predicciones",
    points: "5 minutos antes",
    text: "Las predicciones se cierran 5 minutos antes del inicio del partido. Luego solo podrás verlas."
  }
];

export default function ReglasPage() {
  return (
    <div className="rules-page">
      <header className="page-header rules-header">
        <div>
          <span className="eyebrow">Bases del juego</span>
          <h2>Reglas de la Polla Mundialista</h2>
          <p>
            Estas son las reglas oficiales para calcular puntos, ranking de jugadores y ranking general de grupos.
          </p>
        </div>
      </header>

      <section className="rules-hero-card">
        <div className="rules-hero-icon">
          <ShieldCheck size={34} />
        </div>

        <div>
          <span>Sistema de puntaje</span>
          <h3>Predice marcador y hasta 3 goleadores</h3>
          <p>
            Tu puntaje final por partido se calcula sumando resultado, marcador exacto y aciertos/fallos de goleadores.
          </p>
        </div>
      </section>

      <section className="rules-grid">
        {reglas.map((rule) => {
          const Icon = rule.icon;

          return (
            <article className="rule-card" key={rule.title}>
              <div className="rule-icon">
                <Icon size={24} />
              </div>
              <span>{rule.points}</span>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </article>
          );
        })}
      </section>

      <section className="rules-example-section">
        <div className="ranking-section-title">
          <ClipboardList size={18} />
          <span>Ejemplo de cálculo</span>
        </div>

        <div className="rules-example-card">
          <div>
            <h4>Predicción</h4>
            <p>México 2 - 1 Sudáfrica</p>
            <small>Goleadores elegidos: Jugador A, Jugador B y Jugador C</small>
          </div>

          <div>
            <h4>Resultado real</h4>
            <p>México 2 - 1 Sudáfrica</p>
            <small>Metieron gol: Jugador A y Jugador B</small>
          </div>

          <ul>
            <li><CheckCircle2 size={16} /> Ganador correcto: <strong>+1</strong></li>
            <li><CheckCircle2 size={16} /> Marcador exacto: <strong>+2</strong></li>
            <li><CheckCircle2 size={16} /> Jugador A acertado: <strong>+1</strong></li>
            <li><CheckCircle2 size={16} /> Jugador B acertado: <strong>+1</strong></li>
            <li><Ban size={16} /> Jugador C fallado: <strong>-1</strong></li>
          </ul>

          <div className="rules-total-box">
            <span>Total</span>
            <strong>4 puntos</strong>
          </div>
        </div>
      </section>

      <section className="rules-ranking-grid">
        <article>
          <Medal size={24} />
          <h3>Ranking por grupo</h3>
          <p>
            Ordena a los jugadores del grupo según sus puntos acumulados. El podio muestra el Top 3.
          </p>
        </article>

        <article>
          <Users size={24} />
          <h3>Ranking general de grupos</h3>
          <p>
            Ordena todos los grupos por promedio de puntos: total de puntos dividido entre cantidad de jugadores.
          </p>
        </article>
      </section>
    </div>
  );
}
