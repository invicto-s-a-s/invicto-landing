"use client";

import { useCallback, useEffect, useState } from "react";
import { boton, campo, SEGMENTOS } from "./catalogo-tipos";
import { aCsv, type Pago } from "./pagos-csv";
import { fecha, llamarPanel } from "./panel-api";

interface Pagina { items: Pago[]; total: number; page: number; hay_mas: boolean }

const pesos = (n: number) => `$${Number(n).toLocaleString("es-CO")}`;

/** Lo cobrado por fuera al dar un plan y los saldos a favor, con filtro por fechas y exportación. */
export default function PagosDePlanes() {
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [segment, setSegment] = useState("");
  const [filas, setFilas] = useState<Pago[]>([]);
  const [pagina, setPagina] = useState<Pagina | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exportando, setExportando] = useState(false);

  const consulta = useCallback((extra: Record<string, string>) => {
    const q = new URLSearchParams(Object.entries({ desde, hasta, segment, ...extra }).filter(([, v]) => v));
    return llamarPanel<Pagina>(`/admin/plan-grants/payments?${q}`);
  }, [desde, hasta, segment]);

  const cargar = useCallback((page: number) => consulta({ page: String(page) }).then((r) => {
    if (!r.ok || !r.data) { setError(r.message ?? "No fue posible leer los cobros."); return; }
    const d = r.data;
    setError(null);
    setPagina(d);
    setFilas((antes) => (page === 1 ? d.items : [...antes, ...d.items]));
  }), [consulta]);

  useEffect(() => { void cargar(1); }, [cargar]);

  const exportar = async () => {
    setExportando(true);
    const r = await consulta({ todo: "true" });
    setExportando(false);
    if (!r.ok || !r.data) { setError(r.message ?? "No fue posible exportar."); return; }
    // El BOM es para que Excel lea las tildes.
    const url = URL.createObjectURL(new Blob([`﻿${aCsv(r.data.items)}`], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cobros-de-planes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    if (r.data.hay_mas) setError(`Se exportaron los ${r.data.items.length} más recientes de ${r.data.total}. Usa las fechas para el resto.`);
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 text-xs text-on-surface-variant">Desde<input type="date" className={campo} value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
        <label className="grid gap-1 text-xs text-on-surface-variant">Hasta<input type="date" className={campo} value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        <label className="grid gap-1 text-xs text-on-surface-variant">
          Perfil
          <select className={campo} value={segment} onChange={(e) => setSegment(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(SEGMENTOS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </label>
        <button className={`${boton} border border-[#333]`} disabled={exportando} onClick={() => void exportar()}>
          {exportando ? "…" : "Exportar"}
        </button>
      </div>

      {error && <p className="text-sm text-[#FFB020]">{error}</p>}
      {pagina && filas.length === 0 && <p className="text-sm text-on-surface-variant">Aún no hay cobros registrados en estas fechas.</p>}

      <div className="grid gap-2">
        {filas.map((p) => (
          <div key={p.id} className="admin-card border border-[#222] rounded-xl p-4 flex flex-wrap gap-x-6 gap-y-1 justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium">{p.account_name} <span className="text-on-surface-variant">· {p.plan_name} {SEGMENTOS[p.segment] ?? p.segment}</span></p>
              <p className="text-xs text-on-surface-variant">
                {p.kind === "saldo" ? "Saldo a favor" : [p.method, p.reference].filter(Boolean).join(" · ") || "Sin medio"}
                {" · "}{fecha(p.starts_at)} a {fecha(p.ends_at)}
              </p>
              {p.note && <p className="text-xs text-on-surface-variant italic">{p.note}</p>}
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${p.kind === "saldo" ? "text-[#FFB020]" : "text-neon"}`}>{pesos(p.amount_cop)}</p>
              <p className="text-xs text-on-surface-variant">{fecha(p.created_at)}{p.registrado_por ? ` · @${p.registrado_por}` : ""}</p>
            </div>
          </div>
        ))}
      </div>
      {pagina?.hay_mas && (
        <button className={`${boton} border border-[#333] justify-self-start`} onClick={() => void cargar(pagina.page + 1)}>Ver más</button>
      )}
    </div>
  );
}
