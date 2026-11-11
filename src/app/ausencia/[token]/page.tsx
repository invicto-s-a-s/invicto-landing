import type { Metadata } from "next";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import ReasonForm from "./ReasonForm";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/**
 * **Nunca se indexa.** Esta página lleva el nombre de un menor y dónde entrena
 * su escuela; que acabe en un buscador sería exactamente la fuga que no puede
 * pasar. El token tampoco debe quedar en ningún historial compartido, así que
 * ni el título ni la descripción dicen de quién es.
 */
export const metadata: Metadata = {
  title: "Asistencia | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Aviso {
  jugador: string;
  escuela: string | null;
  cuando: string | null;
  categoria: string | null;
  telefono: string | null;
  motivos: string[];
}

async function cargar(token: string): Promise<Aviso | null> {
  try {
    // `no-store`: el enlace caduca y el tutor puede haber respondido ya desde
    // otro aparato; una copia en caché le enseñaría algo que no es.
    const res = await fetch(`${API_URL}/absence-notices/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    const cuerpo = await res.json();
    return cuerpo?.data ?? null;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ token: string }>;
}

/**
 * Donde una familia se entera de que su hijo no quedó registrado en el
 * entrenamiento, y puede contar por qué.
 *
 * **No hay sesión ni cuenta**: quien abre esto llega desde un correo y puede no
 * saber qué es Invicto. Por eso la página dice, en este orden, de quién es, qué
 * entrenamiento, a quién llamar, y solo al final el formulario.
 *
 * ## El teléfono va ANTES del formulario, y eso es la decisión
 *
 * Lo que una madre necesita a las seis de la tarde no es una lista de motivos:
 * es saber a quién llamar. Dejar el teléfono debajo de un formulario sería
 * ordenar la página por lo que le sirve a la escuela en vez de por lo que le
 * sirve a ella.
 *
 * ## Y el texto NO afirma que el chico faltó
 *
 * Dice «no registramos su asistencia», igual que el correo, porque es lo único
 * que nos consta: lo que la escuela hizo fue no marcarlo. Afirmar que no fue
 * sería dar por cierta una ausencia que no sabemos, y asustar a una familia con
 * una certeza que no tenemos.
 */
export default async function AusenciaPage({ params }: Props) {
  const { token } = await params;
  const aviso = await cargar(token);

  if (!aviso) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace ya no es válido</h1>
        <p style={parrafo}>
          Es posible que haya expirado, porque los enlaces son válidos durante siete
          días. Si deseas informar algo a la escuela, comunícate directamente con ella.
        </p>
      </MarcoDeEnlace>
    );
  }

  const escuela = aviso.escuela ?? "La escuela";

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>No registramos la asistencia de {aviso.jugador}</h1>

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>
          {escuela}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#AAAAAA" }}>
          {aviso.cuando ?? "Entrenamiento de hoy"}
          {aviso.categoria ? ` · ${aviso.categoria.toUpperCase()}` : ""}
        </p>
      </div>

      {/*
        El teléfono, lo primero después del hecho. Va como enlace **y como
        texto**: un `tel:` puede no abrir nada en un navegador de escritorio, y
        entonces el número tiene que seguir ahí para marcarlo a mano.
      */}
      {aviso.telefono && (
        <p style={{ ...parrafo, fontSize: 16 }}>
          Si tienes dudas, llama a la escuela:{" "}
          <a href={`tel:${aviso.telefono}`} style={enlace}>
            {aviso.telefono}
          </a>
        </p>
      )}
      {!aviso.telefono && (
        <p style={parrafo}>
          Si tienes dudas, comunícate directamente con la escuela.
        </p>
      )}

      <hr style={linea} />

      <ReasonForm token={token} playerName={aviso.jugador} />

      <p style={{ ...parrafo, color: GRIS_PIE, fontSize: 13, marginTop: 28 }}>
        Invicto solo transmite lo que registra la escuela. No sabemos dónde está{" "}
        {aviso.jugador} ni somos responsables de su cuidado.
      </p>
    </MarcoDeEnlace>
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

const titulo: React.CSSProperties = {
  fontSize: 27,
  lineHeight: 1.25,
  margin: "0 0 20px",
  color: "#F0F0F0",
};

const parrafo: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.7,
  color: "#D0D0D0",
  margin: "20px 0",
};

const tarjeta: React.CSSProperties = {
  border: "1px solid #AAFF00",
  borderRadius: 12,
  padding: "18px 20px",
  background: "rgb(20 20 20 / 0.70)",
};

const enlace: React.CSSProperties = {
  color: "#AAFF00",
  fontWeight: 600,
  // El número no debe partirse a mitad en un teléfono estrecho.
  whiteSpace: "nowrap",
};

const linea: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #2A2A2A",
  margin: "30px 0 24px",
};
