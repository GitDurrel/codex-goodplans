import { useMemo } from "react";
import { OverviewStatsCards } from "../../components/seller/OverviewStatsCards";
import { OverviewPopularListings } from "../../components/seller/OverviewPopularListings";
import { OverviewRecentActivity } from "../../components/seller/OverviewRecentActivity";
import { OverviewFiltersBar } from "../../components/seller/OverviewFiltersBar";
import { useSellerOverview } from "../../hooks/useSellerOverview";
import { getCategoryLabel } from "../../features/listings/utils/categoryLabels";
import { useUnreadCount } from "../../features/messages/apiMessage"; // ✅ ajout
import { useLanguage } from "../../lib/language/LanguageContext";

export default function SellerOverviewPage() {
  const { data, isLoading, error, filters, setFilters } = useSellerOverview();
  const { t, lang } = useLanguage();

  // messages non lus (même API que la navbar)
  const { data: unreadData } = useUnreadCount(false);
  const unreadMessages = unreadData?.unreadCount ?? 0;


  const stats = useMemo(
    () => ({
      activeListings: data?.listings.approved ?? 0,
      totalViews: data?.engagement.totalViews ?? 0,
      unreadMessages, // ici
      pendingOffers: data?.listings.pending ?? 0,
    }),
    [data, unreadMessages]
  );

  const derivedActivities = useMemo(() => {
    if (!data) return [];

    const today = new Date().toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US");
    const base = [
      {
        id: "views",
        type: "view",
        message: `${data.engagement.totalViews} ${t("seller.overview.totalViews")}`,
        time: today,
      },
    ];

    const categoryActivities = (data.byCategory || [])
      .slice(0, 3)
      .map((cat, index) => ({
        id: `cat-${cat.category}-${index}`,
        type: "message",
        message: `${getCategoryLabel(cat.category)} • ${cat.approved ?? cat.total
          } ${t("seller.overview.published")}`,
        time: today,
      }));

    return [...base, ...categoryActivities];
  }, [data, lang, t]);

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 py-6">
      <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8">
        <OverviewFiltersBar filters={filters} onChange={setFilters} />

        {error && (
          <div className="animate-appear flex items-center rounded-xl border border-red-100 bg-red-50 p-4 text-red-700">
            <span className="text-sm">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            {/* tes cartes stats affichent maintenant unreadMessages */}
            <OverviewStatsCards stats={stats} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <OverviewPopularListings listings={[]} />
              <OverviewRecentActivity activities={derivedActivities} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
