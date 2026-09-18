import { NextRequest, NextResponse } from "next/server";

/**
 * El panel vive en su propio origen: `admin.invictoapp.com`.
 *
 * Lo que se gana con esto no es el hosting —sigue siendo el mismo proyecto de
 * Vercel y el mismo despliegue— sino el **origen del navegador**. En cuanto la
 * landing lleve Google Analytics o el pixel de Meta, esos scripts corren en
 * `invictoapp.com` y no pueden tocar nada de `admin.invictoapp.com`: ni la
 * cookie de sesión, ni el DOM, ni las peticiones al proxy. Dos hostnames son
 * dos cajas separadas aunque los sirva el mismo servidor.
 *
 * La cookie se queda encerrada sola: el login la pone sin `domain`, así que es
 * de ese host y nada más. No viaja al dominio principal.
 */

/** Dominios donde SÍ se aplica la separación. En vistas previas y en local no. */
const PRODUCTION_HOSTS = ["invictoapp.com", "www.invictoapp.com"];

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "https://admin.invictoapp.com";

const isAdminHost = (host: string) => host.startsWith("admin.");

export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase().split(":")[0];
  const { pathname } = request.nextUrl;

  if (isAdminHost(host)) {
    // La raíz del subdominio ES el panel: entrar a admin.invictoapp.com no
    // debería enseñar la web de marketing.
    if (pathname === "/") {
      return rememberNotToIndex(NextResponse.rewrite(new URL("/admin", request.url)));
    }
    // Aquí solo vive el panel. Lo demás —secciones, legales, imágenes de la
    // landing— se sirve desde el dominio principal y no tiene por qué existir
    // en dos sitios: duplicarlo confunde a Google y no aporta nada.
    if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
      return NextResponse.redirect(new URL(pathname, `https://${PRODUCTION_HOSTS[0]}`));
    }
    return rememberNotToIndex(NextResponse.next());
  }

  // En el dominio público el panel ya no se sirve: se manda a su sitio. Solo en
  // producción — en local y en las vistas previas conviene poder abrir /admin
  // sin montar un subdominio.
  if (PRODUCTION_HOSTS.includes(host) && pathname.startsWith("/admin")) {
    // A la raíz del subdominio y no a `/admin` dentro de él: el panel es una
    // sola pantalla con pestañas, y tener dos URL para lo mismo solo da lugar
    // a marcadores que no coinciden.
    return NextResponse.redirect(new URL("/", ADMIN_URL));
  }

  return NextResponse.next();
}

/**
 * Cabecera de no indexar para TODO lo que sirva el subdominio, no solo para las
 * páginas: las etiquetas `<meta>` no cubren el robots.txt ni un PDF.
 */
function rememberNotToIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  // Se salta los estáticos de Next y el favicon: no hay nada que decidir ahí y
  // pasar por el middleware en cada uno cuesta tiempo en cada carga.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
