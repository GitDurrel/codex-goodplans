export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SELLER_PRO: "SELLER_PRO",
  SELLER_PARTICULAR: "SELLER_PARTICULAR",
  BUYER: "BUYER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PERMISSIONS = {
  // === Listings génériques (toutes catégories) ===
  LISTING_CREATE: "listing.create",          // créer une annonce
  LISTING_EDIT_OWN: "listing.edit.own",      // modifier ses propres annonces
  LISTING_DELETE_OWN: "listing.delete.own",  // supprimer ses propres annonces

  LISTING_APPROVE: "listing.approve",        // modération (admin)

  // Mise en avant
  LISTING_FEATURE_BUY: "listing.feature.buy",   // acheter un plan de mise en avant
  FEATURE_PLAN_MANAGE: "feature.plan.manage",   // CRUD sur les featured_plans

  // Favoris
  FAVORITES_MANAGE: "favorites.manage",

  // Messages
  MESSAGES_ACCESS: "messages.access",

  // Taxonomies & catalogues
  CATEGORY_MANAGE: "category.manage",           // CRUD categories
  SUBCATEGORY_MANAGE: "subcategory.manage",     // CRUD subcategories
  VEHICLE_BRAND_MANAGE: "vehicle.brand.manage", // CRUD marques
  VEHICLE_MODEL_MANAGE: "vehicle.model.manage", // CRUD modèles

  // Admin
  USER_MANAGE: "admin.user.manage",             // bannir / supprimer / gérer comptes
  SELLER_APPROVE: "admin.seller.approve",       // approuver/rejeter vendeurs
  ADMIN_STATS_VIEW: "admin.stats.view",         // dashboard stats admin

  // Seller
  SELLER_STATS_VIEW: "seller.stats.view",       // stats vendeur (seller/stats)
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Mapping rôle → permissions (helper front pour les guards & menus)
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: [
    // SUPER_ADMIN a tout
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.ADMIN]: [
    // Listings
    PERMISSIONS.LISTING_CREATE,
    PERMISSIONS.LISTING_EDIT_OWN,
    PERMISSIONS.LISTING_DELETE_OWN,
    PERMISSIONS.LISTING_APPROVE,

    // Mise en avant
    PERMISSIONS.FEATURE_PLAN_MANAGE,

    // Taxonomies / catalogues
    PERMISSIONS.CATEGORY_MANAGE,
    PERMISSIONS.SUBCATEGORY_MANAGE,
    PERMISSIONS.VEHICLE_BRAND_MANAGE,
    PERMISSIONS.VEHICLE_MODEL_MANAGE,

    // Admin
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.SELLER_APPROVE,
    PERMISSIONS.ADMIN_STATS_VIEW,

    // Messages + favoris (pour tester comme un user normal)
    PERMISSIONS.FAVORITES_MANAGE,
    PERMISSIONS.MESSAGES_ACCESS,
  ],

  [ROLES.SELLER_PRO]: [
    PERMISSIONS.LISTING_CREATE,
    PERMISSIONS.LISTING_EDIT_OWN,
    PERMISSIONS.LISTING_DELETE_OWN,
    PERMISSIONS.LISTING_FEATURE_BUY, // achat plan mise en avant

    PERMISSIONS.FAVORITES_MANAGE,
    PERMISSIONS.MESSAGES_ACCESS,
    PERMISSIONS.SELLER_STATS_VIEW,
  ],

  [ROLES.SELLER_PARTICULAR]: [
    PERMISSIONS.LISTING_CREATE,
    PERMISSIONS.LISTING_EDIT_OWN,
    PERMISSIONS.LISTING_DELETE_OWN,
    PERMISSIONS.LISTING_FEATURE_BUY,

    PERMISSIONS.FAVORITES_MANAGE,
    PERMISSIONS.MESSAGES_ACCESS,
    PERMISSIONS.SELLER_STATS_VIEW,
  ],

  [ROLES.BUYER]: [
    PERMISSIONS.FAVORITES_MANAGE,
    PERMISSIONS.MESSAGES_ACCESS,
  ],
};

//  Routes front qui nécessitent une authentification (peu importe le rôle)
export const PROTECTED_ROUTES = [
  // Profil & compte
  "/profile",
  "/account",
  "/account/security",

  // Annonces côté vendeur
  "/create-listing",
  "/create-request",
  "/my-listings",
  "/seller/dashboard",
  "/seller/stats",
  "/seller/featured-orders",

  // Favoris & messages
  "/favorites",
  "/messages",

  // Admin
  "/admin",
  "/admin/dashboard",
  "/admin/users",
  "/admin/listings",
  "/admin/stats",
  "/admin/featured-plans",
  "/admin/categories",
  "/admin/subcategories",
  "/admin/vehicle-brands",
  "/admin/vehicle-models",
] as const;
