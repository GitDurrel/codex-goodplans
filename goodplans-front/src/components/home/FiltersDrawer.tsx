import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Filters } from "../../pages/HomePage/types";
import type {
  CategoryWithSubcategories,
} from "../../features/categories/apiCategorie";
import { useLanguage } from "../../lib/language/LanguageContext";

interface CategoryTab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface FiltersDrawerProps {
  open: boolean;
  filters: Filters;
  categories: CategoryTab[];
  loadingCategories: boolean;
  onChange: (name: keyof Filters, value: string) => void;
  onReset: () => void;
  onApply: () => void;
  onClose: () => void;

  //  Nouveau : enums pour les filtres
  cityOptions: string[];
  regionOptions: string[];
  categoriesTree: CategoryWithSubcategories[];
  loadingMeta: boolean; // locations + sous-cats
}

export function FiltersDrawer({
  open,
  filters,
  categories,
  loadingCategories,
  onChange,
  onReset,
  onApply,
  onClose,
  cityOptions = [], // ✅ Valeur par défaut
  regionOptions = [], // ✅ Ajoutez la valeur par défaut ici
  categoriesTree,
  loadingMeta,
}: FiltersDrawerProps) {
  const { t } = useLanguage();

  if (!open) return null;

  const sortedCities = Array.isArray(cityOptions)
    ? [...cityOptions].sort((a, b) => a.localeCompare(b, "fr"))
    : [];

  const sortedRegions = Array.isArray(regionOptions)
    ? [...regionOptions].sort((a, b) => a.localeCompare(b, "fr"))
    : [];

  // ... reste du code identique

  // Catégories à afficher pour les sous-cats :
  // - si une catégorie est sélectionnée → seulement ses sous-cats
  // - sinon → toutes les catégories
  const relevantCategories: CategoryWithSubcategories[] =
    filters.category && categoriesTree.length
      ? categoriesTree.filter(
        (cat) =>
          cat.slug === filters.category || cat.id === filters.category
      )
      : categoriesTree;

  const hasSubcategories = relevantCategories.some(
    (cat) => (cat.subcategories ?? []).length > 0
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* HEADER */}
        <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">{t("filters.title")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-8">
          {/* CATÉGORIE */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">{t("filters.category")}</h3>
              {loadingCategories && (
                <span className="text-xs text-gray-500">{t("filters.loading")}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((tab) => {
                const Icon = tab.icon;
                const isActive = filters.category === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      onChange("category", isActive ? "" : tab.id)
                    }
                    className={`flex items-center p-3 border rounded-xl transition-all text-base ${isActive
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200"
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-2 ${isActive ? "text-blue-500" : "text-gray-500"
                        }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* LOCALISATION */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">{t("filters.location")}</h3>
              {loadingMeta && (
                <span className="text-xs text-gray-500">{t("filters.loading")}</span>
              )}
            </div>
            <div className="space-y-3">
              {/* Ville */}
              <select
                value={filters.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              >
                <option value="">{t("filters.cityAll")}</option>
                {sortedCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              {/* Région */}
              <select
                value={filters.region}
                onChange={(e) => onChange("region", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              >
                <option value="">{t("filters.regionAll")}</option>
                {sortedRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SOUS-CATÉGORIE */}
          {/* <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Sous-catégorie</h3>
              {loadingMeta && hasSubcategories && (
                <span className="text-xs text-gray-500">Chargement...</span>
              )}
            </div>

            {hasSubcategories ? (
              <select
                value={filters.subcategory}
                onChange={(e) => onChange("subcategory", e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-white"
              >
                <option value="">Toutes les sous-catégories</option>
                {relevantCategories.map((cat) => (
                  <optgroup key={cat.id} label={cat.name}>
                    {(cat.subcategories ?? []).map((subcat) => (
                      <option key={subcat.id} value={subcat.slug}>
                        {subcat.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-400">
                Aucune sous-catégorie disponible pour le moment.
              </p>
            )}
          </div> */}

          {/* PRIX */}
          <div>
            <h3 className="font-medium mb-3 text-gray-700">{t("filters.price")}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-50 px-2 py-1 rounded text-gray-600 text-sm font-medium">
                  MAD
                </div>
                <input
                  type="number"
                  placeholder={t("filters.min")}
                  className="w-full p-3 pl-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.minPrice}
                  onChange={(e) => onChange("minPrice", e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-50 px-2 py-1 rounded text-gray-600 text-sm font-medium">
                  MAD
                </div>
                <input
                  type="number"
                  placeholder={t("filters.max")}
                  className="w-full p-3 pl-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.maxPrice}
                  onChange={(e) => onChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* TYPE DE TRANSACTION */}
          {/* TYPE DE TRANSACTION */}
          {["immobilier", "vehicules", "vehicle", "real_estate", "services", "service"].includes(filters.category) && (
            <div>
              <h3 className="font-medium mb-3 text-gray-700">{t("filters.transactionType")}</h3>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const newValue = filters.transaction_type === "location" ? "" : "location";
                    onChange("transaction_type", newValue);
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl text-base font-medium transition-all ${filters.transaction_type === "location"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {t("filters.rent")}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const newValue = filters.transaction_type === "achat" ? "" : "achat";
                    onChange("transaction_type", newValue);
                  }}
                  className={`flex-1 px-4 py-3 rounded-xl text-base font-medium transition-all ${filters.transaction_type === "achat"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                >
                  {t("filters.buy")}
                </button>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="sticky bottom-0 bg-white p-5 border-t flex justify-between items-center">
            <button
              onClick={onReset}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {t("filters.reset")}
            </button>
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-medium transition-colors"
            >
              {t("filters.apply")}
            </button>
          </div>
        </div>
      </div></div>
  );
}
