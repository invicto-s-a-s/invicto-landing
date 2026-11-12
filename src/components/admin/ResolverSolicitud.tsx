"use client";

import { useState } from "react";

export type Respuesta = { months: number } | { note: string } | Record<string, never>;

interface Props {
  username: string;
  planName: string;
  esPack: boolean;
  period: "month" | "year";
  /** Solo en los packs: lo que hay que cobrar hoy. `null`: no se puede aprobar. */
  cobroHoy?: number | null;
  busy: boolean;
  onResolver: (aprobar: boolean, payload: Respuesta) => void;
}

const pesos = (n: number) => `$${n.toLocaleString("es-CO")}`;
const MESES_RAPIDOS = [1, 3, 6, 12];
/** Lo que manda el servidor al aprobar (push `plan_approved` y `pack_approved`). */
const AVISO_PLAN = "Tu nuevo plan ya está activo. Entra y descubre todo lo que tienes ahora.";
const AVISO_PACK = "Tu Pack +25 ya está activo: tienes 25 cupos más para llevar el plan PRO a tus alumnos.";

/**
 * Aprobar o rechazar una solicitud, dentro de la tarjeta.
 *
 * Antes eran `prompt()` del navegador, y el de aprobar (que pide **meses**) se
 * veía igual que el de rechazar (que pide **un texto para la persona**).
 * Alexander escribió una felicitación donde iban los meses (2026-11-12). Aquí
 * cada caso dice qué se escribe, y el de aprobar deja claro que el aviso a la
 * persona sale solo.
 */
export default function ResolverSolicitud({ username, planName, esPack, period, cobroHoy, busy, onResolver }: Props) {
  const [modo, setModo] = useState<"aprobar" | "rechazar" | null>(null);
  const [meses, setMeses] = useState(period === "year" ? 12 : 1);
  const [motivo, setMotivo] = useState("");

  const boton = "text-xs px-4 py-2 rounded-lg disabled:opacity-40";
  const mesesValidos = Number.isInteger(meses) && meses >= 1 && meses <= 36;

  if (modo === null) {
    return (
      <div className="flex gap-2">
        <button onClick={() => setModo("rechazar")} disabled={busy} className={`${boton} border border-[#FF5A5A] text-[#FF5A5A]`}>
          Rechazar
        </button>
        <button
          onClick={() => setModo("aprobar")}
          disabled={busy || (esPack && typeof cobroHoy !== "number")}
          className={`${boton} bg-neon text-background font-medium`}
        >
          Aprobar
        </button>
      </div>
    );
  }

  const cancelar = (
    <button onClick={() => setModo(null)} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>
      Cancelar
    </button>
  );

  if (modo === "rechazar") {
    return (
      <div className="grid gap-2 border-t border-[#222] pt-3">
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Qué va a leer @{username} en la app, tal cual (por qué no se activó y qué puede hacer)
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            maxLength={300}
            rows={3}
            autoFocus
            placeholder="Por ejemplo: No pudimos confirmar el pago. Escríbenos a soporte@invictoapp.com.co y lo revisamos contigo."
            className="w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-on-surface"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {cancelar}
          <button
            onClick={() => onResolver(false, { note: motivo.trim() })}
            disabled={busy || !motivo.trim()}
            className={`${boton} bg-[#FF5A5A] text-background font-medium`}
          >
            {busy ? "…" : "Rechazar y enviarle el motivo"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 border-t border-[#222] pt-3">
      {esPack ? (
        <p className="text-xs text-on-surface-variant">
          El pack no lleva meses: vence el mismo día que el plan de la escuela y se renueva con él.
          {typeof cobroHoy === "number" && <> Cobrar hoy <span className="text-neon">{pesos(cobroHoy)}</span>.</>}
        </p>
      ) : (
        <div className="grid gap-2">
          <p className="text-xs text-on-surface-variant">¿Por cuántos meses se activa {planName}? Solo el número, de 1 a 36.</p>
          <div className="flex flex-wrap items-center gap-2">
            {MESES_RAPIDOS.map((m) => (
              <button
                key={m}
                onClick={() => setMeses(m)}
                className={`text-xs px-3 py-1.5 rounded-lg ${meses === m ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`}
              >
                {m} {m === 1 ? "mes" : "meses"}
              </button>
            ))}
            <input
              type="number" min={1} max={36} inputMode="numeric" aria-label="Meses"
              value={Number.isNaN(meses) ? "" : meses}
              onChange={(e) => setMeses(e.target.valueAsNumber)}
              className="w-20 bg-[#141414] border border-[#222] rounded-lg px-3 py-1.5 text-sm text-on-surface"
            />
          </div>
          {!mesesValidos && <p className="text-xs text-[#FF5A5A]">Escribe un número de meses entre 1 y 36.</p>}
        </div>
      )}
      <p className="text-xs text-on-surface-variant">
        No hace falta escribirle nada: al aprobar, @{username} recibe en la app «{esPack ? AVISO_PACK : AVISO_PLAN}»
      </p>
      <div className="flex flex-wrap gap-2">
        {cancelar}
        <button
          onClick={() => onResolver(true, esPack ? {} : { months: meses })}
          disabled={busy || (!esPack && !mesesValidos)}
          className={`${boton} bg-neon text-background font-medium`}
        >
          {busy ? "…" : esPack || !mesesValidos ? `Activar ${planName}` : `Activar ${planName} por ${meses} ${meses === 1 ? "mes" : "meses"}`}
        </button>
      </div>
    </div>
  );
}
