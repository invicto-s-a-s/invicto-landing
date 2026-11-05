import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/** El token es `base64url` de 32 bytes. Nada más entra por aquí. */
const TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/**
 * El motivo que cuenta el tutor, enviado **desde el servidor**.
 *
 * Mismo patrón y mismo motivo que `/api/guardian/[token]/respond`: un POST con
 * JSON dispara un preflight, y **la API no tiene CORS en ninguna ruta** — el
 * OPTIONS devuelve 404 sin una sola cabecera, así que el navegador bloquea la
 * petición antes de enviarla. Desde fuera se ve como un «Failed to fetch», que
 * es exactamente lo que le pasó al tutor en la página de autorización.
 *
 * > **El arreglo de fondo sigue pendiente** y es habilitar CORS en el backend.
 * > Mientras no esté, **toda página de la landing que escriba en la API tiene
 * > que pasar por un proxy como este.** Esta es la segunda.
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
    const res = await fetch(`${API_URL}/absence-notices/${token}/reason`, {
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
    // La API caída no debe verse como un enlace roto: el enlace sirve siete
    // días y el tutor puede volver mañana.
    return NextResponse.json(
      { message: "No pudimos guardar tu respuesta ahora. Inténtalo más tarde." },
      { status: 503 },
    );
  }
}
