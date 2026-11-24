import { NextResponse } from "next/server";
import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

type Contexto = { params: Promise<{ token: string }> };

/**
 * El «Cancelar suscripción» de Gmail y de los demás (RFC 8058): la dirección de
 * la cabecera `List-Unsubscribe`. **Da de baja con el POST, sin más pasos**: lo
 * hace el proveedor cuando la persona ya tocó su botón.
 *
 * No lee lo que llega. El proveedor manda `List-Unsubscribe=One-Click` como
 * formulario, y esta dirección solo sabe hacer una cosa.
 */
export async function POST(request: Request, ctx: Contexto) {
  const { token } = await ctx.params;
  const no = new Request(request.url, { method: "POST", body: JSON.stringify({ recibir: false }) });
  const res = await reenviarRespuesta("fee-mail-links", token, no);
  // El código le basta al proveedor. Nada de la respuesta es para él.
  return new NextResponse(null, { status: res.status });
}

/** Abrirla con el navegador, o que la abra un antivirus, no da de baja: lleva a la página, que pide el toque. */
export async function GET(request: Request, ctx: Contexto) {
  const { token } = await ctx.params;
  return NextResponse.redirect(new URL(`/correo-de-pago/${encodeURIComponent(token)}`, request.url), 303);
}
