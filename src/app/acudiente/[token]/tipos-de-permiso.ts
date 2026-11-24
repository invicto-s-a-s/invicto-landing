/** Un permiso como lo manda el servidor. Un servidor anterior no manda ninguno y la página es la de siempre. */
export interface Permiso {
  tipo: "health_sensitive" | "public_profile";
  version: string;
  texto: string;
  explicacion: string;
  autorizado: boolean;
  desde: string | null;
}

export type Marcados = Partial<Record<Permiso["tipo"], boolean>>;

export const marcadosDe = (permisos: Permiso[]): Marcados =>
  Object.fromEntries(permisos.map((p) => [p.tipo, p.autorizado]));

export const fechaLarga = (iso: string): string =>
  new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });
