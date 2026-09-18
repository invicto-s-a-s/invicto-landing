import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * El sitemap que se le entrega a Google.
 *
 * Solo va la portada porque hoy la web **es** una sola página: lo demás son
 * anclas dentro de ella, y una ancla no es una URL que Google pueda indexar
 * aparte. El día que "Cómo funciona" o "Características" sean rutas propias,
 * se añaden aquí y pasan a competir por sus propias búsquedas.
 *
 * El panel y las páginas de compartir quedan fuera a propósito: el primero es
 * interno y las segundas son enlaces de un solo uso.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
