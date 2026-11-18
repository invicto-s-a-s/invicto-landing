import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** «Voy» o «No puedo» del acudiente, por su enlace. Ver `reenviarRespuesta`. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("callup-responses", token, request);
}
