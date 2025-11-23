export type TransactionType = "location" | "achat";
export type RentalPeriod = "day" | "week" | "month" | "year";

export interface Listing {
  id: string;
  title: string;
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
}

export interface Filters {
  category: string;
  subcategory: string;
  city: string;
  region: string;
  minPrice: string;
  maxPrice: string;
  transaction_type: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
}

export interface CarouselItem {
  image: string;
  title: string;
  description: string;
  sponsoredText?: string;
  visitButtonText?: string;
  visitUrl?: string;
}
