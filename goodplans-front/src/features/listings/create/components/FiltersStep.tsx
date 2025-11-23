interface FiltersStepProps {
  filters: any;
  setFilters: (v: any) => void;
}

export function FiltersStep({ filters, setFilters }: FiltersStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Filtres supplémentaires</h3>

      <div className="space-y-4">
        <div>
          <label className="font-medium">État</label>
          <select
            className="input"
            value={filters.condition || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, condition: e.target.value }))
            }
          >
            <option value="">Sélectionner</option>
            <option value="new">Neuf</option>
            <option value="used">Occasion</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Couleur</label>
          <input
            className="input"
            placeholder="Rouge / Noir / Beige…"
            value={filters.color || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, color: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="font-medium">Marque / Type</label>
          <input
            className="input"
            placeholder="Ex: BMW, Dior, Artisanat Marocain…"
            value={filters.brand || ""}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, brand: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
}
