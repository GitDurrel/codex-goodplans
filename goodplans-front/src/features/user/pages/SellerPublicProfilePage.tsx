import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Phone,
  Smartphone,
  Check,
  Shield,
  MapPin,
  Loader2,
  Calendar,
  Clock,
  Award,
  User,
  Package,
  ChevronRight,
  AlertTriangle,
  Eye,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";

import { useAuth } from "../../auth/AuthContext";
import { getSellerPublicProfile } from "../api/userApi";
import {
  fetchSellerPublicListings,
} from "../../listings/apiListings";

import type { UserProfile } from "../types";
import type { Listing } from "../../listings/types";

interface SellerListing extends Listing {
  views?: number;
  favorites?: number;
}

export function SellerPublicProfilePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "reviews">("listings");
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** -------------------------- CHARGEMENT DONNÉES -------------------------- */
  useEffect(() => {
    if (!sellerId) {
      setError("Profil vendeur introuvable");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [seller, sellerListings] = await Promise.all([
          getSellerPublicProfile(sellerId),
          fetchSellerPublicListings(sellerId),
        ]);

        setProfile(seller);
        setListings(sellerListings || []);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Impossible de charger le profil";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [sellerId]);

  /** ----------------------------- HELPERS UI ------------------------------ */

  const displayName = useMemo(() => {
    if (!profile) return "Utilisateur";
    return profile.username || profile.email?.split("@")[0] || "Utilisateur";
  }, [profile]);

  const memberSince = useMemo(() => {
    if (!profile?.created_at) return "Date inconnue";
    return new Date(profile.created_at).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
    });
  }, [profile?.created_at]);

  const avatarSrc = useMemo(() => {
    if (!profile?.avatar_url) return null;
    const sep = profile.avatar_url.includes("?") ? "&" : "?";
    return `${profile.avatar_url}${sep}v=${profile.avatar_url.length}`;
  }, [profile?.avatar_url]);

  const toggleContactOptions = () =>
    setShowContactOptions((prev) => !prev);

  const handleContact = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!profile?.user_id) return;
    navigate(`/chat/${profile.user_id}`);
  };

  /** ------------------------------ LOADING/ERR ----------------------------- */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-r from-blue-50 to-indigo-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium animate-pulse">
          Chargement du profil...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 text-red-600 p-8 rounded-xl text-center shadow-sm">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
          <p className="text-xl font-medium">
            {error || "Ce profil n'existe pas ou a été supprimé"}
          </p>
          <Link
            to="/"
            className="mt-6 inline-block px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  /** ------------------------------- RENDER -------------------------------- */

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Infos vendeur */}
            <div className="flex items-center">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-md">
                  <span className="text-3xl font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="ml-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {displayName}
                </h1>

                <div className="flex items-center mt-2 gap-2">
                  {profile.seller_approved && (
                    <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      <Check className="h-4 w-4" />
                      <span>Vendeur vérifié</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Membre depuis {memberSince}</span>
                  </div>
                  {profile.online && (
                    <div className="flex items-center gap-1 text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      <span>En ligne</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton contacter */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleContactOptions}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Contacter
              </motion.button>

              {showContactOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 w-64 bg-white rounded-xl shadow-xl p-4 z-10 right-0"
                >
                  <button
                    onClick={handleContact}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="mr-3 h-5 w-5" />
                    Message privé
                  </button>

                  {profile.show_phone && profile.phone && (
                    <a
                      href={`tel:${profile.phone}`}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="mr-3 h-5 w-5" />
                      {profile.phone}
                    </a>
                  )}

                  {profile.show_whatsapp && profile.whatsapp && (
                    <a
                      href={`https://wa.me/${profile.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg flex items-center text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <Smartphone className="mr-3 h-5 w-5" />
                      WhatsApp
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-8">
          {/* SIDEBAR */}
          <div className="w-full space-y-6">
            {/* Stats vendeur */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 sticky top-6">
              <h3 className="font-semibold text-gray-800 border-b pb-2 mb-3 text-base lg:text-lg">
                Statistiques du vendeur
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4 mb-4">
                <div className="bg-blue-50 rounded-lg p-2 lg:p-4 text-center">
                  <div className="text-base lg:text-xl font-bold text-blue-600">
                    {listings.length}
                  </div>
                  <div className="text-[11px] lg:text-xs text-gray-600 mt-1">
                    Annonces
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-2 lg:p-4 text-center">
                  <div className="text-base lg:text-xl font-bold text-green-600">
                    98%
                  </div>
                  <div className="text-[11px] lg:text-xs text-gray-600 mt-1">
                    Taux de réponse (fictif)
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 lg:p-4 text-center col-span-2 sm:col-span-1">
                  <div className="text-base lg:text-xl font-bold text-purple-600">
                    &lt; 1h
                  </div>
                  <div className="text-[11px] lg:text-xs text-gray-600 mt-1">
                    Temps de réponse (fictif)
                  </div>
                </div>
              </div>

              <div className="space-y-3 lg:space-y-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm font-medium text-gray-700">
                      Type de compte
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      {profile.account_type === "seller_pro"
                        ? "Vendeur professionnel"
                        : "Vendeur particulier"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-green-50 rounded-lg text-green-600">
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm font-medium text-gray-700">
                      Localisation
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      {/* si tu ajoutes city dans le profil plus tard */}
                      Non spécifiée
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-yellow-50 rounded-lg text-yellow-600">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm font-medium text-gray-700">
                      Membre depuis
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      {memberSince}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="p-1.5 lg:p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Award className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm font-medium text-gray-700">
                      Statut
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600">
                      {profile.seller_approved
                        ? "Vendeur vérifié"
                        : "Standard"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 sticky top-[300px]">
              <div className="flex items-center gap-2 lg:gap-3 mb-3">
                <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-800 text-sm lg:text-base">
                  Conseils de sécurité
                </h3>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 lg:p-4 text-[12px] lg:text-sm text-gray-700 space-y-2 lg:space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-[10px]">
                    1
                  </div>
                  <p>Rencontrez le vendeur dans un lieu public.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-[10px]">
                    2
                  </div>
                  <p>Vérifiez l&apos;article avant de payer.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-[10px]">
                    3
                  </div>
                  <p>Ne payez jamais d&apos;avance sans garantie.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 text-[10px]">
                    4
                  </div>
                  <p>Signalez tout comportement suspect.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENU PRINCIPAL */}
          <div className="w-full">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("listings")}
                  className={`flex-1 px-4 py-4 font-medium text-center ${
                    activeTab === "listings"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Package className="h-5 w-5 mx-auto mb-1" />
                  Annonces ({listings.length})
                </button>
              </div>

              {/* LISTINGS */}
              {activeTab === "listings" && (
                <div className="p-6">
                  {listings.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                      <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">
                        Ce vendeur n&apos;a pas encore d&apos;annonces actives.
                      </p>
                      <Link
                        to="/"
                        className="mt-4 inline-block text-blue-600 hover:underline"
                      >
                        Découvrir d&apos;autres annonces
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {listings.map((listing) => (
                        <motion.div
                          key={listing.id}
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link
                            to={`/listings/${listing.id}`}
                            className="block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100"
                          >
                            <div className="relative overflow-hidden rounded-t-xl aspect-[4/3] bg-gray-100">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                                />
                              ) : null}

                              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-blue-600">
                                {listing.price.toLocaleString("fr-FR")} DH
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                                {listing.title}
                              </h3>

                              <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <MapPin className="h-4 w-4" />
                                  <span>
                                    {listing.city}
                                    {listing.region ? `, ${listing.region}` : ""}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4" />
                                    <span>{listing.views ?? 0}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Heart className="h-4 w-4" />
                                    <span>{listing.favorites ?? 0}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  {listing.created_at
                                    ? new Date(
                                        listing.created_at,
                                      ).toLocaleDateString("fr-FR")
                                    : ""}
                                </span>
                                <span className="text-blue-600 text-sm flex items-center">
                                  Voir l&apos;annonce
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
