import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import type { ListingDetails } from "../types";
import { getCategoryLabel } from "../utils/categoryLabels";

interface ListingBreadcrumbsProps {
  listing: ListingDetails;
}

export function ListingBreadcrumbs({ listing }: ListingBreadcrumbsProps) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-slate-500">
      <Link to="/" className="inline-flex items-center gap-1 hover:text-slate-700">
        <Home className="h-4 w-4" />
        Accueil
      </Link>
      <ChevronRight className="h-4 w-4 text-slate-400" />
      <span className="inline-flex items-center gap-1 capitalize text-slate-600">
        {getCategoryLabel(listing.category)}
      </span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
      <span className="truncate font-medium text-slate-700">{listing.title}</span>
    </nav>
  );
}
