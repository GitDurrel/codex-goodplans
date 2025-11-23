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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t">
      <div className="container mx-auto px-4 pt-16 pb-8">

        {/* Grille principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Colonne 1 : Logo + description + réseaux sociaux */}
          <div className="space-y-6">

            <p className="text-gray-600 leading-relaxed">
              La première plateforme d'annonces au Maroc. Trouvez tout ce dont vous avez besoin ou vendez facilement ce que vous n'utilisez plus.
            </p>

            <SocialIcons links={SOCIAL_LINKS} />
          </div>

          {/* Colonne 2 */}
          <LinkList title="Liens rapides" links={QUICK_LINKS} />

          {/* Colonne 3 */}
          <LinkList title="Catégories" links={CATEGORY_LINKS} />

          {/* Colonne 4 */}
          <ContactBlock />
        </div>

        {/* Bas de page */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} GoodPlans. Tous droits réservés.
          </p>

          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-500 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/admin"
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600"
            >
              <Shield className="h-4 w-4" />
              Administration
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
