// src/features/listings/create/components/GeneralInfoStep.tsx

import { useEffect, useState, type ChangeEvent } from "react";
import { MapPin, Info, Pencil } from "lucide-react";
import { useLanguage } from "../../../../lib/language/LanguageContext";

interface GeneralInfoStepProps {
  values: {
    title: string;
    description: string;
    city: string;
    region: string;
  };
  onChange: (
    partial: Partial<{
      title: string;
      description: string;
      city: string;
      region: string;
    }>
  ) => void;
  onStepComplete?: (isComplete: boolean) => void;
}

/* ----------------------- Config API meta ----------------------- */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const LOCATIONS_META_URL = `${API_BASE_URL}/listings/filters/meta-locations`;

// ✅ Changez le type pour stocker les objets complets
type LocationsMeta = {
  cities: Array<{ id: string; name: string; region: string }>;
  regions: string[];
};

export function GeneralInfoStep({
  values,
  onChange,
  onStepComplete,
}: GeneralInfoStepProps) {

  const { t } = useLanguage();

  const { title, description, city, region } = values;

  const [locationsMeta, setLocationsMeta] = useState<LocationsMeta>({
    cities: [],
    regions: [],
  });
  const [loadingLocations, setLoadingLocations] = useState(false);

  // ✅ Charger les villes et régions au montage
  useEffect(() => {
    let cancelled = false;

    const loadLocations = async () => {
      try {
        setLoadingLocations(true);

        const response = await fetch(LOCATIONS_META_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const locJson = await response.json();

        if (!cancelled) {
          const rows = Array.isArray(locJson) ? locJson : [];

          // ✅ Gardez les objets complets, triés par nom
          const cities = rows.sort((a: any, b: any) =>
            a.name.localeCompare(b.name, "fr")
          );

          // ✅ Régions restent des strings
          const regions = Array.from(
            new Set(
              rows
                .map((r: any) => r?.region)
                .filter((v: any) => typeof v === "string" && v.trim())
                .map((v: string) => v.trim())
            )
          ).sort((a, b) => a.localeCompare(b, "fr"));

          setLocationsMeta({ cities, regions });
        }
      } catch (e) {
        console.error("Erreur chargement villes/régions", e);
      } finally {
        if (!cancelled) {
          setLoadingLocations(false);
        }
      }
    };

    void loadLocations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const isComplete =
      Boolean(title?.trim()) &&
      Boolean(description?.trim()) &&
      Boolean(city?.trim()) &&
      Boolean(region?.trim());

    onStepComplete?.(isComplete);
  }, [title, description, city, region, onStepComplete]);

  // ✅ Gérer la sélection de ville + auto-remplir la région
  function handleInput(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    if (name === "city") {
      // Trouver la ville sélectionnée pour récupérer sa région
      const selectedCity = locationsMeta.cities.find((c) => c.id === value);
      if (selectedCity) {
        onChange({
          city: value, // UUID
          region: selectedCity.region, // Nom de la région
        });
      } else {
        onChange({ city: value });
      }
    } else {
      onChange({ [name]: value });
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn">
      {/* Note d'info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 md:p-4 rounded-md shadow-sm animate-slideInUp">
        <div className="flex items-start">
          <Info className="h-4 w-4 md:h-5 md:w-5 text-blue-500 mt-0.5 mr-2 md:mr-3 flex-shrink-0" />
          <p className="text-blue-700 text-xs md:text-sm">
            {t("createListing.generalInfo.infoNote")}
          </p>
        </div>
      </div>

      {/* Titre + Description */}
      <div className="space-y-3 sm:space-y-4 md:space-y-6 animate-slideInUp">
        <div className="group">
          <label
            htmlFor="title"
            className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
          >
            {t("createListing.generalInfo.fields.title")} <span className="text-red-500">*</span>
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
              <Pencil className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={handleInput}
              placeholder={t("createListing.generalInfo.fields.titlePlaceholder")}
              className="block w-full pl-8 pr-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>
        </div>

        <div className="group">
          <label
            htmlFor="description"
            className="block text-xs md:text-sm font-medium text-gray-700 mb-1"
          >
            {t("createListing.generalInfo.fields.description")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInput}
            placeholder={t("createListing.generalInfo.fields.descriptionPlaceholder")}
            className="block w-full pl-4 pr-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-y text-sm"
            required
          />
        </div>
      </div>

      {/* Localisation */}
      <div className="space-y-3 sm:space-y-4 animate-slideInUp">
        <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          {t("createListing.generalInfo.fields.locationTitle")}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* ✅ Ville (select avec UUID comme value) */}
          <div className="group">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("createListing.generalInfo.fields.city")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="city"
                name="city"
                value={city}
                onChange={handleInput}
                className="block w-full pl-9 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white appearance-none"
                required
                disabled={loadingLocations}
              >
                <option value="">
                  {loadingLocations
                    ? t("createListing.generalInfo.fields.loading")
                    : t("createListing.generalInfo.fields.citySelect")}
                </option>
                {locationsMeta.cities.map((cityObj) => (
                  <option key={cityObj.id} value={cityObj.id}>
                    {cityObj.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ✅ Région (auto-remplie) */}
          <div className="group relative">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("createListing.generalInfo.fields.region")} <span className="text-red-500">*</span>
            </label>
            <select
              id="region"
              name="region"
              value={region}
              onChange={handleInput}
              className="block w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white appearance-none"
              required
              disabled={loadingLocations}
            >
              <option value="">
                {loadingLocations
                  ? t("createListing.generalInfo.fields.loading")
                  : t("createListing.generalInfo.fields.regionSelect")}
              </option>
              {locationsMeta.regions.map((regionOption) => (
                <option key={regionOption} value={regionOption}>
                  {regionOption}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none top-6">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}