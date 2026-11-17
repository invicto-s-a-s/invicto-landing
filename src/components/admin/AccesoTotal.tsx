"use client";

import { useCallback, useEffect, useState } from "react";
import AccountPicker from "./AccountPicker";

const RUTA = "/api/admin/admin/parameters/launch.full_access_users";

/** `"7, 9"` → `[7, 9]`. Lo que no es un número (la palabra «ninguna») no cuenta. */
export function leerCuentas(valor: string): number[] {
  return [...new Set(valor.split(",").map((v) => v.trim()).filter((v) => /^\d+$/.test(v)).map(Number))];
}

/**
 * Las cuentas con «Acceso total»: ven todo lo de su tipo de cuenta sin
 * candados, tengan el plan que tengan. Sirven para probar y enseñar lo que
 * todavía no está en ningún plan.
 *
 * Como la app se divide por tipo de cuenta, para verlo todo hacen falta tres:
 * una de jugador, una de ojeador y una de club.
 */
export default function AccesoTotal() {
  const [cuentas, setCuentas] = useState<number[] | null>(null);
  const [nombres, setNombres] = useState<Record<number, string>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const cargar = useCallback(() => {
    fetch(RUTA)
      .then(async (res) => ({ res, body: await res.json().catch(() => null) }))
      .then(({ res, body }) => {
        if (!res.ok || typeof body?.data?.value !== "string") {
          setCuentas([]);
          setMsg({ ok: false, text: res.status === 404
            ? "El servidor todavía no tiene esta función. Llega con la próxima versión."
            : "No se pudo leer la lista." });
          return;
        }
        setCuentas(leerCuentas(body.data.value));
      })
      .catch(() => { setCuentas([]); setMsg({ ok: false, text: "No se pudo leer la lista." }); });
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const guardar = async (nueva: number[], texto: string) => {
    setBusy(true);
    setMsg(null);
    const res = await fetch(RUTA, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: nueva.join(",") || "ninguna" }),
    }).catch(() => null);
    const body = await res?.json().catch(() => null);
    setBusy(false);
    if (!res?.ok) {
      setMsg({ ok: false, text: typeof body?.message === "string" ? body.message : "No se pudo guardar." });
      return;
    }
    setCuentas(nueva);
    setMsg({ ok: true, text: `${texto} Se nota en cerca de un minuto.` });
  };

  if (cuentas === null) return <p className="text-sm text-on-surface-variant">Cargando…</p>;

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl grid gap-4">
      <p className="text-sm text-on-surface-variant">
        Una cuenta con acceso total ve <b className="text-on-surface">todo lo de su tipo de cuenta, sin candados</b>, tenga el
        plan que tenga. Para verlo todo hacen falta tres: una de jugador, una de ojeador y una de club. Úsalo con cuentas
        del equipo, no con clientes.
      </p>

      <AccountPicker
        onPick={(c) => {
          if (cuentas.includes(c.id)) { setMsg({ ok: false, text: "Esa cuenta ya tiene acceso total." }); return; }
          setNombres((n) => ({ ...n, [c.id]: `${[c.name, c.last_name].filter(Boolean).join(" ") || c.username} · @${c.username}` }));
          void guardar([...cuentas, c.id], "Acceso total dado.");
        }}
      />

      {cuentas.length === 0 ? (
        <p className="text-sm text-on-surface-variant">Ninguna cuenta tiene acceso total.</p>
      ) : (
        <div className="grid gap-2">
          {cuentas.map((id) => (
            <div key={id} className="flex items-center gap-3 text-sm bg-[#141414] rounded-lg px-3 py-2">
              <span className="flex-1 min-w-0 truncate">{nombres[id] ?? `Cuenta #${id}`}</span>
              <button
                onClick={() => void guardar(cuentas.filter((c) => c !== id), "Acceso total quitado.")}
                disabled={busy}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      {msg && <p className={`text-sm ${msg.ok ? "text-neon" : "text-[#FF5A5A]"}`}>{msg.text}</p>}
    </div>
  );
}
