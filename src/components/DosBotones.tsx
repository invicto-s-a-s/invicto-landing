"use client";

import { useState } from "react";

const NEON = "#AAFF00";

/**
 * Dos respuestas por un enlace del acudiente: «Voy» o «No puedo», «Acepto» o
 * «No acepto». Se envían por el servidor de la landing (la API no tiene CORS).
 *
 * `cambiable`: si después de responder se puede cambiar (la citación sí, el
 * permiso de la vitrina no: ese se decide una vez).
 *
 * Los agradecimientos llegan como **texto y no como función**: la página es de
 * servidor y una función no cruza a un componente de cliente (daba 500).
 */
export default function DosBotones({
  ruta, si, no, campo, valorSi, valorNo, inicial, cambiable, graciasSi, graciasNo,
}: {
  ruta: string;
  si: string;
  no: string;
  campo: string;
  valorSi: string | boolean;
  valorNo: string | boolean;
  inicial: "si" | "no" | null;
  cambiable: boolean;
  graciasSi: string;
  graciasNo: string;
}) {
  const [respuesta, setRespuesta] = useState<"si" | "no" | null>(inicial);
  const [enviando, setEnviando] = useState<"si" | "no" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cerrado = respuesta !== null && !cambiable;

  const enviar = async (cual: "si" | "no") => {
    setEnviando(cual);
    setError(null);
    try {
      const res = await fetch(ruta, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [campo]: cual === "si" ? valorSi : valorNo }),
      });
      if (!res.ok) {
        const cuerpo = await res.json().catch(() => null);
        throw new Error(cuerpo?.message ?? "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
      }
      setRespuesta(cual);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setEnviando(null);
    }
  };

  return (
    <div>
      {respuesta && (
        <div style={{ ...caja, borderColor: NEON, marginBottom: 18 }}>
          <p style={{ margin: 0, fontWeight: 600, color: "#F0F0F0" }}>Gracias</p>
          <p style={{ margin: "8px 0 0", color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>{respuesta === "si" ? graciasSi : graciasNo}</p>
        </div>
      )}
      {!cerrado && (
        <div style={{ display: "flex", gap: 10 }}>
          {(["si", "no"] as const).map((cual) => {
            const elegida = respuesta === cual;
            return (
              <button
                key={cual}
                type="button"
                onClick={() => enviar(cual)}
                disabled={enviando !== null}
                style={{
                  ...boton,
                  background: elegida ? NEON : "transparent",
                  color: elegida ? "#0D0D0D" : "#F0F0F0",
                  borderColor: elegida ? NEON : "#555",
                }}
              >
                {enviando === cual ? "Guardando…" : cual === "si" ? si : no}
              </button>
            );
          })}
        </div>
      )}
      {error && <p style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>}
    </div>
  );
}

const caja: React.CSSProperties = { border: "1px solid #343434", borderRadius: 12, padding: "16px 18px", background: "rgb(20 20 20 / 0.70)" };
const boton: React.CSSProperties = {
  flex: 1, height: 52, borderRadius: 12, border: "1px solid", fontSize: 15, fontWeight: 700, cursor: "pointer",
};
