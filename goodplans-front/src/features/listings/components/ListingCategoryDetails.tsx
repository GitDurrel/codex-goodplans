import { Bath, BedDouble, Gauge, Ruler, Tag } from "lucide-react";
import type { JSX } from "react";
import type { ListingDetails } from "../types";
import { getCategoryLabel } from "../utils/categoryLabels";

interface ListingCategoryDetailsProps {
  listing: ListingDetails;
}

export function ListingCategoryDetails({ listing }: ListingCategoryDetailsProps) {
  const filters = listing.filters ?? {};

  const badges: { label: string; icon: JSX.Element }[] = [];
  if (listing.category === "vehicle") {
    if (filters.brand) badges.push({ label: String(filters.brand), icon: <Tag className="h-4 w-4" /> });
    if (filters.model) badges.push({ label: String(filters.model), icon: <Tag className="h-4 w-4" /> });
    if (filters.year) badges.push({ label: `${filters.year}`, icon: <Gauge className="h-4 w-4" /> });
  }
  if (listing.category === "real_estate") {
    if (filters.rooms) badges.push({ label: `${filters.rooms} pièces`, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.surface) badges.push({ label: `${filters.surface} m²`, icon: <Ruler className="h-4 w-4" /> });
    if (filters.bedrooms) badges.push({ label: `${filters.bedrooms} chambres`, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.bathrooms) badges.push({ label: `${filters.bathrooms} sdb`, icon: <Bath className="h-4 w-4" /> });
  }
  if (listing.category === "services") {
    if (filters.service_type) badges.push({ label: String(filters.service_type), icon: <Tag className="h-4 w-4" /> });
    if (filters.experience_level)
      badges.push({ label: String(filters.experience_level), icon: <Gauge className="h-4 w-4" /> });
  }
  if (listing.category === "craft") {
    if (filters.craft_type) badges.push({ label: String(filters.craft_type), icon: <Tag className="h-4 w-4" /> });
    if (filters.material) badges.push({ label: String(filters.material), icon: <Tag className="h-4 w-4" /> });
    if (filters.dimensions) badges.push({ label: String(filters.dimensions), icon: <Ruler className="h-4 w-4" /> });
  }

  if (badges.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Détails {getCategoryLabel(listing.category)}</h2>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700"
          >
            {badge.icon}
            {badge.label}
          </span>
        ))}
      </div>
    </section>
  );
}
