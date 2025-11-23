// src/pages/ProfilePage.tsx
import { useUserProfile } from "../features/users/userApi";

export function ProfilePage() {
  const { data: profile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500">
          Impossible de charger le profil utilisateur.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Mon profil</h1>

        <div className="flex gap-6 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
            {profile.username.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-900">
              {profile.username}
            </p>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500">
              Type de compte :{" "}
              <span className="font-medium">{profile.account_type}</span>
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Téléphone</p>
            <p className="text-gray-800">
              {profile.phone || "Non renseigné"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">WhatsApp</p>
            <p className="text-gray-800">
              {profile.whatsapp || "Non renseigné"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Entreprise</p>
            <p className="text-gray-800">
              {profile.company_name || "Non renseigné"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Statut vendeur</p>
            <p className="text-gray-800">
              {profile.is_seller
                ? profile.seller_approved
                  ? "Vendeur approuvé"
                  : "Vendeur en attente de validation"
                : "Compte acheteur"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
