"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard, { type AdminStats } from "./Dashboard";
import UsersTable from "./UsersTable";
import ConvocatoriasTable from "./ConvocatoriasTable";
import VerificationsTable from "./VerificationsTable";

interface Me {
  id: number;
  username: string;
  name: string | null;
}

const TABS = [
  { value: "resumen", label: "Resumen", icon: "dashboard" },
  { value: "usuarios", label: "Usuarios", icon: "group" },
  { value: "verificaciones", label: "Verificaciones", icon: "verified_user" },
  { value: "convocatorias", label: "Convocatorias", icon: "campaign" },
] as const;

type Tab = (typeof TABS)[number]["value"];

export default function AdminPanel({ me }: { me: Me }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("resumen");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [failed, setFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/admin/stats")
      .then((r) => r.json())
      .then((body) => (body.data ? setStats(body.data) : setFailed(true)))
      .catch(() => setFailed(true));
  }, []);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const pendientes = stats?.cuentas.verificaciones_pendientes ?? 0;

  return (
    <div className="flex min-h-screen">
      {/* ── Barra lateral ───────────────────────────────────────────────── */}
      <aside
        // `sticky h-screen` y no `static`: en un flex la barra se estira con el
        // contenido, así que en una pantalla larga el botón de cerrar sesión
        // acababa a miles de píxeles hacia abajo.
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-60 shrink-0 lg:h-screen admin-surface border-r border-[#1C1C1C] flex flex-col transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6">
          {/* El logo viene en negro para fondo claro; en la web se invierte. */}
          <img src="/logo.png" alt="Invicto" className="h-7 object-contain brightness-0 invert" />
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-on-surface-variant mt-2">
            Panel del equipo
          </p>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1">
          {TABS.map((t) => {
            const active = tab === t.value;
            return (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  active ? "bg-neon text-background font-medium" : "text-on-surface-variant hover:bg-[#161616]"
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">{t.icon}</span>
                <span className="flex-1">{t.label}</span>
                {/* El pendiente se ve desde cualquier pestaña: es lo único que
                    está esperando a que alguien haga algo. */}
                {t.value === "verificaciones" && pendientes > 0 && (
                  <span
                    className={`text-[10px] rounded-full px-1.5 py-0.5 ${
                      active ? "bg-background text-neon" : "bg-[#FF5A5A] text-white"
                    }`}
                  >
                    {pendientes}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1C1C1C]">
          <p className="px-3 text-sm truncate">{me.name || me.username}</p>
          <p className="px-3 text-xs text-on-surface-variant truncate mb-2">@{me.username}</p>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:bg-[#161616] transition-colors"
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ── Contenido ───────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0">
        <header className="admin-surface sticky top-0 z-20 flex items-center gap-4 px-6 py-5 border-b border-[#1C1C1C]">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-on-surface-variant"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline font-black italic text-2xl">
            {TABS.find((t) => t.value === tab)?.label.toUpperCase()}
          </h1>
        </header>

        <div className="p-6">
          {tab === "resumen" && (
            failed ? (
              <p className="text-sm text-[#FF5A5A]">
                No se pudieron cargar los números. Recarga la página; si sigue igual, la API no responde.
              </p>
            ) : stats ? (
              <Dashboard stats={stats} />
            ) : (
              <p className="text-sm text-on-surface-variant">Cargando los números…</p>
            )
          )}
          {tab === "usuarios" && <UsersTable />}
          {tab === "verificaciones" && <VerificationsTable />}
          {tab === "convocatorias" && <ConvocatoriasTable />}
        </div>
      </main>
    </div>
  );
}
