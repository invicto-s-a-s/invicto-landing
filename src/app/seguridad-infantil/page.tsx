import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageShell from "@/components/LegalPageShell";
import SeguridadInfantil from "@/content/seguridad-infantil";
import { leerPaginas } from "@/lib/paginas";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { child_safety } = await leerPaginas();
  return {
    title: "Seguridad infantil | INVICTO",
    description: "Cómo INVICTO protege a niños, niñas y adolescentes, y cómo reportar una conducta que los ponga en riesgo.",
    robots: child_safety ? undefined : { index: false, follow: false },
  };
}

/** Sin publicar no existe: el borrador se lee en el panel. */
export default async function Page() {
  const paginas = await leerPaginas();
  if (!paginas.child_safety) notFound();
  return (
    <LegalPageShell title="Seguridad infantil" lastUpdated="Noviembre de 2026">
      <SeguridadInfantil {...paginas} />
    </LegalPageShell>
  );
}
