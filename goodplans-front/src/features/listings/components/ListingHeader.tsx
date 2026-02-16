import { Camera, Eye, Heart, MapPin, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { ListingDetails } from "../types";
import { FavoriteButton } from "../../../components/listings/FavoriteButton";
import {
  getCategoryGradient,
  getCategoryLabel,
} from "../utils/categoryLabels"
import { useLanguage } from "../../../lib/language/LanguageContext";
import { getLocalizedText } from "../../../lib/language/utils";
import { mapCategorySlugToTranslationKey } from "../../../lib/language/categoryKeyMapper";

// const rentalPeriodLabels: Record<string, string> = {
//   day: "jour",
//   week: "semaine",
//   month: "mois",
//   year: "an",
// };

function normalizeTransaction(tx: unknown): "sale" | "rent" | null {
  if (!tx) return null;
  const s = String(tx).toLowerCase().trim();

  if (["rent", "rental", "location", "louer", "loué", "loue"].includes(s)) return "rent";
  if (["sale", "sell", "vente", "vendre"].includes(s)) return "sale";

  return null;
}

function normalizeRentalPeriod(p: unknown): "day" | "week" | "month" | "year" | null {
  if (!p) return null;
  const s = String(p).toLowerCase().trim();

  if (["day", "jour", "j"].includes(s)) return "day";
  if (["week", "semaine", "sem"].includes(s)) return "week";
  if (["month", "mois"].includes(s)) return "month";
  if (["year", "an", "année", "annee"].includes(s)) return "year";

  return null;
}

interface ListingHeaderProps {
  listing: ListingDetails;
  locationLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => Promise<void> | void;
}

export function ListingHeader({ listing, locationLabel, isFavorite, onToggleFavorite }: ListingHeaderProps) {

  const { lang, t } = useLanguage();

  const displayTitle = getLocalizedText(
    lang,
    listing.title,
    (listing as any).title_en
  );

  const isSold = listing.status?.toLowerCase() === "sold" || listing.status === "Vendu";
  const [showShare, setShowShare] = useState(false);

  // ✅ Normaliser transaction et période
  const normalizedTx = normalizeTransaction(listing.transaction_type);
  const isForRent = normalizedTx === "rent";

  const transactionLabel =
    normalizedTx === "rent"
      ? t("listing.rent")
      : normalizedTx === "sale"
        ? t("listing.sale")
        : null;


  // ✅ Récupérer la période de location depuis plusieurs sources possibles
  const rentalPeriodRaw =
    (listing as any).rental_period ??
    (listing as any).rentalPeriod ??
    null;

  const rentalPeriod = normalizeRentalPeriod(rentalPeriodRaw);

  const stats = useMemo(
    () => [
      { label: t("listing.views"), value: listing.views ?? 0, icon: <Eye className="h-4 w-4" /> },
      { label: t("listing.favorites"), value: listing.favorites ?? 0, icon: <Heart className="h-4 w-4" /> },
      { label: t("listing.photos"), value: listing.images?.length ?? 0, icon: <Camera className="h-4 w-4" /> },


    ],
    [listing.favorites, listing.images?.length, listing.views, t],
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
                <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">{t("listing.sold")}</span>
              ) : transactionLabel ? (
                <span className="rounded-full bg-slate-900/90 px-3 py-1 text-white shadow-sm">
                  {transactionLabel}
                  {/* ✅ Afficher la période UNIQUEMENT si c'est une location */}
                  {isForRent && rentalPeriod && (
                    <span className="ml-1 text-[11px] font-medium text-slate-200">
                      /{t(`listings.rentalPeriod.${rentalPeriod}`)}
                    </span>
                  )}

                </span>
              ) : null}

              <span
                className={`rounded-full bg-gradient-to-r ${getCategoryGradient(
                  listing.category,
                )} px-3 py-1 text-white shadow-sm`}
              >
                {/* {getCategoryLabel(listing.category, lang)} */}
                {t(`categories.${mapCategorySlugToTranslationKey(listing.category)}`)}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">{displayTitle}</h1>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4" />
              <span>{locationLabel}</span>
            </div>

            <div className="flex items-center gap-3 text-2xl font-extrabold text-[#00BEEA]">
              {formattedPrice}
              {/* ✅ Afficher la période dans le prix UNIQUEMENT si c'est une location */}
              {isForRent && rentalPeriod && (
                <span className="ml-1 text-sm font-medium text-gray-500">
                  //{t(`listing.rentalPeriod.${rentalPeriod}`)}
                </span>
              )}
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
              {t("listing.share")}
            </button>
            {showShare && <span className="text-[11px] text-emerald-600">{t("listing.linkCopied")}</span>}
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