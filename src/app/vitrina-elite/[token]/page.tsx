import type { Metadata } from "next";
import DosBotones from "@/components/DosBotones";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { leerEnlace } from "@/lib/enlace-del-acudiente";

/** **Nunca se indexa.** Lleva el nombre de un menor. */
export const metadata: Metadata = {
  title: "Autorización | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Autorizacion { jugador: string; decidido: boolean; autoriza: boolean; vencido: boolean }

/**
 * Donde el acudiente autoriza que un menor salga en la Vitrina Élite, o lo
 * retira después con el mismo enlace. Sin cuenta. Se dice quién la ve, qué se
 * muestra y qué no, antes de los botones.
 *
 * **Texto por revisar por quien lleva lo legal**, como las demás páginas que
 * abre una familia.
 */
export default async function VitrinaElitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await leerEnlace<Autorizacion>("vitrina/autorizacion", token);

  if (!p) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace ya no es válido</h1>
        <p style={parrafo}>El jugador puede pedirte la autorización nuevamente desde la app.</p>
      </MarcoDeEnlace>
    );
  }

  const botones = (si: string, no: string) => (
    <DosBotones
      ruta={`/api/vitrina-elite/${encodeURIComponent(token)}`}
      campo="accept" valorSi={true} valorNo={false} si={si} no={no}
      inicial={null} cambiable={false}
      graciasSi={`Guardamos tu autorización. ${p.jugador} puede salir en la Vitrina Élite cuando cumpla las misiones. Con este mismo enlace puedes retirarla cuando quieras.`}
      graciasNo={`Guardamos tu respuesta. ${p.jugador} no sale en la Vitrina Élite.`}
    />
  );

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>{p.jugador} quiere salir en la Vitrina Élite</h1>
      <p style={parrafo}>
        Es una lista que solo ven ojeadores verificados y clubes dentro de la app de INVICTO.
      </p>
      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué se mostrará</p>
        <p style={linea}>Lo que su perfil ya muestra en la app: su nombre, su foto, su posición, su categoría, su ciudad, su último partido y un video.</p>
        <p style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué no se mostrará</p>
        <p style={linea}>Su fecha de nacimiento, su dirección ni sus datos de contacto.</p>
      </div>

      {p.decidido && p.autoriza && (
        <>
          <p style={parrafo}>Ya diste tu autorización. Puedes retirarla cuando quieras, y deja de salir en ese momento.</p>
          {botones("La mantengo", "La retiro")}
        </>
      )}
      {p.decidido && !p.autoriza && <p style={parrafo}>Ya respondiste que no, y {p.jugador} no sale en la Vitrina Élite.</p>}
      {!p.decidido && p.vencido && <p style={parrafo}>Este enlace venció. El jugador puede pedirte la autorización nuevamente desde la app.</p>}
      {!p.decidido && !p.vencido && (
        <>
          <p style={parrafo}>Como es menor de edad, necesitamos tu autorización. Si no respondes, no sale.</p>
          {botones("Autorizo", "No autorizo")}
        </>
      )}
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 20px", color: "#F0F0F0" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = { border: "1px solid #AAFF00", borderRadius: 12, padding: "18px 20px", background: "rgb(20 20 20 / 0.70)" };
const linea: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "#AAAAAA", lineHeight: 1.6 };
