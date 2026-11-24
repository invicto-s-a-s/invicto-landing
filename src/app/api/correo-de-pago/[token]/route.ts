import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** La familia desactiva o vuelve a activar los recordatorios de pago. Ver `reenviarRespuesta`. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("fee-mail-links", token, request);
}
