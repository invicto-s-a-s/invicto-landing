"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AUTORIZACIONES } from "@/content/autorizacion-de-datos";

const QUIENES = [
  { value: "escuela", label: "Escuela de fútbol" },
  { value: "club", label: "Club" },
  { value: "ojeador", label: "Ojeador" },
  { value: "jugador", label: "Jugador o familia" },
  { value: "otro", label: "Otro" },
];

const campo = "w-full bg-background/80 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-neon/60";

type Estado = "llenando" | "enviando" | "enviado";

/**
 * «Escríbenos». No existe hasta que el panel lo enciende (`contact.form`): sin
 * él, la portada queda igual que siempre.
 */
export default function ContactForm() {
  const [abierto, setAbierto] = useState<{ version: string; token: string } | null>(null);
  const [estado, setEstado] = useState<Estado>("llenando");
  const [error, setError] = useState<string | null>(null);
  const [acepta, setAcepta] = useState(false);

  useEffect(() => {
    fetch("/api/contacto")
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => { if (c?.data?.token && AUTORIZACIONES[c.data.version]) setAbierto(c.data); })
      .catch(() => undefined);
  }, []);

  if (!abierto) return null;

  const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estado === "enviando") return;
    if (!acepta) { setError("Para escribirnos tienes que autorizar el uso de tus datos."); return; }
    const f = new FormData(e.currentTarget);
    const texto = (k: string) => String(f.get(k) ?? "").trim();
    setEstado("enviando");
    setError(null);
    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: texto("name"), email: texto("email"), phone: texto("phone"), kind: texto("kind"), organization: texto("organization"),
        city: texto("city"), message: texto("message"), website: texto("website"),
        consent: acepta, consent_version: abierto.version, token: abierto.token,
      }),
    }).catch(() => null);
    const cuerpo = await res?.json().catch(() => null);
    if (res?.ok) { setEstado("enviado"); return; }
    setEstado("llenando");
    setError(cuerpo?.message ?? "No pudimos enviar tu mensaje ahora. Inténtalo más tarde.");
  };

  return (
    <section id="escribenos" className="py-24 relative z-10" style={{ background: "rgb(13 13 13 / 0.75)" }}>
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="font-headline font-black italic uppercase text-on-background text-3xl md:text-4xl mb-3">Escríbenos</h2>
        <p className="text-on-background/60 text-sm mb-8">¿Quieres llevar INVICTO a tu escuela o a tu club? Cuéntanos y te respondemos.</p>

        {estado === "enviado" ? (
          <p className="border border-neon/30 rounded-xl px-5 py-8 text-center text-sm">Recibimos tu mensaje. Te responderemos por correo.</p>
        ) : (
          <form onSubmit={enviar} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="name" required maxLength={120} placeholder="Tu nombre" aria-label="Tu nombre" autoComplete="name" className={campo} />
              <input name="email" type="email" required maxLength={160} placeholder="Tu correo" aria-label="Tu correo" autoComplete="email" className={campo} />
              <input name="phone" maxLength={30} placeholder="Teléfono (opcional)" aria-label="Teléfono (opcional)" autoComplete="tel" className={campo} />
              <select name="kind" required defaultValue="" aria-label="¿Quién eres?" className={campo}>
                <option value="" disabled>¿Quién eres?</option>
                {QUIENES.map((q) => <option key={q.value} value={q.value}>{q.label}</option>)}
              </select>
              <input name="organization" maxLength={120} placeholder="Escuela o club (opcional)" aria-label="Escuela o club (opcional)" className={campo} />
              <input name="city" maxLength={80} placeholder="Ciudad (opcional)" aria-label="Ciudad (opcional)" className={campo} />
            </div>
            <textarea name="message" required maxLength={2000} rows={5} placeholder="¿En qué te ayudamos?" aria-label="¿En qué te ayudamos?" className={campo} />
            {/* El campo trampa: fuera de la vista y del teclado. Una persona no lo llena. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
              <label>No llenes este campo<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <label className="flex items-start gap-3 text-xs text-on-background/60 leading-relaxed cursor-pointer">
              <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} className="mt-0.5 accent-[#AAFF00]" />
              <span>
                {AUTORIZACIONES[abierto.version]}{" "}
                <Link href="/politica-de-privacidad" className="underline">Ver la política</Link>
              </span>
            </label>
            {error && <p role="alert" className="text-sm text-[#FF5A5A]">{error}</p>}
            <button
              type="submit"
              disabled={estado === "enviando"}
              className="bg-neon text-background font-headline font-black italic px-8 py-3 disabled:opacity-40 justify-self-start"
            >
              {estado === "enviando" ? "ENVIANDO…" : "ENVIAR"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
