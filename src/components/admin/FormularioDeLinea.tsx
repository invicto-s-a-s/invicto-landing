"use client";

import { useState } from "react";
import { DETALLE_MAXIMO, type Linea, TITULO_MAXIMO, boton, campo, chip } from "./catalogo-tipos";

export type Contenido = Pick<Linea, "title" | "detail" | "soon" | "includes_previous">;

type Props = {
  inicial?: Contenido;
  accion: string;
  busy: boolean;
  onGuardar: (c: Contenido) => void;
  onCancelar: () => void;
};

/** El título y la explicación de una línea, para añadirla o editarla. */
export default function FormularioDeLinea({ inicial, accion, busy, onGuardar, onCancelar }: Props) {
  const [title, setTitle] = useState(inicial?.title ?? "");
  const [detail, setDetail] = useState(inicial?.detail ?? "");
  const [soon, setSoon] = useState(inicial?.soon ?? false);
  const [previo, setPrevio] = useState(inicial?.includes_previous ?? false);
  const limpio = title.trim();

  return (
    <div className="grid gap-3 border border-[#222] rounded-lg p-3">
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Título, tal como se verá en la tarjeta del plan ({limpio.length}/{TITULO_MAXIMO})
        <input className={campo} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={TITULO_MAXIMO} autoFocus />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Explicación, opcional ({detail.trim().length}/{DETALLE_MAXIMO})
        <textarea className={campo} rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} maxLength={DETALLE_MAXIMO} />
      </label>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={chip(soon)} aria-pressed={soon} onClick={() => setSoon(!soon)}>Próximamente</button>
        <button type="button" className={chip(previo)} aria-pressed={previo} onClick={() => setPrevio(!previo)}>Incluye el plan anterior</button>
      </div>
      <p className="text-xs text-on-surface-variant">
        «Próximamente» indica que la función todavía está en construcción. «Incluye el plan anterior» es para la línea del tipo «Todo lo de Básico».
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onCancelar} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
        <button
          type="button"
          disabled={busy || !limpio}
          onClick={() => onGuardar({ title: limpio, detail: detail.trim() || null, soon, includes_previous: previo })}
          className={`${boton} font-medium bg-neon text-background`}
        >
          {busy ? "…" : accion}
        </button>
      </div>
    </div>
  );
}
