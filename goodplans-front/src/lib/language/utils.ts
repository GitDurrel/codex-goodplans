export type Language = "fr" | "en";

export function getLocalizedText(
  lang: Language,
  fr?: string,
  en?: string
): string {
  if (lang === "en") {
    return en || fr || "";
  }
  return fr || en || "";
}
