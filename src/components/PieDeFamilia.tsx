import Link from "next/link";

/**
 * El pie de cada página que abre una familia desde un correo: quién la envía,
 * para qué, qué la respalda, cómo dejar de recibirlo y la política de
 * privacidad (D2, tarjeta 12). El mismo orden que el pie de los correos
 * (`pie-de-familia.ts` en invicto-back). Los textos, juntos para el abogado, en
 * `docs/legal/textos-a-familias.md` de ese repositorio.
 */
const PARA: Record<Pagina, [string, string, string]> = {
  acudiente: [
    "para que decidas si autorizas al jugador y qué permites de sus datos",
    "Ves esta página porque te registraron como su acudiente y te enviamos este enlace a tu correo.",
    "Si no respondes, no se autoriza nada. Puedes cambiar tus permisos cuando quieras desde este mismo enlace.",
  ],
  autorizar: [
    "para que decidas si una persona verificada puede escribirle al jugador",
    "Ves esta página porque el jugador te registró como su acudiente y te enviamos este enlace a tu correo.",
    "Es un mensaje de protección de menores y no se puede desactivar. Puedes retirar cada permiso cuando quieras.",
  ],
  ausencia: [
    "para informarte de la asistencia que registró la escuela",
    "Ves esta página porque eres el acudiente registrado del jugador en esta escuela.",
    "Si no deseas recibir este tipo de mensajes, solicítalo a la escuela o escríbenos a soporte@invictoapp.com.co.",
  ],
  citacion: [
    "para informarte de una citación a un partido",
    "Ves esta página porque eres el acudiente registrado del jugador en esta escuela.",
    "Si no deseas recibir este tipo de mensajes, solicítalo a la escuela o escríbenos a soporte@invictoapp.com.co.",
  ],
  cobro: [
    "para que decidas si recibes por correo los recordatorios de pago",
    "Ves esta página porque eres el acudiente registrado de un jugador de esta escuela.",
    "Puedes desactivarlos y volver a activarlos aquí cuando quieras.",
  ],
  vitrina: [
    "para solicitar tu autorización",
    "Ves esta página porque eres el acudiente registrado del jugador en esta escuela.",
    "Si no respondes, no se autoriza nada.",
  ],
};
type Pagina = "acudiente" | "autorizar" | "ausencia" | "citacion" | "cobro" | "vitrina";

export function PieDeFamilia({ pagina, escuela }: { pagina: Pagina; escuela?: string | null }) {
  const [para, respaldo, baja] = PARA[pagina];
  return (
    <footer style={{ borderTop: "1px solid #2A2A2A", marginTop: 28, paddingTop: 16 }}>
      {/* #999 y no más oscuro: sobre el velo del marco es lo mínimo que se lee (AA). */}
      <p style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: "#999999" }}>
        Esta página la envía INVICTO{escuela ? `, en relación con ${escuela},` : ""} {para}. {respaldo} {baja}{" "}
        <Link href="/politica-de-privacidad" style={{ color: "#AAFF00" }}>Política de privacidad</Link>
      </p>
    </footer>
  );
}
