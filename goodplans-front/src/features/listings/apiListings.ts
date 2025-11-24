// src/features/listings/apiListings.ts
import type { Listing, ListingDetails, SellerProfile } from "./types";
import { createListingWithCategory } from "./create/api/apiCreateListing";

/**
 * Config de base
 */
const API_BASE_URL = "http://localhost:3000/api";
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
async function authFetchJson<T>(
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

export interface UpdateListingPayload extends Json {
    // champs de UpdateListingDto
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

    return {
        listing: { ...maybeListing, filters: maybeListing.filters ?? {} },
        seller: (res && res.seller) ?? null,
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

/* -------------------------------------------------------------------------- */
/*                          *** ROUTES VENDEUR (SELLER) ***                   */
/* -------------------------------------------------------------------------- */

/**
 * GET /api/seller/listings
 * Liste des annonces du vendeur connecté
 */
export async function fetchMyListings(
    filters: Partial<{ status: string; is_approved: boolean }>
): Promise<Listing[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") {
            params.append(k, String(v));
        }
    });

    const path = params.toString()
        ? `/listings/me?${params.toString()}`
        : "/listings/me";

    return authFetchJson<Listing[]>(path);
}

/**
 * PATCH /api/listings/:id
 * Mise à jour d’une annonce (vendeur)
 */
export async function updateListing(
    id: string,
    payload: UpdateListingPayload
): Promise<Listing> {
    return authFetchJson<Listing>(`/listings/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
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

// Création d'annonce avec gestion de la catégorie (ré-export simplifié)
export { createListingWithCategory };
