// src/components/listings/ListingCard.tsx
import { Link } from "react-router-dom";
import {
  MapPin,
  Camera,
  Heart,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import type { Listing } from "../../features/listings/types";

const rentalPeriodLabels: Record<string, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  year: "an",
};

interface ListingCardProps {
  listing: Listing & {
    // si plus tard tu ajoutes cette info côté API, ça sera déjà prêt
    isFavorite?: boolean;
  };
}

export function ListingCard({ listing }: ListingCardProps) {
  // tentative de lecture des meta depuis filters (JSON côté Prisma)
  const filters = (listing as any).filters ?? {};
  const bedrooms =
    filters.bedrooms ?? filters.rooms ?? filters.chambres ?? null;
  const bathrooms =
    filters.bathrooms ?? filters.baths ?? filters.salles_de_bain ?? null;
  const area =
    filters.surface ?? filters.area ?? filters.surface_m2 ?? null;

  const imagesCount = Array.isArray(listing.images)
    ? listing.images.length
    : 0;

  const mainImage =
    listing.images?.[0] || "https://placehold.co/600x400?text=Annonce";

  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";
  const isForRent = listing.transaction_type === "location";
  const isForSale = listing.transaction_type === "achat";

  const locationLabel = listing.region
    ? `${listing.city}, ${listing.region}`
    : listing.city;

  const numericPrice = Number(listing.price);
  const formattedPrice = Number.isNaN(numericPrice)
    ? listing.price
    : `${numericPrice.toLocaleString("fr-MA")} DH`;

  function handleFavoriteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    // Ici tu pourras appeler ton API favoris (add/removeFavorite)
    // pour l'instant on laisse juste un console.log
    console.log("TODO: toggle favorite for listing", listing.id);
  }

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block rounded-3xl border-2 border-[#00BEEA] bg-white shadow-[0_8px_20px_rgba(0,0,0,0.04)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)]"
    >
      {/* IMAGE + OVERLAYS */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Pastille nombre de photos */}
        {imagesCount > 0 && (
          <div className="absolute left-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" />
            <span>{String(imagesCount).padStart(2, "0")}</span>
          </div>
        )}

        {/* Bouton favoris */}
        <button
          onClick={handleFavoriteClick}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#00BEEA] shadow-sm backdrop-blur hover:bg-white"
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`h-4 w-4 ${
              (listing as any).isFavorite ? "fill-[#00BEEA]" : "fill-none"
            }`}
          />
        </button>
      </div>

      {/* CONTENU */}
      <div className="px-4 pb-4 pt-3">
        {/* Ligne localisation */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <span>{locationLabel}</span>
        </div>

        {/* Badges (transaction + catégorie) */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {isSold ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 uppercase tracking-wide">
              Vendu
            </span>
          ) : isForRent || isForSale ? (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
              {isForRent ? "À louer" : "À vendre"}
            </span>
          ) : null}

          {listing.category && (
            <span className="rounded-full bg-[#00BEEA]/10 px-3 py-1 text-[#00BEEA]">
              {listing.category}
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#00BEEA]">
          {listing.title}
        </h3>

        {/* Ligne d'icônes (chambres, bains, surface) */}
        {(bedrooms || bathrooms || area) && (
          <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
            {bedrooms && (
              <div className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5 text-gray-400" />
                <span>{bedrooms}</span>
              </div>
            )}
            {bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5 text-gray-400" />
                <span>{bathrooms}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <Ruler className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  {area}
                  {typeof area === "number" || `${area}`.match(/\d/)
                    ? " m²"
                    : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Prix */}
        <div className="mt-auto border-t border-[#00BEEA]/20 pt-3">
          <p className="text-lg font-extrabold text-[#00BEEA]">
            {formattedPrice}
            {isForRent && listing.rental_period && (
              <span className="ml-1 text-xs font-medium text-gray-500">
                /
                {rentalPeriodLabels[listing.rental_period] ??
                  listing.rental_period}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
