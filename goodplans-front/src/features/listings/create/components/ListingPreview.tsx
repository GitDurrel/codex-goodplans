import { MapPin } from "lucide-react";

interface ListingPreviewProps {
  formData: {
    title: string;
    price: string;
    city: string;
    images: string[];
    details: Record<string, any>;
  };
  showPreview?: boolean;
  onClose?: () => void;
}

export function ListingPreview({ formData, showPreview = true, onClose }: ListingPreviewProps) {
  if (!showPreview) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Aperçu</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-blue-600 hover:underline"
          >
            Fermer
          </button>
        )}
      </div>

      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {formData.images?.[0] && (
          <img
            src={formData.images[0]}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.png";
            }}
          />
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">{formData.title || "Titre de l’annonce"}</h2>
        <p className="text-blue-600 text-lg font-bold">
          {formData.price ? Number(formData.price).toLocaleString() : "—"} MAD
        </p>
        <p className="text-gray-600 flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {formData.city || "Ville"}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Détails spécifiques</h4>
        <pre className="text-sm text-gray-600 whitespace-pre-wrap">
          {JSON.stringify(formData.details, null, 2)}
        </pre>
      </div>
    </div>
  );
}
