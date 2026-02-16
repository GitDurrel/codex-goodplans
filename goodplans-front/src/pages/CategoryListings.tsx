// src/pages/CategoryListings.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import type { Listing } from "../features/listings/types";

import {
  ArrowLeft,
  Filter,
  Clock,
  CreditCard,
  ArrowUp,
  ArrowDown,
  Home,
  Car,
  Briefcase,
  Palette,
  Loader2,
} from "lucide-react";

import {
  fetchCategoryListings,
  fetchPublicListings,
} from "../features/listings/apiListings";
import {
  mapUiCategoryToApi,
  mapUiTransactionToApi,
} from "../features/listings/utils/mappers";
import { ListingsGrid } from "../components/listings/ListingsGrid";
import {
  fetchCategoriesTree,
  type CategoryWithSubcategories,
} from "../features/categories/apiCategorie";
import {
  useVehicleBrands,
  useVehicleModels,
} from "../features/vehicle/apiVehicleCatalog"; //

/* ----------------------- Config API meta ----------------------- */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const LOCATIONS_META_URL = `${API_BASE_URL}/listings/filters/meta-locations`;

type LocationsMeta = {
  cities: string[];
  regions: string[];
};

/* ----------------------- Types filtres UI ----------------------- */

type TransactionTypeUi = "achat" | "location";
type BoolString = "" | "yes";

type UiFilters = {
  // génériques
  city: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  transaction_type: "" | TransactionTypeUi;

  // --- Immobilier ---
  property_type: string;
  surface: string; // UI: surface min
  bedrooms: string; // UI: chambres min
  bathrooms: string; // UI: sdb min
  furnished: BoolString;
  garden: BoolString;
  pool: BoolString;
  garage: BoolString;

  // --- Véhicule ---
  brand_id: string;
  model_id: string;
  year: string; // année min
  mileage: string; // km max

  // --- Services ---
  service_type: string;
  experience_level: string;
  home_service: BoolString;

  // --- Artisanat ---
  craft_type: string;
  material: string;
  handmade: BoolString;
  authentic: BoolString;
  vintage: BoolString;
};

interface LocationState {
  // Filtres passés depuis la création d’annonce (SpecificDetailsStep)
  filters?: Record<string, any>;
}

/* ----------------------- Config UI par catégorie ----------------------- */

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
  immobilier: { label: "Immobilier", icon: Home },
  real_estate: { label: "Immobilier", icon: Home },
  vehicules: { label: "Véhicules", icon: Car },
  vehicle: { label: "Véhicules", icon: Car },
  services: { label: "Services", icon: Briefcase },
  service: { label: "Services", icon: Briefcase },
  artisanat: { label: "Artisanat", icon: Palette },
  craft: { label: "Artisanat", icon: Palette },
};

const DEFAULT_UI_FILTERS: UiFilters = {
  city: "",
  region: "",
  minPrice: "",
  maxPrice: "",
  transaction_type: "",

  // immo
  property_type: "",
  surface: "",
  bedrooms: "",
  bathrooms: "",
  furnished: "",
  garden: "",
  pool: "",
  garage: "",

  // véhicule
  brand_id: "",
  model_id: "",
  year: "",
  mileage: "",

  // services
  service_type: "",
  experience_level: "",
  home_service: "",

  // artisanat
  craft_type: "",
  material: "",
  handmade: "",
  authentic: "",
  vintage: "",
};

const BOOL_KEYS: (keyof UiFilters)[] = [
  "furnished",
  "garden",
  "pool",
  "garage",
  "home_service",
  "handmade",
  "authentic",
  "vintage",
];

const KNOWN_UI_KEYS: (keyof UiFilters)[] = [
  "city",
  "region",
  "minPrice",
  "maxPrice",
  "transaction_type",
  "property_type",
  "surface",
  "bedrooms",
  "bathrooms",
  "furnished",
  "garden",
  "pool",
  "garage",
  "brand_id",
  "model_id",
  "year",
  "mileage",
  "service_type",
  "experience_level",
  "home_service",
  "craft_type",
  "material",
  "handmade",
  "authentic",
  "vintage",
];

const knownUiKeySet = new Set<string>(KNOWN_UI_KEYS as string[]);

function toBoolString(v: any): BoolString {
  return v === true || v === "true" ? "yes" : "";
}

/**
 * Sépare les filtres d’UI (affichés dans la sidebar)
 * et les filtres "extra" injectés depuis SpecificDetailsStep.
 */
