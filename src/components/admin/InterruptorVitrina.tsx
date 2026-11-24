"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";

const RUTA = "/admin/parameters/vitrina.activa";

/** Como en `invicto-back` (`vitrinaEncendida`): solo un «false» la apaga. */
const encendida = (valor: string) => valor.trim().toLowerCase() !== "false";

/**
 * Encender y apagar la Vitrina Élite (`vitrina.activa`).
 *
 * Nace encendida. Apagada, la lista de destacados sale vacía, nadie entra ni
 * recibe el aviso, y la app esconde la tarjeta del inicio y deja de prometer
 * salir destacado; el módulo de Premium sigue. Se nota en la petición
 * siguiente: guardar invalida la caché del servidor. En la app, en lo que
 * tarda en volver a pedir el plan (menos de un minuto).
 */
export default function InterruptorVitrina() {
  const [activa, setActiva] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Con `.then`, como `PlanGates`: el estado cambia cuando responde el servidor, no dentro del efecto.
  const cargar = useCallback(() =>
    llamarPanel<{ value: string }>(RUTA).then((r) => {
      if (!r.ok || typeof r.data?.value !== "string") {
        setError(r.message ?? "No se pudo leer si la Vitrina Élite está encendida.");
        return;
      }
      setActiva(encendida(r.data.value));
    }), []);

  useEffect(() => { void cargar(); }, [cargar]);

  const cambiar = async () => {
    if (busy || activa === null) return;
    const frase = activa
      ? "¿Apagar la Vitrina Élite?\n\nLa lista de destacados queda vacía, nadie nuevo entra ni recibe el aviso, y la app deja de mostrar la tarjeta del inicio. El módulo de Premium sigue."
      : "¿Encender la Vitrina Élite?\n\nLos jugadores que cumplan el Reto Vitrina vuelven a salir destacados.";
    if (!confirm(frase)) return;
    setBusy(true);
    setError(null);
    const r = await llamarPanel(RUTA, "PUT", { value: activa ? "false" : "true" });
    if (!r.ok) setError(r.message ?? "No se pudo guardar el cambio.");
    await cargar();
    setBusy(false);
  };

  if (activa === null && !error) return <p className="text-sm text-on-surface-variant">Cargando…</p>;

  return (
    <div className="admin-card border border-[#222] rounded-xl p-4 flex flex-wrap items-start gap-3 justify-between max-w-3xl mb-6">
      <div className="min-w-0 flex-1 basis-64">
        <p className="text-sm font-medium">Vitrina Élite</p>
        <p className="text-xs text-on-surface-variant mt-1">
          Los jugadores que cumplen el Reto Vitrina salen en la lista que ven ojeadores verificados y clubes. Un menor, solo
          con la autorización de su acudiente. Apagada, la lista queda vacía; el módulo de Premium sigue.
        </p>
        <p className="text-[11px] text-on-surface-variant/60 mt-1 font-mono">vitrina.activa</p>
        {error && <p className="text-xs text-[#FF5A5A] mt-1">{error}</p>}
      </div>
      {activa !== null && (
        <button
          onClick={cambiar}
          disabled={busy}
          className={`text-xs px-4 py-2 rounded-lg shrink-0 disabled:opacity-40 ${activa ? "bg-neon text-background font-medium" : "border border-[#444] text-on-surface-variant"}`}
        >
          {busy ? "…" : activa ? "Encendida" : "Apagada"}
        </button>
      )}
    </div>
  );
}
