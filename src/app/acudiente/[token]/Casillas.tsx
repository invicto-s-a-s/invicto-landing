import type { Marcados, Permiso } from "./tipos-de-permiso";

/**
 * Las casillas de los permisos, **separadas del sí y sin marcar** (tarjeta 82).
 * Encima, qué es y para qué; y que marcarla o no, no bloquea nada.
 */
export function Casillas({ permisos, marcados, onCambiar, ocupado }: {
  permisos: Permiso[];
  marcados: Marcados;
  onCambiar: (tipo: Permiso["tipo"], si: boolean) => void;
  ocupado: boolean;
}) {
  return (
    <>
      {permisos.map((p) => (
        <div key={p.tipo} style={caja}>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.7, color: "#BBBBBB" }}>{p.explicacion}</p>
          <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={marcados[p.tipo] === true}
              disabled={ocupado}
              onChange={(e) => onCambiar(p.tipo, e.target.checked)}
              style={{ width: 22, height: 22, marginTop: 1, accentColor: "#AAFF00", flexShrink: 0 }}
            />
            <span style={{ fontSize: 14.5, lineHeight: 1.6, color: "#F0F0F0" }}>{p.texto}</span>
          </label>
        </div>
      ))}
    </>
  );
}

const caja: React.CSSProperties = {
  border: "1px solid #444",
  borderRadius: 12,
  padding: "16px 18px",
  background: "rgb(20 20 20 / 0.70)",
  margin: "0 0 18px",
};
