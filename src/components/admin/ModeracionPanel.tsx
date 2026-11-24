"use client";

import { useState } from "react";
import AjustesDeModeracion from "./AjustesDeModeracion";
import BitacoraDeModeracion from "./BitacoraDeModeracion";
import PalabrasFiltradas from "./PalabrasFiltradas";
import PaginasLegales from "./PaginasLegales";
import PermisosDeRevisores from "./PermisosDeRevisores";
import { Filtro } from "./PiezasDeModeracion";
import { Permiso } from "./moderacion-tipos";

const SECCIONES: readonly { value: string; label: string; permiso: Permiso }[] = [
  { value: "ajustes", label: "Ajustes", permiso: "ajustes" },
  { value: "palabras", label: "Filtro de palabras", permiso: "ajustes" },
  { value: "paginas", label: "Páginas (borrador)", permiso: "ajustes" },
  { value: "permisos", label: "Permisos", permiso: "permisos" },
  { value: "bitacora", label: "Bitácora", permiso: "permisos" },
];

export default function ModeracionPanel({ permisos }: { permisos: readonly Permiso[] }) {
  const mias = SECCIONES.filter((s) => permisos.includes(s.permiso));
  const [seccion, setSeccion] = useState(mias[0]?.value ?? "");
  return (
    <div className="flex flex-col gap-5">
      <Filtro opciones={mias} valor={seccion} onCambiar={setSeccion} />
      {seccion === "ajustes" && <AjustesDeModeracion />}
      {seccion === "palabras" && <PalabrasFiltradas />}
      {seccion === "paginas" && <PaginasLegales />}
      {seccion === "permisos" && <PermisosDeRevisores />}
      {seccion === "bitacora" && <BitacoraDeModeracion />}
    </div>
  );
}
