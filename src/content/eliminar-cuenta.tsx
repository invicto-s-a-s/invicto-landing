import type { Paginas } from "@/lib/paginas-tipos";

/**
 * BORRADOR PARA LEGAL (tarjeta 85). No lo ha revisado quien lleva lo legal.
 *
 * Los plazos son los que aplica el sistema hoy: 30 días para arrepentirse y un
 * año de conservación antes de borrar (`account-deletion.ts` en el servidor).
 * **La política de privacidad todavía dice 90 días**: tienen que decir lo mismo
 * antes de publicar esta página.
 */
export default function EliminarCuenta({ emails }: Pick<Paginas, "emails">) {
  const correo = emails.privacy ?? emails.support;
  return (
    <>
      <p>Puedes eliminar tu cuenta de INVICTO y tus datos cuando quieras. No tiene costo y no necesitas dar un motivo.</p>

      <h2>1. Desde la app</h2>
      <ol>
        <li>Entra a <strong>Configuración</strong>.</li>
        <li>Toca <strong>Eliminar cuenta</strong>.</li>
        <li>Escribe ELIMINAR y confirma.</li>
      </ol>

      <h2>2. Si ya no tienes la app</h2>
      <p>
        {correo ? (
          <>
            Escríbenos a <a href={`mailto:${correo}?subject=Eliminar%20mi%20cuenta`}>{correo}</a> desde el correo de tu
            cuenta, con tu nombre de usuario. Te responderemos para confirmar que eres tú.
          </>
        ) : (
          "[Legal: correo para solicitar la eliminación sin la app.]"
        )}
      </p>

      <h2>3. Qué pasa después</h2>
      <ul>
        <li>Tu perfil, tus publicaciones y tus datos dejan de verse de inmediato.</li>
        <li>
          Tienes <strong>30 días</strong> para recuperar la cuenta iniciando sesión. Después ya no se puede recuperar.
        </li>
        <li>Las conversaciones que tuviste siguen en la bandeja de la otra persona, sin tu nombre.</li>
        <li>
          Conservamos la información hasta un año, fuera de la vista de todos, para atender reclamos, investigaciones o
          exigencias de ley. Después se borra de forma definitiva. [Legal: confirmar plazo y fundamento.]
        </li>
        <li>
          Los registros contables que una escuela debe conservar por ley no se borran con tu cuenta. [Legal: confirmar.]
        </li>
      </ul>

      <h2>4. Cuentas de menores de edad</h2>
      <p>El padre, la madre o el acudiente puede solicitar la eliminación en nombre del menor por el mismo correo.</p>
    </>
  );
}
