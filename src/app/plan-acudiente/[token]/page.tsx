import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MarcoDeEnlace } from "@/components/MarcoDeEnlace";
import { PieDeFamilia } from "@/components/PieDeFamilia";
import PlanActions from "./PlanActions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

/**
 * **Nunca se indexa.** Lleva el nombre de un menor. Ni el título ni la
 * descripción dicen de quién es, porque el enlace puede quedar en un historial
 * compartido.
 */
export const metadata: Metadata = {
  title: "Aprobación de plan | INVICTO",
  robots: { index: false, follow: false, nocache: true },
};

interface Solicitud {
  jugador: string;
  plan: string;
  periodo: "month" | "year";
  precio_cop: number | null;
  decidido: boolean;
  aprueba: boolean | null;
  vencido: boolean;
  vigente: boolean;
}

async function cargar(token: string): Promise<Solicitud | null> {
  try {
    // `no-store`: el acudiente puede haber respondido desde otro aparato, y una
    // copia en caché le enseñaría los botones de algo que ya decidió.
    const res = await fetch(`${API_URL}/plans/guardian-approval/${encodeURIComponent(token)}`, { cache: "no-store" });
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
 * Donde el acudiente de un jugador menor aprueba o no el plan que este
 * solicitó. Sin su sí la solicitud no llega al revisor.
 *
 * **No hay sesión ni cuenta**: se llega desde un correo. La página dice qué
 * plan, el periodo y el precio, y que aprobar no cobra nada: en la app no se
 * cobra, el equipo confirma con la familia.
 */
export default async function PlanAcudientePage({ params }: Props) {
  const { token } = await params;
  const s = await cargar(token);

  if (!s) {
    return (
      <Aviso titulo="Este enlace no es válido">
        Es posible que el enlace esté incompleto. Ábrelo nuevamente desde el correo que te
        enviamos o pide al jugador que vuelva a solicitar el plan desde la app.
      </Aviso>
    );
  }

  if (!s.vigente) {
    return (
      <Aviso titulo="Esta solicitud ya no está vigente">
        {s.jugador} cambió o canceló esta solicitud desde la app. No tienes que hacer nada más.
      </Aviso>
    );
  }

  if (s.vencido) {
    return (
      <Aviso titulo="Este enlace expiró">
        {s.jugador} puede volver a solicitar el plan desde la app, y te enviaremos un enlace nuevo.
      </Aviso>
    );
  }

  const cada = s.periodo === "year" ? "Anual" : "Mensual";
  const precio = s.precio_cop != null
    ? `$${s.precio_cop.toLocaleString("es-CO")} ${s.periodo === "year" ? "al año" : "al mes"}`
    : null;

  return (
    <MarcoDeEnlace>
      <p style={{ ...parrafo, marginTop: 0, color: "#AAAAAA" }}>Invicto</p>
      <h1 style={titulo}>{s.jugador} solicitó un plan de INVICTO</h1>

      <div style={tarjeta}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#F0F0F0" }}>Plan {s.plan}</p>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#AAAAAA" }}>
          {cada}
          {precio ? ` · ${precio}` : ""}
        </p>
      </div>

      {!s.decidido && (
        <p style={parrafo}>
          Nos comunicamos contigo porque {s.jugador} es menor de edad y te registró como su
          acudiente. <strong>Si apruebas, la solicitud llega al equipo de INVICTO, que se
          comunicará contigo para confirmarla.</strong> En la app no se cobra nada.
        </p>
      )}

      {s.decidido ? (
        <div style={{ ...tarjeta, borderColor: s.aprueba ? "#AAFF00" : "#555" }}>
          <p style={{ margin: 0, color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
            {s.aprueba === true
              ? "Ya aprobaste esta solicitud. El equipo de INVICTO se comunicará contigo para confirmarla."
              : s.aprueba === false
                ? `Ya respondiste que no apruebas esta solicitud. ${s.jugador} puede verlo en la app.`
                : "Esta solicitud ya fue respondida."}
          </p>
        </div>
      ) : (
        <PlanActions token={token} jugador={s.jugador} plan={s.plan} />
      )}
      <PieDeFamilia pagina="plan" />
    </MarcoDeEnlace>
  );
}

function Aviso({ titulo: t, children }: { titulo: string; children: ReactNode }) {
  return (
    <MarcoDeEnlace>
      <h1 style={titulo}>{t}</h1>
      <p style={parrafo}>{children}</p>
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
