"use client";

import { useCallback, useEffect, useState } from "react";
import FormularioDeLinea, { type Contenido } from "./FormularioDeLinea";
import LineaDelPlan from "./LineaDelPlan";
import type { Linea } from "./catalogo-tipos";

/** El mensaje del servidor si es para una persona; el de fábrica de Nest («Cannot GET…») no lo es. */
const mensaje = (body: { message?: unknown } | null, porDefecto: string) =>
  typeof body?.message === "string" && !body.message.startsWith("Cannot ") ? body.message : porDefecto;

type Leido = { lineas: Linea[] | null; error: string };

async function leer(url: string): Promise<Leido> {
  const res = await fetch(url).catch(() => null);
  const body = await res?.json().catch(() => null);
  if (res?.ok && Array.isArray(body?.data)) return { lineas: body.data, error: "" };
  return { lineas: null, error: mensaje(body, "No fue posible cargar las líneas de este plan.") };
}

/**
 * Las líneas que el plan enseña en la app («destacados»), editables.
 *
 * Es lo que lee quien mira la tarjeta del plan, no lo que el plan concede: eso
 * son las capacidades. Por eso cambiar una línea no cambia lo que una cuenta
 * puede hacer. Cada escritura responde con las líneas tal como quedaron, y es
 * eso lo que se pinta: lo guardado, no lo que se cree que se guardó.
 */
export default function LineasDelPlan({ planKey, planName }: { planKey: string; planName: string }) {
  const base = `/api/admin/admin/plans/${planKey}/highlights`;
  const [lineas, setLineas] = useState<Linea[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [añadiendo, setAñadiendo] = useState(false);

  /** Lo que el servidor tiene. `trasUnFallo`: el aviso del cambio que falló se queda; no lo tapa el de la recarga. */
  const aplicar = useCallback((r: Leido, trasUnFallo = false) => {
    if (r.lineas) { setLineas(r.lineas); return; }
    setLineas((antes) => antes ?? []);
    if (!trasUnFallo) setError(r.error);
  }, []);

  useEffect(() => {
    let vigente = true;
    leer(base).then((r) => { if (vigente) aplicar(r); });
    return () => { vigente = false; };
  }, [base, aplicar]);

  const enviar = async (url: string, method: "POST" | "PUT" | "DELETE", body?: unknown): Promise<boolean> => {
    setBusy(true);
    setError(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setBusy(false);
    if (res?.ok && Array.isArray(data?.data)) {
      setLineas(data.data);
      return true;
    }
    setError(mensaje(data, "No fue posible guardar el cambio. Inténtalo nuevamente."));
    // Lo que quedó en el servidor manda: si otra persona cambió algo, se ve.
    void leer(base).then((r) => aplicar(r, true));
    return false;
  };

  const mover = (i: number, delta: -1 | 1) => {
    if (!lineas) return;
    const ids = lineas.map((l) => l.id);
    const j = i + delta;
    if (j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    void enviar(base, "PUT", { ids });
  };

  const añadir = async (c: Contenido) => {
    if (await enviar(base, "POST", c)) setAñadiendo(false);
  };

  return (
    <div className="mt-4 border-t border-[#1C1C1C] pt-3 grid gap-2">
      <p className="text-xs text-on-surface-variant">
        Lo que la tarjeta de {planName} muestra en la app, en este orden. Los cambios se verán la próxima vez que alguien abra los planes.
      </p>
      {error && <p className="text-sm text-[#FF5A5A]">{error}</p>}
      {lineas === null && <p className="text-sm text-on-surface-variant">Cargando las líneas…</p>}
      {lineas?.length === 0 && !error && (
        <p className="text-sm text-on-surface-variant">Este plan aún no tiene líneas. Añade la primera para que la app la muestre.</p>
      )}
      {lineas?.map((l, i) => (
        <LineaDelPlan
          key={l.id}
          linea={l}
          esPrimera={i === 0}
          esUltima={i === lineas.length - 1}
          busy={busy}
          onEditar={(c) => enviar(`${base}/${l.id}`, "PUT", c)}
          onMover={(d) => mover(i, d)}
          onEliminar={() => enviar(`${base}/${l.id}`, "DELETE")}
        />
      ))}
      {lineas !== null && (añadiendo
        ? <FormularioDeLinea accion="Añadir línea" busy={busy} onGuardar={(c) => void añadir(c)} onCancelar={() => setAñadiendo(false)} />
        : (
          <button onClick={() => setAñadiendo(true)} disabled={busy} className="justify-self-start text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">
            Añadir línea
          </button>
        ))}
    </div>
  );
}
