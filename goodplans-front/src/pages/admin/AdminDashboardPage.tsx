// src/features/admin/pages/AdminDashboardPage.tsx
import React, { useEffect, useMemo, useState, type JSX } from "react";
import {
  Users,
  ShoppingBag,
  Clock,
  RefreshCw,
  Eye,
  Heart,
  CarFront,
  Home,
  Hammer,
  BadgePercent,
  Sparkles,
  Star,
} from "lucide-react";

import { useFetch } from "../../hooks/useFetch";
import {
  apiAdminGetFeaturedOrders,
  type AdminFeaturedOrder,
} from "../../features/admin/adminApi";

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

type AdminByCategoryItem = {
  category: string | null;
  total: number;
  approved: number;
};

const CATEGORY_LABELS: Record<string, { label: string; icon: JSX.Element }> = {
  vehicle: {
    label: "Véhicules",
    icon: <CarFront className="h-4 w-4" />,
  },
  craft: {
    label: "Artisanat & déco",
    icon: <Hammer className="h-4 w-4" />,
  },
  real_estate: {
    label: "Immobilier",
    icon: <Home className="h-4 w-4" />,
  },
  service: {
    label: "Services",
    icon: <BadgePercent className="h-4 w-4" />,
  },
};

function formatDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}

const madFormatter = new Intl.NumberFormat("fr-MA", {
  style: "currency",
  currency: "MAD",
  maximumFractionDigits: 0,
});

