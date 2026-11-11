"use client";

import { useCallback, useEffect, useState } from "react";

const RUTA = "/api/admin/admin/parameters/launch.open_features";

/**
 * Los candados que existen, con lo que pasa al cerrarlos. Tiene que ir a la par
 * de `invicto-back`: `PlanGate` y la migración `candados-abiertos-por-lanzamiento`.
 */
const CANDADOS = [
  { key: "search.advanced", nombre: "Filtros avanzados del ojeador", cerrado: "Subposición, pierna hábil, con o sin club, con clips y evaluado quedan desde Básico." },
  { key: "radar.compare", nombre: "Comparativas VS", cerrado: "Ver y guardar comparativas queda desde Scout PRO." },
  { key: "report.pdf_export", nombre: "Exportar a PDF", cerrado: "El PDF del reporte y de la comparativa queda desde Scout PRO. Lo aplica la app." },
  { key: "watchlist.max", nombre: "Perfiles guardados", cerrado: "30 en Gratis, 300 en Básico, sin tope desde PRO. Quien ya tenga más los conserva, pero no guarda otro." },
  { key: "messages.monthly", nombre: "Mensajes del ojeador al mes", cerrado: "10, 100, 300 y 1.000 según el plan. Cuentan todos los que envía." },
  { key: "convocatorias.yearly_max", nombre: "Convocatorias al año", cerrado: "2 al año en Club Gratis y en todas las escuelas, según el catálogo de hoy." },
  { key: "search.scope", nombre: "Búsqueda nacional de clubes", cerrado: "Un club busca solo entre quienes se postularon a sus convocatorias, salvo Cantera." },
  { key: "panel.full", nombre: "Panel completo del club", cerrado: "Partidos, embudo de convocatorias, cara a cara y alineación quedan desde Regional. Las escuelas de pago no lo tienen en el catálogo de hoy." },
] as const;

const leer = (valor: string) =>
  new Set(valor.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean));

/**
 * Abrir y cerrar los candados por plan.
 *
 * Las funciones que dependen del plan **nacieron abiertas para todos**, para
 * que al estrenarlas nadie perdiera lo que ya usaba. Cerrar una la deja en
 * manos del plan de cada cuenta; tarda cerca de un minuto en notarse.
 *
 * Se guarda al tocar, de una en una, y **sobre lo que hay en el servidor**: se
 * relee antes de escribir para no pisar el cambio de otra persona.
 */
export default function PlanGates() {
  const [abiertas, setAbiertas] = useState<Set<string> | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback((): Promise<Set<string> | null> =>
    fetch(RUTA)
      .then(async (res) => ({ ok: res.ok, body: await res.json().catch(() => null) }))
      .catch(() => ({ ok: false, body: null }))
      .then(({ ok, body }) => {
        if (!ok || typeof body?.data?.value !== "string") {
          setError(typeof body?.message === "string" ? body.message : "No se pudieron leer los candados.");
          return null;
        }
        const lista = leer(body.data.value);
        setAbiertas(lista);
        return lista;
      }), []);

  useEffect(() => { void cargar(); }, [cargar]);

  const cambiar = async (key: string, nombre: string, cerrado: string) => {
    if (busy) return;
    const estaAbierta = abiertas?.has(key) ?? false;
    const frase = estaAbierta
      ? `¿Cerrar «${nombre}»?\n\n${cerrado}\n\nQuien no tenga el plan deja de poder usarlo en cerca de un minuto.`
      : `¿Abrir «${nombre}» a todas las cuentas, tengan el plan que tengan?`;
    if (!confirm(frase)) return;

    setBusy(key);
    setError(null);
    const actual = await cargar();
    if (actual) {
      const nueva = new Set(actual);
      if (estaAbierta) nueva.delete(key); else nueva.add(key);
      // El parámetro no puede quedar vacío: «ninguna» no es clave de nada.
      const value = CANDADOS.map((c) => c.key).filter((k) => nueva.has(k)).join(",") || "ninguna";
      const res = await fetch(RUTA, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      }).catch(() => null);
      const body = await res?.json().catch(() => null);
      if (!res?.ok) setError(typeof body?.message === "string" ? body.message : "No se pudo guardar el cambio.");
      await cargar();
    }
    setBusy(null);
  };

  if (!abiertas && !error) return <p className="text-sm text-on-surface-variant">Cargando…</p>;

  return (
    <div className="grid gap-3 max-w-3xl">
      <p className="text-sm text-on-surface-variant">
        Lo que está <strong className="text-neon">abierto</strong> lo usa todo el mundo, tenga el plan que tenga.
        Lo <strong>cerrado</strong> depende del plan de cada cuenta. Los topes y los planes se editan en Catálogo.
      </p>

      {error && <p className="text-sm text-[#FF5A5A]">{error}</p>}

      {abiertas && CANDADOS.map((c) => {
        const abierta = abiertas.has(c.key);
        return (
          <div key={c.key} className="admin-card border border-[#222] rounded-xl p-4 flex flex-wrap items-start gap-3 justify-between">
            <div className="min-w-0 flex-1 basis-64">
              <p className="text-sm font-medium">{c.nombre}</p>
              <p className="text-xs text-on-surface-variant mt-1">{c.cerrado}</p>
              <p className="text-[11px] text-on-surface-variant/60 mt-1 font-mono">{c.key}</p>
            </div>
            <button
              onClick={() => cambiar(c.key, c.nombre, c.cerrado)}
              disabled={busy !== null}
              className={`text-xs px-4 py-2 rounded-lg shrink-0 disabled:opacity-40 ${abierta ? "bg-neon text-background font-medium" : "border border-[#444] text-on-surface-variant"}`}
            >
              {busy === c.key ? "…" : abierta ? "Abierto a todos" : "Según el plan"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
