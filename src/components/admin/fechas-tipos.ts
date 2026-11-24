/** Una solicitud de corrección de fecha, como la manda `GET /admin/birth-date-requests`. */
export interface SolicitudDeFecha {
  id: number;
  user_id: number;
  nombre: string;
  fecha_actual: string | null;
  fecha_nueva: string;
  edad_actual: number | null;
  edad_nueva: number;
  motivo: string;
  quien: "acudiente" | "escuela" | "titular";
  escuela: string | null;
  estado: "pendiente" | "aprobada" | "rechazada";
  vence_el: string;
  dias_habiles_que_quedan: number;
  alerta: "vencida" | "por_vencer" | null;
  cruce: "a_mayor" | "a_menor" | null;
  que_cambia: string[];
  escribir_para_confirmar: string | null;
  nota: string | null;
}

export const QUIEN: Record<SolicitudDeFecha["quien"], string> = {
  acudiente: "La solicitó su acudiente", escuela: "La solicitó su escuela", titular: "La solicitó la propia persona",
};

/** El día, sin zona: es una fecha de nacimiento y no un instante. */
export const dia = (f: string | null): string => {
  if (!f) return "Sin fecha";
  const [a, m, d] = f.slice(0, 10).split("-").map(Number);
  return new Date(a, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
};

export function plazo(s: SolicitudDeFecha): string {
  if (s.estado !== "pendiente") return s.estado === "aprobada" ? "Aprobada" : "Rechazada";
  const n = s.dias_habiles_que_quedan;
  if (n < 0) return `Venció hace ${-n} ${n === -1 ? "día hábil" : "días hábiles"}`;
  if (n === 0) return "Vence hoy";
  return `Quedan ${n} ${n === 1 ? "día hábil" : "días hábiles"}`;
}
