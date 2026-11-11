"use client";

import { useEffect, useState } from "react";

interface Cuenta {
  id: number;
  username: string;
  name: string | null;
  last_name: string | null;
  email: string;
  role: string | null;
}

const ROL: Record<string, string> = { player: "Jugador", scout: "Ojeador", club: "Club" };

/**
 * Buscar una cuenta por nombre, usuario o correo, y elegirla.
 *
 * Antes había que ir a la pestaña Usuarios, copiar el número y volver: con dos
 * cuentas de nombre parecido, el plan acababa en la que no era. Aquí se elige
 * viendo el nombre, el usuario, el correo y el tipo de cuenta.
 *
 * Usa la misma búsqueda que la pestaña Usuarios (`GET /admin/users?q=`).
 */
export default function AccountPicker({ onPick }: { onPick: (c: Cuenta) => void }) {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<Cuenta[]>([]);
  const [estado, setEstado] = useState<"quieto" | "buscando" | "listo">("quieto");

  // Se espera a que deje de escribir: sin esto sale una consulta por tecla.
  useEffect(() => {
    const texto = q.trim();
    if (texto.length < 2) return;

    const timer = setTimeout(() => {
      setEstado("buscando");
      fetch(`/api/admin/admin/users?${new URLSearchParams({ q: texto, limit: "6", page: "1" })}`)
        .then((r) => r.json())
        .then((body) => setRows(Array.isArray(body.data?.items) ? body.data.items : []))
        .catch(() => setRows([]))
        .finally(() => setEstado("listo"));
    }, 350);
    return () => clearTimeout(timer);
  }, [q]);

  const corto = q.trim().length < 2;

  return (
    <div className="grid gap-2">
      <label className="grid gap-1 text-xs text-on-surface-variant">
        Buscar la cuenta
        <input
          className="w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, usuario o correo"
        />
      </label>

      {!corto && estado === "buscando" && <p className="text-xs text-on-surface-variant">Buscando…</p>}
      {!corto && estado === "listo" && rows.length === 0 && (
        <p className="text-xs text-on-surface-variant">Nadie con ese nombre, usuario o correo.</p>
      )}

      {!corto && rows.length > 0 && (
        <ul className="grid gap-1">
          {rows.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => { onPick(c); setQ(""); setRows([]); setEstado("quieto"); }}
                className="w-full text-left bg-[#141414] border border-[#222] hover:border-neon rounded-lg px-3 py-2"
              >
                <span className="text-sm">{[c.name, c.last_name].filter(Boolean).join(" ") || c.username}</span>
                <span className="text-xs text-on-surface-variant"> · @{c.username} · {ROL[c.role ?? ""] ?? "Sin tipo"} · #{c.id}</span>
                <span className="block text-xs text-on-surface-variant/70">{c.email}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
