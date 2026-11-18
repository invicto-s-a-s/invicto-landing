"use client";

import { useCallback, useEffect, useState } from "react";

interface Elemento {
  id: number;
  name: string;
  archived_at: string | null;
  unit?: string;
  lower_is_better?: boolean;
}

const UNIDADES = [
  { value: "s", label: "segundos" },
  { value: "cm", label: "centímetros" },
  { value: "m", label: "metros" },
  { value: "kg", label: "kilos" },
  { value: "rep", label: "repeticiones" },
  { value: "nivel", label: "nivel" },
] as const;

const BASE = "/api/admin/admin/base-lists";

async function pedir<T>(ruta: string, init?: RequestInit): Promise<{ datos: T | null; error: string | null }> {
  const res = await fetch(ruta, { headers: { "Content-Type": "application/json" }, ...init }).catch(() => null);
  const body = await res?.json().catch(() => null);
  if (!res?.ok) {
    return {
      datos: null,
      error: res?.status === 404 && typeof body?.message !== "string"
        ? "El servidor todavía no tiene esta función. Llega con la próxima versión."
        : typeof body?.message === "string" ? body.message : "No se pudo completar.",
    };
  }
  return { datos: (body?.data ?? null) as T, error: null };
}

/**
 * Las listas base que les llegan a todas las escuelas: las pruebas físicas y
 * las etiquetas de la evaluación. Lo que cada escuela creó no se ve ni se toca.
 *
 * Se agrega y se archiva, no se edita: una prueba base ya tiene mediciones en
 * muchas escuelas, y cambiarle el nombre cambiaría lo que dicen.
 */
export default function ListasBase() {
  const [pruebas, setPruebas] = useState<Elemento[]>([]);
  const [etiquetas, setEtiquetas] = useState<Elemento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [prueba, setPrueba] = useState({ name: "", unit: "s", lower_is_better: true });
  const [etiqueta, setEtiqueta] = useState("");

  const cargar = useCallback(() => {
    pedir<{ pruebas: Elemento[]; etiquetas: Elemento[] }>(BASE).then((r) => {
      setCargando(false);
      if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo leer." }); return; }
      setPruebas(r.datos.pruebas);
      setEtiquetas(r.datos.etiquetas);
    });
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const agregarPrueba = async () => {
    setMsg(null);
    const r = await pedir<Elemento>(`${BASE}/tests`, { method: "POST", body: JSON.stringify(prueba) });
    if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo agregar." }); return; }
    setPrueba({ name: "", unit: "s", lower_is_better: true });
    setMsg({ ok: true, text: `«${r.datos.name}» ya les aparece a todas las escuelas.` });
    cargar();
  };

  const agregarEtiqueta = async () => {
    setMsg(null);
    const r = await pedir<Elemento>(`${BASE}/tags`, { method: "POST", body: JSON.stringify({ name: etiqueta }) });
    if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo agregar." }); return; }
    setEtiqueta("");
    setMsg({ ok: true, text: `«${r.datos.name}» ya les aparece a todas las escuelas.` });
    cargar();
  };

  const archivar = async (tipo: "tests" | "tags", e: Elemento) => {
    setMsg(null);
    const r = await pedir<Elemento>(`${BASE}/${tipo}/${e.id}/archive`, {
      method: "POST", body: JSON.stringify({ archivar: e.archived_at === null }),
    });
    if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo cambiar." }); return; }
    cargar();
  };

  const fila = (tipo: "tests" | "tags", e: Elemento) => (
    <li key={e.id} className="flex items-center gap-3 bg-[#141414] rounded-lg px-3 py-2 text-sm">
      <span className={`flex-1 ${e.archived_at ? "text-on-surface-variant line-through" : ""}`}>
        {e.name}
        {e.unit && <span className="text-on-surface-variant"> · {UNIDADES.find((u) => u.value === e.unit)?.label ?? e.unit}{e.lower_is_better ? " · menos es mejor" : ""}</span>}
      </span>
      <button onClick={() => void archivar(tipo, e)} className="text-xs px-3 py-1 rounded-md border border-[#333] hover:border-neon">
        {e.archived_at ? "Volver a ofrecer" : "Archivar"}
      </button>
    </li>
  );

  if (cargando) return <p className="text-sm text-on-surface-variant">Cargando…</p>;

  return (
    <div className="grid gap-6 max-w-2xl">
      <p className="text-sm text-on-surface-variant">
        Estas listas les llegan a <b className="text-on-surface">todas las escuelas</b>. Lo que cada una creó por su
        cuenta no se ve ni se toca desde aquí. Archivar deja de ofrecerla; lo que ya se midió o etiquetó se conserva.
      </p>

      <section className="admin-card border border-[#222] rounded-xl p-5 grid gap-3">
        <h2 className="font-semibold">Pruebas físicas</h2>
        <ul className="grid gap-2">{pruebas.map((e) => fila("tests", e))}</ul>
        <div className="flex flex-wrap gap-2 items-center">
          <input
            value={prueba.name} onChange={(e) => setPrueba({ ...prueba, name: e.target.value })} maxLength={60}
            placeholder="Nombre de la prueba" className="flex-1 min-w-[180px] bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={prueba.unit} onChange={(e) => setPrueba({ ...prueba, unit: e.target.value })}
            className="bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
          >
            {UNIDADES.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-on-surface-variant">
            <input type="checkbox" checked={prueba.lower_is_better} onChange={(e) => setPrueba({ ...prueba, lower_is_better: e.target.checked })} />
            Menos es mejor
          </label>
          <button
            onClick={() => void agregarPrueba()} disabled={prueba.name.trim().length < 2}
            className="px-4 py-2 rounded-lg bg-neon text-background text-sm font-medium disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </section>

      <section className="admin-card border border-[#222] rounded-xl p-5 grid gap-3">
        <h2 className="font-semibold">Etiquetas de la evaluación</h2>
        <ul className="grid gap-2">{etiquetas.map((e) => fila("tags", e))}</ul>
        <div className="flex gap-2">
          <input
            value={etiqueta} onChange={(e) => setEtiqueta(e.target.value)} maxLength={40}
            placeholder="Nueva etiqueta" className="flex-1 bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
          />
          <button
            onClick={() => void agregarEtiqueta()} disabled={etiqueta.trim().length < 2}
            className="px-4 py-2 rounded-lg bg-neon text-background text-sm font-medium disabled:opacity-40"
          >
            Agregar
          </button>
        </div>
      </section>

      {msg && <p className={`text-sm ${msg.ok ? "text-neon" : "text-[#FF5A5A]"}`}>{msg.text}</p>}
    </div>
  );
}
