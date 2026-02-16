// src/pages/home/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Car, Palette, Wrench, X, ArrowRight } from "lucide-react";
import { ListingCard } from "../../components/listings/ListingCard";
import { Hero } from "../../components/home/hero";
import { FiltersDrawer } from "../../components/home/FiltersDrawer";
import { SponsoredCarousel } from "../../components/home/SponsoredCarousel";
import { ListingsGrid } from "../../components/listings/ListingsGrid";

import {
  fetchPublicListings,
  fetchMostViewedListings,
  fetchLocationsMeta,
} from "../../features/listings/apiListings";

import {
  useCategories,
  fetchCategoriesTree,
  type CategoryWithSubcategories,
} from "../../features/categories/apiCategorie";

import {
  mapUiCategoryToApi,
  mapUiTransactionToApi,
} from "../../features/listings/utils/mappers";

import type { CarouselItem, Category, Filters, Listing } from "./types";
import { usePromoBanners } from "../../features/promo-banners/usePromoBanners";
import { PromoBannerPicture } from "../../components/PromoBannerPicture";
import { MobileCategoryRows } from "../../components/home/MobileCategoryRows";
import { useCategoryListings } from "../../hooks/useCategoryListings";
// import { getCategoryLabel } from "../../features/listings/utils/categoryLabels";
import { AppStorePopupSimple } from "../../components/AppStorePopup";
import { useLanguage } from "../../lib/language/LanguageContext";
import { mapCategorySlugToTranslationKey } from "../../lib/language/categoryKeyMapper";


const HERO_IMAGE =
  "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image/portrait-man-pottery-studio-working-stoneware.jpg";

const DEFAULT_FILTERS: Filters = {
  category: "",
  subcategory: "",
  city: "",
  region: "",
  minPrice: "",
  maxPrice: "",
  transaction_type: "",
};


type LocationsMeta = {
  cities: string[];
  regions: string[];
};

