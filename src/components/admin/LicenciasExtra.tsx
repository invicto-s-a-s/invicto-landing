"use client";

import { useState } from "react";
import AccountPicker from "./AccountPicker";

interface Licencias {
  organizacion: string | null;
  /** Las de su plan. `null`: sin tope. */
  del_plan: number | null;
  extra: number;
  en_uso: number;
}

const MAXIMO = 50;

/**
 * Darle licencias de más a una escuela concreta.
 *
 * El número de licencias de un plan se cambia en el Catálogo y vale para todas
 * las escuelas de ese plan. Esto es lo otro: dos más para **una**, sin tocar a
 * las demás. Se busca por la cuenta del club, que es la dueña de la escuela.
 */
export default function LicenciasExtra() {
  const [cuenta, setCuenta] = useState<{ id: number; nombre: string } | null>(null);
  const [datos, setDatos] = useState<Licencias | null>(null);
  const [extra, setExtra] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const leerRespuesta = async (res: Response | null) => {
    const body = await res?.json().catch(() => null);
    if (!res?.ok || !body?.data) {
      return {
        datos: null,
        error: res?.status === 404 && typeof body?.message !== "string"
          ? "El servidor todavía no tiene esta función. Llega con la próxima versión."
          : typeof body?.message === "string" ? body.message : "No se pudo leer.",
      };
    }
    return { datos: body.data as Licencias, error: null };
  };

  const elegir = async (id: number, nombre: string) => {
    setCuenta({ id, nombre });
    setDatos(null);
    setMsg(null);
    setBusy(true);
    const res = await fetch(`/api/admin/admin/organizations/${id}/licenses`).catch(() => null);
    const r = await leerRespuesta(res);
    setBusy(false);
    if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo leer." }); return; }
    setDatos(r.datos);
    setExtra(String(r.datos.extra));
  };

  const guardar = async () => {
    if (!cuenta) return;
    const numero = Number(extra.trim());
    if (!/^\d+$/.test(extra.trim()) || numero > MAXIMO) {
      setMsg({ ok: false, text: `Escribe un número entre 0 y ${MAXIMO}.` });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = await fetch(`/api/admin/admin/organizations/${cuenta.id}/licenses`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extra: numero }),
    }).catch(() => null);
    const r = await leerRespuesta(res);
    setBusy(false);
    if (!r.datos) { setMsg({ ok: false, text: r.error ?? "No se pudo guardar." }); return; }
    setDatos(r.datos);
    setExtra(String(r.datos.extra));
    setMsg({ ok: true, text: "Guardado. La escuela ya lo ve." });
  };

  const total = datos ? (datos.del_plan === null ? null : datos.del_plan + datos.extra) : null;

  return (
    <div className="admin-card border border-[#222] rounded-xl p-5 max-w-xl grid gap-4">
      <p className="text-sm text-on-surface-variant">
        Las licencias son las personas del cuerpo técnico que una escuela puede tener. El número sale de su plan; aquí
        le das <b className="text-on-surface">más a una escuela concreta</b>, y las demás no cambian.
      </p>

      <AccountPicker
        onPick={(c) => void elegir(c.id, `${[c.name, c.last_name].filter(Boolean).join(" ") || c.username} · @${c.username}`)}
      />

      {cuenta && <p className="text-sm">Cuenta elegida: <b>{cuenta.nombre}</b></p>}

      {datos && (
        <div className="grid gap-3">
          <div className="bg-[#141414] rounded-lg px-3 py-3 text-sm grid gap-1">
            <span className="font-semibold">{datos.organizacion ?? "Su club o escuela"}</span>
            <span className="text-on-surface-variant">
              Su plan le da {datos.del_plan === null ? "licencias sin tope" : `${datos.del_plan}`}
              {datos.del_plan !== null && ` · de más tiene ${datos.extra} · en total ${total}`}
              {` · hoy usa ${datos.en_uso}`}
            </span>
          </div>

          {datos.del_plan === null ? (
            <p className="text-sm text-on-surface-variant">Su plan no tiene tope de licencias: no hace falta darle más.</p>
          ) : (
            <label className="grid gap-1 text-sm">
              <span className="text-on-surface-variant">Licencias de más para esta escuela (0 a {MAXIMO})</span>
              <div className="flex gap-2">
                <input
                  value={extra}
                  onChange={(e) => setExtra(e.target.value.replace(/\D/g, "").slice(0, 2))}
                  inputMode="numeric"
                  className="w-24 bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={() => void guardar()}
                  disabled={busy || extra.trim() === "" || Number(extra) === datos.extra}
                  className="px-4 py-2 rounded-lg bg-neon text-background text-sm font-medium disabled:opacity-40"
                >
                  Guardar
                </button>
              </div>
            </label>
          )}
        </div>
      )}

      {busy && !datos && <p className="text-sm text-on-surface-variant">Cargando…</p>}
      {msg && <p className={`text-sm ${msg.ok ? "text-neon" : "text-[#FF5A5A]"}`}>{msg.text}</p>}
    </div>
  );
}
