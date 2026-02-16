import { useLanguage } from "../../../lib/language/LanguageContext";

export function SafetyTips() {
  const { t } = useLanguage();

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-lg font-bold text-slate-900">
        {t("listing.safety.title")}
      </h3>
      <ul className="space-y-2 text-sm text-slate-600">
        <li>{t("listing.safety.tip1")}</li>
        <li>{t("listing.safety.tip2")}</li>
        <li>{t("listing.safety.tip3")}</li>
        <li>{t("listing.safety.tip4")}</li>
      </ul>
    </aside>
  );
}
