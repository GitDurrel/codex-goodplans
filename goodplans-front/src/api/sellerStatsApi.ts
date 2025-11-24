const API_BASE_URL = "http://localhost:3000/api";
const AUTH_STORAGE_KEY = "gp_auth";

export interface SellerOverviewFilters {
  from?: string;
  to?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  plan_id?: string;
}

export interface SellerOverviewResponse {
  filters: SellerOverviewFilters;
  listings: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    suspended: number;
  };
  engagement: {
    totalViews: number;
    totalFavorites: number;
  };
  byCategory: Array<{
    category: string;
    total: number;
    approved?: number;
  }>;
}

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

export async function getSellerOverview(
  filters: SellerOverviewFilters = {}
): Promise<SellerOverviewResponse> {
  const params = new URLSearchParams();
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  if (filters.category) params.set("category", filters.category);
  if (filters.status) params.set("status", filters.status);
  if (typeof filters.featured === "boolean") params.set("featured", String(filters.featured));
  if (filters.plan_id) params.set("plan_id", filters.plan_id);

  const query = params.toString();
  const res = await fetch(`${API_BASE_URL}/seller/stats/overview${query ? `?${query}` : ""}`, {
    headers: getAuthHeader(),
  });

  return handleResponse<SellerOverviewResponse>(res);
}
