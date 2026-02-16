import {
  ShieldCheck,
  Lock,
  KeyRound,
  Siren,
  MessagesSquare,
  Star,
  Scale,
} from "lucide-react";
import { useLanguage } from "../lib/language/LanguageContext";
import { translations } from "../lib/language/translations";

export default function SafetyPage() {
  const { lang, t } = useLanguage();

  const sections = [
    { icon: Lock, key: "dataProtection" },
    { icon: KeyRound, key: "accountSecurity" },
    { icon: Siren, key: "moderation" },
    { icon: MessagesSquare, key: "messaging" },
    { icon: Star, key: "payments" },
    { icon: Scale, key: "regulations" },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-white" />
            <div className="text-white">
              <h1 className="text-3xl font-extrabold">
                {t("safety.heroTitle")}
              </h1>
              <p className="mt-2 max-w-2xl text-blue-100">
                {t("safety.heroSubtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 lg:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;

          // ✅ accès direct au tableau
          const bullets =
            translations[lang].safety.sections[s.key].bullets;

          return (
            <div
              key={s.key}
              className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 text-blue-600" />
                <div>
                  <h2 className="font-bold text-lg">
                    {translations[lang].safety.sections[s.key].title}
                  </h2>

                  <ul className="mt-3 space-y-2 text-sm text-gray-600">
                    {bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACCOUNT TIPS */}
      <div className="mx-auto max-w-6xl px-4 pb-12 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h3 className="font-bold text-lg">
            {t("safety.accountTipsTitle")}
          </h3>

          {translations[lang].safety.accountTips.map((tip, i) => (
            <p key={i} className="mt-2 text-sm">• {tip}</p>
          ))}

          <p className="mt-4 text-sm text-amber-700">
            {t("safety.emailWarning")}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h3 className="font-bold text-lg">
            {t("safety.transactionTipsTitle")}
          </h3>

          {translations[lang].safety.transactionTips.map((tip, i) => (
            <p key={i} className="mt-2 text-sm">• {tip}</p>
          ))}

          <p className="mt-4 text-sm text-emerald-700">
            {t("safety.reportWarning")}
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-2xl bg-blue-50 border border-blue-100 p-6">
          <h4 className="font-semibold text-blue-900">
            {t("safety.helpTitle")}
          </h4>
          <p className="mt-2 text-sm text-blue-900/80">
            {t("safety.helpText")}
          </p>
        </div>
      </div>
    </div>
  );
}
