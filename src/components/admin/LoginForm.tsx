"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm({ expired = false }: { expired?: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    expired ? "Tu sesión caducó o se retiró el acceso. Entra otra vez." : null,
  );
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await res.json().catch(() => ({}));

    setLoading(false);
    if (!res.ok) {
      setError(body.message ?? "No se pudo entrar");
      return;
    }
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-on-surface-variant mb-2">
          Equipo Invicto
        </p>
        <h1 className="font-headline font-black italic text-3xl mb-1">PANEL</h1>
        <p className="text-sm text-on-surface-variant mb-8">
          Entra con tu cuenta de Invicto. Solo pasan las cuentas con permiso de revisor.
        </p>

        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-2">
          Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
          required
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-4 py-3 mb-5 text-sm outline-none focus:border-neon transition-colors"
        />

        <label className="block font-mono text-[10px] tracking-[0.2em] uppercase text-on-surface-variant mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          className="w-full bg-[#141414] border border-[#2A2A2A] rounded-lg px-4 py-3 mb-6 text-sm outline-none focus:border-neon transition-colors"
        />

        {error && <p className="text-[#FF5A5A] text-sm mb-5">{error}</p>}

        <button
          type="submit"
          disabled={loading || !email || !password}
          className="w-full bg-neon text-background font-headline font-black italic py-3 rounded-lg disabled:bg-[#2A2A2A] disabled:text-on-surface-variant transition-colors"
        >
          {loading ? "ENTRANDO…" : "INGRESAR"}
        </button>
      </form>
    </div>
  );
}
