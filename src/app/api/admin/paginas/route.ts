import { NextResponse } from "next/server";
import { leerPaginas } from "@/lib/paginas";

/** Lo mismo que `/api/paginas`: en el subdominio del panel solo se sirve `/api/admin`. */
export async function GET() {
  return NextResponse.json(await leerPaginas());
}
