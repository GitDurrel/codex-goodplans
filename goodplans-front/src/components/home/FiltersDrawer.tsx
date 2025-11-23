import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Filters } from "../../pages/HomePage/types";

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
}: FiltersDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center z-10">
          <h2 className="text-xl font-bold">Filtres</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Catégorie</h3>
              {loadingCategories && (
                <span className="text-xs text-gray-500">Chargement...</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      onChange("category", filters.category === tab.id ? "" : tab.id)
                    }
                    className={`flex items-center p-3 border rounded-xl transition-all text-base ${
                      filters.category === tab.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 mr-2 ${
                        filters.category === tab.id ? "text-blue-500" : "text-gray-500"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-gray-700">Localisation</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={filters.city}
                onChange={(e) => onChange("city", e.target.value)}
                placeholder="Ville (ex: Casablanca)"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
              <input
                type="text"
                value={filters.region}
                onChange={(e) => onChange("region", e.target.value)}
                placeholder="Région"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-gray-700">Sous-catégorie</h3>
            <input
              type="text"
              value={filters.subcategory}
              onChange={(e) => onChange("subcategory", e.target.value)}
              placeholder="(optionnel)"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            />
          </div>

          <div>
            <h3 className="font-medium mb-3 text-gray-700">Prix</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-50 px-2 py-1 rounded text-gray-600 text-sm font-medium">
                  MAD
                </div>
                <input
                  type="number"
                  placeholder="Min"
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
                  placeholder="Max"
                  className="w-full p-3 pl-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.maxPrice}
                  onChange={(e) => onChange("maxPrice", e.target.value)}
                />
              </div>
            </div>
          </div>

          {([
            "immobilier",
            "vehicules",
            "vehicle",
            "real_estate",
          ].includes(filters.category)) && (
            <div>
              <h3 className="font-medium mb-3 text-gray-700">Type de transaction</h3>
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    onChange(
                      "transaction_type",
                      filters.transaction_type === "location" ? "" : "location"
                    )
                  }
                  className={`flex-1 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    filters.transaction_type === "location"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Location
                </button>
                <button
                  onClick={() =>
                    onChange(
                      "transaction_type",
                      filters.transaction_type === "achat" ? "" : "achat"
                    )
                  }
                  className={`flex-1 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    filters.transaction_type === "achat"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Achat
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white p-5 border-t flex justify-between items-center">
          <button
            onClick={onReset}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Réinitialiser
          </button>
          <button
            onClick={() => {
              onApply();
              onClose();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-base font-medium transition-colors"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}
