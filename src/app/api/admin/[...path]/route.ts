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

/**
 * Un tramo de ruta y nada más: letras, números, guiones, y puntos **entre**
 * letras (las claves de capacidad son `aura.search`).
 *
 * Antes solo se descartaban los tramos iguales a `..`. Un tramo que **contenía**
 * una barra codificada (`..%2Fusers`) pasaba, y al normalizarse la URL salía de
 * `/admin/` hacia cualquier ruta de la API (auditoría 2026-11-10, WEB-02). Con
 * una lista de lo que sí vale, lo que no se conoce no entra.
 */
const TRAMO = /^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*$/;

function target(path: string[]): string | null {
  if (path.length === 0 || !ALLOWED.includes(path[0])) return null;
  if (!path.every((p) => TRAMO.test(p))) return null;
  return `/${path.join("/")}`;
}

type Ctx = { params: Promise<{ path: string[] }> };

const invalida = () => NextResponse.json({ message: "Ruta no válida" }, { status: 400 });

export async function GET(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const to = target(path);
  if (!to) return invalida();

  const query = new URL(request.url).search;
  const result = await apiFetch(`${to}${query}`);
  return NextResponse.json(
    { data: result.data, message: result.message },
    { status: result.ok ? 200 : result.status || 502 },
  );
}

/** Las escrituras: mismo camino, misma lista, cambia el método. */
async function escribir(method: "POST" | "PUT" | "DELETE", request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const to = target(path);
  if (!to) return invalida();

  const body = method === "DELETE" ? undefined : (await request.text()) || "{}";
  const result = await apiFetch(to, { method, body });
  return NextResponse.json(
    { data: result.data, message: result.message },
    { status: result.ok ? 200 : result.status || 502 },
  );
}

export const POST = (request: Request, ctx: Ctx) => escribir("POST", request, ctx);

// PUT y DELETE entraron con la administración de planes (2026-11-10): el
// catálogo se edita con `PUT` y una capacidad se quita con `DELETE`.
export const PUT = (request: Request, ctx: Ctx) => escribir("PUT", request, ctx);
export const DELETE = (request: Request, ctx: Ctx) => escribir("DELETE", request, ctx);
