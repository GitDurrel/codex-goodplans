import type { SellerOverviewFilters } from "../../api/sellerStatsApi";

interface Props {
  filters: SellerOverviewFilters;
  onChange: (next: SellerOverviewFilters) => void;
}

export function OverviewFiltersBar({ filters, onChange }: Props) {

  const updateFilter = (key: keyof SellerOverviewFilters, value: string | boolean | undefined) => {
    const next = { ...filters };
    if (value === undefined || value === "") {
      delete (next as Record<string, unknown>)[key];
    } else {
      (next as Record<string, unknown>)[key] = value;
    }
    onChange(next);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Du</label>
          <input
            type="date"
            value={filters.from || ""}
            onChange={(e) => updateFilter("from", e.target.value || undefined)}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Au</label>
          <input
            type="date"
            value={filters.to || ""}
            onChange={(e) => updateFilter("to", e.target.value || undefined)}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select
            value={filters.category || ""}
            onChange={(e) => updateFilter("category", e.target.value || undefined)}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Toutes</option>
            <option value="vehicle">Véhicules</option>
            <option value="real_estate">Immobilier</option>
            <option value="services">Services</option>
            <option value="craft">Artisanat</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select
            value={filters.status || ""}
            onChange={(e) => updateFilter("status", e.target.value || undefined)}
            className="w-full rounded-lg border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="">Tous</option>
            <option value="Publié">Publié</option>
            <option value="En attente">En attente</option>
            <option value="Rejeté">Rejeté</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>
        <div className="flex items-center space-x-3 lg:col-span-4">
          <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={!!filters.featured}
              onChange={(e) => updateFilter("featured", e.target.checked || undefined)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            Annonces mises en avant
          </label>
        </div>
      </div>
    </div>
  );
}
