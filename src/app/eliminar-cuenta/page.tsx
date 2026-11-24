import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegalPageShell from "@/components/LegalPageShell";
import EliminarCuenta from "@/content/eliminar-cuenta";
import { leerPaginas } from "@/lib/paginas";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { account_deletion } = await leerPaginas();
  return {
    title: "Eliminar tu cuenta | INVICTO",
    description: "Cómo eliminar tu cuenta de INVICTO y tus datos, desde la app o sin ella.",
    robots: account_deletion ? undefined : { index: false, follow: false },
  };
}

/** Sin publicar no existe: el borrador se lee en el panel. */
export default async function Page() {
  const paginas = await leerPaginas();
  if (!paginas.account_deletion) notFound();
  return (
    <LegalPageShell title="Eliminar tu cuenta" lastUpdated="Noviembre de 2026">
      <EliminarCuenta {...paginas} />
    </LegalPageShell>
  );
}
