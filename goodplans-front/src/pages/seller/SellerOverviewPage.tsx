import { useMemo } from "react";
import { OverviewStatsCards } from "../../components/seller/OverviewStatsCards";
import { OverviewPopularListings } from "../../components/seller/OverviewPopularListings";
import { OverviewRecentActivity } from "../../components/seller/OverviewRecentActivity";
import { OverviewFiltersBar } from "../../components/seller/OverviewFiltersBar";
import { useSellerOverview } from "../../hooks/useSellerOverview";
import { getCategoryLabel } from "../../features/listings/utils/categoryLabels";

export default function SellerOverviewPage() {
  const { data, isLoading, error, filters, setFilters } = useSellerOverview();

  const stats = useMemo(
    () => ({
      activeListings: data?.listings.approved ?? 0,
      totalViews: data?.engagement.totalViews ?? 0,
      unreadMessages: 0, // TODO: branch to messaging service
      pendingOffers: data?.listings.pending ?? 0,
    }),
    [data]
  );

  const derivedActivities = useMemo(() => {
    if (!data) return [];

    const today = new Date().toLocaleDateString("fr-FR");
    const base = [
      {
        id: "views",
        type: "view",
        message: `${data.engagement.totalViews} vues cumulées`,
        time: today,
      },
    ];

    const categoryActivities = (data.byCategory || []).slice(0, 3).map((cat, index) => ({
      id: `cat-${cat.category}-${index}`,
      type: "message",
      message: `${getCategoryLabel(cat.category)} • ${cat.approved ?? cat.total} publiées`,
      time: today,
    }));

    return [...base, ...categoryActivities];
  }, [data]);

  return (
    <div className="space-y-6">
      <OverviewFiltersBar filters={filters} onChange={setFilters} />

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center animate-appear">
          <span className="text-sm">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <OverviewStatsCards stats={stats} />

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <OverviewPopularListings listings={[]} />
            <OverviewRecentActivity activities={derivedActivities} />
          </div>
        </>
      )}
    </div>
  );
}