function splitFilters(
  raw?: Record<string, any>
): { ui: UiFilters; extra: Record<string, any> } {
  if (!raw) return { ui: { ...DEFAULT_UI_FILTERS }, extra: {} };

  const ui: UiFilters = { ...DEFAULT_UI_FILTERS };
  const extra: Record<string, any> = {};

  Object.entries(raw).forEach(([key, value]) => {
    if (!knownUiKeySet.has(key)) {
      extra[key] = value;
      return;
    }

    const k = key as keyof UiFilters;

    if (BOOL_KEYS.includes(k)) {
      ui[k] = toBoolString(value) as any;
      return;
    }

    if (k === "minPrice" || k === "maxPrice") {
      ui[k] = value != null ? String(value) : "";
      return;
    }

    if (["surface", "year", "mileage", "bedrooms", "bathrooms"].includes(key)) {
      ui[
        k as "surface" | "year" | "mileage" | "bedrooms" | "bathrooms"
      ] = value != null ? String(value) : "";
      return;
    }

    ui[k] = (value ?? "") as any;
  });

  return { ui, extra };
}

/* ------------------------------ Page ------------------------------ */

export default function CategoryListings() {
  const { category: routeCategory } = useParams<{ category: string }>();
  const location = useLocation();
  const locationState = (location.state ?? null) as LocationState | null;

  const { ui: initialUiFilters, extra: extraFilters } = useMemo(
    () => splitFilters(locationState?.filters),
    [locationState]
  );

  const [filters, setFilters] = useState<UiFilters>(initialUiFilters);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<"date" | "price">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const uiCategory = routeCategory || "";
  const apiCategory = useMemo(
    () => mapUiCategoryToApi(uiCategory) || uiCategory,
    [uiCategory]
  );

  const categoryConfig =
    CATEGORY_CONFIG[uiCategory] || CATEGORY_CONFIG[apiCategory] || null;

  /* ------------ Métadonnées villes / régions / sous-catégories ------------ */

  const [locationsMeta, setLocationsMeta] = useState<LocationsMeta>({
    cities: [],
    regions: [],
  });
  const [loadingLocations, setLoadingLocations] = useState(false);

  const [categoriesTree, setCategoriesTree] = useState<
    CategoryWithSubcategories[]
  >([]);
  const [loadingTaxonomies, setLoadingTaxonomies] = useState(false);

  useEffect(() => {
  let cancelled = false;

  const loadMeta = async () => {
    try {
      setLoadingLocations(true);
      setLoadingTaxonomies(true);

      const [locRes, cats] = await Promise.all([
        fetch(LOCATIONS_META_URL),
        fetchCategoriesTree(),
      ]);

      if (!locRes.ok) {
        throw new Error(`HTTP ${locRes.status}`);
      }

      const locJson = await locRes.json(); // ✅ C'est un tableau d'objets { id, name, region }

      if (!cancelled) {
        // ✅ Transformation des données
        const rows = Array.isArray(locJson) ? locJson : [];

        const cities = Array.from(
          new Set(
            rows
              .map((r: any) => r?.name)
              .filter((v: any) => typeof v === "string" && v.trim())
              .map((v: string) => v.trim())
          )
        ).sort((a, b) => a.localeCompare(b, "fr"));

        const regions = Array.from(
          new Set(
            rows
              .map((r: any) => r?.region)
              .filter((v: any) => typeof v === "string" && v.trim())
              .map((v: string) => v.trim())
          )
        ).sort((a, b) => a.localeCompare(b, "fr"));

        setLocationsMeta({ cities, regions });
        setCategoriesTree(cats || []);
      }
    } catch (e) {
      console.error(
        "Erreur chargement métadonnées (locations / catégories)",
        e
      );
    } finally {
      if (!cancelled) {
        setLoadingLocations(false);
        setLoadingTaxonomies(false);
      }
    }
  };

  void loadMeta();

  return () => {
    cancelled = true;
  };
}, []);

  const sortedCities = useMemo(
    () => [...locationsMeta.cities].sort((a, b) => a.localeCompare(b, "fr")),
    [locationsMeta.cities]
  );

  const sortedRegions = useMemo(
    () => [...locationsMeta.regions].sort((a, b) => a.localeCompare(b, "fr")),
    [locationsMeta.regions]
  );

  // ---------- Catalogues véhicule : marques + modèles ----------
  const {
    data: vehicleBrands = [],
    loading: loadingBrands,
  } = useVehicleBrands();

  const selectedBrandId: string | undefined = filters.brand_id || undefined;

  const {
    data: vehicleModels = [],
    loading: loadingModels,
  } = useVehicleModels(selectedBrandId);

  // Sous-catégories par catégorie (pour les selects property_type / service_type / craft_type)
  const realEstateCategory = useMemo(
    () => categoriesTree.find((c) => c.slug === "real_estate"),
    [categoriesTree]
  );
  const serviceCategory = useMemo(
    () => categoriesTree.find((c) => c.slug === "service"),
    [categoriesTree]
  );
  const craftCategory = useMemo(
    () => categoriesTree.find((c) => c.slug === "craft"),
    [categoriesTree]
  );

  const realEstateSubcategories = useMemo(
    () => realEstateCategory?.subcategories ?? [],
    [realEstateCategory]
  );
  const serviceSubcategories = useMemo(
    () => serviceCategory?.subcategories ?? [],
    [serviceCategory]
  );
  const craftSubcategories = useMemo(
    () => craftCategory?.subcategories ?? [],
    [craftCategory]
  );

  /* --------------------------- Compteur de filtres --------------------------- */

  const totalActiveFilters = useMemo(() => {
    let count = 0;

    // génériques
    if (filters.city.trim()) count++;
    if (filters.region.trim()) count++;
    if (filters.minPrice.trim()) count++;
    if (filters.maxPrice.trim()) count++;
    if (filters.transaction_type) count++;

    // immo
    if (filters.property_type.trim()) count++;
    if (filters.surface.trim()) count++;
    if (filters.bedrooms.trim()) count++;
    if (filters.bathrooms.trim()) count++;
    if (filters.furnished) count++;
    if (filters.garden) count++;
    if (filters.pool) count++;
    if (filters.garage) count++;

    // véhicule
    if (filters.brand_id.trim()) count++;
    if (filters.model_id.trim()) count++;
    if (filters.year.trim()) count++;
    if (filters.mileage.trim()) count++;

    // services
    if (filters.service_type.trim()) count++;
    if (filters.experience_level.trim()) count++;
    if (filters.home_service) count++;

    // artisanat
    if (filters.craft_type.trim()) count++;
    if (filters.material.trim()) count++;
    if (filters.handmade) count++;
    if (filters.authentic) count++;
    if (filters.vintage) count++;

    return count;
  }, [filters]);

  /* -------------------------- Chargement listings -------------------------- */

  useEffect(() => {
    const loadListings = async () => {
      if (!apiCategory) return;

      try {
        setIsLoading(true);
        setError(null);

        // Base : filtres extra venant de la création d’annonce
        const apiFilters: Record<string, any> = {
          ...extraFilters,
        };

        // ----- Filtres génériques -----
        if (filters.city.trim()) apiFilters.city = filters.city.trim();
        if (filters.region.trim()) apiFilters.region = filters.region.trim();

        if (filters.minPrice.trim())
          apiFilters.minPrice = Number(filters.minPrice.trim());
        if (filters.maxPrice.trim())
          apiFilters.maxPrice = Number(filters.maxPrice.trim());

        if (filters.transaction_type) {
          const apiTx = mapUiTransactionToApi(filters.transaction_type);
          if (apiTx) apiFilters.transaction_type = apiTx; // "sale" / "rent"
        }

        // ----- Filtres spécifiques IMMOBILIER -----
        if (apiCategory === "real_estate") {
          if (filters.property_type.trim())
            apiFilters.property_type = filters.property_type.trim();

          // UI: surface min -> DTO: minSurface
          if (filters.surface.trim())
            apiFilters.minSurface = Number(filters.surface.trim());

          // UI: chambres min -> DTO: minBedrooms
          if (filters.bedrooms.trim())
            apiFilters.minBedrooms = Number(filters.bedrooms.trim());

          // UI: sdb min -> DTO: minBathrooms
          if (filters.bathrooms.trim())
            apiFilters.minBathrooms = Number(filters.bathrooms.trim());

          if (filters.furnished) apiFilters.furnished = true;
          if (filters.garden) apiFilters.garden = true;
          if (filters.pool) apiFilters.pool = true;
          if (filters.garage) apiFilters.garage = true;

          if (apiFilters.transaction_type === "rent") {
            apiFilters.onlyRental = true;
          }
        }

        // ----- VÉHICULE -----
        if (apiCategory === "vehicle") {
          if (filters.brand_id.trim())
            apiFilters.brand_id = filters.brand_id.trim();
          if (filters.model_id.trim())
            apiFilters.model_id = filters.model_id.trim();

          // UI: année min -> DTO: minYear
          if (filters.year.trim())
            apiFilters.minYear = Number(filters.year.trim());

          // UI: km max -> DTO: maxMileage
          if (filters.mileage.trim())
            apiFilters.maxMileage = Number(filters.mileage.trim());

          if (apiFilters.transaction_type === "rent") {
            apiFilters.onlyRental = true;
          }
        }

        // ----- SERVICES -----
        if (apiCategory === "service") {
          if (filters.service_type.trim())
            apiFilters.service_type = filters.service_type.trim();
          if (filters.experience_level.trim())
            apiFilters.experience_level = filters.experience_level.trim();
          if (filters.home_service) apiFilters.home_service = true;
        }

        // ----- ARTISANAT -----
        if (apiCategory === "craft") {
          if (filters.craft_type.trim())
            apiFilters.craft_type = filters.craft_type.trim();
          if (filters.material.trim())
            apiFilters.material = filters.material.trim();
          if (filters.handmade) apiFilters.handmade = true;
          if (filters.authentic) apiFilters.authentic = true;
          if (filters.vintage) apiFilters.vintage = true;
        }

        // ----- Appel API -----
        let data: Listing[];

        const isSpecificEndpoint =
          apiCategory === "real_estate" ||
          apiCategory === "vehicle" ||
          apiCategory === "service" ||
          apiCategory === "craft";

        if (isSpecificEndpoint) {
          // route spécifique SANS param "category"
          data = await fetchCategoryListings(
            apiCategory as "real_estate" | "vehicle" | "service" | "craft",
            apiFilters
          );
        } else {
          // route générique AVEC category
          data = await fetchPublicListings({
            ...apiFilters,
            category: apiCategory,
          });
        }

        let result = [...(data ?? [])];

        // Tri côté front
        if (sortBy === "date") {
          result.sort((a, b) => {
            const da = a.created_at ? new Date(a.created_at).getTime() : 0;
            const db = b.created_at ? new Date(b.created_at).getTime() : 0;
            return sortOrder === "asc" ? da - db : db - da;
          });
        } else if (sortBy === "price") {
          result.sort((a, b) => {
            const pa = a.price ?? 0;
            const pb = b.price ?? 0;
            return sortOrder === "asc" ? pa - pb : pb - pa;
          });
        }

        setListings(result);
      } catch (err: any) {
        console.error("Error fetching category listings:", err);
        setError(
          err?.message ||
            "Erreur lors du chargement des annonces de la catégorie."
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadListings();
  }, [apiCategory, extraFilters, sortBy, sortOrder, filters]);

  /* -------------------------- Handlers UI -------------------------- */

  const handleSortChange = (newSortBy: "date" | "price") => {
    if (sortBy === newSortBy) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(newSortBy);
      setSortOrder(newSortBy === "price" ? "asc" : "desc");
    }
  };

  const handleFilterChange = (name: keyof UiFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleBoolFilter = (name: keyof UiFilters) => {
    setFilters((prev) => ({
      ...prev,
      [name]: prev[name] ? "" : ("yes" as BoolString),
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_UI_FILTERS);
    // extraFilters restent appliqués.
  };

  /* ------------------------------ Render ------------------------------ */

  if (!apiCategory || !categoryConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800">
            Catégorie non trouvée
          </h2>
          <p className="mt-2 text-gray-600">
            La catégorie que vous recherchez n&apos;existe pas.
          </p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  const Icon = categoryConfig.icon;

  /* ------ Rendus des filtres spécifiques (UI, pas API) ------ */

  const renderRealEstateFilters = () => {
    const subs = [...realEstateSubcategories].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    return (
      <>
        {/* Type de bien (sous-catégories / property_type) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de bien
          </label>
          {loadingTaxonomies ? (
            <div className="text-xs text-gray-500">
              Chargement des types de biens...
            </div>
          ) : subs.length > 0 ? (
            <select
              value={filters.property_type}
              onChange={(e) =>
                handleFilterChange("property_type", e.target.value)
              }
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tous les types</option>
              {subs.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filters.property_type}
              onChange={(e) =>
                handleFilterChange("property_type", e.target.value)
              }
              placeholder="Appartement, maison..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surface min (m²)
            </label>
            <input
              type="number"
              value={filters.surface}
              onChange={(e) => handleFilterChange("surface", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chambres min.
            </label>
            <input
              type="number"
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Salles de bain min.
          </label>
          <input
            type="number"
            value={filters.bathrooms}
            onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => toggleBoolFilter("furnished")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.furnished
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Meublé
          </button>
          <button
            type="button"
            onClick={() => toggleBoolFilter("garden")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.garden
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Jardin
          </button>
          <button
            type="button"
            onClick={() => toggleBoolFilter("pool")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.pool
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Piscine
          </button>
          <button
            type="button"
            onClick={() => toggleBoolFilter("garage")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.garage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Garage
          </button>
        </div>
      </>
    );
  };

  const renderVehicleFilters = () => (
    <>
      {/* Marque */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Marque
        </label>

        {loadingBrands ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des marques...
          </div>
        ) : (
          <select
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            value={filters.brand_id}
            onChange={(e) => {
              const brandId = e.target.value;
              setFilters((prev) => ({
                ...prev,
                brand_id: brandId,
                model_id: "", // reset modèle si on change de marque
              }));
            }}
          >
            <option value="">Toutes les marques</option>
            {(vehicleBrands || []).map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Modèle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Modèle
        </label>

        {!filters.brand_id ? (
          <p className="text-xs text-gray-500">
            Sélectionnez d&apos;abord une marque.
          </p>
        ) : loadingModels ? (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement des modèles...
          </div>
        ) : (
          <select
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            value={filters.model_id}
            onChange={(e) => handleFilterChange("model_id", e.target.value)}
          >
            <option value="">Tous les modèles</option>
            {(vehicleModels || []).map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Année min.
          </label>
          <input
            type="number"
            value={filters.year}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Km max.
          </label>
          <input
            type="number"
            value={filters.mileage}
            onChange={(e) => handleFilterChange("mileage", e.target.value)}
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
    </>
  );

  const renderServiceFilters = () => {
    const subs = [...serviceSubcategories].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de service
          </label>
          {loadingTaxonomies ? (
            <div className="text-xs text-gray-500">
              Chargement des types de services...
            </div>
          ) : subs.length > 0 ? (
            <select
              value={filters.service_type}
              onChange={(e) =>
                handleFilterChange("service_type", e.target.value)
              }
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tous les types</option>
              {subs.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filters.service_type}
              onChange={(e) =>
                handleFilterChange("service_type", e.target.value)
              }
              placeholder="Ménage, babysitting..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d&apos;expérience
          </label>
          <input
            type="text"
            value={filters.experience_level}
            onChange={(e) =>
              handleFilterChange("experience_level", e.target.value)
            }
            placeholder="Débutant, confirmé..."
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={() => toggleBoolFilter("home_service")}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            filters.home_service
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Service à domicile
        </button>
      </>
    );
  };

  const renderCraftFilters = () => {
    const subs = [...craftSubcategories].sort((a, b) =>
      a.name.localeCompare(b.name, "fr")
    );

    return (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type d&apos;artisanat
          </label>
          {loadingTaxonomies ? (
            <div className="text-xs text-gray-500">
              Chargement des types d&apos;artisanat...
            </div>
          ) : subs.length > 0 ? (
            <select
              value={filters.craft_type}
              onChange={(e) =>
                handleFilterChange("craft_type", e.target.value)
              }
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
            >
              <option value="">Tous les types</option>
              {subs.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={filters.craft_type}
              onChange={(e) =>
                handleFilterChange("craft_type", e.target.value)
              }
              placeholder="Poterie, textile..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matériau
          </label>
          <input
            type="text"
            value={filters.material}
            onChange={(e) => handleFilterChange("material", e.target.value)}
            placeholder="Bois, cuir..."
            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => toggleBoolFilter("handmade")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.handmade
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Fait main
          </button>
          <button
            type="button"
            onClick={() => toggleBoolFilter("authentic")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.authentic
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Authentique
          </button>
          <button
            type="button"
            onClick={() => toggleBoolFilter("vintage")}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              filters.vintage
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Vintage
          </button>
        </div>
      </>
    );
  };

  const renderSpecificFilters = () => {
    if (apiCategory === "real_estate") return renderRealEstateFilters();
    if (apiCategory === "vehicle") return renderVehicleFilters();
    if (apiCategory === "service") return renderServiceFilters();
    if (apiCategory === "craft") return renderCraftFilters();
    return null;
  };

  /* ------------------- JSX principal ------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-blue-600" />
                <h1 className="text-lg font-semibold text-gray-900">
                  {categoryConfig.label}
                </h1>
              </div>
            </div>

            {/* Mobile filter button */}
            <button
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="h-4 w-4" />
              Filtres
              {totalActiveFilters > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalActiveFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filtres</h3>
                {totalActiveFilters > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-blue-600 text-sm hover:underline transition"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Toutes les villes</option>
                    {sortedCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {loadingLocations && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Chargement des villes...
                    </p>
                  )}
                </div>

                {/* Région */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Région
                  </label>
                  <select
                    value={filters.region}
                    onChange={(e) =>
                      handleFilterChange("region", e.target.value)
                    }
                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                  >
                    <option value="">Toutes les régions</option>
                    {sortedRegions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                  {loadingLocations && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      Chargement des régions...
                    </p>
                  )}
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (MAD)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange("minPrice", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange("maxPrice", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                {(apiCategory === "real_estate" ||
                  apiCategory === "vehicle") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de transaction
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleFilterChange(
                            "transaction_type",
                            filters.transaction_type === "location"
                              ? ""
                              : "location"
                          )
                        }
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.transaction_type === "location"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Location
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleFilterChange(
                            "transaction_type",
                            filters.transaction_type === "achat" ? "" : "achat"
                          )
                        }
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          filters.transaction_type === "achat"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        Achat
                      </button>
                    </div>
                  </div>
                )}

                {/* Filtres spécifiques */}
                {renderSpecificFilters()}
              </div>
            </div>
          </div>

          {/* Mobile filter drawer */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col">
                <div className="px-4 py-5 border-b flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Filtres</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Ville */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ville
                    </label>
                    <select
                      value={filters.city}
                      onChange={(e) =>
                        handleFilterChange("city", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="">Toutes les villes</option>
                      {sortedCities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Région */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Région
                    </label>
                    <select
                      value={filters.region}
                      onChange={(e) =>
                        handleFilterChange("region", e.target.value)
                      }
                      className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                    >
                      <option value="">Toutes les régions</option>
                      {sortedRegions.map((region) => (
                        <option key={region} value={region}>
                          {region}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Prix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix (MAD)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          handleFilterChange("minPrice", e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          handleFilterChange("maxPrice", e.target.value)
                        }
                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {(apiCategory === "real_estate" ||
                    apiCategory === "vehicle") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de transaction
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleFilterChange(
                              "transaction_type",
                              filters.transaction_type === "location"
                                ? ""
                                : "location"
                            )
                          }
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            filters.transaction_type === "location"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Location
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleFilterChange(
                              "transaction_type",
                              filters.transaction_type === "achat"
                                ? ""
                                : "achat"
                            )
                          }
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            filters.transaction_type === "achat"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          Achat
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filtres spécifiques */}
                  {renderSpecificFilters()}
                </div>

                <div className="p-4 border-t flex justify-between items-center gap-3">
                  {totalActiveFilters > 0 && (
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  )}
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Voir {listings.length} résultat
                    {listings.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Listings */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort controls */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Trier par :
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSortChange("date")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        sortBy === "date"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Date
                      {sortBy === "date" &&
                        (sortOrder === "desc" ? (
                          <ArrowDown className="h-3.5 w-3.5 ml-1" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5 ml-1" />
                        ))}
                    </button>
                    <button
                      onClick={() => handleSortChange("price")}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        sortBy === "price"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <CreditCard className="h-3.5 w-3.5" />
                      Prix
                      {sortBy === "price" &&
                        (sortOrder === "asc" ? (
                          <ArrowUp className="h-3.5 w-3.5 ml-1" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 ml-1" />
                        ))}
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  {isLoading
                    ? "Chargement..."
                    : `${listings.length} résultat${
                        listings.length !== 1 ? "s" : ""
                      }`}
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl shadow-sm text-sm">
                {error}
              </div>
            )}

            <ListingsGrid
              title="Résultats"
              listings={listings}
              loading={isLoading}
              emptyMessage="Aucune annonce ne correspond à vos filtres."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
