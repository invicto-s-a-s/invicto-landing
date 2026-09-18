"use client";

import { SOLO } from "./palette";

export interface FunnelStep {
  paso: string;
  total: number;
  pct: number;
}

/**
 * El embudo del registro.
 *
 * Todas las barras del mismo color a propósito: la longitud ya dice el valor, y
 * darle un color por paso convertiría en identidad algo que es una secuencia —
 * cuatro colores sugieren cuatro cosas distintas, y son la misma gente en
 * cuatro momentos.
 *
 * Lo que de verdad se viene a leer aquí no es cuántos llegaron a cada paso,
 * sino **dónde se cae la gente**. Por eso la pérdida va escrita entre barra y
 * barra, y no hay que restar de cabeza.
 */
export default function FunnelBars({ steps }: { steps: FunnelStep[] }) {
  if (steps.length === 0) return null;
  const max = Math.max(1, steps[0].total);

  return (
    <div className="flex flex-col">
      {steps.map((s, i) => {
        const prev = i > 0 ? steps[i - 1] : null;
        const perdidos = prev ? prev.total - s.total : 0;

        return (
          <div key={s.paso}>
            {prev && (
              <p className="text-[11px] text-on-surface-variant py-1.5 pl-1">
                {perdidos > 0 ? (
                  <>
                    <span className="text-[#FF8A6B]">−{perdidos.toLocaleString("es-CO")}</span>{" "}
                    se quedaron aquí
                  </>
                ) : (
                  "Nadie se quedó aquí"
                )}
              </p>
            )}

            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm">{s.paso}</span>
              <span className="text-sm tabular-nums">
                {s.total.toLocaleString("es-CO")}
                <span className="text-on-surface-variant text-xs ml-2">{s.pct}%</span>
              </span>
            </div>
            <div className="h-2.5 bg-[#1E1E1E] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${(s.total / max) * 100}%`, backgroundColor: SOLO }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
