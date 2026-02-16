// src/features/admin/adminApi.ts
import { apiRequest } from "../../lib/apiRequest";
import { authFetchJson } from "../listings/apiListings";

// ===================== USERS =====================

export type AdminUser = {
  // id interne (certains écrans utilisent `id`, d’autres `user_id`)
  id?: string;
  user_id: string;

  username: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  account_type: string | null;
  avatar_url: string | null;
  seller_approved: boolean;
  seller_type: string | null;
  company_name: string | null;

  // champs utilisés dans AdminUsersPage
  is_seller?: boolean;
  email_verified?: boolean;

  online: boolean;
  banned_until: string | null;
  ban_reason: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

export type UsersMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type UsersResponse = {
  data: AdminUser[];
  meta: UsersMeta;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  account_type?: string;
  is_seller?: boolean;
  seller_approved?: boolean;
  banned?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

const buildQuery = (params: Record<string, any>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") {
      qs.set(k, String(v));
    }
  });
  const result = qs.toString();
  return result ? `?${result}` : "";
};

// --- users ---

export function apiGetUsers(params: GetUsersParams): Promise<UsersResponse> {
  const query = buildQuery(params);
  return apiRequest<UsersResponse>("GET", `/admin/users${query}`);
}

export function apiBanUser(
  userId: string,
  data: { reason: string; banned_until?: string | null }
) {
  return apiRequest<{ message: string }>(
    "PUT",
    `/admin/users/${userId}/ban`,
    data
  );
}

export function apiUnbanUser(userId: string) {
  return apiRequest<{ message: string }>("PUT", `/admin/users/${userId}/unban`);
}

export function apiApproveSeller(userId: string) {
  return apiRequest<{ message: string }>(
    "PUT",
    `/admin/sellers/${userId}/approve`
  );
}

export function apiRejectSeller(userId: string, reason: string) {
  return apiRequest<{ message: string }>(
    "PUT",
    `/admin/sellers/${userId}/reject`,
    { reason }
  );
}

export function apiDeleteUser(userId: string) {
  return apiRequest<{ message: string }>("DELETE", `/admin/users/${userId}`);
}

// --- admins ---

export type AdminRole = "admin" | "super_admin";

export type CreateAdminPayload = {
  email: string;
  role: AdminRole;
};

export type UpdateAdminPayload = {
  role?: AdminRole;
};

export function apiCreateAdmin(payload: CreateAdminPayload) {
  return apiRequest<{ message: string }>("POST", "/admin/admins", payload);
}

export function apiUpdateAdmin(adminId: string, payload: UpdateAdminPayload) {
  return apiRequest<{ message: string }>(
    "PUT",
    `/admin/admins/${adminId}`,
    payload
  );
}

export function apiRemoveAdmin(adminId: string) {
  return apiRequest<{ message: string }>(
    "DELETE",
    `/admin/admins/${adminId}`
  );
}

// ===================== LISTINGS (ADMIN) =====================

export type AdminListingUser = {
  user_id: string;
  username: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  account_type: string | null;
  avatar_url: string | null;
  seller_approved: boolean;
  seller_type: string | null;
  company_name: string | null;
};

export type AdminListing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string | null;
  city: string;
  region: string;
  transaction_type: string | null;
  images: string[];
  status: string | null;
  is_approved: boolean;
  views: number;
  created_at: string;
  updated_at: string | null;
  user_id: string;
  rejection_reason: string | null;
  suspension_reason: string | null;
  approved_at: string | null;
  approved_by: string | null;
  user: AdminListingUser;
};

export type GetAdminListingsParams = {
  category?: string;
  subcategory?: string;
  city?: string;
  region?: string;
  transaction_type?: "sale" | "rent";
  minPrice?: number;
  maxPrice?: number;
};

export function apiAdminGetListings(
  params: GetAdminListingsParams = {}
): Promise<AdminListing[]> {
  const query = buildQuery(params);
  return apiRequest<AdminListing[]>("GET", `/listings${query}`);
}

export type AdminListingApprovalAction = "approve" | "reject" | "suspend";

export type AdminListingApprovalPayload = {
  action: AdminListingApprovalAction;
  rejection_reason?: string;
  suspension_reason?: string;
};

export function apiAdminUpdateListingStatus(
  id: string,
  payload: AdminListingApprovalPayload
) {
  return apiRequest<AdminListing>("PATCH", `/listings/${id}/approval`, payload);
}

export function apiAdminDeleteListing(id: string) {
  return apiRequest<void>("DELETE", `/listings/${id}`);
}


// ===================== ADVERTISING REQUESTS (DEMANDES DE DEVIS) =====================

export type AdvertisingRequestStatus =
  | "pending"
  | "read"
  | "replied"
  | "archived";

