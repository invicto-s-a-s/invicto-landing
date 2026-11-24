"use client";

import { useState } from "react";
import { llamarPanel } from "./panel-api";
import { dia, plazo, QUIEN, type SolicitudDeFecha } from "./fechas-tipos";

/**
 * Una solicitud. Si cruza los 18, **se confirma dos veces**: primero se lee qué se
 * abre o se cierra, y después se escribe la palabra. El servidor lo exige también.
 */
export default function TarjetaDeFecha({ s, onCambio }: { s: SolicitudDeFecha; onCambio: () => void }) {
  const [paso, setPaso] = useState<"ver" | "aprobar" | "rechazar">("ver");
  const [palabra, setPalabra] = useState("");
  const [nota, setNota] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (ruta: "approve" | "reject", body: object) => {
    setBusy(true);
    setError(null);
    const r = await llamarPanel(`/admin/birth-date-requests/${s.id}/${ruta}`, "POST", body);
    setBusy(false);
    if (!r.ok) { setError(r.message ?? "No se pudo guardar."); return; }
    onCambio();
  };

  const falta = s.escribir_para_confirmar;
  const puedeAprobar = !falta || palabra.trim().toUpperCase() === falta;

  return (
    <div className={`admin-card border rounded-xl p-5 ${s.alerta === "vencida" ? "border-[#FF5A5A]" : s.alerta ? "border-[#B58A2E]" : "border-[#222]"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-headline font-black italic text-lg leading-tight">{s.nombre}</p>
          <p className="text-sm mt-1">
            {dia(s.fecha_actual)}{s.edad_actual !== null ? ` (${s.edad_actual} años)` : ""} → {dia(s.fecha_nueva)} ({s.edad_nueva} años)
          </p>
          <p className="text-xs text-on-surface-variant mt-1">{QUIEN[s.quien]}{s.escuela ? ` · ${s.escuela}` : ""} · cuenta {s.user_id}</p>
          <p className="text-xs text-on-surface-variant italic mt-1">«{s.motivo}»</p>
          {s.nota && <p className="text-xs mt-1">Motivo del rechazo: {s.nota}</p>}
        </div>
        <p className={`text-xs shrink-0 ${s.alerta === "vencida" ? "text-[#FF5A5A]" : "text-on-surface-variant"}`}>{plazo(s)}</p>
      </div>

      {s.estado === "pendiente" && s.cruce && (
        <div className="border border-[#B58A2E] rounded-lg p-3 mt-3">
          <p className="text-sm font-medium">{s.cruce === "a_mayor" ? "Pasa de menor a mayor de edad" : "Pasa de mayor a menor de edad"}</p>
          <ul className="list-disc pl-5 mt-1 text-xs text-on-surface-variant space-y-1">{s.que_cambia.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      )}

      {s.estado === "pendiente" && paso === "ver" && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => setPaso("aprobar")} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium">Aprobar</button>
          <button onClick={() => setPaso("rechazar")} className="text-xs px-4 py-2 rounded-lg border border-[#444]">Rechazar</button>
        </div>
      )}
      {paso === "aprobar" && (
        <div className="mt-4">
          {falta && (
            <label className="block text-xs mb-3">
              Escribe <strong>{falta}</strong> para confirmarlo por segunda vez
              <input value={palabra} onChange={(e) => setPalabra(e.target.value)} className="block mt-1 w-full max-w-xs bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm" />
            </label>
          )}
          <div className="flex gap-2">
            <button disabled={busy || !puedeAprobar} onClick={() => enviar("approve", falta ? { confirm: palabra.trim() } : {})} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40">
              {busy ? "…" : "Cambiar la fecha"}
            </button>
            <button disabled={busy} onClick={() => setPaso("ver")} className="text-xs px-4 py-2 rounded-lg border border-[#444]">Volver</button>
          </div>
        </div>
      )}
      {paso === "rechazar" && (
        <div className="mt-4">
          <label className="block text-xs mb-3">
            Por qué se rechaza. Lo lee quien la solicitó
            <textarea value={nota} maxLength={300} rows={2} onChange={(e) => setNota(e.target.value)} className="block mt-1 w-full bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm" />
          </label>
          <div className="flex gap-2">
            <button disabled={busy || nota.trim().length < 5} onClick={() => enviar("reject", { note: nota.trim() })} className="text-xs px-4 py-2 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40">
              {busy ? "…" : "Rechazar"}
            </button>
            <button disabled={busy} onClick={() => setPaso("ver")} className="text-xs px-4 py-2 rounded-lg border border-[#444]">Volver</button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-[#FF5A5A] mt-2">{error}</p>}
    </div>
  );
}
