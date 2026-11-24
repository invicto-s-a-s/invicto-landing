import { NextResponse } from "next/server";
import { API_URL } from "@/lib/enlace-del-acudiente";

const CAIDA = "No pudimos enviar tu mensaje ahora. Inténtalo más tarde.";
const TOPE = 8_000;

/** La conexión de la persona, para que el límite no cuente a toda la web como una sola. */
function cabeceras(request: Request): Record<string, string> {
  const llave = process.env.CONTACT_PROXY_KEY;
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || request.headers.get("x-real-ip") || "";
  return llave && ip ? { "X-Invicto-Proxy-Key": llave, "X-Invicto-Client-Ip": ip } : {};
}

async function reenviar(request: Request, ruta: string, init: RequestInit): Promise<NextResponse> {
  try {
    const res = await fetch(`${API_URL}${ruta}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...cabeceras(request) },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const cuerpo = await res.json().catch(() => null);
    const message = Array.isArray(cuerpo?.message) ? cuerpo.message[0] : cuerpo?.message;
    return NextResponse.json({ data: cuerpo?.data ?? null, message: res.ok ? null : (message ?? CAIDA) }, { status: res.status });
  } catch {
    return NextResponse.json({ data: null, message: CAIDA }, { status: 503 });
  }
}

/** Abrir el formulario. Apagado, 404: no se pinta. */
export const GET = (request: Request) => reenviar(request, "/contact-requests/form", { method: "GET" });

export async function POST(request: Request) {
  const body = await request.text();
  if (body.length > TOPE) return NextResponse.json({ data: null, message: "Tu mensaje es demasiado largo." }, { status: 400 });
  return reenviar(request, "/contact-requests", { method: "POST", body: body || "{}" });
}
