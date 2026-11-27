"use client";

import { useEffect, useState } from "react";
import type { Permiso } from "./moderacion-tipos";

/**
 * El menú del panel, en carpetas.
 *
 * Con catorce pestañas en fila las últimas quedaban debajo del borde en una
 * pantalla de portátil, sin forma de llegar (Orlando, 2026-11-25). Las carpetas
 * se abren y se cierran; la de la pestaña abierta se abre sola, y la lista se
 * desplaza si aun así no cabe.
 */
export const GRUPOS = [
  { id: "panorama", label: "Panorama", icon: "insights", tabs: [
    { value: "resumen", label: "Resumen", icon: "dashboard", permiso: ["panorama"] },
    { value: "actividad", label: "Actividad", icon: "monitoring", permiso: ["panorama"] },
    { value: "lideres", label: "Líderes", icon: "emoji_events", permiso: ["panorama"] },
  ] },
  { id: "cuentas", label: "Cuentas", icon: "group", tabs: [
    { value: "usuarios", label: "Usuarios", icon: "person_search" },
    { value: "verificaciones", label: "Verificaciones", icon: "verified_user", permiso: ["verificaciones"] },
    { value: "suspendidas", label: "Suspendidas", icon: "block", permiso: ["suspender"] },
    { value: "menores", label: "Menores y salud", icon: "family_restroom", permiso: ["menores"] },
  ] },
  { id: "moderacion", label: "Moderación", icon: "shield", tabs: [
    { value: "reportes", label: "Reportes", icon: "flag", permiso: ["reportes"] },
    { value: "moderacion", label: "Ajustes", icon: "tune", permiso: ["ajustes", "permisos"] },
  ] },
  { id: "negocio", label: "Planes y clientes", icon: "sell", tabs: [
    { value: "planes", label: "Planes", icon: "sell", permiso: ["planes"] },
    { value: "solicitudes", label: "Solicitudes de la web", icon: "inbox", permiso: ["solicitudes"] },
    { value: "convocatorias", label: "Convocatorias", icon: "campaign", permiso: ["escuelas"] },
  ] },
  { id: "escuelas", label: "Escuelas", icon: "school", tabs: [
    { value: "listas", label: "Listas base", icon: "checklist", permiso: ["escuelas"] },
    { value: "uniones", label: "Uniones", icon: "merge", permiso: ["escuelas"] },
  ] },
] as const;

type Pestana = (typeof GRUPOS)[number]["tabs"][number];
export type Tab = Pestana["value"];

export const pestana = (t: Tab): Pestana | undefined => GRUPOS.flatMap((g) => g.tabs as readonly Pestana[]).find((p) => p.value === t);
export const grupoDe = (t: Tab) => GRUPOS.find((g) => (g.tabs as readonly Pestana[]).some((p) => p.value === t));

/** Cada pestaña pide su permiso, salvo «Usuarios», que se mira aparte. Quien decide de verdad es cada ruta del servidor. */
export function seVe(t: Pestana, permisos: readonly Permiso[] | undefined): boolean {
  if ("permiso" in t) return !!permisos && t.permiso.some((p) => permisos.includes(p));
  return t.value !== "usuarios" || !permisos || permisos.includes("usuarios");
}

/** La primera pestaña que esta persona ve: «Resumen» pide Panorama y no todos lo tienen. */
export function primeraVisible(permisos: readonly Permiso[] | undefined): Tab | undefined {
  return GRUPOS.flatMap((g) => g.tabs as readonly Pestana[]).find((t) => seVe(t, permisos))?.value;
}

const GUARDADO = "panel-carpetas";
const leer = (): string[] | null => { try { return JSON.parse(localStorage.getItem(GUARDADO) ?? "null"); } catch { return null; } };

export default function NavDelPanel({ tab, permisos, pendientes, onElegir }: {
  tab: Tab;
  permisos: readonly Permiso[] | undefined;
  /** Por pestaña: lo que espera a que alguien haga algo. */
  pendientes: Partial<Record<Tab, number>>;
  onElegir: (t: Tab) => void;
}) {
  const [abiertas, setAbiertas] = useState<string[]>([grupoDe(tab)?.id ?? "panorama"]);
  useEffect(() => { const g = leer(); if (g) setAbiertas(g); }, []);
  // La carpeta de la pestaña abierta nunca queda cerrada.
  useEffect(() => { const g = grupoDe(tab)?.id; if (g) setAbiertas((a) => (a.includes(g) ? a : [...a, g])); }, [tab]);

  const alternar = (id: string) => setAbiertas((a) => {
    const n = a.includes(id) ? a.filter((x) => x !== id) : [...a, id];
    try { localStorage.setItem(GUARDADO, JSON.stringify(n)); } catch { /* ventana privada */ }
    return n;
  });

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-3 flex flex-col gap-1" aria-label="Secciones del panel">
      {GRUPOS.map((g) => {
        const visibles = (g.tabs as readonly Pestana[]).filter((t) => seVe(t, permisos));
        if (visibles.length === 0) return null;
        const abierta = abiertas.includes(g.id);
        const dentro = visibles.some((t) => t.value === tab);
        const espera = visibles.reduce((n, t) => n + (pendientes[t.value] ?? 0), 0);
        return (
          <div key={g.id}>
            <button
              onClick={() => alternar(g.id)}
              aria-expanded={abierta}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors hover:bg-[#161616] ${dentro ? "text-on-surface" : "text-on-surface-variant"}`}
            >
              <span className="material-symbols-outlined text-[19px]">{g.icon}</span>
              <span className="flex-1 font-medium">{g.label}</span>
              {!abierta && espera > 0 && <span className="text-[10px] rounded-full px-1.5 py-0.5 bg-[#FF5A5A] text-white">{espera}</span>}
              <span className={`material-symbols-outlined text-[18px] transition-transform ${abierta ? "rotate-90" : ""}`}>chevron_right</span>
            </button>
            {abierta && (
              <div className="ml-5 pl-2 border-l border-[#222] flex flex-col gap-0.5 mt-0.5 mb-1">
                {visibles.map((t) => {
                  const activa = tab === t.value;
                  const n = pendientes[t.value] ?? 0;
                  return (
                    <button
                      key={t.value}
                      onClick={() => onElegir(t.value)}
                      aria-current={activa ? "page" : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activa ? "bg-neon text-background font-medium" : "text-on-surface-variant hover:bg-[#161616]"}`}
                    >
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                      <span className="flex-1 min-w-0 truncate">{t.label}</span>
                      {n > 0 && <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${activa ? "bg-background text-neon" : "bg-[#FF5A5A] text-white"}`}>{n}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
