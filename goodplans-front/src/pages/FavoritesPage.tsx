import { useEffect, useState } from "react";
import { Heart, Loader2, AlertTriangle, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { ListingCard } from "../components/listings/ListingCard";
import {
  fetchMyFavorites
} from "../features/listings/apiListings";
import type { UserFavorite } from "../features/listings/types";
import { useAuth } from "../features/auth/AuthContext";
import { useLanguage } from "../lib/language/LanguageContext";

export function FavoritesPage() {

  const { t } = useLanguage();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchMyFavorites();
        setFavorites(data ?? []);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : t("favorite.toast.error");
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  // ------------------------ STATES SPÉCIAUX ------------------------

  // Pas connecté → CTA vers connexion
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md px-6 py-10 text-center">
          <Heart className="h-10 w-10 mx-auto mb-4 text-rose-500" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t("favorite.notConnected.title")}
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            {t("favorite.notConnected.subtitle")}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t("favorite.notConnected.redirectLogin")}
          </button>
        </div>
      </div>
    );
  }

  // Chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
        <p className="text-gray-600 font-medium">
          {t("favorite.globalLoader")}
        </p>
      </div>
    );
  }

  // Erreur (autre que non connecté)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-md px-6 py-10 text-center">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t("favorite.error.title")}
          </h1>
          <p className="text-gray-600 text-sm mb-6 whitespace-pre-line">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            {t("favorite.error.reloadButton")}
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------ RENDER ------------------------------

  const total = favorites.length;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* HEADER */}
      <div className="bg-blue-50/80 border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white shadow flex items-center justify-center">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {t("favorite.title")}
              </h1>
              <p className="text-sm text-slate-600">
                {t("favorite.subtitle")}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow text-xs font-semibold text-slate-700">
              <span className="uppercase tracking-wide text-slate-400">
                {t("favorite.favoriteLength")}
              </span>
              <span className="text-base text-blue-600">{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="container mx-auto px-4 py-8">
        {total === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm px-6 py-12 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4">
              <Heart className="h-8 w-8 text-rose-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("favorite.favoriteNull")}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {t("favorite.subtitleFavoriteNull")}
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              {t("favorite.redirectHome")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => (
              <ListingCard
                key={fav.favoriteId ?? fav.listingId}
                listing={{ ...fav.listing, isFavorite: true }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
