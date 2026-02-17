import { useEffect, useMemo, useState } from "react";
import { Download, FileText, Filter, RefreshCw } from "lucide-react";
import { CSVLink } from "react-csv";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../lib/language/LanguageContext";
import { apiRequest } from "../../lib/apiRequest";

// ==== Types qui matchent ton AdminStatsService ====

type AdminOverviewResponse = {
  filters: {
    from: string | null;
    to: string | null;
    category: string | null;
    status: string | null;
    sellerId: string | null;
    featured: boolean | null;
  };
  listings: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    suspended: number;
  };
  engagement: {
    totalViews: number;
    totalFavorites: number;
  };
};

type AdminTimelinePoint = {
  date: string; // "YYYY-MM-DD"
  count: number;
};

type AdminCategoryStats = {
  category: string | null;
  total: number;
  approved: number;
};

type AdminSellerStats = {
  sellerId: string;
  totalListings: number;
  profile: {
    user_id: string;
    username: string | null;
    email: string | null;
    account_type: string;
  } | null;
};

type Filters = {
  from: string;
  to: string;
  category: string;
  status: string;
  featuredOnly: boolean;
};

type Tab = "timeline" | "category" | "seller";

function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams();

  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (filters.featuredOnly) params.set("featured", "true");

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export default function AdminReportsPage() {
  const { t } = useLanguage();
  // Période par défaut : 30 derniers jours
  const [filters, setFilters] = useState<Filters>(() => {
    const now = new Date();
    const to = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const from = fromDate.toISOString().slice(0, 10);
    return {
      from,
      to,
      category: "",
      status: "",
      featuredOnly: false,
    };
  });

  const [overview, setOverview] = useState<AdminOverviewResponse | null>(null);
  const [timeline, setTimeline] = useState<AdminTimelinePoint[]>([]);
  const [byCategory, setByCategory] = useState<AdminCategoryStats[]>([]);
  const [bySeller, setBySeller] = useState<AdminSellerStats[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("timeline");

  const queryString = useMemo(() => buildQueryString(filters), [filters]);

  async function fetchReports() {
    try {
      setLoading(true);
      setError(null);

      const [overviewRes, timelineRes, categoryRes, sellerRes] =
        await Promise.all([
          apiRequest<AdminOverviewResponse>(
            "GET",
            `/admin/stats/overview${queryString}`
          ),
          apiRequest<AdminTimelinePoint[]>(
            "GET",
            `/admin/stats/timeline${queryString}`
          ),
          apiRequest<AdminCategoryStats[]>(
            "GET",
            `/admin/stats/by-category${queryString}`
          ),
          apiRequest<AdminSellerStats[]>(
            "GET",
            `/admin/stats/by-seller${queryString}`
          ),
        ]);

      setOverview(overviewRes);
      setTimeline(timelineRes);
      setByCategory(categoryRes);
      setBySeller(sellerRes);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message ||
          "Erreur lors du chargement des données de reporting."
      );
      toast.error("Impossible de charger les données de reporting");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  // ====== HANDLERS FILTRES ======

  function handleChangeFilter(
    patch: Partial<Filters> | ((prev: Filters) => Filters)
  ) {
    setFilters((prev) =>
      typeof patch === "function" ? patch(prev) : { ...prev, ...patch }
    );
  }

  function handleResetFilters() {
    const now = new Date();
    const to = now.toISOString().slice(0, 10);
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    const from = fromDate.toISOString().slice(0, 10);

    setFilters({
      from,
      to,
      category: "",
      status: "",
      featuredOnly: false,
    });
  }

  // ====== CSV EXPORT SELON ONGLET ACTIF ======

  const csvData = useMemo(() => {
    if (activeTab === "timeline") {
      return timeline.map((item) => ({
        Date: item.date,
        "Nombre d’annonces": item.count,
      }));
    }

    if (activeTab === "category") {
      return byCategory.map((item) => ({
        Catégorie: item.category ?? "Inconnue",
        "Total annonces": item.total,
        "Annonces approuvées": item.approved,
      }));
    }

    if (activeTab === "seller") {
      return bySeller.map((item) => ({
        "ID vendeur": item.sellerId,
        "Nom d’utilisateur":
          item.profile?.username || item.profile?.email || "Inconnu",
        Email: item.profile?.email || "",
        "Type de compte": item.profile?.account_type || "",
        "Total annonces": item.totalListings,
      }));
    }

    return [];
  }, [activeTab, timeline, byCategory, bySeller]);

  const csvFilename = useMemo(() => {
    const base = `admin-report-${activeTab}`;
    const today = new Date().toISOString().slice(0, 10);
    return `${base}-${today}.csv`;
  }, [activeTab]);

  // ====== RENDU ======

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <FileText className="h-5 w-5 text-blue-600" />
            Reporting & Statistiques
          </h1>
          <p className="text-sm text-slate-500">
            Suivi détaillé des annonces, par période, catégorie et vendeur.
          </p>
        </div>

        {/* Boutons à droite */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchReports}
            disabled={loading}
            className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`mr-1.5 h-3.5 w-3.5 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Actualiser
          </button>

          <CSVLink
            data={csvData}
            filename={csvFilename}
            className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Export CSV ({activeTab === "timeline"
              ? "timeline"
              : activeTab === "category"
              ? "catégories"
              : "vendeurs"}
            )
          </CSVLink>
        </div>
      </div>

      {/* Filtres */}
      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Filter className="h-3.5 w-3.5" />
          Filtres
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {/* From */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Date de début
            </label>
            <input
              type="date"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) =>
                handleChangeFilter({ from: e.target.value || "" })
              }
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* To */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Date de fin
            </label>
            <input
              type="date"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) =>
                handleChangeFilter({ to: e.target.value || "" })
              }
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Catégorie */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Catégorie
            </label>
            <select
              value={filters.category}
              onChange={(e) =>
                handleChangeFilter({ category: e.target.value })
              }
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Toutes</option>
              <option value="vehicle">Véhicules</option>
              <option value="real_estate">Immobilier</option>
              <option value="service">Services</option>
              <option value="craft">Artisanat</option>
            </select>
          </div>

          {/* Statut */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-slate-600">
              Statut
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                handleChangeFilter({ status: e.target.value })
              }
              className="rounded-md border border-slate-200 px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="pending">{t("admin.common.status.pending")}</option>
              <option value="Publié">Publié</option>
              <option value="Rejeté">Rejeté</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>

          {/* Featured + reset */}
          <div className="flex flex-col justify-between gap-2">
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
              <input
                type="checkbox"
                checked={filters.featuredOnly}
                onChange={(e) =>
                  handleChangeFilter({ featuredOnly: e.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Seulement mises en avant</span>
            </label>

            <button
              type="button"
              onClick={handleResetFilters}
              className="self-start text-xs text-slate-500 hover:text-slate-700"
            >
              Réinitialiser les filtres
            </button>
          </div>
        </div>
      </div>

      {/* Erreur globale */}
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* Cartes overview */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard
          label="Total annonces"
          value={overview?.listings.total ?? 0}
        />
        <StatCard
          label="Approuvées"
          value={overview?.listings.approved ?? 0}
          variant="success"
        />
        <StatCard
          label={t("admin.common.status.pending")}
          value={overview?.listings.pending ?? 0}
          variant="warning"
        />
        <StatCard
          label="Rejetées / suspendues"
          value={
            (overview?.listings.rejected ?? 0) +
            (overview?.listings.suspended ?? 0)
          }
          variant="danger"
        />
        <StatCard
          label="Vues totales"
          value={overview?.engagement.totalViews ?? 0}
          variant="soft"
        />
        <StatCard
          label="Favoris"
          value={overview?.engagement.totalFavorites ?? 0}
          variant="soft"
        />
      </div>

      {/* Onglets */}
      <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
        <div className="flex border-b border-slate-100">
          <TabButton
            active={activeTab === "timeline"}
            onClick={() => setActiveTab("timeline")}
          >
            Timeline (par jour)
          </TabButton>
          <TabButton
            active={activeTab === "category"}
            onClick={() => setActiveTab("category")}
          >
            Par catégorie
          </TabButton>
          <TabButton
            active={activeTab === "seller"}
            onClick={() => setActiveTab("seller")}
          >
            Par vendeur
          </TabButton>
        </div>

        <div className="p-4">
          {loading && (
            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
              Chargement des données…
            </div>
          )}

          {!loading && activeTab === "timeline" && (
            <TimelineTable data={timeline} />
          )}

          {!loading && activeTab === "category" && (
            <CategoryTable data={byCategory} />
          )}

          {!loading && activeTab === "seller" && (
            <SellerTable data={bySeller} />
          )}

          {!loading &&
            !error &&
            activeTab === "timeline" &&
            timeline.length === 0 && (
              <EmptyState message="Aucune donnée pour cette période." />
            )}
          {!loading &&
            !error &&
            activeTab === "category" &&
            byCategory.length === 0 && (
              <EmptyState message="Aucune catégorie trouvée pour ces filtres." />
            )}
          {!loading &&
            !error &&
            activeTab === "seller" &&
            bySeller.length === 0 && (
              <EmptyState message="Aucun vendeur trouvé pour ces filtres." />
            )}
        </div>
      </div>
    </div>
  );
}

// ==== Sous-composants UI simples ====

// Stat card
function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "warning" | "danger" | "soft";
}) {
  const base =
    "rounded-lg border px-4 py-3 shadow-sm flex flex-col gap-1 bg-white";

  const variantClasses: Record<string, string> = {
    default: "border-slate-100",
    success: "border-emerald-100 bg-emerald-50",
    warning: "border-amber-100 bg-amber-50",
    danger: "border-red-100 bg-red-50",
    soft: "border-slate-100 bg-slate-50",
  };

  return (
    <div className={`${base} ${variantClasses[variant] ?? ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold text-slate-900">
        {value.toLocaleString("fr-FR")}
      </span>
    </div>
  );
}

// Bouton onglet
function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

// Tables

function TimelineTable({ data }: { data: AdminTimelinePoint[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Date
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre d’annonces
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => (
            <tr key={row.date}>
              <td className="px-3 py-2 align-middle">
                {new Date(row.date).toLocaleDateString("fr-FR")}
              </td>
              <td className="px-3 py-2 align-middle">
                {row.count.toLocaleString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryTable({ data }: { data: AdminCategoryStats[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Catégorie
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Total
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Approuvées
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => (
            <tr key={row.category ?? "unknown"}>
              <td className="px-3 py-2 align-middle">
                {row.category ?? "Inconnue"}
              </td>
              <td className="px-3 py-2 align-middle">
                {row.total.toLocaleString("fr-FR")}
              </td>
              <td className="px-3 py-2 align-middle">
                {row.approved.toLocaleString("fr-FR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SellerTable({ data }: { data: AdminSellerStats[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Vendeur
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type de compte
            </th>
            <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nombre d’annonces
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((row) => {
            const p = row.profile;
            const name = p?.username || p?.email || row.sellerId;
            return (
              <tr key={row.sellerId}>
                <td className="px-3 py-2 align-middle">{name}</td>
                <td className="px-3 py-2 align-middle">
                  {p?.email ?? "—"}
                </td>
                <td className="px-3 py-2 align-middle">
                  {p?.account_type || "—"}
                </td>
                <td className="px-3 py-2 align-middle">
                  {row.totalListings.toLocaleString("fr-FR")}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-32 items-center justify-center text-sm text-slate-500">
      {message}
    </div>
  );
}