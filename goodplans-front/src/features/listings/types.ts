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