"use client";

import { useState } from "react";

/**
 * Pedir que se corrija la fecha de nacimiento (tarjeta 14). **El documento no se
 * sube**: el sitio donde quedan los archivos todavía es público, y la página lo dice.
 */
export default function CorregirFecha({ token, jugador }: { token: string; jugador: string }) {
  const [abierto, setAbierto] = useState(false);
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ bien: boolean; texto: string } | null>(null);

  const listo = fecha !== "" && motivo.trim().length >= 5;

  const enviar = async () => {
    setEnviando(true);
    setResultado(null);
    try {
      const res = await fetch(`/api/acudiente/${encodeURIComponent(token)}/fecha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birth_date: fecha, reason: motivo.trim() }),
      });
      const cuerpo = await res.json().catch(() => null);
      if (!res.ok) throw new Error(cuerpo?.message ?? "No pudimos enviar tu solicitud. Inténtalo nuevamente.");
      const [a, m, d] = String(cuerpo?.data?.responde_antes_del ?? "").split("-").map(Number);
      const plazo = d ? new Date(a, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "long" }) : null;
      setResultado({ bien: true, texto: `Recibimos tu solicitud.${plazo ? ` Te responderemos a más tardar el ${plazo}.` : ""} ${cuerpo?.data?.documento ?? ""}` });
    } catch (e) {
      setResultado({ bien: false, texto: e instanceof Error ? e.message : "No pudimos enviar tu solicitud. Inténtalo nuevamente." });
    } finally {
      setEnviando(false);
    }
  };

  if (!abierto) {
    return (
      <button onClick={() => setAbierto(true)} style={enlace}>
        La fecha de nacimiento de {jugador} está mal
      </button>
    );
  }
  if (resultado?.bien) return <p role="status" style={{ ...ayuda, color: "#F0F0F0", marginTop: 24 }}>{resultado.texto}</p>;

  return (
    <section style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 17, margin: "0 0 8px", color: "#F0F0F0" }}>Corregir la fecha de nacimiento</h2>
      <p style={ayuda}>
        Revisamos tu solicitud y te respondemos en máximo 15 días hábiles. No subas el documento aquí. Nuestro equipo te lo
        solicitará de forma privada.
      </p>
      <label htmlFor="fecha" style={rotulo}>Fecha correcta</label>
      <input id="fecha" type="date" value={fecha} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setFecha(e.target.value)} style={campo} />
      <label htmlFor="motivo" style={rotulo}>¿Por qué se debe corregir?</label>
      <textarea id="motivo" value={motivo} maxLength={300} rows={2} placeholder="Ej: Se digitó mal el año" onChange={(e) => setMotivo(e.target.value)} style={{ ...campo, resize: "vertical" }} />
      <button
        onClick={enviar}
        disabled={!listo || enviando}
        style={{
          width: "100%", marginTop: 16, padding: "13px 20px", borderRadius: 10, border: "1px solid #555", fontSize: 15, fontWeight: 600,
          fontFamily: "inherit", background: "transparent", color: listo ? "#F0F0F0" : "#888888", cursor: listo ? "pointer" : "default",
        }}
      >
        {enviando ? "Enviando…" : "Enviar solicitud"}
      </button>
      {resultado && <p role="alert" style={{ color: "#FF6B6B", fontSize: 14, marginTop: 12 }}>{resultado.texto}</p>}
    </section>
  );
}

const ayuda: React.CSSProperties = { fontSize: 13.5, lineHeight: 1.7, color: "#BBBBBB", margin: 0 };
const rotulo: React.CSSProperties = { display: "block", color: "#AAAAAA", fontSize: 14, margin: "16px 0 6px" };
const campo: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: "1px solid #555",
  background: "rgb(12 12 12 / 0.65)", color: "#F0F0F0", fontSize: 15, fontFamily: "inherit", colorScheme: "dark",
};
const enlace: React.CSSProperties = {
  marginTop: 24, padding: 0, border: "none", background: "none", color: "#AAAAAA", fontSize: 14, textDecoration: "underline",
  cursor: "pointer", fontFamily: "inherit",
};
