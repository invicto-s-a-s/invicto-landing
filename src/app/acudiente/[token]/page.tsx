import type { Metadata } from "next";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import ConsentActions from "./ConsentActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/**
 * **Nunca se indexa.** Lleva el nombre de un menor y el club al que entrena.
 * El token tampoco debe quedar en ningún historial compartido, así que ni el
 * título ni la descripción dicen de quién es.
 */
export const metadata: Metadata = {
  title: "Autorización | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Solicitud {
  jugador: string;
  club: string;
  acudiente: string | null;
  parentesco: string | null;
  respondido: "aprobado" | "rechazado" | null;
  pedido_el: string | null;
}

async function cargar(token: string): Promise<Solicitud | null> {
  try {
    // `no-store`: el acudiente puede haber respondido ya desde otro aparato, y
    // una copia en caché le enseñaría los botones de algo que ya decidió.
    const res = await fetch(`${API_URL}/roster-consents/${token}`, { cache: "no-store" });
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
 * Donde el padre, la madre o el tutor autoriza que su hijo entre a un club.
 *
 * **No hay sesión ni cuenta**: quien abre esto llega desde un correo y puede no
 * saber qué es Invicto. Por eso la página dice, en este orden, quién se vinculó,
 * a qué club, qué significa autorizar y qué pasa si no hace nada.
 *
 * ## Lo que dice y lo que no
 *
 * Dice **exactamente qué cambia** con el sí: que el perfil del chico aparece en
 * la plantilla del club. No promete nada más, porque no pasa nada más — y un
 * consentimiento que describe mal lo que autoriza no vale como consentimiento.
 *
 * No dice nada de otros jugadores ni del club más allá de su nombre: el enlace
 * abre una sola fila.
 */
export default async function AcudientePage({ params }: Props) {
  const { token } = await params;
  const solicitud = await cargar(token);

  if (!solicitud) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace ya no es válido</h1>
        <p style={parrafo}>
          Es posible que haya expirado, porque los enlaces son válidos durante catorce
          días. Si deseas autorizar, solicita al club que te lo envíe nuevamente.
        </p>
      </MarcoDeEnlace>
    );
  }

  const { jugador, club, respondido } = solicitud;

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>¿Autorizas que {jugador} entre a {club}?</h1>

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>
          {club}
        </p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#AAAAAA" }}>
          {jugador} se vinculó
          {solicitud.pedido_el
            ? ` el ${new Date(solicitud.pedido_el).toLocaleDateString("es-CO", {
              day: "numeric", month: "long",
            })}`
            : ""}
          {solicitud.parentesco ? ` · te registró como su ${solicitud.parentesco}` : ""}
        </p>
      </div>

      <p style={parrafo}>
        Nos comunicamos contigo porque <strong>{jugador}</strong> es menor de edad y te
        registró como su acudiente. Con tu autorización, su perfil aparecerá en la
        plantilla de {club} dentro de Invicto.
      </p>

      {respondido ? (
        <div style={{ ...tarjeta, borderColor: "#555" }}>
          <p style={{ margin: 0, color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
            {respondido === "aprobado"
              ? `Ya autorizaste esta solicitud. ${jugador} está en la plantilla de ${club}.`
              : "Ya respondiste que no autorizas esta solicitud."}
          </p>
        </div>
      ) : (
        <ConsentActions token={token} playerName={jugador} clubName={club} />
      )}
    </MarcoDeEnlace>
  );
}

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
