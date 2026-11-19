"use client";

import { useState } from "react";
import FormularioDeLinea, { type Contenido } from "./FormularioDeLinea";
import { type Linea, boton, chip } from "./catalogo-tipos";

type Props = {
  linea: Linea;
  esPrimera: boolean;
  esUltima: boolean;
  busy: boolean;
  onEditar: (c: Partial<Contenido>) => Promise<boolean>;
  onMover: (delta: -1 | 1) => void;
  onEliminar: () => Promise<boolean>;
};

const flecha = "w-7 h-7 rounded-lg bg-[#1A1A1A] text-xs disabled:opacity-30";

/** Una línea del plan: se lee como en la app, y se edita, se mueve o se elimina desde aquí. */
export default function LineaDelPlan({ linea, esPrimera, esUltima, busy, onEditar, onMover, onEliminar }: Props) {
  const [modo, setModo] = useState<"ver" | "editar" | "eliminar">("ver");

  if (modo === "editar") {
    return (
      <FormularioDeLinea
        inicial={linea}
        accion="Guardar cambios"
        busy={busy}
        onCancelar={() => setModo("ver")}
        onGuardar={async (c) => { if (await onEditar(c)) setModo("ver"); }}
      />
    );
  }

  return (
    <div className="border border-[#1C1C1C] rounded-lg p-3 grid gap-2">
      <div className="flex items-start gap-3">
        <div className="flex flex-col gap-1">
          <button className={flecha} disabled={busy || esPrimera} onClick={() => onMover(-1)} aria-label={`Subir «${linea.title}»`}>↑</button>
          <button className={flecha} disabled={busy || esUltima} onClick={() => onMover(1)} aria-label={`Bajar «${linea.title}»`}>↓</button>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {linea.title}
            {linea.includes_previous && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-[#1A1A1A] text-on-surface-variant">Incluye el plan anterior</span>}
          </p>
          {linea.detail
            ? <p className="text-xs text-on-surface-variant">{linea.detail}</p>
            : <p className="text-xs text-on-surface-variant italic">Sin explicación.</p>}
        </div>
        <button
          className={chip(linea.soon)}
          aria-pressed={linea.soon}
          disabled={busy}
          onClick={() => void onEditar({ soon: !linea.soon })}
          title={linea.soon ? "La app la muestra como «Próximamente». Toca para indicar que ya está disponible." : "La app la muestra como disponible. Toca para marcarla como «Próximamente»."}
        >
          Próximamente
        </button>
      </div>

      {modo === "eliminar" ? (
        <div className="grid gap-2 border-t border-[#222] pt-2">
          <p className="text-sm">¿Eliminar «{linea.title}» de este plan? La app dejará de mostrarla.</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setModo("ver")} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
            <button
              onClick={async () => { if (!(await onEliminar())) setModo("ver"); }}
              disabled={busy}
              className={`${boton} font-medium bg-[#FF5A5A] text-background`}
            >
              {busy ? "…" : "Eliminar línea"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 pl-10">
          <button onClick={() => setModo("editar")} disabled={busy} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Editar</button>
          <button onClick={() => setModo("eliminar")} disabled={busy} className="text-xs px-3 py-1.5 rounded-lg text-[#FF5A5A]">Eliminar</button>
        </div>
      )}
    </div>
  );
}
