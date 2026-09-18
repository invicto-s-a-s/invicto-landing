import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel · Invicto",
  // Fuera de los buscadores: es una herramienta interna colgada de una web
  // pública, y no tiene por qué aparecer cuando alguien busca "Invicto".
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0D0D0D] text-on-background">{children}</div>;
}