export default function AdminDashboardPage() {
  // ----- filtres dates -----
  const today = useMemo(() => new Date(), []);
  const [from, setFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return formatDateInput(d);
  });
  const [to, setTo] = useState<string>(() => formatDateInput(today));

  function buildQuery() {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
  }

  const queryString = buildQuery();

  // overview + by-category
  const {
    data: overview,
    loading: loadingOverview,
    error: errorOverview,
    refetch: refetchOverview,
  } = useFetch<AdminOverviewResponse>(`/admin/stats/overview${queryString}`);

  const {
    data: byCategory,
    loading: loadingCategory,
    error: errorCategory,
    refetch: refetchCategory,
  } = useFetch<AdminByCategoryItem[]>(`/admin/stats/by-category${queryString}`);

  const isLoading = loadingOverview || loadingCategory;
  const error = errorOverview || errorCategory || null;

  // ----- Stats mises en avant (featured orders) -----
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredSummary, setFeaturedSummary] = useState<{
    totalRevenueMad: number;
    activeCount: number;
    inactiveCount: number;
    avgDurationDays: number;
  }>({
    totalRevenueMad: 0,
    activeCount: 0,
    inactiveCount: 0,
    avgDurationDays: 0,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        setFeaturedLoading(true);

        const params: { from?: string; to?: string } = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const orders: AdminFeaturedOrder[] =
          await apiAdminGetFeaturedOrders(params);

        if (cancelled) return;

        // 👉 uniquement les mises en avant ACTIVES dans la période
        const activeOrders = orders.filter((o) => o.status === "ACTIVE");
        const inactiveOrders = orders.filter((o) => o.status !== "ACTIVE");

        // 👉 prix du plan : en MAD (d’après ton service)
        const totalRevenueMad = activeOrders.reduce((sum, o) => {
          const raw = o.plan?.price ?? 0;
          const price = Number(raw);
          if (!Number.isFinite(price)) return sum;
          return sum + price;
        }, 0);

        // 👉 durée moyenne en jours (sur les actives)
        const avgDurationDays =
          activeOrders.length > 0
            ? Math.round(
              activeOrders.reduce(
                (sum, o) => sum + Number(o.plan?.duration_days ?? 0),
                0
              ) / activeOrders.length
            )
            : 0;

        // (optionnel) debug si tu veux voir les valeurs :
        console.log("[FEATURED DEBUG] orders=", orders);
        console.log("[FEATURED DEBUG] revenue MAD =", totalRevenueMad);

        setFeaturedSummary({
          totalRevenueMad,
          activeCount: activeOrders.length,
          inactiveCount: inactiveOrders.length,
          avgDurationDays,
        });
      } catch (err) {
        console.error("Erreur chargement mises en avant", err);
        // on garde le dashboard utilisable même si ça plante
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    }

    void loadFeatured();

    return () => {
      cancelled = true;
    };
  }, [from, to]);


  function handleRefresh() {
    void refetchOverview();
    void refetchCategory();
    // rechargera les mises en avant via l’effet (from/to inchangés)
  }

  function setPresetDays(days: number) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setFrom(formatDateInput(start));
    setTo(formatDateInput(end));
  }

  function clearDates() {
    setFrom("");
    setTo("");
  }

  const stats = overview?.listings;
  const engagement = overview?.engagement;

  return (
    <div className="space-y-6">
      {/* Header + filtres */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            Tableau de bord Admin
          </h1>
          <p className="text-sm text-slate-500">
            Vue globale de l&apos;activité des annonces.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {/* filtres dates */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Du</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-9 rounded-md border border-slate-200 px-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Au</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-9 rounded-md border border-slate-200 px-2 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* presets */}
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setPresetDays(7)}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
              >
                7 jours
              </button>
              <button
                type="button"
                onClick={() => setPresetDays(30)}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
              >
                30 jours
              </button>
              <button
                type="button"
                onClick={clearDates}
                className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
              >
                Tout
              </button>
            </div>
          </div>

          {/* refresh + date actuelle */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-700 hover:bg-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </button>
            <div className="hidden text-xs text-slate-500 sm:block">
              {today.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* erreurs */}
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message || "Erreur lors du chargement des données"}
        </div>
      )}

      {/* loading */}
      {isLoading && (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}

      {!isLoading && overview && (
        <>
          {/* stats principales */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={ShoppingBag}
              title="Total annonces"
              value={stats?.total ?? 0}
              subtitle="Toutes les annonces du site"
            />
            <StatCard
              icon={Users}
              title="Approuvées"
              value={stats?.approved ?? 0}
              subtitle="Annonces publiées"
            />
            <StatCard
              icon={Clock}
              title="En attente"
              value={stats?.pending ?? 0}
              subtitle="En cours de modération"
            />
            <StatCard
              icon={Clock}
              title="Rejetées"
              value={stats?.rejected ?? 0}
              subtitle="Refusées par la modération"
            />
          </div>

          {/* vues / favoris */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SimpleCard
              icon={Eye}
              title="Vues cumulées"
              value={engagement?.totalViews ?? 0}
            />
            <SimpleCard
              icon={Heart}
              title="Favoris cumulés"
              value={engagement?.totalFavorites ?? 0}
            />
          </div>

          {/* Mises en avant / Annonces sponsorisées */}
          <FeaturedHighlightCard
            loading={featuredLoading}
            totalRevenueMad={featuredSummary.totalRevenueMad}
            activeCount={featuredSummary.activeCount}
            inactiveCount={featuredSummary.inactiveCount}
            avgDurationDays={featuredSummary.avgDurationDays}
          />


          {/* par catégorie */}
          <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-semibold">
              Annonces par catégorie
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(byCategory ?? []).map((item) => {
                const key = item.category ?? "unknown";
                const info = CATEGORY_LABELS[key] ?? {
                  label: item.category ?? "Autres",
                  icon: <ShoppingBag className="h-4 w-4" />,
                };

                return (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3 hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                        {info.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{info.label}</p>
                        <p className="text-xs text-slate-500">
                          {item.approved} approuvées
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{item.total}</p>
                      <p className="text-[11px] text-slate-400">Total</p>
                    </div>
                  </div>
                );
              })}
              {(byCategory?.length ?? 0) === 0 && (
                <p className="col-span-full text-sm text-slate-500">
                  Aucune annonce pour cette période.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
  subtitle?: string;
};

function StatCard({ icon: Icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-xl font-semibold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

type SimpleCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: number;
};

function SimpleCard({ icon: Icon, title, value }: SimpleCardProps) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

type FeaturedHighlightProps = {
  totalRevenueMad: number;
  activeCount: number;
  inactiveCount: number;
  avgDurationDays: number;
  loading: boolean;
};

function FeaturedHighlightCard({
  totalRevenueMad,
  activeCount,
  inactiveCount,
  avgDurationDays,
  loading,
}: FeaturedHighlightProps) {
  return (
    <div className="rounded-lg border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Mises en avant / annonces sponsorisées
            </p>
          </div>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="h-3 w-3 animate-spin rounded-full border-b-2 border-amber-500" />
            Chargement…
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-md bg-white/70 px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">
            Revenu généré
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {madFormatter.format(totalRevenueMad)}
          </p>
        </div>
        <div className="rounded-md bg-white/70 px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">
            Mises en avant actives
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {activeCount}
          </p>
        </div>
        <div className="rounded-md bg-white/70 px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">
            Mises en avant inactives
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            {inactiveCount}
          </p>
        </div>
        <div className="rounded-md bg-white/70 px-3 py-2">
          <p className="text-[11px] font-medium text-slate-500">
            Durée moyenne
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900 flex items-center gap-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            {avgDurationDays > 0 ? `${avgDurationDays} jours` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}