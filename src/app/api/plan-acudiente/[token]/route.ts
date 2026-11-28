import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/** El token es `base64url` de 32 bytes. Nada más entra por aquí. */
const TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/**
 * El «sí» o el «no» del acudiente al plan que solicitó el menor, enviado
 * **desde el servidor** de la landing.
 *
 * Por la misma razón que `/api/guardian/[token]/respond`: la API no tiene CORS,
 * y un POST con JSON desde el navegador muere en el preflight con un «Failed to
 * fetch» justo cuando el acudiente ya decidió.
 */
export async function POST(
  request: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const { token } = await ctx.params;
  if (!TOKEN.test(token)) {
    return NextResponse.json({ message: "Este enlace no es válido." }, { status: 404 });
  }

  const body = await request.text();

  try {
    const res = await fetch(`${API_URL}/plans/guardian-approval/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body || "{}",
      cache: "no-store",
    });
    const cuerpo = await res.json().catch(() => null);
    return NextResponse.json(
      cuerpo ?? { message: "No pudimos guardar tu respuesta." },
      { status: res.status },
    );
  } catch {
    // La API caída no es un enlace roto: el enlace sigue sirviendo mañana.
    return NextResponse.json(
      { message: "No pudimos conectarnos. Inténtalo nuevamente en un momento." },
      { status: 502 },
    );
  }
}
