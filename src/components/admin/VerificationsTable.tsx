"use client";

import { useCallback, useEffect, useState } from "react";

interface VerificationDocument {
  id: number;
  url: string;
  document_type: string;
  original_name: string;
}

interface VerificationRequest {
  kind: "scout" | "club";
  id: number;
  user_id: number;
  username: string;
  display_name: string;
  status: string;
  note: string | null;
  requested_at: string | null;
  documents: VerificationDocument[];
}

const TABS = [
  { value: "review", label: "Pendientes" },
  { value: "approved", label: "Verificadas" },
  { value: "rejected", label: "Rechazadas" },
];

const DOC_LABEL: Record<string, string> = {
  identity: "Documento de identidad",
  license: "Licencia o certificación",
  sports_credential: "Credencial deportiva",
  other: "Otro documento",
};

/**
 * La misma bandeja que hay en la app, pero aquí los documentos se abren en una
 * pestaña a tamaño completo — que es como se mira de verdad una cédula.
 */
export default function VerificationsTable() {
  const [tab, setTab] = useState("review");
  const [rows, setRows] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/verification/requests?status=${tab}&limit=50`)
      .then((r) => r.json())
      .then((body) => setRows(body.data?.items ?? []))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const decide = async (req: VerificationRequest, approved: boolean) => {
    let note: string | null = null;
    if (!approved) {
      // El motivo es obligatorio: quien lo recibe tiene que saber qué corregir.
      note = prompt(`¿Qué falta en la verificación de ${req.display_name}?`);
      if (!note?.trim()) return;
    } else if (!confirm(`Verificar a ${req.display_name}?\n\nLlevará la insignia y podrá escribirle a jugadores menores de edad.`)) {
      return;
    }

    const key = `${req.kind}-${req.id}`;
    setBusy(key);
    await fetch(`/api/admin/verification/requests/${req.kind}/${req.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved, note: note ?? undefined }),
    }).catch(() => null);
    setBusy(null);
    load();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-2 rounded-lg text-xs transition-colors ${
              tab === t.value ? "bg-neon text-background" : "bg-[#1A1A1A] text-on-surface-variant"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-xs text-on-surface-variant">Cargando…</p>}

      {!loading && rows.length === 0 && (
        <div className="border border-[#222] rounded-xl px-4 py-12 text-center text-on-surface-variant text-sm">
          {tab === "review" ? "No hay nada esperando revisión." : "Nada por aquí."}
        </div>
      )}

      <div className="grid gap-3">
        {rows.map((req) => {
          const key = `${req.kind}-${req.id}`;
          return (
            <div key={key} className="bg-[#141414] border border-[#222] rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-headline font-black italic text-lg leading-tight">
                    {req.display_name || req.username}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    @{req.username} · {req.kind === "club" ? "Club" : "Ojeador"}
                  </p>
                </div>
                {req.requested_at && (
                  <p className="text-xs text-on-surface-variant whitespace-nowrap">
                    {new Date(req.requested_at).toLocaleDateString("es-CO")}
                  </p>
                )}
              </div>

              {req.documents.length === 0 ? (
                <p className="text-xs text-on-surface-variant mb-3">Sin documentos.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {req.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#242424] transition-colors"
                    >
                      {DOC_LABEL[doc.document_type] ?? doc.document_type} ↗
                    </a>
                  ))}
                </div>
              )}

              {req.note && <p className="text-xs text-on-surface-variant italic mb-3">«{req.note}»</p>}

              {req.status === "review" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => decide(req, false)}
                    disabled={busy === key}
                    className="text-xs px-4 py-2 rounded-lg border border-[#FF5A5A] text-[#FF5A5A] disabled:opacity-40"
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => decide(req, true)}
                    disabled={busy === key}
                    className="text-xs px-4 py-2 rounded-lg bg-neon text-background font-medium disabled:opacity-40"
                  >
                    {busy === key ? "…" : "Verificar"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
