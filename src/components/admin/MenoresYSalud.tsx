"use client";

import { useState } from "react";
import ConflictosDeAcudiente from "./ConflictosDeAcudiente";
import DerechoDeAcceso from "./DerechoDeAcceso";
import ParametrosDeMenores from "./ParametrosDeMenores";
import SolicitudesDeFecha from "./SolicitudesDeFecha";

const VISTAS = [
  { value: "fechas", label: "Fechas por corregir" },
  { value: "acudientes", label: "Acudientes por revisar" },
  { value: "acceso", label: "Derecho de acceso" },
  { value: "reglas", label: "Reglas" },
] as const;

/** Menores, familias y salud: lo que el equipo revisa y las reglas que puede cambiar (D2). */
export default function MenoresYSalud() {
  const [vista, setVista] = useState<(typeof VISTAS)[number]["value"]>("fechas");
  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap gap-2 mb-5">
        {VISTAS.map((v) => (
          <button
            key={v.value}
            onClick={() => setVista(v.value)}
            className={`text-xs px-3 py-1.5 rounded-lg ${vista === v.value ? "bg-neon text-background font-medium" : "bg-[#1A1A1A] text-on-surface-variant"}`}
          >
            {v.label}
          </button>
        ))}
      </div>
      {vista === "fechas" && <SolicitudesDeFecha />}
      {vista === "acudientes" && <ConflictosDeAcudiente />}
      {vista === "acceso" && <DerechoDeAcceso />}
      {vista === "reglas" && <ParametrosDeMenores />}
    </div>
  );
}
