export type AccountType =
  | "buyer"
  | "seller_pro"
  | "seller_particular"
  | "admin"
  | "super_admin";

export type SellerType = "particular" | "professional";

export interface UserPreferences {
  id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  account_type: AccountType | null;
  avatar_url: string | null;
  is_seller: boolean | null;
  seller_approved: boolean | null;
  show_phone: boolean | null;
  show_whatsapp: boolean | null;
  company_name: string | null;
  seller_type: SellerType | null;
  siret: string | null;
  online: boolean | null;
  banned_until: string | null;
  ban_reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  last_sign_in_at: string | null;
  user_preferences?: UserPreferences[];
}

export type UpdateProfilePayload = Partial<{
  username: string;
  phone: string | null;
  whatsapp: string | null;
  show_phone: boolean;
  show_whatsapp: boolean;
  company_name: string | null;
  seller_type: SellerType | null;
  siret: string | null;
  account_type: AccountType | null;
}>;
