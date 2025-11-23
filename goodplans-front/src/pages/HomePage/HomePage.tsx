// src/pages/home/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Car, Palette, Wrench } from "lucide-react";

import { Hero } from "../../components/home/hero";
import { FiltersDrawer } from "../../components/home/FiltersDrawer";
import { SponsoredCarousel } from "../../components/home/SponsoredCarousel";
import { ListingsGrid } from "../../components/listings/ListingsGrid";

import {
  fetchRecentListings,
  fetchMostViewedListings,
} from "../../features/listings/apiListings";
import { useCategories } from "../../features/categories/apiCategorie";

import type { CarouselItem, Category, Filters, Listing } from "./types";

const HERO_IMAGE =
  "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image//arab-people-demonstrating-together.jpg";

const DEFAULT_FILTERS: Filters = {
  category: "",
  subcategory: "",
  city: "",
  region: "",
  minPrice: "",
  maxPrice: "",
  transaction_type: "",
};

const CAROUSEL_ITEMS: CarouselItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop",
    title: "Urbain Five",
    description:
      "Découvrez le fitness urbain dans un environnement moderne et inspirant. Des équipements de pointe pour tous vos objectifs de remise en forme.",
    sponsoredText: "Annonce sponsorisée",
    visitButtonText: "Visitez",
    visitUrl: "https://urbainfive.com",
  },
  {
    image:
      "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image/Petit-ambassadeur-2-WhatsApp-Image-2025-07-15-at-14.12.31-1200x694.jpeg",
    title: "AMG BUILDING",
    description:
      "AMG BUILDING vous propose des projets immobiliers à partir de 400.000€",
    sponsoredText: "Annonce sponsorisée",
    visitButtonText: "Découvrir",
    visitUrl: "https://amg-building.com/projects/le-petit-ambassadeur/",
  },
  {
    image:
      "https://unixwmlawlmpsycmuwhy.supabase.co/storage/v1/object/public/image//17345.jpg",
    title: "Besoin Publicitaire ?",
    description:
      "Que vous soyez une marque locale ou une grande entreprise, notre site est le canal idéal pour capter l'attention de vos futurs clients.",
    sponsoredText: "Pour vos pubs",
    visitButtonText: "Contactez nous",
    visitUrl: "https://goodplans.ma/devis",
  },
];

export function HomePage() {
  const navigate = useNavigate();

  /** ---------------------- état filtres & recherche ---------------------- */
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  /** ---------------------------- catégories (API) ---------------------------- */
  const {
    data: categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useCategories();

  useEffect(() => {
    if (categoriesError) {
      console.error("Erreur lors du chargement des catégories", categoriesError);
    }
  }, [categoriesError]);

  // Onglets du Hero, dérivés des catégories de l’API
  const categoryTabs = useMemo(() => {
    if (!categories) return [];

    const iconMap: Record<string, typeof Building2> = {
      immobilier: Building2,
      vehicules: Car,
      services: Wrench,
      artisanat: Palette,
    };

    return (categories as Category[])
      // si tu veux seulement les catégories racines :
      // .filter((cat) => !cat.parent_id)
      .map((category) => ({
        id: category.slug || category.id,
        label: category.name,
        icon: iconMap[category.slug || ""] || Building2,
      }));
  }, [categories]);

  /** ------------------------ annonces récentes (API) ------------------------ */
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadRecent = async () => {
      try {
        setLoadingRecent(true);
        const data = await fetchRecentListings();
        if (!cancelled) {
          setRecentListings(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des annonces récentes", error);
        if (!cancelled) setRecentListings([]);
      } finally {
        if (!cancelled) setLoadingRecent(false);
      }
    };

    void loadRecent();

    return () => {
      cancelled = true;
    };
  }, []);

  /** -------------------- annonces les plus consultées (API) ------------------ */
  const [mostViewedListings, setMostViewedListings] = useState<Listing[]>([]);
  const [loadingMostViewed, setLoadingMostViewed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMostViewed = async () => {
      try {
        setLoadingMostViewed(true);
        const data = await fetchMostViewedListings();
        if (!cancelled) {
          setMostViewedListings(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des plus consultées", error);
        if (!cancelled) setMostViewedListings([]);
      } finally {
        if (!cancelled) setLoadingMostViewed(false);
      }
    };

    void loadMostViewed();

    return () => {
      cancelled = true;
    };
  }, []);

  /** ----------------------------- gestion filtres ---------------------------- */

  const handleFilterChange = (name: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  /** ----------------------------- gestion recherche -------------------------- */

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.append("q", searchQuery);
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.subcategory)
      searchParams.append("subcategory", filters.subcategory);
    if (filters.city) searchParams.append("city", filters.city);
    if (filters.region) searchParams.append("region", filters.region);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.transaction_type)
      searchParams.append("transaction_type", filters.transaction_type);

    navigate(`/search?${searchParams.toString()}`);
  };

  const handleViewMore = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value as string);
    });
    navigate(`/listings?${params.toString()}`);
  };

  const selectedCategoryLabel =
    categoryTabs.find((tab) => tab.id === filters.category)?.label ||
    undefined;

  /** ---------------------------------- render -------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* HERO */}
      <div className="px-4">
        <Hero
          title="Le bon moment, le bon objet, le bon échange, tout commence ici"
          subtitle="Un seul site, des milliers de bons plans… sans intermédiaire, sans frais cachés."
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

      {/* CONTENU PRINCIPAL */}
      <div className="container mx-auto px-4 py-12">
        {/* Bloc annonces récentes (ou par catégorie) */}
        <ListingsGrid
          title={
            selectedCategoryLabel
              ? `Annonces ${selectedCategoryLabel}`
              : "Annonces récentes"
          }
          listings={recentListings}
          loading={loadingRecent}
          onSeeMore={handleViewMore}
          emptyMessage="Aucune annonce ne correspond aux filtres."
        />

        {/* Carrousel sponsorisé */}
        <SponsoredCarousel items={CAROUSEL_ITEMS} />

        {/* Bloc plus consultées */}
        <ListingsGrid
          title="Les plus consultées"
          listings={mostViewedListings}
          loading={loadingMostViewed}
          onSeeMore={() => navigate("/listings?sort=most_viewed")}
        />
      </div>

      {/* Drawer des filtres */}
      <FiltersDrawer
        open={showFilters}
        filters={filters}
        categories={categoryTabs}
        loadingCategories={loadingCategories}
        onChange={handleFilterChange}
        onReset={resetFilters}
        onApply={() => {
          // les changements de filters déclenchent déjà le refetch
          setShowFilters(false);
        }}
        onClose={() => setShowFilters(false)}
      />
    </div>
  );
}
