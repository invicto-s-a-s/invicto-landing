const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.invictoapp.com";

interface HttpResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface PostMedia {
  id: number;
  url: string;
  type: "photo" | "image" | "video";
  order: number;
  thumbnail_url: string | null;
}

/**
 * Solo los campos publicables. El endpoint devuelve tambien email, phone y
 * birth_date: NO se mapean aqui a proposito para que no acaben en el HTML.
 * TODO backend: dejar de exponer PII en el serializador publico de /posts/:id
 */
export interface PublicAuthor {
  id: number;
  username: string;
  name: string | null;
  last_name: string | null;
  profile_photo: string | null;
  verified: boolean;
  followers_count: number;
}

export interface PublicPost {
  id: number;
  caption: string | null;
  createdAt: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  media: PostMedia[];
  user: PublicAuthor;
}

interface RawPost extends Omit<PublicPost, "user"> {
  user: PublicAuthor & Record<string, unknown>;
}

export function authorDisplayName(user: PublicAuthor): string {
  const full = [user.name, user.last_name]
    .filter((p): p is string => !!p && p.trim().length > 0)
    .join(" ")
    .trim();
  return full || user.username;
}

export function coverImage(post: PublicPost): string | null {
  const first = [...post.media].sort((a, b) => a.order - b.order)[0];
  if (!first) return null;
  return first.type === "video" ? first.thumbnail_url : first.url;
}

export async function getPost(id: string): Promise<PublicPost | null> {
  if (!/^\d+$/.test(id)) return null;

  try {
    const res = await fetch(`${API_URL}/posts/${id}`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;

    const body = (await res.json()) as HttpResponse<RawPost>;
    const raw = body?.data;
    if (!raw?.id) return null;

    // Los posts privados no se sirven en web aunque conozcas la URL
    if (raw.visibility && raw.visibility !== "public") return null;

    const u = raw.user;
    return {
      id: raw.id,
      caption: raw.caption ?? null,
      createdAt: raw.createdAt,
      visibility: raw.visibility,
      likes_count: raw.likes_count ?? 0,
      comments_count: raw.comments_count ?? 0,
      media: Array.isArray(raw.media) ? raw.media : [],
      user: {
        id: u.id,
        username: u.username,
        name: u.name ?? null,
        last_name: u.last_name ?? null,
        profile_photo: u.profile_photo ?? null,
        verified: !!u.verified,
        followers_count: u.followers_count ?? 0,
      },
    };
  } catch {
    return null;
  }
}
