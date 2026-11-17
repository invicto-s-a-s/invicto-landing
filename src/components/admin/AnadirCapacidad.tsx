"use client";

import { useState } from "react";
import type { Guardar, Plan } from "./catalogo-tipos";

/** Una capacidad tal como existe, esté o no en algún plan. */
export interface Capacidad {
  key: string; kind: "bool" | "limit" | "value"; area: string; description: string;
  is_active: boolean; en_uso?: boolean;
}

const campo = "bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-on-surface";

/**
 * Darle a un plan una capacidad que todavía no tiene.
 *
 * El catálogo solo enseña lo que un plan ya trae, así que una capacidad nueva
 * (las del cuerpo técnico nacen sin estar en ningún plan) no tenía por dónde
 * entrar. Lo que se marca aquí queda también en los planes de arriba: el
 * servidor lo hace y la pantalla dice en cuáles.
 */
export default function AnadirCapacidad({ plan, todas, guardar }: { plan: Plan; todas: Capacidad[]; guardar: Guardar }) {
  const [clave, setClave] = useState("");
  const [tope, setTope] = useState("");
  const [texto, setTexto] = useState("");
  const [busy, setBusy] = useState(false);

  const yaTiene = new Set(plan.features.map((f) => f.feature_key));
  const libres = todas.filter((c) => c.is_active && !yaTiene.has(c.key));
  const elegida = libres.find((c) => c.key === clave);
  if (libres.length === 0) return null;

  const valor = !elegida ? null
    : elegida.kind === "bool" ? { bool_value: true }
    : elegida.kind === "limit" ? { limit_value: tope.trim() === "" ? null : Number(tope.trim()) }
    : { text_value: texto.trim() };
  const listo = !!elegida && (elegida.kind !== "value" || texto.trim().length > 0);

  const anadir = async () => {
    if (!elegida || !valor) return;
    setBusy(true);
    const ok = await guardar(`/api/admin/admin/plans/${plan.key}/features/${elegida.key}`, "PUT", valor);
    setBusy(false);
    if (ok) { setClave(""); setTope(""); setTexto(""); }
  };

  return (
    <div className="mt-3 border-t border-[#1C1C1C] pt-3 grid gap-2">
      <p className="text-xs text-on-surface-variant">Añadir una capacidad a {plan.name}</p>
      <div className="flex flex-wrap items-center gap-2">
        <select className={`${campo} flex-1 min-w-0`} value={clave} onChange={(e) => setClave(e.target.value)}>
          <option value="">Elige una capacidad</option>
          {libres.map((c) => (
            <option key={c.key} value={c.key}>{c.description} ({c.key}){c.en_uso === false ? " · sin efecto todavía" : ""}</option>
          ))}
        </select>
        {elegida?.kind === "limit" && (
          <input className={`${campo} w-32`} inputMode="numeric" value={tope} placeholder="Sin tope"
            onChange={(e) => setTope(e.target.value.replace(/[^\d]/g, ""))} />
        )}
        {elegida?.kind === "value" && (
          <input className={`${campo} w-40`} value={texto} placeholder="Valor" onChange={(e) => setTexto(e.target.value)} />
        )}
        <button onClick={() => void anadir()} disabled={busy || !listo} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40">
          {busy ? "…" : "Añadir"}
        </button>
      </div>
      {elegida && (
        <p className="text-xs text-[#FFB020]">
          {elegida.en_uso === false
            ? "Esta parte todavía no está construida: puedes dejarla puesta, pero hoy no cambia nada para nadie."
            : `Queda en ${plan.name} y en todos los planes que están por encima.`}
        </p>
      )}
    </div>
  );
}
