"use client";

import { SERIES } from "./palette";

const LABEL: Record<string, string> = {
  player: "Jugadores",
  scout: "Ojeadores",
  club: "Clubes",
  "sin rol": "Sin rol",
};

/** Orden fijo por entidad, nunca por tamaño: si el ranking cambia, el color no. */
const ORDER = ["player", "scout", "club", "sin rol"];
const COLOR: Record<string, string> = {
  player: SERIES.lima,
  scout: SERIES.azul,
  club: SERIES.naranja,
  "sin rol": "#4A4A4A",
};

interface Props {
  rows: { role: string; count: number }[];
}

/**
 * Cuántas cuentas hay de cada tipo.
 *
 * Barras horizontales y no un círculo: con cuatro categorías de tamaños muy
 * distintos, comparar longitudes es directo y comparar ángulos no. Y cada barra
 * lleva su nombre al lado, así que el color no es lo único que identifica.
 */
export default function RoleBars({ rows }: Props) {
  const sorted = [...rows].sort((a, b) => ORDER.indexOf(a.role) - ORDER.indexOf(b.role));
  const max = Math.max(1, ...sorted.map((r) => r.count));
  const total = sorted.reduce((sum, r) => sum + r.count, 0);

  return (
    <div className="flex flex-col gap-3">
      {sorted.map((r) => (
        <div key={r.role}>
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-sm">{LABEL[r.role] ?? r.role}</span>
            <span className="text-sm tabular-nums">
              {r.count}
              <span className="text-on-surface-variant text-xs ml-2">
                {total > 0 ? `${Math.round((r.count / total) * 100)}%` : "0%"}
              </span>
            </span>
          </div>
          <div className="h-2 bg-[#1E1E1E] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(r.count / max) * 100}%`, backgroundColor: COLOR[r.role] ?? "#4A4A4A" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
