import { useEffect, useMemo, useState } from "react";
import {
  addFavorite,
  fetchListingDetails,
  removeFavorite,
  type ListingDetailResponse,
} from "../apiListings";
import type { ListingDetails } from "../types";

interface UseListingDetailsState {
  data: ListingDetailResponse | null;
  isLoading: boolean;
  error: string | null;
  toggleFavorite: () => Promise<void>;
  listing: ListingDetails | null;
  isFavorite: boolean;
}

export function useListingDetails(id: string | undefined): UseListingDetailsState {
  const [data, setData] = useState<ListingDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listing = useMemo(() => data?.listing ?? null, [data]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Identifiant d'annonce manquant");
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const nextData = await fetchListingDetails(id);
        if (cancelled) return;
        setData(nextData);
        setIsFavorite(Boolean(nextData.isFavorite));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Impossible de charger l'annonce");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const toggleFavorite = async () => {
    if (!data || !id) return;
    const optimistic = !isFavorite;
    setIsFavorite(optimistic);
    setData((prev) =>
      prev
        ? {
            ...prev,
            listing: {
              ...prev.listing,
              favorites: Math.max(0, (prev.listing.favorites ?? 0) + (optimistic ? 1 : -1)),
            },
          }
        : prev,
    );

    try {
      if (optimistic) {
        await addFavorite(id);
      } else {
        await removeFavorite(id);
      }
    } catch (err) {
      // revert
      setIsFavorite(!optimistic);
      setData((prev) =>
        prev
          ? {
              ...prev,
              listing: {
                ...prev.listing,
                favorites: Math.max(0, (prev.listing.favorites ?? 0) + (optimistic ? -1 : 1)),
              },
            }
          : prev,
      );
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour des favoris");
    }
  };

  return {
    data,
    isLoading,
    error,
    toggleFavorite,
    listing,
    isFavorite,
  };
}
