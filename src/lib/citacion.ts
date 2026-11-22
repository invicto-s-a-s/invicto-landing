/**
 * Lo que manda el servidor por el enlace de una citación
 * (`GET /callup-responses/:token`). Lo marcado opcional llegó con la
 * especificación de Alexander del 2026-11-22: un servidor de antes no lo trae
 * y la página se arma con lo viejo.
 */
export interface Citacion {
  jugador: string;
  /** El primer nombre, para «¿Iham asistirá?». */
  jugador_nombre?: string | null;
  escuela: string | null;
  rival: string | null;
  dia: string;
  cita: string;
  partido: string;
  lugar: string | null;
  nota: string | null;
  telefono: string | null;
  respuesta: "going" | "cant" | null;
  /** «Partido amistoso»…; null en citaciones de antes de la modalidad. */
  modalidad: string | null;
  /** «Partido vs. Altos FC» o «Práctica interna · Blancos y Colores». */
  titulo?: string;
  /** «Liga» y «Fecha 5 · Liga de Barranquilla». */
  etiqueta?: { tipo: string; detalle: string | null } | null;
  punto_de_encuentro?: string | null;
  local_o_visitante?: "local" | "visitante" | null;
  camiseta?: string | null;
  cancelada: boolean;
  abierta: boolean;
}

const deFrase = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** `2026-11-28` → «Sábado, 28 de noviembre». */
export const diaDeFrase = (dia: string) =>
  deFrase(new Date(`${dia}T12:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" }));

/** El título de la tarjeta. Una práctica interna no dice «Partido vs.». */
export const tituloDelPartido = (c: Citacion) =>
  c.titulo ?? (c.rival ? `Partido vs. ${c.rival}` : "Partido");

/** La etiqueta de arriba: el tipo y, si los hay, la ronda y la competencia. */
export function etiquetaDelPartido(c: Citacion): { tipo: string; detalle: string | null } | null {
  if (c.etiqueta) return c.etiqueta;
  // Un servidor de antes solo manda «Partido amistoso».
  return c.modalidad ? { tipo: c.modalidad, detalle: null } : null;
}

/** Las filas de la tarjeta, con los rótulos de la ficha p13. Lo vacío no sale. */
export function filasDeLaTarjeta(c: Citacion): Array<[string, string]> {
  const filas: Array<[string, string | null | undefined]> = [
    ["Fecha", diaDeFrase(c.dia)],
    ["Llegada", c.cita],
    ["Pitazo inicial", c.partido],
    ["Lugar", c.lugar],
    ["Punto de encuentro", c.punto_de_encuentro],
    ["Llevar", c.nota],
    ["Juega de", c.local_o_visitante === "local" ? "Local" : c.local_o_visitante === "visitante" ? "Visitante" : null],
    ["Camiseta", c.camiseta],
  ];
  return filas.filter((f): f is [string, string] => !!f[1]);
}

/** «Cómo llegar» abre el mapa con el punto de encuentro y el lugar. Solo si la escuela lo escribió. */
export function comoLlegar(c: Citacion): string | null {
  if (!c.punto_de_encuentro) return null;
  const donde = [c.punto_de_encuentro, c.lugar].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donde)}`;
}
