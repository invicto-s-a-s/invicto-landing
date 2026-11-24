import type { Metadata } from "next";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { PieDeFamilia } from "@/components/PieDeFamilia";
import { leerEnlace } from "@/lib/enlace-del-acudiente";
import Recordatorios from "./Recordatorios";

/** **Nunca se indexa**: la dirección es la credencial de la familia. Por lo mismo, tampoco viaja como `Referer`. */
export const metadata: Metadata = {
  title: "Recordatorios de pago",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

interface Estado {
  escuela: string;
  recibe: boolean;
}

/**
 * Donde una familia deja de recibir por correo los recordatorios de pago de su
 * escuela, o los vuelve a activar. Se llega desde el pie de ese correo, sin cuenta.
 *
 * **Abrirla no cambia nada**: los antivirus y los clientes de correo abren los
 * enlaces solos, y darían de baja a quien no lo pidió. Hace falta el toque.
 *
 * No muestra el correo, ni jugadores, ni valores: un correo reenviado no puede
 * contar de quién es la cuenta.
 */
export default async function CorreoDePagoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const e = await leerEnlace<Estado>("fee-mail-links", token);

  if (!e) {
    // Este enlace no expira: si no abre, o está incompleto o la API no respondió.
    return (
      <MarcoDeEnlace>
        <h1 style={titulo}>No pudimos abrir este enlace</h1>
        <p style={parrafo}>
          Revisa que esté completo, tal como llegó en el correo, e inténtalo más tarde. Si sigue sin
          abrir, comunícate directamente con la escuela.
        </p>
      </MarcoDeEnlace>
    );
  }

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA", letterSpacing: 1 }}>INVICTO</p>
      <h1 style={titulo}>Recordatorios de pago de {e.escuela}</h1>
      <p style={{ ...parrafo, marginTop: 0 }}>
        <strong style={{ color: "#AAFF00" }}>Aquí puedes:</strong> decidir si {e.escuela} te envía
        por correo los recordatorios de pago.
      </p>

      <Recordatorios ruta={`/api/correo-de-pago/${encodeURIComponent(token)}`} escuela={e.escuela} inicial={e.recibe} />

      <div style={{ ...tarjeta, marginTop: 24 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué cambia</p>
        <p style={linea}>
          Vale para todos tus jugadores en {e.escuela} que tienen este mismo correo. Los recordatorios
          de pago siguen llegando a la app del jugador.
        </p>
        <p style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 600, color: "#F0F0F0" }}>Qué no cambia</p>
        <p style={linea}>
          Los demás correos de {e.escuela}, como los de asistencia, citaciones y autorizaciones, te
          siguen llegando.
        </p>
      </div>

      <p style={{ ...parrafo, color: "#999999", fontSize: 13, marginTop: 28 }}>
        INVICTO no recibe pagos, solo lleva el registro de las cuentas de la escuela.
      </p>
      <PieDeFamilia pagina="cobro" escuela={e.escuela} />
    </MarcoDeEnlace>
  );
}

const titulo: React.CSSProperties = { fontSize: 27, lineHeight: 1.25, margin: "0 0 14px", color: "#F0F0F0", overflowWrap: "anywhere" };
const parrafo: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "#D0D0D0", margin: "20px 0" };
const tarjeta: React.CSSProperties = { border: "1px solid #343434", borderRadius: 12, padding: "18px 20px", background: "rgb(20 20 20 / 0.70)" };
const linea: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "#AAAAAA", lineHeight: 1.6 };
