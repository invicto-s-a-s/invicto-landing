import type { Metadata } from "next";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { PLAY_STORE_URL } from "@/lib/descarga";
import AbrirEnLaApp from "./AbrirEnLaApp";

/**
 * **Nunca se indexa.** El enlace es la credencial completa de la invitación:
 * no puede acabar en un buscador ni en un historial compartido.
 */
export const metadata: Metadata = {
  title: "Tu invitación | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

/** Lo que el servidor genera: letras, números, guion y guion bajo. Lo demás no es un enlace nuestro. */
const TOKEN = /^[A-Za-z0-9_-]{16,200}$/;

interface Props {
  params: Promise<{ token: string }>;
}

/**
 * A donde llega el enlace del correo «te invitaron a unirte a su organización».
 *
 * **Esta página faltaba.** El correo mandaba a `invictoapp.com/invitacion/<token>`
 * y la landing respondía 404: la persona recibía la invitación, tocaba el enlace
 * y no podía hacer nada con ella (lo reportó Daniel el 2026-11-17).
 *
 * **Aquí no se acepta ni se enseña de quién es.** Aceptar necesita la sesión de
 * la app —el servidor comprueba que la cuenta sea la del correo invitado—, y la
 * consulta de «qué invitación es esta» también pide sesión a propósito: el enlace
 * se reenvía, y enseñar la organización sin sesión se lo diría a cualquiera. Lo
 * que hace esta página es llevar a la persona a la app, que es donde se decide.
 */
export default async function InvitacionPage({ params }: Props) {
  const { token } = await params;

  if (!TOKEN.test(token)) {
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>Este enlace no es válido</h1>
        <p style={parrafo}>
          Abre el enlace directamente desde el correo de la invitación. Si sigue sin
          funcionar, solicita al club que te la envíe nuevamente.
        </p>
      </MarcoDeEnlace>
    );
  }

  return (
    <MarcoDeEnlace>
      <h1 style={titulo}>Te invitaron a trabajar con un club en INVICTO</h1>
      <p style={parrafo}>
        La invitación se responde dentro de la app, con la cuenta del correo donde te
        llegó. Ahí verás qué club es y con qué cargo, y decides si aceptas.
      </p>

      <AbrirEnLaApp token={token} />

      <div style={tarjeta}>
        <p style={paso}><b style={fuerte}>¿No tienes la app?</b> Instálala desde Google Play, entra con la
          cuenta de ese correo y vuelve a tocar el enlace del correo.</p>
        <p style={paso}><b style={fuerte}>¿No tienes cuenta?</b> Créala en la app con ese mismo correo. La
          invitación te estará esperando.</p>
        <a href={PLAY_STORE_URL} style={enlace}>Descargar INVICTO en Google Play</a>
      </div>

      <p style={{ ...parrafo, fontSize: 13, color: "#AAAAAA", marginBottom: 0 }}>
        La invitación vale 7 días. Si ya pasaron, solicita al club que te envíe otra.
      </p>
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 20px", color: "#F0F0F0" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = {
  marginTop: 20, padding: 16, borderRadius: 12, border: "1px solid #343434", display: "grid", gap: 12,
};
const paso: React.CSSProperties = { margin: 0, fontSize: 14, lineHeight: 1.6, color: "#D0D0D0" };
const fuerte: React.CSSProperties = { color: "#F0F0F0" };
const enlace: React.CSSProperties = { color: "#C4F750", fontSize: 14, fontWeight: 600 };
