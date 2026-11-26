"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Las confirmaciones del panel, con su cara.
 *
 * Antes eran `confirm()` y `prompt()` del navegador: una caja gris que dice
 * «admin.invictoapp.com dice», sin jerarquía, con el texto técnico pegado y
 * los botones en inglés según el navegador (Orlando, 2026-11-25). Aquí el
 * título dice qué pasa, el texto qué implica, y el botón dice lo que hace.
 */
export interface Confirmacion {
  titulo: string;
  texto?: string;
  /** Un cambio de valor, para verlo de un vistazo: de qué a qué. */
  cambio?: { de: string; a: string };
  /** Lo que hace el botón: «Suspender», «Guardar». De fábrica, «Confirmar». */
  boton?: string;
  /** En rojo: quita, borra o corta algo. */
  peligro?: boolean;
}
export interface Pregunta extends Confirmacion {
  etiqueta: string;
  inicial?: string;
  /** Sin texto no se puede confirmar. */
  obligatorio?: boolean;
  max?: number;
}

type Abierto = (Confirmacion & { pide?: Pregunta; fin: (v: string | boolean | null) => void }) | null;
interface Api { confirmar: (c: Confirmacion) => Promise<boolean>; preguntar: (p: Pregunta) => Promise<string | null> }

const Contexto = createContext<Api | null>(null);

export function useDialogo(): Api {
  const api = useContext(Contexto);
  if (!api) throw new Error("useDialogo va dentro de <Dialogos>");
  return api;
}

export function Dialogos({ children }: { children: ReactNode }) {
  const [abierto, setAbierto] = useState<Abierto>(null);
  const confirmar = useCallback((c: Confirmacion) => new Promise<boolean>((fin) =>
    setAbierto({ ...c, fin: (v) => fin(v === true) })), []);
  const preguntar = useCallback((p: Pregunta) => new Promise<string | null>((fin) =>
    setAbierto({ ...p, pide: p, fin: (v) => fin(typeof v === "string" ? v : null) })), []);
  const cerrar = (v: string | boolean | null) => { abierto?.fin(v); setAbierto(null); };

  return (
    <Contexto.Provider value={{ confirmar, preguntar }}>
      {children}
      {abierto && <Ventana d={abierto} onCerrar={cerrar} />}
    </Contexto.Provider>
  );
}

function Ventana({ d, onCerrar }: { d: NonNullable<Abierto>; onCerrar: (v: string | boolean | null) => void }) {
  const [texto, setTexto] = useState(d.pide?.inicial ?? "");
  const caja = useRef<HTMLDivElement>(null);
  const antes = useRef<Element | null>(null);
  const falta = !!d.pide?.obligatorio && texto.trim() === "";
  const aceptar = () => { if (!falta) onCerrar(d.pide ? texto.trim() : true); };

  useEffect(() => {
    antes.current = document.activeElement;
    const primero = caja.current?.querySelector<HTMLElement>("textarea, [data-principal]");
    primero?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onCerrar(d.pide ? null : false); }
      if (e.key !== "Tab" || !caja.current) return;
      // El foco no se escapa a la página de atrás mientras la ventana está abierta.
      const f = [...caja.current.querySelectorAll<HTMLElement>("button:not([disabled]), textarea")];
      if (f.length === 0) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener("keydown", tecla);
    return () => { document.removeEventListener("keydown", tecla); (antes.current as HTMLElement | null)?.focus?.(); };
  }, [d, onCerrar]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="dialogo-fondo absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => onCerrar(d.pide ? null : false)} />
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialogo-titulo"
        className={`dialogo-caja relative w-full sm:max-w-md bg-[#111] border border-[#262626] border-t-2 ${d.peligro ? "border-t-[#FF5A5A]" : "border-t-neon"} rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] grid gap-4`}
      >
        <h2 id="dialogo-titulo" className="font-headline font-black italic text-xl leading-tight pr-2">{d.titulo}</h2>
        {d.cambio && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="px-2.5 py-1 rounded-md bg-[#1b1b1b] text-on-surface-variant line-through decoration-[#555]">{d.cambio.de}</span>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant" aria-hidden>arrow_forward</span>
            <span className={`px-2.5 py-1 rounded-md font-medium ${d.peligro ? "bg-[#FF5A5A]/15 text-[#FF8A8A]" : "bg-neon/15 text-neon"}`}>{d.cambio.a}</span>
          </div>
        )}
        {d.texto && <p className="text-sm leading-relaxed text-on-surface-variant whitespace-pre-line">{d.texto}</p>}
        {d.pide && (
          <label className="grid gap-1.5 text-sm">
            <span>{d.pide.etiqueta}</span>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) aceptar(); }}
              maxLength={d.pide.max ?? 500}
              rows={3}
              className="w-full rounded-lg bg-[#0b0b0b] border border-[#2a2a2a] focus:border-neon outline-none px-3 py-2 text-sm resize-y"
            />
          </label>
        )}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-1">
          <button onClick={() => onCerrar(d.pide ? null : false)} className="rounded-lg px-4 py-2.5 text-sm border border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
            Cancelar
          </button>
          <button
            data-principal
            disabled={falta}
            onClick={aceptar}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-opacity disabled:opacity-40 ${d.peligro ? "bg-[#FF5A5A] text-white" : "bg-neon text-background"}`}
          >
            {d.boton ?? "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
