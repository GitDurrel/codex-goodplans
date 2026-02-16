// src/features/listings/apiListings.ts
import type { Listing, ListingDetails, SellerProfile, UserFavorite } from "./types";
import { createListingWithCategory } from "./create/api/apiCreateListing";

/**
 * Config de base
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";

type Json = Record<string, any>;

/**
 * Récupère le token du localStorage (même clé que useFetch)
 */
function getAuthHeader() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as { accessToken?: string };
        if (!parsed.accessToken) return {};
        return {
            Authorization: `Bearer ${parsed.accessToken}`,
        };
    } catch {
        return {};
    }
}



/**
 * Helper générique pour faire un fetch JSON avec Bearer
 */
export async function authFetchJson<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;

    const { headers: optHeaders, ...restOptions } = options;
    const headers = new Headers(optHeaders as HeadersInit | undefined);

    // JSON par défaut
    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // Auth
    const auth = getAuthHeader();
    Object.entries(auth).forEach(([k, v]) => {
        headers.set(k, String(v));
    });

    const res = await fetch(url, {
        ...restOptions,
        headers,
    });

    if (!res.ok) {
        let message = `HTTP ${res.status}`;
        try {
            const data = (await res.json()) as any;
            if (typeof data?.message === "string") {
                message = data.message;
            } else if (Array.isArray(data?.message)) {
                message = data.message.join("\n");
            }
        } catch {
            // ignore
        }
        throw new Error(message);
    }

    // 204 No Content
    if (res.status === 204) {
        return undefined as T;
    }

    return (await res.json()) as T;
}


function buildSearchParams(filters?: Record<string, any>): string {
  if (!filters) return "";
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      Number.isNaN(value)
    ) {
      return;
    }
    params.append(key, String(value));
  });

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

/**
 * Type de filtres publics (basé sur ton QueryListingDto)
 */
export type ListingFilters = Partial<{
    category: string;
    subcategory: string;
    city: string;
    region: string;
    minPrice: string | number;
    maxPrice: string | number;
    transaction_type: string;
    q: string; // recherche texte
}>;

/**
 * Payloads de création/mise à jour
 */
export interface CreateListingPayload extends Json {
    // champs de CreateListingDto + spécifiques (vehicle, real_estate, service, craft)
}

export interface UpdateListingPayload {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    status?: string;
    city?: string;
    region?: string;
    images?: string[];
}

export interface ApproveListingPayload {
    approved: boolean;
    rejection_reason?: string;
}

/* -------------------------------------------------------------------------- */
/*                            *** ROUTES PUBLIQUES ***                         */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/listings
 * Liste publique avec filtres (status=Publié + is_approved=true gérés côté backend)
 */
export async function fetchListings(
    filters: ListingFilters = {}
): Promise<Listing[]> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            params.append(key, String(value));
        }
    });

    const query = params.toString();
    const path = query ? `/listings?${query}` : "/listings";

    return authFetchJson<Listing[]>(path);
}

/**
 * GET /api/listings/public
 * Liste publique avec filtres (is_approved=true)
 */
export async function fetchPublicListings(
  filters: ListingFilters = {},
  options?: { limit?: number; offset?: number }
): Promise<Listing[]> {
  const params = new URLSearchParams();

  // filtres existants
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  // ✅ pagination
  if (options?.limit !== undefined) {
    params.append("limit", String(options.limit));
  }

  if (options?.offset !== undefined) {
    params.append("offset", String(options.offset));
  }

  const query = params.toString();
  const path = query ? `/listings/public?${query}` : "/listings/public";

  return authFetchJson<Listing[]>(path);
}



/**
 * GET /api/listings/recent
 * Annonces récentes (ton getRecent() : status="Publié", is_approved=true, orderBy created_at desc)
 */
export async function fetchRecentListings(): Promise<Listing[]> {
    return authFetchJson<Listing[]>("/listings/recent");
}

/**
 * GET /api/listings/most-viewed
 * Annonces les plus consultées (ton getMostViewed() : status="Publié", is_approved=true, orderBy views desc)
 */
