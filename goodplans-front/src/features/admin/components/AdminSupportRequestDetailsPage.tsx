import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  apiAdminDeleteSupportRequest,
  apiAdminGetSupportRequest,
  apiAdminUpdateSupportRequest,
  type SupportRequest,
  type SupportRequestStatus,
} from "../adminApi";

export default function AdminSupportRequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<SupportRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [status, setStatus] = useState<SupportRequestStatus>("pending");
  const [notes, setNotes] = useState<string>("");

  async function load() {
    if (!id) return;
    try {
      setLoading(true);
      const data = await apiAdminGetSupportRequest(id);
      setItem(data);
      setStatus(data.status);
      setNotes(data.admin_notes || "");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Impossible de charger la demande");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave() {
    if (!id) return;
    try {
      setSaving(true);
      const updated = await apiAdminUpdateSupportRequest(id, {
        status,
        admin_notes: notes.trim() || null,
      });
      setItem(updated);
      toast.success("Demande mise à jour");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!id) return;
    const ok = window.confirm("Supprimer définitivement cette demande ?");
    if (!ok) return;

    try {
      setDeleting(true);
      await apiAdminDeleteSupportRequest(id);
      toast.success("Demande supprimée");
      navigate("/admin/support");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="p-6 bg-white rounded-lg border border-slate-200">
        <p className="text-slate-600">Demande introuvable.</p>
        <button
          onClick={() => navigate("/admin/support")}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate("/admin/support")}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-red-50 hover:bg-red-100 text-red-700 text-sm disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Suppression..." : "Supprimer"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <h1 className="text-xl font-semibold text-slate-900">{item.subject}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {item.name} · {item.email} ·{" "}
          {new Date(item.created_at).toLocaleString("fr-FR")}
        </p>

        <div className="mt-5">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Message
          </label>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
            {item.message}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as SupportRequestStatus)}
              className="w-full rounded-md border-slate-200 bg-white shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="pending">En attente</option>
              <option value="read">Lu</option>
              <option value="replied">Répondu</option>
              <option value="archived">Archivé</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes admin
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajoute une note interne..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

