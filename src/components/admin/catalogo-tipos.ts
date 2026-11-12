export interface Price { id: number; period: "month" | "year"; amount_cop: number; effective_from: string | null }
export interface Feature {
  feature_key: string; kind: "bool" | "limit" | "value"; area: string; description: string;
  bool_value: boolean | null; limit_value: number | null; text_value: string | null; feature_active: boolean;
  /** Si el código la pregunta. Lo manda el servidor desde 2026-11-12; sin él, no se dice nada. */
  en_uso?: boolean;
}
export interface Plan {
  key: string; name: string; segment: string; kind: string; tier: number;
  is_default: boolean; is_active: boolean; prices: Price[]; features: Feature[];
}

/** Lo que se está editando en el catálogo. Uno a la vez. */
export type Edicion =
  | { tipo: "nombre"; plan: Plan }
  | { tipo: "precio"; plan: Plan }
  | { tipo: "encendido"; plan: Plan }
  | { tipo: "capacidad"; plan: Plan; f: Feature }
  | { tipo: "quitar"; plan: Plan; f: Feature };

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
