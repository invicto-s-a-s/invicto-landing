"use client";

import { useEffect, useState } from "react";

interface LeaderRow {
  user_id: number;
  username: string;
  name: string | null;
  profile_photo: string | null;
  total: number;
  detalle: string | null;
}

interface AdminLeaders {
  jugadores_mas_vistos: LeaderRow[];
  ojeadores_mas_activos: LeaderRow[];
  clubes_con_mas_postulaciones: LeaderRow[];
  publicaciones_con_mas_alcance: LeaderRow[];
}

const BLOCKS: { key: keyof AdminLeaders; title: string; hint: string; unidad: string }[] = [
  {
    key: "jugadores_mas_vistos",
    title: "Jugadores más vistos",
    hint: "Personas distintas que entraron a su perfil.",
    unidad: "visitas",
  },
  {
    key: "ojeadores_mas_activos",
    title: "Ojeadores más activos",
    hint: "Reportes terminados más jugadores observados. Los borradores no suman.",
    unidad: "acciones",
  },
  {
    key: "clubes_con_mas_postulaciones",
    title: "Clubes con más postulaciones",
    hint: "La demanda real de sus convocatorias.",
    unidad: "postulaciones",
  },
  {
    key: "publicaciones_con_mas_alcance",
    title: "Publicaciones con más alcance",
    hint: "Personas distintas entre likes, comentarios y compartidos.",
    unidad: "personas",
  },
];

/**
 * Cada tabla lleva su número mayor de referencia y una barra de fondo.
 *
 * La barra va detrás del texto y no en una columna aparte porque en una lista de
 * diez la comparación es entre vecinos: verla pegada a la fila evita cruzar la
 * vista de un lado al otro para saber si el segundo está cerca del primero.
 */
function LeaderTable({ rows, unidad, onOpen }: {
  rows: LeaderRow[];
  unidad: string;
  onOpen: (userId: number) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-xs text-on-surface-variant py-6 text-center">Todavía no hay datos.</p>;
  }
  const max = Math.max(1, ...rows.map((r) => r.total));

  return (
    <ol className="flex flex-col gap-1">
      {rows.map((r, i) => (
        <li key={`${r.user_id}-${i}`}>
          <button
            onClick={() => onOpen(r.user_id)}
            className="relative w-full text-left rounded-lg px-3 py-2.5 overflow-hidden hover:bg-white/[0.04] transition-colors"
          >
            <span
              className="absolute inset-y-0 left-0 bg-[#AAFF00]/[0.09] rounded-lg"
              style={{ width: `${(r.total / max) * 100}%` }}
              aria-hidden
            />
            <span className="relative flex items-baseline gap-3">
              <span className="font-mono text-[11px] text-on-surface-variant w-5 shrink-0">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm truncate">{r.name || r.username}</span>
                <span className="block text-[11px] text-on-surface-variant truncate">
                  @{r.username}
                  {r.detalle ? ` · ${r.detalle}` : ""}
                </span>
              </span>
              <span className="text-sm tabular-nums shrink-0">
                {r.total.toLocaleString("es-CO")}
                <span className="text-on-surface-variant text-[11px] ml-1.5">{unidad}</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

export default function Leaders({ onOpenUser }: { onOpenUser: (userId: number) => void }) {
  const [data, setData] = useState<AdminLeaders | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/admin/admin/leaders")
      .then((r) => r.json())
      .then((body) => (body.data ? setData(body.data) : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="text-sm text-[#FF5A5A]">
        No se pudieron cargar. Recarga la página; si sigue igual, la API no responde.
      </p>
    );
  }
  if (!data) return <p className="text-sm text-on-surface-variant">Cargando…</p>;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {BLOCKS.map((b) => (
        <section key={b.key} className="admin-card border border-[#1F1F1F] rounded-xl p-5">
          <h2 className="text-sm">{b.title}</h2>
          <p className="text-xs text-on-surface-variant mb-3">{b.hint}</p>
          <LeaderTable rows={data[b.key]} unidad={b.unidad} onOpen={onOpenUser} />
        </section>
      ))}
    </div>
  );
}
