import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search, RefreshCw, LifeBuoy } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  apiAdminGetSupportRequests,
  type SupportRequest,
  type SupportRequestStatus,
} from "../adminApi";

export default function AdminSupportRequestsPage() {
  const [items, setItems] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<SupportRequestStatus | "all">("all");
  const [search, setSearch] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await apiAdminGetSupportRequests({
        status,
        search: search.trim() || undefined,
      });
      setItems(data);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors du chargement des demandes support");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      return (
        x.name?.toLowerCase().includes(q) ||
        x.email?.toLowerCase().includes(q) ||
        x.subject?.toLowerCase().includes(q)
      );
    });
  }, [items, search]);

  const statusBadge = (s: SupportRequestStatus) => {
    const base = "px-2 py-0.5 rounded-full text-[11px] font-medium border";
    if (s === "pending") return <span className={`${base} bg-amber-50 text-amber-800 border-amber-100`}>En attente</span>;
    if (s === "read") return <span className={`${base} bg-blue-50 text-blue-700 border-blue-100`}>Lu</span>;
    if (s === "replied") return <span className={`${base} bg-green-50 text-green-700 border-green-100`}>Répondu</span>;
    return <span className={`${base} bg-slate-50 text-slate-700 border-slate-200`}>Archivé</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LifeBuoy className="h-6 w-6 text-blue-600" />
            Support
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Demandes envoyées via la page Support (liste + détail + statut).
          </p>
        </div>

        <button
          onClick={load}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher (nom, email, sujet)"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full lg:w-64 rounded-md border-slate-200 bg-white shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Tous</option>
          <option value="pending">En attente</option>
          <option value="read">Lu</option>
          <option value="replied">Répondu</option>
          <option value="archived">Archivé</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-56">
            <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            Aucune demande support.
          </div>
        ) : (
          <div className="divide-y">
            {filtered.map((x) => (
              <Link
                to={`/admin/support/${x.id}`}
                key={x.id}
                className="block hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-4 px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900 truncate">{x.subject}</p>
                      {statusBadge(x.status)}
                    </div>
                    <p className="mt-1 text-xs text-slate-500 truncate">
                      {x.name} · {x.email}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(x.created_at).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 font-medium">Voir</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
