import { cookies } from "next/headers";

export const API_URL = process.env.INVICTO_API_URL ?? "https://api.invictoapp.com";

/**
 * El token del panel vive en una cookie `httpOnly`, no en localStorage.
 *
 * Esto es una página pública de marketing: cualquier script de terceros que
 * acabe aquí —una etiqueta de analítica, un pixel— podría leer localStorage. La
 * cookie `httpOnly` no la ve el JavaScript de la página, así que un XSS en la
 * landing no se lleva la sesión del panel.
 *
 * Por eso el navegador tampoco habla con la API directamente: todo pasa por las
 * rutas de Next, que son las que añaden el token. De paso no hace falta abrir
 * CORS en el backend para un dominio web.
 */
export const TOKEN_COOKIE = "invicto_admin";

export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE)?.value ?? null;
}

interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  message?: string;
}

/** Llama a la API de Invicto desde el servidor, con el token de la sesión. */
export async function apiFetch<T>(
  path: string,
  init: RequestInit & { token?: string | null } = {},
): Promise<ApiResult<T>> {
  const token = init.token ?? (await getToken());

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });

    const body = await res.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;

    return { ok: res.ok, status: res.status, data: body?.data ?? null, message };
  } catch {
    // La API cae o la red falla: el panel lo enseña como aviso, no como pantalla rota.
    return { ok: false, status: 0, data: null, message: "No se pudo conectar con la API" };
  }
}
