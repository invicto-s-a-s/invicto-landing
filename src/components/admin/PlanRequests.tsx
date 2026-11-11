"use client";

import { useCallback, useEffect, useState } from "react";

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
  period: "month" | "year";
  status: string;
  note: string | null;
  created_at: string;
  resolution_note: string | null;
}

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

  const resolver = async (req: PlanRequest, aprobar: boolean) => {
    let payload: Record<string, unknown>;
    if (aprobar) {
      const porDefecto = req.period === "year" ? "12" : "1";
      const meses = prompt(`¿Por cuántos meses se le da el plan ${req.plan_name} a @${req.username}?`, porDefecto);
      if (meses === null) return;
      const n = Number(meses);
      if (!Number.isInteger(n) || n < 1 || n > 36) { setError("Los meses van de 1 a 36."); return; }
      payload = { months: n };
    } else {
      // El motivo lo lee quien pidió el plan: sin él no sabe qué pasó.
      const note = prompt(`¿Por qué se rechaza la solicitud de @${req.username}?`);
      if (!note?.trim()) return;
      payload = { note: note.trim() };
    }

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
              <span className="text-on-surface-variant">({req.plan_key} · {req.period === "year" ? "anual" : "mensual"})</span>
            </p>
            <p className="text-xs text-on-surface-variant mb-3">
              {req.email}{req.phone ? ` · ${req.phone}` : ""}
            </p>

            {req.note && <p className="text-xs text-on-surface-variant italic mb-3">«{req.note}»</p>}
            {req.resolution_note && <p className="text-xs text-on-surface-variant mb-3">Respuesta: {req.resolution_note}</p>}

            {req.status === "pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => resolver(req, false)}
                  disabled={busy === req.id}
                  className="text-xs px-4 py-2 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => resolver(req, true)}
                  disabled={busy === req.id}
                  className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40"
                >
                  {busy === req.id ? "…" : "Aprobar"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
