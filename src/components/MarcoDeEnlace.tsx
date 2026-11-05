import type { ReactNode } from "react";

/**
 * El marco de las páginas que se abren desde un correo: `/autorizar` y
 * `/ausencia`.
 *
 * ## Por qué lleva un velo, y no lo llevaba
 *
 * El sitio tiene una **imagen de fondo fija al viewport** (`body::before` en
 * `globals.css`): la foto del héroe, con mucho contraste y zonas casi blancas.
 * La página de marketing está construida sobre tarjetas semitransparentes y se
 * lee bien; estas dos ponen **párrafos sueltos encima de la foto**, y el texto
 * acababa atravesado por la imagen.
 *
 * Mirado a 375 px, que es donde se abren casi siempre: «Si tienes dudas, llama
 * a la escuela: 3001234567» caía justo sobre la parte clara. Y ese número es
 * **lo único que de verdad le sirve a una familia** a las seis de la tarde.
 *
 * El velo es una columna oscura detrás del contenido, no un fondo opaco en todo
 * el `body`: así la marca sigue ahí alrededor —estas páginas son lo primero que
 * ve alguien que no sabe qué es Invicto— pero lo que hay que leer se lee.
 *
 * **Lo usan las dos.** Tenían un `Marco` cada una, idéntico, y el defecto
 * también era el mismo; arreglar solo el nuevo habría dejado al tutor de un
 * menor leyendo un mensaje privado sobre una foto.
 */
export function MarcoDeEnlace({ children }: { children: ReactNode }) {
  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "28px 16px 48px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          // El velo. Con `blur` detrás, para que la foto no se lea como una
          // mancha sucia sino como una textura.
          background: "rgb(8 8 8 / 0.86)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgb(255 255 255 / 0.08)",
          borderRadius: 16,
          padding: "28px 22px 32px",
        }}
      >
        {children}
      </div>
    </main>
  );
}
