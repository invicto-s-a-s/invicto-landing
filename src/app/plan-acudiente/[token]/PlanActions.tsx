"use client";

import { useState } from "react";

interface Props {
  token: string;
  jugador: string;
  plan: string;
}

/**
 * Los dos botones del acudiente.
 *
 * Cliente porque es lo único que necesita interacción: qué plan, el periodo y
 * el precio los pinta el servidor, y se leen aunque el JavaScript falle.
 */
export default function PlanActions({ token, jugador, plan }: Props) {
  const [enviando, setEnviando] = useState<boolean | null>(null);
  const [hecho, setHecho] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const responder = async (accept: boolean) => {
    setEnviando(accept);
    setError(null);
    try {
      const res = await fetch(`/api/plan-acudiente/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) throw new Error(mensajeDeError(res.status, jugador));
      setHecho(accept);
    } catch (e) {
      setError(e instanceof Error ? e.message : FALLO);
    } finally {
      setEnviando(null);
    }
  };

  if (hecho !== null) {
    return (
      <div style={{ ...caja, borderColor: hecho ? NEON : "#555" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#F0F0F0" }}>
          {hecho ? "Solicitud aprobada" : "Solicitud no aprobada"}
        </p>
        <p style={{ margin: "8px 0 0", color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
          {hecho
            ? `Gracias. La solicitud del plan ${plan} ya llegó al equipo de INVICTO, que se comunicará contigo para confirmarla.`
            : `Gracias por responder. ${jugador} verá en la app que no aprobaste el plan ${plan}. No tienes que hacer nada más.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => responder(true)}
          disabled={enviando !== null}
          style={{ ...boton, background: NEON, color: "#0D0D0D" }}
        >
          {enviando === true ? "Guardando…" : "Aprobar"}
        </button>
        <button
          onClick={() => responder(false)}
          disabled={enviando !== null}
          style={{ ...boton, background: "transparent", color: "#F0F0F0", border: "1px solid #555" }}
        >
          {enviando === false ? "Guardando…" : "No aprobar"}
        </button>
      </div>

      {error && <p style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>}

      <p style={{ color: GRIS_PIE, fontSize: 13, marginTop: 20, lineHeight: 1.6 }}>
        Si no respondes, la solicitud no llegará al equipo de INVICTO.
      </p>
    </div>
  );
}

const FALLO = "No pudimos guardar tu respuesta. Inténtalo nuevamente.";

/**
 * Textos propios en vez del `message` de la API: los de la API están pensados
 * para el jugador en la app («puedes volver a solicitarlo»), y quien lee esto
 * es su acudiente.
 */
function mensajeDeError(status: number, jugador: string): string {
  if (status === 400) return `Este enlace expiró. ${jugador} puede volver a solicitar el plan desde la app y te enviaremos un enlace nuevo.`;
  if (status === 404) return "Este enlace no es válido.";
  if (status === 409) return "Esta solicitud ya fue respondida o ya no está vigente. Recarga la página para ver su estado.";
  return FALLO;
}

/** #999 y no #777: sobre el velo del marco, #777 no llega al 4,5:1 de AA. */
const GRIS_PIE = "#999999";

const NEON = "#AAFF00";

const boton: React.CSSProperties = {
  flex: "1 1 200px",
  padding: "14px 22px",
  borderRadius: 10,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const caja: React.CSSProperties = {
  border: "1px solid",
  borderRadius: 12,
  padding: "20px 22px",
  background: "rgb(20 20 20 / 0.70)",
};
