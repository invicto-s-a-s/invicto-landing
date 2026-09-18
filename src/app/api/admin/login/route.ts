import { NextResponse } from "next/server";
import { API_URL, TOKEN_COOKIE } from "@/lib/admin-api";

/** Una semana, lo mismo que dura el JWT del backend. */
const WEEK = 60 * 60 * 24 * 7;

/**
 * Entrar al panel.
 *
 * No hay un login aparte: es el mismo `POST /auth` que usa la app. Lo que
 * decide quién pasa es `GET /admin/me`, que responde 403 si la cuenta no tiene
 * el permiso de revisor. Así no hay una segunda lista de contraseñas que
 * mantener ni otro sitio del que se puedan filtrar.
 */
export async function POST(request: Request) {
  const { email, password } = await request.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ message: "Escribe tu correo y tu contraseña" }, { status: 400 });
  }

  const auth = await fetch(`${API_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  }).catch(() => null);

  const body = await auth?.json().catch(() => null);
  const token = body?.data?.access_token;

  if (!auth?.ok || !token) {
    return NextResponse.json(
      { message: body?.message ?? "Correo o contraseña incorrectos" },
      { status: 401 },
    );
  }

  // Se comprueba el permiso ANTES de dejar la cookie: si no, alguien sin acceso
  // quedaría "con sesión" y viendo errores en cada pantalla.
  const me = await fetch(`${API_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!me?.ok) {
    return NextResponse.json(
      { message: "Esa cuenta no tiene acceso al panel" },
      { status: 403 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: WEEK,
  });
  return response;
}
