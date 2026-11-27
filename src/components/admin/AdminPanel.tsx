"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard, { type AdminStats } from "./Dashboard";
import UsersTable from "./UsersTable";
import ConvocatoriasTable from "./ConvocatoriasTable";
import VerificationsTable from "./VerificationsTable";
import Insights from "./Insights";
import Leaders from "./Leaders";
import UserDetail from "./UserDetail";
import PlansPanel from "./PlansPanel";
import ListasBase from "./ListasBase";
import MenoresYSalud from "./MenoresYSalud";
import UnionesDeEscuelas from "./UnionesDeEscuelas";
import ReportesTable from "./ReportesTable";
import SuspendidasTable from "./SuspendidasTable";
import SolicitudesTable from "./SolicitudesTable";
import ModeracionPanel from "./ModeracionPanel";
import { Permiso } from "./moderacion-tipos";
import NavDelPanel, { grupoDe, pestana, primeraVisible, seVe, type Tab } from "./NavDelPanel";
import { Dialogos } from "./Dialogo";

interface Me {
  id: number;
  username: string;
  name: string | null;
  /** Lo que puede hacer. Un servidor anterior no lo manda: el panel queda como antes. */
  permissions?: Permiso[];
}

export default function AdminPanel({ me }: { me: Me }) {
  const router = useRouter();
  const [elegida, setTab] = useState<Tab>("resumen");
  // Si la elegida no se ve con sus permisos (sin Panorama, «Resumen»), la primera que sí.
  const vista = pestana(elegida);
  const tab: Tab = vista && seVe(vista, me.permissions) ? elegida : primeraVisible(me.permissions) ?? elegida;
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [failed, setFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Desde una tabla de líderes también se abre la ficha: el panel vive aquí
  // porque esa pestaña no tiene una lista propia detrás a la que volver.
  const [openUser, setOpenUser] = useState<number | null>(null);

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
    <Dialogos>
    <div className="flex min-h-screen">
      {/* ── Barra lateral ───────────────────────────────────────────────── */}
      <aside
        // `sticky h-screen` y no `static`: en un flex la barra se estira con el
        // contenido, así que en una pantalla larga el botón de cerrar sesión
        // acababa a miles de píxeles hacia abajo.
        className={`fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-64 max-w-[85vw] shrink-0 h-[100dvh] lg:h-screen admin-surface border-r border-[#1C1C1C] flex flex-col transition-transform duration-200 ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 shrink-0">
          {/* El logo viene en negro para fondo claro; en la web se invierte. */}
          <img src="/logo.png" alt="Invicto" className="h-7 object-contain brightness-0 invert" />
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-on-surface-variant mt-2">
            Panel del equipo
          </p>
        </div>

        <NavDelPanel
          tab={tab}
          permisos={me.permissions}
          pendientes={{ verificaciones: pendientes }}
          onElegir={(t) => { setTab(t); setMenuOpen(false); }}
        />

        <div className="p-3 border-t border-[#1C1C1C] shrink-0">
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
        <header className="admin-surface sticky top-0 z-20 flex items-center gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b border-[#1C1C1C]">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden text-on-surface-variant"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant truncate">{grupoDe(tab)?.label}</p>
            <h1 className="font-headline font-black italic text-xl sm:text-2xl truncate">
              {pestana(tab)?.label.toUpperCase()}
            </h1>
          </div>
        </header>

        <div className="p-4 sm:p-6">
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
          {tab === "actividad" && <Insights />}
          {tab === "lideres" && <Leaders onOpenUser={setOpenUser} />}
          {tab === "usuarios" && <UsersTable permisos={me.permissions} />}
          {tab === "verificaciones" && <VerificationsTable />}
          {tab === "convocatorias" && <ConvocatoriasTable />}
          {tab === "planes" && <PlansPanel />}
          {tab === "listas" && <ListasBase />}
          {tab === "uniones" && <UnionesDeEscuelas />}
          {tab === "reportes" && <ReportesTable permisos={me.permissions ?? []} onAbrirCuenta={setOpenUser} />}
          {tab === "suspendidas" && <SuspendidasTable onAbrirCuenta={setOpenUser} />}
          {tab === "solicitudes" && <SolicitudesTable />}
          {tab === "moderacion" && <ModeracionPanel permisos={me.permissions ?? []} />}
          {tab === "menores" && <MenoresYSalud />}
        </div>
      </main>

      {openUser !== null && (
        <UserDetail userId={openUser} permisos={me.permissions} onClose={() => setOpenUser(null)} />
      )}
    </div>
    </Dialogos>
  );
}
