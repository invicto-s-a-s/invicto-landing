import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** La autorización del acudiente para la Vitrina Élite, por su enlace. Ver `reenviarRespuesta`. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("vitrina/autorizacion", token, request);
}
