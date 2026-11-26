"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { useDialogo } from "./Dialogo";

export interface Parametro {
  key: string;
  titulo: string;
  ayuda: string;
  opciones?: Array<[valor: string, nombre: string]>;
  numero?: boolean;
  /** Lo que se pregunta antes de guardar algo que no se puede deshacer. */
  confirmar?: string;
}

/** Un parámetro de la app con sus opciones. Un servidor que aún no lo tiene no lo enseña. */
export default function ParametroDelPanel({ p }: { p: Parametro }) {
  const dialogo = useDialogo();
  const [valor, setValor] = useState<string | null>(null);
  const [escrito, setEscrito] = useState("");
  const [noHay, setNoHay] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ value: string }>(`/admin/parameters/${p.key}`).then((r) => {
      if (!r.ok || typeof r.data?.value !== "string") { setNoHay(true); return; }
      setValor(r.data.value);
      setEscrito(r.data.value);
    }), [p.key]);

  useEffect(() => { void cargar(); }, [cargar]);

  const guardar = async (nuevo: string) => {
    if (busy || nuevo === valor) return;
    if (p.confirmar && nuevo !== p.opciones?.[0]?.[0] && !(await dialogo.confirmar({
      titulo: "¿Guardar este cambio?", texto: p.confirmar, boton: "Guardar",
      cambio: { de: p.opciones?.find(([v]) => v === valor)?.[1] ?? valor ?? "", a: p.opciones?.find(([v]) => v === nuevo)?.[1] ?? nuevo },
    }))) return;
    setBusy(true);
    setError(null);
    const r = await llamarPanel(`/admin/parameters/${p.key}`, "PUT", { value: nuevo });
    if (!r.ok) setError(r.message ?? "No se pudo guardar el cambio.");
    await cargar();
    setBusy(false);
  };

  if (noHay) return null;
  return (
    <div className="admin-card border border-[#222] rounded-xl p-4 flex flex-wrap items-start gap-3 justify-between">
      <div className="min-w-0 flex-1 basis-64">
        <p className="text-sm font-medium">{p.titulo}</p>
        <p className="text-xs text-on-surface-variant mt-1">{p.ayuda}</p>
        <p className="text-[11px] text-on-surface-variant/60 mt-1 font-mono">{p.key}</p>
        {error && <p className="text-xs text-[#FF5A5A] mt-1">{error}</p>}
      </div>
      <div className="flex gap-2 shrink-0">
        {p.opciones?.map(([v, nombre]) => (
          <button
            key={v}
            disabled={busy || valor === null}
            onClick={() => guardar(v)}
            className={`text-xs px-4 py-2 rounded-lg disabled:opacity-40 ${valor === v ? "bg-neon text-background font-medium" : "border border-[#444] text-on-surface-variant"}`}
          >
            {nombre}
          </button>
        ))}
        {p.numero && (
          <>
            <input value={escrito} inputMode="numeric" onChange={(e) => setEscrito(e.target.value.replace(/\D/g, ""))} className="w-20 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm" aria-label={p.titulo} />
            <button disabled={busy || !escrito || escrito === valor} onClick={() => guardar(escrito)} className="text-xs px-4 py-2 rounded-lg border border-[#444] disabled:opacity-40">Guardar</button>
          </>
        )}
      </div>
    </div>
  );
}
