// src/features/user/userApi.ts
import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import type { AccountType, SellerType } from "../auth/type";

/* ----------------------------- Types backend ----------------------------- */

export interface UserPreferences {
  id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  account_type: AccountType;
  avatar_url: string | null;
  is_seller: boolean;
  seller_approved: boolean;
  show_phone: boolean;
  show_whatsapp: boolean;
  company_name: string | null;
  seller_type: SellerType | null;
  siret: string | null;
  online: boolean;
  banned_until: string | null;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  user_preferences: UserPreferences[];
}

/* -------------------------- Payloads de mise à jour --------------------- */

export type UpdateProfilePayload = Partial<{
  username: string;
  phone: string | null;
  whatsapp: string | null;
  show_phone: boolean;
  show_whatsapp: boolean;
  company_name: string | null;
  seller_type: SellerType | null;
  siret: string | null;
  language: string;
}>;

/* ----------------------------- Hooks de lecture -------------------------- */

/**
 * GET /api/user/profile
 * Récupère le profil de l'utilisateur connecté.
 */
export function useUserProfile() {
  return useFetch<UserProfile>("/user/profile");
}

/* ----------------------------- Hooks de mutation ------------------------- */
/**
 * Pattern utilisé pour les mutations :
 * - un useState interne stocke le dernier payload ("pendingPayload")
 * - useFetch est appelé avec skip = !pendingPayload
 * - une fonction (updateProfile / changeUsername / deleteAccount) met à jour
 *   ce payload et déclenche la requête.
 */

export function useUpdateProfile() {
  const [payload, setPayload] = useState<UpdateProfilePayload | null>(null);

  const fetchResult = useFetch<UserProfile>("/user/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
    skip: !payload,
  });

  function updateProfile(data: UpdateProfilePayload) {
    setPayload(data);
  }

  return {
    ...fetchResult,
    updateProfile,
  };
}

export function useChangeUsername() {
  const [username, setUsername] = useState<string | null>(null);

  const fetchResult = useFetch<UserProfile>("/user/username", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: username ? JSON.stringify({ username }) : undefined,
    skip: !username,
  });

  function changeUsername(newUsername: string) {
    setUsername(newUsername);
  }

  return {
    ...fetchResult,
    changeUsername,
  };
}

/**
 * Supprimer le compte utilisateur.
 * DELETE /api/user/account
 */
export function useDeleteAccount() {
  const [trigger, setTrigger] = useState(false);

  const fetchResult = useFetch<void>("/user/account", {
    method: "DELETE",
    skip: !trigger,
  });

  function deleteAccount() {
    setTrigger(true);
  }

  return {
    ...fetchResult,
    deleteAccount,
  };
}

/**
 * ⚠️ Upload avatar:
 * L'endpoint /api/user/avatar attend un FormData (multipart).
 * Ton hook useFetch force "Content-Type: application/json",
 * donc pour cet endpoint il faudra soit adapter useFetch,
 * soit faire un fetch direct dans un hook séparé.
 * On laisse volontairement ce cas à part pour l’instant.
 */
