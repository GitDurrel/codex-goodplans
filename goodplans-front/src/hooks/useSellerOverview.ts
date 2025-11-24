import { useCallback, useEffect, useState } from "react";
import { getSellerOverview } from "../api/sellerStatsApi";
import type { SellerOverviewFilters, SellerOverviewResponse } from "../api/sellerStatsApi";

interface UseSellerOverviewResult {
  data: SellerOverviewResponse | null;
  isLoading: boolean;
  error: string | null;
  filters: SellerOverviewFilters;
  setFilters: (next: SellerOverviewFilters) => void;
  refresh: () => Promise<void>;
}

export function useSellerOverview(initialFilters: SellerOverviewFilters = {}): UseSellerOverviewResult {
  const [data, setData] = useState<SellerOverviewResponse | null>(null);
  const [filters, setFilters] = useState<SellerOverviewFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getSellerOverview(filters);
      setData(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de charger les statistiques";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: fetchData,
  };
}
