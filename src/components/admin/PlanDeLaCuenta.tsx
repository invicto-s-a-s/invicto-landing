"use client";

import { useEffect, useState } from "react";
import ElegirPlan from "./ElegirPlan";
import TipoDeInstitucion from "./TipoDeInstitucion";
import { type PlanConcedible, SEGMENTOS, boton } from "./catalogo-tipos";
import { fecha, llamarPanel } from "./panel-api";
import { useDialogo } from "./Dialogo";

interface Fila {
  id: number; plan_key: string; plan_name: string; plan_segment: string; plan_kind: string;
  como: string; como_texto: string; otorgado_por: string | null; nota: string | null;
  desde: string | null; hasta: string | null; quitada_el: string | null;
}
interface Cuenta {
  cuenta: { id: number; username: string; role: string | null; institution_type: string | null; tipo: string } | null;
  segment: string;
  plan: {
    key: string; name: string; is_default: boolean; is_private: boolean; como: string; como_texto: string;
    escuela: string | null; otorgado_por: string | null; nota: string | null; desde: string | null; hasta: string | null;
  } | null;
  complementos: Fila[]; no_cuentan: Fila[]; historial: Fila[]; planes: PlanConcedible[];
}

const h3 = "font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-2";
/** Lo que se puede quitar desde aquí: lo asignado manualmente o aprobado en una solicitud. */
const SE_QUITA = ["a_mano", "solicitud"];

/**
 * El plan de una cuenta tal como lo ve la app: cuál tiene, de dónde le viene,
 * hasta cuándo, su historial, y cambiarlo. En las cuentas de club, también si
 * es escuela formativa o club. Lo resuelve el servidor con el mismo código que
 * la app, por lo que el panel y el teléfono dicen lo mismo.
 */
export default function PlanDeLaCuenta({ userId, onCambio }: { userId: number; onCambio?: () => void }) {
  const dialogo = useDialogo();
  const [data, setData] = useState<Cuenta | null>(null);
  const [fallo, setFallo] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    llamarPanel<Cuenta>(`/admin/plan-grants/users/${userId}`).then((r) => {
      if (r.ok && r.data) { setData(r.data); setFallo(null); } else setFallo(r.message ?? "No fue posible cargar el plan de esta cuenta.");
    });
  }, [userId, version]);

  const recargar = (mensaje?: string) => { if (mensaje) setAviso(mensaje); setVersion((v) => v + 1); onCambio?.(); };

  const quitar = async (soloPack?: Fila) => {
    const ok = await dialogo.confirmar(soloPack
      ? { titulo: `¿Quitarle ${soloPack.plan_name}?`, boton: "Quitar", peligro: true, texto: "Su plan sigue igual. Los alumnos que solo cabían con ese cupo pierden el PRO." }
      : { titulo: "¿Quitarle el plan asignado?", boton: "Quitar", peligro: true, texto: "Vuelve a su plan de entrada, y sus complementos se quitan con el plan." });
    if (!ok) return;
    const r = await llamarPanel(`/admin/plan-grants/users/${userId}${soloPack ? `/addons/${soloPack.plan_key}` : ""}`, "DELETE");
    if (!r.ok) { setAviso(r.message ?? "No fue posible quitar el plan."); return; }
    recargar(soloPack ? `Se quitó ${soloPack.plan_name}.` : "Se quitó el plan asignado. Ahora tiene el plan de entrada.");
  };

  if (fallo) return <p className="text-sm text-[#FF5A5A]">{fallo}</p>;
  if (!data) return <p className="text-xs text-on-surface-variant">Cargando el plan…</p>;
  const p = data.plan;

  return (
    <div className="grid gap-5">
      <section>
        <h3 className={h3}>Plan de hoy · perfil {SEGMENTOS[data.segment]?.toLowerCase() ?? data.segment}</h3>
        {p ? (
          <div className="bg-white/[0.035] rounded-lg px-3 py-2.5 grid gap-1">
            <p className="text-sm font-medium">
              {p.name}{p.is_private && <span className="text-[#AF8CFF]"> · privado</span>}{p.is_default && <span className="text-on-surface-variant"> · de entrada</span>}
            </p>
            <p className="text-xs text-on-surface-variant">
              {p.como_texto}{p.escuela ? ` (${p.escuela})` : ""}{p.otorgado_por ? ` · @${p.otorgado_por}` : ""}
              {p.desde ? ` · desde el ${fecha(p.desde)}` : ""}{p.como !== "entrada" ? ` · hasta: ${p.hasta ? fecha(p.hasta) : "sin fecha"}` : ""}
            </p>
            {p.nota && <p className="text-xs italic text-on-surface-variant">«{p.nota}»</p>}
            {SE_QUITA.includes(p.como) && (
              <div><button onClick={() => void quitar()} className={`${boton} border border-[#FF5A5A] text-[#FF5A5A] mt-1`}>Quitar el plan</button></div>
            )}
          </div>
        ) : <p className="text-xs text-on-surface-variant">Esta cuenta aún no tiene un perfil con plan.</p>}

        {data.complementos.map((c) => (
          <div key={c.id} className="flex items-center gap-2 text-xs mt-2">
            <span className="flex-1">+ {c.plan_name} · hasta: {c.hasta ? fecha(c.hasta) : "sin fecha"}</span>
            <button onClick={() => void quitar(c)} className="text-[#FF5A5A]">Quitar</button>
          </div>
        ))}
        {data.no_cuentan.length > 0 && (
          <p className="text-xs text-[#FFB020] mt-2">
            Tiene asignado {data.no_cuentan.map((f) => f.plan_name).join(", ")}, de otra escalera. No cuenta mientras la cuenta sea {SEGMENTOS[data.segment]?.toLowerCase()}.
          </p>
        )}
      </section>

      {aviso && <p className="text-xs text-neon">{aviso}</p>}

      {p && (
        <section>
          <h3 className={h3}>Cambiar el plan</h3>
          <ElegirPlan userId={userId} planes={data.planes} actual={p.key} onListo={(m) => recargar(m)} />
        </section>
      )}

      {data.cuenta?.role === "club" && (
        <section>
          <h3 className={h3}>Escuela o club</h3>
          <TipoDeInstitucion userId={userId} actual={data.cuenta.institution_type} planActual={p?.is_default ? null : p?.name ?? null} onCambio={() => recargar()} />
        </section>
      )}

      <section>
        <h3 className={h3}>Historial de planes</h3>
        {data.historial.length === 0 ? (
          <p className="text-xs text-on-surface-variant">Aún no tiene planes asignados: siempre ha tenido el plan de entrada.</p>
        ) : (
          <ul className="grid gap-1.5">
            {data.historial.map((f) => (
              <li key={f.id} className={`text-xs bg-white/[0.035] rounded-lg px-3 py-2 ${f.quitada_el ? "opacity-60" : ""}`}>
                <span className="text-sm">{f.plan_name}</span>
                <span className="text-on-surface-variant"> · {SEGMENTOS[f.plan_segment] ?? f.plan_segment} · {f.como_texto}{f.otorgado_por ? ` · @${f.otorgado_por}` : ""}</span>
                <span className="block text-on-surface-variant">
                  Desde el {fecha(f.desde)} · hasta: {f.hasta ? fecha(f.hasta) : "sin fecha"}{f.quitada_el ? ` · se quitó el ${fecha(f.quitada_el)}` : f.plan_segment === data.segment ? " · vigente" : " · vigente, pero no cuenta en esta escalera"}
                </span>
                {f.nota && <span className="block italic text-on-surface-variant">«{f.nota}»</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
