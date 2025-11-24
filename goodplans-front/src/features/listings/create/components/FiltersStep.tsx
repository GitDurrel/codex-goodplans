interface FiltersStepProps {
  filters: Record<string, any>;
  category: string;
  onChange: (filters: Record<string, any>) => void;
}

export function FiltersStep({ filters, onChange }: FiltersStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Filtres supplémentaires</h3>

      <div className="space-y-4">
        <div>
          <label className="font-medium">État</label>
          <select
            className="input"
            value={filters.condition || ""}
            onChange={(e) => onChange({ ...filters, condition: e.target.value })}
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
            onChange={(e) => onChange({ ...filters, color: e.target.value })}
          />
        </div>

        <div>
          <label className="font-medium">Marque / Type</label>
          <input
            className="input"
            placeholder="Ex: BMW, Dior, Artisanat Marocain…"
            value={filters.brand || ""}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
