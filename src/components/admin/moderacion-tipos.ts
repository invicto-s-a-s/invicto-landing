/** Los del servidor (`PERMISOS_DE_REVISOR`). Los cinco últimos son uno por pestaña (M1, 2026-11-27). */
export type Permiso = "reportes" | "evidencia" | "suspender" | "usuarios" | "solicitudes" | "ajustes" | "permisos"
  | "panorama" | "verificaciones" | "planes" | "menores" | "escuelas";

export const PERMISO_LABEL: Record<Permiso, string> = {
  reportes: "Reportes", evidencia: "Evidencia", suspender: "Suspender", usuarios: "Usuarios",
  solicitudes: "Solicitudes", ajustes: "Ajustes", permisos: "Permisos",
  panorama: "Panorama", verificaciones: "Verificaciones", planes: "Planes", menores: "Menores y salud", escuelas: "Escuelas",
};

export type Clase = "post" | "user" | "comment" | "message";

export const CLASE_LABEL: Record<Clase, string> = { post: "Publicación", user: "Cuenta", comment: "Comentario", message: "Mensaje" };

/** Los motivos con los que reporta la gente. La clave es la del servidor. */
export const MOTIVO_LABEL: Record<string, string> = {
  spam: "Es spam", inapropiado: "Contenido inapropiado", acoso: "Bullying o intimidación",
  menor_en_riesgo: "Pone en riesgo a un menor", falso: "Información falsa", suplantacion: "Se hace pasar por otra persona", otro: "Otro motivo",
};

/** Los motivos con los que se suspende. */
export const SUSPENSION_LABEL: Record<string, string> = {
  menor_en_riesgo: "Pone en riesgo a un menor", acoso: "Bullying o intimidación", inapropiado: "Contenido inapropiado",
  spam: "Spam", suplantacion: "Suplantación", fraude: "Fraude", otro: "Otro motivo",
};

export interface Reportado {
  kind: Clase;
  target_id: number;
  status: string;
  author_user_id: number;
  author_username: string | null;
  author_name: string | null;
  author_suspended: boolean;
  content: string | null;
  files: number;
  total: number;
  reporters: number;
  reasons: { reason: string; count: number }[];
  details: string[];
  first_reported_at: string;
  last_reported_at: string;
}

export interface Copia {
  id: number;
  content: string | null;
  snapshot: Record<string, unknown>;
  captured_at: string;
  expires_at: string | null;
  purged: boolean;
  files: { id: number; media_type: string; state: string; url: string | null }[];
}

export interface Suspendida {
  user_id: number;
  username: string;
  name: string | null;
  role: string | null;
  reason: string | null;
  public_message: string | null;
  until: string | null;
  created_at: string;
  created_by_username: string | null;
}

export interface Pagina<T> { items: T[]; page: number; total: number; has_more: boolean }

export const fechaYHora = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }) : "Sin fecha";
