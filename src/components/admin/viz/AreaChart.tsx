"use client";

import { useMemo, useState } from "react";

export interface DayPoint {
  day: string;
  count: number;
}

/** Coordenadas internas del SVG. El ancho real lo pone el contenedor. */
const W = 720;
const H = 180;
const PAD = { top: 14, right: 8, bottom: 22, left: 30 };

const fmtDay = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short" });

interface Props {
  data: DayPoint[];
  /** Serie única: es un acento, no una identidad que haya que distinguir de otras. */
  color: string;
  label: string;
}

/**
 * Una serie a lo largo de 30 días.
 *
 * Serie única a propósito: los registros y las publicaciones son dos magnitudes
 * distintas y meterlas en el mismo gráfico obligaría a dos escalas verticales,
 * que es la forma más rápida de que un gráfico mienta. Dos gráficos separados.
 *
 * Lleva cruceta y globo porque un gráfico en pantalla que no responde al ratón
 * obliga a adivinar los valores intermedios; las etiquetas fijas solo están en
 * el máximo y en los extremos del eje, que es lo que se lee de un vistazo.
 */
export default function AreaChart({ data, color, label }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  const { points, path, area, max, gradientId } = useMemo(() => {
    const max = Math.max(1, ...data.map((d) => d.count));
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const points = data.map((d, i) => ({
      ...d,
      x: PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW),
      y: PAD.top + innerH - (d.count / max) * innerH,
    }));

    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    const base = PAD.top + innerH;

    return {
      points,
      max,
      path: line,
      area: `${line} L${points[points.length - 1]?.x ?? 0},${base} L${points[0]?.x ?? 0},${base} Z`,
      gradientId: `fill-${label.replace(/\W/g, "")}`,
    };
  }, [data, label]);

  if (data.length === 0) return null;

  const active = hover !== null ? points[hover] : null;

  /** Se busca el punto más cercano en X: exigir el píxel exacto sobre una línea
   *  de 2px haría el globo casi imposible de sacar. */
  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * W;
    let nearest = 0;
    for (let i = 1; i < points.length; i += 1) {
      if (Math.abs(points[i].x - x) < Math.abs(points[nearest].x - x)) nearest = i;
    }
    setHover(nearest);
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto block"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`${label}: ${data.length} días, máximo ${max}`}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Rejilla discreta: orienta sin competir con la serie. */}
        {[0, 0.5, 1].map((t) => {
          const y = PAD.top + (H - PAD.top - PAD.bottom) * t;
          return (
            <line key={t} x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#242424" strokeWidth="1" />
          );
        })}

        <text x="4" y={PAD.top + 4} fill="#8A8A8A" fontSize="10">{max}</text>
        <text x="4" y={H - PAD.bottom + 4} fill="#8A8A8A" fontSize="10">0</text>

        <path d={area} fill={`url(#${gradientId})`} />
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {active && (
          <g>
            <line
              x1={active.x} y1={PAD.top} x2={active.x} y2={H - PAD.bottom}
              stroke="#3A3A3A" strokeWidth="1"
            />
            {/* Anillo del color del fondo: separa el punto de la línea sobre la
                que se apoya, que si no se leen como una mancha. */}
            <circle cx={active.x} cy={active.y} r="5" fill={color} stroke="#141414" strokeWidth="2" />
          </g>
        )}

        <text x={PAD.left} y={H - 4} fill="#8A8A8A" fontSize="10">{fmtDay(data[0].day)}</text>
        <text x={W - PAD.right} y={H - 4} fill="#8A8A8A" fontSize="10" textAnchor="end">
          {fmtDay(data[data.length - 1].day)}
        </text>
      </svg>

      {active && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full bg-[#1F1F1F] border border-[#333] rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg"
          style={{ left: `${(active.x / W) * 100}%`, top: `${(active.y / H) * 100}%` }}
        >
          <span className="text-on-surface-variant">{fmtDay(active.day)}</span>
          <span className="mx-2 text-[#444]">·</span>
          <span className="font-medium">{active.count}</span>
        </div>
      )}
    </div>
  );
}
