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
}

export function StepNavigation({
  currentStep,
  totalSteps,
  isLastStep,
  onPrev,
  onNext,
  disabled = false,
  loading = false,
}: StepNavigationProps) {
  const canGoPrev = currentStep > 0;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canGoPrev || disabled || loading}
        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
          canGoPrev && !disabled && !loading
            ? "border-gray-300 text-gray-700 hover:bg-gray-50"
            : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
        }`}
      >
        Précédent
      </button>

      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">
          Étape {currentStep + 1} / {totalSteps}
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={disabled || loading}
          className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors ${
            disabled || loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 shadow-sm"
          }`}
        >
          {loading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
          )}
          {isLastStep ? "Publier l'annonce" : "Continuer"}
        </button>
      </div>
    </div>
  );
}
