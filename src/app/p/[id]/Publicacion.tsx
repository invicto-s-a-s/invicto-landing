"use client";

import { useState } from "react";
import { irALaTienda } from "@/lib/abrir-la-app";
import type { PublicPost } from "@/lib/invicto-api";
import InvitarALaApp from "./InvitarALaApp";
import MediaDeLaPublicacion from "./MediaDeLaPublicacion";

const conPlural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/**
 * La publicación compartida, para quien no tiene la app. Se ve completa, como
 * en la app; lo que solo se hace con una cuenta (me gusta, comentar, ver el
 * perfil) abre la invitación a descargarla. Orlando, 2026-11-26: «como cuando te
 * mandan algo al Facebook y tú no tienes Facebook».
 */
export default function Publicacion({ post, autor, fecha }: { post: PublicPost; autor: string; fecha: string }) {
  const [invitar, setInvitar] = useState(false);
  const abrir = () => setInvitar(true);

  return (
    <>
      <header className="flex items-center justify-between gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="INVICTO" className="h-6 object-contain brightness-0 invert" />
        <button type="button" onClick={irALaTienda} className="rounded-lg bg-[#C4F750] px-4 py-2 text-sm font-bold text-[#1D1B20]">
          Descargar
        </button>
      </header>

      <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#161616]">
        <button type="button" onClick={abrir} className="flex w-full items-center gap-3 p-4 text-left">
          {post.user.profile_photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={post.user.profile_photo} alt="" className="h-11 w-11 rounded-full object-cover" />
          ) : (
            <div className="h-11 w-11 rounded-full bg-white/10" />
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{autor}</p>
            <p className="truncate text-sm text-white/50">@{post.user.username}</p>
          </div>
        </button>

        <MediaDeLaPublicacion media={post.media} alt={post.caption ?? `Publicación de ${autor}`} />

        <div className="flex items-center gap-5 px-4 pt-3 text-white">
          <button type="button" onClick={abrir} aria-label="Me gusta" className="flex items-center gap-1.5 text-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.5 1.2 4.3 2.4.8-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" />
            </svg>
            {post.likes_count}
          </button>
          <button type="button" onClick={abrir} aria-label="Comentar" className="flex items-center gap-1.5 text-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.1A8.5 8.5 0 1 1 21 12z" />
            </svg>
            {post.comments_count}
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {post.caption && (
            <p className="whitespace-pre-wrap text-white">
              <span className="font-semibold">{post.user.username}</span> {post.caption}
            </p>
          )}
          {post.comments_count > 0 && (
            <button type="button" onClick={abrir} className="text-left text-sm text-white/50">
              Ver los {conPlural(post.comments_count, "comentario", "comentarios")}
            </button>
          )}
          <time className="text-xs text-white/40" dateTime={post.createdAt}>{fecha}</time>
        </div>
      </article>

      <section className="rounded-2xl border border-[#C4F750]/30 bg-[#C4F750]/10 p-5">
        <p className="font-headline text-lg font-black italic text-white">¿Quieres ver más de {autor}?</p>
        <p className="mt-1 text-sm leading-relaxed text-white/70">
          En INVICTO están sus jugadas, sus estadísticas y su perfil completo. La app es gratis.
        </p>
        <button type="button" onClick={abrir} className="mt-4 h-11 w-full rounded-xl bg-[#C4F750] text-sm font-bold text-[#1D1B20]">
          Ver su perfil en INVICTO
        </button>
      </section>

      {invitar && <InvitarALaApp autor={autor} postId={post.id} onCerrar={() => setInvitar(false)} />}
    </>
  );
}
