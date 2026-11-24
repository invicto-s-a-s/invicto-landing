import { NextResponse } from "next/server";
import { leerPaginas } from "@/lib/paginas";

/** Para el pie de página, que es del navegador. */
export async function GET() {
  return NextResponse.json(await leerPaginas(), { headers: { "Cache-Control": "public, max-age=300" } });
}
