import type { Metadata } from "next";

export const metadata: Metadata = {
  // `absolute` salta la plantilla del layout raíz, que si no dejaba el título
  // en "Panel · Invicto · Invicto".
  title: { absolute: "Panel · Invicto" },
  // Fuera de los buscadores: es una herramienta interna colgada de una web
  // pública, y no tiene por qué aparecer cuando alguien busca "Invicto".
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Sin fondo propio: así se ve el `body::before` de la landing, que es el
    // mismo fondo de marca. La legibilidad la ponen las superficies de cada
    // tarjeta, no un panel opaco por encima.
    <div className="min-h-screen text-on-background">
      <div className="grain-overlay" />
      {children}
    </div>
  );
}
