"use client";

import { useState } from "react";
import { llamarPanel } from "./panel-api";

/**
 * Derecho de acceso (tarjeta 15): las evaluaciones de ojeadores que hay de una
 * persona, **sin quién las hizo**. Se descarga para enviársela en privado.
 */
export default function DerechoDeAcceso() {
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  const descargar = async () => {
    setBusy(true);
    setAviso(null);
    const r = await llamarPanel<{ nombre: string; evaluaciones: unknown[] }>(`/admin/users/${Number(id)}/evaluations-export`);
    setBusy(false);
    if (!r.ok || !r.data) { setAviso(r.message ?? "No se pudo generar."); return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(r.data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `evaluaciones-${Number(id)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setAviso(`${r.data.nombre}: ${r.data.evaluaciones.length} ${r.data.evaluaciones.length === 1 ? "evaluación" : "evaluaciones"}.`);
  };

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl">
      <p className="text-sm text-on-surface-variant mb-4">
        Descarga lo que los ojeadores han escrito de una persona, sin decir quién. Comprueba antes que quien lo solicita es el
        titular o su acudiente, y envíalo en privado.
      </p>
      <label className="block text-xs mb-3">
        Número de la cuenta
        <input value={id} inputMode="numeric" onChange={(e) => setId(e.target.value.replace(/\D/g, ""))} className="block mt-1 w-40 bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm" />
      </label>
      <button disabled={busy || !id} onClick={descargar} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40">
        {busy ? "…" : "Descargar"}
      </button>
      {aviso && <p className="text-xs text-on-surface-variant mt-3">{aviso}</p>}
    </div>
  );
}
