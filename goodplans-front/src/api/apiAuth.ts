const API_BASE_URL = "/api/auth";
const AUTH_STORAGE_KEY = "gp_auth";

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
 * Change le mot de passe d'un utilisateur connecté.
 */
export async function changePassword(oldPassword: string, newPassword: string): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE_URL}/change-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  return handleResponse(res);
}

/**
 * Vérifie le code envoyé par email dans le cadre du reset password.
 */
export async function verifyResetCode(email: string, code: string): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE_URL}/verify-reset-code`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  return handleResponse(res);
}

/**
 * Réinitialise le mot de passe après vérification du code OTP.
 */
export async function resetPassword(email: string, newPassword: string): Promise<{ message?: string }> {
  const res = await fetch(`${API_BASE_URL}/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  return handleResponse(res);
}
