"use client";

import { useCallback, useEffect, useState } from "react";
import EditorDelCatalogo from "./EditorDelCatalogo";
import { useCandadosAbiertos } from "./candados-abiertos";
import { type Edicion, type Plan, estadoDe, pesos, valorDe } from "./catalogo-tipos";

const MARCA = {
  sin_efecto: {
    texto: "Sin efecto",
    ayuda: "El código no consulta esta casilla: cambiarla no cambia nada. Casi todas son lo que los planes anuncian como «Próximamente»; la corona y el número de visitas sí funcionan, pero no dependen de ella.",
  },
  abierta: { texto: "Abierta para todos", ayuda: "Es un candado abierto: este valor se aplica cuando lo cierres en Candados." },
} as const;

const SEGMENTOS: Record<string, string> = { player: "Jugador", scout: "Ojeador", club: "Club", school: "Escuela" };

/**
 * El catálogo de planes, editable.
 *
 * Lo que se puede tocar es lo que el servidor deja: el nombre y el encendido de
 * un plan, **añadir** un precio (los precios son históricos: no se editan, se
 * añade otro con su fecha) y el valor de cada capacidad. Cada cambio queda en
 * la auditoría con quién lo hizo.
 */
export default function PlanCatalog() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/admin/plans")
      .then((r) => r.json())
      .then((body) => setPlans(Array.isArray(body.data) ? body.data : []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const [edicion, setEdicion] = useState<Edicion | null>(null);
  const abiertas = useCandadosAbiertos();

  const guardar = async (url: string, method: "PUT" | "POST" | "DELETE", body?: unknown): Promise<boolean> => {
    setError(null);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    }).catch(() => null);
    if (!res?.ok) {
      const data = await res?.json().catch(() => null);
      setError(typeof data?.message === "string" ? data.message : "No se pudo guardar el cambio.");
    }
    load();
    return !!res?.ok;
  };

  /** El editor va en la tarjeta del plan que se toca; `key` lo reinicia al cambiar de cosa. */
  const editorDe = (p: Plan, enCapacidades: boolean) => {
    if (!edicion || edicion.plan.key !== p.key) return null;
    const esDeCapacidad = edicion.tipo === "capacidad" || edicion.tipo === "quitar";
    if (esDeCapacidad !== enCapacidades) return null;
    const clave = `${edicion.tipo}-${p.key}-${esDeCapacidad ? edicion.f.feature_key : ""}`;
    return <EditorDelCatalogo key={clave} edicion={edicion} abiertas={abiertas} guardar={guardar} cerrar={() => setEdicion(null)} />;
  };

  if (loading) return <p className="text-sm text-on-surface-variant">Cargando el catálogo…</p>;

  return (
    <div>
      {error && <p className="text-sm text-[#FF5A5A] mb-3">{error}</p>}

      {Object.entries(SEGMENTOS).map(([segmento, etiqueta]) => {
        const suyos = plans.filter((p) => p.segment === segmento).sort((a, b) => a.tier - b.tier);
        if (suyos.length === 0) return null;
        return (
          <section key={segmento} className="mb-8">
            <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-on-surface-variant mb-3">{etiqueta}</h3>
            <div className="grid gap-3">
              {suyos.map((p) => (
                <div key={p.key} className={`admin-card border rounded-xl p-5 ${p.is_active ? "border-[#222]" : "border-[#222] opacity-60"}`}>
                  <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => setOpen(open === p.key ? null : p.key)} className="flex-1 min-w-0 text-left">
                      <p className="font-headline font-black italic text-lg leading-tight truncate">
                        {p.name}{p.is_default ? " · de entrada" : ""}{p.kind === "addon" ? " · complemento" : ""}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {p.key} · nivel {p.tier} · {p.features.length} capacidades
                        {p.features.some((f) => f.en_uso !== undefined) && `, ${p.features.filter((f) => f.en_uso).length} funcionan hoy`}
                        {" · "}{p.is_active ? "encendido" : "apagado"}
                      </p>
                    </button>
                    <button onClick={() => setEdicion({ tipo: "nombre", plan: p })} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Renombrar</button>
                    <button onClick={() => setEdicion({ tipo: "precio", plan: p })} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Añadir precio</button>
                    {!p.is_default && (
                      <button onClick={() => setEdicion({ tipo: "encendido", plan: p })} className="text-xs px-3 py-1.5 rounded-lg border border-[#333]">
                        {p.is_active ? "Apagar" : "Encender"}
                      </button>
                    )}
                  </div>

                  {editorDe(p, false)}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.prices.length === 0 && <span className="text-xs text-on-surface-variant">Sin precios.</span>}
                    {p.prices.map((pr) => (
                      <span key={pr.id} className="text-xs px-2.5 py-1 rounded-lg bg-[#141414]">
                        {pesos(pr.amount_cop)}/{pr.period === "year" ? "año" : "mes"}{" "}
                        <span className="text-on-surface-variant">
                          {pr.effective_from ? `desde ${new Date(pr.effective_from).toLocaleDateString("es-CO")}` : "de lista"}
                        </span>
                      </span>
                    ))}
                  </div>

                  {open === p.key && (
                    <div className="mt-4 border-t border-[#1C1C1C] pt-3 grid gap-1.5">
                      {p.features.map((f) => {
                        const estado = estadoDe(f, abiertas);
                        return (
                          <div key={f.feature_key} className={`flex items-center gap-3 text-xs ${f.feature_active ? "" : "opacity-50"}`}>
                            <span className={`flex-1 min-w-0 ${estado === "sin_efecto" ? "text-on-surface-variant" : ""}`}>
                              {f.description} <span className="text-on-surface-variant">({f.feature_key})</span>
                            </span>
                            {estado && (
                              <span title={MARCA[estado].ayuda} className={`px-2 py-0.5 rounded-md whitespace-nowrap ${estado === "abierta" ? "bg-neon/10 text-neon" : "bg-[#1A1A1A] text-[#FFB020]"}`}>
                                {MARCA[estado].texto}
                              </span>
                            )}
                            <button onClick={() => setEdicion({ tipo: "capacidad", plan: p, f })} className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] whitespace-nowrap">
                              {valorDe(f)}
                            </button>
                            <button
                              onClick={() => setEdicion({ tipo: "quitar", plan: p, f })}
                              className="text-[#FF5A5A]"
                              aria-label={`Quitar ${f.description}`}
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                      {editorDe(p, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
