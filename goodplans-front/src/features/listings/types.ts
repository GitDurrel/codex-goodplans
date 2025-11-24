export type TransactionType = "location" | "achat";
export type RentalPeriod = "day" | "week" | "month" | "year";

export interface Listing {
  id: string;
  title: string;
  description?: string;
  price: number;
  city: string;
  region?: string;
  images: string[];
  category: string;
  subcategory?: string;
  transaction_type?: TransactionType;
  rental_period?: RentalPeriod;
  created_at?: string;
  status?: string;
  views?: number;
  favorites?: number;
  messages?: number;
  filters?: Record<string, any>;
  user_id?: string;
  user?: SellerProfile;
}

export interface ListingDetails extends Listing {
  description?: string;
  filters: Record<string, any>;
  availability_date?: string | null;
  minimum_rental_days?: number | null;
}

export interface VehicleDetails {
  brand?: string;
  model?: string;
  year?: number;
  mileage?: number;
}

export interface RealEstateDetails {
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
}

export interface ServiceDetails {
  service_type?: string;
  experience_level?: string;
}

export interface CraftDetails {
  craft_type?: string;
  material?: string;
  dimensions?: string;
}

export interface SellerProfile {
  user_id: string;
  username?: string;
  avatar_url?: string;
  phone?: string;
  whatsapp?: string;
  show_phone?: boolean;
  show_whatsapp?: boolean;
  is_seller?: boolean;
  seller_approved?: boolean;
  created_at?: string;
  email?: string;
  account_type?: string;
  seller_type?: string;
  company_name?: string;
}