export type AdvertisingRequest = {
  id: string;
  name: string;
  company: string;
  email: string;
  duration: string;
  ad_space: {
    topOfPage: boolean;
    popup: boolean;
    carousel: boolean;
    searchPage: boolean;
  };
  created_at: string;
  updated_at: string;
  status: AdvertisingRequestStatus;
  admin_notes: string | null;
};

export type GetAdvertisingRequestsParams = {
  status?: AdvertisingRequestStatus | "all";
};

export function apiAdminGetAdvertisingRequests(
  params: GetAdvertisingRequestsParams = {}
): Promise<AdvertisingRequest[]> {
  const query = buildQuery(params);
  return apiRequest<AdvertisingRequest[]>(
    "GET",
    `/admin/advertising-requests${query}`
  );
}

export function apiAdminGetAdvertisingRequest(
  id: string
): Promise<AdvertisingRequest> {
  return apiRequest<AdvertisingRequest>("GET", `/admin/advertising-requests/${id}`);
}


export function apiAdminUpdateAdvertisingRequestStatus(
  id: string,
  status: AdvertisingRequestStatus
) {
  return apiRequest<AdvertisingRequest>(
    "PATCH",
    `/admin/advertising-requests/${id}/status`,
    { status }
  );
}

export function apiAdminUpdateAdvertisingRequestNotes(
  id: string,
  admin_notes: string | null
) {
  return apiRequest<AdvertisingRequest>(
    "PATCH",
    `/admin/advertising-requests/${id}/notes`,
    { admin_notes }
  );
}

// ===================== ADMIN NOTIFICATIONS =====================

export type AdminNotification = {
  id: number;
  user_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string | null;
};

export function apiGetAdminNotifications(): Promise<AdminNotification[]> {
  return apiRequest<AdminNotification[]>("GET", "/admin/notifications");
}

export function apiMarkNotificationAsRead(id: number) {
  return apiRequest<AdminNotification>(
    "PATCH",
    `/admin/notifications/${id}/read`,
    {}
  );
}

export function apiMarkAllNotificationsAsRead() {
  return apiRequest<{ message?: string }>(
    "PATCH",
    `/admin/notifications/read-all`,
    {}
  );
}

// ===================== PROMO BANNERS (ENCARTS PUBLICITAIRES) =====================

export type PromoBanner = {
  id: string;
  title: string;
  description: string | null;
  image_desktop: string;
  image_mobile: string;
  link_url: string | null;
  is_active: boolean;
  start_date: string | null;     // ISO string
  end_date: string | null;       // ISO string
  position: number | null;
  placements:
  {
    topOfPage: boolean;
    popup: boolean;
    carousel: boolean;
    searchPage: boolean;
  };
  created_at: string;
  updated_at: string | null;
};

export type CreatePromoBannerPayload = {
  title: string;
  description?: string | null;
  image_desktop: string;
  image_mobile: string;
  link_url?: string | null;
  is_active?: boolean;
  start_date?: string | null;    // "2025-11-29" ou ISO, tu peux laisser null
  end_date?: string | null;
  position?: number | null;
  placements?:
  {
    topOfPage: boolean;
    popup: boolean;
    carousel: boolean;
    searchPage: boolean;
  };
};

export type UpdatePromoBannerPayload = Partial<CreatePromoBannerPayload>;

export function apiGetPromoBanners(): Promise<PromoBanner[]> {
  return apiRequest<PromoBanner[]>("GET", "/promo-banners");
}

export function apiCreatePromoBanner(payload: CreatePromoBannerPayload) {
  return apiRequest<PromoBanner>("POST", "/promo-banners", payload);
}

export function apiUpdatePromoBanner(
  id: string,
  payload: UpdatePromoBannerPayload
) {
  return apiRequest<PromoBanner>("PATCH", `/promo-banners/${id}`, payload);
}

export function apiDeletePromoBanner(id: string) {
  return apiRequest<{ message: string }>("DELETE", `/promo-banners/${id}`);
}

export type PromoBannerUploadResponse = {
  urls: string[];
  message: string;
};

export function apiUploadPromoBannerImages(
  files: File[]
): Promise<PromoBannerUploadResponse> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return apiRequest<PromoBannerUploadResponse>(
    "POST",
    "/uploads/promo-banners-images",
    formData
  );
}

// ===================== Mise en avant =====================


/* ---------- Types ---------- */

export type FeaturedOrderStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface AdminFeaturedOrderPlan {
  id: string;
  name: string;
  description?: string | null;
  duration_days: number;
  price: number;
}

export interface AdminFeaturedOrderSeller {
  user_id: string;
  username: string | null;
  email: string | null;
}

export interface AdminFeaturedOrderListing {
  id: string;
  title: string;
  price: number;
  category: string;
}

