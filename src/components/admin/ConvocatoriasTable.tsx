"use client";

import { useCallback, useEffect, useState } from "react";

interface AdminConvocatoria {
  id: number;
  title: string;
  status: string;
  mode: string;
  cupos: number | null;
  starts_at: string | null;
  application_ends_at: string | null;
  club_name: string;
  applications_count: number;
  created_at: string;
}

const FILTERS = [
  { value: "", label: "Todas" },
  { value: "open", label: "Abiertas" },
  { value: "closed", label: "Cerradas" },
];

const date = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

export default function ConvocatoriasTable() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<AdminConvocatoria[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (status) params.set("status", status);

    fetch(`/api/admin/admin/convocatorias?${params}`)
      .then((r) => r.json())
      .then((body) => {
        setRows(body.data?.items ?? []);
        setTotal(body.data?.total ?? 0);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (c: AdminConvocatoria) => {
    const next = c.status === "open" ? "closed" : "open";
    const verb = next === "closed" ? "Cerrar" : "Reabrir";
    if (!confirm(`${verb} «${c.title}»?\n\nCerrar solo deja de recibir postulaciones. No borra nada ni afecta a quien ya se postuló.`)) return;

    setBusy(c.id);
    await fetch(`/api/admin/admin/convocatorias/${c.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).catch(() => null);
    setBusy(null);
    load();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatus(f.value)}
            className={`px-3 py-2 rounded-lg text-xs transition-colors ${
              status === f.value ? "bg-neon text-background" : "bg-[#1A1A1A] text-on-surface-variant"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-on-surface-variant mb-3">
        {loading ? "Cargando…" : `${total} ${total === 1 ? "convocatoria" : "convocatorias"}`}
      </p>

      <div className="overflow-x-auto border border-[#222] rounded-xl">
        <table className="w-full text-sm min-w-[760px]">
          <thead>
            <tr className="text-left font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-variant border-b border-[#222]">
              <th className="px-4 py-3">Convocatoria</th>
              <th className="px-4 py-3">Modalidad</th>
              <th className="px-4 py-3">Prueba</th>
              <th className="px-4 py-3 text-right">Postulaciones</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id} className="border-b border-[#1A1A1A] last:border-0">
                <td className="px-4 py-3">
                  <p>{c.title}</p>
                  <p className="text-xs text-on-surface-variant">{c.club_name}</p>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {c.mode === "open" ? "Abierta" : `Cerrada${c.cupos ? ` · ${c.cupos} cupos` : ""}`}
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{date(c.starts_at)}</td>
                <td className="px-4 py-3 text-right">{c.applications_count}</td>
                <td className="px-4 py-3">
                  <span className={c.status === "open" ? "text-neon" : "text-on-surface-variant"}>
                    {c.status === "open" ? "Abierta" : "Cerrada"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggle(c)}
                    disabled={busy === c.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#242424] disabled:opacity-40 transition-colors"
                  >
                    {busy === c.id ? "…" : c.status === "open" ? "Cerrar" : "Reabrir"}
                  </button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  No hay convocatorias con ese estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
