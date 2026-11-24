"use client";

import { useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo } from "./PiezasDeModeracion";
import { CLASE_LABEL, Copia, Reportado, fechaYHora } from "./moderacion-tipos";

const ESTADO: Record<string, string> = {
  publico: "Sigue publicado", por_mover: "Lo borraron: se está apartando", privado: "Guardado en privado", purgado: "Ya se eliminó",
};

/** Las copias de lo reportado. Abrirlas queda en la bitácora; los enlaces caducan en cinco minutos. */
export default function EvidenciaDelReporte({ reportado, onCerrar }: { reportado: Reportado; onCerrar: () => void }) {
  const [copias, setCopias] = useState<Copia[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    llamarPanel<{ items: Copia[] }>(`/admin/moderation/reports/${reportado.kind}/${reportado.target_id}/evidence`).then((r) => {
      if (!vivo) return;
      setError(r.ok ? null : (r.message ?? "No se pudo abrir la evidencia."));
      setCopias(r.data?.items ?? []);
    });
    return () => { vivo = false; };
  }, [reportado.kind, reportado.target_id]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onCerrar}>
      <div className="admin-surface border border-[#222] rounded-xl p-5 w-full max-w-xl max-h-[85vh] overflow-y-auto flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-headline font-black italic text-xl">Evidencia · {CLASE_LABEL[reportado.kind]}</h2>
          <button onClick={onCerrar} aria-label="Cerrar"><span className="material-symbols-outlined">close</span></button>
        </div>
        <p className="text-xs text-on-surface-variant">Solo para revisar el reporte. Que la abriste queda registrado.</p>
        {error && <Fallo>{error}</Fallo>}
        {!copias && !error && <p className="text-xs text-on-surface-variant">Cargando…</p>}
        {copias?.length === 0 && !error && <p className="text-sm text-on-surface-variant">No se guardó ninguna copia.</p>}
        {copias?.map((c) => (
          <section key={c.id} className="border-t border-[#222] pt-4 flex flex-col gap-2">
            <p className="text-[11px] text-on-surface-variant">
              Guardada el {fechaYHora(c.captured_at)}
              {c.purged ? " · Ya venció y se eliminó" : c.expires_at ? ` · Se conserva hasta el ${fechaYHora(c.expires_at)}` : ""}
            </p>
            {typeof c.snapshot.username === "string" && <p className="text-xs">@{c.snapshot.username}</p>}
            {c.content && <p className="text-sm whitespace-pre-wrap break-words">{c.content}</p>}
            {c.files.map((f) => (
              <div key={f.id} className="text-xs flex flex-wrap items-center gap-3">
                {f.url ? <a href={f.url} target="_blank" rel="noopener noreferrer" className="underline">Abrir archivo ↗</a> : <span>Archivo</span>}
                <span className="text-on-surface-variant">{ESTADO[f.state] ?? f.state}</span>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
