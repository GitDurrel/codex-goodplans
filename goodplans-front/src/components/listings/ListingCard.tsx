// src/components/listings/ListingCard.tsx
import { Link } from "react-router-dom";
import {
  MapPin,
  Camera,
  BedDouble,
  Bath,
  Ruler,
  Tag,
  Gauge,
  Car,
  Star,
  HomeIcon,
} from "lucide-react";
import { useMemo, useState, type JSX } from "react";
import type { Listing } from "../../features/listings/types";
import { FavoriteButton } from "./FavoriteButton";
import { addFavorite, removeFavorite } from "../../features/listings/apiListings";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../../features/listings/utils/categoryLabels";
import { getOptimizedListingImage } from "../../features/listings/utils/imageOptimization";
import { useLanguage } from "../../lib/language/LanguageContext";
import { getLocalizedText } from "../../lib/language/utils";
import { mapCategorySlugToTranslationKey } from "../../lib/language/categoryKeyMapper";

// const rentalPeriodLabels: Record<string, string> = {
//   day: "jour",
//   week: "semaine",
//   month: "mois",
//   year: "an",
// };

interface ListingCardProps {
  listing: Listing & {
    isFavorite?: boolean;
  };
}

type Badge = { icon: JSX.Element; label: string };

function normalizeCategory(cat: string | null | undefined): string {
  if (!cat) return "";
  const c = String(cat).toLowerCase();

  switch (c) {
    case "immobilier":
      return "real_estate";
    case "vehicules":
    case "vehicule":
    case "vehicle":
      return "vehicle";
    case "artisanat":
      return "craft";
    case "services":
    case "service":
      return "service";
    default:
      return c;
  }
}

function normalizeTransaction(tx: unknown): "sale" | "rent" | null {
  if (!tx) return null;
  const s = String(tx).toLowerCase().trim();

  // valeurs possibles
  if (["rent", "rental", "location", "louer", "loué", "loue"].includes(s)) return "rent";
  if (["sale", "sell", "vente", "vendre"].includes(s)) return "sale";

  return null;
}

function normalizeRentalPeriod(p: unknown): "day" | "week" | "month" | "year" | null {
  if (!p) return null;
  const s = String(p).toLowerCase().trim();

  // accepter plusieurs formats/backends
  if (["day", "jour", "j"].includes(s)) return "day";
  if (["week", "semaine", "sem"].includes(s)) return "week";
  if (["month", "mois"].includes(s)) return "month";
  if (["year", "an", "année", "annee"].includes(s)) return "year";

  return null;
}


function isProbablyId(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return value.length > 20 && value.includes("-");
}

