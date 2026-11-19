import type { Metadata } from "next";
import DosBotones from "@/components/DosBotones";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { leerEnlace } from "@/lib/enlace-del-acudiente";

/**
 * **Nunca se indexa.** Lleva el nombre de un menor, contra quién juega, dónde y
 * a qué hora: que acabe en un buscador es exactamente la fuga que no puede pasar.
 */
export const metadata: Metadata = {
  title: "Citación | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Citacion {
  jugador: string;
  escuela: string | null;
  rival: string | null;
  dia: string;
  cita: string;
  partido: string;
  lugar: string | null;
  nota: string | null;
  telefono: string | null;
  respuesta: "going" | "cant" | null;
  cancelada: boolean;
  abierta: boolean;
}

const diaLargo = (dia: string) =>
  new Date(`${dia}T12:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });

/**
 * Donde el acudiente ve la citación de su hijo a un partido y responde «Voy» o
 * «No puedo», sin cuenta. El orden es el que le sirve: qué partido, cuándo y
 * dónde, a quién llamar, y al final los botones.
 */
export default async function CitacionPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const c = await leerEnlace<Citacion>("callup-responses", token);

  if (!c) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace ya no es válido</h1>
        <p style={parrafo}>
          Es posible que haya expirado o que la escuela haya enviado uno nuevo. Revisa el último
          correo de la escuela o comunícate directamente con ella.
        </p>
      </MarcoDeEnlace>
    );
  }

  const escuela = c.escuela ?? "La escuela";
  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>
        {c.cancelada ? `Se canceló la citación de ${c.jugador}` : `${escuela} citó a ${c.jugador} a un partido`}
      </h1>

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>
          {c.rival ? `Contra ${c.rival}` : "Partido"}
        </p>
        <p style={linea}>{diaLargo(c.dia)}</p>
        <p style={linea}>Llegar a las {c.cita} · el partido empieza a las {c.partido}</p>
        {c.lugar && <p style={linea}>{c.lugar}</p>}
        {c.nota && <p style={{ ...linea, color: "#D0D0D0" }}>{c.nota}</p>}
      </div>

      {c.telefono ? (
        <p style={{ ...parrafo, fontSize: 16 }}>
          Si tienes dudas, llama a la escuela:{" "}
          <a href={`tel:${c.telefono}`} style={enlace}>{c.telefono}</a>
        </p>
      ) : (
        <p style={parrafo}>Si tienes dudas, comunícate directamente con la escuela.</p>
      )}

      {c.abierta ? (
        <DosBotones
          ruta={`/api/citacion/${encodeURIComponent(token)}`}
          campo="answer" valorSi="going" valorNo="cant" si="Va" no="No puede"
          inicial={c.respuesta === "going" ? "si" : c.respuesta === "cant" ? "no" : null}
          cambiable
          graciasSi={`La escuela ya sabe que ${c.jugador} va. Si algo cambia, puedes responder aquí mismo.`}
          graciasNo={`La escuela ya sabe que ${c.jugador} no puede ir. Si algo cambia, puedes responder aquí mismo.`}
        />
      ) : (
        <p style={parrafo}>
          {c.cancelada
            ? "No hace falta que respondas."
            : "Esta citación ya no recibe respuestas. Si necesitas avisar algo, comunícate con la escuela."}
        </p>
      )}

      <p style={{ ...parrafo, color: "#999999", fontSize: 13, marginTop: 28 }}>
        Invicto solo transmite lo que registra la escuela. La citación y sus cambios los decide ella.
      </p>
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 20px", color: "#F0F0F0" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = { border: "1px solid #AAFF00", borderRadius: 12, padding: "18px 20px", background: "rgb(20 20 20 / 0.70)" };
const linea: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "#AAAAAA", lineHeight: 1.6 };
const enlace: React.CSSProperties = { color: "#AAFF00", fontWeight: 600, whiteSpace: "nowrap" };
