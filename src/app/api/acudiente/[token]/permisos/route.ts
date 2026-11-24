import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** Dar o quitar un permiso después de haber respondido, con el mismo enlace. */
export async function PUT(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("roster-consents", token, request, "/permissions", "PUT");
}
