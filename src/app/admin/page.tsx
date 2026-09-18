import { apiFetch, getToken } from "@/lib/admin-api";
import LoginForm from "@/components/admin/LoginForm";
import AdminPanel from "@/components/admin/AdminPanel";

interface Me {
  id: number;
  username: string;
  name: string | null;
  profile_photo: string | null;
}

/**
 * La puerta del panel.
 *
 * El permiso se comprueba **en el servidor** en cada carga, no una vez al
 * entrar: una cookie vieja de alguien a quien se le retiró el acceso deja de
 * servir en la siguiente recarga, sin esperar a que caduque el token.
 */
export default async function AdminPage() {
  const token = await getToken();
  const me = token ? await apiFetch<Me>("/admin/me") : null;

  if (!me?.ok || !me.data) return <LoginForm expired={!!token} />;

  return <AdminPanel me={me.data} />;
}
