import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { Listing } from "../../../../features/listings/types";

const rentalPeriodLabels: Record<string, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  year: "an",
};

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-100"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={listing.images?.[0] || "https://placehold.co/600x400?text=Annonce"}
          alt={listing.title}
          className="w-full h-full object-cover"
        />

        {listing.status === "sold" ? (
          <span className="absolute top-2 left-2 px-3 py-1.5 rounded-full text-sm font-bold bg-red-900 text-white shadow-md z-10">
            Vendu
          </span>
        ) : listing.transaction_type ? (
          <span
            className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
              listing.transaction_type === "location"
                ? "bg-blue-600 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {listing.transaction_type === "location" ? "À louer" : "À vendre"}
          </span>
        ) : null}

        <span className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
          {listing.category}
        </span>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex-grow">
          <h3 className="font-medium text-base text-gray-800 line-clamp-1 hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 flex items-center mb-2">
            <MapPin className="mr-1 h-4 w-4" /> {listing.city}
          </p>
        </div>
        <div className="pt-2 border-t border-gray-100 mt-auto">
          <p className="text-blue-600 font-bold text-base">
            {listing.price.toLocaleString()} MAD
            {listing.transaction_type === "location" && listing.rental_period && (
              <span className="text-sm font-normal text-gray-500">
                /{rentalPeriodLabels[listing.rental_period] || listing.rental_period}
              </span>
            )}
          </p>
        </div>
      </div>
    </Link>
  );
}
