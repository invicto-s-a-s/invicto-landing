"use client";

import { useState } from "react";
import LineasDelPlan from "./LineasDelPlan";
import CuentasDelPlan from "./CuentasDelPlan";
import { type Conteo, type Edicion, type Plan, estadoDe, pesos, valorDe } from "./catalogo-tipos";

const ABIERTA = { texto: "Abierta para todos", ayuda: "Es un candado abierto: este valor se aplica cuando lo cierres en Candados." };

type Props = {
  p: Plan;
  conteo: Conteo | null;
  abiertas: Set<string> | null;
  abierto: boolean;
  onAbrir: () => void;
  editar: (e: Edicion) => void;
  /** El editor que toca dentro de la tarjeta: arriba (plan) o entre las capacidades. */
  editor: (enCapacidades: boolean) => React.ReactNode;
  onAbrirCuenta: (id: number) => void;
  onCambio: () => void;
};

const cuantas = (n: number) => (n === 1 ? "1 cuenta" : `${n} cuentas`);

/** Un plan del catálogo: lo que trae, sus precios, sus líneas y las cuentas que lo tienen. */
export default function TarjetaDelPlan({ p, conteo, abiertas, abierto, onAbrir, editar, editor, onAbrirCuenta, onCambio }: Props) {
  const [lineas, setLineas] = useState(false);
  const [cuentas, setCuentas] = useState(false);
  const pestaña = (on: boolean) => `text-xs px-3 py-1.5 rounded-lg ${on ? "bg-neon text-background font-medium" : "bg-[#1A1A1A]"}`;

  return (
    <div className={`admin-card border rounded-xl p-5 ${p.is_private ? "border-[#AF8CFF]/50" : "border-[#222]"} ${p.is_active ? "" : "opacity-60"}`}>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={onAbrir} className="flex-1 min-w-0 text-left">
          <p className="font-headline font-black italic text-lg leading-tight break-words">
            {p.name}{p.is_default ? " · de entrada" : ""}{p.kind === "addon" ? " · complemento" : ""}
            {p.is_private && <span className="ml-2 align-middle not-italic font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#AF8CFF1A] text-[#AF8CFF]">Privado</span>}
          </p>
          <p className="text-xs text-on-surface-variant">
            {p.key} · nivel {p.tier} · {p.features.length} capacidades
            {p.features.some((f) => f.en_uso !== undefined) && `, ${p.features.filter((f) => f.en_uso).length} funcionan hoy`}
            {" · "}{p.is_active ? "activado" : "desactivado"}
            {conteo && ` · ${cuantas(conteo.total)}`}
          </p>
        </button>
        <button onClick={() => editar({ tipo: "nombre", plan: p })} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Renombrar</button>
        <button onClick={() => editar({ tipo: "precio", plan: p })} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Añadir precio</button>
        <button onClick={() => setLineas(!lineas)} aria-expanded={lineas} className={pestaña(lineas)}>Lo que muestra la app</button>
        <button onClick={() => setCuentas(!cuentas)} aria-expanded={cuentas} className={pestaña(cuentas)}>Ver cuentas{conteo ? ` (${conteo.total})` : ""}</button>
        {!p.is_default && (
          <>
            <button onClick={() => editar({ tipo: "privado", plan: p })} className="text-xs px-3 py-1.5 rounded-lg border border-[#333]">
              {p.is_private ? "Hacer público" : "Hacer privado"}
            </button>
            <button onClick={() => editar({ tipo: "encendido", plan: p })} className="text-xs px-3 py-1.5 rounded-lg border border-[#333]">
              {p.is_active ? "Desactivar" : "Activar"}
            </button>
          </>
        )}
      </div>

      {editor(false)}
      {lineas && <LineasDelPlan planKey={p.key} planName={p.name} />}
      {cuentas && <CuentasDelPlan plan={p} onAbrirCuenta={onAbrirCuenta} onCambio={onCambio} />}

      <div className="flex flex-wrap gap-2 mt-3">
        {p.prices.length === 0 && <span className="text-xs text-on-surface-variant">Aún no tiene precios.</span>}
        {p.prices.map((pr) => (
          <span key={pr.id} className="text-xs px-2.5 py-1 rounded-lg bg-[#141414]">
            {pesos(pr.amount_cop)}/{pr.period === "year" ? "año" : "mes"}{" "}
            <span className="text-on-surface-variant">
              {pr.effective_from ? `desde ${new Date(pr.effective_from).toLocaleDateString("es-CO")}` : "de lista"}
            </span>
          </span>
        ))}
      </div>

      {abierto && (
        <div className="mt-4 border-t border-[#1C1C1C] pt-3 grid gap-1.5">
          {p.features.length === 0 && <p className="text-xs text-on-surface-variant">Aún no tiene capacidades. Súmale las que quieras que incluya.</p>}
          {p.features.map((f) => {
            const estado = estadoDe(f, abiertas);
            return (
              <div key={f.feature_key} className={`flex items-center gap-3 text-xs ${f.feature_active ? "" : "opacity-50"}`}>
                <span className={`flex-1 min-w-0 ${estado === "sin_efecto" ? "text-on-surface-variant" : ""}`}>
                  {f.description} <span className="text-on-surface-variant">({f.feature_key})</span>
                </span>
                {estado === "abierta" && (
                  <span title={ABIERTA.ayuda} className="px-2 py-0.5 rounded-md whitespace-nowrap bg-neon/10 text-neon">{ABIERTA.texto}</span>
                )}
                {f.coming_soon !== undefined && (
                  <button
                    onClick={() => editar({ tipo: "pronto", plan: p, f })}
                    title="Cómo la muestra la app. Toca para cambiarlo."
                    className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${f.coming_soon ? "bg-[#FFB020]/10 text-[#FFB020]" : "bg-neon/10 text-neon"}`}
                  >
                    {f.coming_soon ? "Próximamente" : "Ya funciona"}
                  </button>
                )}
                <button onClick={() => editar({ tipo: "capacidad", plan: p, f })} className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] whitespace-nowrap">
                  {valorDe(f)}
                </button>
                <button onClick={() => editar({ tipo: "quitar", plan: p, f })} className="text-[#FF5A5A]" aria-label={`Quitar ${f.description}`}>✕</button>
              </div>
            );
          })}
          <div><button onClick={() => editar({ tipo: "añadir", plan: p })} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A] mt-1">+ Sumar una capacidad</button></div>
          {editor(true)}
        </div>
      )}
    </div>
  );
}
