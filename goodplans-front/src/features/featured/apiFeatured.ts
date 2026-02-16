// src/features/featured/apiFeatured.ts
import { authFetchJson } from "../listings/apiListings";
import type { Listing } from "../listings/types";

export type FeaturedOrderStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface FeaturedPlan {
  id: string;
  name: string;
  description?: string | null;
  duration_days: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeaturedOrder {
  id: string;
  listing_id: string;
  seller_id: string;
  plan_id: string;
  status: FeaturedOrderStatus;
  started_at: string;
  ends_at: string;
  payment_reference?: string | null;
  created_at: string;
  updated_at: string;

  listing: Listing;
  plan: FeaturedPlan;
}

/** réponse attendue de l’endpoint Stripe côté back */
export interface CreatePaymentIntentResponse {
  clientSecret: string;
  amount: number;      // en centimes
  currency: string;    // ex: "mad"
  planName: string;
}

/**
 * GET /api/featured-plans
 */
export async function fetchFeaturedPlans(): Promise<FeaturedPlan[]> {
  return authFetchJson<FeaturedPlan[]>("/featured-plans");
}

/**
 * POST /api/listings/:id/feature
 * (utile pour un flux manuel / offline, on le garde)
 */
export async function createFeaturedOrder(
  listingId: string,
  payload: { plan_id: string; payment_reference?: string }
): Promise<FeaturedOrder> {
  return authFetchJson<FeaturedOrder>(
    `/listings/${encodeURIComponent(listingId)}/feature`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * NOUVEAU : créer un PaymentIntent Stripe
 * POST /api/listings/:id/payment-intent
 */
export async function createFeaturedPaymentIntent(
  listingId: string,
  planId: string
): Promise<CreatePaymentIntentResponse> {
  return authFetchJson<CreatePaymentIntentResponse>(
    `/listings/${encodeURIComponent(listingId)}/payment-intent`,
    {
      method: "POST",
      body: JSON.stringify({ plan_id: planId }),
    }
  );
}

/**
 * GET /api/me/featured-orders
 */
export async function fetchMyFeaturedOrders(): Promise<FeaturedOrder[]> {
  return authFetchJson<FeaturedOrder[]>("/me/featured-orders");
}
