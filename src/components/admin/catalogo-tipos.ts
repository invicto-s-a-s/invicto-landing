export interface Price { id: number; period: "month" | "year"; amount_cop: number; effective_from: string | null }
export interface Feature {
  feature_key: string; kind: "bool" | "limit" | "value"; area: string; description: string;
  bool_value: boolean | null; limit_value: number | null; text_value: string | null; feature_active: boolean;
  /** Si el código la pregunta. Lo manda el servidor desde 2026-11-12; sin él, no se dice nada. */
  en_uso?: boolean;
  /**
   * La app la enseña como «Próximamente». Es de la capacidad, no del plan: vale
   * para todos los planes que la traen. Lo manda el servidor desde 2026-11-27.
   */
  coming_soon?: boolean;
}
export interface Plan {
  key: string; name: string; segment: string; kind: string; tier: number;
  is_default: boolean; is_active: boolean; prices: Price[]; features: Feature[];
  /** A la medida de un cliente: solo lo ve quien lo tiene. Lo manda el servidor desde 2026-11-19. */
  is_private?: boolean;
}

/** Cuántas cuentas tiene un plan. En el de entrada, `resto` son las que no tienen otro. */
export interface Conteo { key: string; total: number; listadas: number; resto: number }

/** Un plan que se le puede dar a una cuenta, de su escalera. */
export interface PlanConcedible {
  key: string; name: string; tier: number; kind: string; is_default: boolean; is_private: boolean;
  /** La escalera. Opcional: un servidor anterior no la manda. */
  segment?: string;
}

export const SEGMENTOS: Record<string, string> = { player: "Jugador", scout: "Ojeador", club: "Club", school: "Escuela" };

/** Lo que se está editando en el catálogo. Uno a la vez. */
export type Edicion =
  | { tipo: "nombre"; plan: Plan }
  | { tipo: "precio"; plan: Plan }
  | { tipo: "encendido"; plan: Plan }
  | { tipo: "privado"; plan: Plan }
  | { tipo: "añadir"; plan: Plan }
  | { tipo: "capacidad"; plan: Plan; f: Feature }
  | { tipo: "quitar"; plan: Plan; f: Feature }
  | { tipo: "pronto"; plan: Plan; f: Feature };

/** Una línea de lo que el plan enseña en la app («destacados»). Es contenido, no permisos. */
export interface Linea {
  id: number; position: number; title: string; detail: string | null;
  soon: boolean; includes_previous: boolean;
}

/** Lo que cabe en la tarjeta del plan. Lo mismo que exige el servidor. */
export const TITULO_MAXIMO = 80;
export const DETALLE_MAXIMO = 200;

export const campo = "w-full bg-[#141414] border border-[#222] rounded-lg px-3 py-2 text-sm text-on-surface";
export const boton = "text-xs px-4 py-2 rounded-lg disabled:opacity-40";
export const chip = (on: boolean) => `text-xs px-3 py-1.5 rounded-lg ${on ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`;

export type Guardar = (url: string, method: "PUT" | "POST" | "DELETE", body?: unknown) => Promise<boolean>;

export const pesos = (n: number) => `$${Math.round(n).toLocaleString("es-CO")}`;

/** El valor de una capacidad en un plan, dicho en corto. */
export function valorDe(f: Feature): string {
  if (f.kind === "bool") return f.bool_value ? "Sí" : "No";
  if (f.kind === "limit") return f.limit_value === null ? "Sin tope" : String(f.limit_value);
  return f.text_value ?? "—";
}

/**
 * Lo que hay que saber antes de tocar una capacidad: si hoy no hace nada.
 * `sin_efecto`: el código no la consulta (casi todas son «Próximamente»; la
 * corona y el número de visitas funcionan, pero por otro camino).
 * `abierta`: es un candado abierto para todos, y su valor no se aplica hasta
 * cerrarlo en Candados.
 */
export function estadoDe(f: Feature, abiertas: Set<string> | null): "sin_efecto" | "abierta" | null {
  if (f.en_uso === false) return "sin_efecto";
  if (f.en_uso && abiertas?.has(f.feature_key)) return "abierta";
  return null;
}

/** `AAAA-MM-DD` de hoy, con el día local (no el UTC). */
export function hoyLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
