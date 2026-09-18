"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatsGrid, { type AdminStats } from "./StatsGrid";
import UsersTable from "./UsersTable";
import ConvocatoriasTable from "./ConvocatoriasTable";
import VerificationsTable from "./VerificationsTable";

interface Me {
  id: number;
  username: string;
  name: string | null;
}

const TABS = [
  { value: "resumen", label: "Resumen" },
  { value: "usuarios", label: "Usuarios" },
  { value: "verificaciones", label: "Verificaciones" },
  { value: "convocatorias", label: "Convocatorias" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export default function AdminPanel({ me }: { me: Me }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("resumen");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/admin/stats")
      .then((r) => r.json())
      .then((body) => setStats(body.data ?? null))
      .catch(() => setStats(null));
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <header className="flex items-start justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-on-surface-variant mb-1">
            Equipo Invicto
          </p>
          <h1 className="font-headline font-black italic text-3xl">PANEL</h1>
        </div>
        <div className="text-right">
          <p className="text-sm">{me.name || me.username}</p>
          <button
            onClick={logout}
            className="text-xs text-on-surface-variant hover:text-neon transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8 border-b border-[#222] pb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === t.value ? "bg-neon text-background" : "bg-[#141414] text-on-surface-variant"
            }`}
          >
            {t.label}
            {/* El pendiente se ve desde cualquier pestaña: es lo único que
                requiere que alguien haga algo. */}
            {t.value === "verificaciones" && !!stats?.verifications_pending && (
              <span className="ml-2 text-[10px] bg-[#FF5A5A] text-white rounded-full px-1.5 py-0.5">
                {stats.verifications_pending}
              </span>
            )}
          </button>
        ))}
      </nav>

      {tab === "resumen" && (
        stats
          ? <StatsGrid stats={stats} />
          : <p className="text-sm text-on-surface-variant">Cargando los números…</p>
      )}
      {tab === "usuarios" && <UsersTable />}
      {tab === "verificaciones" && <VerificationsTable />}
      {tab === "convocatorias" && <ConvocatoriasTable />}
    </div>
  );
}
