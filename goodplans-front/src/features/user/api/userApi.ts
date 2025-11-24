import type { AccountType, SellerType, UpdateProfilePayload, UserProfile } from "../types";

const API_BASE_URL = "http://localhost:3000/api";
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

export async function getProfile(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    headers: jsonHeaders(),
  });

  return handleResponse<UserProfile>(res);
}

export async function updateProfile(data: UpdateProfilePayload): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<UserProfile>(res);
}

export async function updateUsername(username: string): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/user/username`, {
    method: "PUT",
    headers: jsonHeaders(),
    body: JSON.stringify({ username }),
  });

  return handleResponse<UserProfile>(res);
}

export async function uploadAvatar(file: File): Promise<{ avatar_url: string; message?: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/user/avatar`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });

  return handleResponse<{ avatar_url: string; message?: string }>(res);
}

export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/user/account`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  return handleResponse<void>(res);
}

export function isSellerAccount(accountType: AccountType | null | undefined, isSellerFlag?: boolean | null) {
  if (!accountType && !isSellerFlag) return false;
  return (
    accountType === "seller_particular" ||
    accountType === "seller_pro" ||
    isSellerFlag === true
  );
}

export function normalizeSellerType(
  accountType: AccountType | null | undefined,
  sellerType: SellerType | null | undefined
): SellerType {
  if (sellerType) return sellerType;
  if (accountType === "seller_pro") return "professional";
  if (accountType === "seller_particular") return "particular";
  return "particular";
}
