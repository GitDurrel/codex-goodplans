import { useFetch } from "../../hooks/useFetch";

const API_BASE_URL = "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";
const CATEGORIES_BASE_PATH = "/categories";

/* ---------- Types ---------- */

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  icon?: string;
}

/* ---------- Helpers internes pour les mutations (POST/PATCH/DELETE) ---------- */

function getAuthHeader(): HeadersInit {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { accessToken?: string };
    if (!parsed.accessToken) return {};
    return {
      Authorization: `Bearer ${parsed.accessToken}`,
    };
  } catch {
    return {};
  }
}

async function authJsonFetch<T>(
  path: string,
  init: RequestInit
): Promise<T> {
  const headers = new Headers(init.headers as HeadersInit | undefined);

  // JSON par défaut
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Auth Bearer
  const authHeader = getAuthHeader();
  Object.entries(authHeader).forEach(([key, value]) => {
    if (value != null) headers.set(key, String(value));
  });

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await res.text();

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = JSON.parse(text);
      if (typeof data?.message === "string") msg = data.message;
      else if (Array.isArray(data?.message)) msg = data.message.join("\n");
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}

/* ---------- Hooks READ (GET) basés sur useFetch ---------- */

// GET /api/categories
export function useCategories(options?: { skip?: boolean }) {
  return useFetch<Category[]>(CATEGORIES_BASE_PATH, {
    skip: options?.skip,
  });
}

// GET /api/categories/:id
export function useCategory(id?: string, options?: { skip?: boolean }) {
  return useFetch<Category | null>(
    id ? `${CATEGORIES_BASE_PATH}/${id}` : "",
    {
      skip: !id || options?.skip,
    }
  );
}

/* ---------- Mutations CRUD ---------- */

// POST /api/categories
export async function createCategory(
  payload: CategoryPayload
): Promise<Category> {
  return authJsonFetch<Category>(CATEGORIES_BASE_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// PATCH /api/categories/:id
export async function updateCategory(
  id: string,
  payload: Partial<CategoryPayload>
): Promise<Category> {
  return authJsonFetch<Category>(`${CATEGORIES_BASE_PATH}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// DELETE /api/categories/:id
export async function deleteCategory(id: string): Promise<void> {
  await authJsonFetch<void>(`${CATEGORIES_BASE_PATH}/${id}`, {
    method: "DELETE",
  });
}
