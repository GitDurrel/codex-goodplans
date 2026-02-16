// src/lib/apiRequest.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

type StoredAuth = {
  accessToken?: string;
  refreshToken?: string;
  user?: any;
};

export async function apiRequest<T>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  path: string,
  body?: any,
  extraInit: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    ...(extraInit.headers || {}),
  };

  // On ne force "Content-Type" que si ce n'est PAS du FormData
  if (!(body instanceof FormData)) {
    (headers as any)["Content-Type"] = "application/json";
  }

  // Récupérer le token depuis gp_auth (AuthContext)
  const raw = localStorage.getItem("gp_auth");
  if (raw) {
    try {
      const parsed: StoredAuth = JSON.parse(raw);
      if (parsed.accessToken) {
        (headers as any).Authorization = `Bearer ${parsed.accessToken}`;
      }
    } catch {
      // ignore JSON error
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    ...extraInit,
  });

  if (!res.ok) {
    let errorMessage = "Erreur réseau";
    try {
      const data = await res.json();
      errorMessage = data.message || JSON.stringify(data);
    } catch {
      // ignore
    }
    throw new Error(errorMessage);
  }

  if (res.status === 204) {
    // no content
    return undefined as T;
  }

  return (await res.json()) as T;
}
