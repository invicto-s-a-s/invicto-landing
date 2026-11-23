"use client";

import { useCallback, useEffect, useState } from "react";
import ConfirmarUnion from "./ConfirmarUnion";
import { llamarPanel } from "./panel-api";
import { pesos, type Conteo, type DetalleDeUnion } from "./uniones-tipos";

function Conteos({ filas }: { filas: Conteo[] }) {
  const conAlgo = filas.filter((f) => f.filas > 0);
  if (conAlgo.length === 0) return <p className="text-sm text-on-surface-variant">No hay nada registrado.</p>;
  return (
    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
      {conAlgo.map((f) => (
        <li key={f.tabla} className="flex justify-between gap-3">
          <span className="text-on-surface-variant">{f.nombre}</span>
          <span className="font-mono">{f.filas.toLocaleString("es-CO")}</span>
        </li>
      ))}
    </ul>
  );
}

const Titulo = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mt-5 mb-2">{children}</p>
);

/** El ensayo de una unión por hacer, o lo que quedó de una ya hecha. */
export default function DetalleDeLaUnion({ id, onCambio }: { id: number; onCambio: () => void }) {
  const [d, setD] = useState<DetalleDeUnion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<DetalleDeUnion>(`/admin/sede-unions/${id}`).then((r) => {
      if (!r.ok || !r.data) setError(r.message ?? "No se pudo hacer el ensayo.");
      else { setError(null); setD(r.data); }
    }), [id]);

  useEffect(() => { void cargar(); }, [cargar]);

  const listo = async () => { await cargar(); onCambio(); };

  if (error) return <p className="text-sm text-[#FF5A5A] mt-4">{error}</p>;
  if (!d) return <p className="text-sm text-on-surface-variant mt-4">Haciendo el ensayo…</p>;

  const { ensayo, hecho } = d;
  return (
    <div className="border-t border-[#222] mt-4">
      {ensayo && (
        <>
          <Titulo>Qué se movería</Titulo>
          <Conteos filas={ensayo.conteos} />

          <Titulo>Dinero</Titulo>
          <p className="text-sm">
            {ensayo.dinero.movimientos.toLocaleString("es-CO")} movimientos, saldo total {pesos(ensayo.dinero.saldo_cop)},{" "}
            {ensayo.dinero.con_saldo} {ensayo.dinero.con_saldo === 1 ? "jugador" : "jugadores"} con saldo. Al ejecutar se comprueba
            que el saldo y la cuota de cada uno quedan iguales; si uno cambia, no se mueve nada.
          </p>

          <Titulo>Lo que impide unirlas</Titulo>
          {ensayo.bloqueos.length === 0
            ? <p className="text-sm text-on-surface-variant">Nada lo impide.</p>
            : (
              <ul className="grid gap-2">
                {ensayo.bloqueos.map((b) => (
                  <li key={b.clave} className="text-sm text-[#FF5A5A]">
                    {b.texto}
                    {b.detalle && b.detalle.length > 0 && (
                      <span className="block text-xs text-on-surface-variant mt-0.5">Cuentas: {b.detalle.join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

          <Titulo>Lo que hay que saber antes</Titulo>
          {ensayo.avisos.length === 0
            ? <p className="text-sm text-on-surface-variant">Nada cambia para nadie.</p>
            : <ul className="grid gap-2">{ensayo.avisos.map((a) => <li key={a.clave} className="text-sm text-[#F5C542]">{a.texto}</li>)}</ul>}

          {d.estado === "pendiente" && (
            <p className="text-sm text-on-surface-variant mt-5">Todavía no se puede ejecutar: falta que la apruebe el dueño de {d.principal.nombre}.</p>
          )}
          {d.estado === "aprobada" && (
            <ConfirmarUnion
              tipo="ejecutar" id={id} nombre={d.llega.nombre ?? ""} huella={ensayo.huella}
              deshabilitado={!ensayo.se_puede_ejecutar} onListo={listo}
            />
          )}
          <button onClick={() => { setD(null); void cargar(); }} className="text-xs text-on-surface-variant underline mt-4">
            Hacer el ensayo otra vez
          </button>
        </>
      )}

      {hecho && (
        <>
          <Titulo>Qué se movió</Titulo>
          <Conteos filas={hecho.resumen?.conteos ?? []} />
          {hecho.resumen && (
            <p className="text-sm text-on-surface-variant mt-2">
              {hecho.resumen.movimientos_del_libro.toLocaleString("es-CO")} movimientos por {pesos(hecho.resumen.saldo_total_cop)}.
              {hecho.resumen.tarifas_apagadas > 0 ? ` ${hecho.resumen.tarifas_apagadas} tarifas llegaron desactivadas porque la escuela no cobraba.` : ""}
            </p>
          )}

          {hecho.rezagadas.length > 0 && (
            <>
              <Titulo>Quedó en la cuenta vieja</Titulo>
              <p className="text-sm text-[#FF5A5A] mb-2">
                Alguien estaba registrando algo justo cuando se unieron. Hay que pasarlo a mano con el equipo técnico.
              </p>
              <Conteos filas={hecho.rezagadas} />
            </>
          )}

          <Titulo>Deshacer</Titulo>
          {hecho.deshacer.se_puede
            ? <ConfirmarUnion tipo="deshacer" id={id} nombre={d.llega.nombre ?? ""} onListo={listo} />
            : <p className="text-sm text-on-surface-variant">Ya no se puede deshacer. {hecho.deshacer.por_que}</p>}
        </>
      )}

      {!ensayo && !hecho && <p className="text-sm text-on-surface-variant mt-4">No queda nada por hacer con esta solicitud.</p>}
    </div>
  );
}
