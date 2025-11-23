import { useEffect } from "react";
import { Building2, Car, Wrench, Palette } from "lucide-react";
import type { Category } from "../../../categories/apiCategorie";
import { useCategories } from "../../../categories/apiCategorie";

interface CategoryStepProps {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}

export function CategoryStep({
  selectedCategory,
  setSelectedCategory,
}: CategoryStepProps) {
  const { data: categories, loading } = useCategories();

  const iconMap: Record<string, any> = {
    immobilier: Building2,
    vehicules: Car,
    services: Wrench,
    artisanat: Palette,
  };

  if (loading) {
    return <p className="text-gray-500">Chargement des catégories…</p>;
  }

  const rootCategories = (categories || []).filter((c) => !c.parent_id);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Choisissez une catégorie</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {rootCategories.map((cat) => {
          const Icon = iconMap[cat.slug] || Building2;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition ${
                selectedCategory === cat.slug
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="font-medium text-sm">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
