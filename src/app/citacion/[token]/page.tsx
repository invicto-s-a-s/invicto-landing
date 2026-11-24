import type { Metadata } from "next";
import DosBotones from "@/components/DosBotones";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { PieDeFamilia } from "@/components/PieDeFamilia";
import { type Citacion, comoLlegar, escuelaDeLaCitacion, etiquetaDelPartido, filasDeLaTarjeta, tituloDelPartido } from "@/lib/citacion";
import { leerEnlace } from "@/lib/enlace-del-acudiente";

/**
 * **Nunca se indexa.** Lleva el nombre de un menor, contra quién juega, dónde y
 * a qué hora: que acabe en un buscador es exactamente la fuga que no puede pasar.
 */
export const metadata: Metadata = {
  title: "Citación | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Donde el acudiente ve la citación de su hijo a un partido y responde
 * «Confirmar asistencia» o «No podrá asistir», sin cuenta (ficha p13 de
 * Alexander, 2026-11-22). El orden es el que le sirve: qué partido, cuándo y
 * dónde, a quién escribirle, y al final la pregunta y los botones.
 *
 * **Sin pronombres**: «Avisamos a la escuela que Iham asistirá», nunca «él» o
 * «ella». El nombre no equivoca el género.
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

  const escuela = escuelaDeLaCitacion(c);
  const nombre = c.jugador_nombre ?? c.jugador;
  const etiqueta = etiquetaDelPartido(c);
  const mapa = comoLlegar(c);

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA", letterSpacing: 1 }}>INVICTO</p>
      {etiqueta && !c.cancelada && (
        <p style={{ margin: "0 0 12px" }}>
          <span style={chip}>{etiqueta.tipo}</span>
          {etiqueta.detalle && <span style={{ ...linea, marginLeft: 10 }}>{etiqueta.detalle}</span>}
        </p>
      )}
      <h1 style={titulo}>
        {c.cancelada ? `Se canceló la citación de ${c.jugador}` : `${escuela} cita a ${c.jugador} para un partido`}
      </h1>
      {!c.cancelada && c.abierta && (
        <p style={{ ...parrafo, marginTop: 0 }}>
          <strong style={{ color: "#AAFF00" }}>Aquí puedes:</strong> confirmar si {nombre} asistirá o avisar que no podrá.
        </p>
      )}

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>{tituloDelPartido(c)}</p>
        {filasDeLaTarjeta(c).map(([k, v]) => (
          <p key={k} style={linea}><span style={{ color: "#888888" }}>{k}:</span> {v}</p>
        ))}
        {mapa && (
          <a href={mapa} target="_blank" rel="noopener noreferrer" style={boton}>Cómo llegar</a>
        )}
      </div>

      <p style={{ ...parrafo, fontSize: 16 }}>
        ¿Dudas? Escríbele directamente a la escuela.
        {c.telefono && (
          <>
            {" "}<a href={`tel:${c.telefono}`} style={enlace}>{c.telefono}</a>
          </>
        )}
      </p>

      {c.abierta ? (
        <>
          <p style={{ margin: "24px 0 10px", fontSize: 18, fontWeight: 600, color: "#F0F0F0" }}>¿{nombre} asistirá?</p>
          <DosBotones
            ruta={`/api/citacion/${encodeURIComponent(token)}`}
            campo="answer" valorSi="going" valorNo="cant" si="Confirmar asistencia" no="No podrá asistir"
            inicial={c.respuesta === "going" ? "si" : c.respuesta === "cant" ? "no" : null}
            cambiable
            sinTitulo
            graciasSi={`Gracias por confirmar. Avisamos a la escuela que ${nombre} asistirá. Si cambia el plan, puedes actualizar tu respuesta aquí.`}
            graciasNo={`Gracias por avisar. La escuela ya sabe que ${nombre} no podrá asistir. Si cambia el plan, puedes actualizar tu respuesta aquí.`}
          />
        </>
      ) : (
        <p style={parrafo}>
          {c.cancelada
            ? "No hace falta que respondas."
            : "Esta citación ya no recibe respuestas. Si necesitas avisar algo, escríbele directamente a la escuela."}
        </p>
      )}

      <p style={{ ...parrafo, color: "#999999", fontSize: 13, marginTop: 28 }}>
        INVICTO solo muestra lo que registra la escuela. La citación y sus cambios los decide ella.
      </p>
      <PieDeFamilia pagina="citacion" escuela={escuela} />
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 14px", color: "#F0F0F0" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = { border: "1px solid #AAFF00", borderRadius: 12, padding: "18px 20px", background: "rgb(20 20 20 / 0.70)" };
const linea: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "#D0D0D0", lineHeight: 1.6 };
const enlace: React.CSSProperties = { color: "#AAFF00", fontWeight: 600, whiteSpace: "nowrap" };
const chip: React.CSSProperties = {
  display: "inline-block", padding: "3px 10px", borderRadius: 999, background: "#AAFF00", color: "#111111",
  fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase",
};
const boton: React.CSSProperties = {
  display: "inline-block", marginTop: 14, padding: "10px 16px", borderRadius: 10, border: "1px solid #AAFF00",
  color: "#AAFF00", fontWeight: 600, fontSize: 14, textDecoration: "none",
};
