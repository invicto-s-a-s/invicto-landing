import type { NextConfig } from "next";

/**
 * Cabeceras de seguridad para todo lo que sirve la web y el panel
 * (auditoría 2026-11-26). Nadie puede meter estas páginas dentro de otra
 * (`frame-ancestors`): un panel enmarcado sirve para engañar al revisor y que
 * haga clic donde no ve. No es una CSP completa a propósito: una que bloquee
 * scripts necesita probar cada página, y una mal puesta deja el panel en
 * blanco.
 */
const SEGURIDAD = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SEGURIDAD }];
  },
};

export default nextConfig;
