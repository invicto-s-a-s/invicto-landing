"use client";

import { useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, Vacio, boton } from "./PiezasDeModeracion";
import { Pagina, fechaYHora } from "./moderacion-tipos";

interface Entrada {
  id: number; action: string; actor_username: string | null; target_kind: string | null; target_id: number | null;
  target_username: string | null; detail: Record<string, unknown>; created_at: string;
}

const ACCION: Record<string, string> = {
  suspender: "suspendió a", levantar: "levantó la suspensión de", descartar: "descartó un reporte de", quitar: "quitó algo de",
  ver_evidencia: "abrió la evidencia de", permisos: "cambió los permisos de", ajuste: "cambió un ajuste", palabra_mas: "añadió una palabra",
  palabra_menos: "quitó una palabra", solicitud: "borró una solicitud",
};

export default function BitacoraDeModeracion() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<Pagina<Entrada> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    llamarPanel<Pagina<Entrada>>(`/admin/moderation/log?page=${pagina}&limit=50`).then((r) => {
      setDatos(r.data);
      setError(r.ok ? null : (r.message ?? "No se pudo cargar."));
    });
  }, [pagina]);

  return (
    <div className="flex flex-col gap-2 max-w-3xl">
      {error && <Fallo>{error}</Fallo>}
      {datos?.items.length === 0 && <Vacio>Todavía no hay nada.</Vacio>}
      {datos?.items.map((e) => (
        <div key={e.id} className="bg-white/[0.035] rounded-lg px-3 py-2.5 text-xs flex flex-wrap justify-between gap-2">
          <span>
            @{e.actor_username ?? "—"} {ACCION[e.action] ?? e.action} {e.target_username ? `@${e.target_username}` : ""}
            {typeof e.detail.key === "string" ? ` ${e.detail.key}: ${String(e.detail.antes)} → ${String(e.detail.despues)}` : ""}
          </span>
          <span className="text-on-surface-variant">{fechaYHora(e.created_at)}</span>
        </div>
      ))}
      {datos && (pagina > 1 || datos.has_more) && (
        <div className="flex gap-2">
          <button className={boton} disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
          <button className={boton} disabled={!datos.has_more} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
        </div>
      )}
    </div>
  );
}