export async function fetchMostViewedListings(): Promise<Listing[]> {
    return authFetchJson<Listing[]>("/listings/most-viewed");
}

/**
 * GET /api/listings/:id
 * Détail d’une annonce + incrémentation de views 
 */
export async function fetchListingById(id: string): Promise<Listing> {
    return authFetchJson<Listing>(`/listings/${encodeURIComponent(id)}`);
}

export interface ListingDetailResponse {
    listing: ListingDetails;
    seller: SellerProfile | null;
    isFavorite: boolean;
}

export async function fetchListingDetails(id: string): Promise<ListingDetailResponse> {
    const res = await authFetchJson<any>(`/listings/${encodeURIComponent(id)}`);

    // Compatibilité : certains backends renvoient directement le listing,
    // d'autres renvoient { listing, seller, isFavorite }
    const maybeListing =
        (res && (res.listing as ListingDetails | undefined)) ||
        (res && (res.data as ListingDetails | undefined)) ||
        res;

    if (!maybeListing || !maybeListing.id) {
        throw new Error("Annonce introuvable");
    }

    const sellerFromPayload: SellerProfile | null =
        (res && res.seller) ||
        (maybeListing && (maybeListing as any).user) ||
        null;

    return {
        listing: { ...maybeListing, filters: maybeListing.filters ?? {}, user: sellerFromPayload ?? undefined },
        seller: sellerFromPayload,
        isFavorite: Boolean((res && res.isFavorite) ?? false),
    } as ListingDetailResponse;
}

/**
 * Vérifie si un listing est en favori
 * GET /api/listings/:id/is-favorite
 */
export async function fetchIsFavorite(listingId: string): Promise<{ isFavorite: boolean }> {
    return authFetchJson<{ isFavorite: boolean }>(
        `/listings/${encodeURIComponent(listingId)}/is-favorite`
    );
}

/**
 * Ajoute une annonce aux favoris de l’utilisateur connecté
 * POST /api/listings/:id/favorite
 */
export async function addFavorite(listingId: string): Promise<Listing> {
    return authFetchJson<Listing>(
        `/listings/${encodeURIComponent(listingId)}/favorite`,
        {
            method: "POST",
        }
    );
}

/**
 * Retire une annonce des favoris
 * DELETE /api/listings/:id/favorite
 */
export async function removeFavorite(listingId: string): Promise<Listing> {
    return authFetchJson<Listing>(
        `/listings/${encodeURIComponent(listingId)}/favorite`,
        {
            method: "DELETE",
        }
    );
}

/**
 * Permet de faire un toggle simple dans le front :
 * si favori → retiré
 * si pas favori → ajouté
 */
export async function toggleFavorite(
    listingId: string
): Promise<{ isFavorite: boolean; listing: Listing }> {
    const fav = await fetchIsFavorite(listingId);

    if (fav.isFavorite) {
        const listing = await removeFavorite(listingId);
        return { isFavorite: false, listing };
    } else {
        const listing = await addFavorite(listingId);
        return { isFavorite: true, listing };
    }
}

/**
 * GET /api/listings/me/favorites
 * Liste des annonces en favoris de l'utilisateur connecté
 */
export async function fetchMyFavorites(): Promise<UserFavorite[]> {
    return authFetchJson<UserFavorite[]>("/listings/me/favorites");
}

/** 
 * GET /api/public/sellers/:sellerId/listings
 * Liste des annonces d’un vendeur
 */
export async function fetchSellerPublicListings(
    sellerId: string
): Promise<Listing[]> {
    return authFetchJson<Listing[]>(
        `/listings/sellers/${encodeURIComponent(sellerId)}`
    );
}


/* -------------------------------------------------------------------------- */
/*                          *** ROUTES VENDEUR (SELLER) ***                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/seller/listings
 * Liste des annonces du vendeur connecté
 */
export interface FetchMyListingsParams {
    status?: string;
    category?: string;
}

export async function fetchMyListings(
    filters: FetchMyListingsParams = {}
): Promise<Listing[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
            params.append(k, String(v));
        }
    });

    const query = params.toString();
    const path = query ? `/listings/me?${query}` : "/listings/me";

    return authFetchJson<Listing[]>(path);
}

