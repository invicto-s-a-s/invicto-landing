import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  authorDisplayName,
  coverImage,
  getPost,
  type PublicPost,
} from "@/lib/invicto-api";
import Publicacion from "./Publicacion";

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
  const date = new Date(post.createdAt).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 px-4 py-6">
      <Publicacion post={post} autor={author} fecha={date} />
    </main>
  );
}
