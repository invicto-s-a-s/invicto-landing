"use client";

import { PLAY_STORE_URL } from "@/lib/descarga";

/**
 * El botón que lleva la invitación a la app.
 *
 * **El salto es a mano, no automático.** Quien abre esto viene del correo y
 * suele estar dentro del navegador del propio correo: redirigir solo deja a
 * quien no tiene la app en un bucle hacia la tienda, sin haber leído nada.
 *
 * Si la app abre, la pestaña pasa a segundo plano y el salto a la tienda se
 * cancela. Si no abre —no está instalada—, va a Google Play.
 */
export default function AbrirEnLaApp({ token }: { token: string }) {
  const abrir = () => {
    const aLaTienda = setTimeout(() => { window.location.href = PLAY_STORE_URL; }, 1500);
    const cancelar = () => { if (document.hidden) clearTimeout(aLaTienda); };
    document.addEventListener("visibilitychange", cancelar, { once: true });

    window.location.href = `invictoapp://invitacion/${token}`;
  };

  return (
    <button
      type="button"
      onClick={abrir}
      style={{
        width: "100%", height: 52, borderRadius: 12, border: "none", cursor: "pointer",
        background: "#C4F750", color: "#1D1B20", fontSize: 15, fontWeight: 700,
      }}
    >
      Abrir la invitación en INVICTO
    </button>
  );
}
