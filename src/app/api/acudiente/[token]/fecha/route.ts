import { reenviarRespuesta } from "@/lib/enlace-del-acudiente";

/** Pedir que se corrija la fecha de nacimiento del jugador de este enlace. */
export async function POST(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  return reenviarRespuesta("roster-consents", token, request, "/birth-date-requests");
}
