"use client";

import { useEffect, useState } from "react";
import EliminarCuenta from "@/content/eliminar-cuenta";
import SeguridadInfantil from "@/content/seguridad-infantil";
import { NADA_PUBLICADO, Paginas } from "@/lib/paginas-tipos";

/** Los textos tal como saldrían, para que Legal los lea sin publicarlos. */
export default function PaginasLegales() {
  const [paginas, setPaginas] = useState<Paginas>(NADA_PUBLICADO);

  useEffect(() => {
    fetch("/api/admin/paginas").then((r) => (r.ok ? r.json() : null)).then((p) => { if (p) setPaginas(p); }).catch(() => undefined);
  }, []);

  const bloques = [
    { titulo: "Seguridad infantil", ruta: "/seguridad-infantil", publicada: paginas.child_safety, cuerpo: <SeguridadInfantil {...paginas} /> },
    { titulo: "Eliminar tu cuenta", ruta: "/eliminar-cuenta", publicada: paginas.account_deletion, cuerpo: <EliminarCuenta {...paginas} /> },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {bloques.map((b) => (
        <section key={b.ruta} className="admin-card border border-[#222] rounded-xl p-6">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#FFB020] mb-2">
            Borrador para Legal · {b.publicada ? `publicada en ${b.ruta}` : "sin publicar"}
          </p>
          <h2 className="font-headline font-black italic text-2xl mb-4">{b.titulo}</h2>
          <article className="legal-content text-sm leading-relaxed">{b.cuerpo}</article>
        </section>
      ))}
    </div>
  );
}
