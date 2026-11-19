"use client";

import { useState } from "react";
import { type Plan, SEGMENTOS, boton, campo, chip } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";

const CORONAS = [
  { value: "", label: "Sin corona" }, { value: "basic", label: "Básica (blanca)" },
  { value: "pro", label: "PRO (cian)" }, { value: "elite", label: "Élite (violeta)" }, { value: "school", label: "Escuela (verde)" },
];

type Props = { planes: Plan[]; onCreado: (key: string) => void; cerrar: () => void };

/**
 * Crear un plan: «armo un paquete, le coloco un precio y lo entrego» (Orlando,
 * 2026-11-18).
 *
 * Se puede partir de otro plan del mismo perfil, que copia sus capacidades con
 * sus topes, sus precios y sus líneas; después se ajusta en su tarjeta como
 * cualquier otro. La clave la saca el servidor del nombre, porque no se puede
 * cambiar después. Privado es a la medida de un cliente: solo lo ve quien lo
 * tiene, y solo se asigna desde aquí.
 */
export default function CrearPlan({ planes, onCreado, cerrar }: Props) {
  const [segmento, setSegmento] = useState("school");
  const [nombre, setNombre] = useState("");
  const [basadoEn, setBasadoEn] = useState("");
  const [nivel, setNivel] = useState("");
  const [ventaja, setVentaja] = useState("");
  const [etiqueta, setEtiqueta] = useState("");
  const [corona, setCorona] = useState("");
  const [privado, setPrivado] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deSuPerfil = planes.filter((p) => p.segment === segmento && p.kind === "plan").sort((a, b) => a.tier - b.tier);
  const base = deSuPerfil.find((p) => p.key === basadoEn) ?? null;
  // Si no se ingresa un nivel, va al del plan de partida, o por encima del más alto.
  const nivelFinal = nivel.trim() ? Number(nivel.trim()) : base ? base.tier : Math.max(0, ...deSuPerfil.map((p) => p.tier)) + 1;
  const limpio = nombre.trim();

  const crear = async () => {
    setBusy(true);
    setError(null);
    const r = await llamarPanel<{ key: string }>("/admin/plans", "POST", {
      segment: segmento, name: limpio, tier: nivelFinal, is_private: privado,
      ...(basadoEn ? { based_on: basadoEn } : {}),
      ...(ventaja.trim() ? { tagline: ventaja.trim() } : {}),
      ...(etiqueta.trim() ? { tag: etiqueta.trim() } : {}),
      ...(corona ? { crown: corona } : {}),
    });
    setBusy(false);
    if (!r.ok || !r.data) { setError(r.message ?? "No fue posible crear el plan."); return; }
    onCreado(r.data.key);
  };

  return (
    <div className="admin-card border border-neon/40 rounded-xl p-5 mb-6 grid gap-3 max-w-2xl">
      <p className="font-headline font-black italic text-lg">Crear un plan</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(SEGMENTOS).map(([k, v]) => (
          <button key={k} className={chip(segmento === k)} onClick={() => { setSegmento(k); setBasadoEn(""); }}>{v}</button>
        ))}
      </div>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Nombre, tal como lo verá la cuenta en la app
        <input className={campo} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={60} placeholder="Barranquillita a la medida" autoFocus />
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Partir de otro plan (copia sus capacidades, precios y líneas)
        <select className={campo} value={basadoEn} onChange={(e) => setBasadoEn(e.target.value)}>
          <option value="">Empezar vacío y elegir cada capacidad</option>
          {deSuPerfil.map((p) => <option key={p.key} value={p.key}>{p.name} · nivel {p.tier}{p.is_private ? " · privado" : ""}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Nivel en la escalera (si lo dejas vacío: {nivelFinal})
        <input className={campo} inputMode="numeric" value={nivel} onChange={(e) => setNivel(e.target.value.replace(/[^\d]/g, ""))} placeholder={String(nivelFinal)} />
        <span>A quien lo tenga se le ofrecen los planes de nivel mayor, y si tiene varios planes, cuenta el de nivel más alto.</span>
      </label>
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Ventaja (una frase sobre lo que resuelve)
        <input className={campo} value={ventaja} onChange={(e) => setVentaja(e.target.value)} maxLength={200} />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Etiqueta de la tarjeta
          <input className={campo} value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} maxLength={40} placeholder="A la medida" />
        </label>
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Corona del perfil
          <select className={campo} value={corona} onChange={(e) => setCorona(e.target.value)}>
            {CORONAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className={chip(privado)} onClick={() => setPrivado(true)}>Privado: a la medida de un cliente</button>
        <button className={chip(!privado)} onClick={() => setPrivado(false)}>Público: lo ve todo el perfil</button>
      </div>
      <p className="text-xs text-on-surface-variant">
        {privado
          ? "Solo lo verá la cuenta a la que se lo asignes. No aparece en la app para las demás y no se puede solicitar."
          : `Todas las cuentas de ${SEGMENTOS[segmento].toLowerCase()} lo verán en la app y podrán solicitarlo en cuanto lo guardes.`}
        {" "}Nace activado{base ? `, con todo lo de ${base.name}` : ", sin capacidades ni precios"}.
      </p>
      {error && <p className="text-xs text-[#FF5A5A]">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button onClick={cerrar} disabled={busy} className={`${boton} border border-[#333] text-on-surface-variant`}>Cancelar</button>
        <button onClick={() => void crear()} disabled={busy || !limpio || nivelFinal > 98} className={`${boton} bg-neon text-background font-medium`}>
          {busy ? "…" : `Crear «${limpio || "…"}»`}
        </button>
      </div>
    </div>
  );
}
