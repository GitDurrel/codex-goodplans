import { Camera, Eye, Heart, MapPin, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ListingDetails } from "../types";
import { FavoriteButton } from "../../../components/listings/FavoriteButton";
import {
  getCategoryGradient,
  getCategoryLabel,
  getTransactionLabel,
} from "../utils/categoryLabels";

const rentalPeriodLabels: Record<string, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  year: "an",
};

interface ListingHeaderProps {
  listing: ListingDetails;
  locationLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => Promise<void> | void;
}

export function ListingHeader({ listing, locationLabel, isFavorite, onToggleFavorite }: ListingHeaderProps) {
  const transactionLabel = getTransactionLabel(listing.transaction_type ?? undefined);
  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";
  const [showShare, setShowShare] = useState(false);

  const stats = useMemo(
    () => [
      { label: "vues", value: listing.views ?? 0, icon: <Eye className="h-4 w-4" /> },
      { label: "favoris", value: listing.favorites ?? 0, icon: <Heart className="h-4 w-4" /> },
      { label: "photos", value: listing.images?.length ?? 0, icon: <Camera className="h-4 w-4" /> },
    ],
    [listing.favorites, listing.images?.length, listing.views],
  );

  const formattedPrice = useMemo(() => {
    const numeric = Number(listing.price);
    return Number.isNaN(numeric) ? listing.price : `${numeric.toLocaleString("fr-MA")} MAD`;
  }, [listing.price]);

  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              {isSold ? (
                <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">Vendu</span>
              ) : transactionLabel ? (
                <span className="rounded-full bg-slate-900/90 px-3 py-1 text-white shadow-sm">
                  {transactionLabel}
                  {listing.rental_period && rentalPeriodLabels[listing.rental_period] && (
                    <span className="ml-1 text-[11px] font-medium text-slate-200">
                      /{rentalPeriodLabels[listing.rental_period]}
                    </span>
                  )}
                </span>
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

            <div className="flex items-center gap-3 text-2xl font-extrabold text-[#00BEEA]">
              {formattedPrice}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setShowShare(true);
                setTimeout(() => setShowShare(false), 1500);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Share2 className="h-4 w-4" />
              Partager
            </button>
            {showShare && <span className="text-[11px] text-emerald-600">Lien copié</span>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              {stat.icon}
              <span>
                <strong className="mr-1 text-slate-900">{stat.value}</strong>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
