import { useLanguage } from "../../../../lib/language/LanguageContext";

interface FiltersStepProps {
  filters: Record<string, any>;
  category: string;
  onChange: (filters: Record<string, any>) => void;
}

export function FiltersStep({ filters, onChange }: FiltersStepProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">{t("createListing.filters.title")}</h3>

      <div className="space-y-4">
        <div>
          <label className="font-medium">{t("createListing.filters.condition")}</label>
          <select
            className="input"
            value={filters.condition || ""}
            onChange={(e) => onChange({ ...filters, condition: e.target.value })}
          >
            <option value="">{t("createListing.filters.select")}</option>
            <option value="new">{t("createListing.filters.new")}</option>
            <option value="used">{t("createListing.filters.used")}</option>
          </select>
        </div>

        <div>
          <label className="font-medium">{t("createListing.filters.color")}</label>
          <input
            className="input"
            placeholder={t("createListing.filters.colorPlaceholder")}
            value={filters.color || ""}
            onChange={(e) => onChange({ ...filters, color: e.target.value })}
          />
        </div>

        <div>
          <label className="font-medium">{t("createListing.filters.brandType")}</label>
          <input
            className="input"
            placeholder={t("createListing.filters.brandTypePlaceholder")}
            value={filters.brand || ""}
            onChange={(e) => onChange({ ...filters, brand: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
