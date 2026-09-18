import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Qué puede rastrear Google.
 *
 * `/admin` y `/api` fuera: el panel además lleva su propio `noindex`, pero el
 * robots.txt evita que el rastreador gaste tiempo ahí. `/p/` son enlaces de
 * compartir de un solo uso, no páginas que deban aparecer en los resultados.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/p/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
