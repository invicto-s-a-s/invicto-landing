import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

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
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
  ];
}
