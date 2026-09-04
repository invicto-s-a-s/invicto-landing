import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Términos y Condiciones | INVICTO",
  description:
    "Términos y Condiciones de uso de INVICTO, la plataforma de social scouting que conecta el talento deportivo con oportunidades reales.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Términos y Condiciones" lastUpdated="Marzo de 2026">
      <p>
        Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma <strong>INVICTO</strong> (en
        adelante, la &ldquo;Plataforma&rdquo;). Al registrarse y utilizar la Plataforma, la persona usuaria acepta
        íntegramente estos Términos y Condiciones. Si no está de acuerdo con alguno de ellos, deberá abstenerse de
        utilizar la Plataforma.
      </p>
      <p>
        <strong>Versión:</strong> 1.0 &middot; Documento legal base de INVICTO.
      </p>

      <h2>1. Definiciones</h2>
      <ul>
        <li>
          <strong>Plataforma:</strong> INVICTO, aplicación digital de conexión deportiva.
        </li>
        <li>
          <strong>Jugador:</strong> persona usuaria que registra su perfil deportivo con el fin de dar visibilidad a
          su talento.
        </li>
        <li>
          <strong>Ojeador:</strong> persona usuaria que registra su perfil profesional, observa y evalúa talento
          deportivo dentro de la Plataforma.
        </li>
        <li>
          <strong>Club:</strong> institución deportiva registrada en la Plataforma.
        </li>
      </ul>

      <h2>2. Naturaleza de la Plataforma</h2>
      <p>
        INVICTO es una plataforma digital operada desde Colombia por su equipo fundador. La sociedad comercial que
        operará formalmente la Plataforma se encuentra en proceso de constitución; una vez inscrita en Cámara de
        Comercio, estos Términos serán actualizados para reflejar la razón social correspondiente.
      </p>
      <p>
        La Plataforma facilita la visibilidad, exposición y conexión entre jugadores, ojeadores y clubes. INVICTO{" "}
        <strong>no garantiza</strong> contratos, fichajes, pruebas ni resultados deportivos. La participación en la
        Plataforma representa una oportunidad de exposición, no un compromiso.
      </p>

      <h2>3. Información del perfil</h2>
      <p>
        La persona usuaria se compromete a proporcionar información veraz, completa y actualizada. El uso de
        información falsa, la suplantación de identidad o el suministro de datos de terceros sin autorización podrán
        resultar en la suspensión o eliminación inmediata de la cuenta, sin perjuicio de las acciones legales que
        correspondan.
      </p>

      <h2>4. Uso de imagen y contenido</h2>
      <p>
        Al publicar contenido dentro de la Plataforma, la persona usuaria autoriza a INVICTO a utilizar su imagen,
        nombre, videos y datos deportivos con el propósito de mostrarlos dentro de la Plataforma y facilitar la
        conexión con otros usuarios (jugadores, ojeadores y clubes).
      </p>
      <p>
        Esta autorización es <strong>no exclusiva</strong> y <strong>sin costo</strong>. La persona usuaria puede
        revocarla en cualquier momento conforme a las políticas de la Plataforma, sin que ello afecte los usos previos
        realizados con base en la autorización otorgada.
      </p>

      <h2>5. Interacción en la Plataforma</h2>
      <p>
        Las interacciones deportivas, profesionales y sociales relacionadas con INVICTO deben realizarse dentro de la
        Plataforma. Está prohibido el acoso, el spam, el contacto no autorizado, el uso de la Plataforma para fines
        distintos a los deportivos y cualquier práctica que atente contra la integridad de otras personas usuarias.
      </p>

      <h2>6. Conducta</h2>
      <p>
        La persona usuaria se compromete a mantener un comportamiento profesional y respetuoso, absteniéndose de
        conductas indebidas, fraude deportivo, uso de sustancias prohibidas, discursos de odio, discriminación o
        cualquier acción contraria a la integridad del deporte, a la ley o a la moral. El incumplimiento podrá dar
        lugar a la suspensión o eliminación de la cuenta.
      </p>

      <h2>7. Personas usuarias menores de edad</h2>
      <p>
        El uso de INVICTO por parte de personas menores de dieciocho (18) años requiere la autorización previa,
        expresa e informada de su padre, madre o representante legal, quien será responsable del uso que el menor haga
        de la cuenta y del tratamiento de la información asociada.
      </p>
      <p>
        La Plataforma está dirigida a personas mayores de trece (13) años. INVICTO se reserva el derecho de solicitar
        evidencia de dicha autorización y de suspender o eliminar cuentas de menores que no cuenten con el
        consentimiento acreditado del representante legal.
      </p>

      <h2>8. Sin garantía de resultados</h2>
      <p>
        INVICTO es una herramienta de visibilidad y conexión. <strong>No garantiza</strong> contratos, fichajes,
        pruebas deportivas, becas, ofertas laborales ni ningún resultado específico derivado del uso de la Plataforma.
        La exposición generada representa una oportunidad, no un compromiso, y depende de múltiples factores externos
        a INVICTO, incluido el criterio propio de ojeadores, clubes y demás actores del ecosistema deportivo.
      </p>

      <h2>9. Funcionalidades futuras</h2>
      <p>
        Algunas funciones —incluidas, sin limitarse a, fichajes digitales, acuerdos económicos o contratos
        automatizados— podrán estar disponibles en versiones futuras de la Plataforma y estarán sujetas a la
        aceptación de términos adicionales en su debido momento.
      </p>

      <h2>10. Terminación</h2>
      <p>
        La persona usuaria puede eliminar su cuenta en cualquier momento a través del canal oficial indicado en la
        Política de Privacidad. INVICTO podrá suspender, restringir o eliminar cuentas que incumplan los presentes
        Términos y Condiciones, sin perjuicio de las acciones legales que correspondan.
      </p>

      <h2>11. Tratamiento de datos personales</h2>
      <p>
        La persona usuaria autoriza el tratamiento de sus datos personales conforme a la{" "}
        <a href="/politica-de-privacidad">Política de Privacidad</a> de INVICTO, en cumplimiento de la Ley 1581 de
        2012 y demás normas concordantes de la legislación colombiana.
      </p>

      <h2>12. Ley aplicable y jurisdicción</h2>
      <p>
        Estos Términos y Condiciones se rigen por la legislación colombiana vigente. Cualquier controversia derivada
        de su interpretación o aplicación será resuelta ante los jueces competentes de la República de Colombia.
      </p>

      <h2>Autorización del representante legal (menores de edad)</h2>
      <div className="callout">
        <p>
          Como padre, madre o representante legal, autorizo al menor bajo mi responsabilidad a utilizar la plataforma
          INVICTO, así como el tratamiento de sus datos personales, imágenes y contenido deportivo con fines de
          visibilidad dentro de la Plataforma, en los términos descritos en los presentes Términos y Condiciones y en
          la Política de Privacidad de INVICTO.
        </p>
      </div>
    </LegalPageShell>
  );
}
