import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import type { Listing } from "../../features/listings/types";
import { ListingCard } from "../listings/ListingCard";
import { fetchCategoryListings } from "../../features/listings/apiListings";
import { getCategoryLabel } from "../../features/listings/utils/categoryLabels";
import { useLanguage } from "../../lib/language/LanguageContext";

type CategoryApi = "real_estate" | "vehicle" | "craft" | "service";

type Props = {
    /** filtres communs appliqués à toutes les catégories (sauf category/subcategory) */
    sharedFilters?: Record<string, any>;
    /** limite max de cards par catégorie */
    limit?: number;
    /** si défini, n'affiche que ces catégories (dans l'ordre défini par ORDER) */
    only?: CategoryApi[];
    /** optionnel: texte du CTA */
    seeAllLabel?: string;
};

const ORDER: { key: CategoryApi; titleKeyForLabel: string }[] = [
    { key: "real_estate", titleKeyForLabel: "real_estate" },
    { key: "vehicle", titleKeyForLabel: "vehicle" },
    { key: "craft", titleKeyForLabel: "craft" },
    { key: "service", titleKeyForLabel: "services" },
];

function SectionSkeleton() {
    return (
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-[78vw] md:w-[280px] lg:w-[320px] flex-none">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
                        <div className="aspect-[4/3] bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                            <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                            <div className="h-5 bg-gray-200 rounded-full w-1/3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function MobileCategoryRows({
    sharedFilters = {},
    limit = 12,
    only,
    seeAllLabel = "Voir tout",
}: Props) {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [data, setData] = useState<Record<CategoryApi, Listing[]>>({
        real_estate: [],
        vehicle: [],
        craft: [],
        service: [],
    });

    const [loading, setLoading] = useState(true);

    const visibleOrder = useMemo(() => {
        return ORDER.filter((c) => !only || only.includes(c.key));
    }, [only]);

    const safeFilters = useMemo(() => {
        const { category, subcategory, ...rest } = sharedFilters || {};
        return rest;
    }, [sharedFilters]);

    function handleSeeAll(category: CategoryApi) {
        const params = new URLSearchParams();
        params.set("category", category);

        Object.entries(safeFilters).forEach(([k, v]) => {
            if (v === undefined || v === null || v === "") return;
            params.set(k, String(v));
        });

        navigate(`/search?${params.toString()}`);
    }

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            try {
                setLoading(true);

                console.log('🔍 MobileCategoryRows - Chargement des catégories:', visibleOrder.map(v => v.key));
                console.log('🔍 MobileCategoryRows - Filtres appliqués:', safeFilters);

                const results = await Promise.all(
                    visibleOrder.map(({ key }) =>
                        fetchCategoryListings(key, safeFilters).then((rows) => {
                            console.log(`📦 Catégorie ${key}:`, rows?.length || 0, 'annonces');
                            return [key, rows] as const;
                        })
                    )
                );

                if (cancelled) return;

                const next: Record<CategoryApi, Listing[]> = {
                    real_estate: [],
                    vehicle: [],
                    craft: [],
                    service: [],
                };

                for (const [key, rows] of results) {
                    next[key] = (rows || []).slice(0, limit);
                }

                setData(next);
            } catch (e) {
                if (!cancelled) {
                    console.error("MobileCategoryRows load error", e);
                    setData({ real_estate: [], vehicle: [], craft: [], service: [] });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [JSON.stringify(safeFilters), limit, JSON.stringify(visibleOrder.map((v) => v.key))]);

    return (
        <div className="space-y-10">
            {visibleOrder.map(({ key, titleKeyForLabel }) => {
                const listings = data[key] ?? [];
                const title = getCategoryLabel(titleKeyForLabel);

                return (
                    <section key={key}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                                <h2 className="text-lg font-extrabold text-blue-600">
                                    {title}
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleSeeAll(key)}
                                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                            >
                                {t("home.seeAllLabel")} <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        {loading ? (
                            <SectionSkeleton />
                        ) : listings.length > 0 ? (
                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {listings.map((listing) => (
                                    <div
                                        key={listing.id}
                                        className="w-[78vw] md:w-[280px] lg:w-[320px] flex-none snap-start"
                                    >
                                        <ListingCard listing={listing as any} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-500">
                                {t("home.noResultsCategory")}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}