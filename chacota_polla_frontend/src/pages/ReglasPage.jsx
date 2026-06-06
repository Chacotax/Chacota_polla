import React from "react";
import {
  Banknote,
  Ban,
  CheckCircle2,
  Clock,
  Goal,
  Medal,
  ShieldCheck,
  Target,
  Trophy,
  Users
} from "lucide-react";

export default function ReglasPage() {
  return (
      <div className="rules-page">
        <header className="page-header rules-header">
          <div>
            <span className="eyebrow">Bases del juego</span>
            <h2>Reglas de La Polla UP</h2>
            <p>
              Conoce cómo se registran las predicciones, cómo se calculan los
              puntos, cuáles son los premios y cómo funcionan los rankings.
            </p>
          </div>
        </header>

        <section className="rules-hero-card">
          <div className="rules-hero-icon">
            <Trophy size={42} />
          </div>

          <div>
            <span>Objetivo</span>
            <h3>Acumula la mayor cantidad de puntos</h3>
            <p>
              Cada participante registra su marcador antes del inicio del partido
              y selecciona hasta 3 posibles goleadores. Los puntos se calculan
              cuando administración registra el resultado final.
            </p>
          </div>
        </section>

        <section className="rules-grid">
          <article className="rule-card">
            <div className="rule-icon">
              <Target size={24} />
            </div>

            <div>
              <span>Regla 1</span>
              <h3>Resultado del partido</h3>
              <p>
                Si aciertas el resultado general del partido, sumas{" "}
                <strong>3 puntos</strong>.
              </p>

              <ul>
                <li>Si predices que gana el local y gana el local: +3</li>
                <li>Si predices que gana el visitante y gana el visitante: +3</li>
                <li>Si predices empate y el partido termina empatado: +3</li>
              </ul>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <span>Regla 2</span>
              <h3>Marcador exacto</h3>
              <p>
                Si aciertas el score completo del partido, sumas{" "}
                <strong>5 puntos en total</strong>.
              </p>

              <div className="rule-example">
                <small>Ejemplo</small>
                <strong>Predicción: México 2 - 1 Sudáfrica</strong>
                <p>Resultado real: México 2 - 1 Sudáfrica → +5 puntos</p>
              </div>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Goal size={24} />
            </div>

            <div>
              <span>Regla 3</span>
              <h3>Goleadores</h3>
              <p>
                Puedes seleccionar hasta <strong>3 jugadores</strong> como
                posibles goleadores.
              </p>

              <ul>
                <li>Jugador seleccionado que mete gol: +1 punto</li>
                <li>Jugador seleccionado que no mete gol: -1 punto</li>
                <li>Máximo 3 jugadores por predicción</li>
              </ul>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Clock size={24} />
            </div>

            <div>
              <span>Regla 4</span>
              <h3>Cierre de predicciones</h3>
              <p>
                Las predicciones se cierran automáticamente{" "}
                <strong>1 hora antes</strong> del inicio del partido.
              </p>

              <ul>
                <li>Antes del cierre puedes crear o editar tu predicción.</li>
                <li>Después del cierre solo podrás verla.</li>
                <li>El sistema bloqueará cualquier intento de modificación.</li>
              </ul>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Medal size={24} />
            </div>

            <div>
              <span>Regla 5</span>
              <h3>Ranking por grupo</h3>
              <p>
                Cada grupo tiene su propio ranking interno. Los participantes se
                ordenan por puntos acumulados.
              </p>

              <ul>
                <li>Mayor puntaje ocupa mejor posición.</li>
                <li>Se muestra Top 3 del grupo.</li>
                <li>También puedes ver el ranking completo del grupo.</li>
              </ul>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Users size={24} />
            </div>

            <div>
              <span>Regla 6</span>
              <h3>Ranking general de grupos</h3>
              <p>
                Los grupos se comparan por promedio de puntos por jugador.
              </p>

              <div className="rule-formula">
                promedio = total de puntos del grupo / cantidad de jugadores
              </div>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Trophy size={24} />
            </div>

            <div>
              <span>Regla 7</span>
              <h3>Ranking general de empresa</h3>
              <p>
                Une a todos los participantes de todos los grupos y los ordena
                por puntaje total acumulado.
              </p>

              <ul>
                <li>Muestra la competencia global de toda la empresa.</li>
                <li>Permite saber quién va liderando sin importar su grupo.</li>
              </ul>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <ShieldCheck size={24} />
            </div>

            <div>
              <span>Regla 8</span>
              <h3>Registro oficial de resultados</h3>
              <p>
                Solo administración registra el marcador final y los jugadores que
                anotaron. Al guardar el resultado, el sistema recalcula los
                puntajes automáticamente.
              </p>
            </div>
          </article>

          <article className="rule-card">
            <div className="rule-icon">
              <Banknote size={24} />
            </div>

            <div>
              <span>Premios</span>
              <h3>Premios finales</h3>
              <p>
                Al finalizar la competencia, se premiará a los tres primeros
                lugares del ranking general de la empresa.
              </p>

              <ul>
                <li>Primer puesto: S/ 300</li>
                <li>Segundo puesto: S/ 200</li>
                <li>Tercer puesto: S/ 100</li>
              </ul>
            </div>
          </article>
        </section>

        <section className="rules-score-section">
          <div className="ranking-section-title">
            <Trophy size={18} />
            <span>Resumen de puntaje</span>
          </div>

          <div className="rules-score-table">
            <div className="rules-score-row header">
              <span>Criterio</span>
              <span>Puntos</span>
            </div>

            <div className="rules-score-row">
              <span>Acertar ganador o empate</span>
              <strong>+3</strong>
            </div>

            <div className="rules-score-row">
              <span>Acertar marcador exacto</span>
              <strong>+5</strong>
            </div>

            <div className="rules-score-row">
              <span>Goleador acertado</span>
              <strong>+1</strong>
            </div>

            <div className="rules-score-row danger">
              <span>Goleador fallado</span>
              <strong>-1</strong>
            </div>
          </div>
        </section>

        <section className="rules-score-section">
          <div className="ranking-section-title">
            <Banknote size={18} />
            <span>Premios finales</span>
          </div>

          <div className="rules-score-table">
            <div className="rules-score-row header">
              <span>Puesto</span>
              <span>Premio</span>
            </div>

            <div className="rules-score-row">
              <span>Primer puesto</span>
              <strong>S/ 300</strong>
            </div>

            <div className="rules-score-row">
              <span>Segundo puesto</span>
              <strong>S/ 200</strong>
            </div>

            <div className="rules-score-row">
              <span>Tercer puesto</span>
              <strong>S/ 100</strong>
            </div>
          </div>
        </section>

        <section className="rules-warning-card">
          <Ban size={24} />

          <div>
            <h3>Importante</h3>
            <p>
              El marcador exacto vale 5 puntos en total. Si aciertas el marcador
              exacto, no se suman adicionalmente los 3 puntos del resultado; se
              considera directamente el puntaje mayor.
            </p>
          </div>
        </section>
      </div>
  );
}