"use client";

import { useState } from "react";
import type { Guardar, Plan } from "./catalogo-tipos";

const campo = "w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-on-surface";
const SEGMENTOS: Record<string, string> = { player: "Jugador", scout: "Ojeador", club: "Club", school: "Escuela" };

/**
 * Crear un plan sin programar.
 *
 * Se elige **encima de cuál va**: el plan nuevo nace con todo lo que tiene ese
 * (así la escalera es cierta desde el primer momento) y apagado, para que nadie
 * lo vea en la app hasta que tenga su precio y sus capacidades.
 */
export default function NuevoPlan({ plans, guardar }: { plans: Plan[]; guardar: Guardar }) {
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [encimaDe, setEncimaDe] = useState("");
  const [busy, setBusy] = useState(false);

  const escalones = plans.filter((p) => p.kind === "plan").sort((a, b) => a.segment.localeCompare(b.segment) || a.tier - b.tier);
  const base = escalones.find((p) => p.key === encimaDe);
  const listo = nombre.trim().length > 0 && !!base;

  const crear = async () => {
    setBusy(true);
    const ok = await guardar("/api/admin/admin/plans", "POST", { name: nombre.trim(), encima_de: encimaDe });
    setBusy(false);
    if (ok) { setNombre(""); setEncimaDe(""); setAbierto(false); }
  };

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} className="mb-6 text-sm px-4 py-2 rounded-lg bg-neon text-background font-medium">
        Crear un plan
      </button>
    );
  }

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl grid gap-3 mb-6">
      <p className="font-headline font-black italic text-lg leading-tight">Plan nuevo</p>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Nombre, tal como lo verá la gente en la app
        <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={60} placeholder="Regional Plus" autoFocus />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Va justo encima de
        <select className={campo} value={encimaDe} onChange={(e) => setEncimaDe(e.target.value)}>
          <option value="">Elige un plan</option>
          {escalones.map((p) => (
            <option key={p.key} value={p.key}>{SEGMENTOS[p.segment] ?? p.segment} · {p.name}</option>
          ))}
        </select>
      </label>
      {base && (
        <p className="text-xs text-on-surface-variant">
          Nace con las {base.features.length} capacidades de {base.name} y <b className="text-on-surface">apagado</b>. Después le pones
          precio, le marcas lo que trae de más y lo enciendes. Los planes que estaban por encima de {base.name} suben un nivel.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setAbierto(false)} disabled={busy} className="text-xs px-4 py-2 rounded-lg border border-[#333] text-on-surface-variant">Cancelar</button>
        <button onClick={() => void crear()} disabled={busy || !listo} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40">
          {busy ? "…" : "Crear el plan"}
        </button>
      </div>
    </div>
  );
}
