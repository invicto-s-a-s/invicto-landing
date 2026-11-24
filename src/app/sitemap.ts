import type { MetadataRoute } from "next";
import { leerPaginas } from "@/lib/paginas";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * El sitemap que se le entrega a Google.
 *
 * Solo las URL que queremos ver en los resultados. Las secciones de la portada
 * —"Cómo funciona", "Características"— no están porque son anclas dentro de la
 * misma página, y una ancla no se indexa aparte. El día que sean rutas propias,
 * entran aquí y pasan a competir por sus propias búsquedas.
 *
 * Fuera quedan el panel (interno) y `/p/…` (enlaces de compartir de un solo uso).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const paginas = await leerPaginas();
  // Las que publica el panel. Sin publicar no existen, y aquí tampoco.
  const publicadas = [
    ...(paginas.child_safety ? ["seguridad-infantil"] : []),
    ...(paginas.account_deletion ? ["eliminar-cuenta"] : []),
  ].map((ruta) => ({ url: `${SITE_URL}/${ruta}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Las legales cambian poco, pero se indexan: Google las cuenta como señal
    // de que detrás hay una empresa de verdad, y las tiendas las exigen.
    {
      url: `${SITE_URL}/politica-de-privacidad`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terminos-y-condiciones`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...publicadas,
  ];
}
