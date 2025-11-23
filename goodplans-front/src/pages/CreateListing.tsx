// src/pages/CreateListing.tsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Check as CheckIcon } from "lucide-react";

import { CategoryStep } from "../features/listings/create/components/CategoryStep";
import { GeneralInfoStep } from "../features/listings/create/components/GeneralInfoStep";
import { PricingStep } from "../features/listings/create/components/PricingStep";
import { ImagesStep } from "../features/listings/create/components/ImagesStep";
import { FiltersStep } from "../features/listings/create/components/FiltersStep";
import { SpecificDetailsStep } from "../features/listings/create/components/SpecificDetailsStep";
import { ListingPreview } from "../features/listings/create/components/ListingPreview";
import { StepNavigation } from "../features/listings/create/components/StepNavigation";

import { useCategories } from "../features/categories/apiCategorie";
import { createListingWithCategory } from "../features/listings/apiListings";
import type { Category } from "../features/categories/apiCategorie"; 

// ---------------------------- Types locaux ---------------------------------

export type ListingCategorySlug =
  | "immobilier"
  | "vehicules"
  | "services"
  | "artisanat"
  | "";

type TransactionType = "" | "location" | "achat";

export type RentalPeriod = "" | "day" | "week" | "month" | "year";

export interface ListingFormState {
  category: ListingCategorySlug;

  title: string;
  description: string;
  city: string;
  region: string;

  price: string;
  transaction_type: TransactionType;
  rental_period: RentalPeriod;

  images: string[];

  filters: Record<string, any>;
  details: Record<string, any>;
}

const INITIAL_FORM: ListingFormState = {
  category: "",
  title: "",
  description: "",
  city: "",
  region: "",
  price: "",
  transaction_type: "",
  rental_period: "",
  images: [],
  filters: {},
  details: {},
};

