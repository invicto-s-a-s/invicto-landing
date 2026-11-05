import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/** El token es `base64url` de 32 bytes. Nada más entra por aquí. */
const TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/**
 * El sí o el no del acudiente, enviado **desde el servidor**.
 *
 * Mismo patrón y mismo motivo que `/api/guardian/[token]/respond` y
 * `/api/ausencia/[token]/reason`: un POST con JSON dispara un preflight y **la
 * API no tiene CORS en ninguna ruta**. Directo, el navegador lo bloquea y al
 * acudiente le sale «Failed to fetch» — que es exactamente lo que ya pasó una
 * vez en la página de autorización del chat.
 *
 * > **El arreglo de fondo sigue pendiente** y es habilitar CORS en el backend.
 * > Mientras no esté, **toda página de la landing que escriba en la API tiene
 * > que pasar por un proxy como este.** Esta es la tercera.
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
    const res = await fetch(`${API_URL}/roster-consents/${token}`, {
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
    // La API caída no debe verse como un enlace roto: dura catorce días y el
    // acudiente puede volver mañana.
    return NextResponse.json(
      { message: "No pudimos guardar tu respuesta ahora. Inténtalo más tarde." },
      { status: 503 },
    );
  }
}
