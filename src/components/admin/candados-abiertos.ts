"use client";

import { useEffect, useState } from "react";

/** El parámetro con los candados abiertos para todos, claves separadas por comas. */
export const RUTA_CANDADOS = "/api/admin/admin/parameters/launch.open_features";

export const leerCandados = (valor: string) =>
  new Set(valor.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean));

/**
 * Los candados abiertos, para el Catálogo: un tope de un candado abierto no se
 * aplica a nadie hasta que se cierra, y eso hay que decirlo donde se edita.
 * `null` mientras carga o si no se pudo leer: entonces no se dice nada.
 */
export function useCandadosAbiertos(): Set<string> | null {
  const [abiertas, setAbiertas] = useState<Set<string> | null>(null);
  useEffect(() => {
    fetch(RUTA_CANDADOS)
      .then((r) => r.json())
      .then((body) => { if (typeof body?.data?.value === "string") setAbiertas(leerCandados(body.data.value)); })
      .catch(() => setAbiertas(null));
  }, []);
  return abiertas;
}
