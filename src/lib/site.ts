/**
 * El dominio público, en un solo sitio.
 *
 * Lo usan el sitemap, el robots.txt, las URL canónicas y las tarjetas de
 * compartir. Si están descuadrados entre sí, Google trata cada variante como
 * una página distinta y reparte la autoridad entre todas.
 *
 * Se puede cambiar por entorno (`NEXT_PUBLIC_SITE_URL`) para que las vistas
 * previas de Vercel no se anuncien como si fueran el dominio bueno.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://invictoapp.com"
).replace(/\/$/, "");

export const SITE_NAME = "INVICTO";

/** La frase que sale en el resultado de búsqueda. Menos de 160 caracteres. */
export const SITE_DESCRIPTION =
  "Invicto es la app donde los futbolistas muestran su talento y los clubes y "
  + "ojeadores lo encuentran. Publica tus jugadas, recibe evaluaciones reales y "
  + "postúlate a convocatorias.";
