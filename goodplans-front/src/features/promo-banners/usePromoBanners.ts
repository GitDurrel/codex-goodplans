import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import type { PromoBanner } from "../admin/adminApi";

export type PromoBannerPlacement =
  | "carousel"
  | "popup"
  | "topOfPage"
  | "searchPage";

type UsePromoBannersResult = {
  banners: PromoBanner[];
  loading: boolean;
  error: string | null;
};

export function usePromoBanners(
  placement?: PromoBannerPlacement
): UsePromoBannersResult {
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const query = placement ? `?placement=${placement}` : "";
        const data = await apiRequest<PromoBanner[]>(
          "GET",
          `/promo-banners/public${query}`
        );

        if (!cancelled) {
          setBanners(data ?? []);
        }
      } catch (e: any) {
        console.error("Erreur chargement promo banners", e);
        if (!cancelled) {
          setError(e?.message || "Erreur chargement encarts publicitaires");
          setBanners([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [placement]);

  return { banners, loading, error };
}
