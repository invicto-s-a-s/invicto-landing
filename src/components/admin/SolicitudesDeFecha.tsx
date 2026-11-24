"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import TarjetaDeFecha from "./TarjetaDeFecha";
import type { SolicitudDeFecha } from "./fechas-tipos";

const ESTADOS = [["pendiente", "Pendientes"], ["aprobada", "Aprobadas"], ["rechazada", "Rechazadas"]] as const;

/**
 * Fechas de nacimiento mal puestas. El documento se pide **en privado**: aquí no
 * se sube nada. La ley da 15 días hábiles, y lo que está por vencer va primero.
 */
export default function SolicitudesDeFecha() {
  const [estado, setEstado] = useState<(typeof ESTADOS)[number][0]>("pendiente");
  const [datos, setDatos] = useState<{ items: SolicitudDeFecha[]; vencidas: number; por_vencer: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ items: SolicitudDeFecha[]; vencidas: number; por_vencer: number }>(`/admin/birth-date-requests?status=${estado}`).then((r) => {
      if (!r.ok || !r.data) { setError(r.message ?? "No se pudieron cargar las solicitudes."); return; }
      setError(null);
      setDatos(r.data);
    }), [estado]);

  useEffect(() => { void cargar(); }, [cargar]);

  return (
    <div>
      <p className="text-sm text-on-surface-variant mb-4">
        Solicita el documento por correo privado antes de decidir; no se sube a la app. Se responde en máximo 15 días hábiles. La
        categoría se le propone a la escuela y nadie la cambia sola.
      </p>
      {datos && datos.vencidas + datos.por_vencer > 0 && (
        <p className="admin-card border border-[#7A2E2E] rounded-xl p-4 text-sm mb-4">
          {datos.vencidas > 0 && `Vencidas sin responder: ${datos.vencidas}. `}
          {datos.por_vencer > 0 && `Por vencer en 3 días hábiles o menos: ${datos.por_vencer}.`}
        </p>
      )}
      <div className="flex flex-wrap gap-2 mb-4">
        {ESTADOS.map(([value, label]) => (
          <button
            key={value}
            onClick={() => { if (value !== estado) { setDatos(null); setEstado(value); } }}
            className={`text-xs px-3 py-1.5 rounded-lg ${estado === value ? "bg-[#333] text-white" : "bg-[#1A1A1A] text-on-surface-variant"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-[#FF5A5A] mb-3">{error}</p>}
      {!error && !datos && <p className="text-sm text-on-surface-variant">Cargando…</p>}
      {datos?.items.length === 0 && <p className="text-sm text-on-surface-variant">No hay ninguna.</p>}
      <div className="grid gap-3">
        {datos?.items.map((s) => <TarjetaDeFecha key={s.id} s={s} onCambio={cargar} />)}
      </div>
    </div>
  );
}
