"use client";

import { useCallback, useEffect, useState } from "react";
import ResolverSolicitud, { type Respuesta } from "./ResolverSolicitud";

interface PlanRequest {
  id: number;
  user_id: number;
  username: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: string;
  plan_key: string;
  plan_name: string;
  /** `addon` es el Pack +25: no lleva meses, dura lo que dure el plan de la escuela. */
  plan_kind?: "plan" | "addon";
  /**
   * Solo en los packs pendientes: lo que hay que cobrar hoy, la parte que falta
   * hasta el corte del plan (Alexander, 2026-11-11). `null` si la escuela ya no
   * tiene plan de pago y no se puede aprobar.
   */
  cobro_hoy?: number | null;
  vence_con_el_plan?: string | null;
  period: "month" | "year";
  status: string;
  note: string | null;
  created_at: string;
  resolution_note: string | null;
}

const pesos = (n: number) => `$${n.toLocaleString("es-CO")}`;
const fecha = (iso: string) => new Date(iso).toLocaleDateString("es-CO");

const TABS = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "rejected", label: "Rechazadas" },
];

/** Lo que diga la API cuando algo no entra, o un texto por defecto. */
async function mensajeDe(res: Response | null, porDefecto: string): Promise<string | null> {
  if (res?.ok) return null;
  const body = await res?.json().catch(() => null);
  return typeof body?.message === "string" ? body.message : porDefecto;
}

/**
 * Las solicitudes de plan.
 *
 * Mientras no haya cobro por las tiendas, **aprobar aquí es lo que activa el
 * plan**: alguien lo pide en la app, se confirma con esa persona (por eso salen
 * el correo y el teléfono) y se aprueba por los meses que pagó.
 */
export default function PlanRequests({ onChange }: { onChange?: () => void }) {
  const [tab, setTab] = useState("pending");
  const [rows, setRows] = useState<PlanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // `load` no toca el estado antes de que conteste la red: el «cargando» lo
  // pone quien cambia de pestaña, no el efecto.
  const load = useCallback(() => {
    fetch(`/api/admin/admin/plan-grants/requests?status=${tab}&limit=100`)
      .then((r) => r.json())
      .then((body) => setRows(Array.isArray(body.data) ? body.data : []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  // Qué se escribe en cada caso (meses o el motivo) lo pide ResolverSolicitud.
  // Un pack no lleva meses; el servidor lo rechaza si la escuela no tiene plan
  // de pago o ya tiene uno, y ese motivo sale arriba.
  const resolver = async (req: PlanRequest, aprobar: boolean, payload: Respuesta) => {
    setBusy(req.id);
    setError(null);
    const res = await fetch(`/api/admin/admin/plan-grants/requests/${req.id}/${aprobar ? "approve" : "reject"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => null);
    setError(await mensajeDe(res, "No se pudo guardar. Inténtalo de nuevo."));
    setBusy(null);
    load();
    onChange?.();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { if (t.value !== tab) { setLoading(true); setTab(t.value); } }}
            className={`text-xs px-3 py-1.5 rounded-lg ${tab === t.value ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-[#FF5A5A] mb-3">{error}</p>}
      {loading && <p className="text-sm text-on-surface-variant">Cargando…</p>}
      {!loading && rows.length === 0 && (
        <p className="text-sm text-on-surface-variant">
          {tab === "pending" ? "No hay solicitudes esperando." : "Nada por aquí todavía."}
        </p>
      )}

      <div className="grid gap-3">
        {rows.map((req) => (
          <div key={req.id} className="admin-card border border-[#222] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="font-headline font-black italic text-lg leading-tight">{req.name || req.username}</p>
                <p className="text-xs text-on-surface-variant">@{req.username} · {req.role} · cuenta #{req.user_id}</p>
              </div>
              <p className="text-xs text-on-surface-variant whitespace-nowrap">
                {new Date(req.created_at).toLocaleDateString("es-CO")}
              </p>
            </div>

            <p className="text-sm mb-1">
              Pide <span className="text-neon font-medium">{req.plan_name}</span>{" "}
              <span className="text-on-surface-variant">
                ({req.plan_key} · {req.plan_kind === "addon"
                  ? "complemento, vence con su plan"
                  : req.period === "year" ? "anual" : "mensual"})
              </span>
            </p>
            <p className="text-xs text-on-surface-variant mb-3">
              {req.email}{req.phone ? ` · ${req.phone}` : ""}
            </p>

            {req.plan_kind === "addon" && req.status === "pending" && (
              <p className="text-sm mb-3">
                {typeof req.cobro_hoy === "number"
                  ? <>Cobrar hoy <span className="text-neon font-medium">{pesos(req.cobro_hoy)}</span>
                      {req.vence_con_el_plan ? `, la parte que falta hasta su corte del ${fecha(req.vence_con_el_plan)}.` : "."}</>
                  : <span className="text-[#FF5A5A]">La escuela ya no tiene un plan de pago: esta solicitud no se puede aprobar.</span>}
              </p>
            )}

            {req.note && <p className="text-xs text-on-surface-variant italic mb-3">«{req.note}»</p>}
            {req.resolution_note && <p className="text-xs text-on-surface-variant mb-3">Respuesta: {req.resolution_note}</p>}

            {req.status === "pending" && (
              <ResolverSolicitud
                username={req.username}
                planName={req.plan_name}
                esPack={req.plan_kind === "addon"}
                period={req.period}
                cobroHoy={req.cobro_hoy}
                busy={busy === req.id}
                onResolver={(aprobar, payload) => resolver(req, aprobar, payload)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
