"use client";

import { useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";

interface Conflicto {
  origen: "plantilla" | "perfil";
  user_id: number;
  nombre: string;
  escuela: string | null;
  motivo: "su_propio_correo" | "correo_de_otro_menor";
  correo: string;
}

/**
 * Menores cuyo acudiente tiene su propio correo o el de otro menor. Ya no se puede
 * hacer; a los que estaban **no se les toca nada**: se listan para escribirles.
 */
export default function ConflictosDeAcudiente() {
  const [filas, setFilas] = useState<Conflicto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void llamarPanel<{ items: Conflicto[] }>("/admin/minors/guardian-conflicts").then((r) => {
      if (!r.ok || !r.data) setError(r.message ?? "No se pudo cargar la lista.");
      else setFilas(r.data.items);
    });
  }, []);

  if (error) return <p className="text-sm text-[#FF5A5A]">{error}</p>;
  if (!filas) return <p className="text-sm text-on-surface-variant">Cargando…</p>;
  return (
    <div>
      <p className="text-sm text-on-surface-variant mb-4">
        El correo del acudiente llega al mismo buzón del menor o al de otro menor. Nada de lo que ya tienen cambia: con ese correo
        no se pueden dar permisos nuevos.
      </p>
      {filas.length === 0 && <p className="text-sm text-on-surface-variant">No hay ninguno.</p>}
      <div className="grid gap-2">
        {filas.map((f) => (
          <div key={`${f.origen}-${f.user_id}-${f.escuela}-${f.correo}`} className="admin-card border border-[#222] rounded-xl p-4">
            <p className="text-sm font-medium">{f.nombre} <span className="text-on-surface-variant font-normal">· cuenta {f.user_id}</span></p>
            <p className="text-xs text-on-surface-variant mt-1">
              {f.motivo === "su_propio_correo" ? "Es su propio correo" : "Es el correo de otro menor"} · {f.correo} ·{" "}
              {f.origen === "plantilla" ? f.escuela ?? "Escuela" : "Declarado en su perfil"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
