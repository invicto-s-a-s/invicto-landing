import { NextResponse } from "next/server";

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/** El token es `base64url` de 32 bytes. Nada más entra por aquí. */
export const TOKEN = /^[A-Za-z0-9_-]{20,128}$/;

/**
 * Lo que el acudiente ve por su enlace, leído **desde el servidor de la
 * landing** y sin caché: el enlace caduca y puede haber respondido ya desde
 * otro aparato.
 */
export async function leerEnlace<T>(ruta: string, token: string): Promise<T | null> {
  if (!TOKEN.test(token)) return null;
  try {
    const res = await fetch(`${API_URL}/${ruta}/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    const cuerpo = await res.json();
    return (cuerpo?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/**
 * La respuesta del acudiente, reenviada a la API **desde el servidor**.
 *
 * Mismo motivo que `/api/ausencia/[token]/reason`: un POST con JSON dispara un
 * preflight y la API no tiene CORS. Directo desde el navegador, el acudiente
 * vería «Failed to fetch».
 */
export async function reenviarRespuesta(
  ruta: string, token: string, request: Request, resto = "", metodo: "POST" | "PUT" = "POST",
): Promise<NextResponse> {
  if (!TOKEN.test(token)) {
    return NextResponse.json({ message: "Este enlace no es válido" }, { status: 400 });
  }
  const body = await request.text();
  try {
    const res = await fetch(`${API_URL}/${ruta}/${token}${resto}`, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: body || "{}",
      cache: "no-store",
    });
    const cuerpo = await res.json().catch(() => null);
    return NextResponse.json(cuerpo ?? { message: "No pudimos guardar tu respuesta." }, { status: res.status });
  } catch {
    // La API caída no debe verse como un enlace roto: el enlace sirve unos días.
    return NextResponse.json({ message: "No pudimos guardar tu respuesta ahora. Inténtalo más tarde." }, { status: 503 });
  }
}
