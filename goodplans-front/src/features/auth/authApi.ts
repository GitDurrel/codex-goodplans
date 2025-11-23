// src/features/auth/authApi.ts
import type {
  LoginResponse,
  SignUpPayload,
  AuthUser,
  AccountType,
} from "./type";
import { ROLES, ROLE_PERMISSIONS, type Role } from "../../constants";

const API_BASE = "http://localhost:3000/api/auth";

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
  email: string;
  username: string;
  account_type: AccountType;
  email_verified: boolean;
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
  const role = ACCOUNT_TYPE_ROLE_MAP[accountType] ?? ROLES.BUYER;

  const permissions = Array.from(new Set(ROLE_PERMISSIONS[role] ?? []));

  return {
    id: raw.id,
    email: raw.email,
    username: raw.username,
    roles: [role],
    permissions,
    hasOTPValidated: !!raw.email_verified,
    accountType,
  };
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

    let msg = `HTTP ${res.status}`;
    try {
      const data = JSON.parse(text);
      if (typeof data?.message === "string") {
        msg = data.message;
      } else if (Array.isArray(data?.message)) {
        msg = data.message.join("\n");
      }
    } catch {
      // ignore parse error
    }

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

/* -------------------------------------------------------------------------- */
/*                                   API                                      */
/* -------------------------------------------------------------------------- */

/**
 * Connexion classique email + password
 */
export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const text = await res.text();

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = JSON.parse(text);
      if (typeof data?.message === "string") msg = data.message;
      else if (Array.isArray(data?.message)) msg = data.message.join("\n");
    } catch { }
    throw new Error(msg);
  }

  const raw = JSON.parse(text) as BackendLoginResponse;
  const user = mapBackendUserToAuthUser(raw.user);
  const { accessToken, refreshToken } = extractTokens(raw);

  return { user, accessToken, refreshToken };
}

/**
 * Inscription utilisateur
 * 🔹 IMPORTANT : le backend NE renvoie PAS user + tokens ici,
 * il crée le compte + génère l'OTP + envoie l'email.
 * On ne fait donc que vérifier le succès et remonter le message éventuel.
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

    let msg = `HTTP ${res.status}`;
    try {
      const data = JSON.parse(text);
      if (typeof data?.message === "string") {
        msg = data.message;
      } else if (Array.isArray(data?.message)) {
        msg = data.message.join("\n");
      }
    } catch {
      // ignore JSON parse error
    }

    throw new Error(msg);
  }

  // succès : le backend a probablement renvoyé { message: "...", ... }
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
 * 🔹 Ici, le backend renvoie bien user + tokens (cf. Swagger + screenshot)
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
    throw new Error(`HTTP ${res.status}`);
  }
}

/**
 * Rafraîchir l’access token à partir du refreshToken
 */
export async function apiRefresh(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
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
    throw new Error(`HTTP ${res.status}`);
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
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Réinitialiser le mot de passe
 */
export async function apiResetPassword(
  email: string,
  code: string,
  newPassword: string
) {
  const res = await fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}
