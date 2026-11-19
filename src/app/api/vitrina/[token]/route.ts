import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** El permiso del acudiente para la vitrina, por su enlace. Ver `reenviarRespuesta`. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("showcase-consents", token, request);
}
