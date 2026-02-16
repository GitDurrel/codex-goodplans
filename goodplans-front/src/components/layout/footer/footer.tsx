import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

import {
  SOCIAL_LINKS,
  QUICK_LINKS,
  CATEGORY_LINKS,
  LEGAL_LINKS,
} from "./footer.config";

import {
  SocialIcons,
  LinkList,
  ContactBlock,
} from "./FooterSections";
import { useLanguage } from "../../../lib/language/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();


  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t">
      <div className="container mx-auto px-4 pt-16 pb-8">

        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Colonne 1 : Logo + description + réseaux sociaux */}
          <div className="space-y-6">

            <p className="text-gray-600 leading-relaxed">
               {t("footer.description")}
            </p>

            <SocialIcons links={SOCIAL_LINKS} />
            {/* App mobile */}
            <div className="pt-4">
              <p className="mb-3 text-sm font-medium text-gray-700 md:text-base">
                 {t("footer.mobileApp")}
              </p>

              <a
                href="https://apps.apple.com/fr/app/goodplans/id6757596855"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <img
                  src="/appstore-badge.png"
                  alt={t("footer.downloadApp")}
                  className="
                    h-12 sm:h-14 md:h-16 lg:h-18
                    w-auto
                    rounded-lg
                    shadow-md
                    hover:shadow-lg
                    transition-all
                  "
                />
              </a>
            </div>
          </div>



          {/* Colonne 2 */}
          <LinkList title={t("footer.quickLinks")} links={QUICK_LINKS} />

          {/* Colonne 3 */}
          <LinkList title={t("footer.categories")} links={CATEGORY_LINKS} />

          {/* Colonne 4 */}
          <ContactBlock />
        </div>

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} GoodPlans. {t("footer.rights")}
          </p>

          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-500 hover:text-blue-600"
              >
                {t(link.labelKey)}
              </Link>
            ))}

            <Link
              to="/admin"
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
            >
              <Shield className="h-4 w-4" />
              {t("footer.admin")}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
