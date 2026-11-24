import { API_URL } from "@/lib/enlace-del-acudiente";
import { NADA_PUBLICADO, Paginas } from "@/lib/paginas-tipos";

let ultima: Paginas | null = null;

/**
 * Qué páginas están publicadas.
 *
 * Si la API no contesta vale lo último que dijo: una página que ya se publicó y
 * está enlazada en Google Play no puede dar 404 por un corte. Sin haber sabido
 * nada, no se publica nada.
 */
export async function leerPaginas(): Promise<Paginas> {
  try {
    const res = await fetch(`${API_URL}/public/pages`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) return ultima ?? NADA_PUBLICADO;
    const cuerpo = await res.json();
    const d = cuerpo?.data as Partial<Paginas> | null;
    if (!d) return ultima ?? NADA_PUBLICADO;
    ultima = {
      ...NADA_PUBLICADO,
      ...d,
      child_safety: d.child_safety === true,
      account_deletion: d.account_deletion === true,
      contact_form: d.contact_form === true,
      emails: { ...NADA_PUBLICADO.emails, ...d.emails },
    };
    return ultima;
  } catch {
    return ultima ?? NADA_PUBLICADO;
  }
}
