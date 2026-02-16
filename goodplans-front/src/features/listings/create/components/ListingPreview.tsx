// src/features/listings/create/components/ListingPreview.tsx

import {
  X,
  Camera,
  Clock,
  Shield,
  MapPin,
  Share2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Tag,
} from "lucide-react";
import { useState } from "react";

type TransactionType = "achat" | "location" | "" | null;
type RentalPeriod = "day" | "week" | "month" | "year" | "" | null;

interface BaseListingPreview {
  title: string;
  description: string;
  city: string;
  region: string;
  price: number | string;
  transaction_type: TransactionType;
  rental_period?: RentalPeriod;
  images: string[];
}

interface ListingPreviewProps {
  open: boolean;
  onClose: () => void;
  listing: BaseListingPreview;
  category: string;              // "real_estate" | "vehicle" | "service" | "craft"
  details: Record<string, any>;  // objet renvoyé par SpecificDetailsStep
}

function formatPrice(value: number | string | undefined | null) {
  if (value === undefined || value === null || value === "") return "-";
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatRentalPeriod(period: RentalPeriod) {
  switch (period) {
    case "day":
      return "jour";
    case "week":
      return "semaine";
    case "month":
      return "mois";
    case "year":
      return "an";
    default:
      return "";
  }
}

function categoryLabel(cat: string) {
  switch (cat) {
    case "real_estate":
      return "Immobilier";
    case "vehicle":
      return "Auto / Moto & Engins";
    case "service":
      return "Services";
    case "craft":
      return "Artisanat";
    default:
      return "Autre";
  }
}

function formatKeyLabel(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ListingPreview({
  open,
  onClose,
  listing,
  category,
  details,
}: ListingPreviewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShare, setShowShare] = useState(false);

  if (!open) return null;

  const { title, description, city, region, price, images } = listing;

  const isRental = listing.transaction_type === "location";
  const priceText = (() => {
    const base = formatPrice(price);
    if (!base || base === "-") return "-";
    if (!isRental) return `${base} CFA`; // ou MAD si Maroc
    const per = formatRentalPeriod(listing.rental_period ?? null);
    return per ? `${base} CFA / ${per}` : `${base} CFA`;
  })();

  const transactionLabel = (() => {
    if (listing.transaction_type === "achat") return "À vendre";
    if (listing.transaction_type === "location") return "À louer";
    return "Type de transaction non précisé";
  })();

  const hasImages = images && images.length > 0;

  const goNext = () => {
    if (!hasImages) return;
    setCurrentImageIndex((idx) =>
      idx === images.length - 1 ? 0 : idx + 1
    );
  };

  const goPrev = () => {
    if (!hasImages) return;
    setCurrentImageIndex((idx) =>
      idx === 0 ? images.length - 1 : idx - 1
    );
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* Bouton fermeture flottant */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
        aria-label="Fermer la prévisualisation"
      >
        <X className="h-6 w-6 text-gray-700" />
      </button>

      {/* Fullscreen modal container with fixed header + internal scroll */}
      <div className="w-full h-full bg-white shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header (fixed height) */}
          <div className="border-b p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Prévisualisation de l’annonce
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Voici comment votre annonce apparaîtra avant publication.
            </p>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="space-y-6">
          {/* Images + carrousel */}
          <div className="relative mb-4">
            {hasImages ? (
              <div className="relative overflow-hidden h-72 sm:h-80 md:h-96 rounded-xl bg-gray-100">
                <img
                  src={images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* compteur image */}
                <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>

                {/* Nav gauche / droite */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      aria-label="Image précédente"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow"
                      aria-label="Image suivante"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}

                {/* Actions rapides */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFavorite((v) => !v)}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    aria-label={
                      isFavorite
                        ? "Retirer des favoris"
                        : "Ajouter aux favoris"
                    }
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isFavorite
                          ? "text-red-500 fill-red-500"
                          : "text-gray-700"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShare((v) => !v)}
                    className="bg-white/80 hover:bg-white rounded-full p-2 shadow"
                    aria-label="Partager"
                  >
                    <Share2 className="h-5 w-5 text-gray-700" />
                  </button>
                </div>

                {/* pseudo options de partage (preview) */}
                {showShare && (
                  <div className="absolute top-16 left-4 bg-white rounded-lg shadow-lg p-3 text-xs space-y-1">
                    <p className="font-semibold text-gray-800">
                      Partage (prévisualisation)
                    </p>
                    <p className="text-gray-500">
                      Le partage réel se fera sur la page publique de
                      l’annonce.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-72 sm:h-80 md:h-96 rounded-xl bg-gray-100 flex flex-col items-center justify-center text-gray-500">
                <Camera className="h-10 w-10 mb-2" />
                <p>Aucune image ajoutée pour le moment.</p>
              </div>
            )}
          </div>

          {/* Titre + prix */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {title || "Titre non renseigné"}
              </h1>
              {(city || region) && (
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm sm:text-base">
                    {city}
                    {city && region ? " • " : ""}
                    {region}
                  </span>
                </div>
              )}
            </div>

            {/* Prix & type transaction */}
            <div className="flex flex-col items-end gap-1">
              <div className="relative">
                <div className="absolute -top-3 -left-3 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full shadow">
                  {transactionLabel}
                </div>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg shadow-md flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  <span className="text-lg sm:text-2xl font-extrabold">
                    {priceText}
                  </span>
                </div>
              </div>
              {isRental && listing.rental_period && (
                <span className="text-xs text-gray-600 italic mt-1">
                  Location {formatRentalPeriod(listing.rental_period)}.
                </span>
              )}
            </div>
          </div>

          {/* Badges info */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-full shadow-sm">
              <Clock className="h-4 w-4 mr-2 text-blue-500" />
              <span>À l’instant (brouillon)</span>
            </div>
            <div className="flex items-center text-xs sm:text-sm text-gray-700 bg-gray-100 px-3 py-2 rounded-full shadow-sm">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>Annonce en cours de création</span>
            </div>
          </div>

          {/* Infos de base */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Catégorie</p>
              <p className="text-sm font-medium">
                {categoryLabel(category)}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-500 mb-1">
                Localisation
              </p>
              <p className="text-sm font-medium">
                {city || region
                  ? `${city}${city && region ? " • " : ""}${region}`
                  : "Non spécifiée"}
              </p>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <p className="text-xs text-gray-500 mb-1">
                Type de transaction
              </p>
              <p className="text-sm font-medium">{transactionLabel}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm sm:text-base font-semibold mb-2 border-b pb-2">
              Description
            </h3>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {description || "Aucune description fournie."}
            </p>
          </div>

          {/* Détails spécifiques (details) */}
          {details && Object.keys(details).length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm sm:text-base font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                Caractéristiques de l’annonce
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
                {Object.entries(details).map(([key, value]) => {
                  if (
                    value === null ||
                    value === undefined ||
                    value === "" ||
                    (typeof value === "number" && Number.isNaN(value))
                  ) {
                    return null;
                  }

                  return (
                    <div
                      key={key}
                      className="bg-white p-3 rounded-md shadow-sm"
                    >
                      <p className="text-xs font-semibold text-gray-600 mb-1 border-b pb-1">
                        {formatKeyLabel(key)}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        {typeof value === "boolean"
                          ? value
                            ? "Oui"
                            : "Non"
                          : String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Note info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs sm:text-sm text-blue-800">
            <p className="font-semibold mb-1">
              Avant de publier :
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>
                Vérifiez bien le prix, la catégorie et la
                localisation.
              </li>
              <li>
                Vos images doivent représenter fidèlement l’article ou
                le bien.
              </li>
              <li>
                Après publication, vous pourrez modifier l’annonce
                depuis votre tableau de bord.
              </li>
            </ul>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
