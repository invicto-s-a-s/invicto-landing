"use client";

import { useState } from "react";
import { type PlanConcedible, boton, campo } from "./catalogo-tipos";
import CobroExterno, { type Cobro, cobroInicial, cobroParaEnviar, queFaltaDelCobro, useReglasDelCobro } from "./CobroExterno";
import { llamarPanel } from "./panel-api";

type Props = {
  userId: number;
  /** Los planes de la escalera de esa cuenta, como los manda el servidor. */
  planes: PlanConcedible[];
  /** El plan que tiene hoy, para no ofrecerlo como si fuera un cambio. */
  actual?: string | null;
  textoDelBoton?: string;
  onListo: (mensaje: string) => void;
};

const etiqueta = (p: PlanConcedible) =>
  `${p.name}${p.is_private ? " · privado" : ""}${p.kind === "addon" ? " · complemento" : ""}${p.is_default ? " · de entrada" : ""}`;

/**
 * Darle un plan a una cuenta, eligiéndolo de la lista de su escalera.
 *
 * Antes se escribía la clave a mano (`school_semilla`) y una errata era un 400
 * o, peor, el plan de otra cuenta. Ahora solo salen los que el servidor acepta
 * para esa cuenta: los de su escalera, encendidos, públicos y privados.
 */
export default function ElegirPlan({ userId, planes, actual, textoDelBoton = "Asignar", onListo }: Props) {
  const [planKey, setPlanKey] = useState("");
  const [meses, setMeses] = useState("");
  const [nota, setNota] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cobro, setCobro] = useState<Cobro | null>(null);
  const [prueba, setPrueba] = useState(false);
  const reglas = useReglasDelCobro();
  const elegido = planes.find((p) => p.key === planKey) ?? null;
  const esPack = elegido?.kind === "addon";
  const deEscuela = elegido?.segment === "school" && !esPack && !elegido.is_default;
  const esPrueba = prueba && deEscuela;
  const obligatorio = !!reglas && !!elegido && !elegido.is_default && !esPrueba && reglas.obligatorio.includes(elegido.segment ?? "");
  const elCobro = cobro ?? cobroInicial(obligatorio);
  const falta = reglas ? queFaltaDelCobro(elCobro, obligatorio, !esPack && !meses.trim()) : [];

  const asignar = async () => {
    if (!elegido) return;
    setBusy(true);
    setError(null);
    const payment = reglas && !esPrueba && !elegido.is_default ? cobroParaEnviar(elCobro) : undefined;
    const r = await llamarPanel<{ concedido: string; hasta: string | null }>(
      `/admin/plan-grants/users/${userId}`, "PUT", {
        plan_key: elegido.key,
        ...(meses.trim() && !esPack && !esPrueba ? { months: Number(meses.trim()) } : {}),
        ...(payment ? { payment } : {}),
        ...(esPrueba ? { trial: true } : {}),
        ...(nota.trim() ? { note: nota.trim() } : {}),
      });
    setBusy(false);
    if (!r.ok) { setError(r.message ?? "No fue posible asignar el plan."); return; }
    setPlanKey(""); setMeses(""); setNota(""); setCobro(null); setPrueba(false);
    onListo(`Se asignó ${elegido.name}${r.data?.hasta ? ` hasta el ${new Date(r.data.hasta).toLocaleDateString("es-CO")}` : ", sin fecha de fin"}.`);
  };

  if (planes.length === 0) return <p className="text-xs text-on-surface-variant">Aún no hay planes encendidos para este tipo de cuenta.</p>;

  return (
    <div className="grid gap-2">
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Plan
        <select className={campo} value={planKey} onChange={(e) => setPlanKey(e.target.value)}>
          <option value="">Elige un plan…</option>
          {planes.map((p) => (
            <option key={p.key} value={p.key} disabled={p.key === actual}>
              {etiqueta(p)}{p.key === actual ? " (el que tiene)" : ""}
            </option>
          ))}
        </select>
      </label>
      {esPack ? (
        <p className="text-xs text-on-surface-variant">
          Un complemento vence el mismo día que el plan de la escuela y se renueva con él. Solo se puede asignar si la escuela tiene un plan de pago.
        </p>
      ) : !esPrueba && (
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Meses (si lo dejas vacío, {obligatorio ? "pon el vencimiento abajo" : "no tiene fecha de fin"})
          <input className={campo} inputMode="numeric" value={meses} onChange={(e) => setMeses(e.target.value.replace(/[^\d]/g, ""))} placeholder="12" />
        </label>
      )}
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Motivo (queda en la auditoría)
        <input className={campo} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Plan acordado con la escuela" maxLength={200} />
      </label>
      {elegido && !elegido.is_default && !esPack && (
        <p className="text-xs text-[#FFB020]">Reemplaza el plan que la cuenta tenga asignado manualmente.</p>
      )}
      {deEscuela && reglas && (
        <label className="flex gap-2 items-center text-xs text-on-surface-variant">
          <input type="checkbox" checked={prueba} onChange={(e) => setPrueba(e.target.checked)} />
          Es una prueba: sin cobro y sin fecha. El plazo corre desde que la escuela la usa, si está encendido en Ajustes.
        </label>
      )}
      {elegido && !elegido.is_default && reglas && !esPrueba && (
        <CobroExterno cobro={elCobro} onCambiar={setCobro} medios={reglas.medios} obligatorio={obligatorio} esPack={esPack} />
      )}
      {falta.length > 0 && <p className="text-xs text-[#FFB020]">Falta registrar: {falta.join(", ")}.</p>}
      {error && <p className="text-xs text-[#FF5A5A]">{error}</p>}
      <div>
        <button onClick={() => void asignar()} disabled={busy || !elegido || falta.length > 0} className={`${boton} bg-neon text-background font-medium`}>
          {busy ? "…" : elegido ? `${textoDelBoton} ${elegido.name}` : textoDelBoton}
        </button>
      </div>
    </div>
  );
}
