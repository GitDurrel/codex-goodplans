import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ListingHeader } from "../components/ListingHeader";
import { ListingImageGallery } from "../components/ListingImageGallery";
import { ListingDescription } from "../components/ListingDescription";
import { ListingCategoryDetails } from "../components/ListingCategoryDetails";
import { SellerInfoCard } from "../components/SellerInfoCard";
import { SafetyTips } from "../components/SafetyTips";
import { useListingDetails } from "../hooks/useListingDetails";
import { ListingBreadcrumbs } from "../components/ListingBreadcrumbs";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export function ListingDetailsPage() {
  const { id } = useParams();
  const { listing, isLoading, error, toggleFavorite, isFavorite, data } = useListingDetails(id);

  const locationLabel = useMemo(() => {
    if (!listing) return "";
    return listing.region ? `${listing.city}, ${listing.region}` : listing.city;
  }, [listing]);

  if (isLoading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-slate-500">Chargement...</div>;
  }

  if (error || !listing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-xl rounded-2xl bg-red-50 p-8 text-center text-red-700 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle />
          </div>
          <p className="mb-4 text-lg font-semibold">{error ?? "Annonce introuvable"}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 lg:flex-row">
      <div className="flex flex-1 flex-col gap-6">
        <ListingBreadcrumbs listing={listing} />
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
        <SellerInfoCard
          seller={data?.seller ?? null}
          listingId={listing.id}
          isAuthenticated={Boolean(data?.seller)}
        />
        <SafetyTips />
      </div>
    </div>
  );
}
