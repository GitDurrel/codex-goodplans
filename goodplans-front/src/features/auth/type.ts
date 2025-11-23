export type Role = "SUPER_ADMIN" | "ADMIN" | "SELLER_PRO" | "SELLER_PARTICULAR" | "BUYER";

// ce que renvoie le backend
export type AccountType =
  | "buyer"
  | "seller_pro"
  | "seller_particular"
  | "admin"
  | "super_admin";

export type SellerType = "particular" | "professional";

export interface AuthUser {
  id: string;
  email: string;
  username: string;

  // dérivé de account_type
  roles: Role[];
  permissions: string[];

  hasOTPValidated: boolean;   // dérivé de email_verified
  accountType: AccountType;   // brut venant du backend (optionnel mais pratique)
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  username: string;
  account_type: AccountType;
  wantsToSell?: boolean;
  seller_type?: SellerType;
  phone?: string;
  whatsapp?: string;
  company_name?: string;
  siret?: string;
}
