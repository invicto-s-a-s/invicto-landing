"use client";

import { useEffect, useState } from "react";
import UserDetail from "./UserDetail";

interface AdminUser {
  id: number;
  username: string;
  name: string | null;
  last_name: string | null;
  email: string;
  role: string | null;
  verified: boolean;
  premium: boolean;
  city: string | null;
  country: string | null;
  followers_count: number;
  posts_count: number;
  created_at: string;
}

const ROLES = [
  { value: "", label: "Todos" },
  { value: "player", label: "Jugadores" },
  { value: "scout", label: "Ojeadores" },
  { value: "club", label: "Clubes" },
];

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const COLUMNS: { key: keyof AdminUser; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "username", label: "Usuario" },
  { key: "name", label: "Nombre" },
  { key: "last_name", label: "Apellido" },
  { key: "email", label: "Correo" },
  { key: "role", label: "Tipo" },
  { key: "verified", label: "Verificada" },
  { key: "premium", label: "Premium" },
  { key: "city", label: "Ciudad" },
  { key: "country", label: "Pais" },
  { key: "followers_count", label: "Seguidores" },
  { key: "posts_count", label: "Publicaciones" },
  { key: "created_at", label: "Alta" },
];

/**
 * Las comillas se escapan doblandolas, que es lo que entiende una hoja de
 * calculo. Sin esto, un nombre con una coma —o una biografia con un salto de
 * linea— parte la fila y el resto de columnas se corre.
 */
const cell = (v: unknown) => {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean") return v ? "si" : "no";
  const text = String(v);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

/**
 * El BOM del principio es para Excel: sin el abre el archivo en la codificacion
 * del sistema y cualquier tilde sale rota. El separador es `;` por lo mismo —
 * en un Excel en espanol, la coma no separa columnas.
 */
function toCsv(rows: AdminUser[]): string {
  const head = COLUMNS.map((c) => c.label).join(";");
  const body = rows.map((r) => COLUMNS.map((c) => cell(r[c.key])).join(";"));
  return `﻿${[head, ...body].join("\r\n")}`;
}

export default function UsersTable() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openUser, setOpenUser] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);

  /**
   * Se pide la tabla entera al servidor y no las veinte filas que se ven: quien
   * baja un CSV lo quiere para mirarlo todo en una hoja de calculo, y bajar una
   * pagina suelta obligaria a repetirlo por cada pagina.
   */
  const exportCsv = async () => {
    setExporting(true);
    try {
      const body = await fetch("/api/admin/admin/users/export").then((r) => r.json());
      const items: AdminUser[] = body.data?.items ?? [];
      if (items.length === 0) return;

      const blob = new Blob([toCsv(items)], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invicto-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  // Se espera a que deje de escribir: sin esto sale una consulta por tecla.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (q.trim()) params.set("q", q.trim());
      if (role) params.set("role", role);

      fetch(`/api/admin/admin/users?${params}`)
        .then((r) => r.json())
        .then((body) => {
          setRows(body.data?.items ?? []);
          setTotal(body.data?.total ?? 0);
        })
        .catch(() => setRows([]))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [q, role, page]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Buscar por usuario, correo o nombre"
          className="flex-1 min-w-[240px] admin-card border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-neon transition-colors"
        />
        <div className="flex gap-2">
          {ROLES.map((r) => (
            <button
              key={r.value}
              onClick={() => { setRole(r.value); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                role === r.value ? "bg-neon text-background" : "bg-[#1A1A1A] text-on-surface-variant"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          disabled={exporting}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-[#1A1A1A] text-on-surface-variant hover:text-[#EDEDED] transition-colors disabled:opacity-40"
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          {exporting ? "Preparando…" : "Exportar CSV"}
        </button>
      </div>

      <p className="text-xs text-on-surface-variant mb-3">
        {loading ? "Cargando…" : `${total} ${total === 1 ? "cuenta" : "cuentas"}`}
      </p>

      <div className="overflow-x-auto admin-card border border-[#222] rounded-xl">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left font-mono text-[10px] tracking-[0.15em] uppercase text-on-surface-variant border-b border-[#222]">
              <th className="px-4 py-3">Cuenta</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Ubicación</th>
              <th className="px-4 py-3 text-right">Seguidores</th>
              <th className="px-4 py-3 text-right">Posts</th>
              <th className="px-4 py-3">Alta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((u) => (
              <tr
                key={u.id}
                onClick={() => setOpenUser(u.id)}
                className="border-b border-[#1A1A1A] last:border-0 cursor-pointer hover:bg-white/[0.03] transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>{[u.name, u.last_name].filter(Boolean).join(" ") || u.username}</span>
                    {u.verified && <span className="text-neon text-xs" title="Verificada">✓</span>}
                    {u.premium && (
                      <span className="text-[#AF8CFF] text-[10px] font-mono uppercase">Premium</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant">@{u.username} · {u.email}</p>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{u.role ?? "—"}</td>
                <td className="px-4 py-3 text-on-surface-variant">
                  {[u.city, u.country].filter(Boolean).join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">{u.followers_count}</td>
                <td className="px-4 py-3 text-right">{u.posts_count}</td>
                <td className="px-4 py-3 text-on-surface-variant">{date(u.created_at)}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-on-surface-variant">
                  Ninguna cuenta con esos criterios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-xs px-3 py-2 rounded-lg bg-[#1A1A1A] disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-on-surface-variant">
            Página {page} de {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 20 >= total}
            className="text-xs px-3 py-2 rounded-lg bg-[#1A1A1A] disabled:opacity-40"
          >
            Siguiente
          </button>
        </div>
      )}

      {openUser !== null && (
        <UserDetail userId={openUser} onClose={() => setOpenUser(null)} />
      )}
    </div>
  );
}
