export function mapUiCategoryToApi(uiCategory: string | undefined | null) {
  if (!uiCategory) return undefined;

  const map: Record<string, string> = {
    // UI → API
    immobilier: "real_estate",
    real_estate: "real_estate",

    vehicules: "vehicle",
    vehicle: "vehicle",

    services: "service",
    service: "service",

    artisanat: "craft",
    craft: "craft",
  };

  return map[uiCategory] ?? uiCategory;
}

// src/features/listings/utils/mappers.ts

// src/features/listings/utils/mappers.ts

// src/features/listings/utils/mappers.ts

export function mapUiTransactionToApi(uiTx: string | undefined | null) {
  // ✅ On ne mappe plus rien, on renvoie la valeur telle quelle
  return uiTx || undefined;
}    

