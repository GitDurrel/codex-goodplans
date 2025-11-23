// src/features/listings/apiListings.ts

import type { Listing } from "../../types";

const API_BASE_URL = "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";

/* -------------------------------------------------------------------------- */
/*                                helpers HTTP                                */
/* -------------------------------------------------------------------------- */

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

async function authFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const baseHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };

  const res = await fetch(url, {
    ...init,
    headers: {
      ...baseHeaders,
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Listings request failed for", path, res.status, text);
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) {
    // No Content
    return undefined as unknown as T;
  }

  return (await res.json()) as T;
}

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface CreateListingPayload {
  // catégorie racine : "immobilier" | "vehicules" | "services" | "artisanat"
  category: string;

  // table listings
  title: string;
  description: string;
  city: string;
  region: string;
  price: number;
  transaction_type: string | null;
  rental_period: string | null; // "day" | "week" | "month" | "year" | null
  images: string[];
  filters: Record<string, any>;

  // données spécifiques à la catégorie (real_estate_listings, vehicle_listings, etc.)
  details: Record<string, any>;
}

export interface ListingsQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  category?: string;
  city?: string;
  region?: string;
  transaction_type?: string;
  minPrice?: number;
  maxPrice?: number;
  [key: string]: string | number | boolean | undefined;
}

/* -------------------------------------------------------------------------- */
/*                            CRUD / ROUTES PUBLIQUES                         */
/* -------------------------------------------------------------------------- */

/**
 * Liste paginée des annonces avec filtres.
 * Correspond au GET /api/listings
 */
export async function fetchListings(
  query: ListingsQuery = {}
): Promise<Listing[]> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  const path = qs ? `/listings?${qs}` : "/listings";

  return authFetchJson<Listing[]>(path, {
    method: "GET",
  });
}

/**
 * Récupérer une annonce par id : GET /api/listings/:id
 */
export async function fetchListingById(id: string): Promise<Listing> {
  return authFetchJson<Listing>(`/listings/${id}`, {
    method: "GET",
  });
}

/**
 * Annonces récentes (endpoint backend "getRecent")
 * GET /api/listings/recent
 * + filtres éventuels (category, city, etc.)
 */
export async function fetchRecentListings(
  filters: Record<string, string | number | boolean | undefined> = {}
): Promise<Listing[]> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const qs = params.toString();
  const path = qs ? `/listings/recent?${qs}` : "/listings/recent`;

  return authFetchJson<Listing[]>(path, {
    method: "GET",
  });
}

/**
 * Annonces les plus vues.
 * GET /api/listings/most-viewed
 */
export async function fetchMostViewedListings(): Promise<Listing[]> {
  return authFetchJson<Listing[]>("/listings/most-viewed", {
    method: "GET",
  });
}

/**
 * Annonces de l'utilisateur connecté.
 * GET /api/listings/me
 */
export async function fetchMyListings(): Promise<Listing[]> {
  return authFetchJson<Listing[]>("/listings/me", {
    method: "GET",
  });
}

/* -------------------------------------------------------------------------- */
/*                              FAVORIS (AUTH REQ)                            */
/* -------------------------------------------------------------------------- */

/**
 * Ajouter en favoris : POST /api/listings/:id/favorite
 */
export async function addFavorite(listingId: string): Promise<Listing> {
  return authFetchJson<Listing>(`/listings/${listingId}/favorite`, {
    method: "POST",
  });
}

/**
 * Retirer des favoris : DELETE /api/listings/:id/favorite
 */
export async function removeFavorite(listingId: string): Promise<Listing> {
  return authFetchJson<Listing>(`/listings/${listingId}/favorite`, {
    method: "DELETE",
  });
}

/**
 * Vérifier si une annonce est en favoris : GET /api/listings/:id/favorite
 * renvoie { isFavorite: boolean }
 */
export async function isFavorite(
  listingId: string
): Promise<{ isFavorite: boolean }> {
  return authFetchJson<{ isFavorite: boolean }>(
    `/listings/${listingId}/favorite`,
    {
      method: "GET",
    }
  );
}

/* -------------------------------------------------------------------------- */
/*                        CRÉATION AVEC DÉTAILS CATÉGORIE                     */
/* -------------------------------------------------------------------------- */

/**
 * Créer une annonce + détails de catégorie.
 *
 * Côté backend, cette route doit :
 *  1) créer la ligne dans `listings`
 *  2) en fonction de `category`, créer dans
 *     `real_estate_listings` / `vehicle_listings` / `service_listings` /
 *     `craft_listings` avec `listing_id`.
 *
 * Endpoint attendu : POST /api/listings
 */
export async function createListingWithCategory(
  payload: CreateListingPayload
): Promise<Listing> {
  return authFetchJson<Listing>("/listings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
