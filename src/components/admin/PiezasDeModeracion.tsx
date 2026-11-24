"use client";

export const boton = "text-xs px-4 py-2 rounded-lg border border-[#333] text-on-surface-variant hover:bg-[#161616] disabled:opacity-40";
export const botonPeligro = "text-xs px-4 py-2 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40";
export const botonPrincipal = "text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40";
export const entrada = "w-full bg-[#111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm outline-none focus:border-neon/60";

export function Filtro<T extends string>({ opciones, valor, onCambiar }: {
  opciones: readonly { value: T; label: string }[]; valor: T; onCambiar: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o.value}
          onClick={() => onCambiar(o.value)}
          className={`px-3 py-2 rounded-lg text-xs transition-colors ${valor === o.value ? "bg-neon text-background" : "bg-[#1A1A1A] text-on-surface-variant"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Vacio({ children }: { children: React.ReactNode }) {
  return <div className="border border-[#222] rounded-xl px-4 py-12 text-center text-on-surface-variant text-sm">{children}</div>;
}

export function Fallo({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="text-sm text-[#FF5A5A]">{children}</p>;
}
