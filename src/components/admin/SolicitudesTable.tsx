"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, Filtro, Vacio, boton, botonPeligro, entrada } from "./PiezasDeModeracion";
import { Pagina, fechaYHora } from "./moderacion-tipos";

interface Solicitud {
  id: number; name: string; email: string; phone: string | null; kind: string; organization: string | null; city: string | null;
  message: string; consent_version: string; consent_at: string; status: string; notes: string | null; mail_state: string;
  handled_by_username: string | null; created_at: string;
}

const ESTADOS = [
  { value: "nueva", label: "Nuevas" }, { value: "en_curso", label: "En curso" }, { value: "cerrada", label: "Cerradas" }, { value: "spam", label: "Spam" },
] as const;
const CORREO: Record<string, string> = { enviado: "Avisada por correo", fallo: "El correo de aviso no salió", sin_buzon: "Sin buzón configurado" };

/** Lo que llega por el formulario de la web. */
export default function SolicitudesTable() {
  const [estado, setEstado] = useState<(typeof ESTADOS)[number]["value"]>("nueva");
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<Pagina<Solicitud> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notas, setNotas] = useState<Record<number, string>>({});

  const cargar = useCallback(() =>
    llamarPanel<Pagina<Solicitud>>(`/admin/contact-requests?status=${estado}&page=${pagina}&limit=20`).then((r) => {
      setError(r.ok ? null : (r.message ?? "No se pudieron cargar las solicitudes."));
      setDatos(r.data);
    }), [estado, pagina]);

  useEffect(() => { void cargar(); }, [cargar]);

  const guardar = async (id: number, cambios: { status?: string; notes?: string }) => {
    const r = await llamarPanel(`/admin/contact-requests/${id}`, "PUT", cambios);
    setError(r.ok ? null : (r.message ?? "No se pudo guardar."));
    await cargar();
  };
  const borrar = async (id: number) => {
    if (!confirm("¿Borrar esta solicitud?\n\nEs para cuando la persona pide que eliminen sus datos. No se puede deshacer.")) return;
    const r = await llamarPanel(`/admin/contact-requests/${id}`, "DELETE");
    setError(r.ok ? null : (r.message ?? "No se pudo borrar."));
    await cargar();
  };

  return (
    <div className="flex flex-col gap-4">
      <Filtro opciones={ESTADOS} valor={estado} onCambiar={(v) => { setEstado(v); setPagina(1); }} />
      {error && <Fallo>{error}</Fallo>}
      {!datos && !error && <p className="text-xs text-on-surface-variant">Cargando…</p>}
      {datos?.items.length === 0 && <Vacio>No hay solicitudes aquí.</Vacio>}
      {datos?.items.map((s) => (
        <article key={s.id} className="admin-card border border-[#222] rounded-xl p-5 flex flex-col gap-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-headline font-black italic text-lg">{s.name}</p>
              <p className="text-xs text-on-surface-variant">
                {[s.kind, s.organization, s.city].filter(Boolean).join(" · ")}
              </p>
              <p className="text-xs"><a className="underline" href={`mailto:${s.email}`}>{s.email}</a>{s.phone ? ` · ${s.phone}` : ""}</p>
            </div>
            <p className="text-xs text-on-surface-variant text-right">{fechaYHora(s.created_at)}<br />{CORREO[s.mail_state] ?? s.mail_state}</p>
          </div>
          <p className="text-sm whitespace-pre-wrap break-words">{s.message}</p>
          <p className="text-[11px] text-on-surface-variant">Autorizó el {fechaYHora(s.consent_at)} (texto {s.consent_version})</p>
          <textarea
            className={entrada} rows={2} maxLength={2000} placeholder="Notas del equipo"
            value={notas[s.id] ?? s.notes ?? ""} onChange={(e) => setNotas((n) => ({ ...n, [s.id]: e.target.value }))}
          />
          <div className="flex flex-wrap gap-2">
            <button className={boton} onClick={() => guardar(s.id, { notes: notas[s.id] ?? s.notes ?? "" })}>Guardar notas</button>
            {ESTADOS.filter((e) => e.value !== s.status).map((e) => (
              <button key={e.value} className={boton} onClick={() => guardar(s.id, { status: e.value })}>Pasar a {e.label.toLowerCase()}</button>
            ))}
            <button className={botonPeligro} onClick={() => borrar(s.id)}>Borrar</button>
          </div>
        </article>
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
