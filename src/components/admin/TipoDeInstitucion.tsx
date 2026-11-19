"use client";

import { useState } from "react";
import ElegirPlan from "./ElegirPlan";
import { type PlanConcedible, boton, campo } from "./catalogo-tipos";
import { TIPOS_DE_INSTITUCION, llamarPanel } from "./panel-api";

type Cambio = {
  cambia_de_escalera: boolean; escalera_ahora: string;
  deja_de_contar: { key: string; name: string } | null; planes: PlanConcedible[];
};

type Props = { userId: number; actual: string | null; planActual: string | null; onCambio: () => void };

const ESCALERA: Record<string, string> = { school: "escuela", club: "club" };
const tipoDe = (v: string | null) => TIPOS_DE_INSTITUCION.find((t) => t.value === v) ?? null;

/**
 * Escuela formativa o club, desde la ficha de la cuenta.
 *
 * Antes era una migración (Barranquillita FC, 2026-11-18). Cambiarlo **mueve la
 * cuenta de escalera de planes**: lo asignado en la otra deja de contar. Por eso
 * se confirma explicando eso, y en el mismo paso se ofrece darle un plan de la
 * escalera nueva.
 */
export default function TipoDeInstitucion({ userId, actual, planActual, onCambio }: Props) {
  const [nuevo, setNuevo] = useState(actual ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hecho, setHecho] = useState<Cambio | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const de = tipoDe(actual), a = tipoDe(nuevo);
  const cambiaDeEscalera = !!a && (de?.escalera ?? "club") !== a.escalera;

  const confirmar = async () => {
    setBusy(true);
    setError(null);
    const r = await llamarPanel<Cambio>(`/admin/plan-grants/users/${userId}/institution-type`, "PUT", { institution_type: nuevo });
    setBusy(false);
    if (!r.ok || !r.data) { setError(r.message ?? "No fue posible cambiar el tipo."); return; }
    setHecho(r.data);
    onCambio();
  };

  if (hecho) {
    return (
      <div className="grid gap-3">
        <p className="text-sm text-neon">
          Listo: ahora es {a?.label.toLowerCase()}.
          {hecho.cambia_de_escalera && ` Ya ve los planes de ${ESCALERA[hecho.escalera_ahora]}.`}
        </p>
        {hecho.cambia_de_escalera && !aviso && (
          <>
            <p className="text-xs text-on-surface-variant">
              {hecho.deja_de_contar
                ? `Su plan ${hecho.deja_de_contar.name} dejó de contar. Mientras no le asignes otro, tiene el plan de entrada.`
                : "Mientras no le asignes un plan, tiene el plan de entrada."}
            </p>
            <ElegirPlan userId={userId} planes={hecho.planes} textoDelBoton="Asignar" onListo={(m) => { setAviso(m); onCambio(); }} />
          </>
        )}
        {aviso && <p className="text-xs text-neon">{aviso}</p>}
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Tipo de institución
        <select className={campo} value={nuevo} onChange={(e) => { setNuevo(e.target.value); setError(null); }}>
          {!actual && <option value="">Sin tipo</option>}
          {TIPOS_DE_INSTITUCION.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </label>

      {a && nuevo !== actual && (
        <div className="grid gap-2 border border-[#333] rounded-lg p-3">
          {cambiaDeEscalera ? (
            <p className="text-xs">
              La cuenta pasará a los planes de <b>{ESCALERA[a.escalera]}</b>.{" "}
              {planActual ? `Su plan actual (${planActual}) dejará de contar` : "Lo que tenga asignado de la otra escalera dejará de contar"}
              {" "}y la app le aplicará el plan de entrada hasta que le asignes uno nuevo. Lo asignado queda guardado y vuelve a contar si deshaces el cambio.
              {" "}Su plantilla, su código, sus convocatorias y sus partidos no cambian.
            </p>
          ) : (
            <p className="text-xs">Sigue en los planes de club: su plan no cambia.</p>
          )}
          {error && <p className="text-xs text-[#FF5A5A]">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setNuevo(actual ?? "")} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
            <button onClick={() => void confirmar()} disabled={busy} className={`${boton} bg-neon text-background font-medium`}>
              {busy ? "…" : `Cambiar a ${a.label.toLowerCase()}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
