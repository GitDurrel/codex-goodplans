// src/features/listings/create/types.ts

export type ListingCategory =
  | "immobilier"
  | "vehicules"
  | "services"
  | "artisanat";

// Ce qui correspond à la table `listings`
export interface ListingBasePayload {
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  subcategory?: string;
  city: string;
  region: string;
  images: string[]; // URLs déjà uploadées
  filters?: Record<string, any>;
  transaction_type?: string; // "location" | "achat" | ...
  availability_date?: string; // ISO (optionnel)
  minimum_rental_period?: number | null;
  rental_start_date?: string | null;
  rental_end_date?: string | null;
  minimum_rental_days?: number | null;
  rental_period?: string | null; // "day" | "week" | "month" | "year"
}

// VEHICULES -> `vehicle_listings`
export interface VehicleDetailsPayload {
  brand_id: string;
  model_id: string;
  year: number;
  mileage: number;
  price: number;
  description: string;
  city: string;
  region: string;
  images: string[]; // on peut dupliquer les images ici si ton backend les attend
  rental_start_date?: string | null;
  rental_end_date?: string | null;
  rental_duration?: number | null;
  rental_period?: string | null;
}

// SERVICES -> `service_listings`
export interface ServiceDetailsPayload {
  service_type: string;
  experience_level?: string;
  home_service?: boolean;
  rental_start_date?: string | null;
  rental_end_date?: string | null;
  rental_duration?: number | null;
  rental_period?: string | null;
}

// IMMOBILIER -> `real_estate_listings`
export interface RealEstateDetailsPayload {
  property_type: string;
  surface: number;
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  furnished?: boolean;
  garden?: boolean;
  pool?: boolean;
  garage?: boolean;
  transaction_type: string; // ici obligatoire côté Prisma
  rental_start_date?: string | null;
  rental_end_date?: string | null;
  rental_duration?: number | null;
  rental_period?: string | null;
}

// ARTISANAT -> `craft_listings`
export interface CraftDetailsPayload {
  craft_type: string;
  origin?: string;
  material?: string;
  handmade?: boolean;
  authentic?: boolean;
  vintage?: boolean;
  dimensions?: string;
}

// Form complet utilisé par le wizard
export interface CreateListingFormValues {
  base: ListingBasePayload;
  vehicle?: VehicleDetailsPayload;
  service?: ServiceDetailsPayload;
  realEstate?: RealEstateDetailsPayload;
  craft?: CraftDetailsPayload;
}
