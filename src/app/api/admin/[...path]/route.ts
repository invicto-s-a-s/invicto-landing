import { NextResponse } from "next/server";
import { apiFetch } from "@/lib/admin-api";

/**
 * Lo único que el panel puede alcanzar de la API.
 *
 * Sin esta lista sería un proxy abierto a todo el backend con las credenciales
 * de un revisor: cualquiera con la sesión abierta podría llamar a lo que
 * quisiera desde la consola del navegador.
 *
 * `verification` está aquí porque revisar documentos se hace mucho mejor en una
 * pantalla grande que en el teléfono.
 */
const ALLOWED = ["admin", "verification"];

function target(path: string[]): string | null {
  const clean = path.filter((p) => p && p !== "..");
  if (clean.length === 0 || !ALLOWED.includes(clean[0])) return null;
  return `/${clean.join("/")}`;
}

export async function GET(request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const to = target(path);
  if (!to) return NextResponse.json({ message: "Ruta no válida" }, { status: 400 });

  const query = new URL(request.url).search;
  const result = await apiFetch(`${to}${query}`);
  return NextResponse.json(
    { data: result.data, message: result.message },
    { status: result.ok ? 200 : result.status || 502 },
  );
}

export async function POST(request: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const to = target(path);
  if (!to) return NextResponse.json({ message: "Ruta no válida" }, { status: 400 });

  const body = await request.text();
  const result = await apiFetch(to, { method: "POST", body: body || "{}" });
  return NextResponse.json(
    { data: result.data, message: result.message },
    { status: result.ok ? 200 : result.status || 502 },
  );
}
