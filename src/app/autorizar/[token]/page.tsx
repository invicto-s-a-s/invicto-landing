import type { Metadata } from "next";
import AuthorizeActions from "./AuthorizeActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/**
 * **Nunca se indexa.** Esta página lleva el nombre de un menor y el texto de un
 * mensaje privado; que acabe en un buscador sería la fuga exacta que el control
 * parental existe para evitar. El token tampoco debe quedar en ningún historial
 * compartido, así que ni título ni descripción dicen de quién es.
 */
export const metadata: Metadata = {
  title: "Autorizar contacto | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Peticion {
  status: "awaiting_message" | "pending" | "approved" | "rejected" | "revoked";
  minor: { name: string | null };
  requester: {
    name: string | null;
    username: string | null;
    role: string | null;
    verified: boolean;
    club_name: string | null;
  };
  message: string | null;
  requested_at: string;
}

async function cargar(token: string): Promise<Peticion | null> {
  try {
    // `no-store`: el estado cambia en cuanto el tutor responde, y una copia en
    // caché le enseñaría los botones de algo que ya decidió.
    const res = await fetch(`${API_URL}/guardian/requests/${token}`, { cache: "no-store" });
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
 * Donde el padre, la madre o el tutor decide si alguien puede escribirle a su
 * hijo.
 *
 * **No hay sesión ni cuenta**: quien abre esto llega desde un correo y puede no
 * saber qué es Invicto. Por eso la página dice, en este orden, a quién le
 * escriben, quién escribe, qué escribió y qué pasa si no hace nada.
 *
 * El mensaje se lee **entero**. Fue la decisión de producto: sin leerlo no se
 * puede juzgar, porque la diferencia entre un ojeador serio y alguien raro está
 * en lo que escribe, no en que exista.
 */
export default async function AutorizarPage({ params }: Props) {
  const { token } = await params;
  const peticion = await cargar(token);

  if (!peticion) {
    return (
      <Marco>
        <h1 style={titulo}>Este enlace ya no sirve</h1>
        <p style={parrafo}>
          Puede que haya caducado o que ya se haya respondido. Si crees que es un
          error, pídele a tu hijo o hija que vuelva a intentarlo desde la app.
        </p>
      </Marco>
    );
  }

  const menor = peticion.minor.name ?? "tu hijo/a";
  const quien = peticion.requester.name
    ?? (peticion.requester.username ? `@${peticion.requester.username}` : "Un usuario de Invicto");
  const rol = peticion.requester.role === "club" ? "Club" : "Ojeador";

  const yaRespondida = peticion.status !== "pending";

  return (
    <Marco>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>¿Autorizas que le escriban a {menor}?</h1>

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>{quien}</p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#AAAAAA" }}>
          {rol}
          {peticion.requester.club_name ? ` · ${peticion.requester.club_name}` : ""}
          {peticion.requester.verified ? " · Verificado por Invicto" : ""}
        </p>
      </div>

      {peticion.message && (
        <>
          <p style={{ ...parrafo, marginBottom: 8, color: "#AAAAAA", fontSize: 14 }}>
            Su mensaje:
          </p>
          <blockquote style={cita}>{peticion.message}</blockquote>
        </>
      )}

      <p style={parrafo}>
        Te escribimos a ti porque {menor} es menor de edad y te registró como su
        representante. <strong>Sin tu autorización nadie puede enviarle mensajes.</strong>
      </p>

      {yaRespondida ? (
        <div style={{ ...tarjeta, borderColor: "#555" }}>
          <p style={{ margin: 0, color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
            {peticion.status === "approved"
              ? `Ya autorizaste este contacto. Puedes retirarlo desde la cuenta de ${menor}, en Configuración.`
              : "Esta solicitud ya fue respondida."}
          </p>
        </div>
      ) : (
        <AuthorizeActions token={token} minorName={menor} />
      )}
    </Marco>
  );
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100dvh", padding: "48px 20px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>{children}</div>
    </main>
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

const cita: React.CSSProperties = {
  margin: 0,
  padding: "16px 18px",
  borderLeft: "3px solid #AAFF00",
  background: "rgb(12 12 12 / 0.65)",
  borderRadius: "0 8px 8px 0",
  color: "#F0F0F0",
  fontSize: 15,
  lineHeight: 1.65,
  whiteSpace: "pre-wrap",
  // Un mensaje con una palabra larguisima no debe ensanchar la pagina en un
  // telefono, que es donde se va a abrir casi siempre.
  overflowWrap: "anywhere",
};
