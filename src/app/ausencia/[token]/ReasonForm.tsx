"use client";

import { useState } from "react";

const MOTIVOS = [
  { value: "salud", label: "Salud" },
  { value: "viaje", label: "Viaje" },
  { value: "estudio", label: "Estudio" },
  { value: "transporte", label: "Transporte" },
  { value: "otro", label: "Otro" },
] as const;

type Motivo = (typeof MOTIVOS)[number]["value"];

interface Props {
  token: string;
  playerName: string;
}

/**
 * El motivo que cuenta el tutor.
 *
 * Cliente porque es lo único de la página que necesita interacción. El resto
 * —de quién es, qué entrenamiento, el teléfono de la escuela— lo pinta el
 * servidor, así que el padre ve lo que importa aunque el JavaScript tarde o
 * falle. **Eso es deliberado**: el dato que de verdad hace falta a las seis de
 * la tarde es el teléfono, no este formulario.
 *
 * ## «Salud» no pide explicación, y eso es la ley
 *
 * Es un dato sensible (Ley 1581), así que la nota es opcional **para todos los
 * motivos** y el texto lo dice. Un campo obligatorio debajo de «Salud» sería
 * pedirle a un padre que escriba el diagnóstico de su hijo en una web.
 *
 * ## Se puede corregir, y queda
 *
 * El servidor **añade** en vez de editar: si el tutor manda otro motivo, quedan
 * los dos y el club ve el último. Por eso el botón sigue ahí después de
 * guardar, con el texto cambiado.
 */
export default function ReasonForm({ token, playerName }: Props) {
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [nota, setNota] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async () => {
    if (!motivo) return;
    setEnviando(true);
    setError(null);
    try {
      // Por el servidor de la landing, NO directo a la API: un POST con JSON
      // dispara un preflight y la API no tiene CORS en ninguna ruta. Directo,
      // el navegador lo bloquea y al tutor le sale «Failed to fetch».
      const res = await fetch(`/api/ausencia/${encodeURIComponent(token)}/reason`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: motivo, note: nota.trim() || null }),
      });
      if (!res.ok) {
        const cuerpo = await res.json().catch(() => null);
        throw new Error(cuerpo?.message ?? "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
      }
      setGuardado(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      {guardado && (
        <div style={{ ...caja, borderColor: NEON, marginBottom: 20 }}>
          <p style={{ margin: 0, fontWeight: 600, color: "#F0F0F0" }}>Gracias</p>
          <p style={{ margin: "8px 0 0", color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
            La escuela ya recibió tu respuesta. Si necesitas corregirla, puedes
            cambiarla aquí mismo. Se conservará la última que envíes.
          </p>
        </div>
      )}

      <p style={{ color: "#AAAAAA", fontSize: 14, margin: "0 0 10px" }}>
        ¿Cuál fue el motivo?
      </p>
      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
        {MOTIVOS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMotivo(m.value)}
            style={{
              ...pastilla,
              background: motivo === m.value ? NEON : "transparent",
              color: motivo === m.value ? "#0D0D0D" : "#D0D0D0",
              borderColor: motivo === m.value ? NEON : "#555",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <label
        htmlFor="nota"
        style={{ display: "block", color: "#AAAAAA", fontSize: 14, margin: "22px 0 8px" }}
      >
        Si deseas agregar algo más (opcional)
      </label>
      <textarea
        id="nota"
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="No es necesario dar detalles."
        style={area}
      />

      <button
        onClick={enviar}
        disabled={!motivo || enviando}
        style={{
          ...boton,
          background: motivo ? NEON : "#2A2A2A",
          color: motivo ? "#0D0D0D" : "#777",
          cursor: motivo ? "pointer" : "default",
        }}
      >
        {enviando ? "Guardando…" : guardado ? "Cambiar mi respuesta" : "Enviar"}
      </button>

      {error && <p style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>}

      <p style={{ color: GRIS_PIE, fontSize: 13, marginTop: 20, lineHeight: 1.6 }}>
        No es necesario que respondas. Informar el motivo le ayuda a la escuela a
        llevar su registro. Lo que escribas aquí no cambia la asistencia de{" "}
        {playerName}, porque ese registro lo lleva la escuela.
      </p>
    </div>
  );
}

/**
 * El gris del texto de pie.
 *
 * **#999 y no #777, y es una medicion.** Sobre el velo del marco —rgb(8 8 8 /
 * 0.86) encima de la foto del heroe— el peor fondo posible es rgb(43,43,43), y
 * ahi #777 da **3,16:1**: por debajo del 4,5:1 que pide AA para texto normal.
 * #999 da 4,97:1.
 *
 * No es un detalle de estilo: ese pie dice «no hace falta que respondas», que
 * es informacion que un padre necesita para no sentirse obligado a algo.
 */
const GRIS_PIE = "#999999";

const NEON = "#AAFF00";

const pastilla: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 999,
  border: "1px solid",
  fontSize: 14.5,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};

const area: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px 15px",
  borderRadius: 10,
  border: "1px solid #555",
  background: "rgb(12 12 12 / 0.65)",
  color: "#F0F0F0",
  fontSize: 15,
  lineHeight: 1.6,
  fontFamily: "inherit",
  resize: "vertical",
};

const boton: React.CSSProperties = {
  width: "100%",
  marginTop: 18,
  padding: "14px 22px",
  borderRadius: 10,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  fontFamily: "inherit",
};

const caja: React.CSSProperties = {
  border: "1px solid",
  borderRadius: 12,
  padding: "20px 22px",
  background: "rgb(20 20 20 / 0.70)",
};
