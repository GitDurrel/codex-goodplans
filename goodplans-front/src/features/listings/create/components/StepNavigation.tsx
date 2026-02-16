// src/features/listings/create/components/StepNavigation.tsx
import { Loader2 } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
  loading?: boolean;
  currentStepKey?: string;          // ex: "images"
  uploadProgress?: number | null;   // 0–100
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isLastStep,
  onPrev,
  onNext,
  disabled = false,
  loading = false,
  currentStepKey,
  uploadProgress = null,
}: StepNavigationProps) {
  const canGoPrev = currentStep > 0;

  const isUploadingImages =
    loading && currentStepKey === "images" && uploadProgress !== null;

  return (
    <div className="sticky bottom-0 px-3 py-3 sm:px-6 sm:py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-10">
      {/* BOUTON RETOUR */}
      {canGoPrev ? (
        <button
          type="button"
          onClick={onPrev}
          disabled={loading}
          className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm sm:text-base font-medium border transition-colors ${
            !loading
              ? "border-gray-300 text-gray-700 hover:bg-gray-50"
              : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
          }`}
        >
          Retour
        </button>
      ) : (
        // pour garder l'alignement
        <div className="w-[90px]" />
      )}

      {/* PROGRESSION UPLOAD IMAGES (centré) */}
      {isUploadingImages ? (
        <div className="flex-1 mx-3 sm:mx-4">
          <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-xs font-semibold text-blue-600">
                Téléchargement
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all"
              />
            </div>
          </div>
        </div>
      ) : (
        // si pas d'upload, on affiche juste l’info d’étape au centre
        <div className="flex-1 mx-3 sm:mx-4 text-center">
          <span className="text-xs text-gray-500">
            Étape {currentStep + 1} / {totalSteps}
          </span>
        </div>
      )}

      {/* BOUTON SUIVANT / PUBLIER */}
      <button
        type="button"
        onClick={onNext}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm sm:text-base font-semibold text-white transition-colors ${
          disabled || loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-sm"
        }`}
      >
        {loading && (
          <Loader2
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        {isLastStep ? "Publier l'annonce" : "Suivant"}
      </button>
    </div>
  );
}