export function ListingCard({ listing }: ListingCardProps) {

  const { lang, t } = useLanguage();

  const rawFilters = (listing as any).filters ?? {};
  const details = (listing as any).details ?? {};
  const filters: Record<string, any> = { ...rawFilters, ...details };

  const normalizedCategory = normalizeCategory(listing.category);

  // ✅ Immobilier : champs
  const rooms = filters.rooms ?? filters.room_count ?? null;
  const bedrooms = filters.bedrooms ?? null;
  const bathrooms = filters.bathrooms ?? filters.baths ?? null;
  const area = filters.surface ?? filters.area ?? null;

  // ✅ Immobilier : top 3 badges (area toujours inclus)
  const realEstateTopBadges = useMemo<Badge[]>(() => {
    if (normalizedCategory !== "real_estate") return [];

    const items: Badge[] = [];

    // 1) area toujours en priorité
    if (area) {
      items.push({
        icon: <Ruler className="h-3.5 w-3.5 text-slate-500" />,
        label: `${area}${typeof area === "number" || `${area}`.match(/\d/) ? " m²" : ""}`,
      });
    }

    // 2) puis rooms/bedrooms/bathrooms selon dispo (max 2 de plus)
    if (rooms) {
      items.push({
        icon: <HomeIcon className="h-3.5 w-3.5 text-slate-500" />,
        label: `${rooms} ${t("listing.cat.realEstate.rooms")}`,
      });
    }

    if (bedrooms) {
      items.push({
        icon: <BedDouble className="h-3.5 w-3.5 text-slate-500" />,
        label: `${bedrooms} ch`,
      });
    }

    if (bathrooms) {
      items.push({
        icon: <Bath className="h-3.5 w-3.5 text-slate-500" />,
        label: `${bathrooms} sdb`,
      });
    }

    return items.slice(0, 3);
  }, [normalizedCategory, area, rooms, bedrooms, bathrooms, t]);

  const hasBaseRealEstateBadges =
    normalizedCategory === "real_estate" && realEstateTopBadges.length > 0;

  // const rentalPeriod: string | null =
  //   (listing as any).rental_period ??
  //   (filters.rental_period as string | undefined) ??
  //   (filters.rentalPeriod as string | undefined) ??
  //   null;

  // ---------- VEHICULE ----------
  const vehicleBadges = useMemo<Badge[]>(() => {
    if (normalizedCategory !== "vehicle") return [];

    const items: Badge[] = [];
    if (filters.brand && !isProbablyId(filters.brand)) {
      items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.brand) });
    }
    if (filters.model && !isProbablyId(filters.model)) {
      items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.model) });
    }
    if (filters.year) {
      items.push({ icon: <Car className="h-3.5 w-3.5" />, label: String(filters.year) });
    }
    if (filters.mileage && !isProbablyId(filters.mileage)) {
      items.push({ icon: <Gauge className="h-3.5 w-3.5" />, label: `${filters.mileage} km` });
    }
    return items;
  }, [filters.brand, filters.model, filters.year, filters.mileage, normalizedCategory]);

  // ---------- SERVICES ----------
  const serviceBadges = useMemo<Badge[]>(() => {
    if (normalizedCategory !== "services") return [];
    const items: Badge[] = [];
    if (filters.service_type) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.service_type) });
    if (filters.experience_level) items.push({ icon: <Gauge className="h-3.5 w-3.5" />, label: String(filters.experience_level) });
    return items;
  }, [filters.service_type, filters.experience_level, normalizedCategory]);

  // ---------- ARTISANAT ----------
  const craftBadges = useMemo<Badge[]>(() => {
    if (normalizedCategory !== "craft") return [];
    const items: Badge[] = [];
    if (filters.craft_type) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.craft_type) });
    if (filters.material) items.push({ icon: <Tag className="h-3.5 w-3.5" />, label: String(filters.material) });
    if (filters.dimensions) items.push({ icon: <Ruler className="h-3.5 w-3.5" />, label: String(filters.dimensions) });
    return items;
  }, [filters.craft_type, filters.material, filters.dimensions, normalizedCategory]);

  // ---------- Extra badges (hors immobilier) ----------
  const extraBadges = useMemo<Badge[]>(() => {
    const typed: Badge[] = [...vehicleBadges, ...serviceBadges, ...craftBadges];

    const MAX_EXTRA_BADGES = 3;
    if (typed.length > 0) return typed.slice(0, MAX_EXTRA_BADGES);

    // fallback générique
    const generic: Badge[] = [];
    for (const [key, value] of Object.entries(filters)) {
      if (generic.length >= MAX_EXTRA_BADGES) break;
      if (value === null || value === undefined || value === "") continue;
      if (typeof value === "boolean") continue;

      const str = String(value).trim();
      if (!str) continue;
      const lower = str.toLowerCase();
      if (lower === "true" || lower === "false") continue;

      if (
        [
          "city", "region", "price", "transaction_type", "category", "subcategory",
          "rooms", "bedrooms", "bathrooms", "surface", "area",
        ].includes(key)
      ) continue;

      if (isProbablyId(str)) continue;
      if (/^\d+(\.\d+)?$/.test(str)) continue;
      if (str.length > 25) continue;

      generic.push({ icon: <Tag className="h-3.5 w-3.5" />, label: str });
    }

    return generic;
  }, [vehicleBadges, serviceBadges, craftBadges, filters]);

  // ✅ Immobilier => pas d'extra badges
  const finalExtraBadges = normalizedCategory === "real_estate" ? [] : extraBadges;

  const showBadgesRow = hasBaseRealEstateBadges || finalExtraBadges.length > 0;

  // ---------- Infos générales ----------
  const imagesCount = Array.isArray(listing.images) ? listing.images.length : 0;

  const mainImage = getOptimizedListingImage(listing);

  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";

  const isFeatured = (listing as any).is_featured === true;

  const transactionRaw = (listing as any).transaction_type ?? (filters.transaction_type as any);
  const normalizedTx = normalizeTransaction(transactionRaw);

  const transactionLabel =
    normalizedTx === "rent"
      ? t("listing.rent")
      : normalizedTx === "sale"
        ? t("listing.sale")
        : null;


  const isForRent = normalizedTx === "rent";

  // Rental period: on check plusieurs sources possibles
  const rentalPeriodRaw =
    (listing as any).rental_period ??
    (listing as any).rentalPeriod ??
    (filters.rental_period as any) ??
    (filters.rentalPeriod as any) ??
    (details.rental_period as any) ??
    null;

  const rentalPeriod = normalizeRentalPeriod(rentalPeriodRaw);


  const locationLabel = listing.region ? `${listing.city}, ${listing.region}` : listing.city;

  const displayTitle = getLocalizedText(
    lang,
    listing.title,
    (listing as any).title_en
  );


  const numericPrice = Number(listing.price);
  const formattedPrice = Number.isNaN(numericPrice)
    ? (listing.price as any)
    : `${numericPrice.toLocaleString("fr-MA")} DH`;

  const [isFavorite, setIsFavorite] = useState<boolean>((listing as any).isFavorite ?? false);

  async function handleFavoriteClick() {
    const optimistic = !isFavorite;
    setIsFavorite(optimistic);

    try {
      if (optimistic) await addFavorite(listing.id);
      else await removeFavorite(listing.id);
    } catch (err) {
      setIsFavorite(!optimistic);
      console.error("Erreur favoris", err);
    }
  }

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group block h-full overflow-hidden rounded-3xl border-2 border-[#00BEEA] bg-white
                 shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-transform duration-300
                 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.12)]
                 flex flex-col"
    >
      {/* IMAGE + OVERLAYS */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={mainImage}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {isFeatured && (
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
            <Star className="h-3.5 w-3.5 fill-white/90" />
            <span>{t("listing.premium")}</span>
          </div>
        )}

        {imagesCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Camera className="h-3.5 w-3.5" />
            <span>{String(imagesCount).padStart(2, "0")}</span>
          </div>
        )}

        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={handleFavoriteClick}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="px-4 pb-4 pt-3 flex flex-col flex-1">
        {/* Localisation */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          <span className="truncate">{locationLabel}</span>
        </div>

        {/* Badges transaction + catégorie */}
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {isSold ? (
            <span className="rounded-full bg-red-100 px-3 py-1 uppercase tracking-wide text-red-700">
              {t("listing.sold")}
            </span>
          ) : transactionLabel ? (
            <span className="rounded-full bg-slate-900/90 px-3 py-1 text-white shadow-sm">
              {transactionLabel}
            </span>
          ) : null}

          {listing.category && (
            <span
              className={`rounded-full bg-gradient-to-r ${getCategoryGradient(listing.category)} px-3 py-1 text-white shadow-sm`}
            >
              {/* {getCategoryLabel(listing.category)} */}
              {t(`categories.${mapCategorySlugToTranslationKey(listing.category)}`)}

            </span>
          )}
        </div>

        {/* Titre */}
        <h3 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-[#00BEEA]">
          {displayTitle}
        </h3>


        {/* Ligne badges */}
        {showBadgesRow && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-gray-700">
            {/* ✅ IMMOBILIER : seulement 3 badges max (area inclus) */}
            {normalizedCategory === "real_estate" &&
              realEstateTopBadges.map((b, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 rounded-lg bg-[#E6F5FA] px-2.5 py-1 shadow-sm"
                >
                  {b.icon}
                  {b.label}
                </span>
              ))}

            {/* ✅ Autres catégories : extra badges */}
            {finalExtraBadges.map((badge, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 rounded-lg bg-[#E6F5FA] px-2.5 py-1 text-[11px] text-slate-700 shadow-sm"
              >
                {badge.icon}
                <span className="truncate max-w-[12rem]">{badge.label}</span>
              </span>
            ))}
          </div>
        )}

        {/* Prix */}
        <div className="mt-auto border-t border-[#00BEEA]/20 pt-3">
          <p className="text-lg font-extrabold text-[#00BEEA]">
            {formattedPrice}
            {isForRent && rentalPeriod && (
              <span className="ml-1 text-xs font-medium text-gray-500">
                /{t(`listing.rentalPeriod.${rentalPeriod}`)}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
