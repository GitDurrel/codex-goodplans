import { Loader2 } from "lucide-react";
import { useLanguage } from "../../../../lib/language/LanguageContext";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
  loading?: boolean;
  currentStepKey?: string;
  uploadProgress?: number | null;
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
  const { t } = useLanguage();
  const canGoPrev = currentStep > 0;

  const isUploadingImages =
    loading && currentStepKey === "images" && uploadProgress !== null;

  return (
    <div className="sticky bottom-0 px-3 py-3 sm:px-6 sm:py-4 bg-gray-50 flex items-center justify-between border-t border-gray-200 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] z-10">
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
          {t("createListing.navigation.back")}
        </button>
      ) : (
        <div className="w-[90px]" />
      )}

      {isUploadingImages ? (
        <div className="flex-1 mx-3 sm:mx-4">
          <div className="relative pt-1">
            <div className="flex mb-1 items-center justify-between">
              <span className="text-xs font-semibold text-blue-600">
                {t("createListing.navigation.uploading")}
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
        <div className="flex-1 mx-3 sm:mx-4 text-center">
          <span className="text-xs text-gray-500">
            {t("createListing.navigation.step")} {currentStep + 1} / {totalSteps}
          </span>
        </div>
      )}

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
        {isLastStep ? t("createListing.navigation.publish") : t("createListing.navigation.next")}
      </button>
    </div>
  );
}
