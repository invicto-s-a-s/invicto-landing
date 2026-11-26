const BUNDLE_ID = "com.invicto.app";

/**
 * Verificacion de dominio para iOS Universal Links.
 *
 * Requisitos de Apple que suelen romperlo:
 *  - HTTPS sin redirecciones (301/302 lo invalidan)
 *  - Content-Type: application/json
 *  - Sin extension .json en la ruta
 *
 * APPLE_TEAM_ID sale de developer.apple.com → Membership (10 caracteres).
 */
export function GET() {
  const teamId = process.env.APPLE_TEAM_ID?.trim();

  if (!teamId) {
    return Response.json({ error: "APPLE_TEAM_ID no configurado" }, { status: 404 });
  }

  return Response.json(
    {
      applinks: {
        details: [
          {
            appIDs: [`${teamId}.${BUNDLE_ID}`],
            components: [
              { "/": "/p/*", comment: "Publicaciones" },
              { "/": "/u/*", comment: "Perfiles" },
            ],
          },
        ],
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
