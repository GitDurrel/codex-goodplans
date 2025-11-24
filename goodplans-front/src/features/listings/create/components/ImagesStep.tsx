import { ImagePlus, Trash2, Upload } from "lucide-react";

interface ImagesStepProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function ImagesStep({ images, onChange }: ImagesStepProps) {
  function handleAddUrl() {
    const url = prompt("Ajoutez l'URL de l'image");
    if (url) {
      onChange([...images, url]);
    }
  }

  function handleRemove(index: number) {
    const next = images.filter((_, idx) => idx !== index);
    onChange(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Photos</h3>
          <p className="text-sm text-gray-500">
            Ajoutez au moins une photo pour mettre votre annonce en avant.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" /> Ajouter une photo
        </button>
      </div>

      {images.length === 0 ? (
        <div className="h-48 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center px-4">
          <ImagePlus className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Aucune image pour le moment
          </p>
          <p className="text-xs text-gray-500">Cliquez sur "Ajouter une photo" pour coller une URL.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={url + index}
              className="relative rounded-xl overflow-hidden border border-gray-200"
            >
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png";
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-black/60 text-white h-7 w-7"
                aria-label="Supprimer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddUrl}
            className="flex items-center justify-center h-32 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition"
          >
            <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
              <ImagePlus className="h-5 w-5 text-gray-400" />
              <span>Ajouter</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
