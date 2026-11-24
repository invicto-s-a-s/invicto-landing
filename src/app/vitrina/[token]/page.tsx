import type { Metadata } from "next";
import DosBotones from "@/components/DosBotones";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { PieDeFamilia } from "@/components/PieDeFamilia";
import { leerEnlace } from "@/lib/enlace-del-acudiente";

/** **Nunca se indexa.** Lleva el nombre de un menor y su club. */
export const metadata: Metadata = {
  title: "Permiso | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Permiso {
  jugador: string;
  escuela: string | null;
  tags: string[];
  decidido: boolean;
  acepto: boolean;
  vencido: boolean;
}

/**
 * Donde el acudiente decide si su hijo aparece en «Recomendados por su club»,
 * la lista que solo ven ojeadores verificados de Invicto. Sin cuenta. Se dice
 * qué se muestra y qué no antes de los botones, y se decide una sola vez.
 */
export default async function VitrinaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await leerEnlace<Permiso>("showcase-consents", token);

  if (!p) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace ya no es válido</h1>
        <p style={parrafo}>Si deseas responder, comunícate directamente con la escuela.</p>
      </MarcoDeEnlace>
    );
  }

  const escuela = p.escuela ?? "La escuela";
  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>{escuela} quiere recomendar a {p.jugador}</h1>

      <p style={parrafo}>
        Quiere mostrarlo en «Recomendados por su club», una lista que solo ven ojeadores
        verificados de Invicto.
      </p>
      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué se mostrará</p>
        <p style={linea}>Su nombre y el nombre del club{p.tags.length ? `, y lo que el club destaca de él: ${p.tags.join(", ")}` : ""}.</p>
        <p style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué no se mostrará</p>
        <p style={linea}>Las notas de su evaluación ni quién lo evaluó.</p>
      </div>

      {p.decidido ? (
        <p style={parrafo}>
          {p.acepto
            ? `Ya diste el permiso: ${p.jugador} aparece en la vitrina. Si quieres retirarlo, comunícate con la escuela.`
            : "Ya respondiste que no. Si cambias de opinión, comunícate con la escuela."}
        </p>
      ) : p.vencido ? (
        <p style={parrafo}>Este enlace venció. Si quieres responder, comunícate con la escuela.</p>
      ) : (
        <>
          <p style={parrafo}>Necesitamos tu permiso. Si no respondes, no se muestra.</p>
          <DosBotones
            ruta={`/api/vitrina/${encodeURIComponent(token)}`}
            campo="accept" valorSi={true} valorNo={false} si="Doy el permiso" no="No doy el permiso"
            inicial={null}
            cambiable={false}
            graciasSi={`${p.jugador} ya aparece en «Recomendados por su club». Si quieres retirarlo, comunícate con la escuela.`}
            graciasNo={`${p.jugador} no aparecerá en la vitrina. La escuela ya lo sabe.`}
          />
        </>
      )}
      <PieDeFamilia pagina="vitrina" escuela={p.escuela} />
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 20px", color: "#F0F0F0" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = { border: "1px solid #AAFF00", borderRadius: 12, padding: "18px 20px", background: "rgb(20 20 20 / 0.70)" };
const linea: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "#AAAAAA", lineHeight: 1.6 };
