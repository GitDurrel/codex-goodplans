import { Calendar, MessageSquare } from "lucide-react";
import type { ListingDetails } from "../types";

interface ListingDescriptionProps {
  listing: ListingDetails;
}

export function ListingDescription({ listing }: ListingDescriptionProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
        <span className="rounded-full bg-sky-100 p-2 text-sky-600">
          <MessageSquare className="h-4 w-4" />
        </span>
        Description
      </h2>
      <p className="whitespace-pre-line text-slate-700">{listing.description}</p>
      {listing.created_at && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
          <Calendar className="h-4 w-4" />
          Publié le {new Date(listing.created_at).toLocaleDateString("fr-FR")}
        </div>
      )}
    </section>
  );
}
