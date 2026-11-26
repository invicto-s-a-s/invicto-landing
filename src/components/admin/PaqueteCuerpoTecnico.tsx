"use client";

import { useCallback, useEffect, useState } from "react";
import { boton, campo, SEGMENTOS } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";
import { useDialogo } from "./Dialogo";

interface PlanDelPaquete { key: string; name: string; segment: string; tier: number; is_active: boolean; is_private: boolean; is_default: boolean; tiene: number }
interface Paquete { partes: { key: string; nombre: string }[]; planes: PlanDelPaquete[]; por_deshacer: number }

const RUTA = "/admin/plans/bundles/staff";

/**
 * El cuerpo técnico en un solo paso: las siete partes desde un plan hacia
 * arriba. Apagar quita solo lo que este botón puso. **Se enciende con el sí de
 * Alexander** (decisión del 2026-11-24).
 */
export default function PaqueteCuerpoTecnico() {
  const dialogo = useDialogo();
  const [d, setD] = useState<Paquete | null>(null);
  const [desde, setDesde] = useState("school_semilla");
  const [ademas, setAdemas] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const cargar = useCallback(() => llamarPanel<Paquete>(RUTA).then((r) => {
    if (r.ok && r.data) setD(r.data); else setAviso(r.message ?? "No fue posible leer los planes.");
  }), []);
  useEffect(() => { void cargar(); }, [cargar]);

  const enviar = async (active: boolean) => {
    const base = d?.planes.find((p) => p.key === desde);
    const ok = await dialogo.confirmar(active
      ? { titulo: `¿Encender el cuerpo técnico desde ${base?.name ?? "ese plan"}?`, boton: "Encender", texto: "Las escuelas con ese plan o uno más alto verán las siete partes enseguida." }
      : { titulo: "¿Apagar el cuerpo técnico?", boton: "Apagar", peligro: true, texto: "Se quita lo que este botón puso. Quien ya lo tenía de antes lo conserva, y nada de lo registrado se borra." });
    if (!ok) return;
    setBusy(true);
    const r = await llamarPanel<{ puestas?: number; quitadas?: number; quedan?: unknown[] }>(RUTA, "PUT", active ? { active, from: desde, also: ademas } : { active });
    setBusy(false);
    setAviso(!r.ok ? r.message ?? "No fue posible guardar el cambio."
      : active ? `Listo: ${r.data?.puestas ?? 0} cambios en los planes.`
        : `Listo: ${r.data?.quitadas ?? 0} cambios deshechos${r.data?.quedan?.length ? `, y ${r.data.quedan.length} quedaron porque un plan de abajo las tiene` : ""}.`);
    await cargar();
  };

  if (!d) return <p className="text-sm text-on-surface-variant">{aviso ?? "Cargando…"}</p>;
  const base = d.planes.find((p) => p.key === desde);
  const privados = d.planes.filter((p) => p.segment === base?.segment && p.is_private && p.key !== desde);
  return (
    <div className="grid gap-4 max-w-3xl">
      <p className="text-sm text-on-surface-variant">
        Las siete partes: {d.partes.map((p) => p.nombre).join(", ")}. El plan gratuito no las lleva.
      </p>
      <div className="admin-card border border-[#222] rounded-xl p-4 grid gap-3">
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Encender desde
          <select className={`${campo} max-w-xs`} value={desde} onChange={(e) => { setDesde(e.target.value); setAdemas([]); }}>
            {d.planes.filter((p) => !p.is_default && !p.is_private).map((p) => (
              <option key={p.key} value={p.key}>{SEGMENTOS[p.segment]} · {p.name}</option>
            ))}
          </select>
        </label>
        {privados.map((p) => (
          <label key={p.key} className="flex gap-2 items-center text-xs text-on-surface-variant">
            <input type="checkbox" checked={ademas.includes(p.key)}
              onChange={(e) => setAdemas((x) => (e.target.checked ? [...x, p.key] : x.filter((k) => k !== p.key)))} />
            También en {p.name} (privado{p.is_active ? "" : ", apagado"})
          </label>
        ))}
        <div className="flex flex-wrap gap-2">
          <button className={`${boton} bg-neon text-background font-medium`} disabled={busy} onClick={() => void enviar(true)}>Encender</button>
          <button className={`${boton} border border-[#444]`} disabled={busy || d.por_deshacer === 0} onClick={() => void enviar(false)}>
            Apagar ({d.por_deshacer} por deshacer)
          </button>
        </div>
        {aviso && <p className="text-xs text-[#FFB020]">{aviso}</p>}
      </div>
      <div className="grid gap-1">
        {d.planes.map((p) => (
          <p key={p.key} className="text-xs text-on-surface-variant flex justify-between gap-4 border-b border-[#1A1A1A] py-1">
            <span>{SEGMENTOS[p.segment]} · {p.name}{p.is_active ? "" : " (apagado)"}</span>
            <span className={p.tiene === d.partes.length ? "text-neon" : ""}>{p.tiene} de {d.partes.length}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
