import { Bath, BedDouble, Gauge, Hammer, Ruler, Tag } from "lucide-react";
import type { JSX } from "react";
import type { ListingDetails } from "../types";
import { getCategoryLabel } from "../utils/categoryLabels";

interface ListingCategoryDetailsProps {
  listing: ListingDetails;
}

export function ListingCategoryDetails({ listing }: ListingCategoryDetailsProps) {
  const filters = listing.filters ?? {};

  const details: { label: string; value: string | number; icon: JSX.Element }[] = [];

  if (listing.category === "vehicle") {
    if (filters.brand) details.push({ label: "Marque", value: filters.brand, icon: <Tag className="h-4 w-4" /> });
    if (filters.model) details.push({ label: "Modèle", value: filters.model, icon: <Tag className="h-4 w-4" /> });
    if (filters.year) details.push({ label: "Année", value: filters.year, icon: <Gauge className="h-4 w-4" /> });
    if (filters.mileage) details.push({ label: "Kilométrage", value: `${filters.mileage} km`, icon: <Gauge className="h-4 w-4" /> });
  }

  if (listing.category === "real_estate") {
    if (filters.rooms) details.push({ label: "Pièces", value: filters.rooms, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.surface) details.push({ label: "Surface", value: `${filters.surface} m²`, icon: <Ruler className="h-4 w-4" /> });
    if (filters.bedrooms) details.push({ label: "Chambres", value: filters.bedrooms, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.bathrooms) details.push({ label: "Salles de bain", value: filters.bathrooms, icon: <Bath className="h-4 w-4" /> });
  }

  if (listing.category === "services") {
    if (filters.service_type) details.push({ label: "Type de service", value: filters.service_type, icon: <Hammer className="h-4 w-4" /> });
    if (filters.experience_level)
      details.push({ label: "Expérience", value: filters.experience_level, icon: <Gauge className="h-4 w-4" /> });
  }

  if (listing.category === "craft") {
    if (filters.craft_type) details.push({ label: "Type", value: filters.craft_type, icon: <Tag className="h-4 w-4" /> });
    if (filters.material) details.push({ label: "Matériau", value: filters.material, icon: <Tag className="h-4 w-4" /> });
    if (filters.dimensions) details.push({ label: "Dimensions", value: filters.dimensions, icon: <Ruler className="h-4 w-4" /> });
  }

  if (details.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-slate-900">Détails {getCategoryLabel(listing.category)}</h2>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {details.map((detail, idx) => (
          <div key={idx} className="rounded-xl bg-slate-50 px-3 py-3">
            <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
              {detail.icon}
              {detail.label}
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-900">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
