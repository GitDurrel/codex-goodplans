export function mapCategorySlugToTranslationKey(slug?: string | null): string {
  if (!slug) return "";

  const s = slug.toLowerCase();

  switch (s) {
    case "real_estate":
      return "immobilier";

    case "vehicle":
      return "vehicules";

    case "service":
    case "services":
      return "services";

    case "craft":
      return "artisanat";

    default:
      return s;
  }
}
