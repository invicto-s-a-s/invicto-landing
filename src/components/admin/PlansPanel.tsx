"use client";

import { useState } from "react";
import PlanRequests from "./PlanRequests";
import PlanCatalog from "./PlanCatalog";

const VISTAS = [
  { value: "solicitudes", label: "Solicitudes" },
  { value: "asignar", label: "Asignar a mano" },
  { value: "catalogo", label: "Catálogo" },
] as const;

type Vista = (typeof VISTAS)[number]["value"];

/**
 * Dar un plan a una cuenta sin que lo haya pedido: un piloto, una cortesía,
 * una cuenta de demostración. Y quitarlo.
 *
 * Va por el número de cuenta, que sale en la pestaña Usuarios y en cada
 * solicitud. La clave del plan es la del catálogo (`school_semilla`).
 */
function AsignarAMano() {
  const [userId, setUserId] = useState("");
  const [planKey, setPlanKey] = useState("");
  const [months, setMonths] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const llamar = async (method: "PUT" | "DELETE") => {
    if (!/^\d+$/.test(userId.trim())) { setMsg({ ok: false, text: "Escribe el número de la cuenta." }); return; }
    if (method === "PUT" && !planKey.trim()) { setMsg({ ok: false, text: "Escribe la clave del plan." }); return; }
    if (method === "DELETE" && !confirm(`¿Quitarle el plan a la cuenta #${userId}? Vuelve a su plan de entrada.`)) return;

    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/admin/plan-grants/users/${userId.trim()}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: method === "PUT"
        ? JSON.stringify({
            plan_key: planKey.trim(),
            ...(months.trim() ? { months: Number(months.trim()) } : {}),
            ...(note.trim() ? { note: note.trim() } : {}),
          })
        : undefined,
    }).catch(() => null);
    const body = await res?.json().catch(() => null);
    setBusy(false);

    if (!res?.ok) {
      setMsg({ ok: false, text: typeof body?.message === "string" ? body.message : "No se pudo guardar." });
      return;
    }
    setMsg({
      ok: true,
      text: method === "DELETE"
        ? "Plan quitado."
        : `Concedido ${body?.data?.concedido}${body?.data?.hasta ? ` hasta el ${new Date(body.data.hasta).toLocaleDateString("es-CO")}` : ", sin fecha de fin"}.`,
    });
  };

  const campo = "w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm";

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl grid gap-3">
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Número de cuenta
        <input className={campo} inputMode="numeric" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="64" />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Clave del plan (tiene que ser del tipo de esa cuenta)
        <input className={campo} value={planKey} onChange={(e) => setPlanKey(e.target.value)} placeholder="school_semilla" />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Meses — vacío es sin fecha de fin
        <input className={campo} inputMode="numeric" value={months} onChange={(e) => setMonths(e.target.value)} placeholder="3" />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Por qué (queda en la auditoría)
        <input className={campo} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Piloto con la escuela" maxLength={200} />
      </label>

      {msg && <p className={`text-sm ${msg.ok ? "text-neon" : "text-[#FF5A5A]"}`}>{msg.text}</p>}

      <div className="flex gap-2">
        <button onClick={() => llamar("DELETE")} disabled={busy} className="text-xs px-4 py-2 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40">
          Quitar el plan
        </button>
        <button onClick={() => llamar("PUT")} disabled={busy} className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40">
          {busy ? "…" : "Asignar"}
        </button>
      </div>
    </div>
  );
}

/**
 * Los planes en el panel: confirmar lo que la gente pide, dar uno a mano y
 * editar el catálogo.
 *
 * Mientras no haya cobro por las tiendas, **esta pestaña es el cobro**: la app
 * deja la solicitud y aquí se confirma.
 */
export default function PlansPanel() {
  const [vista, setVista] = useState<Vista>("solicitudes");

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {VISTAS.map((v) => (
          <button
            key={v.value}
            onClick={() => setVista(v.value)}
            className={`text-sm px-4 py-2 rounded-lg ${vista === v.value ? "bg-neon text-background font-medium" : "bg-[#161616] text-on-surface-variant"}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {vista === "solicitudes" && <PlanRequests />}
      {vista === "asignar" && <AsignarAMano />}
      {vista === "catalogo" && <PlanCatalog />}
    </div>
  );
}
