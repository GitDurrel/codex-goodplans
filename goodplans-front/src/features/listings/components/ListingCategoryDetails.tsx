import { Bath, BedDouble, Gauge, Hammer, Ruler, Tag } from "lucide-react";
import type { JSX } from "react";
import type { ListingDetails } from "../types";
import { getCategoryLabel } from "../utils/categoryLabels";
import {
  useVehicleBrands,
  useVehicleModels,
} from "../../vehicle/apiVehicleCatalog";
import { useLanguage } from "../../../lib/language/LanguageContext";

interface ListingCategoryDetailsProps {
  listing: ListingDetails;
}

export function ListingCategoryDetails({ listing }: ListingCategoryDetailsProps) {
  const { lang, t } = useLanguage();
  const filters = listing.filters ?? {};

  // ---------- Mapping marque / modèle pour les véhicules ----------
  const brandId: string | undefined =
    (filters.brand as string) ||
    (filters.brand_id as string) ||
    undefined;

  const {
    data: vehicleBrands = [],
  } = useVehicleBrands();

  const {
    data: vehicleModels = [],
  } = useVehicleModels(brandId);

  const brandName =
    brandId &&
    (vehicleBrands?.find((b) => b.id === brandId)?.name || brandId);

  const modelId: string | undefined =
    (filters.model as string) ||
    (filters.model_id as string) ||
    undefined;

  const modelName =
    modelId &&
    (vehicleModels?.find((m) => m.id === modelId)?.name || modelId);


  const details: { label: string; value: string | number; icon: JSX.Element }[] = [];

  if (listing.category === "vehicle") {
    if (brandId) {
      details.push({
        label: t("listing.cat.vehicle.brand"),
        value: brandName || brandId,
        icon: <Tag className="h-4 w-4" />,
      });
    }
    if (modelId) {
      details.push({
        label: t("listing.cat.vehicle.model"),
        value: modelName || modelId,
        icon: <Tag className="h-4 w-4" />,
      });
    }
    if (filters.year) {
      details.push({
        label: t("listing.cat.vehicle.year"),
        value: filters.year,
        icon: <Gauge className="h-4 w-4" />,
      });
    }
    if (filters.mileage) {
      details.push({
        label: t("listing.cat.vehicle.mileage"),
        value: `${filters.mileage} km`,
        icon: <Gauge className="h-4 w-4" />,
      });
    }
  }


  if (listing.category === "real_estate") {
    if (filters.rooms) details.push({ label: t("listing.cat.realEstate.rooms"), value: filters.rooms, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.surface) details.push({ label: t("listing.cat.realEstate.surface"), value: `${filters.surface} m²`, icon: <Ruler className="h-4 w-4" /> });
    if (filters.bedrooms) details.push({ label: t("listing.cat.realEstate.bedrooms"), value: filters.bedrooms, icon: <BedDouble className="h-4 w-4" /> });
    if (filters.bathrooms) details.push({ label: t("listing.cat.realEstate.bathrooms"), value: filters.bathrooms, icon: <Bath className="h-4 w-4" /> });
  }

  if (listing.category === "services") {
    if (filters.service_type) details.push({ label: t("listing.cat.services.serviceType"), value: filters.service_type, icon: <Hammer className="h-4 w-4" /> });
    if (filters.experience_level)
      details.push({ label: t("listing.cat.services.experience"), value: filters.experience_level, icon: <Gauge className="h-4 w-4" /> });
  }

  if (listing.category === "craft") {
    if (filters.craft_type) details.push({ label: t("listing.cat.craft.type"), value: filters.craft_type, icon: <Tag className="h-4 w-4" /> });
    if (filters.material) details.push({ label: t("listing.cat.craft.material"), value: filters.material, icon: <Tag className="h-4 w-4" /> });
    if (filters.dimensions) details.push({ label: t("listing.cat.craft.dimensions"), value: filters.dimensions, icon: <Ruler className="h-4 w-4" /> });
  }

  if (details.length === 0) return null;

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm min-h-[220px]">
      <h2 className="mb-4 text-lg font-bold text-slate-900">{t("listing.cat.details")} {getCategoryLabel(listing.category, lang)}</h2>
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
