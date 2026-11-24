"use client";

import ParametroDelPanel, { type Parametro } from "./ParametroDelPanel";

/** Las reglas de menores y salud que se cambian sin desplegar. Cada cambio queda en el historial de parámetros. */
const PARAMETROS: Parametro[] = [
  {
    key: "minors.public_profile", titulo: "Perfil de un menor sin iniciar sesión",
    opciones: [["como_hoy", "Como hoy"], ["oculto", "Oculto"]],
    ayuda: "Oculto: sin iniciar sesión, un menor no aparece en ningún sitio, salvo que su acudiente lo autorice. Con sesión, todo sigue igual.",
  },
  { key: "health.ask_every_days", titulo: "Días entre solicitudes del permiso de salud", numero: true, ayuda: "Cada cuánto puede una escuela volver a escribirle al acudiente de un mismo jugador." },
  {
    key: "absences.free_text", titulo: "Texto en el motivo de una ausencia", opciones: [["si", "Se permite"], ["no", "Solo la lista"]],
    ayuda: "De «Enfermedad» nunca se guarda texto, esté como esté.",
  },
  { key: "evaluations.minor_note_max", titulo: "Largo de la nota de un ojeador sobre un menor", numero: true, ayuda: "Las que ya están escritas no se recortan." },
  { key: "birth_dates.due_days", titulo: "Días hábiles para responder una corrección de fecha", numero: true, ayuda: "La Ley 1581 da 15. Vale para las solicitudes nuevas." },
  {
    key: "retention.enabled", titulo: "Anonimizar la asistencia de quien ya salió", opciones: [["off", "Apagado"], ["on", "Encendido"]],
    ayuda: "Encendido, cada madrugada la asistencia de quien salió hace más del plazo pasa a ser una cifra sin nombre. No se puede deshacer. No toca recibos ni cobros.",
    confirmar: "¿Encender la anonimización?\n\nLa asistencia de quien salió de su escuela hace más del plazo deja de saberse de quién es, y no se puede deshacer.",
  },
  { key: "retention.attendance_days", titulo: "Días que se conserva la asistencia después de la baja", numero: true, ayuda: "Mínimo 30." },
  {
    key: "auth.code_digits", titulo: "Dígitos del código de correo", opciones: [["4", "4"], ["6", "6"]],
    ayuda: "Con 6, quien tenga la app 1.4.x no puede registrarse ni recuperar su contraseña: tiene cuatro cajas.",
    confirmar: "¿Cambiar los dígitos del código?\n\nCon 6, quien tenga la app 1.4.x no puede registrarse ni recuperar su contraseña.",
  },
];

export default function ParametrosDeMenores() {
  return <div className="grid gap-3">{PARAMETROS.map((p) => <ParametroDelPanel key={p.key} p={p} />)}</div>;
}