const STEPS = [
  { id: "category", label: "Catégorie" },
  { id: "general", label: "Informations générales" },
  { id: "pricing", label: "Prix & conditions" },
  { id: "details", label: "Détails spécifiques" },
  { id: "images", label: "Photos" },
  { id: "filters", label: "Filtres" },
  { id: "preview", label: "Aperçu" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

// ---------------------------- Animations -----------------------------------

const fadeInitial = { opacity: 0, y: 20 };
const fadeAnimate = { opacity: 1, y: 0 };
const fadeExit = { opacity: 0, y: -10 };
const fadeTransition = { duration: 0.25 };

// --------------------------- Composant page --------------------------------

export function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ListingFormState>(INITIAL_FORM);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const currentStep = STEPS[currentStepIndex];

  // --------------------- catégories (pour le step 1) -----------------------

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const rootCategories = useMemo(
    () =>
      (categories || []).filter(
        (c: Category | any) => !("parent_id" in c) || !c.parent_id
      ),
    [categories]
  );

  // --------------------------- helpers état --------------------------------

  function updateForm(partial: Partial<ListingFormState>) {
    setFormData((prev) => ({ ...prev, ...partial }));
  }

  function updateDetails(partial: Record<string, any>) {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        ...partial,
      },
    }));
  }

  // -------------------------- validation step ------------------------------

  function validateStep(step: StepId): string | null {
    switch (step) {
      case "category":
        if (!formData.category) return "Veuillez choisir une catégorie.";
        return null;

      case "general":
        if (!formData.title.trim()) return "Le titre est obligatoire.";
        if (!formData.description.trim())
          return "La description est obligatoire.";
        if (!formData.city.trim()) return "La ville est obligatoire.";
        if (!formData.region.trim()) return "La région est obligatoire.";
        return null;

      case "pricing":
        if (!formData.price || Number(formData.price) <= 0)
          return "Le prix doit être supérieur à 0.";
        return null;

      case "details":
        return null;

      case "images":
        if (!formData.images.length)
          return "Ajoutez au moins une photo pour votre annonce.";
        return null;

      default:
        return null;
    }
  }

  const isLastStep = currentStepIndex === STEPS.length - 1;

  // ------------------------ navigation des steps ---------------------------

  function goToStep(index: number) {
    if (index < 0 || index >= STEPS.length) return;
    setCurrentStepIndex(index);
    setSubmitError(null);
  }

  function handleNext() {
    const error = validateStep(currentStep.id);
    if (error) {
      setSubmitError(error);
      return;
    }
    if (!isLastStep) {
      goToStep(currentStepIndex + 1);
    } else {
      void handleSubmit();
    }
  }

  function handlePrev() {
    if (currentStepIndex === 0) return;
    goToStep(currentStepIndex - 1);
  }

  // ------------------------------ submit -----------------------------------

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const payload = {
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
        city: formData.city.trim(),
        region: formData.region.trim(),
        price: Number(formData.price),
        transaction_type: formData.transaction_type || null,
        rental_period: formData.rental_period || null,
        images: formData.images,
        filters: formData.filters,
        details: formData.details,
      };

      const result = await createListingWithCategory(payload);

      setSubmitSuccess(true);
      setShowPreview(false);

      if (result?.id) {
        navigate(`/listings/${result.id}`);
      } else {
        navigate("/listings/me");
      }
    } catch (err: any) {
      console.error("Erreur lors de la création de l’annonce", err);
      setSubmitError(
        err?.message ||
          "Une erreur est survenue lors de la création de l’annonce."
      );
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  // --------------------------- rendu du step -------------------------------

  function renderStep(step: StepId) {
    switch (step) {
      case "category":
        return (
          <CategoryStep
            value={formData.category}
            onChange={(category: ListingCategorySlug) =>
              updateForm({ category })
            }
            categories={rootCategories}
            loading={categoriesLoading}
          />
        );

      case "general":
        return (
          <GeneralInfoStep
            values={{
              title: formData.title,
              description: formData.description,
              city: formData.city,
              region: formData.region,
            }}
            onChange={(partial: Partial<ListingFormState>) =>
              updateForm(partial)
            }
            category={formData.category}
          />
        );

      case "pricing":
        return (
          <PricingStep
            values={{
              price: formData.price,
              transaction_type: formData.transaction_type,
              rental_period: formData.rental_period,
            }}
            onChange={(partial: Partial<ListingFormState>) =>
              updateForm(partial)
            }
            category={formData.category}
          />
        );

      case "details":
        return (
          <SpecificDetailsStep
            category={formData.category}
            details={formData.details}
            onChange={(partial: Record<string, any>) => updateDetails(partial)}
          />
        );

      case "images":
        return (
          <ImagesStep
            images={formData.images}
            onChange={(images: string[]) => updateForm({ images })}
          />
        );

      case "filters":
        return (
          <FiltersStep
            filters={formData.filters}
            category={formData.category}
            onChange={(filters: Record<string, any>) =>
              updateForm({ filters })
            }
          />
        );

      case "preview":
        return (
          <ListingPreview
            formData={formData}
            showPreview={true}
            onClose={() => setShowPreview(false)}
          />
        );

      default:
        return null;
    }
  }

  // ------------------------------- render ----------------------------------

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Titre + résumé du step */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Créer une annonce
            </h1>
            <p className="mt-2 text-gray-500">
              Complétez les étapes ci-dessous pour publier votre annonce.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-500">
              Étape {currentStepIndex + 1} / {STEPS.length}
            </span>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header avec les steps */}
          <div className="border-b border-gray-100 px-4 sm:px-6 py-3 bg-gray-50/60">
            <div className="flex flex-wrap gap-2">
              {STEPS.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isDone = index < currentStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      if (index <= currentStepIndex) {
                        goToStep(index);
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm border transition-all ${
                      isActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : isDone
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {isDone && (
                      <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                    )}
                    <span>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zone de contenu step + messages */}
          <div className="px-4 sm:px-6 py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={fadeInitial}
                animate={fadeAnimate}
                exit={fadeExit}
                transition={fadeTransition}
                className="min-h-[260px]"
              >
                {renderStep(currentStep.id)}
              </motion.div>
            </AnimatePresence>

            {/* Messages */}
            <div className="mt-4 space-y-2">
              {submitError && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>{submitError}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <CheckIcon className="h-4 w-4 mt-0.5 shrink-0" />
                  <p>Votre annonce a été créée avec succès.</p>
                </div>
              )}

              {categoriesError && (
                <p className="text-xs text-red-500">
                  Impossible de charger les catégories. Vérifiez l’API
                  /categories.
                </p>
              )}
            </div>

            {/* Navigation bas de page */}
            <div className="mt-6">
              <StepNavigation
                currentStep={currentStepIndex}
                totalSteps={STEPS.length}
                isLastStep={isLastStep}
                onPrev={handlePrev}
                onNext={handleNext}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prévisualisation plein écran optionnelle */}
      <AnimatePresence>
        {showPreview && (
          <ListingPreview
            formData={formData}
            showPreview={showPreview}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
