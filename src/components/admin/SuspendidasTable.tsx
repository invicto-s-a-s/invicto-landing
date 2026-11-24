"use client";

import { useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, Vacio, boton } from "./PiezasDeModeracion";
import { Pagina, SUSPENSION_LABEL, Suspendida, fechaYHora } from "./moderacion-tipos";

/** Las cuentas suspendidas hoy. Se levantan desde su ficha. */
export default function SuspendidasTable({ onAbrirCuenta }: { onAbrirCuenta: (id: number) => void }) {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<Pagina<Suspendida> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    llamarPanel<Pagina<Suspendida>>(`/admin/moderation/suspensions?page=${pagina}&limit=20`).then((r) => {
      setError(r.ok ? null : (r.message ?? "No se pudieron cargar."));
      setDatos(r.data);
    });
  }, [pagina]);

  return (
    <div className="flex flex-col gap-3">
      {error && <Fallo>{error}</Fallo>}
      {!datos && !error && <p className="text-xs text-on-surface-variant">Cargando…</p>}
      {datos?.items.length === 0 && <Vacio>No hay cuentas suspendidas.</Vacio>}
      {datos?.items.map((s) => (
        <div key={s.user_id} className="admin-card border border-[#222] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">@{s.username}</p>
            <p className="text-xs text-on-surface-variant">
              {SUSPENSION_LABEL[s.reason ?? ""] ?? s.reason ?? "Sin motivo"} · desde el {fechaYHora(s.created_at)} · @{s.created_by_username ?? "—"}
            </p>
            <p className="text-xs text-on-surface-variant">{s.until ? `Hasta el ${fechaYHora(s.until)}` : "Hasta que alguien la levante"}</p>
          </div>
          <button className={boton} onClick={() => onAbrirCuenta(s.user_id)}>Abrir la cuenta</button>
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
