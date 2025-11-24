import { MapPin } from "lucide-react";
import type { ListingDetails } from "../types";
import { FavoriteButton } from "../../../components/listings/FavoriteButton";
import {
  getCategoryGradient,
  getCategoryLabel,
  getTransactionLabel,
} from "../utils/categoryLabels";

interface ListingHeaderProps {
  listing: ListingDetails;
  locationLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => Promise<void> | void;
}

export function ListingHeader({ listing, locationLabel, isFavorite, onToggleFavorite }: ListingHeaderProps) {
  const transactionLabel = getTransactionLabel(listing.transaction_type ?? undefined);
  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";

  return (
    <header className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {isSold ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">Vendu</span>
            ) : transactionLabel ? (
              <span className="rounded-full bg-slate-900/90 px-3 py-1 text-white shadow-sm">{transactionLabel}</span>
            ) : null}

            <span
              className={`rounded-full bg-gradient-to-r ${getCategoryGradient(
                listing.category,
              )} px-3 py-1 text-white shadow-sm`}
            >
              {getCategoryLabel(listing.category)}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900">{listing.title}</h1>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{locationLabel}</span>
          </div>

          <div className="flex items-center gap-3 text-lg font-extrabold text-[#00BEEA]">
            {Number(listing.price).toLocaleString("fr-MA")} DH
            {listing.transaction_type && listing.rental_period && (
              <span className="text-sm font-medium text-slate-500">
                /{listing.rental_period}
              </span>
            )}
          </div>
        </div>

        <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </header>
  );
}
