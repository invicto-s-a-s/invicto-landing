"use client";

import { useEffect, useState } from "react";
import { type Guardar, type Plan, boton, campo, chip } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";

interface Capacidad { key: string; kind: "bool" | "limit" | "value"; area: string; description: string; is_active: boolean; en_uso: boolean }

type Props = { plan: Plan; guardar: Guardar; cerrar: () => void };

/**
 * Sumarle a un plan una capacidad que no trae: es como se arma un plan
 * «chuleando» del vocabulario. Las capacidades no se crean aquí, porque son lo
 * que el código consulta; se elige de la lista entera.
 */
export default function AnadirCapacidad({ plan, guardar, cerrar }: Props) {
  const [todas, setTodas] = useState<Capacidad[] | null>(null);
  const [clave, setClave] = useState("");
  const [si, setSi] = useState(true);
  const [sinTope, setSinTope] = useState(false);
  const [tope, setTope] = useState("");
  const [texto, setTexto] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    llamarPanel<Capacidad[]>("/admin/plans/features").then((r) => setTodas(Array.isArray(r.data) ? r.data : []));
  }, []);

  const tiene = new Set(plan.features.map((f) => f.feature_key));
  const libres = (todas ?? []).filter((c) => !tiene.has(c.key));
  const c = libres.find((x) => x.key === clave) ?? null;
  const listo = !!c && (c.kind === "bool" || (c.kind === "limit" && (sinTope || /^\d+$/.test(tope.trim()))) || (c.kind === "value" && !!texto.trim()));

  const anadir = async () => {
    if (!c) return;
    const valor = c.kind === "bool" ? { bool_value: si }
      : c.kind === "limit" ? { limit_value: sinTope ? null : Number(tope.trim()) }
        : { text_value: texto.trim() };
    setBusy(true);
    const ok = await guardar(`/api/admin/admin/plans/${plan.key}/features/${c.key}`, "PUT", valor);
    setBusy(false);
    if (ok) cerrar();
  };

  if (!todas) return <p className="text-xs text-on-surface-variant mt-3">Cargando las capacidades…</p>;

  return (
    <div className="mt-3 grid gap-3 border-t border-[#222] pt-3">
      {libres.length === 0 ? (
        <p className="text-xs text-on-surface-variant">Este plan ya tiene todas las capacidades.</p>
      ) : (
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Capacidad que quieres sumar a {plan.name}
          <select className={campo} value={clave} onChange={(e) => setClave(e.target.value)}>
            <option value="">Elige una…</option>
            {libres.map((x) => (
              <option key={x.key} value={x.key}>
                {x.description} ({x.key}){x.en_uso ? "" : " · sin efecto hoy"}{x.is_active ? "" : " · desactivada"}
              </option>
            ))}
          </select>
        </label>
      )}

      {c?.kind === "bool" && (
        <div className="flex flex-wrap gap-2">
          <button className={chip(si)} onClick={() => setSi(true)}>Sí</button>
          <button className={chip(!si)} onClick={() => setSi(false)}>No</button>
        </div>
      )}
      {c?.kind === "limit" && (
        <div className="flex flex-wrap items-center gap-2">
          <button className={chip(sinTope)} onClick={() => setSinTope(true)}>Sin tope</button>
          <button className={chip(!sinTope)} onClick={() => setSinTope(false)}>Con tope</button>
          {!sinTope && <input className={`${campo} w-28`} inputMode="numeric" value={tope} onChange={(e) => setTope(e.target.value.replace(/[^\d]/g, ""))} placeholder="10" />}
        </div>
      )}
      {c?.kind === "value" && <input className={campo} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="national" />}
      {c && !c.en_uso && <p className="text-xs text-[#FFB020]">El código aún no consulta esta capacidad: puedes sumarla, pero hoy no cambia nada para las cuentas.</p>}
      {c && c.en_uso && <p className="text-xs text-[#FFB020]">Afecta a todas las cuentas con el plan {plan.name}, ahora mismo.</p>}

      <div className="flex flex-wrap gap-2">
        <button onClick={cerrar} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
        <button onClick={() => void anadir()} disabled={busy || !listo} className={`${boton} bg-neon text-background font-medium`}>{busy ? "…" : "Sumar al plan"}</button>
      </div>
    </div>
  );
}
