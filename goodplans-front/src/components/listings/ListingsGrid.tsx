// src/components/listings/ListingsGrid.tsx
import { ArrowRight, Search } from "lucide-react";
import type { Listing } from "../../features/listings/types";
import { ListingCard } from "./ListingCard";

interface ListingsGridProps {
  title: string;
  listings: Listing[];
  loading: boolean;

  /** clic CTA (Voir plus / Voir tout) */
  onSeeMore?: () => void;

  /** label CTA (ex: "Voir plus" ou "Voir tout") */
  seeMoreLabel?: string;

  /** cacher le CTA (ex: quand on affiche déjà tout) */
  hideSeeMore?: boolean;

  emptyMessage?: string;
}

export function ListingsGrid({
  title,
  listings,
  loading,
  onSeeMore,
  seeMoreLabel = "Voir plus",
  hideSeeMore = false,
  emptyMessage = "Aucune annonce trouvée",
}: ListingsGridProps) {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center after:content-[''] after:ml-4 after:h-px after:w-12 after:bg-blue-200">
          {title}
        </h2>

        {!hideSeeMore && onSeeMore && (
          <button
            type="button"
            onClick={onSeeMore}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm sm:text-base font-medium transition-colors"
          >
            {seeMoreLabel} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse h-full flex flex-col"
            >
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3 flex-1">
                <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                <div className="h-5 bg-gray-200 rounded-full w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
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
          <p className="text-gray-500">
            Essayez d&apos;ajuster vos filtres ou votre recherche.
          </p>
        </div>
      )}
    </section>
  );
}
