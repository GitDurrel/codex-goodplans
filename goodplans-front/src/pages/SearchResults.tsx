// src/pages/SearchResults.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  SlidersHorizontal,
  X,
  Building2,
  Car,
  Briefcase,
  Palette,
  Star,
  ArrowRight,
} from "lucide-react";

import type { Listing } from "../features/listings/types";
import { fetchPublicListings } from "../features/listings/apiListings";
import {
  mapUiCategoryToApi,
  mapUiTransactionToApi,
} from "../features/listings/utils/mappers";
import { ListingsGrid } from "../components/listings/ListingsGrid";
import { usePromoBanners } from "../features/promo-banners/usePromoBanners";
import {
  fetchCategoriesTree,
  type CategoryWithSubcategories,
} from "../features/categories/apiCategorie";
import { PromoBannerPicture } from "../components/PromoBannerPicture";
import { useLanguage } from "../lib/language/LanguageContext";

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

type SearchFilters = {
  category: string; // UI: immobilier / vehicules / services / artisanat
  city: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  transaction_type: "" | TransactionTypeUi;
};

/* ----------------------- Page SearchResults ----------------------- */

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromUrl = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "";
  const cityFromUrl = searchParams.get("city") || "";
  const regionFromUrl = searchParams.get("region") || "";
  const minPriceFromUrl = searchParams.get("minPrice") || "";
  const maxPriceFromUrl = searchParams.get("maxPrice") || "";
  const txFromUrl =
    (searchParams.get("transactionType") as TransactionTypeUi | null) || "";

  const [searchQuery, setSearchQuery] = useState<string>(queryFromUrl);

  const [filters, setFilters] = useState<SearchFilters>({
    category: categoryFromUrl,
    city: cityFromUrl,
    region: regionFromUrl,
    minPrice: minPriceFromUrl,
    maxPrice: maxPriceFromUrl,
    transaction_type: txFromUrl,
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showFilters, setShowFilters] = useState(false);

  const { t, lang } = useLanguage();


  /* ------------ Métadonnées villes / régions ------------ */

  const [locationsMeta, setLocationsMeta] = useState<LocationsMeta>({
    cities: [],
    regions: [],
  });
  const [categoriesTree, setCategoriesTree] = useState<CategoryWithSubcategories[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false); // ✅ Corrigé
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

        const locJson = await locRes.json();

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
          setCategoriesTree(cats || []); // ✅ Assurez-vous que cette ligne est présente
        }
      } catch (e) {
        console.error("Erreur chargement métadonnées (locations / catégories)", e);
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

  /* ------------------------- Encarts bannière recherche ------------------------- */

  const { banners: searchBanners } = usePromoBanners("searchPage");
  const searchBanner = searchBanners[0] ?? null;

  /* ------------------------- Fetch listings ------------------------- */

  useEffect(() => {
    const loadListings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const apiCategory =
          (filters.category && mapUiCategoryToApi(filters.category)) ||
          undefined;

        const apiFilters: Record<string, any> = {};

        if (apiCategory) {
          apiFilters.category = apiCategory;
        }

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

        // Appel API générique
        const data = await fetchPublicListings(apiFilters);

        // Filtre texte côté front (titre + description + ville)
        let result = [...(data ?? [])];
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          result = result.filter((l) => {
            const title = l.title?.toLowerCase() ?? "";
            const desc = (l.description as string | null)?.toLowerCase() ?? "";
            const city = l.city?.toLowerCase() ?? "";
            return (
              title.includes(q) || desc.includes(q) || city.includes(q)
            );
          });
        }

        setListings(result);
      } catch (err: any) {
        console.error("Erreur chargement résultats recherche:", err);
        setError(
          err?.message || "Erreur lors du chargement des annonces de recherche."
        );
        setListings([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadListings();

    // Sync URL params
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (filters.category) params.set("category", filters.category);
    if (filters.city) params.set("city", filters.city);
    if (filters.region) params.set("region", filters.region);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (
      filters.transaction_type &&
      (filters.category === "immobilier" || filters.category === "vehicules")
    ) {
      params.set("transactionType", filters.transaction_type);
    }

    setSearchParams(params, { replace: true });
  }, [filters, searchQuery, setSearchParams]);

  // si l'URL change (back/forward), on resynchronise la query
  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  /* ------------------------ Helpers UI ------------------------ */

  const handleFilterChange = (name: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const next: SearchFilters = { ...prev, [name]: value } as SearchFilters;

      // Si on change la catégorie et que ce n'est plus immo / véhicules
      // on reset le type de transaction
      if (
        name === "category" &&
        value !== "immobilier" &&
        value !== "vehicules"
      ) {
        next.transaction_type = "";
      }

      return next;
    });
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      city: "",
      region: "",
      minPrice: "",
      maxPrice: "",
      transaction_type: "",
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // tout est déjà géré par l’effet
  };

  /* --------------------------- Rendu --------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de recherche en haut */}
      <div className="top-0 z-20 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <Link
              to="/"
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="w-full py-2.5 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="p-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </form>

          {/* Catégories en grille 2x2 */}
          <div className="px-1 pt-3 pb-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "immobilier", icon: Building2 },
                { id: "vehicules", icon: Car },
                { id: "services", icon: Briefcase },
                { id: "artisanat", icon: Palette },
              ]
                .map((cat) => {
                  const Icon = cat.icon;
                  const active = filters.category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        handleFilterChange(
                          "category",
                          active ? "" : (cat.id as SearchFilters["category"])
                        )
                      }
                      className={`flex flex-col items-center p-3 rounded-xl border shadow-sm transition-all ${active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50"
                        }`}
                    >
                      <Icon
                        className={`h-7 w-7 mb-1 ${active ? "text-blue-500" : "text-gray-500"
                          }`}
                      />
                      <span className="text-xs text-center font-medium">
                        {t(`categories.${cat.id}`)}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Bannière pub sous la barre de recherche (version horizontale) */}
          {searchBanner && (
            <section className="mt-4">
              <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.25)]">
                {/* IMPORTANT: ratio 1200x400 => 3/1 */}
                <div className="relative w-full aspect-square sm:aspect-[3/1]">

                  <PromoBannerPicture
                    desktopSrc={searchBanner.image_desktop}
                    mobileSrc={searchBanner.image_mobile || searchBanner.image_desktop}
                    alt={searchBanner.title || "Encart publicitaire"}
                    className="absolute inset-0 h-full w-full"
                  />
                  {/* Overlay (même style que carousel) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent" />

                  {/* Badge sponsorisé */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="opacity-90">{t("search.sponsored")}</span>
                    </span>
                  </div>

                  {/* Contenu (compact) */}
                  <div className="relative z-10 flex h-full items-end sm:items-center px-4 py-4 sm:px-8 sm:py-6">
                    <div className="max-w-xl space-y-2 sm:space-y-3 text-white">
                      <h3 className="text-lg sm:text-2xl font-extrabold leading-tight drop-shadow-sm line-clamp-2">
                        {searchBanner.title}
                      </h3>

                      {searchBanner.description && (
                        <p className="hidden sm:block text-sm text-slate-100/90 line-clamp-2">
                          {searchBanner.description}
                        </p>
                      )}

                      <a
                        href={searchBanner.link_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900"
                      >
                        {t("search.discover")}
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}


        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        {/* Résumé de la recherche + chips filtres */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {searchQuery ? (
              <>
                {listings.length}{" "}
                {listings.length > 1
                  ? t("search.resultsForPlural")
                  : t("search.resultsFor")}{" "}
                "{searchQuery}"
              </>
            ) : (
              <>
                {t("search.allListings")} ({listings.length})
              </>
            )}
          </h1>


          <div className="flex flex-wrap gap-2 mt-3 text-xs sm:text-sm">
            {/* Chips filtres */}
            {filters.category && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {t(`categories.${mapUiCategoryToApi(filters.category)}`)}
                <button
                  onClick={() => handleFilterChange("category", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.city && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {t("search.city")} : {filters.city}
                <button
                  onClick={() => handleFilterChange("city", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.region && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {t("search.region")} : {filters.region}
                <button
                  onClick={() => handleFilterChange("region", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.minPrice && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {t("search.min")} : {filters.minPrice} MAD
                <button
                  onClick={() => handleFilterChange("minPrice", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.maxPrice && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {t("search.max")} : {filters.maxPrice} MAD
                <button
                  onClick={() => handleFilterChange("maxPrice", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {filters.transaction_type && (
              <div className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {filters.transaction_type === "location" ? t("filters.rent") : t("filters.buy")}
                <button
                  onClick={() => handleFilterChange("transaction_type", "")}
                  className="ml-1.5 text-blue-500 hover:text-blue-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {(filters.category ||
              filters.city ||
              filters.region ||
              filters.minPrice ||
              filters.maxPrice ||
              filters.transaction_type) && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {t("search.resetFilters")}
                </button>
              )}
          </div>
        </div>

        {/* Résultats via ListingsGrid + ListingCard existant */}
        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm">
            {error}
          </div>
        ) : (
          <ListingsGrid
            title={t("search.resultsTitle")}
            listings={listings}
            loading={isLoading}
            emptyMessage={t("search.noResults")}
          />
        )}
      </div>

      {/* Modal filtres mobile */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-xl">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{t("filters.title")}</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Ville */}
              <div>
                <h3 className="font-medium mb-2 text-gray-700">{t("search.city")}</h3>
                <select
                  value={filters.city}
                  onChange={(e) =>
                    handleFilterChange("city", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">{t("filters.cityAll")}</option>
                  {sortedCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Région */}
              <div>
                <h3 className="font-medium mb-2 text-gray-700">{t("search.region")}</h3>
                <select
                  value={filters.region}
                  onChange={(e) =>
                    handleFilterChange("region", e.target.value)
                  }
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                >
                  <option value="">{t("filters.regionAll")}</option>
                  {sortedRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prix */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700">
                  {t("filters.price")} (MAD)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder={t("filters.min")}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    placeholder={t("filters.max")}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Type de transaction (uniquement immo / véhicules) */}
              {(filters.category === "immobilier" ||
                filters.category === "vehicules") && (
                  <div>
                    <h3 className="font-medium mb-3 text-gray-700">
                      {t("filters.transactionType")}
                    </h3>
                    <div className="flex gap-3">
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
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.transaction_type === "location"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                      >
                        {t("filters.rent")}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleFilterChange(
                            "transaction_type",
                            filters.transaction_type === "achat" ? "" : "achat"
                          )
                        }
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${filters.transaction_type === "achat"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                      >
                        {t("filters.buy")}
                      </button>
                    </div>
                  </div>
                )}
            </div>

            <div className="sticky bottom-0 bg-white p-5 border-t flex justify-between items-center">
              <button
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm"
              >
                {t("filters.reset")}
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {t("search.viewResults")} {listings.length}{" "}
                {listings.length > 1
                  ? t("search.resultsForPlural")
                  : t("search.resultsFor")}

              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
