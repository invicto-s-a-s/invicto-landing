/**
 * BORRADOR PARA LEGAL (tarjeta 7): el texto que acepta quien escribe por la web.
 *
 * La clave es la versión que guarda el servidor (`contact.form_version`). Si el
 * panel pide una que no está aquí, el formulario no se muestra: no se puede
 * guardar que alguien aceptó un texto que no leyó. Para cambiarlo se añade otra
 * versión y nunca se edita una que ya se usó.
 */
export const AUTORIZACIONES: Record<string, string> = {
  "v1-borrador":
    "Autorizo a INVICTO a usar los datos de este formulario para responderme y darle seguimiento a mi solicitud, según su "
    + "Política de Privacidad. Puedo pedir en cualquier momento que los corrijan o los eliminen.",
};
