"use client";

import { useEffect, useState } from "react";
import AreaChart, { type DayPoint } from "./viz/AreaChart";
import FunnelBars, { type FunnelStep } from "./viz/FunnelBars";
import { SOLO } from "./viz/palette";

interface RetentionPoint {
  dias: number;
  cohorte: number;
  volvieron: number;
  pct: number;
}

interface AdminInsights {
  retencion: RetentionPoint[];
  embudo: FunnelStep[];
  actividad_por_dia: DayPoint[];
}

/**
 * Tres números y nada de gráfico: comparar tres barras no dice más que leer
 * 40%, 31%, 22%, y el porcentaje solo no significa nada sin saber sobre
 * cuántos está calculado — por eso la cohorte va debajo, siempre.
 */
function Retention({ points }: { points: RetentionPoint[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {points.map((p) => (
        <div key={p.dias} className="bg-white/[0.035] rounded-lg px-4 py-4">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
            {p.dias} días
          </p>
          <p
            className="font-headline font-black italic text-3xl leading-none mt-2 tabular-nums"
            style={{ color: SOLO }}
          >
            {p.pct}%
          </p>
          <p className="text-xs text-on-surface-variant mt-2">
            {p.volvieron.toLocaleString("es-CO")} de {p.cohorte.toLocaleString("es-CO")} volvieron
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Lo que el resumen no puede decir: si la app sirve.
 *
 * El resumen cuenta cuánto hay, y con mil cuentas registradas y nadie volviendo
 * se vería igual de bien. Estos tres bloques son lo que distingue una cosa de
 * la otra.
 */
export default function Insights() {
  const [data, setData] = useState<AdminInsights | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/admin/insights")
      .then((r) => r.json())
      .then((body) => (body.data ? setData(body.data) : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="text-sm text-[#FF5A5A]">
        No se pudieron calcular. Recarga la página; si sigue igual, la API no responde.
      </p>
    );
  }
  if (!data) return <p className="text-sm text-on-surface-variant">Calculando…</p>;

  return (
    <div className="flex flex-col gap-10">
      <section className="admin-card-solid border border-[#222] rounded-xl p-5">
        <h2 className="text-sm mb-1">Vuelven</h2>
        <p className="text-xs text-on-surface-variant mb-4">
          De los que se registraron hace al menos ese tiempo, cuántos hicieron algo
          pasado su primer día.
        </p>
        <Retention points={data.retencion} />
      </section>

      <section className="admin-card-solid border border-[#222] rounded-xl p-5">
        <h2 className="text-sm mb-1">Gente activa por día</h2>
        <p className="text-xs text-on-surface-variant mb-4">
          Personas distintas, últimos 30 días. No acciones: cien likes de una cuenta no
          son un día activo.
        </p>
        <AreaChart data={data.actividad_por_dia} color={SOLO} label="Personas activas" />
      </section>

      <section className="admin-card-solid border border-[#222] rounded-xl p-5">
        <h2 className="text-sm mb-1">Embudo del registro</h2>
        <p className="text-xs text-on-surface-variant mb-4">
          Últimos 90 días. Mide el registro de ahora, no el de cuando la verificación de
          correo todavía no existía.
        </p>
        <FunnelBars steps={data.embudo} />
      </section>
    </div>
  );
}
