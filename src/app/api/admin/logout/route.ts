import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/admin-api";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
