/** Lo que devuelve una llamada del panel: el dato, o el mensaje del servidor si falló. */
export interface Respuesta<T> { ok: boolean; data: T | null; message: string | null }

/**
 * Una llamada a la API a través del proxy del panel (`/api/admin/...`).
 *
 * El proxy solo deja pasar rutas que empiezan por `admin` o `verification`, y
 * los métodos GET, POST, PUT y DELETE.
 */
export async function llamarPanel<T>(
  ruta: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: unknown,
): Promise<Respuesta<T>> {
  const res = await fetch(`/api/admin${ruta}`, {
    method,
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => null);
  const json = await res?.json().catch(() => null);
  return {
    ok: !!res?.ok,
    data: (json?.data as T) ?? null,
    message: typeof json?.message === "string" ? json.message : null,
  };
}

export const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "Sin fecha";

/** «Escuela formativa» es el único tipo que va por la escalera de escuelas (`esEscuela` en el servidor). */
export const TIPOS_DE_INSTITUCION = [
  { value: "school_amateur", label: "Escuela formativa", escalera: "school" },
  { value: "professional", label: "Club profesional", escalera: "club" },
  { value: "semi_professional", label: "Club semiprofesional", escalera: "club" },
  { value: "amateur_club", label: "Club aficionado", escalera: "club" },
] as const;
