import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { ListingHeader } from "../components/ListingHeader";
import { ListingImageGallery } from "../components/ListingImageGallery";
import { ListingDescription } from "../components/ListingDescription";
import { ListingCategoryDetails } from "../components/ListingCategoryDetails";
import { SellerInfoCard } from "../components/SellerInfoCard";
import { SafetyTips } from "../components/SafetyTips";
import { useListingDetails } from "../hooks/useListingDetails";

export function ListingDetailsPage() {
  const { id } = useParams();
  const { listing, isLoading, error, toggleFavorite, isFavorite, data } = useListingDetails(id);

  const locationLabel = useMemo(() => {
    if (!listing) return "";
    return listing.region ? `${listing.city}, ${listing.region}` : listing.city;
  }, [listing]);

  if (isLoading) {
    return <div className="py-16 text-center text-slate-500">Chargement...</div>;
  }

  if (error || !listing) {
    return (
      <div className="py-16 text-center text-red-600">
        {error ?? "Annonce introuvable"}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <ListingHeader
          listing={listing}
          locationLabel={locationLabel}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
        />
        <ListingImageGallery images={listing.images ?? []} title={listing.title} />
        <ListingCategoryDetails listing={listing} />
        <ListingDescription listing={listing} />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <SellerInfoCard seller={data?.seller ?? null} listingId={listing.id} isAuthenticated={Boolean(data?.seller)} />
        <SafetyTips />
      </div>
    </div>
  );
}
