import { NextResponse } from "next/server";
import { API_URL, TOKEN_COOKIE } from "@/lib/admin-api";

/**
 * La sesión del panel dura 12 horas, aunque el token del servidor dure una
 * semana: desde aquí se abren documentos de identidad de menores, y una
 * sesión olvidada en un computador ajeno no debería servir días (WEB-01).
 */
const SESION = 60 * 60 * 12;

/**
 * El mismo texto si la contraseña está mal y si la cuenta no tiene acceso: con
 * dos distintos, el panel le diría a quien prueba que acertó la contraseña de
 * una cuenta de la app.
 */
const NO_ENTRA = "Correo o contraseña incorrectos, o esa cuenta no tiene acceso al panel.";

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

  // El freno de intentos lo pone el servidor (10 fallos por cuenta, 30 por
  // minuto): su aviso se enseña tal cual.
  if (auth?.status === 429) {
    return NextResponse.json({ message: body?.message ?? "Demasiados intentos. Espera unos minutos." }, { status: 429 });
  }
  if (!auth?.ok || !token) {
    return NextResponse.json({ message: NO_ENTRA }, { status: 401 });
  }

  // Se comprueba el permiso ANTES de dejar la cookie: si no, alguien sin acceso
  // quedaría "con sesión" y viendo errores en cada pantalla.
  const me = await fetch(`${API_URL}/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!me?.ok) {
    return NextResponse.json({ message: NO_ENTRA }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESION,
  });
  return response;
}
