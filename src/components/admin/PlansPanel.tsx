"use client";

import { useState } from "react";
import PlanRequests from "./PlanRequests";
import PlanCatalog from "./PlanCatalog";
import PlanGates from "./PlanGates";
import InterruptorVitrina from "./InterruptorVitrina";
import AccountPicker from "./AccountPicker";
import PlanDeLaCuenta from "./PlanDeLaCuenta";

const VISTAS = [
  { value: "solicitudes", label: "Solicitudes" },
  { value: "asignar", label: "Asignar a mano" },
  { value: "catalogo", label: "Catálogo" },
  { value: "candados", label: "Candados" },
] as const;

type Vista = (typeof VISTAS)[number]["value"];

/**
 * Dar un plan a una cuenta sin que lo haya solicitado: un piloto, una
 * cortesía, una cuenta de demostración, un plan a la medida. Y quitarlo.
 *
 * La cuenta se busca por nombre y se elige de la lista; el número queda a la
 * vista y también se puede ingresar. Después se ve su plan de hoy y se elige el
 * nuevo **de la lista de su escalera** (antes se escribía la clave a mano).
 */
function AsignarAMano() {
  const [userId, setUserId] = useState("");
  const [elegida, setElegida] = useState<string | null>(null);
  const id = /^\d+$/.test(userId.trim()) ? Number(userId.trim()) : null;

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl grid gap-4">
      <AccountPicker
        onPick={(c) => {
          setUserId(String(c.id));
          setElegida(`${[c.name, c.last_name].filter(Boolean).join(" ") || c.username} · @${c.username}`);
        }}
      />
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Número de cuenta
        <input
          className="w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
          inputMode="numeric" value={userId} placeholder="64"
          onChange={(e) => { setUserId(e.target.value); setElegida(null); }}
        />
        {elegida && <span className="text-neon">{elegida}</span>}
      </label>

      {id !== null
        ? <PlanDeLaCuenta key={id} userId={id} />
        : <p className="text-xs text-on-surface-variant">Busca la cuenta o ingresa su número para ver su plan y asignarle otro.</p>}
    </div>
  );
}

/**
 * Los planes en el panel: confirmar lo que la gente solicita, dar uno
 * manualmente, editar y crear planes, y abrir o cerrar lo que depende del plan.
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
      {vista === "candados" && <><InterruptorVitrina /><PlanGates /></>}
    </div>
  );
}
