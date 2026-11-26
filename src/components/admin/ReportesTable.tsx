"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import EvidenciaDelReporte from "./EvidenciaDelReporte";
import { Fallo, Filtro, Vacio, boton, botonPeligro, botonPrincipal } from "./PiezasDeModeracion";
import { CLASE_LABEL, Clase, MOTIVO_LABEL, Pagina, Permiso, Reportado, fechaYHora } from "./moderacion-tipos";
import { useDialogo } from "./Dialogo";

const ESTADOS = [
  { value: "open", label: "Abiertos" }, { value: "removed", label: "Quitados" },
  { value: "suspended", label: "Con suspensión" }, { value: "dismissed", label: "Descartados" },
] as const;
const CLASES = [
  { value: "", label: "Todo" }, { value: "post", label: "Publicaciones" }, { value: "user", label: "Cuentas" },
  { value: "comment", label: "Comentarios" }, { value: "message", label: "Mensajes" },
] as const;

/** Todo lo reportado. Sin quién reportó, y sin lo que sea de quien revisa: eso lo decide el servidor. */
export default function ReportesTable({ permisos, onAbrirCuenta }: { permisos: readonly Permiso[]; onAbrirCuenta: (id: number) => void }) {
  const dialogo = useDialogo();
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]["value"]>("open");
  const [clase, setClase] = useState<"" | Clase>("");
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<Pagina<Reportado> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [viendo, setViendo] = useState<Reportado | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<Pagina<Reportado>>(`/admin/moderation/reports?status=${estado}&kind=${clase}&page=${pagina}&limit=20`).then((r) => {
      setError(r.ok ? null : (r.message ?? "No se pudieron cargar los reportes."));
      setDatos(r.data);
    }), [estado, clase, pagina]);

  useEffect(() => { void cargar(); }, [cargar]);

  const resolver = async (r: Reportado, action: "dismiss" | "remove") => {
    const que = CLASE_LABEL[r.kind].toLowerCase();
    const ok = await dialogo.confirmar(action === "remove"
      ? { titulo: `¿Quitar ${r.kind === "post" ? "esta" : "este"} ${que}?`, boton: "Quitar", peligro: true, texto: "Deja de verse en la app. Su copia y sus archivos se conservan como evidencia." }
      : { titulo: "¿Descartar estos reportes?", boton: "Descartar", texto: "No se quita nada y salen de los abiertos." });
    if (!ok) return;
    const clave = `${r.kind}-${r.target_id}`;
    setOcupado(clave);
    const res = await llamarPanel(`/admin/moderation/reports/${r.kind}/${r.target_id}/resolve`, "POST", { action });
    setError(res.ok ? null : (res.message ?? "No se pudo guardar."));
    setOcupado(null);
    await cargar();
  };

  return (
    <div className="flex flex-col gap-4">
      <Filtro opciones={ESTADOS} valor={estado} onCambiar={(v) => { setEstado(v); setPagina(1); }} />
      <Filtro opciones={CLASES} valor={clase} onCambiar={(v) => { setClase(v); setPagina(1); }} />
      {error && <Fallo>{error}</Fallo>}
      {!datos && !error && <p className="text-xs text-on-surface-variant">Cargando…</p>}
      {datos?.items.length === 0 && <Vacio>No hay reportes aquí.</Vacio>}

      {datos?.items.map((r) => {
        const clave = `${r.kind}-${r.target_id}`;
        return (
          <article key={clave} className="admin-card border border-[#222] rounded-xl p-5 flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">{CLASE_LABEL[r.kind]}</p>
                <button onClick={() => onAbrirCuenta(r.author_user_id)} className="font-headline font-black italic text-lg hover:text-neon">
                  @{r.author_username ?? `cuenta ${r.author_user_id}`}
                </button>
                {r.author_suspended && <span className="ml-2 text-[10px] font-mono uppercase text-[#FF5A5A]">Suspendida</span>}
              </div>
              <p className="text-xs text-on-surface-variant text-right">
                {r.reporters === 1 ? "1 persona" : `${r.reporters} personas`}<br />{fechaYHora(r.last_reported_at)}
              </p>
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">{r.content || <span className="text-on-surface-variant">Sin texto</span>}</p>
            <div className="flex flex-wrap gap-2">
              {r.reasons.map((m) => (
                <span key={m.reason} className={`text-[11px] px-2 py-1 rounded border ${m.reason === "menor_en_riesgo" ? "border-[#FF5A5A] text-[#FF5A5A]" : "border-[#333]"}`}>
                  {MOTIVO_LABEL[m.reason] ?? m.reason} ({m.count})
                </span>
              ))}
            </div>
            {r.details.slice(0, 5).map((d, i) => <p key={i} className="text-xs text-on-surface-variant italic">«{d}»</p>)}
            <div className="flex flex-wrap gap-2">
              {permisos.includes("evidencia") && <button className={boton} onClick={() => setViendo(r)}>Ver evidencia ({r.files})</button>}
              {r.status === "open" && (
                <>
                  <button className={boton} disabled={ocupado === clave} onClick={() => resolver(r, "dismiss")}>Descartar</button>
                  {r.kind !== "user" && <button className={botonPeligro} disabled={ocupado === clave} onClick={() => resolver(r, "remove")}>Quitar</button>}
                  {permisos.includes("suspender") && <button className={botonPrincipal} onClick={() => onAbrirCuenta(r.author_user_id)}>Revisar la cuenta</button>}
                </>
              )}
            </div>
          </article>
        );
      })}

      {datos && (pagina > 1 || datos.has_more) && (
        <div className="flex gap-2">
          <button className={boton} disabled={pagina === 1} onClick={() => setPagina((p) => p - 1)}>Anterior</button>
          <button className={boton} disabled={!datos.has_more} onClick={() => setPagina((p) => p + 1)}>Siguiente</button>
        </div>
      )}
      {viendo && <EvidenciaDelReporte reportado={viendo} onCerrar={() => setViendo(null)} />}
    </div>
  );
}
