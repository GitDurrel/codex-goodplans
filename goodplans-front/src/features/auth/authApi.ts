// src/features/auth/authApi.ts
import type {
  LoginResponse,
  SignUpPayload,
  AuthUser,
  AccountType,
} from "./type";
import { ROLES, ROLE_PERMISSIONS, type Role } from "../../constants";
import { supabase } from "../../lib/supabase";

// const API_BASE = import.meta.env.VITE_API_URL
//   ? `${import.meta.env.VITE_API_URL}/auth`
//   : "http://localhost:3000/api/auth";

const API_BASE = `${import.meta.env.VITE_API_URL || 'https://goodplans-back.up.railway.app/api'}/auth`;
const STORAGE_KEY = "gp_auth";

/* -------------------------------------------------------------------------- */
/*                              Types backend                                 */
/* -------------------------------------------------------------------------- */

const ACCOUNT_TYPE_ROLE_MAP: Record<AccountType, Role> = {
  buyer: ROLES.BUYER,
  seller_pro: ROLES.SELLER_PRO,
  seller_particular: ROLES.SELLER_PARTICULAR,
  admin: ROLES.ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
};


type BackendUser = {
  id: string;
  user_id: string;
  email: string;
  username: string;
  account_type: AccountType;
  email_verified: boolean;
  admin?: { role: "admin" | "super_admin" } | null;
  phone?: string;
  whatsapp?: string;
  avatar_url?: string;
  company_name?: string;
  seller_approved?: boolean;
  online?: boolean;
};


type BackendTokens = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

type BackendLoginResponse = {
  user: BackendUser;
  tokens?: BackendTokens;
  accessToken?: string;
  refreshToken?: string;
};

/* -------------------------------------------------------------------------- */
/*                          Helpers de transformation                         */
/* -------------------------------------------------------------------------- */

function mapBackendUserToAuthUser(raw: BackendUser): AuthUser {
  const accountType = raw.account_type ?? "buyer";

  // rôle par défaut via account_type
  let role: Role = ACCOUNT_TYPE_ROLE_MAP[accountType] ?? ROLES.BUYER;

  // ✅ override si admin présent (info vient maintenant du back)
  if (raw.admin?.role === "super_admin") role = ROLES.SUPER_ADMIN;
  else if (raw.admin?.role === "admin") role = ROLES.ADMIN;

  const permissions = Array.from(new Set(ROLE_PERMISSIONS[role] ?? []));

  return {
    id: raw.id,
    user_id: raw.user_id,
    userId: raw.user_id,
    email: raw.email,
    username: raw.username,
    avatar_url: raw.avatar_url,
    roles: [role],
    permissions,
    hasOTPValidated: !!raw.email_verified,
    accountType,
  } as any;
}


function extractTokens(raw: BackendLoginResponse): {
  accessToken: string;
  refreshToken: string;
} {
  const tokens = raw.tokens ?? ({} as BackendTokens);

  const accessToken =
    raw.accessToken ??
    tokens.accessToken ??
    tokens.access_token ??
    "";

  const refreshToken =
    raw.refreshToken ??
    tokens.refreshToken ??
    tokens.refresh_token ??
    "";

  if (!accessToken || !refreshToken) {
    throw new Error("Tokens manquants dans la réponse du backend");
  }

  return { accessToken, refreshToken };
}

/**
 * Parse les erreurs HTTP pour avoir un message lisible
 */
async function parseError(res: Response, fallback: string) {
  let msg = fallback;

  // Si le body a déjà été lu ailleurs, on ne tente plus rien
  if (res.bodyUsed) {
    return res.statusText || msg;
  }

  let text = "";

  try {
    text = await res.text();
  } catch (e) {
    console.error("parseError: unable to read response body", e);
    return res.statusText || msg;
  }

  if (!text) {
    return res.statusText || msg;
  }

  try {
    const data = JSON.parse(text);

    if (typeof data?.message === "string") {
      msg = data.message;
    } else if (Array.isArray(data?.message)) {
      msg = data.message.join("\n");
    } else if (typeof data?.error === "string") {
      msg = data.error;
    }
  } catch {
    // ce n’est pas du JSON : on renvoie le texte brut
    msg = text;
  }

  return msg;
}



/**
 * Transforme une réponse HTTP de login / verify-otp en LoginResponse
 * ou lève une erreur avec message lisible
 */
