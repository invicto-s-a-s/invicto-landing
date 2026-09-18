"use client";

import AreaChart, { type DayPoint } from "./viz/AreaChart";
import RoleBars from "./viz/RoleBars";
import { SOLO } from "./viz/palette";

type Block = Record<string, number>;

export interface AdminStats {
  cuentas: Block;
  contenido: Block;
  interaccion: Block;
  ojeo: Block;
  convocatorias: Block;
  partidos: Block;
  red: Block;
  users_by_role: { role: string; count: number }[];
  registros_por_dia: DayPoint[];
  publicaciones_por_dia: DayPoint[];
}

const nice = (k: string) => k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
const num = (v: number) => v.toLocaleString("es-CO");

/** La cifra que abre el panel. Grande porque es la que se mira primero. */
function Hero({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <div className="admin-card-solid border border-[#222] rounded-xl p-5">
      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">{label}</p>
      <p className="font-headline font-black italic text-4xl text-neon leading-none mt-2 tabular-nums">
        {num(value)}
      </p>
      {hint && <p className="text-xs text-on-surface-variant mt-2">{hint}</p>}
    </div>
  );
}

/**
 * Un bloque temático: su título y sus cifras, dentro de una sola tarjeta.
 *
 * El título va DENTRO y no suelto encima: el fondo de marca tiene zonas de
 * verde brillante, y un texto gris de 10px cayendo justo ahí deja de leerse.
 * Las fichas de dentro se separan con un velo claro en vez de otra superficie
 * opaca, para que el fondo siga asomando entre bloques.
 */
function Section({ title, block }: { title: string; block: Block }) {
  return (
    <section className="admin-card border border-[#1F1F1F] rounded-xl p-5">
      <h2 className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-4">
        {title}
      </h2>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {Object.entries(block).map(([k, v]) => (
          <div key={k} className="bg-white/[0.035] rounded-lg px-4 py-3">
            <p className="font-headline font-black italic text-xl leading-none tabular-nums">
              {num(v)}
            </p>
            <p className="text-[11px] text-on-surface-variant mt-1.5 leading-tight">{nice(k)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Dashboard({ stats }: { stats: AdminStats }) {
  const { cuentas } = stats;
  // Cuánta gente se registra y no termina el perfil. Es el número que más dice
  // sobre si el registro está funcionando, y no se ve en ninguna otra pantalla.
  const aMedias = cuentas.total - cuentas.perfiles_completos;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Hero
          value={cuentas.total}
          label="Cuentas"
          hint={`+${cuentas.nuevas_7d} en 7 días · +${cuentas.nuevas_30d} en 30`}
        />
        <Hero
          value={cuentas.perfiles_completos}
          label="Perfiles completos"
          hint={aMedias > 0 ? `${num(aMedias)} se quedaron a medias` : "Ninguno a medias"}
        />
        <Hero
          value={stats.contenido.publicaciones}
          label="Publicaciones"
          hint={`+${stats.contenido.nuevas_7d} en 7 días`}
        />
        <Hero
          value={cuentas.verificaciones_pendientes}
          label="Por verificar"
          hint={cuentas.verificaciones_pendientes > 0 ? "Esperando revisión" : "Nada pendiente"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-card-solid border border-[#222] rounded-xl p-5">
          <h2 className="text-sm mb-1">Registros por día</h2>
          <p className="text-xs text-on-surface-variant mb-4">Últimos 30 días</p>
          <AreaChart data={stats.registros_por_dia} color={SOLO} label="Registros" />
        </div>
        <div className="admin-card-solid border border-[#222] rounded-xl p-5">
          <h2 className="text-sm mb-1">Publicaciones por día</h2>
          <p className="text-xs text-on-surface-variant mb-4">Últimos 30 días</p>
          <AreaChart data={stats.publicaciones_por_dia} color={SOLO} label="Publicaciones" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-card-solid border border-[#222] rounded-xl p-5">
          <h2 className="text-sm mb-4">Cuentas por tipo</h2>
          <RoleBars rows={stats.users_by_role} />
        </div>
        <Section title="Cuentas" block={cuentas} />
      </div>

      <Section title="Contenido" block={stats.contenido} />
      <Section title="Interacción" block={stats.interaccion} />
      <Section title="Ojeo y evaluaciones" block={stats.ojeo} />
      <Section title="Convocatorias" block={stats.convocatorias} />
      <Section title="Partidos de club" block={stats.partidos} />
      <Section title="Red" block={stats.red} />
    </div>
  );
}
