"use client";

import { useRef, useState } from "react";
import type { PostMedia } from "@/lib/invicto-api";

/**
 * Las fotos y videos de la publicación, como en la app: se pasan de lado y el
 * video se reproduce aquí mismo. Antes la página solo mostraba la miniatura de
 * un video, y quien no tenía la app no podía verlo (Orlando, 2026-11-26).
 */
export default function MediaDeLaPublicacion({ media, alt }: { media: PostMedia[]; alt: string }) {
  const piezas = [...media].sort((a, b) => a.order - b.order);
  const [actual, setActual] = useState(0);
  const fila = useRef<HTMLDivElement>(null);

  if (piezas.length === 0) return null;

  const alDeslizar = () => {
    const f = fila.current;
    if (f) setActual(Math.round(f.scrollLeft / f.clientWidth));
  };

  return (
    <div className="relative bg-black">
      <div
        ref={fila}
        onScroll={alDeslizar}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {piezas.map((m, i) => (
          <div key={m.id} className="w-full shrink-0 snap-center">
            {m.type === "video" ? (
              <video
                src={m.url}
                poster={m.thumbnail_url ?? undefined}
                controls
                playsInline
                preload="metadata"
                className="aspect-[4/5] w-full bg-black object-contain"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={m.url}
                alt={piezas.length > 1 ? `${alt} (${i + 1} de ${piezas.length})` : alt}
                className="aspect-[4/5] w-full bg-black object-cover"
              />
            )}
          </div>
        ))}
      </div>
      {piezas.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {piezas.map((m, i) => (
            <span key={m.id} className={`h-1.5 w-1.5 rounded-full ${i === actual ? "bg-[#C4F750]" : "bg-white/40"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
