"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, boton } from "./PiezasDeModeracion";
import { PERMISO_LABEL, Permiso } from "./moderacion-tipos";

interface Revisor { user_id: number; username: string; name: string | null; soy_yo: boolean; de_fabrica: boolean; permissions: Permiso[] }

/** Qué puede hacer cada persona que revisa. Nadie cambia los suyos. */
export default function PermisosDeRevisores() {
  const [datos, setDatos] = useState<{ catalogo: Permiso[]; items: Revisor[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ catalogo: Permiso[]; items: Revisor[] }>("/admin/moderation/reviewers").then((r) => {
      setDatos(r.data);
      if (!r.ok) setError(r.message ?? "No se pudo cargar.");
    }), []);
  useEffect(() => { void cargar(); }, [cargar]);

  const guardar = async (r: Revisor, permissions: Permiso[] | null) => {
    const res = await llamarPanel(`/admin/moderation/reviewers/${r.user_id}`, "PUT", { permissions });
    setError(res.ok ? null : (res.message ?? "No se pudo guardar."));
    await cargar();
  };

  return (
    <div className="flex flex-col gap-3 max-w-3xl">
      {error && <Fallo>{error}</Fallo>}
      {datos?.items.map((r) => (
        <div key={r.user_id} className="admin-card border border-[#222] rounded-xl p-4 flex flex-col gap-3">
          <p className="text-sm">
            @{r.username}{r.soy_yo ? " (tú)" : ""}
            <span className="text-xs text-on-surface-variant"> · {r.de_fabrica ? "permisos de fábrica" : "permisos propios"}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {datos.catalogo.map((p) => (
              <label key={p} className="text-xs flex items-center gap-1.5">
                <input
                  type="checkbox" disabled={r.soy_yo} checked={r.permissions.includes(p)} className="accent-[#AAFF00]"
                  onChange={(e) => guardar(r, e.target.checked ? [...r.permissions, p] : r.permissions.filter((x) => x !== p))}
                />
                {PERMISO_LABEL[p] ?? p}
              </label>
            ))}
          </div>
          {!r.soy_yo && !r.de_fabrica && <button className={`${boton} self-start`} onClick={() => guardar(r, null)}>Volver a los de fábrica</button>}
        </div>
      ))}
    </div>
  );
}
