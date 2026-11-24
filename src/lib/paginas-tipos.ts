/** Lo que el panel publica: `GET /public/pages`. */
export interface Paginas {
  child_safety: boolean;
  account_deletion: boolean;
  contact_form: boolean;
  emails: { privacy: string | null; support: string | null; safety: string | null };
  safety_contact: string | null;
}

export const NADA_PUBLICADO: Paginas = {
  child_safety: false,
  account_deletion: false,
  contact_form: false,
  emails: { privacy: null, support: null, safety: null },
  safety_contact: null,
};
