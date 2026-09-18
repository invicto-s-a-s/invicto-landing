"use client";

import { useEffect, useState } from "react";

interface Detail {
  user: {
    id: number; username: string; name: string | null; last_name: string | null;
    email: string; role: string | null; profile_photo: string | null;
    verified: boolean; premium: boolean; is_reviewer: boolean; is_seed_data: boolean;
    city: string | null; country: string | null; sex: string | null;
    birth_date: string | null; phone: string | null; bio: string | null;
    followers_count: number; following_count: number; stars_count: number;
    posts_count: number; created_at: string;
  };
  perfil: Record<string, unknown> | null;
  actividad: Record<string, number>;
  ultimas_publicaciones: {
    id: number; caption: string | null; created_at: string;
    likes_count: number; comments_count: number;
  }[];
}

const ROLE_LABEL: Record<string, string> = {
  player: "Jugador", scout: "Ojeador", club: "Club",
};

const FIELD_LABEL: Record<string, string> = {
  id: "ID", height: "Estatura", weight: "Peso", dominant_foot: "Pie",
  posiciones: "Posiciones", evaluaciones: "Evaluaciones recibidas",
  is_independent: "Independiente", club_name: "Club", years_experience: "Años de exp.",
  has_license: "Licencia", verification_status: "Verificación", categorias: "Categorías",
  reportes: "Reportes", representative_name: "Representante",
  institution_type: "Tipo", open_tryouts: "Convocatorias abiertas",
  convocatorias: "Convocatorias",
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });

const pretty = (v: unknown) => {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "Sí" : "No";
  return String(v);
};

const nice = (k: string) => FIELD_LABEL[k] ?? k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/[0.035] rounded-lg px-3 py-2.5">
      <p className="text-[10px] font-mono tracking-[0.15em] uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="text-sm mt-1 break-words">{value}</p>
    </div>
  );
}

/**
 * La ficha de una cuenta, en un panel lateral y no en otra página.
 *
 * Quien revisa llega desde una lista y casi siempre vuelve a ella: una ruta
 * propia obligaría a rehacer la búsqueda y la paginación en cada vuelta. Aquí
 * la lista sigue detrás, tal y como estaba.
 *
 * Es **solo lectura**, como el resto del panel. Cuanto menos pueda hacer, menos
 * daño hace que se filtre una sesión.
 */
export default function UserDetail({ userId, onClose }: { userId: number; onClose: () => void }) {
  const [data, setData] = useState<Detail | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setData(null);
    setFailed(false);
    fetch(`/api/admin/admin/users/${userId}`)
      .then((r) => r.json())
      .then((body) => (body.data ? setData(body.data) : setFailed(true)))
      .catch(() => setFailed(true));
  }, [userId]);

  // Escape cierra: es un panel sobre otra cosa, y el gesto es el esperado.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const u = data?.user;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-lg admin-surface border-l border-[#1C1C1C] overflow-y-auto">
        <header className="sticky top-0 admin-surface flex items-start gap-3 px-5 py-4 border-b border-[#1C1C1C]">
          <div className="min-w-0 flex-1">
            <h2 className="font-headline font-black italic text-xl leading-tight truncate">
              {u ? [u.name, u.last_name].filter(Boolean).join(" ") || u.username : "Cargando…"}
            </h2>
            {u && (
              <p className="text-xs text-on-surface-variant truncate">
                @{u.username} · {ROLE_LABEL[u.role ?? ""] ?? u.role ?? "sin rol"} · alta {date(u.created_at)}
              </p>
            )}
          </div>
          <button onClick={onClose} className="text-on-surface-variant" aria-label="Cerrar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="p-5 flex flex-col gap-6">
          {failed && <p className="text-sm text-[#FF5A5A]">No se pudo cargar esta cuenta.</p>}

          {u && (
            <>
              <div className="flex flex-wrap gap-2">
                {u.verified && <Tag color="#AAFF00">Verificada</Tag>}
                {u.premium && <Tag color="#AF8CFF">Premium</Tag>}
                {u.is_reviewer && <Tag color="#3987e5">Revisor</Tag>}
                {u.is_seed_data && <Tag color="#8A8A8A">Demo</Tag>}
              </div>

              <section>
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-2">
                  Datos
                </h3>
                <div className="grid gap-2 grid-cols-2">
                  <Field label="Correo" value={u.email} />
                  <Field label="Teléfono" value={pretty(u.phone)} />
                  <Field label="Ubicación" value={[u.city, u.country].filter(Boolean).join(", ") || "—"} />
                  <Field label="Nacimiento" value={u.birth_date ? date(u.birth_date) : "—"} />
                  <Field label="Sexo" value={pretty(u.sex)} />
                  <Field label="Estrellas" value={String(u.stars_count)} />
                  <Field label="Seguidores" value={String(u.followers_count)} />
                  <Field label="Siguiendo" value={String(u.following_count)} />
                </div>
                {u.bio && <p className="text-sm text-on-surface-variant mt-3 italic">«{u.bio}»</p>}
              </section>

              {data.perfil && (
                <section>
                  <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-2">
                    Perfil de {ROLE_LABEL[u.role ?? ""]?.toLowerCase() ?? "rol"}
                  </h3>
                  <div className="grid gap-2 grid-cols-2">
                    {Object.entries(data.perfil).map(([k, v]) => (
                      <Field key={k} label={nice(k)} value={pretty(v)} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-2">
                  Actividad
                </h3>
                <div className="grid gap-2 grid-cols-2">
                  <Field label="Publicaciones" value={String(u.posts_count)} />
                  {Object.entries(data.actividad).map(([k, v]) => (
                    <Field key={k} label={nice(k)} value={String(v)} />
                  ))}
                </div>
              </section>

              <section>
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-on-surface-variant mb-2">
                  Últimas publicaciones
                </h3>
                {data.ultimas_publicaciones.length === 0 ? (
                  <p className="text-xs text-on-surface-variant">No ha publicado nada.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {data.ultimas_publicaciones.map((p) => (
                      <li key={p.id} className="bg-white/[0.035] rounded-lg px-3 py-2.5">
                        <p className="text-sm">{p.caption || <span className="text-on-surface-variant">Sin descripción</span>}</p>
                        <p className="text-[11px] text-on-surface-variant mt-1">
                          {date(p.created_at)} · {p.likes_count} likes · {p.comments_count} comentarios
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded"
      style={{ color, backgroundColor: `${color}1A` }}
    >
      {children}
    </span>
  );
}
