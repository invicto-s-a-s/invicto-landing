import type { Paginas } from "@/lib/paginas-tipos";

/**
 * BORRADOR PARA LEGAL (tarjeta 84). No lo ha revisado quien lleva lo legal.
 *
 * Se ve en el panel (Moderación → Páginas) y solo sale al público cuando
 * `legal.child_safety` está en «on». Todo lo que dice que hacemos es lo que el
 * sistema hace hoy; lo que falta por decidir está entre corchetes.
 */
export default function SeguridadInfantil({ emails, safety_contact }: Pick<Paginas, "emails" | "safety_contact">) {
  const correo = emails.safety ?? emails.support;
  return (
    <>
      <p>
        INVICTO es una comunidad de fútbol en la que participan menores de edad. Tenemos <strong>cero tolerancia</strong> con
        cualquier forma de abuso, explotación o conducta sexual hacia niños, niñas y adolescentes, y con cualquier contenido
        que los ponga en riesgo.
      </p>

      <h2>1. Lo que no está permitido</h2>
      <ul>
        <li>Publicar, pedir o compartir contenido que sexualice a un menor o lo muestre en una situación de abuso.</li>
        <li>Contactar a un menor para ganarse su confianza con un fin indebido, o pedirle imágenes, datos o encuentros.</li>
        <li>Amenazar, presionar, intimidar o acosar a un menor.</li>
        <li>Hacerse pasar por otra persona, por un ojeador o por un club.</li>
      </ul>

      <h2>2. Cómo protegemos a los menores</h2>
      <ul>
        <li>Un ojeador o un club solo puede escribirle a un menor si su cuenta está verificada y su acudiente lo autoriza.</li>
        <li>Nunca mostramos la ubicación exacta de una persona.</li>
        <li>Cualquier persona puede bloquear a otra: deja de ver lo que publica y no pueden escribirse.</li>
        <li>La escuela solo suma a un menor a su plantilla con la autorización de su acudiente.</li>
      </ul>

      <h2>3. Cómo reportar</h2>
      <p>
        Dentro de la app puedes reportar una publicación, una cuenta, un comentario o un mensaje desde su menú. Elige el
        motivo «Pone en riesgo a un menor» para que lo veamos primero. La persona reportada no sabrá quién la reportó.
      </p>
      {correo && (
        <p>
          También puedes escribirnos a <a href={`mailto:${correo}`}>{correo}</a>, con o sin cuenta.
        </p>
      )}

      <h2>4. Qué hacemos con cada reporte</h2>
      <ol>
        <li>Lo revisa una persona de nuestro equipo, con prioridad si hay un menor en riesgo.</li>
        <li>Si corresponde, suspendemos la cuenta de inmediato: deja de poder entrar, publicar y escribir, y deja de verse.</li>
        <li>Conservamos de forma privada la evidencia de lo reportado, aunque quien lo publicó lo borre.</li>
        <li>
          Informamos a las autoridades cuando la ley lo exige o hay riesgo para un menor. En Colombia: ICBF, línea 141, y
          Fiscalía General de la Nación. [Legal: confirmar canales y plazos.]
        </li>
      </ol>

      <h2>5. Persona de contacto</h2>
      <p>
        {safety_contact ?? "[Legal: nombre y cargo de la persona designada.]"}
        {correo && (
          <>
            {" "}
            · <a href={`mailto:${correo}`}>{correo}</a>
          </>
        )}
      </p>
    </>
  );
}
