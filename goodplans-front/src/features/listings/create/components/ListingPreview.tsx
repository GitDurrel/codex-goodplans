import { MapPin } from "lucide-react";

export function ListingPreview({ listing, details }: any) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <h3 className="text-xl font-bold">Aperçu</h3>

      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {listing.images?.[0] && (
          <img
            src={listing.images[0]}
            alt="preview"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{listing.title}</h2>
        <p className="text-blue-600 text-lg font-bold">
          {listing.price?.toLocaleString()} MAD
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {listing.city}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Détails spécifiques</h4>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
          {JSON.stringify(details, null, 2)}
        </pre>
      </div>
    </div>
  );
}
