"use client";

import { useState } from "react";
import { type Edicion, type Guardar, estadoDe, hoyLocal, pesos, valorDe } from "./catalogo-tipos";

const campo = "w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-on-surface";
const boton = "text-xs px-4 py-2 rounded-lg disabled:opacity-40";
const chip = (on: boolean) => `text-xs px-3 py-1.5 rounded-lg ${on ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`;

/**
 * Editar el catálogo dentro de la tarjeta del plan.
 *
 * Antes eran `prompt()` y `confirm()` del navegador, y el valor de una
 * capacidad de sí/no cambiaba con un clic, sin preguntar. Tras la confusión de
 * Alexander con los meses en Solicitudes (2026-11-12) se pasó todo a esto:
 * cada caso dice qué se escribe, enseña lo que va a quedar y **a quién le
 * llega** antes de guardar. Todo lo de aquí afecta a las cuentas reales.
 */
type Props = { edicion: Edicion; abiertas: Set<string> | null; guardar: Guardar; cerrar: () => void };

export default function EditorDelCatalogo({ edicion, abiertas, guardar, cerrar }: Props) {
  const p = edicion.plan;
  const base = `/api/admin/admin/plans/${p.key}`;
  const [busy, setBusy] = useState(false);
  const [nombre, setNombre] = useState(p.name);
  const [periodo, setPeriodo] = useState<"month" | "year">("month");
  const [monto, setMonto] = useState("");
  const [deLista, setDeLista] = useState(true);
  const [desde, setDesde] = useState(hoyLocal());
  const f = edicion.tipo === "capacidad" || edicion.tipo === "quitar" ? edicion.f : null;
  const [sinTope, setSinTope] = useState(f?.limit_value === null);
  const [tope, setTope] = useState(f?.limit_value === null || f?.limit_value === undefined ? "" : String(f.limit_value));
  const [texto, setTexto] = useState(f?.text_value ?? "");

  const enviar = async (url: string, method: "PUT" | "POST" | "DELETE", body?: unknown) => {
    setBusy(true);
    const ok = await guardar(url, method, body);
    setBusy(false);
    if (ok) cerrar();
  };

  const pie = (accion: string, onClick: () => void, deshabilitado = false, peligro = false) => (
    <div className="flex flex-wrap gap-2">
      <button onClick={cerrar} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
      <button
        onClick={onClick}
        disabled={busy || deshabilitado}
        className={`${boton} font-medium ${peligro ? "bg-[#FF5A5A] text-background" : "bg-neon text-background"}`}
      >
        {busy ? "…" : accion}
      </button>
    </div>
  );
  // Antes de guardar se dice si el cambio va a notarse: hay capacidades que hoy no hacen nada.
  const estado = f ? estadoDe(f, abiertas) : null;
  const aviso = (
    <p className="text-xs text-[#FFB020]">
      {estado === "sin_efecto"
        ? "El código no consulta esta casilla: puedes guardarla, pero hoy no cambia nada para nadie."
        : estado === "abierta"
          ? `Este candado está abierto para todos. El valor se aplicará a las cuentas con el plan ${p.name} cuando lo cierres en Candados.`
          : `Afecta a todas las cuentas con el plan ${p.name}, ahora mismo.`}
    </p>
  );

  let cuerpo: React.ReactNode;
  if (edicion.tipo === "nombre") {
    const limpio = nombre.trim();
    cuerpo = (
      <>
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Nombre del plan, tal como lo verá la gente en la app
          <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={40} autoFocus />
        </label>
        {pie(`Guardar «${limpio || "…"}»`, () => void enviar(base, "PUT", { name: limpio }), !limpio || limpio === p.name)}
      </>
    );
  } else if (edicion.tipo === "precio") {
    const n = /^\d+$/.test(monto.trim()) ? Number(monto.trim()) : null;
    const por = periodo === "year" ? "al año" : "al mes";
    cuerpo = (
      <>
        <p className="text-xs text-on-surface-variant">
          Los precios no se editan: se añade uno nuevo y queda la historia. El de lista se enseña en la app; el que tiene fecha es lo que se cobra desde ese día.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className={chip(periodo === "month")} onClick={() => setPeriodo("month")}>Mensual</button>
          <button className={chip(periodo === "year")} onClick={() => setPeriodo("year")}>Anual</button>
        </div>
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Precio en pesos, solo números (0 es gratis)
          <input className={campo} inputMode="numeric" value={monto} onChange={(e) => setMonto(e.target.value.replace(/[^\d]/g, ""))} placeholder="179900" autoFocus />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button className={chip(deLista)} onClick={() => setDeLista(true)}>Precio de lista</button>
          <button className={chip(!deLista)} onClick={() => setDeLista(false)}>Rige desde una fecha</button>
          {!deLista && <input type="date" className={`${campo} w-auto`} value={desde} onChange={(e) => setDesde(e.target.value)} />}
        </div>
        {n !== null && <p className="text-sm">Queda: <span className="text-neon">{pesos(n)} {por}</span>{deLista ? ", de lista" : desde ? `, desde el ${desde}` : ""}.</p>}
        {pie("Añadir precio", () => void enviar(`${base}/prices`, "POST", {
          period: periodo, amount_cop: n, effective_from: deLista ? null : desde,
        }), n === null || (!deLista && !desde))}
      </>
    );
  } else if (edicion.tipo === "encendido") {
    cuerpo = p.is_active ? (
      <>
        <p className="text-sm">¿Apagar el plan {p.name}? Quien lo tenga cae a su plan de entrada.</p>
        {pie(`Apagar ${p.name}`, () => void enviar(base, "PUT", { is_active: false }), false, true)}
      </>
    ) : (
      <>
        <p className="text-sm">¿Encender el plan {p.name}? Vuelve a aparecer en la app.</p>
        {pie(`Encender ${p.name}`, () => void enviar(base, "PUT", { is_active: true }))}
      </>
    );
  } else if (edicion.tipo === "quitar") {
    cuerpo = (
      <>
        <p className="text-sm">¿Quitar «{edicion.f.description}» del plan {p.name}?</p>
        {aviso}
        {pie("Quitar del plan", () => void enviar(`${base}/features/${edicion.f.feature_key}`, "DELETE"), false, true)}
      </>
    );
  } else {
    const c = edicion.f;
    const url = `${base}/features/${c.feature_key}`;
    let control: React.ReactNode;
    let accion: () => void;
    let listo = true;
    if (c.kind === "bool") {
      control = <p className="text-sm">Ahora: <b>{valorDe(c)}</b>. Pasará a <b className="text-neon">{c.bool_value ? "No" : "Sí"}</b>.</p>;
      accion = () => void enviar(url, "PUT", { bool_value: !c.bool_value });
    } else if (c.kind === "limit") {
      listo = sinTope || /^\d+$/.test(tope.trim());
      control = (
        <div className="flex flex-wrap items-center gap-2">
          <button className={chip(sinTope)} onClick={() => setSinTope(true)}>Sin tope</button>
          <button className={chip(!sinTope)} onClick={() => setSinTope(false)}>Con tope</button>
          {!sinTope && <input className={`${campo} w-28`} inputMode="numeric" value={tope} onChange={(e) => setTope(e.target.value.replace(/[^\d]/g, ""))} placeholder="10" autoFocus />}
        </div>
      );
      accion = () => void enviar(url, "PUT", { limit_value: sinTope ? null : Number(tope.trim()) });
    } else {
      control = <input className={campo} value={texto} onChange={(e) => setTexto(e.target.value)} autoFocus />;
      accion = () => void enviar(url, "PUT", { text_value: texto.trim() || null });
    }
    cuerpo = (
      <>
        <p className="text-xs text-on-surface-variant">{c.description} · {c.feature_key}</p>
        {control}
        {aviso}
        {pie("Guardar", accion, !listo)}
      </>
    );
  }

  return <div className="mt-3 grid gap-3 border-t border-[#222] pt-3">{cuerpo}</div>;
}
