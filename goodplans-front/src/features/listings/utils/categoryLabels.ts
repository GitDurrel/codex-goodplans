import { translations } from "../../../lib/language/translations";

export type CategoryKey = "vehicle" | "real_estate" | "services" | "craft" | string;

// const CATEGORY_LABELS: Record<string, string> = {
//   vehicle: "Véhicules",
//   real_estate: "Immobilier",
//   services: "Services",
//   craft: "Artisanat",
// };

const CATEGORY_GRADIENTS: Record<string, string> = {
  vehicle: "from-emerald-500 to-emerald-600",
  real_estate: "from-sky-500 to-sky-600",
  services: "from-indigo-500 to-indigo-600",
  craft: "from-amber-500 to-amber-600",
};

// const TRANSACTION_LABELS: Record<string, string> = {
//   rent: "À louer ",
//   sale: "À vendre",
//   location: "À louer",
//   achat: "À vendre",
// };

// export function getCategoryLabel(category: string): string {
//   return CATEGORY_LABELS[category] ?? category;
// }

export function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? "from-slate-500 to-slate-600";
}

// export function getTransactionLabel(transaction?: string | null): string | null {
//   if (!transaction) return null;
//   return TRANSACTION_LABELS[transaction] ?? transaction;
// }


export function getCategoryLabel(
  category: string,
  lang: "fr" | "en"
): string {
  const normalized =
    category === "service" ? "services" : category;

  return (
    translations[lang]?.categories?.[
    normalized as keyof typeof translations.fr.categories
    ] ?? category
  );
}
