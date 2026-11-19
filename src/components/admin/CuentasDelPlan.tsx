"use client";

import { useEffect, useState } from "react";
import ElegirPlan from "./ElegirPlan";
import { type Plan, type PlanConcedible, SEGMENTOS, boton } from "./catalogo-tipos";
import { fecha, llamarPanel } from "./panel-api";

interface Fila {
  cuenta: { id: number; username?: string; name?: string | null; last_name?: string | null; tipo?: string };
  como: string; como_texto: string; escuela: string | null;
  otorgado_por: string | null; nota: string | null; desde: string | null; hasta: string | null;
}
interface Pagina { total: number; listadas: number; resto: number; page: number; limit: number; items: Fila[] }

const POR_PAGINA = 25;
/** Lo que se puede quitar desde la lista: lo asignado manualmente o aprobado en una solicitud. */
const SE_QUITA = ["a_mano", "solicitud"];

/** El selector de planes de una cuenta, con los planes de su escalera que manda el servidor. */
function CambiarPlan({ userId, actual, onListo }: { userId: number; actual: string; onListo: (m: string) => void }) {
  const [planes, setPlanes] = useState<PlanConcedible[] | null>(null);
  useEffect(() => {
    llamarPanel<{ planes: PlanConcedible[] }>(`/admin/plan-grants/users/${userId}`).then((r) => setPlanes(r.data?.planes ?? []));
  }, [userId]);
  if (!planes) return <p className="text-xs text-on-surface-variant">Cargando sus planes…</p>;
  return <ElegirPlan userId={userId} planes={planes} actual={actual} onListo={onListo} />;
}

type Props = { plan: Plan; onAbrirCuenta: (id: number) => void; onCambio: () => void };

/**
 * Las cuentas que tienen un plan hoy, como las ve la app: quién, de qué tipo,
 * cómo le llegó, desde cuándo y hasta cuándo. Los alumnos que tienen PRO por su
 * escuela salen aquí. El plan de entrada lo tiene todo el que no tiene otro, por
 * lo que esas cuentas se cuentan y no se listan.
 */
export default function CuentasDelPlan({ plan, onAbrirCuenta, onCambio }: Props) {
  const [pagina, setPagina] = useState(1);
  const [data, setData] = useState<Pagina | null>(null);
  const [version, setVersion] = useState(0);
  const [cambiando, setCambiando] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    llamarPanel<Pagina>(`/admin/plans/${plan.key}/accounts?page=${pagina}&limit=${POR_PAGINA}`)
      .then((r) => setData(r.data ?? { total: 0, listadas: 0, resto: 0, page: 1, limit: POR_PAGINA, items: [] }));
  }, [plan.key, pagina, version]);

  const listo = (m: string) => { setAviso(m); setCambiando(null); setVersion((v) => v + 1); onCambio(); };

  const quitar = async (f: Fila) => {
    const quien = f.cuenta.username ? `@${f.cuenta.username}` : `la cuenta #${f.cuenta.id}`;
    const esPack = plan.kind === "addon";
    if (!confirm(esPack
      ? `¿Quitarle ${plan.name} a ${quien}? Su plan sigue igual.`
      : `¿Quitarle ${plan.name} a ${quien}? Vuelve a su plan de entrada, y sus complementos se quitan con el plan.`)) return;
    const r = await llamarPanel(`/admin/plan-grants/users/${f.cuenta.id}${esPack ? `/addons/${plan.key}` : ""}`, "DELETE");
    if (!r.ok) { setAviso(r.message ?? "No fue posible quitar el plan."); return; }
    listo(`Se le quitó ${plan.name} a ${quien}.`);
  };

  if (!data) return <p className="text-xs text-on-surface-variant mt-3">Cargando las cuentas…</p>;
  const paginas = Math.max(1, Math.ceil(data.listadas / POR_PAGINA));

  return (
    <div className="mt-4 border-t border-[#1C1C1C] pt-3 grid gap-2">
      <p className="text-xs text-on-surface-variant">
        {data.total === 1 ? "1 cuenta tiene este plan hoy." : `${data.total} cuentas tienen este plan hoy.`}
        {data.resto > 0 && ` ${data.resto === 1 ? "Una es" : `${data.resto} son`} el resto de cuentas de ${SEGMENTOS[plan.segment]?.toLowerCase() ?? "su perfil"}, que lo tienen por no tener otro plan.`}
        {data.resto > 0 && data.listadas > 0 && ` Abajo están las ${data.listadas} que lo tienen asignado.`}
      </p>
      {aviso && <p className="text-xs text-neon">{aviso}</p>}
      {data.listadas === 0 && data.resto === 0 && (
        <p className="text-xs text-on-surface-variant">Aún no hay cuentas con este plan. Puedes asignarlo desde «Asignación manual» o desde la ficha de una cuenta.</p>
      )}

      <ul className="grid gap-1.5">
        {data.items.map((f) => {
          const nombre = [f.cuenta.name, f.cuenta.last_name].filter(Boolean).join(" ") || f.cuenta.username || `#${f.cuenta.id}`;
          return (
            <li key={f.cuenta.id} className="bg-[#141414] rounded-lg px-3 py-2 text-xs grid gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex-1 min-w-0">
                  <span className="text-sm">{nombre}</span>
                  <span className="text-on-surface-variant"> · @{f.cuenta.username} · {f.cuenta.tipo ?? "Sin tipo"} · #{f.cuenta.id}</span>
                </span>
                <button onClick={() => onAbrirCuenta(f.cuenta.id)} className="px-2.5 py-1 rounded-lg bg-[#1A1A1A]">Ver ficha</button>
                <button onClick={() => setCambiando(cambiando === f.cuenta.id ? null : f.cuenta.id)} className="px-2.5 py-1 rounded-lg bg-[#1A1A1A]">Cambiar plan</button>
                {SE_QUITA.includes(f.como) && (
                  <button onClick={() => void quitar(f)} className="px-2.5 py-1 rounded-lg border border-[#FF5A5A] text-[#FF5A5A]">Quitar el plan</button>
                )}
              </div>
              <span className="text-on-surface-variant">
                {f.como_texto}{f.escuela ? ` (${f.escuela})` : ""}{f.otorgado_por ? ` · @${f.otorgado_por}` : ""}
                {f.desde ? ` · desde el ${fecha(f.desde)}` : ""} · hasta: {f.hasta ? fecha(f.hasta) : f.como === "escuela" ? "mientras siga en la plantilla" : "sin fecha"}
              </span>
              {f.nota && <span className="italic text-on-surface-variant">«{f.nota}»</span>}
              {cambiando === f.cuenta.id && <CambiarPlan userId={f.cuenta.id} actual={plan.key} onListo={listo} />}
            </li>
          );
        })}
      </ul>

      {paginas > 1 && (
        <div className="flex items-center gap-2 text-xs">
          <button className={`${boton} bg-[#1A1A1A]`} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
          <span className="text-on-surface-variant">Página {pagina} de {paginas}</span>
          <button className={`${boton} bg-[#1A1A1A]`} disabled={pagina >= paginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
        </div>
      )}
    </div>
  );
}
