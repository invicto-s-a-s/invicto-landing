import type { Metadata } from "next";
import { Chakra_Petch, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const chakraPetch = Chakra_Petch({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-chakra-petch",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Sin `metadataBase` Next genera las URL de las tarjetas de compartir como
  // rutas relativas, y ni Google ni WhatsApp saben resolverlas.
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Invicto · Donde el talento del fútbol se hace visible",
    // Las páginas internas ponen lo suyo y la marca se añade sola.
    template: "%s · Invicto",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "scouting de futbol",
    "app para futbolistas",
    "ojeadores de futbol",
    "pruebas de futbol",
    "convocatorias de futbol",
    "reclutamiento deportivo",
    "futbol Colombia",
  ],
  authors: [{ name: "Invicto" }],
  creator: "Invicto",
  alternates: {
    // La canónica evita que invictoapp.com, www.invictoapp.com y la URL de
    // Vercel se traten como tres páginas distintas con el mismo contenido.
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Invicto · Donde el talento del fútbol se hace visible",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-invicto.jpg",
        width: 1200,
        height: 630,
        alt: "La app de Invicto en un teléfono",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invicto · Donde el talento del fútbol se hace visible",
    description: SITE_DESCRIPTION,
    images: ["/og-invicto.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sin esto Google recorta el texto y la vista previa del vídeo por su
      // cuenta; así se le deja usar todo lo que tenga.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // Se rellena con la variable de Vercel al verificar el dominio en Search
  // Console; sin ella, Next simplemente no imprime la etiqueta.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/isotipo-invicto2.png",
  },
};

/**
 * Datos estructurados: quiénes somos y qué es esto, en el formato que Google
 * lee sin tener que adivinarlo del texto de la página. Es lo que habilita el
 * panel de marca en los resultados.
 */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      description: SITE_DESCRIPTION,
      sameAs: [
        "https://www.instagram.com/invictoapp",
        "https://www.facebook.com/share/1D96FHkkMi/",
        "https://www.tiktok.com/@invicto.app",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-CO",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "MobileApplication",
      name: SITE_NAME,
      applicationCategory: "SportsApplication",
      operatingSystem: "Android, iOS",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: { "@type": "Offer", price: "0", priceCurrency: "COP" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`dark ${chakraPetch.variable} ${hankenGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="text-on-background font-body overflow-x-hidden bg-transparent" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
