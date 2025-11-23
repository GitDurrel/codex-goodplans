import { ArrowRight, Search } from "lucide-react";
import type { Listing } from "../../features/listings/types";
import { ListingCard } from "./ListingCard"; 
interface ListingsGridProps {
  title: string;
  listings: Listing[];
  loading: boolean;
  onSeeMore?: () => void;
  emptyMessage?: string;
}

export function ListingsGrid({
  title,
  listings,
  loading,
  onSeeMore,
  emptyMessage = "Aucune annonce trouvée",
}: ListingsGridProps) {
  return (
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center after:content-[''] after:ml-4 after:h-px after:w-12 after:bg-blue-200">
          {title}
        </h2>
        {onSeeMore && (
          <button
            onClick={onSeeMore}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-base font-medium transition-colors"
          >
            Voir plus <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                <div className="h-5 bg-gray-200 rounded-full w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          <p className="text-gray-500">Essayez d'ajuster vos filtres ou votre recherche.</p>
        </div>
      )}
    </section>
  );
}
