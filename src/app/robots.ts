import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Qué puede rastrear Google en el dominio público.
 *
 * `/admin` sigue en la lista aunque ya viva en su propio subdominio: en
 * producción ahí solo queda una redirección, y cuesta menos dejarlo dicho que
 * explicar más adelante por qué el rastreador la sigue. `/p/` son enlaces de
 * compartir de un solo uso.
 *
 * El subdominio del panel no usa esto: el middleware le pone `X-Robots-Tag` a
 * todo lo que sirve.
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
