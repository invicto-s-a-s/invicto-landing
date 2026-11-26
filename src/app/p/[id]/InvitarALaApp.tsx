"use client";

import { useEffect } from "react";
import { abrirEnLaApp, irALaTienda } from "@/lib/abrir-la-app";

/**
 * Lo que sale al tocar algo que solo se hace en la app (me gusta, comentar, ver
 * el perfil), como Facebook cuando no tienes la app: ves la publicación, y para
 * ir más allá te invita a descargarla.
 */
export default function InvitarALaApp({ autor, postId, onCerrar }: { autor: string; postId: number; onCerrar: () => void }) {
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") onCerrar(); };
    document.addEventListener("keydown", tecla);
    return () => document.removeEventListener("keydown", tecla);
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="invitar-titulo">
      <button type="button" aria-label="Cerrar" onClick={onCerrar} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-t-2xl border-t-2 border-[#C4F750] bg-[#141414] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/isotipo-invicto2.png" alt="" className="mb-4 h-10 w-10 object-contain" />
        <h2 id="invitar-titulo" className="font-headline text-xl font-black italic leading-tight text-white">
          Sigue viendo en INVICTO
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/70">
          Descarga la app gratis para darle me gusta, comentar y ver más jugadas de {autor}. Es la red donde jugadores,
          ojeadores y clubes se encuentran.
        </p>
        <div className="mt-5 grid gap-2">
          <button type="button" onClick={irALaTienda} className="h-12 rounded-xl bg-[#C4F750] text-[15px] font-bold text-[#1D1B20]">
            Descargar INVICTO
          </button>
          <button type="button" onClick={() => abrirEnLaApp(`p/${postId}`)} className="h-11 rounded-xl border border-white/15 text-sm font-semibold text-white">
            Ya la tengo: abrir en la app
          </button>
        </div>
      </div>
    </div>
  );
}
