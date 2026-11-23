"use client";

import { useCallback, useEffect, useState } from "react";
import { fecha, llamarPanel } from "./panel-api";
import DetalleDeLaUnion from "./DetalleDeLaUnion";
import { ESTADOS, type EstadoDeUnion, type Union } from "./uniones-tipos";

/**
 * Unir una escuela que ya existe como sede de otra.
 *
 * Los dos dueños la piden y la aprueban en la app; **aquí se revisa el ensayo y
 * se ejecuta**. Mueve datos de menores y dinero entre escuelas, así que nada se
 * hace con un solo toque.
 */
export default function UnionesDeEscuelas() {
  const [estado, setEstado] = useState<EstadoDeUnion>("aprobada");
  const [filas, setFilas] = useState<Union[]>([]);
  const [encendido, setEncendido] = useState<boolean | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [abierta, setAbierta] = useState<number | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ encendido: boolean; items: Union[] }>(`/admin/sede-unions?estado=${estado}`).then((r) => {
      setCargando(false);
      if (!r.ok || !r.data) {
        setError(r.message ?? "No se pudieron cargar las uniones.");
        return;
      }
      setError(null);
      setEncendido(r.data.encendido);
      setFilas(r.data.items);
    }), [estado]);

  useEffect(() => { void cargar(); }, [cargar]);

  const elegido = ESTADOS.find((e) => e.value === estado)!;

  return (
    <div className="max-w-4xl">
      <p className="text-sm text-on-surface-variant mb-4">
        Una escuela que ya tiene su cuenta puede pasar a ser una sede de otra. Las dos lo piden y lo aprueban en la app; aquí
        ves qué se movería, qué lo impide y lo ejecutas.
      </p>

      {encendido === false && (
        <p className="admin-card border border-[#5A4A1E] rounded-xl p-4 text-sm mb-4">
          Unir escuelas está apagado (<span className="font-mono text-xs">launch.sede_unions</span>). La app no lo ofrece y no se
          puede ejecutar. Puedes ver y deshacer lo que ya se hizo.
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => { if (e.value !== estado) { setCargando(true); setAbierta(null); setEstado(e.value); } }}
            className={`text-xs px-3 py-1.5 rounded-lg ${estado === e.value ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`}
          >
            {e.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-on-surface-variant mb-4">{elegido.que_falta}</p>

      {error && <p className="text-sm text-[#FF5A5A] mb-3">{error}</p>}
      {cargando && <p className="text-sm text-on-surface-variant">Cargando…</p>}
      {!cargando && !error && filas.length === 0 && (
        <p className="text-sm text-on-surface-variant">No hay ninguna en «{elegido.label}».</p>
      )}

      <div className="grid gap-3">
        {!cargando && filas.map((u) => (
          <div key={u.id} className="admin-card border border-[#222] rounded-xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-headline font-black italic text-lg leading-tight">
                  {u.llega.nombre ?? "Escuela eliminada"} → {u.principal.nombre ?? "Escuela eliminada"}
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  Entra como «{u.nombre_de_la_sede}» · pedida el {fecha(u.pedida_en)}
                  {u.ejecutada_en ? ` · hecha el ${fecha(u.ejecutada_en)}` : ""}
                  {u.deshecha_en ? ` · deshecha el ${fecha(u.deshecha_en)}` : ""}
                </p>
                {u.motivo && <p className="text-xs text-on-surface-variant italic mt-1">«{u.motivo}»</p>}
              </div>
              <button
                onClick={() => setAbierta(abierta === u.id ? null : u.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[#444] shrink-0"
              >
                {abierta === u.id ? "Cerrar" : "Ver"}
              </button>
            </div>
            {abierta === u.id && <DetalleDeLaUnion id={u.id} onCambio={cargar} />}
          </div>
        ))}
      </div>
    </div>
  );
}
