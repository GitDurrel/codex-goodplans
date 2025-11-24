// src/components/listings/ListingCard.tsx
import { Link } from "react-router-dom";
import { MapPin, Camera, BedDouble, Bath, Ruler, Tag, Gauge } from "lucide-react";
import { useMemo, useState, type JSX } from "react";
import type { Listing } from "../../features/listings/types";
import { FavoriteButton } from "./FavoriteButton";
import {
  addFavorite,
  removeFavorite,
} from "../../features/listings/apiListings";
import {
  getCategoryGradient,
  getCategoryLabel,
  getTransactionLabel,
} from "../../features/listings/utils/categoryLabels";

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
  const filters = (listing as any).filters ?? {};
  const bedrooms = filters.bedrooms ?? filters.rooms ?? null;
  const bathrooms = filters.bathrooms ?? filters.baths ?? null;
  const area = filters.surface ?? filters.area ?? null;

  const vehicleBadges = useMemo(() => {
    if (listing.category !== "vehicle") return [] as { icon: JSX.Element; label: string }[];
    const items: { icon: JSX.Element; label: string }[] = [];
    if (filters.brand) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.brand) });
    if (filters.model) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.model) });
    if (filters.year) items.push({ icon: <Gauge className="h-3.5 w-3.5" />, label: String(filters.year) });
    return items;
  }, [filters.brand, filters.model, filters.year, listing.category]);

  const realEstateBadges = useMemo(() => {
    if (listing.category !== "real_estate") return [] as { icon: JSX.Element; label: string }[];
    const items: { icon: JSX.Element; label: string }[] = [];
    if (filters.rooms) items.push({ icon: <BedDouble className="h-3.5 w-3.5" />, label: `${filters.rooms} pièces` });
    if (filters.surface) items.push({ icon: <Ruler className="h-3.5 w-3.5" />, label: `${filters.surface} m²` });
    if (filters.bedrooms) items.push({ icon: <BedDouble className="h-3.5 w-3.5" />, label: `${filters.bedrooms} ch.` });
    if (filters.bathrooms) items.push({ icon: <Bath className="h-3.5 w-3.5" />, label: `${filters.bathrooms} sdb` });
    return items;
  }, [filters.bathrooms, filters.bedrooms, filters.rooms, filters.surface, listing.category]);

  const serviceBadges = useMemo(() => {
    if (listing.category !== "services") return [] as { icon: JSX.Element; label: string }[];
    const items: { icon: JSX.Element; label: string }[] = [];
    if (filters.service_type) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.service_type) });
    if (filters.experience_level)
      items.push({ icon: <Gauge className="h-3.5 w-3.5" />, label: String(filters.experience_level) });
    return items;
  }, [filters.experience_level, filters.service_type, listing.category]);

  const craftBadges = useMemo(() => {
    if (listing.category !== "craft") return [] as { icon: JSX.Element; label: string }[];
    const items: { icon: JSX.Element; label: string }[] = [];
    if (filters.craft_type) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.craft_type) });
    if (filters.material) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.material) });
    if (filters.dimensions) items.push({ icon: <Ruler className="h-3.5 w-3.5" />, label: String(filters.dimensions) });
    return items;
  }, [filters.craft_type, filters.dimensions, filters.material, listing.category]);

  const imagesCount = Array.isArray(listing.images)
    ? listing.images.length
    : 0;

  const mainImage =
    listing.images?.[0] || "https://placehold.co/600x400?text=Annonce";

  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";
  const transactionRaw = listing.transaction_type as string | undefined;
  const transactionLabel = getTransactionLabel(transactionRaw ?? undefined);
  const isForRent = ["location", "rent"].includes(transactionRaw ?? "");

  const locationLabel = listing.region
    ? `${listing.city}, ${listing.region}`
    : listing.city;

  const numericPrice = Number(listing.price);
  const formattedPrice = Number.isNaN(numericPrice)
    ? listing.price
    : `${numericPrice.toLocaleString("fr-MA")} DH`;

  const [isFavorite, setIsFavorite] = useState<boolean>((listing as any).isFavorite ?? false);

  async function handleFavoriteClick() {
    const optimistic = !isFavorite;
    setIsFavorite(optimistic);
    try {
      if (optimistic) {
        await addFavorite(listing.id);
      } else {
        await removeFavorite(listing.id);
      }
    } catch (err) {
      setIsFavorite(!optimistic);
      console.error("Erreur favoris", err);
    }
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
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={handleFavoriteClick}
          className="absolute right-3 top-3"
        />
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
          ) : transactionLabel ? (
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-white shadow-sm">
              {transactionLabel}
            </span>
          ) : null}

          {listing.category && (
            <span
              className={`rounded-full bg-gradient-to-r ${getCategoryGradient(
                listing.category,
              )} px-3 py-1 text-white shadow-sm`}
            >
              {getCategoryLabel(listing.category)}
            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#00BEEA]">
          {listing.title}
        </h3>

        {/* Ligne d'icônes contextuelles */}
        <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-700">
          {(bedrooms || bathrooms || area) && listing.category === "real_estate" && (
            <>
              {bedrooms && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                  <BedDouble className="h-3.5 w-3.5 text-slate-500" />
                  {bedrooms}
                </span>
              )}
              {bathrooms && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                  <Bath className="h-3.5 w-3.5 text-slate-500" />
                  {bathrooms}
                </span>
              )}
              {area && (
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                  <Ruler className="h-3.5 w-3.5 text-slate-500" />
                  {area}
                  {typeof area === "number" || `${area}`.match(/\d/) ? " m²" : ""}
                </span>
              )}
            </>
          )}

          {[...vehicleBadges, ...realEstateBadges, ...serviceBadges, ...craftBadges].map((badge, idx) => (
            <span
              key={idx}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] text-slate-700"
            >
              {badge.icon}
              {badge.label}
            </span>
          ))}
        </div>

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
