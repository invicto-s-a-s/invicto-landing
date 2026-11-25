"use client";

import { useCallback, useEffect, useState } from "react";
import { boton, campo } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";

interface Parametro { key: string; value: string; kind: string; description: string }

/** Los que tienen pocos valores posibles: se eligen, no se escriben. El servidor valida igual. */
const OPCIONES: Record<string, [valor: string, texto: string][]> = {
  "contacts.mode": [["mensajes", "Mensajes que envía"], ["contactos", "Contactos nuevos que inicia"]],
  "packs.excess_enabled": [["off", "Apagado"], ["on", "Encendido"]],
  "schools.trial_enabled": [["off", "Apagado"], ["on", "Encendido"]],
  "vitrina.audience": [["ojeadores_y_clubes", "Ojeadores verificados y clubes"], ["todos", "Todos los que tienen sesión"]],
  "vitrina.rotation_days": [["3", "3 días"], ["7", "7 días"]],
};

/** Los que son una lista de perfiles: se marcan. Sin ninguno marcado va «ninguno», que el servidor entiende. */
const POR_PERFIL = ["plans.prices_by_segment", "plans.requests_by_segment", "plans.payment_required_segments"];
const PERFILES: [valor: string, texto: string][] = [["player", "Jugadores"], ["scout", "Ojeadores"], ["club", "Clubes"], ["school", "Escuelas"]];
const marcados = (v: string) => v.split(",").map((s) => s.trim().toLowerCase()).filter((s) => PERFILES.some(([k]) => k === s));
const alternar = (v: string, perfil: string) => {
  const hay = marcados(v);
  return PERFILES.map(([k]) => k).filter((k) => (k === perfil ? !hay.includes(k) : hay.includes(k))).join(",") || "ninguno";
};

const TITULOS: Record<string, string> = {
  contacts: "Contactos del ojeador", plans: "Planes y cobro", packs: "Pack y cupos", schools: "Prueba de escuelas", vitrina: "Vitrina Élite",
};
/** El resto tiene su propia pestaña (candados, acceso total) o es de otra parte del producto. */
const AREAS = Object.keys(TITULOS);

/** Cada número y cada interruptor de los planes. Se guarda de uno en uno y queda en la auditoría. */
export default function AjustesDePlanes() {
  const [lista, setLista] = useState<Parametro[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() => llamarPanel<Parametro[]>("/admin/parameters").then((r) => {
    if (!r.ok || !Array.isArray(r.data)) { setError(r.message ?? "No fue posible leer los ajustes."); return; }
    setLista(r.data);
  }), []);
  useEffect(() => { void cargar(); }, [cargar]);

  if (error) return <p className="text-sm text-[#FF5A5A]">{error}</p>;
  if (!lista) return <p className="text-sm text-on-surface-variant">Cargando…</p>;
  return (
    <div className="grid gap-8 max-w-3xl">
      {AREAS.map((area) => (
        <section key={area} className="grid gap-3">
          <h3 className="text-sm font-medium">{TITULOS[area]}</h3>
          {lista.filter((p) => p.key.startsWith(`${area}.`)).map((p) => <Fila key={`${p.key}:${p.value}`} p={p} onListo={cargar} />)}
        </section>
      ))}
    </div>
  );
}

function Fila({ p, onListo }: { p: Parametro; onListo: () => Promise<void> }) {
  const [valor, setValor] = useState(p.value);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const opciones = OPCIONES[p.key];

  const guardar = async () => {
    if (!confirm(`¿Cambiar «${p.key}» de «${p.value}» a «${valor}»?\n\n${p.description}\n\nSe nota enseguida.`)) return;
    setBusy(true);
    setError(null);
    const r = await llamarPanel(`/admin/parameters/${p.key}`, "PUT", { value: valor });
    setBusy(false);
    if (!r.ok) { setError(r.message ?? "No fue posible guardar el cambio."); return; }
    await onListo();
  };

  return (
    <div className="admin-card border border-[#222] rounded-xl p-4 grid gap-2">
      <p className="text-xs text-on-surface-variant">{p.description}</p>
      <div className="flex flex-wrap gap-2 items-center">
        {POR_PERFIL.includes(p.key) ? (
          <div className="flex flex-wrap gap-x-4 gap-y-2" role="group" aria-label={p.description}>
            {PERFILES.map(([k, t]) => (
              <label key={k} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={marcados(valor).includes(k)} onChange={() => setValor(alternar(valor, k))} />
                {t}
              </label>
            ))}
          </div>
        ) : opciones ? (
          <select className={`${campo} max-w-xs`} value={valor} onChange={(e) => setValor(e.target.value)} aria-label={p.key}>
            {opciones.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
          </select>
        ) : (
          <input className={`${campo} max-w-xs`} value={valor} onChange={(e) => setValor(e.target.value)} aria-label={p.key} maxLength={200} />
        )}
        <button className={`${boton} bg-neon text-background font-medium`} disabled={busy || valor.trim() === "" || valor === p.value} onClick={() => void guardar()}>
          {busy ? "…" : "Guardar"}
        </button>
      </div>
      <p className="text-[11px] text-on-surface-variant/60 font-mono">{p.key}</p>
      {error && <p className="text-xs text-[#FF5A5A]">{error}</p>}
    </div>
  );
}
