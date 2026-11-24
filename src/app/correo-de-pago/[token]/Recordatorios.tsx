"use client";

import { useState } from "react";

const NEON = "#AAFF00";
const FALLO = "No pudimos guardar el cambio. Inténtalo nuevamente.";

/**
 * El estado y un solo botón, el que lo cambia. Desactivar no pide motivo ni un
 * segundo paso: quien llegó hasta aquí ya lo decidió.
 */
export default function Recordatorios({ ruta, escuela, inicial }: { ruta: string; escuela: string; inicial: boolean }) {
  const [recibe, setRecibe] = useState(inicial);
  const [cambiado, setCambiado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cambiar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recibir: !recibe }),
      });
      const cuerpo = await res.json().catch(() => null);
      if (!res.ok) throw new Error(cuerpo?.message ?? FALLO);
      // Lo que quedó guardado, no lo que se pidió.
      setRecibe(cuerpo?.data?.recibe ?? !recibe);
      setCambiado(true);
    } catch (e) {
      // Sin conexión, el navegador da su propio mensaje en inglés.
      setError(e instanceof Error && !(e instanceof TypeError) ? e.message : FALLO);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div role="status" style={{ ...caja, borderColor: recibe ? NEON : "#555" }}>
        <p style={{ margin: 0, color: "#F0F0F0", fontSize: 16, lineHeight: 1.6 }}>{frase(recibe, cambiado, escuela)}</p>
      </div>
      <button
        type="button"
        onClick={cambiar}
        disabled={enviando}
        style={{
          ...boton,
          background: recibe ? "transparent" : NEON,
          color: recibe ? "#F0F0F0" : "#0D0D0D",
          borderColor: recibe ? "#555" : NEON,
          opacity: enviando ? 0.6 : 1,
        }}
      >
        {enviando ? "Guardando…" : recibe ? "Desactivar estos correos" : "Volver a activarlos"}
      </button>
      {error && <p role="alert" style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>}
    </div>
  );
}

function frase(recibe: boolean, cambiado: boolean, escuela: string): string {
  if (recibe) {
    return cambiado
      ? `Listo: activaste nuevamente los recordatorios de pago de ${escuela} por correo.`
      : "Los recordatorios de pago por correo están activados.";
  }
  return cambiado
    ? `Listo: ${escuela} ya no te enviará recordatorios de pago por correo. Si cambias de opinión, puedes volver a activarlos aquí.`
    : "Los recordatorios de pago por correo están desactivados.";
}

const caja: React.CSSProperties = { border: "1px solid", borderRadius: 12, padding: "16px 18px", background: "rgb(20 20 20 / 0.70)" };
const boton: React.CSSProperties = {
  width: "100%", minHeight: 52, marginTop: 14, padding: "0 16px", borderRadius: 12, border: "1px solid",
  fontSize: 15, fontWeight: 700, cursor: "pointer",
};
