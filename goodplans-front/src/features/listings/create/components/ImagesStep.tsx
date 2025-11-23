// src/features/listings/create/ImagesStep.tsx
import {type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { ImagePlus, Trash2, Info, Upload } from "lucide-react";

interface ImagesStepProps {
  /** URLs de prévisualisation (venues de useListingImages) */
  previewUrls: string[];
  /** Nombre max de photos autorisées (par défaut 8) */
  maxImages?: number;
  /** Callback quand l'utilisateur sélectionne / drop des fichiers */
  onSelectFiles: (files: FileList | null) => void;
  /** Callback suppression d'une image par index */
  onRemoveImage: (index: number) => void;
  /** Navigation du wizard */
  onBack?: () => void;
  onNext?: () => void;
  isSubmitting?: boolean;
}

export function ImagesStep({
  previewUrls,
  maxImages = 8,
  onSelectFiles,
  onRemoveImage,
  onBack,
  onNext,
  isSubmitting,
}: ImagesStepProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const canAddMore = previewUrls.length < maxImages;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onSelectFiles(e.target.files);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    onSelectFiles(e.dataTransfer.files);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function openFileDialog() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="space-y-8">
      {/* Titre + compteur */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Photos de votre annonce
          </h2>
          <p className="text-sm text-gray-500">
            Ajoutez des photos claires pour attirer plus de contacts.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 border border-blue-100">
          <ImagePlus className="h-4 w-4" />
          <span>
            Photos ({previewUrls.length}/{maxImages})
          </span>
        </div>
      </div>

      {/* Grille d’images + dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* Grille des images sélectionnées */}
        <div className="space-y-3">
          {previewUrls.length === 0 ? (
            <div className="h-64 rounded-2xl border border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center px-4">
              <ImagePlus className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Aucune photo pour le moment
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Ajoutez au moins une photo pour mettre votre annonce en valeur.
              </p>
              {canAddMore && (
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  Importer des photos
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {/* Image principale (grande) */}
              <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
                <img
                  src={previewUrls[0]}
                  alt="Photo principale"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-medium text-white">
                  Photo principale
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemoveImage(0);
                  }}
                  className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Les autres miniatures */}
              {previewUrls.slice(1).map((url, idx) => (
                <div
                  key={url}
                  className="relative h-24 rounded-xl overflow-hidden group"
                >
                  <img
                    src={url}
                    alt={`Photo ${idx + 2}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveImage(idx + 1);
                    }}
                    className="absolute top-1.5 right-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Slot “+X photos” si on n’a pas atteint le max */}
              {canAddMore && (
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/40 transition-all"
                >
                  <div className="flex flex-col items-center gap-1 text-xs text-gray-600">
                    <ImagePlus className="h-5 w-5 text-gray-400" />
                    <span>Ajouter des photos</span>
                    <span className="text-[10px] text-gray-400">
                      {maxImages - previewUrls.length} restantes
                    </span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tips + zone drag & drop */}
        <div className="space-y-4">
          {/* Tips block */}
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-blue-50 p-1.5">
                <Info className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Pour de meilleures performances :
                </p>
                <ul className="mt-1 space-y-1.5 text-xs text-gray-600">
                  <li>• Format horizontal recommandé (paysage)</li>
                  <li>• Taille idéale : environ 1500 × 1000 px</li>
                  <li>• Évitez les photos floues ou sombres</li>
                  <li>• Ne montrez pas d’informations sensibles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dropzone */}
          <div
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-6 text-center cursor-pointer transition-all ${
              isDragging
                ? "border-blue-500 bg-blue-50/40"
                : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm font-medium text-gray-800">
              Glissez vos photos ici ou cliquez pour parcourir
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG, WEBP — jusqu&apos;à {maxImages} photos.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Navigation bas de step */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Retour
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting || previewUrls.length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
