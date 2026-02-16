import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { useLanguage } from '../lib/language/LanguageContext';
export default function NotFoundPage() {

  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8">
        {/* 404 Illustration */}
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 bg-primary/15 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-primary">{t("notFound.illustration")}</span>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <AlertCircle className="w-12 h-12 text-primary/70" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          {t("notFound.title")}
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          {t("notFound.subtitle")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            {t("notFound.redirectHome")}
          </Link>
        </div>

        {/* Additional help */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 text-center">
            {t("notFound.help")}
            <Link to="/contact" className="text-primary hover:underline ml-1">
              {t("notFound.redirectContact")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}