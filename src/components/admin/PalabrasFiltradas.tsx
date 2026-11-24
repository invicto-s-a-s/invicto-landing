"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, Vacio, botonPrincipal, entrada } from "./PiezasDeModeracion";

/** La lista del filtro. Se enciende en Ajustes (`moderation.word_filter`). */
export default function PalabrasFiltradas() {
  const [items, setItems] = useState<{ id: number; word: string }[] | null>(null);
  const [nueva, setNueva] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ items: { id: number; word: string }[] }>("/admin/moderation/words").then((r) => {
      setItems(r.data?.items ?? []);
      if (!r.ok) setError(r.message ?? "No se pudo cargar la lista.");
    }), []);
  useEffect(() => { void cargar(); }, [cargar]);

  const anadir = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await llamarPanel("/admin/moderation/words", "POST", { word: nueva });
    setError(r.ok ? null : (r.message ?? "No se pudo añadir."));
    if (r.ok) setNueva("");
    await cargar();
  };
  const quitar = async (id: number) => {
    const r = await llamarPanel(`/admin/moderation/words/${id}`, "DELETE");
    setError(r.ok ? null : (r.message ?? "No se pudo quitar."));
    await cargar();
  };

  return (
    <div className="flex flex-col gap-4 max-w-xl">
      <p className="text-xs text-on-surface-variant">
        Cuando el filtro está encendido, un texto con una de estas palabras no se puede publicar. Se compara la palabra entera, sin
        tildes ni mayúsculas, y también admite frases.
      </p>
      <form onSubmit={anadir} className="flex gap-2">
        <input className={entrada} maxLength={60} value={nueva} onChange={(e) => setNueva(e.target.value)} placeholder="Palabra o frase" />
        <button className={botonPrincipal} disabled={nueva.trim().length < 2}>Añadir</button>
      </form>
      {error && <Fallo>{error}</Fallo>}
      {items?.length === 0 && <Vacio>La lista está vacía.</Vacio>}
      <div className="flex flex-wrap gap-2">
        {items?.map((p) => (
          <span key={p.id} className="text-xs bg-[#1A1A1A] rounded-lg pl-3 pr-1 py-1 flex items-center gap-2">
            {p.word}
            <button onClick={() => quitar(p.id)} aria-label={`Quitar ${p.word}`} className="material-symbols-outlined text-[16px] p-1">close</button>
          </span>
        ))}
      </div>
    </div>
  );
}
