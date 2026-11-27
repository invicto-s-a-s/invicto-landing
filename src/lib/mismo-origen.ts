/**
 * Si una petición que escribe viene del propio panel.
 *
 * La cookie de sesión es `SameSite=Lax`, y para el navegador
 * `invictoapp.com` y `admin.invictoapp.com` son el **mismo sitio**: un script
 * de la landing (Analytics, el píxel de Meta) podía mandar un `fetch` al proxy
 * con la sesión de un revisor y verificar, suspender o conceder planes
 * (auditoría 2026-11-26, M9). Se acepta solo lo que nace en el mismo origen.
 *
 * `Sec-Fetch-Site` lo pone el navegador y una página no lo puede falsificar.
 * Si no viene (navegadores viejos), se compara `Origin` con el host.
 */
export function vieneDelPanel(request: Request): boolean {
  const sitio = request.headers.get("sec-fetch-site");
  if (sitio) return sitio === "same-origin";

  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
