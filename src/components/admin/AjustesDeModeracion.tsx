"use client";

import { useCallback, useEffect, useState } from "react";
import { llamarPanel } from "./panel-api";
import { Fallo, botonPrincipal, entrada } from "./PiezasDeModeracion";
import { useDialogo } from "./Dialogo";

interface Ajuste { key: string; value: string; description: string }

/**
 * Lo que se lee antes de tocar la versión. El 2026-11-26 se puso la 1.5.0 de
 * mínima antes de que estuviera en Play Store: quien tenía la 1.4.1 se habría
 * quedado por fuera, con un «Actualizar» que no lleva a ninguna versión nueva.
 */
const SOLO_SI_YA_ESTA: Record<string, string> = {
  "app.min_version.android": "Ponla solo cuando esa versión ya esté publicada para todos en Play Store. Si todavía no está, nadie con una versión anterior podrá entrar a la app.",
  "app.min_version.ios": "Ponla solo cuando esa versión ya esté publicada para todos en la App Store. Si todavía no está, nadie con una versión anterior podrá entrar a la app.",
  "app.recommended_version.android": "Ponla solo cuando esa versión ya esté en Play Store. Si no, el aviso manda a actualizar y no hay nada nuevo que bajar.",
  "app.recommended_version.ios": "Ponla solo cuando esa versión ya esté en la App Store. Si no, el aviso manda a actualizar y no hay nada nuevo que bajar.",
};

/** Lo que deja a gente por fuera o publica algo se pregunta dos veces. */
const DELICADOS: Record<string, string> = {
  ...SOLO_SI_YA_ESTA,
  "legal.child_safety": "Publica la página con el texto de borrador. Primero lo revisa Legal.",
  "legal.account_deletion": "Publica la página con el texto de borrador. Primero lo revisa Legal.",
  "signup.min_age": "Cambia quién puede crear su propia cuenta. Primero lo revisa Legal.",
  "contact.form": "Muestra el formulario en la portada. El texto de autorización todavía es un borrador.",
};

export default function AjustesDeModeracion() {
  const dialogo = useDialogo();
  const [items, setItems] = useState<Ajuste[] | null>(null);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(() =>
    llamarPanel<{ items: Ajuste[] }>("/admin/moderation/settings").then((r) => {
      setItems(r.data?.items ?? null);
      setValores({});
      if (!r.ok) setError(r.message ?? "No se pudieron cargar los ajustes.");
    }), []);

  useEffect(() => { void cargar(); }, [cargar]);

  const guardar = async (a: Ajuste) => {
    const value = (valores[a.key] ?? a.value).trim();
    if (DELICADOS[a.key] && !(await dialogo.confirmar({
      titulo: "¿Guardar este cambio?", cambio: { de: a.value || "vacío", a: value || "vacío" }, texto: `${DELICADOS[a.key]}\n\n${a.key}`, boton: "Guardar",
    }))) return;
    const r = await llamarPanel(`/admin/moderation/settings/${a.key}`, "PUT", { value });
    setError(r.ok ? null : (r.message ?? "No se pudo guardar."));
    if (r.ok) await cargar();
  };

  return (
    <div className="flex flex-col gap-3 max-w-3xl">
      {error && <Fallo>{error}</Fallo>}
      {!items && !error && <p className="text-xs text-on-surface-variant">Cargando…</p>}
      {items?.map((a) => (
        <div key={a.key} className="admin-card border border-[#222] rounded-xl p-4 flex flex-col gap-2">
          <p className="text-sm">{a.description}</p>
          {SOLO_SI_YA_ESTA[a.key] && (
            <p className="text-xs leading-relaxed text-[#F5B84B] border-l-2 border-[#F5B84B] pl-3">{SOLO_SI_YA_ESTA[a.key]}</p>
          )}
          <p className="text-[11px] text-on-surface-variant/60 font-mono">{a.key}</p>
          <div className="flex gap-2">
            <input
              className={entrada} maxLength={200} aria-label={a.key}
              value={valores[a.key] ?? a.value} onChange={(e) => setValores((v) => ({ ...v, [a.key]: e.target.value }))}
            />
            <button className={botonPrincipal} disabled={(valores[a.key] ?? a.value).trim() === a.value} onClick={() => guardar(a)}>Guardar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
