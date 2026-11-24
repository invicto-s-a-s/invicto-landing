"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, botonPeligro, botonPrincipal, entrada } from "./PiezasDeModeracion";
import { SUSPENSION_LABEL, fechaYHora } from "./moderacion-tipos";

interface Estado {
  cuenta: { id: number; username: string; is_reviewer: boolean; suspendida: boolean };
  historial: {
    id: number; reason: string; public_message: string | null; note: string | null; until: string | null; created_at: string;
    created_by_username: string | null; lifted_at: string | null; lifted_by_username: string | null; lift_note: string | null;
  }[];
  escuelas: { club_id: number; nombre: string; jugadores: number; administran: number }[];
}

/** Suspender y levantar, dentro de la ficha de una cuenta. Suspender no borra nada. */
export default function SuspensionDeLaCuenta({ userId }: { userId: number }) {
  const [datos, setDatos] = useState<Estado | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [nota, setNota] = useState("");
  const [hasta, setHasta] = useState("");

  const cargar = useCallback(() =>
    llamarPanel<Estado>(`/admin/moderation/users/${userId}`).then((r) => {
      setError(r.ok ? null : (r.message ?? "No se pudo cargar."));
      setDatos(r.data);
    }), [userId]);

  useEffect(() => { void cargar(); }, [cargar]);

  const suspender = async (confirm_school = false) => {
    if (!motivo) { setError("Elige un motivo."); return; }
    if (!confirm_school && !confirm(`¿Suspender a @${datos?.cuenta.username}?\n\nNo podrá entrar, publicar ni escribir, y dejará de verse. No se borra nada.`)) return;
    setOcupado(true);
    const r = await llamarPanel(`/admin/moderation/users/${userId}/suspend`, "POST", {
      reason: motivo, public_message: mensaje || undefined, note: nota || undefined, confirm_school,
      // El último segundo de ese día en Colombia.
      until: hasta ? new Date(`${hasta}T23:59:59-05:00`).toISOString() : undefined,
    });
    setOcupado(false);
    if (!r.ok && r.code === "DUENO_DE_ESCUELA") {
      if (confirm(`${r.message}\n\n¿Suspenderla de todos modos?`)) await suspender(true);
      return;
    }
    setError(r.ok ? null : (r.message ?? "No se pudo suspender."));
    if (r.ok) { setMotivo(""); setMensaje(""); setNota(""); setHasta(""); }
    await cargar();
  };

  const levantar = async () => {
    const note = prompt("¿Por qué se levanta la suspensión? (queda en la bitácora)");
    if (note === null) return;
    setOcupado(true);
    const r = await llamarPanel(`/admin/moderation/users/${userId}/lift`, "POST", { note });
    setOcupado(false);
    setError(r.ok ? null : (r.message ?? "No se pudo levantar."));
    await cargar();
  };

  if (!datos) return error ? <Fallo>{error}</Fallo> : <p className="text-xs text-on-surface-variant">Cargando…</p>;
  const vigente = datos.historial.find((h) => !h.lifted_at);

  return (
    <div className="flex flex-col gap-3">
      {error && <Fallo>{error}</Fallo>}
      {datos.escuelas.map((e) => (
        <p key={e.club_id} className="text-xs text-[#FFB020]">
          Es la cuenta de {e.nombre} ({e.jugadores === 1 ? "1 jugador" : `${e.jugadores} jugadores`}).{" "}
          {e.administran === 0 ? "Nadie más la administra." : (e.administran === 1 ? "La administra 1 persona más." : `La administran ${e.administran} personas más.`)}
        </p>
      ))}

      {datos.cuenta.suspendida ? (
        <div className="border border-[#FF5A5A]/40 rounded-lg p-4 flex flex-col gap-2">
          <p className="text-sm">Suspendida{vigente?.until ? ` hasta el ${fechaYHora(vigente.until)}` : ""}</p>
          <button className={botonPrincipal} disabled={ocupado} onClick={levantar}>Levantar la suspensión</button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className={entrada} aria-label="Motivo">
            <option value="">Motivo…</option>
            {Object.entries(SUSPENSION_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <input value={mensaje} maxLength={300} onChange={(e) => setMensaje(e.target.value)} placeholder="Lo que lee la persona (opcional)" className={entrada} />
          <textarea value={nota} maxLength={1000} rows={2} onChange={(e) => setNota(e.target.value)} placeholder="Nota interna (opcional)" className={entrada} />
          <label className="text-xs text-on-surface-variant flex flex-col gap-1">
            Hasta (opcional: sin fecha, hasta que alguien la levante)
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className={entrada} />
          </label>
          <button className={botonPeligro} disabled={ocupado} onClick={() => suspender()}>Suspender la cuenta</button>
        </div>
      )}

      {datos.historial.map((h) => (
        <div key={h.id} className="bg-white/[0.035] rounded-lg px-3 py-2.5 text-xs flex flex-col gap-1">
          <p>{SUSPENSION_LABEL[h.reason] ?? h.reason} · {fechaYHora(h.created_at)} · @{h.created_by_username}</p>
          {h.note && <p className="text-on-surface-variant">{h.note}</p>}
          {h.lifted_at && <p className="text-on-surface-variant">Levantada el {fechaYHora(h.lifted_at)} por @{h.lifted_by_username}{h.lift_note ? `: ${h.lift_note}` : ""}</p>}
        </div>
      ))}
    </div>
  );
}