async function parseAuthResponse(
  res: Response,
  context: string
): Promise<LoginResponse> {
  const text = await res.text();

  if (!res.ok) {
    console.error(`${context} error brut :`, res.status, text);
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  const raw = JSON.parse(text) as BackendLoginResponse;
  if (!raw.user) {
    throw new Error("Réponse d'authentification invalide : 'user' manquant");
  }

  const user = mapBackendUserToAuthUser(raw.user);
  const { accessToken, refreshToken } = extractTokens(raw);

  return { user, accessToken, refreshToken };
}

/**
 * Récupère le Bearer token depuis localStorage pour les routes protégées
 */
function getAuthHeaderFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {} as Record<string, string>;
    const parsed = JSON.parse(raw) as { accessToken?: string };
    if (!parsed.accessToken) return {} as Record<string, string>;
    return {
      Authorization: `Bearer ${parsed.accessToken}`,
    };
  } catch {
    return {} as Record<string, string>;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   API                                      */
/* -------------------------------------------------------------------------- */

/**
 * Connexion classique email + password
 */
export async function apiLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  const text = await res.text(); // ici seulement
  const raw = JSON.parse(text) as BackendLoginResponse;
  const user = mapBackendUserToAuthUser(raw.user);
  const { accessToken, refreshToken } = extractTokens(raw);

  return { user, accessToken, refreshToken };
}


/**
 * Inscription utilisateur
 */
export async function apiRegister(payload: SignUpPayload): Promise<void> {
  console.log("REGISTER payload envoyé :", payload);

  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();

  if (!res.ok) {
    console.error("REGISTER error brut :", res.status, text);
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  if (text) {
    try {
      const data = JSON.parse(text);
      console.log("REGISTER success response :", data);
    } catch {
      console.log("REGISTER success raw text :", text);
    }
  }
}

/**
 * Vérification OTP pour la validation du compte (email)
 */
export async function apiVerifyAccountOtp(
  email: string,
  code: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, code }),
  });

  return parseAuthResponse(res, "VERIFY_OTP");
}

/**
 * Déconnexion
 */
export async function apiLogout(): Promise<void> {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }
}

/**
 * Rafraîchir l’access token à partir du refreshToken
 */
export async function apiRefresh(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Mot de passe oublié
 */
export async function apiForgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Vérifier le code OTP de reset
 */
export async function apiVerifyResetCode(email: string, code: string) {
  const res = await fetch(`${API_BASE}/verify-reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Réinitialiser le mot de passe (flux "mot de passe oublié")
 * Backend attend: { email, newPassword } (pas de "code" dans ResetPasswordDto)
 */
export async function apiResetPassword(
  email: string,
  _code: string, // on garde pour compat avec le front, mais on ne l'envoie pas
  newPassword: string
) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}


/**
 * Changer le mot de passe (flux "Sécurité" dans les settings, user connecté)
 * ➜ utilise JwtAuthGuard côté backend => Bearer token requis
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ message: string }> {
  const authHeader = getAuthHeaderFromStorage();

  const res = await fetch(`${API_BASE}/change-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  return res.json();
}

/**
 * Récupérer le profil utilisateur connecté (via cookies)
 */
export async function apiGetMe(): Promise<LoginResponse> {
  const backendUrl =
    import.meta.env.VITE_API_URL || "https://goodplans-back.up.railway.app/api";

  // 🔐 ajoute le Bearer token si dispo (important, car ton /auth/me utilise JwtAuthGuard)
  const authHeader = getAuthHeaderFromStorage();

  const res = await fetch(`${backendUrl}/auth/me`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeader,
    },
  });

  if (!res.ok) {
    const msg = await parseError(res, `HTTP ${res.status}`);
    throw new Error(msg);
  }

  const raw = (await res.json()) as BackendLoginResponse;

  // ⚠️ /auth/me renvoie { user, tokens } dans ton back
  const user = mapBackendUserToAuthUser(raw.user);
  const { accessToken, refreshToken } = extractTokens(raw);

  return { user, accessToken, refreshToken };
}

/**
 * Connexion Google OAuth
 * Redirige simplement vers le backend qui gère tout via Supabase
 */
export function apiGoogleLogin(): void {
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const googleInitUrl = `${backendUrl}/auth/google`;

  console.log('🔄 Redirection vers Google OAuth via backend...');
  console.log('📍 URL:', googleInitUrl);

  // Redirection directe vers le backend
  window.location.href = googleInitUrl;
}


export async function apiGoogleLoginWeb() {
  const redirectTo = `${window.location.origin}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });

  if (error) throw new Error(error.message);

  // Supabase te donne une URL Google à ouvrir
  if (data?.url) window.location.href = data.url;
}

export async function apiOAuthFinalize(providerUserId: string, email: string) {
  const base = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const res = await fetch(`${base}/auth/oauth-finalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ providerUserId, email }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}