export interface AdminFeaturedOrder {
  id: string;
  listing_id: string;
  seller_id: string;
  plan_id: string;
  status: FeaturedOrderStatus;
  started_at: string;
  ends_at: string;
  payment_reference?: string | null;
  created_at: string;
  updated_at: string;

  listing: AdminFeaturedOrderListing;
  plan: AdminFeaturedOrderPlan;
  seller: AdminFeaturedOrderSeller;
}

export interface GetAdminFeaturedOrdersParams {
  status?: FeaturedOrderStatus;
  seller_id?: string;
  listing_id?: string;
  from?: string; // "2025-01-01"
  to?: string;   // "2025-12-31"
}

/* ---------- API Calls ---------- */

/**
 * GET /api/admin/featured/orders
 */
export async function apiAdminGetFeaturedOrders(
  params: GetAdminFeaturedOrdersParams = {}
): Promise<AdminFeaturedOrder[]> {
  const search = new URLSearchParams();

  if (params.status) search.set("status", params.status);
  if (params.seller_id) search.set("seller_id", params.seller_id);
  if (params.listing_id) search.set("listing_id", params.listing_id);
  if (params.from) search.set("from", params.from);
  if (params.to) search.set("to", params.to);

  const qs = search.toString();
  const url = `/admin/featured/orders${qs ? `?${qs}` : ""}`;

  return authFetchJson<AdminFeaturedOrder[]>(url);
}

/**
 * PATCH /api/admin/featured/orders/:id/cancel
 */
export async function apiAdminCancelFeaturedOrder(
  id: string
): Promise<{ message: string }> {
  return authFetchJson<{ message: string }>(
    `/admin/featured/orders/${encodeURIComponent(id)}/cancel`,
    {
      method: "PATCH",
    }
  );
}

// ===================== Mise en avant - PLANS =====================

export interface AdminFeaturedPlan {
  id: string;
  name: string;
  description?: string | null;
  duration_days: number;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateFeaturedPlanPayload {
  name: string;
  description?: string | null;
  duration_days: number;
  price: number;
  is_active?: boolean;
}

export interface UpdateFeaturedPlanPayload {
  name?: string;
  description?: string | null;
  duration_days?: number;
  price?: number;
  is_active?: boolean;
}

/**
 * GET /api/admin/featured/plans
 */
export async function apiAdminGetFeaturedPlans(): Promise<AdminFeaturedPlan[]> {
  return authFetchJson<AdminFeaturedPlan[]>("/admin/featured/plans");
}

/**
 * POST /api/admin/featured/plans
 */
export async function apiAdminCreateFeaturedPlan(
  body: CreateFeaturedPlanPayload
): Promise<AdminFeaturedPlan> {
  return authFetchJson<AdminFeaturedPlan>("/admin/featured/plans", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * PATCH /api/admin/featured/plans/:id
 */
export async function apiAdminUpdateFeaturedPlan(
  id: string,
  body: UpdateFeaturedPlanPayload
): Promise<AdminFeaturedPlan> {
  return authFetchJson<AdminFeaturedPlan>(
    `/admin/featured/plans/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    }
  );
}

/**
 * DELETE (soft) /api/admin/featured/plans/:id
 * -> côté back ça met is_active = false
 */
export async function apiAdminDeleteFeaturedPlan(
  id: string
): Promise<AdminFeaturedPlan> {
  return authFetchJson<AdminFeaturedPlan>(
    `/admin/featured/plans/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );
}

// ===================== SUPPORT REQUESTS =====================

export type SupportRequestStatus = "pending" | "read" | "replied" | "archived";

export type SupportRequest = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;

  // optionnels si tu les as côté back (recommandé)
  user_id?: string | null;

  status: SupportRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GetSupportRequestsParams = {
  status?: SupportRequestStatus | "all";
  search?: string; // name/email/subject
};

export function apiCreateSupportRequest(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return apiRequest<{ message?: string; data?: SupportRequest }>(
    "POST",
    "/support/requests",
    payload
  );
}

export function apiAdminGetSupportRequests(
  params: GetSupportRequestsParams = {}
): Promise<SupportRequest[]> {
  const query = buildQuery(params);
  return apiRequest<SupportRequest[]>("GET", `/admin/support/requests${query}`);
}

export function apiAdminGetSupportRequest(id: string): Promise<SupportRequest> {
  return apiRequest<SupportRequest>("GET", `/admin/support/requests/${id}`);
}

export function apiAdminUpdateSupportRequest(
  id: string,
  payload: { status?: SupportRequestStatus; admin_notes?: string | null }
): Promise<SupportRequest> {
  return apiRequest<SupportRequest>(
    "PATCH",
    `/admin/support/requests/${id}`,
    payload
  );
}

export function apiAdminDeleteSupportRequest(id: string) {
  return apiRequest<{ message?: string }>(
    "DELETE",
    `/admin/support/requests/${id}`
  );
}
