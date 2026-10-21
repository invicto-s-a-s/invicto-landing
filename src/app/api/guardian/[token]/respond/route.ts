import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/** El token es `base64url` de 32 bytes. Nada más entra por aquí. */
const TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/**
 * El «sí» o el «no» del tutor, enviado **desde el servidor**.
 *
 * El botón llamaba directo a `api.invictoapp.com` y el navegador lo bloqueaba:
 * un POST con JSON dispara un preflight, y la API **no tiene CORS en ninguna
 * ruta** — el OPTIONS devuelve 404 sin una sola cabecera. Desde fuera eso se ve
 * como un escueto «Failed to fetch», que es lo que le salía al tutor justo
 * después de leer el mensaje y decidir.
 *
 * Nadie lo había notado porque hasta ahora **ningún navegador hablaba con la
 * API**: la app es nativa y el panel del equipo ya iba por un proxy como este.
 * Esta página fue la primera.
 *
 * Mismo patrón que `/api/admin/[...path]`, y una ruta fija en vez de un comodín:
 * aquí solo hay una cosa que hacer, así que no hace falta lista de permitidos.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  if (!TOKEN.test(token)) {
    return NextResponse.json({ message: "Este enlace no es válido" }, { status: 400 });
  }

  const body = await request.text();

  try {
    const res = await fetch(`${API_URL}/guardian/requests/${token}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body || "{}",
      cache: "no-store",
    });
    const cuerpo = await res.json().catch(() => null);
    return NextResponse.json(
      cuerpo ?? { message: "No se pudo guardar tu respuesta." },
      { status: res.status },
    );
  } catch {
    // La API caída no debe verse como un enlace roto: el tutor volvería a
    // intentarlo mañana y el enlace sigue sirviendo.
    return NextResponse.json(
      { message: "No se pudo conectar. Inténtalo de nuevo en un momento." },
      { status: 502 },
    );
  }
}
