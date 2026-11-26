const PACKAGE_NAME = "com.invicto.app";

/**
 * Verificacion de dominio para Android App Links.
 *
 * Sin este fichero el sistema NO abre la app: el enlace cae siempre en el navegador.
 *
 * ANDROID_CERT_SHA256 admite varias huellas separadas por coma, y normalmente hacen
 * falta DOS: la del certificado de subida y la de Play App Signing (Google refirma
 * la app al publicarla). Si falta una, los App Links no verifican en las
 * instalaciones que vienen de la tienda.
 *
 *   Subida:  eas credentials  (Android → keystore → SHA-256)
 *   Play:    Play Console → Integridad de la app → Firma de apps
 */
export function GET() {
  const fingerprints = (process.env.ANDROID_CERT_SHA256 ?? "")
    .split(",")
    .map((f) => f.trim().toUpperCase())
    .filter(Boolean);

  if (fingerprints.length === 0) {
    return Response.json(
      { error: "ANDROID_CERT_SHA256 no configurado" },
      { status: 404 },
    );
  }

  return Response.json(
    [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: PACKAGE_NAME,
          sha256_cert_fingerprints: fingerprints,
        },
      },
    ],
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