export function HomePage() {

  const { lang, t } = useLanguage();

  const navigate = useNavigate();

  /* ---------------------- Filtres & Recherche ---------------------- */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /* ---------------------- App Store Popup ---------------------- */
  const [showAppStorePopup, setShowAppStorePopup] = useState(false);


  /* ---------------------------- Catégories API ---------------------------- */
  const {
    data: categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories();

  useEffect(() => {
    if (categoriesError) {
      console.error("Erreur chargement catégories", categoriesError);
    }
  }, [categoriesError]);

  /* ---------------------- Tree catégories pour sous-cats ---------------------- */
  const [categoriesTree, setCategoriesTree] = useState<CategoryWithSubcategories[]>([]);
  const [loadingCategoriesTree, setLoadingCategoriesTree] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadTree = async () => {
      try {
        setLoadingCategoriesTree(true);
        const data = await fetchCategoriesTree();
        if (!cancelled) {
          setCategoriesTree(data);
        }
      } catch (error) {
        console.error("Erreur chargement categories tree", error);
        if (!cancelled) setCategoriesTree([]);
      } finally {
        if (!cancelled) setLoadingCategoriesTree(false);
      }
    };
    void loadTree();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------------- Meta localisation (villes / régions) ---------------------- */
  const [locationsMeta, setLocationsMeta] = useState<LocationsMeta>({
    cities: [],
    regions: [],
  });
  const [loadingLocationsMeta, setLoadingLocationsMeta] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadLocations = async () => {
      try {
        setLoadingLocationsMeta(true);
        const meta = await fetchLocationsMeta();

        // meta est en réalité un tableau d'objets { id, name, region }
        const rows = Array.isArray(meta) ? meta : [];

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


      } catch (error) {
        console.error("Erreur chargement meta localisation", error);
        if (!cancelled) {
          setLocationsMeta({ cities: [], regions: [] });
        }
      } finally {
        if (!cancelled) setLoadingLocationsMeta(false);
      }

    };
    void loadLocations();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadingMeta = loadingCategoriesTree || loadingLocationsMeta;

  /* ----------- Hero Tabs dynamiques basés sur les catégories ---------- */
  const categoryTabs = useMemo(() => {
    if (!categories) return [];

    const iconMap: Record<string, any> = {
      real_estate: Building2,
      vehicle: Car,
      service: Wrench,
      craft: Palette,
    };

    return categories.map((category) => {
      const translationKey = mapCategorySlugToTranslationKey(category.slug);

      return {
        id: category.slug || category.id,
        label: t(`categories.${translationKey}`),
        icon: iconMap[category.slug] || Building2,
      };
    });
  }, [categories, lang]);



  /* ------------------------ Annonces filtrées ------------------------ */
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  // ✅ LIMITES & CTA (Home)
  const RECENT_INITIAL = 8; // 2 lignes * 4 cards
  const RECENT_STEP = 8;

  const MOST_VIEWED_INITIAL = 12;
  const MOST_VIEWED_STEP = 8;

  const [recentVisible, setRecentVisible] = useState(RECENT_INITIAL);
  const [mostViewedVisible, setMostViewedVisible] = useState(MOST_VIEWED_INITIAL);

  // pour switch label "Voir plus" -> "Voir tout" après 1er clic
  const [recentClickedOnce, setRecentClickedOnce] = useState(false);
  const [mostViewedClickedOnce, setMostViewedClickedOnce] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFiltered = async () => {
      try {
        // ✅ reset à chaque changement de filtres
        setRecentVisible(RECENT_INITIAL);
        setRecentClickedOnce(false);

        setLoadingRecent(true);

        const apiFilters: any = {};

        if (filters.category) {
          const apiCat = mapUiCategoryToApi(filters.category);
          if (apiCat) apiFilters.category = apiCat;
        }

        if (filters.subcategory) apiFilters.subcategory = filters.subcategory;
        if (filters.city) apiFilters.city = filters.city;
        if (filters.region) apiFilters.region = filters.region;

        if (filters.minPrice) apiFilters.minPrice = Number(filters.minPrice);
        if (filters.maxPrice) apiFilters.maxPrice = Number(filters.maxPrice);

        if (filters.transaction_type) {
          const apiTx = mapUiTransactionToApi(filters.transaction_type);
          if (apiTx) apiFilters.transaction_type = apiTx;
        }

        console.log('📤 Filtres API envoyés:', apiFilters);

        const data = await fetchPublicListings(apiFilters);

        console.log('📥 Résultats reçus:', data.length, 'annonces'); // ✅ Ajoutez cette ligne
        console.log('📥 Détail:', data); // ✅ Et celle-ci pour voir les données



        if (!cancelled) setRecentListings(data);
      } catch (error) {
        console.error("Erreur chargement annonces filtrées", error);
        if (!cancelled) setRecentListings([]);
      } finally {
        if (!cancelled) setLoadingRecent(false);
      }
    };

    void loadFiltered();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  /* -------------------- Annonces les plus consultées -------------------- */
  const [mostViewedListings, setMostViewedListings] = useState<Listing[]>([]);
  const [loadingMostViewed, setLoadingMostViewed] = useState(false);

  const sharedCategoryFilters = useMemo(() => ({}), []); // Objet vide = pas de filtres

  // ✅ Charger les catégories (8 annonces max chacune, SANS filtres)
  const realEstate = useCategoryListings("real_estate", {}, 8);
  const vehicles = useCategoryListings("vehicle", {}, 8);
  const crafts = useCategoryListings("craft", {}, 8);
  const services = useCategoryListings("service", {}, 8);

  // ✅ Fonction pour "Voir tout" d'une catégorie (sans filtres)
  const handleCategorySeeAll = (category: string) => {
    const params = new URLSearchParams();
    params.set("category", category);
    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    let cancelled = false;

    const loadViewed = async () => {
      try {
        setLoadingMostViewed(true);
        const data = await fetchMostViewedListings();
        if (!cancelled) setMostViewedListings(data);
      } catch (error) {
        console.error("Erreur chargement plus vues", error);
        if (!cancelled) setMostViewedListings([]);
      } finally {
        if (!cancelled) setLoadingMostViewed(false);
      }
    };

    void loadViewed();
    return () => {
      cancelled = true;
    };
  }, []);

  // ✅ slices (ce qui est réellement affiché)
  const recentLimited = useMemo(
    () => recentListings.slice(0, recentVisible),
    [recentListings, recentVisible]
  );

  const mostViewedLimited = useMemo(
    () => mostViewedListings.slice(0, mostViewedVisible),
    [mostViewedListings, mostViewedVisible]
  );

  // ✅ conditions & labels
  const canSeeMoreRecent = recentVisible < recentListings.length;
  const canSeeMoreMostViewed = mostViewedVisible < mostViewedListings.length;

  const recentCtaLabel = recentClickedOnce
    ? t("home.seeAll")
    : t("home.seeMore");

  const mostViewedCtaLabel = mostViewedClickedOnce ? "Voir tout" : "Voir plus";

  const handleRecentSeeMore = () => {
    if (!recentClickedOnce) {
      // 1er clic => "Voir plus" : on ajoute un step
      setRecentVisible((v) => v + RECENT_STEP);
      setRecentClickedOnce(true);
      return;
    }
    // clic suivant => "Voir tout"
    setRecentVisible(recentListings.length);
  };

  const handleMostViewedSeeMore = () => {
    if (!mostViewedClickedOnce) {
      setMostViewedVisible((v) => v + MOST_VIEWED_STEP);
      setMostViewedClickedOnce(true);
      return;
    }
    setMostViewedVisible(mostViewedListings.length);
  };

  /* ------------------------ Encarts publicitaires ------------------------ */

  const { banners: carouselBanners, loading: loadingCarouselBanners } =
    usePromoBanners("carousel");

  const carouselItems: CarouselItem[] = useMemo(
    () =>
      carouselBanners.map((b) => ({
        id: b.id, // Requis pour la clé stable dans le carrousel
        image_desktop: b.image_desktop || "", // Nouveau champ
        image_mobile: b.image_mobile || "",   // Nouveau champ
        title: b.title,
        description: b.description ?? "",
        sponsoredText: "Annonce sponsorisée",
        visitButtonText: b.link_url ? "Découvrir" : "Voir",
        visitUrl: b.link_url || "#",
      })),
    [carouselBanners]
  );

  const { banners: topBanners } = usePromoBanners("topOfPage");
  const topBanner = topBanners[0] ?? null;
  // const [hideTopBanner, setHideTopBanner] = useState(false);

  const { banners: popupBanners } = usePromoBanners("popup");
  const popupBanner = popupBanners[0] ?? null;
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!popupBanner) return;

    const STORAGE_KEY = "gp_last_promo_popup_at";
    const last = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    const twentyMinutes = 20 * 60 * 1000;

    if (!last || now - Number(last) > twentyMinutes) {
      setShowPopup(true);
      localStorage.setItem(STORAGE_KEY, String(now));
    }
  }, [popupBanner?.id]);

  useEffect(() => {
    const STORAGE_KEY = "gp_appstore_popup_seen";
    const alreadySeen = localStorage.getItem(STORAGE_KEY);

    if (!alreadySeen) {
      const timer = setTimeout(() => {
        setShowAppStorePopup(true);
        localStorage.setItem(STORAGE_KEY, "true");
      }, 6000); // 6 secondes après l’arrivée sur la home

      return () => clearTimeout(timer);
    }
  }, []);


  /* ---------------------------- Gestion filtre UI ---------------------------- */

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => {
      if (name === "category") {
        return {
          ...prev,
          category: value,
          subcategory: "",
          transaction_type: "",
        };
      }
      return { ...prev, [name]: value };
    });
  };


  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  /* ---------------------------- Recherche (page /search) ---------------------------- */

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.append("q", searchQuery);

    const apiCat = mapUiCategoryToApi(filters.category);
    if (apiCat) params.append("category", apiCat);

    if (filters.subcategory) params.append("subcategory", filters.subcategory);
    if (filters.city) params.append("city", filters.city);
    if (filters.region) params.append("region", filters.region);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    const apiTx = mapUiTransactionToApi(filters.transaction_type);
    if (apiTx) params.append("transaction_type", apiTx);

    navigate(`/search?${params.toString()}`);
  };

  const selectedCategoryLabel =
    categoryTabs.find((c) => c.id === filters.category)?.label;

  /* ---------------------------------- RENDER ---------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* BANDEAU PUB HAUT DE PAGE */}
      {/* BANDEAU PUB HAUT DE PAGE (compact + respirant) */}
      {topBanner && (
        <section className="bg-slate-50">
          <div className="container mx-auto px-4 pb-6">
            <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.20)]">
              <a
                href={topBanner.link_url || "#"}
                target="_blank"
                rel="noreferrer"
                className="group block"
                aria-label={topBanner.title || "Annonce sponsorisée"}
              >
                {/* ratio: mobile square (600x600), desktop 3/1 (1200x400) */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[4/1]">
                  <PromoBannerPicture
                    desktopSrc={topBanner.image_desktop}
                    mobileSrc={topBanner.image_mobile || topBanner.image_desktop}
                    alt={topBanner.title || "Encart publicitaire"}
                    className="absolute inset-0 h-full w-full"
                  />

                  {/* Overlay lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/35 to-transparent sm:via-slate-950/40" />

                  {/* Badge */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Sponsorisé
                    </span>
                  </div>

                  {/* Contenu minimal (top banner = léger) */}
                  <div className="relative z-10 flex h-full items-end sm:items-center px-4 pb-4 pt-12 sm:px-8 sm:py-6">
                    <div className="max-w-lg space-y-2 text-white">
                      <h3 className="text-lg sm:text-2xl font-extrabold leading-tight drop-shadow-sm line-clamp-2">
                        {topBanner.title}
                      </h3>

                      {topBanner.description && (
                        <p className="hidden sm:block text-sm text-slate-100/90 line-clamp-2">
                          {topBanner.description}
                        </p>
                      )}

                      {topBanner.link_url && (
                        <span className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-md transition group-hover:bg-slate-100">
                          Découvrir
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>
      )}


      {/* HERO */}
      <div className="w-full px-4">
        <Hero
          title={t("home.heroTitle")}
          subtitle={t("home.heroSubtitle")}
          heroImage={HERO_IMAGE}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSubmitSearch={handleSearch}
          onOpenFilters={() => setShowFilters(true)}
          selectedCategory={filters.category}
          onSelectCategory={(cat) => handleFilterChange("category", cat)}
          tabs={categoryTabs}
        />
      </div>

      {/* CONTENU */}
      <div className="w-full px-4 py-12">
        <div className="mx-auto max-w-[1600px]">

          {/* ✅ DESKTOP - TOUT EN GRILLE */}
          <div className="hidden md:block">
            <div className="space-y-12">
              {/* Annonces récentes */}
              <ListingsGrid
                title={
                  selectedCategoryLabel
                    ? `Filtre ${selectedCategoryLabel}`
                    : t("home.recentListings")
                }
                listings={recentLimited}
                loading={loadingRecent}
                onSeeMore={canSeeMoreRecent ? handleRecentSeeMore : undefined}
                seeMoreLabel={recentCtaLabel}
                hideSeeMore={!canSeeMoreRecent}
                emptyMessage={t("home.noResults")}
              />

              {/* Immobilier */}
              <ListingsGrid
                title={t("categories.immobilier")}
                listings={realEstate.listings}
                loading={realEstate.loading}
                onSeeMore={() => handleCategorySeeAll("real_estate")}
                seeMoreLabel={t("home.seeMoreLabel")}
                emptyMessage={t("home.noResultsImmo")}
              />
              {/* Carrousel Sponsorisé */}
              {carouselItems.length > 0 && !loadingCarouselBanners && (
                <SponsoredCarousel items={carouselItems} />
              )}

              {/* Véhicules */}
              <ListingsGrid
                title={t("categories.vehicules")}
                listings={vehicles.listings}
                loading={vehicles.loading}
                onSeeMore={() => handleCategorySeeAll("vehicle")}
                seeMoreLabel={t("home.seeMoreLabel")}
                emptyMessage={t("home.noResultsVehicle")}
              />

              {/* Carrousel Sponsorisé */}
              {carouselItems.length > 0 && !loadingCarouselBanners && (
                <SponsoredCarousel items={carouselItems} />
              )}

              {/* Artisanat */}
              <ListingsGrid
                title={t("categories.artisanat")}
                listings={crafts.listings}
                loading={crafts.loading}
                onSeeMore={() => handleCategorySeeAll("craft")}
                seeMoreLabel={t("home.seeMoreLabel")}
                emptyMessage={t("home.noResultsCraft")}
              />

              {/* Services */}
              <ListingsGrid
                title={t("categories.services")}
                listings={services.listings}
                loading={services.loading}
                onSeeMore={() => handleCategorySeeAll("service")}
                seeMoreLabel={t("home.seeMoreLabel")}
                emptyMessage={t("home.noResultsServices")}
              />
            </div>
          </div>

          {/* ✅ MOBILE : ordre exact
        1) Immobilier (horizontal)
        2) Véhicules (horizontal)
        3) Carrousel sponsorisé
        4) Artisanat (horizontal)
        5) Services (horizontal)
    */}
          {/* ✅ MOBILE */}
          <div className="md:hidden">
            {/* ✅ Annonces récentes en carrousel */}
            <section className="mb-10">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <h2 className="text-lg font-extrabold text-blue-600">
                    {selectedCategoryLabel
                      ? `Filtre ${selectedCategoryLabel}`
                      : t("home.recentListings")}
                  </h2>
                </div>

                {canSeeMoreRecent && (
                  <button
                    type="button"
                    onClick={handleRecentSeeMore}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {recentCtaLabel} <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>

              {loadingRecent ? (
                <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-[78vw] max-w-[320px] flex-none">
                      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
                        <div className="aspect-[4/3] bg-gray-200" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                          <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                          <div className="h-5 bg-gray-200 rounded-full w-1/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentLimited.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {recentLimited.map((listing) => (
                    <div
                      key={listing.id}
                      className="w-[78vw] max-w-[320px] flex-none snap-start"
                    >
                      <ListingCard listing={listing as any} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-500">
                  {t("home.noResults")}
                </div>
              )}
            </section>

            {/* Catégories Immobilier & Véhicules */}
            <MobileCategoryRows
              only={["real_estate", "vehicle"]}
              sharedFilters={{
                city: filters.city || undefined,
                region: filters.region || undefined,
                minPrice: filters.minPrice || undefined,
                maxPrice: filters.maxPrice || undefined,
                transaction_type: filters.transaction_type
                  ? mapUiTransactionToApi(filters.transaction_type)
                  : undefined,
              }}
              limit={12}
            />

            {carouselItems.length > 0 && !loadingCarouselBanners && (
              <div className="mt-10">
                <SponsoredCarousel items={carouselItems} />
              </div>
            )}

            <div className="mt-10">
              <MobileCategoryRows
                only={["craft", "service"]}
                sharedFilters={{
                  city: filters.city || undefined,
                  region: filters.region || undefined,
                  minPrice: filters.minPrice || undefined,
                  maxPrice: filters.maxPrice || undefined,
                  transaction_type: filters.transaction_type
                    ? mapUiTransactionToApi(filters.transaction_type)
                    : undefined,
                }}
                limit={12}
              />
            </div>
          </div>


          {/* ✅ UN SEUL DRAWER FILTRES ICI */}
          <FiltersDrawer
            open={showFilters}
            filters={filters}
            categories={categoryTabs}
            loadingCategories={loadingCategories}
            onChange={handleFilterChange}
            onReset={resetFilters}
            onApply={() => setShowFilters(false)}
            onClose={() => setShowFilters(false)}
            cityOptions={locationsMeta.cities || []}
            regionOptions={locationsMeta.regions || []}
            categoriesTree={categoriesTree}
            loadingMeta={loadingMeta}
          />

          {/* POPUP PUBLICITAIRE */}
          {popupBanner && showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="relative w-full max-w-lg sm:max-w-xl">
                {/* Bouton fermer */}
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute -top-3 -right-3 z-10 inline-flex items-center justify-center rounded-full bg-white shadow-lg border border-slate-200 p-2 hover:bg-slate-50"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5 text-slate-700" />
                </button>

                <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                  {/* HEADER IMAGE (avec overlay + badge + CTA flottant) */}
                  <div className="relative aspect-square sm:aspect-video overflow-hidden bg-slate-900">
                    <PromoBannerPicture
                      desktopSrc={popupBanner.image_desktop}
                      mobileSrc={popupBanner.image_mobile || popupBanner.image_desktop}
                      alt={popupBanner.title || "Encart publicitaire"}
                      className="absolute inset-0 h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />

                    {/* Overlay pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/10 to-transparent" />

                    {/* Badge */}
                    <div className="absolute left-4 top-4">
                      <span className="inline-flex items-center rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        Sponsorisé
                      </span>
                    </div>

                    {/* Mini CTA flottant (si lien) */}
                    {popupBanner.link_url && (
                      <a
                        href={popupBanner.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-100"
                      >
                        Découvrir
                      </a>
                    )}
                  </div>

                  {/* CONTENU */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                      {popupBanner.title}
                    </h3>

                    {popupBanner.description && (
                      <p className="mt-2 text-sm sm:text-base text-slate-600">
                        {popupBanner.description}
                      </p>
                    )}

                    {/* CTA principal plein largeur */}
                    {popupBanner.link_url && (
                      <a
                        href={popupBanner.link_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Voir l’offre
                      </a>
                    )}

                    {/* Hint discret */}
                    <p className="mt-3 text-[11px] text-slate-400">
                      Offre limitée — cliquez pour en profiter.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* POPUP APP STORE */}
          <AppStorePopupSimple
            open={showAppStorePopup}
            onClose={() => setShowAppStorePopup(false)}
          />

        </div></div></div>
  );
}