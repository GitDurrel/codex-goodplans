import { useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../../../lib/language/LanguageContext";

interface ImagesStepProps {
  images: string[];
  uploading?: boolean;
  onSelectFiles: (files: FileList) => Promise<void> | void;
  onRemoveImage: (index: number) => void;
}

export function ImagesStep({ images, uploading = false, onSelectFiles, onRemoveImage }: ImagesStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const hasNoImage = images.length === 0;

  function openFilePicker() {
    if (uploading) return;
    fileInputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    try {
      await onSelectFiles(files);
    } catch (err: any) {
      setError(err?.message || t("createListing.images.uploadError"));
    } finally {
      e.target.value = "";
    }
  }

  function handleRemove(index: number) {
    onRemoveImage(index);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ImagePlus className="h-5 w-5 text-blue-600" />
            {t("createListing.steps.images")}
          </h3>
          <p className="text-sm text-gray-500">{t("createListing.images.helper")}</p>
        </div>

        <button
          type="button"
          onClick={openFilePicker}
          disabled={uploading || images.length >= 10}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-2 text-white text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {uploading ? t("createListing.images.uploading") : t("createListing.images.addOne")}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {hasNoImage && !uploading && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{t("createListing.images.required")}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {images.length === 0 ? (
        <div
          className="h-48 rounded-xl border border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center text-center px-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
          onClick={openFilePicker}
        >
          <ImagePlus className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">{t("createListing.images.emptyTitle")}</p>
          <p className="text-xs text-gray-500">{t("createListing.images.emptyDescription")}</p>
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
                alt={`${t("createListing.images.imageAlt")} ${index + 1}`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder-image.png";
                }}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 inline-flex items-center justify-center rounded-full bg-black/60 text-white h-7 w-7"
                aria-label={t("createListing.images.delete")}
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {images.length < 10 && (
            <button
              type="button"
              onClick={openFilePicker}
              className="flex items-center justify-center h-32 rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition"
              disabled={uploading}
            >
              <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                <ImagePlus className="h-5 w-5 text-gray-400" />
                <span>{t("createListing.images.add")}</span>
              </div>
            </button>
          )}
        </div>
      )}

      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1">
        <p className="font-medium text-gray-800">{t("createListing.images.tipsTitle")}</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>{t("createListing.images.tip1")}</li>
          <li>{t("createListing.images.tip2")}</li>
          <li>{t("createListing.images.tip3")}</li>
          <li>{t("createListing.images.tip4")}</li>
        </ul>
      </div>
    </div>
  );
}
