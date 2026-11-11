"use client";

import { useCallback, useEffect, useState } from "react";

interface Price { id: number; period: "month" | "year"; amount_cop: number; effective_from: string | null }
interface Feature {
  feature_key: string; kind: "bool" | "limit" | "value"; area: string; description: string;
  bool_value: boolean | null; limit_value: number | null; text_value: string | null; feature_active: boolean;
}
interface Plan {
  key: string; name: string; segment: string; kind: string; tier: number;
  is_default: boolean; is_active: boolean; prices: Price[]; features: Feature[];
}

const SEGMENTOS: Record<string, string> = { player: "Jugador", scout: "Ojeador", club: "Club", school: "Escuela" };
const pesos = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;

/** El valor de una capacidad en un plan, dicho en corto. */
function valorDe(f: Feature): string {
  if (f.kind === "bool") return f.bool_value ? "Sí" : "No";
  if (f.kind === "limit") return f.limit_value === null ? "Sin tope" : String(f.limit_value);
  return f.text_value ?? "—";
}

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

  const guardar = async (url: string, method: "PUT" | "POST" | "DELETE", body?: unknown) => {
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
  };

  const renombrar = (p: Plan) => {
    const name = prompt(`Nombre del plan (${p.key})`, p.name);
    if (name?.trim() && name.trim() !== p.name) void guardar(`/api/admin/admin/plans/${p.key}`, "PUT", { name: name.trim() });
  };

  const encender = (p: Plan) => {
    const frase = p.is_active
      ? `¿Apagar el plan ${p.name}?\n\nQuien lo tenga cae a su plan de entrada.`
      : `¿Encender el plan ${p.name}?`;
    if (confirm(frase)) void guardar(`/api/admin/admin/plans/${p.key}`, "PUT", { is_active: !p.is_active });
  };

  const anadirPrecio = (p: Plan) => {
    const periodo = prompt("¿Mensual o anual? Escribe «mes» o «año».", "mes");
    if (!periodo) return;
    const monto = prompt("Precio en pesos, sin puntos. 0 es gratis.");
    if (monto === null || !/^\d+$/.test(monto.trim())) return;
    const desde = prompt("¿Desde qué fecha rige? AAAA-MM-DD. Vacío = precio de lista, sin fecha (se enseña y no se cobra).", "");
    if (desde === null) return;
    void guardar(`/api/admin/admin/plans/${p.key}/prices`, "POST", {
      period: periodo.trim().toLowerCase().startsWith("a") ? "year" : "month",
      amount_cop: Number(monto.trim()),
      effective_from: desde.trim() || null,
    });
  };

  const cambiarCapacidad = (p: Plan, f: Feature) => {
    const url = `/api/admin/admin/plans/${p.key}/features/${f.feature_key}`;
    if (f.kind === "bool") return void guardar(url, "PUT", { bool_value: !f.bool_value });
    if (f.kind === "limit") {
      const v = prompt(`${f.description}\n\nTope para ${p.name}. Vacío = sin tope.`, f.limit_value === null ? "" : String(f.limit_value));
      if (v === null) return;
      if (v.trim() !== "" && !/^\d+$/.test(v.trim())) { setError("El tope es un número entero."); return; }
      return void guardar(url, "PUT", { limit_value: v.trim() === "" ? null : Number(v.trim()) });
    }
    const v = prompt(`${f.description}\n\nValor para ${p.name}.`, f.text_value ?? "");
    if (v !== null) void guardar(url, "PUT", { text_value: v.trim() || null });
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
                        {p.key} · nivel {p.tier} · {p.features.length} capacidades · {p.is_active ? "encendido" : "apagado"}
                      </p>
                    </button>
                    <button onClick={() => renombrar(p)} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Renombrar</button>
                    <button onClick={() => anadirPrecio(p)} className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A]">Añadir precio</button>
                    {!p.is_default && (
                      <button onClick={() => encender(p)} className="text-xs px-3 py-1.5 rounded-lg border border-[#333]">
                        {p.is_active ? "Apagar" : "Encender"}
                      </button>
                    )}
                  </div>

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
                      {p.features.map((f) => (
                        <div key={f.feature_key} className={`flex items-center gap-3 text-xs ${f.feature_active ? "" : "opacity-50"}`}>
                          <span className="flex-1 min-w-0">
                            {f.description} <span className="text-on-surface-variant">({f.feature_key})</span>
                          </span>
                          <button onClick={() => cambiarCapacidad(p, f)} className="px-2.5 py-1 rounded-lg bg-[#1A1A1A] whitespace-nowrap">
                            {valorDe(f)}
                          </button>
                          <button
                            onClick={() => confirm(`¿Quitar «${f.description}» del plan ${p.name}?`)
                              && void guardar(`/api/admin/admin/plans/${p.key}/features/${f.feature_key}`, "DELETE")}
                            className="text-[#FF5A5A]"
                            aria-label={`Quitar ${f.description}`}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
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
