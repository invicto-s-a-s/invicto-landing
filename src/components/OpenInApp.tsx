"use client";

import { useEffect, useState } from "react";

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.invicto.app";
// Sin app de iPhone publicada todavía: a la portada, que explica qué es INVICTO.
const APP_STORE = "https://invictoapp.com/";

/**
 * Solo se ve si el sistema NO intercepto el enlace (app sin instalar, o App Links
 * aun sin verificar). Con Universal/App Links funcionando, la app se abre antes
 * de que esta pagina llegue a pintarse.
 *
 * El salto es manual a proposito: redirigir solo deja al usuario atrapado en un
 * bucle hacia la tienda cuando no tiene la app.
 */
export function OpenInApp({ postId }: { postId: number }) {
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
  }, []);

  if (!platform) return null;

  const openApp = () => {
    const store = platform === "ios" ? APP_STORE : PLAY_STORE;
    const timer = setTimeout(() => {
      window.location.href = store;
    }, 1200);

    // Si la app abre, la pestana pasa a background y cancelamos el salto a la tienda
    const cancel = () => {
      if (document.hidden) clearTimeout(timer);
    };
    document.addEventListener("visibilitychange", cancel, { once: true });

    window.location.href = `invictoapp://p/${postId}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#C4F750]/30 bg-[#C4F750]/10 px-4 py-3">
      <p className="text-sm text-white/80">Míralo mejor en la app</p>
      <button
        type="button"
        onClick={openApp}
        className="shrink-0 rounded-lg bg-[#C4F750] px-4 py-2 text-sm font-semibold text-[#1D1B20]"
      >
        Abrir
      </button>
    </div>
  );
}
