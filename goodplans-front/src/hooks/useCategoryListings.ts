import { useEffect, useState } from "react";
import type { Listing } from "../features/listings/types";
import { fetchCategoryListings } from "../features/listings/apiListings";

type CategoryApi = "real_estate" | "vehicle" | "craft" | "service";

export function useCategoryListings(
  category: CategoryApi,
  filters: Record<string, any> = {},
  limit: number = 8
) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        const { category: _cat, subcategory: _sub, ...safeFilters } = filters;

        const data = await fetchCategoryListings(category, safeFilters);

        if (!cancelled) {
          setListings((data || []).slice(0, limit));
        }
      } catch (error) {
        console.error(`Error loading ${category}:`, error);
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [category, JSON.stringify(filters), limit]);

  return { listings, loading };
}