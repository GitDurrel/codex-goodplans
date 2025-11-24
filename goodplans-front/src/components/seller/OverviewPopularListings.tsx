import { Link } from "react-router-dom";
import { ChevronRight, Plus } from "lucide-react";
import { getCategoryLabel } from "../../features/listings/utils/categoryLabels";

export interface PopularListingCard {
  id: string;
  title: string;
  price: number;
  views: number;
  category: string;
}

interface Props {
  listings: PopularListingCard[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function OverviewPopularListings({ listings }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-medium text-gray-900">Annonces populaires</h2>
          <Link to="/seller/listings" className="text-sm text-primary hover:text-primary/80 flex items-center">
            Voir tout
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div key={listing.id} className="p-4 sm:p-6 hover:bg-gray-50">
              <Link to={`/listings/${listing.id}`} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-1">
                    {getCategoryLabel(listing.category)}
                  </span>
                  <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                  <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
                    <span className="truncate">{formatPrice(listing.price)}</span>
                    <span className="mx-1">•</span>
                    <span>{listing.views} vues</span>
                  </div>
                </div>
                <ChevronRight className="ml-4 h-5 w-5 text-gray-400 flex-shrink-0" />
              </Link>
            </div>
          ))
        ) : (
          <div className="p-4 sm:p-6 text-center">
            <p className="text-sm text-gray-500">Aucune annonce populaire pour le moment</p>
            <Link
              to="/seller/listings/create"
              className="mt-2 inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <Plus className="h-4 w-4 mr-1" />
              Publier une annonce
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
