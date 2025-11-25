import type { UpdateProfilePayload, UserPreferences, UserProfile } from "../features/user/types";

const API_BASE_URL = "/api";
const AUTH_STORAGE_KEY = "gp_auth";

/**
 * Extraire l'en-tête Authorization depuis le stockage local.
 */
function getAuthHeader(): Record<string, string> {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { accessToken?: string };
    if (!parsed.accessToken) return {};
    return { Authorization: `Bearer ${parsed.accessToken}` };
  } catch {
    return {};
  }
}

const jsonHeaders = () => ({ "Content-Type": "application/json", ...getAuthHeader() });

async function handleResponse<T>(res: Response): Promise<T> {
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = typeof payload === "string" ? payload : payload?.message;
    throw new Error(message || `HTTP ${res.status}`);
  }

  return payload as T;
}

/**
 * Récupère le profil complet de l'utilisateur connecté.
 */
export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    credentials: "include",
    headers: jsonHeaders(),
  });

  return handleResponse<UserProfile>(res);
}

/**
 * Met à jour le profil utilisateur. Ne pas envoyer account_type pour éviter de violer
 * les règles métier (les vendeurs ne peuvent pas revenir à un compte acheteur).
 */
export async function updateProfile(
  data: UpdateProfilePayload & { user_preferences?: Partial<UserPreferences> }
): Promise<UserProfile> {
  const payload = { ...data };
  // On s'assure de ne jamais pousser un changement de type de compte depuis le front.
  delete (payload as UpdateProfilePayload).account_type;

  console.log("updateProfile payload", payload);

  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    credentials: "include",
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<UserProfile>(res);
}

/**
 * Supprime le compte de l'utilisateur connecté.
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/user/account`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...getAuthHeader() },
  });

  return handleResponse<void>(res);
}