/**
 * PATCH /api/listings/:id
 * Met à jour les infos de base d'une annonce (table listings)
 */
export async function updateListingBase(
    id: string,
    payload: UpdateListingPayload
): Promise<Listing> {
    return authFetchJson<Listing>(`/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export async function updateListingStatus(
    id: string,
    status: string,
): Promise<Listing> {
    return updateListingBase(id, { status });
}

/**
 * DELETE /api/listings/:id
 * Suppression / archivage d’une annonce (ton softDelete)
 */
export async function deleteListing(id: string): Promise<void> {
    await authFetchJson<void>(`/listings/${encodeURIComponent(id)}`, {
        method: "DELETE",
    });
}

// --- UPDATE / DELETE de l'annonce de base ------------------------

export interface UpdateListingPayload {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    status?: string;
    city?: string;
    region?: string;
    images?: string[];
}




/* -------------------------------------------------------------------------- */
/*                           *** ROUTES ADMIN ***                             */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/admin/listings
 * Liste d’annonces pour modération (QueryListingDto: is_approved, status, category, etc.)
 */
export async function adminFetchListings(
    filters: Partial<{
        is_approved: boolean;
        status: string;
        category: string;
        transaction_type: string;
        q: string;
    }> = {}
): Promise<Listing[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
            params.append(k, String(v));
        }
    });

    const path = params.toString()
        ? `/admin/listings?${params.toString()}`
        : "/admin/listings";

    return authFetchJson<Listing[]>(path);
}

/**
 * GET /api/admin/listings/:id
 * Détail admin (avec plus d’infos si besoin)
 */
export async function adminFetchListingById(id: string): Promise<Listing> {
    return authFetchJson<Listing>(`/admin/listings/${encodeURIComponent(id)}`);
}

/**
 * POST /api/admin/listings/:id/approve
 * Validation / rejet d’une annonce (ApproveListingDto)
 */
export async function adminApproveListing(
    id: string,
    payload: ApproveListingPayload
): Promise<Listing> {
    return authFetchJson<Listing>(
        `/admin/listings/${encodeURIComponent(id)}/approve`,
        {
            method: "POST",
            body: JSON.stringify(payload),
        }
    );
}

/**
 * POST /api/admin/listings/:id/suspend
 * Suspension d’une annonce
 */
export async function adminSuspendListing(
    id: string,
    reason: string
): Promise<Listing> {
    return authFetchJson<Listing>(
        `/admin/listings/${encodeURIComponent(id)}/suspend`,
        {
            method: "POST",
            body: JSON.stringify({ reason }),
        }
    );
}

/**
 * POST /api/admin/listings/:id/feature
 * Mettre en avant / retirer de la mise en avant
 */
export async function adminToggleFeatured(
    id: string,
    is_featured: boolean
): Promise<Listing> {
    return authFetchJson<Listing>(
        `/admin/listings/${encodeURIComponent(id)}/feature`,
        {
            method: "POST",
            body: JSON.stringify({ is_featured }),
        }
    );
}

export interface UploadListingImagesResponse {
    urls: string[];
    message: string;
}

export async function uploadListingImages(
    files: File[]
): Promise<UploadListingImagesResponse> {
    const url = `${API_BASE_URL}/uploads/listings-images`;

    const auth = getAuthHeader();
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const res = await fetch(url, {
        method: "POST",
        headers: {
            ...(auth.Authorization ? { Authorization: auth.Authorization } : {}),
        },
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Upload images failed", res.status, text);
        throw new Error(text || `HTTP ${res.status}`);
    }

    return (await res.json()) as UploadListingImagesResponse;
}

// Création d'annonce avec gestion de la catégorie (ré-export simplifié)
export { createListingWithCategory };

/* -------------------------------------------------------------------------- */
/*                           UPDATE PAR TYPE D'ANNONCE                        */
/* -------------------------------------------------------------------------- */

export interface UpdateRealEstateListingPayload {
    // champs génériques
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    region?: string;
    transaction_type?: string | null;
    images?: string[];
    subcategory?: string | null;
    rental_start_date?: string | null;
    rental_end_date?: string | null;
    rental_duration?: number | null;
    rental_period?: string | null;

    // spécifiques immo
    property_type?: string | null;
    surface?: number | null;
    rooms?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    furnished?: boolean;
    garden?: boolean;
    pool?: boolean;
    garage?: boolean;
}

export async function updateRealEstateListing(
    id: string,
    payload: UpdateRealEstateListingPayload,
): Promise<Listing> {
    return authFetchJson<Listing>(`/real-estate/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export interface UpdateVehicleListingPayload {
    // génériques
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    region?: string;
    transaction_type?: string | null;
    images?: string[];

    // spécifiques véhicule
    brand_id?: string | null;
    model_id?: string | null;
    year?: number | null;
    mileage?: number | null;
}

export async function updateVehicleListing(
    id: string,
    payload: UpdateVehicleListingPayload,
): Promise<Listing> {
    return authFetchJson<Listing>(`/vehicle/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export interface UpdateServiceListingPayload {
    // génériques
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    region?: string;
    transaction_type?: string | null;
    images?: string[];
    subcategory?: string | null;
    rental_start_date?: string | null;
    rental_end_date?: string | null;
    rental_duration?: number | null;
    rental_period?: string | null;

    // spécifiques service
    service_type?: string | null;
    experience_level?: string | null;
    home_service?: boolean;
}

export async function updateServiceListing(
    id: string,
    payload: UpdateServiceListingPayload,
): Promise<Listing> {
    return authFetchJson<Listing>(`/services/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export interface UpdateCraftListingPayload {
    // génériques
    title?: string;
    description?: string;
    price?: number;
    city?: string;
    region?: string;
    transaction_type?: string | null;
    images?: string[];
    subcategory?: string | null;

    // spécifiques artisanat
    craft_type?: string | null;
    origin?: string | null;
    material?: string | null;
    handmade?: boolean;
    authentic?: boolean;
    vintage?: boolean;
    dimensions?: string | null;
}

export async function updateCraftListing(
    id: string,
    payload: UpdateCraftListingPayload,
): Promise<Listing> {
    return authFetchJson<Listing>(`/crafts/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}


// --- META FILTRES (localisation) ------------------------------------

export type LocationRow = { id: string; name: string; region: string };

export async function fetchLocationsMeta(): Promise<LocationRow[]> {
  return authFetchJson<LocationRow[]>("/listings/filters/meta-locations");
}



export type CategoryWithSubcategories = {
    id: string;
    name: string;
    slug: string;
    subcategories: { id: string; name: string; slug: string }[];
};

export async function fetchCategoriesTree(): Promise<CategoryWithSubcategories[]> {
    return authFetchJson<CategoryWithSubcategories[]>("/categories/tree");
}

/* --------------- Endpoints par catégorie --------------- */

/* ---------------------- Routes par catégorie ---------------------- */
/**
 * Routes côté backend :
 * - /real-estate/listings
 * - /vehicle/listings
 * - /service/listings
 * - /craft/listings
 *
 * ⚠️ Ces routes ne veulent PAS du paramètre "category" en query.
 */
type CategorySlugApi = "real_estate" | "vehicle" | "service" | "craft";

function getCategoryListingsPath(category: CategorySlugApi): string {
  switch (category) {
    case "real_estate":
      return "/real-estate/listings";
    case "vehicle":
      return "/vehicle/listings";
    case "service":
      return "/services/listings";
    case "craft":
      return "/crafts/listings";
    default:
      return "/listings/public";
  }
}

export async function fetchCategoryListings(
  category: CategorySlugApi,
  filters: Record<string, any> = {}
): Promise<Listing[]> {
  // ⚠️ on enlève "category" si jamais il est passé dans filters
  const { category: _ignored, ...safeFilters } = filters;

  const qs = buildSearchParams(safeFilters);
  const path = getCategoryListingsPath(category);

  return authFetchJson<Listing[]>(`${path}${qs}`);
}