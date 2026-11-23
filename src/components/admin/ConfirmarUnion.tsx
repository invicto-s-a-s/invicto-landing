"use client";

import { useState } from "react";
import { llamarPanel } from "./panel-api";

interface Props {
  tipo: "ejecutar" | "deshacer";
  id: number;
  /** El nombre que hay que escribir. */
  nombre: string;
  /** La del ensayo que se está viendo: si algo cambió, el servidor no ejecuta. */
  huella?: string;
  deshabilitado?: boolean;
  onListo: () => void | Promise<void>;
}

const limpio = (v: string) => v.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * Ejecutar o deshacer, **con el nombre escrito**. No hay un botón que lo haga
 * de un toque: son datos de menores y dinero de familias.
 */
export default function ConfirmarUnion({ tipo, id, nombre, huella, deshabilitado = false, onListo }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [escrito, setEscrito] = useState("");
  const [motivo, setMotivo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = tipo === "ejecutar";
  const coincide = nombre !== "" && limpio(escrito) === limpio(nombre);
  const puede = coincide && (ejecutar || motivo.trim().length >= 5) && !busy;

  const enviar = async () => {
    if (!puede) return;
    setBusy(true);
    setError(null);
    const r = await llamarPanel(
      `/admin/sede-unions/${id}/${ejecutar ? "execute" : "undo"}`, "POST",
      ejecutar ? { confirmacion: escrito, huella } : { confirmacion: escrito, motivo: motivo.trim() },
    );
    setBusy(false);
    if (!r.ok) {
      // Sin mensaje, la respuesta se perdió: pudo haberse hecho. Repetirla no duplica.
      setError(r.message ?? "No hubo respuesta. Vuelve a abrir la unión para ver si se hizo antes de repetir.");
      return;
    }
    setAbierto(false);
    await onListo();
  };

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        disabled={deshabilitado}
        className={`text-xs px-4 py-2 rounded-lg mt-5 disabled:opacity-40 ${ejecutar ? "bg-neon text-background font-medium" : "border border-[#FF5A5A] text-[#FF5A5A]"}`}
      >
        {ejecutar ? "Ejecutar la unión" : "Deshacer la unión"}
      </button>
    );
  }

  return (
    <div className="border border-[#333] rounded-xl p-4 mt-5 grid gap-3">
      <p className="text-sm">
        {ejecutar
          ? `Se va a mover todo lo de ${nombre} a la escuela principal. Las familias y el cuerpo técnico reciben el aviso. Solo se puede deshacer mientras nadie registre nada nuevo.`
          : `Todo lo que se movió vuelve a ${nombre}, su dueño recupera su escuela y la sede queda archivada.`}
      </p>
      <label className="text-xs text-on-surface-variant grid gap-1">
        Para confirmar, escribe el nombre de la escuela: {nombre}
        <input
          value={escrito} onChange={(e) => setEscrito(e.target.value)} autoComplete="off"
          className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white"
        />
      </label>
      {!ejecutar && (
        <label className="text-xs text-on-surface-variant grid gap-1">
          Por qué se deshace
          <input
            value={motivo} onChange={(e) => setMotivo(e.target.value)} maxLength={300}
            className="bg-[#111] border border-[#333] rounded-lg px-3 py-2 text-sm text-white"
          />
        </label>
      )}
      {error && <p className="text-sm text-[#FF5A5A]">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={enviar} disabled={!puede}
          className={`text-xs px-4 py-2 rounded-lg disabled:opacity-40 ${ejecutar ? "bg-neon text-background font-medium" : "bg-[#FF5A5A] text-white"}`}
        >
          {busy ? "Un momento…" : ejecutar ? "Ejecutar" : "Deshacer"}
        </button>
        <button onClick={() => setAbierto(false)} disabled={busy} className="text-xs px-4 py-2 rounded-lg border border-[#444] text-on-surface-variant">
          Cancelar
        </button>
      </div>
    </div>
  );
}
