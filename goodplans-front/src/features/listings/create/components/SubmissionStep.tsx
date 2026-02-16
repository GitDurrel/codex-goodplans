// src/components/listing/steps/SubmissionStep.tsx

import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";

interface SubmissionListing {
  title?: string;
  description?: string;
  city?: string;
  region?: string;
  price?: number | string;
  transaction_type?: string; // "achat" | "location"
  rental_period?: string;    // "day" | "week" | "month" | "year"
  images?: string[];
}

interface SubmissionStepProps {
  listing: SubmissionListing;
  details: any;
  category: string;
  createListing: () => Promise<void>;
  loading: boolean;
}

export function SubmissionStep({
  listing,
  category,
  createListing,
  loading,
}: SubmissionStepProps) {
  const imagesCount = listing.images?.length ?? 0;

  const hasRequiredFields = Boolean(
    category &&
      listing.title?.trim() &&
      listing.description?.trim() &&
      listing.price &&
      listing.city?.trim() &&
      listing.region?.trim() &&
      listing.transaction_type
  );

  const hasImages = imagesCount > 0;

  const readableCategoryMap: Record<string, string> = {
    real_estate: "Immobilier",
    vehicle: "Véhicule",
    service: "Service",
    craft: "Artisanat",
  };

  const readableTransaction =
    listing.transaction_type === "achat"
      ? "À vendre"
      : listing.transaction_type === "location"
      ? "À louer"
      : "-";

  const readableRentalPeriod =
    listing.transaction_type === "location" && listing.rental_period
      ? {
          day: "Par jour",
          week: "Par semaine",
          month: "Par mois",
          year: "Par an",
        }[listing.rental_period] ?? "-"
      : null;

  async function handleSubmit() {
    if (loading) return;
    await createListing();
  }

  return (
    <div className="space-y-6">
      {/* Titre + intro */}
      <div className="border-b pb-3">
        <h3 className="text-xl font-bold">Finalisation</h3>
        <p className="text-gray-600 text-sm">
          Vérifiez vos informations avant de publier l’annonce.
        </p>
      </div>

      {/* Résumé de l’annonce */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
        <h4 className="text-sm font-semibold text-gray-800 mb-1">
          Résumé de l’annonce
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Catégorie</p>
            <p className="font-medium">
              {readableCategoryMap[category] ?? category ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Type de transaction</p>
            <p className="font-medium">{readableTransaction}</p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Titre</p>
            <p className="font-medium line-clamp-1">
              {listing.title || "-"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs">Localisation</p>
            <p className="font-medium">
              {listing.city || "-"}{" "}
              {listing.region ? `(${listing.region})` : ""}
            </p>
          </div>

          <div className="sm:col-span-2">
            <p className="text-gray-500 text-xs">Description</p>
            <p className="font-medium text-sm line-clamp-3">
              {listing.description || "-"}
            </p>
          </div>

          <div>
  <p className="text-gray-500 text-xs">Prix</p>

<p className="font-medium">
  {listing.price 
    ? `${Number(listing.price).toLocaleString('fr-FR', { 
        minimumFractionDigits: 0,
        maximumFractionDigits: 0 
      })} MAD` 
    : "-"}
  {readableRentalPeriod && (
    <span className="text-gray-500 text-xs ml-1">
      ({readableRentalPeriod})
    </span>
  )}
</p>
</div>

          <div>
            <p className="text-gray-500 text-xs">Images</p>
            <p className="font-medium flex items-center gap-1">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              {imagesCount} image{imagesCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Vérifications */}
      <div className="space-y-3 text-sm">
        <div
          className={`flex items-center p-3 rounded-lg ${
            hasRequiredFields ? "bg-green-50" : "bg-yellow-50"
          }`}
        >
          {hasRequiredFields ? (
            <CheckCircle2 className="text-green-500 mr-3 w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="text-yellow-500 mr-3 w-5 h-5 flex-shrink-0" />
          )}
          <div>
            <p
              className={`font-medium ${
                hasRequiredFields ? "text-green-700" : "text-yellow-700"
              }`}
            >
              Champs obligatoires
            </p>
            <p className="text-xs text-gray-600">
              {hasRequiredFields
                ? "Tous les champs essentiels semblent remplis."
                : "Certains champs obligatoires sont manquants (titre, description, prix, localisation, type de transaction, etc.)."}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center p-3 rounded-lg ${
            hasImages ? "bg-green-50" : "bg-yellow-50"
          }`}
        >
          {hasImages ? (
            <CheckCircle2 className="text-green-500 mr-3 w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="text-yellow-500 mr-3 w-5 h-5 flex-shrink-0" />
          )}
          <div>
            <p
              className={`font-medium ${
                hasImages ? "text-green-700" : "text-yellow-700"
              }`}
            >
              Images
            </p>
            <p className="text-xs text-gray-600">
              {hasImages
                ? `${imagesCount} image(s) ajoutée(s).`
                : "Aucune image ajoutée. Ajoutez au moins une photo pour attirer plus de visiteurs."}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton de soumission */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="animate-spin w-5 h-5" />}
        {loading ? "Publication en cours..." : "Publier mon annonce"}
      </button>

      <p className="text-[11px] text-gray-500 text-center">
        En publiant, vous acceptez que votre annonce puisse être modérée avant
        mise en ligne.
      </p>
    </div>
  );
}
