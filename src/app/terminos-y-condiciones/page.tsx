import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import {
  TERMS_BLOCKS,
  TERMS_LEAD,
  TERMS_UPDATED,
  TERMS_VERSION,
  type TermsBlock,
} from "@/content/terminos";

export const metadata: Metadata = {
  title: "Términos y Condiciones | INVICTO",
  description:
    "Términos y Condiciones de uso de INVICTO, la plataforma de social scouting que conecta el talento deportivo con oportunidades reales.",
};

/**
 * Los Términos y Condiciones completos.
 *
 * **El texto no se escribe aquí**: vive en `@/content/terminos`, generado desde
 * el .docx que redactó el abogado. Esta página solo lo maqueta. La Cláusula 1.4
 * obliga a que el documento esté disponible «de forma previa, gratuita,
 * permanente y descargable» desde el sitio web, así que sale completo —las 95
 * cláusulas y los tres anexos—, sin resumir y sin paginar.
 */
export default function TermsPage() {
  return (
    <LegalPageShell title="Términos y Condiciones" lastUpdated={TERMS_UPDATED}>
      <div className="callout">
        <p>
          <strong>{TERMS_LEAD}</strong>
        </p>
      </div>
      <p>
        <strong>{TERMS_VERSION}</strong> &middot; Entrada en vigor: a partir de su publicación en la
        Plataforma.
      </p>

      {TERMS_BLOCKS.map((bloque, i) => (
        <Bloque key={i} bloque={bloque} />
      ))}
    </LegalPageShell>
  );
}

function Bloque({ bloque }: { bloque: TermsBlock }) {
  switch (bloque.kind) {
    case "titulo":
      return <h2>{bloque.text}</h2>;

    case "clausula":
      return <h3>{`Cláusula ${bloque.num}. ${bloque.text}`}</h3>;

    case "anexo":
      return <h2>{`Anexo ${bloque.num}. ${bloque.text}`}</h2>;

    case "sub":
      return <h3>{bloque.text}</h3>;

    case "p":
      return (
        <p>
          {bloque.num && <strong>{bloque.num} </strong>}
          {bloque.text}
        </p>
      );

    case "item":
      return (
        <p style={{ paddingLeft: "1.5rem" }}>
          <strong>{bloque.num} </strong>
          {bloque.text}
        </p>
      );

    case "def":
      return (
        <p style={{ paddingLeft: "1.5rem" }}>
          <strong>{bloque.term}: </strong>
          {bloque.text}
        </p>
      );

    // Las casillas del Anexo 2 son la transcripción de un anexo, no un
    // formulario: aquí nadie acepta nada. El cuadrado va como texto.
    case "check":
      return (
        <p style={{ paddingLeft: "1.5rem" }}>
          <span aria-hidden="true">☐ </span>
          {bloque.text}
        </p>
      );

    case "tabla":
      // El envoltorio con scroll propio es lo que impide que una tabla de
      // cuatro columnas ensanche la página entera en un teléfono.
      return (
        <div className="legal-table-wrap">
          <table>
            <thead>
              <tr>
                {bloque.head.map((celda, i) => (
                  <th key={i}>{celda}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bloque.rows.map((fila, i) => (
                <tr key={i}>
                  {fila.map((celda, j) => (
                    <td key={j}>{celda}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
