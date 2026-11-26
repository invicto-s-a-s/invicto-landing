import { PLAY_STORE_URL } from "@/lib/descarga";

/**
 * Intenta abrir la app en `ruta` (`p/45`, `u/12`) y, si no abre, lleva a la
 * tienda. Si la app abre, la pestaña pasa a segundo plano y el salto a la tienda
 * se cancela.
 *
 * Es a mano, con un toque: redirigir solo deja a quien no tiene la app en un
 * bucle hacia la tienda sin haber visto nada.
 */
export function abrirEnLaApp(ruta: string): void {
  const aLaTienda = setTimeout(() => { window.location.href = PLAY_STORE_URL; }, 1500);
  const cancelar = () => { if (document.hidden) clearTimeout(aLaTienda); };
  document.addEventListener("visibilitychange", cancelar, { once: true });
  window.location.href = `invictoapp://${ruta}`;
}

export function irALaTienda(): void {
  window.location.href = PLAY_STORE_URL;
}
