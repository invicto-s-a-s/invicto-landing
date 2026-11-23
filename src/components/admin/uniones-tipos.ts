/** Lo que manda `GET /admin/sede-unions` y `GET /admin/sede-unions/:id` (invicto-back). */
export type EstadoDeUnion = "pendiente" | "aprobada" | "ejecutada" | "rechazada" | "retirada" | "deshecha";

interface Cuenta { club_id: number | null; user_id: number | null; nombre: string | null }

export interface Union {
  id: number;
  estado: EstadoDeUnion;
  principal: Cuenta;
  llega: Cuenta;
  nombre_de_la_sede: string;
  motivo: string | null;
  pedida_en: string;
  respondida_en: string | null;
  ejecutada_en: string | null;
  deshecha_en: string | null;
}

export interface Conteo { tabla: string; nombre: string; filas: number }

export interface Ensayo {
  conteos: Conteo[];
  bloqueos: { clave: string; texto: string; detalle?: string[] }[];
  avisos: { clave: string; texto: string }[];
  dinero: { movimientos: number; saldo_cop: number; con_saldo: number };
  huella: string;
  se_puede_ejecutar: boolean;
}

export interface DetalleDeUnion extends Union {
  encendido: boolean;
  ensayo: Ensayo | null;
  hecho: {
    resumen: { conteos: Conteo[]; jugadores: number; equipo: number; movimientos_del_libro: number; saldo_total_cop: number; tarifas_apagadas: number } | null;
    deshacer: { se_puede: boolean; por_que: string | null };
    rezagadas: Conteo[];
  } | null;
}

export const ESTADOS: { value: EstadoDeUnion; label: string; que_falta: string }[] = [
  { value: "aprobada", label: "Por ejecutar", que_falta: "Las dos escuelas ya dijeron que sí. Falta revisar el ensayo y ejecutarla." },
  { value: "pendiente", label: "Esperando respuesta", que_falta: "Falta que la responda el dueño de la escuela principal." },
  { value: "ejecutada", label: "Hechas", que_falta: "La escuela ya es una sede." },
  { value: "rechazada", label: "Rechazadas", que_falta: "El dueño de la escuela principal dijo que no." },
  { value: "retirada", label: "Retiradas", que_falta: "Quien la pidió la retiró." },
  { value: "deshecha", label: "Deshechas", que_falta: "Se deshizo: todo volvió a como estaba." },
];

export const pesos = (n: number) => `$${n.toLocaleString("es-CO")}`;
