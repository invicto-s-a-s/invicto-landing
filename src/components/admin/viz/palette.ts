/**
 * Los colores de los gráficos del panel.
 *
 * No son los de la landing: el lima de marca (`#AAFF00`) tiene una luminosidad
 * de 0.91, muy por encima de la banda 0.48–0.67 en la que los colores de una
 * serie se distinguen entre sí. Sirve para un botón; para una leyenda de tres
 * categorías, no.
 *
 * Estos tres pasan las seis comprobaciones sobre el fondo `#141414`: banda de
 * luminosidad, croma mínimo, separación para daltonismo (ΔE 26.8 en protanopia),
 * separación en visión normal (ΔE 29.5) y contraste ≥ 3:1.
 *
 * El primero es el lima de marca bajado hasta entrar en banda: se sigue
 * reconociendo como Invicto sin dejar de ser legible al lado de los otros dos.
 */
export const SERIES = {
  lima: "#6E9E00",
  azul: "#3987e5",
  naranja: "#d95926",
} as const;

/**
 * El lima puro se reserva para las series solitarias, donde no hay nada de lo
 * que distinguirlo y lo único que importa es el contraste contra el fondo — que
 * sí cumple de sobra.
 */
export const SOLO = "#AAFF00";

export const SURFACE = "#141414";
