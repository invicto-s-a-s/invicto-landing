import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  authorDisplayName,
  coverImage,
  getPost,
  type PublicPost,
} from "@/lib/invicto-api";
import { OpenInApp } from "@/components/OpenInApp";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://invictoapp.com";

interface Props {
  params: Promise<{ id: string }>;
}

function shareDescription(post: PublicPost): string {
  const caption = post.caption?.trim();
  if (caption) return caption.slice(0, 180);
  return `${post.likes_count} me gusta · ${post.comments_count} comentarios en Invicto`;
}

/**
 * Esto es lo que lee el crawler de WhatsApp/Facebook. Se renderiza en el
 * servidor, por eso la tarjeta con miniatura aparece sin que el bot ejecute JS.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return { title: "Publicación no disponible · Invicto" };
  }

  const author = authorDisplayName(post.user);
  const title = author;
  const description = shareDescription(post);
  const image = coverImage(post);
  const url = `${SITE}/p/${post.id}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Invicto",
      title,
      description,
      url,
      images: image ? [{ url: image, width: 1080, height: 1080, alt: description }] : [],
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const author = authorDisplayName(post.user);
  const image = coverImage(post);
  const date = new Date(post.createdAt).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-8">
      <OpenInApp postId={post.id} />

      <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#201F20]">
        <header className="flex items-center gap-3 p-4">
          {post.user.profile_photo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={post.user.profile_photo}
              alt=""
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-white/10" />
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{author}</p>
            <p className="truncate text-sm text-white/50">@{post.user.username}</p>
          </div>
        </header>

        {image && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={image}
            alt={post.caption ?? `Publicación de ${author}`}
            className="aspect-square w-full bg-black object-cover"
          />
        )}

        <div className="flex flex-col gap-2 p-4">
          <div className="flex gap-4 text-sm text-white/70">
            <span>{post.likes_count} me gusta</span>
            <span>{post.comments_count} comentarios</span>
          </div>
          {post.caption && (
            <p className="whitespace-pre-wrap text-white">
              <span className="font-semibold">{post.user.username}</span> {post.caption}
            </p>
          )}
          <time className="text-xs text-white/40" dateTime={post.createdAt}>
            {date}
          </time>
        </div>
      </article>
    </main>
  );
}
