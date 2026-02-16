import { Calendar, MessageSquare } from "lucide-react";
import type { ListingDetails } from "../types";
import { useLanguage } from "../../../lib/language/LanguageContext";
import { getLocalizedText } from "../../../lib/language/utils";

interface ListingDescriptionProps {
  listing: ListingDetails;
}

export function ListingDescription({ listing }: ListingDescriptionProps) {

  const { lang, t } = useLanguage();

  const displayDescription = getLocalizedText(
    lang,
    listing.description,
    (listing as any).description_en
  );



  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm min-h-[220px]">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <span className="rounded-full bg-sky-100 p-2 text-sky-600">
          <MessageSquare className="h-4 w-4" />
        </span>
        {t("listing.description")}
      </h2>

      <p className="whitespace-pre-line text-slate-700">
        {displayDescription}
      </p>

      {listing.created_at && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          {t("listing.publishedOn")}{" "}
          {new Date(listing.created_at).toLocaleDateString(
            lang === "fr" ? "fr-FR" : "en-GB"
          )}
        </div>
      )}
    </section>

  );
}
