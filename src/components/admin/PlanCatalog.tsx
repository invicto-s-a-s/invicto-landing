"use client";

import { useCallback, useEffect, useState } from "react";
import EditorDelCatalogo from "./EditorDelCatalogo";
import AnadirCapacidad from "./AnadirCapacidad";
import CrearPlan from "./CrearPlan";
import TarjetaDelPlan from "./TarjetaDelPlan";
import UserDetail from "./UserDetail";
import { useCandadosAbiertos } from "./candados-abiertos";
import { type Conteo, type Edicion, type Plan, SEGMENTOS } from "./catalogo-tipos";
import { llamarPanel } from "./panel-api";

/**
 * El catálogo de planes, editable.
 *
 * Lo que se puede tocar es lo que el servidor deja: crear un plan (también a la
 * medida de un cliente, privado), su nombre, si está activado o es privado,
 * **añadir** un precio (los precios son históricos: no se editan, se añade otro
 * con su fecha), el valor de cada capacidad, sumarle otras y las líneas que la
 * tarjeta del plan enseña en la app. En cada tarjeta se ve cuántas cuentas
 * tienen el plan y cuáles. Cada cambio queda en la auditoría con quién lo hizo.
 */
export default function PlanCatalog() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [conteos, setConteos] = useState<Map<string, Conteo>>(new Map());
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** Lo que el servidor hizo de más: los planes de arriba que también cambiaron. */
  const [aviso, setAviso] = useState<string | null>(null);
  const [creando, setCreando] = useState(false);
  const [cuenta, setCuenta] = useState<number | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/admin/plans")
      .then((r) => r.json())
      .then((body) => setPlans(Array.isArray(body.data) ? body.data : []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
    llamarPanel<Conteo[]>("/admin/plans/accounts")
      .then((r) => setConteos(new Map((r.data ?? []).map((c) => [c.key, c]))));
  }, []);

  useEffect(() => { load(); }, [load]);

  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const abiertas = useCandadosAbiertos();

  const guardar = async (url: string, method: "PUT" | "POST" | "DELETE", body?: unknown): Promise<boolean> => {
    setError(null);
    setAviso(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    if (!res?.ok) {
      setError(typeof data?.message === "string" ? data.message : "No fue posible guardar el cambio.");
    } else if (Array.isArray(data?.data?.arrastradas) && data.data.arrastradas.length > 0) {
      setAviso(`Guardado. También quedó en ${data.data.arrastradas.join(", ")}, que están por encima.`);
    }
    load();
    return !!res?.ok;
  };

  /** El editor va en la tarjeta del plan que se toca; `key` lo reinicia al cambiar de cosa. */
  const editorDe = (p: Plan, enCapacidades: boolean) => {
    if (!edicion || edicion.plan.key !== p.key) return null;
    const cerrar = () => setEdicion(null);
    if (edicion.tipo === "añadir") {
      return enCapacidades ? <AnadirCapacidad key={`añadir-${p.key}`} plan={p} guardar={guardar} cerrar={cerrar} /> : null;
    }
    const esDeCapacidad = edicion.tipo === "capacidad" || edicion.tipo === "quitar";
    if (esDeCapacidad !== enCapacidades) return null;
    const clave = `${edicion.tipo}-${p.key}-${esDeCapacidad ? edicion.f.feature_key : ""}`;
    return <EditorDelCatalogo key={clave} edicion={edicion} abiertas={abiertas} guardar={guardar} cerrar={cerrar} />;
  };

  if (loading) return <p className="text-sm text-on-surface-variant">Cargando el catálogo…</p>;

  return (
    <div>
      {creando ? (
        <CrearPlan
          planes={plans}
          cerrar={() => setCreando(false)}
          onCreado={(key) => { setCreando(false); setOpen(key); load(); }}
        />
      ) : (
        <button onClick={() => setCreando(true)} className="text-sm px-4 py-2 rounded-lg bg-neon text-background font-medium mb-6">
          Crear un plan
        </button>
      )}

      {error && <p className="text-sm text-[#FF5A5A] mb-3">{error}</p>}
      {aviso && <p className="text-sm text-primary mb-3">{aviso}</p>}

      {Object.entries(SEGMENTOS).map(([segmento, etiqueta]) => {
        const suyos = plans.filter((p) => p.segment === segmento).sort((a, b) => a.tier - b.tier);
        if (suyos.length === 0) return null;
        return (
          <section key={segmento} className="mb-8">
            <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-3">{etiqueta}</h3>
            <div className="grid gap-3">
              {suyos.map((p) => (
                <TarjetaDelPlan
                  key={p.key}
                  p={p}
                  conteo={conteos.get(p.key) ?? null}
                  abiertas={abiertas}
                  abierto={open === p.key}
                  onAbrir={() => setOpen(open === p.key ? null : p.key)}
                  editar={setEdicion}
                  editor={(enCapacidades) => editorDe(p, enCapacidades)}
                  onAbrirCuenta={setCuenta}
                  onCambio={load}
                />
              ))}
            </div>
          </section>
        );
      })}

      {cuenta !== null && <UserDetail userId={cuenta} onClose={() => { setCuenta(null); load(); }} />}
    </div>
  );
}
