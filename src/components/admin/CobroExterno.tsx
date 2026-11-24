"use client";

import { useEffect, useState } from "react";
import { campo } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";

/** Lo que el servidor pide del cobro (`PagoDelPlanDTO` en invicto-back). Los días son de Bogotá. */
export interface Cobro { amount_cop?: number; method?: string; reference?: string; starts_on?: string; ends_on?: string }

interface Reglas { medios: string[]; obligatorio: string[] }

/** Los medios y a qué perfiles se les exige. `null` mientras carga, o con un servidor que aún no lo tiene. */
export function useReglasDelCobro(): Reglas | null {
  const [reglas, setReglas] = useState<Reglas | null>(null);
  useEffect(() => {
    llamarPanel<Reglas>("/admin/plan-grants/payment-rules").then((r) => { if (r.ok && r.data) setReglas(r.data); });
  }, []);
  return reglas;
}

const hoyEnBogota = () => new Date(Date.now() - 5 * 3_600_000).toISOString().slice(0, 10);

/** Lo que se envía, o nada si no se escribió nada: a un jugador o un ojeador se le puede dar el plan sin cobro. */
export function cobroParaEnviar(c: Cobro): Cobro | undefined {
  const limpio = Object.fromEntries(Object.entries(c).filter(([, v]) => v !== undefined && v !== ""));
  return Object.keys(limpio).length > 0 ? (limpio as Cobro) : undefined;
}

export const cobroInicial = (obligatorio: boolean): Cobro => (obligatorio ? { starts_on: hoyEnBogota() } : {});

/** Qué falta para poder aprobar, en las mismas palabras que el servidor. Vacío si está completo. */
export function queFaltaDelCobro(c: Cobro, obligatorio: boolean, conVencimiento: boolean): string[] {
  if (!obligatorio) return [];
  return [
    c.amount_cop === undefined ? "el monto" : "",
    !c.method ? "el medio" : "",
    !c.reference?.trim() ? "la referencia" : "",
    !c.starts_on ? "la fecha de inicio" : "",
    conVencimiento && !c.ends_on ? "el vencimiento" : "",
  ].filter(Boolean);
}

interface Props {
  cobro: Cobro;
  onCambiar: (c: Cobro) => void;
  medios: string[];
  obligatorio: boolean;
  /** Un complemento vence con su plan: no lleva fecha propia. */
  esPack?: boolean;
}

/**
 * El cobro externo que se validó: cuánto, por dónde, con qué comprobante y qué
 * fechas cubre. INVICTO no mueve la plata; esto queda en el registro y en la
 * auditoría. Una cortesía se registra en 0.
 */
export default function CobroExterno({ cobro, onCambiar, medios, obligatorio, esPack = false }: Props) {
  const poner = (d: Partial<Cobro>) => onCambiar({ ...cobro, ...d });
  const rotulo = "grid gap-1 text-xs text-on-surface-variant";
  return (
    <fieldset className="grid gap-2 border border-[#222] rounded-lg p-3">
      <legend className="text-xs text-on-surface-variant px-1">
        Cobro {obligatorio ? "(obligatorio)" : "(opcional)"}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        <label className={rotulo}>
          Monto en pesos (0 si es cortesía)
          <input className={campo} inputMode="numeric" value={cobro.amount_cop ?? ""} placeholder="199900"
            onChange={(e) => { const n = e.target.value.replace(/[^\d]/g, ""); poner({ amount_cop: n === "" ? undefined : Number(n) }); }} />
        </label>
        <label className={rotulo}>
          Medio
          <select className={campo} value={cobro.method ?? ""} onChange={(e) => poner({ method: e.target.value || undefined })}>
            <option value="">Elige…</option>
            {medios.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <label className={`${rotulo} sm:col-span-2`}>
          Referencia o número del comprobante
          <input className={campo} value={cobro.reference ?? ""} maxLength={120} onChange={(e) => poner({ reference: e.target.value || undefined })} />
        </label>
        <label className={rotulo}>
          Inicio
          <input className={campo} type="date" value={cobro.starts_on ?? ""} onChange={(e) => poner({ starts_on: e.target.value || undefined })} />
        </label>
        {!esPack && (
          <label className={rotulo}>
            Vencimiento (si lo pones, manda sobre los meses)
            <input className={campo} type="date" value={cobro.ends_on ?? ""} onChange={(e) => poner({ ends_on: e.target.value || undefined })} />
          </label>
        )}
      </div>
    </fieldset>
  );
}
