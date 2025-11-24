import type { Listing } from "../types";
import { mapApiStatusToUi } from "./statusMapping";

export function validateListing(raw: any): Listing {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid listing payload");
  }

  if (!raw.id || !raw.title) {
    throw new Error("Missing required listing fields");
  }

  return {
    id: String(raw.id),
    title: String(raw.title),
    description: raw.description ?? "",
    price: Number(raw.price ?? 0),
    city: raw.city ?? "",
    region: raw.region ?? raw.region_name ?? "",
    images: Array.isArray(raw.images) ? raw.images : [],
    category: raw.category ?? "",
    subcategory: raw.subcategory ?? undefined,
    transaction_type: raw.transaction_type ?? undefined,
    rental_period: raw.rental_period ?? undefined,
    created_at: raw.created_at ?? undefined,
    status: mapApiStatusToUi(raw.status),
    views: typeof raw.views === "number" ? raw.views : 0,
    favorites: typeof raw.favorites === "number" ? raw.favorites : 0,
    messages: typeof raw.messages === "number" ? raw.messages : 0,
    filters: raw.filters ?? {},
    user_id: raw.user_id ?? undefined,
  };
}
