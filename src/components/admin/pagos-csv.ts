/** Un cobro externo o un saldo a favor, como lo manda `GET /admin/plan-grants/payments`. */
export interface Pago {
  id: number; created_at: string; kind: "cobro" | "saldo"; user_id: number | null; account_name: string; account_email: string | null;
  plan_key: string; plan_name: string; segment: string; amount_cop: number; method: string | null; reference: string | null;
  starts_at: string; ends_at: string | null; request_id: number | null; note: string | null; registrado_por: string | null;
}

/** El día de Bogotá de un instante, para la hoja. */
const dia = (iso: string | null) => (iso ? new Date(new Date(iso).getTime() - 5 * 3_600_000).toISOString().slice(0, 10) : "");

/**
 * Una celda. Las comillas se doblan, y lo que empieza como fórmula se
 * antecede de una comilla: un nombre de escuela es texto, no una instrucción
 * para Excel.
 */
function celda(v: string | number | null): string {
  const t = String(v ?? "");
  const segura = /^[=+\-@\t\r]/.test(t) ? `'${t}` : t;
  return `"${segura.replace(/"/g, '""')}"`;
}

const COLUMNAS: [string, (p: Pago) => string | number | null][] = [
  ["Registrado", (p) => dia(p.created_at)], ["Clase", (p) => (p.kind === "saldo" ? "Saldo a favor" : "Cobro")],
  ["Cuenta", (p) => p.account_name], ["Correo", (p) => p.account_email], ["Número de cuenta", (p) => p.user_id],
  ["Perfil", (p) => p.segment], ["Plan", (p) => p.plan_name], ["Monto", (p) => p.amount_cop], ["Medio", (p) => p.method],
  ["Referencia", (p) => p.reference], ["Inicio", (p) => dia(p.starts_at)], ["Vencimiento", (p) => dia(p.ends_at)],
  ["Solicitud", (p) => p.request_id], ["Registró", (p) => p.registrado_por], ["Nota", (p) => p.note],
];

export const aCsv = (pagos: Pago[]): string =>
  [COLUMNAS.map(([t]) => celda(t)), ...pagos.map((p) => COLUMNAS.map(([, v]) => celda(v(p))))].map((f) => f.join(";")).join("\r\n");
