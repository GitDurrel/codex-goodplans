import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Building2, Car, Wrench, Palette } from "lucide-react";
import { useCategories } from "../../../categories/apiCategorie";
import type { Category } from "../../../categories/apiCategorie";
import { useLanguage } from "../../../../lib/language/LanguageContext";

interface CategoryStepProps {
  value: string;                // slug de la catégorie sélectionnée
  transactionType: string;      // "sale" | "rent" | "" (ou "achat"/"location" si tu veux mapper après)
  onChangeCategory: (slug: string) => void;
  onChangeTransactionType: (v: string) => void;
  onStepComplete?: (isComplete: boolean) => void;
}

export function CategoryStep({
  value,
  transactionType,
  onChangeCategory,
  onChangeTransactionType,
  onStepComplete,
}: CategoryStepProps) {

  const { t } = useLanguage();

  const { data: categories, loading, error } = useCategories();

  const [showCategoryError, setShowCategoryError] = useState(false);
  const [showTransactionError, setShowTransactionError] = useState(false);

  // Catégories racines = pas de parent_id
  const rootCategories: Category[] = useMemo(
    () =>
      (categories || []).filter(
        (c: Category | any) => !("parent_id" in c) || !c.parent_id
      ),
    [categories]
  );

  // Mapping slug -> icône
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    real_estate: Building2,
    immobilier: Building2,
    vehicle: Car,
    vehicules: Car,
    service: Wrench,
    services: Wrench,
    craft: Palette,
    artisanat: Palette,
  };

  // Les catégories qui nécessitent un type de transaction
  const needsTransactionType = (slug: string | null | undefined) =>
    slug === "real_estate" ||
    slug === "immobilier" ||
    slug === "vehicle" ||
    slug === "vehicules";

  const selectedCategory =
    rootCategories.find((c) => c.slug === value) ?? null;

  /* ---------------------- Effets : reset & validation --------------------- */

  // Quand la catégorie sélectionnée change
  useEffect(() => {
    if (!selectedCategory) return;

    setShowCategoryError(false);

    // Si la nouvelle catégorie ne nécessite pas de type de transaction,
    // on vide la valeur éventuelle
    if (!needsTransactionType(selectedCategory.slug) && transactionType) {
      onChangeTransactionType("");
    }
  }, [selectedCategory, transactionType, onChangeTransactionType]);

  // Validation + onStepComplete
  useEffect(() => {
    const isCategoryValid = Boolean(selectedCategory);

    const isTransactionValid = needsTransactionType(selectedCategory?.slug)
      ? Boolean(transactionType)
      : true;

    setShowCategoryError(!isCategoryValid);
    setShowTransactionError(!isTransactionValid);

    const isComplete = isCategoryValid && isTransactionValid;
    onStepComplete?.(isComplete);
  }, [selectedCategory, transactionType, onStepComplete]);

  /* --------------------------- Rendu loading/erreur ------------------------ */

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-gray-500">{t("createListing.categoryStep.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-red-500 text-sm">
          {t("createListing.categoryStep.error")}
        </p>
      </div>
    );
  }

  /* -------------------------------- Rendu UI ------------------------------- */

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Message d’alerte (comme l’ancien) */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-8">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            {t("createListing.categoryStep.warning")}
          </p>
        </div>
      </div>

      {/* Sélection de catégorie */}
      <div>
        <label className="block text-lg font-medium text-gray-800 mb-4 flex items-center">
          {t("createListing.categoryStep.categoryLabel")} <span className="text-red-500 ml-1">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {rootCategories.map((cat) => {
            const Icon = iconMap[cat.slug] || Building2;
            const isSelected = value === cat.slug;

            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => onChangeCategory(cat.slug)}
                className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 min-h-[120px] sm:min-h-[144px] ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary shadow-lg"
                    : "border-gray-200 hover:border-primary/30 hover:shadow-lg"
                }`}
              >
                <div
                  className={`p-3 rounded-full mb-2 sm:mb-3 ${
                    isSelected ? "bg-primary/10" : "bg-gray-100"
                  } transition-all duration-300`}
                >
                  <Icon
                    className={`h-6 w-6 sm:h-8 sm:w-8 transition-transform duration-300 ${
                      isSelected ? "scale-110 text-primary" : "text-gray-600"
                    }`}
                  />
                </div>
                <span className="text-sm sm:text-base text-center font-medium">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {showCategoryError && (
          <div className="bg-red-100 text-red-800 text-base font-medium mt-3 px-4 py-2 rounded-md text-center">
            {t("createListing.categoryStep.seklectCategoryError")}
          </div>
        )}
      </div>

      {/* Sélection du type de transaction */}
      {selectedCategory && needsTransactionType(selectedCategory.slug) && (
        <div className="mt-8 animate-fadeIn">
          <label className="block text-lg font-medium text-gray-800 mb-4">
            {t("createListing.categoryStep.transactionLabel")} <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "sale", label: t("createListing.categoryStep.transactionSale") },
              { value: "rent", label: t("createListing.categoryStep.transactionRent") },
            ].map((option) => {
              const isSelected = transactionType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChangeTransactionType(option.value)}
                  className={`flex items-center justify-center p-5 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-md"
                      : "border-gray-200 hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <span className="text-base font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>

          {showTransactionError && (
            <div className="bg-red-100 text-red-800 text-base font-medium mt-3 px-4 py-2 rounded-md text-center">
              {t("createListing.categoryStep.selectTransactionError")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
