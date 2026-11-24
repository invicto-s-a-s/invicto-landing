"use client";

import { useState } from "react";
import { Casillas } from "./Casillas";
import { fechaLarga, marcadosDe, type Marcados, type Permiso } from "./tipos-de-permiso";

/**
 * Cambiar los permisos después de haber respondido, desde el mismo enlace.
 * Se guarda al tocar el botón y no al marcar: una casilla tocada sin querer en
 * un teléfono no puede autorizar nada.
 */
export default function MisPermisos({ token, inicial }: { token: string; inicial: Permiso[] }) {
  const [permisos, setPermisos] = useState(inicial);
  const [marcados, setMarcados] = useState<Marcados>(() => marcadosDe(inicial));
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<{ bien: boolean; texto: string } | null>(null);

  const cambios = permisos.filter((p) => (marcados[p.tipo] === true) !== p.autorizado);

  const guardar = async () => {
    setGuardando(true);
    setAviso(null);
    try {
      const res = await fetch(`/api/acudiente/${encodeURIComponent(token)}/permisos`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(cambios.map((p) => [p.tipo, marcados[p.tipo] === true]))),
      });
      const cuerpo = await res.json().catch(() => null);
      if (!res.ok) throw new Error(cuerpo?.message ?? "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
      const nuevos: Permiso[] = cuerpo?.data?.permisos ?? [];
      setPermisos(nuevos);
      setMarcados(marcadosDe(nuevos));
      setAviso({ bien: true, texto: "Guardamos tu respuesta. Tiene efecto desde este momento." });
    } catch (e) {
      setAviso({ bien: false, texto: e instanceof Error ? e.message : "No pudimos guardar tu respuesta. Inténtalo nuevamente." });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 19, margin: "0 0 14px", color: "#F0F0F0" }}>Qué permites</h2>
      <Casillas
        permisos={permisos}
        marcados={marcados}
        ocupado={guardando}
        onCambiar={(tipo, si) => { setAviso(null); setMarcados((m) => ({ ...m, [tipo]: si })); }}
      />
      {permisos.filter((p) => p.autorizado && p.desde).map((p) => (
        <p key={p.tipo} style={{ fontSize: 13, color: "#999999", margin: "0 0 10px" }}>
          Autorizado el {fechaLarga(p.desde!)} (versión {p.version}).
        </p>
      ))}
      <button
        onClick={guardar}
        disabled={guardando || cambios.length === 0}
        style={{
          width: "100%", padding: "14px 22px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, fontFamily: "inherit",
          background: cambios.length > 0 ? "#AAFF00" : "#2A2A2A", color: cambios.length > 0 ? "#0D0D0D" : "#999999",
          cursor: cambios.length > 0 ? "pointer" : "default",
        }}
      >
        {guardando ? "Guardando…" : "Guardar mis permisos"}
      </button>
      <p role="status" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 12, color: aviso?.bien === false ? "#FF6B6B" : "#AAFF00" }}>{aviso?.texto}</p>
    </section>
  );
}
