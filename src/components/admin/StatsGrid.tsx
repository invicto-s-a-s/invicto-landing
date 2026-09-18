"use client";

export interface AdminStats {
  users_total: number;
  users_by_role: { role: string; count: number }[];
  users_last_7d: number;
  users_last_30d: number;
  profiles_complete: number;
  posts_total: number;
  convocatorias_open: number;
  convocatorias_total: number;
  verifications_pending: number;
}

const ROLE_LABEL: Record<string, string> = {
  player: "Jugadores",
  scout: "Ojeadores",
  club: "Clubes",
  "sin rol": "Sin rol",
};

function Tile({ value, label, hint }: { value: number; label: string; hint?: string }) {
  return (
    <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
      <p className="font-headline font-black italic text-3xl text-neon leading-none">{value}</p>
      <p className="text-sm mt-2">{label}</p>
      {hint && <p className="text-xs text-on-surface-variant mt-1">{hint}</p>}
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: AdminStats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Tile
        value={stats.users_total}
        label="Cuentas registradas"
        hint={`${stats.users_last_7d} en los últimos 7 días · ${stats.users_last_30d} en 30`}
      />
      <Tile
        value={stats.profiles_complete}
        label="Perfiles completados"
        hint={
          // Registrarse y completar el perfil son dos cosas distintas, y la
          // diferencia entre ambas es la que dice si el registro se cae a medias.
          `${stats.users_total - stats.profiles_complete} se quedaron a medias`
        }
      />
      <Tile value={stats.posts_total} label="Publicaciones" />
      <Tile
        value={stats.verifications_pending}
        label="Verificaciones pendientes"
        hint={stats.verifications_pending > 0 ? "Esperando revisión" : "Nada por revisar"}
      />

      <div className="bg-[#141414] border border-[#222] rounded-xl p-5 sm:col-span-2">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-3">
          Por tipo de cuenta
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {stats.users_by_role.map((r) => (
            <div key={r.role}>
              <p className="font-headline font-black italic text-2xl leading-none">{r.count}</p>
              <p className="text-xs text-on-surface-variant mt-1">{ROLE_LABEL[r.role] ?? r.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#141414] border border-[#222] rounded-xl p-5 sm:col-span-2">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-3">
          Convocatorias
        </p>
        <div className="flex gap-8">
          <div>
            <p className="font-headline font-black italic text-2xl text-neon leading-none">
              {stats.convocatorias_open}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Abiertas</p>
          </div>
          <div>
            <p className="font-headline font-black italic text-2xl leading-none">
              {stats.convocatorias_total}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">En total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
