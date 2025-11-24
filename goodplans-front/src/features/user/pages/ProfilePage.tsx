import {
  AlertCircle,
  Briefcase,
  Camera,
  Check,
  Loader,
  MessageSquare,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  deleteAccount,
  getProfile,
  isSellerAccount,
  normalizeSellerType,
  updateProfile,
  updateUsername,
  uploadAvatar,
} from "../api/userApi";
import type { AccountType, SellerType, UpdateProfilePayload, UserProfile } from "../types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];

type ProfileFormState = {
  username: string;
  phone: string;
  whatsapp: string;
  account_type: AccountType | null;
  seller_type: SellerType;
  company_name: string;
  show_phone: boolean;
  show_whatsapp: boolean;
  seller_approved: boolean;
  avatar_url: string;
  siret: string;
  is_seller: boolean;
};

type UiState = {
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  success: string | null;
};

const defaultForm: ProfileFormState = {
  username: "",
  phone: "",
  whatsapp: "",
  account_type: "buyer",
  seller_type: "particular",
  company_name: "",
  show_phone: false,
  show_whatsapp: false,
  seller_approved: false,
  avatar_url: "",
  siret: "",
  is_seller: false,
};

function mapProfileToForm(profile: UserProfile): ProfileFormState {
  const sellerType = normalizeSellerType(profile.account_type, profile.seller_type);
  return {
    username: profile.username || "",
    phone: profile.phone || "",
    whatsapp: profile.whatsapp || "",
    account_type: profile.account_type || "buyer",
    seller_type: sellerType,
    company_name: profile.company_name || "",
    show_phone: !!profile.show_phone,
    show_whatsapp: !!profile.show_whatsapp,
    seller_approved: !!profile.seller_approved,
    avatar_url: profile.avatar_url || "",
    siret: profile.siret || "",
    is_seller: !!profile.is_seller,
  };
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [form, setForm] = useState<ProfileFormState>(defaultForm);
  const [ui, setUi] = useState<UiState>({ loading: true, saving: false, deleting: false, error: null, success: null });
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const initialSellerLocked = useRef(false);

  const sellerEnabled = useMemo(() => {
    return form.account_type === "seller_particular" || form.account_type === "seller_pro" || form.is_seller;
  }, [form.account_type, form.is_seller]);

  const initials = useMemo(() => form.username?.[0]?.toUpperCase() ?? "?", [form.username]);

  useEffect(() => {
    const loadProfile = async () => {
      setUi((prev) => ({ ...prev, loading: true, error: null, success: null }));

      try {
        const profile = await getProfile();
        const mapped = mapProfileToForm(profile);
        setForm(mapped);
        setProfileEmail(profile.email);
        setOriginalUsername(profile.username);
        initialSellerLocked.current = isSellerAccount(profile.account_type, profile.is_seller);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Échec du chargement du profil";
        setUi((prev) => ({ ...prev, error: message }));
      } finally {
        setUi((prev) => ({ ...prev, loading: false }));
      }
    };

    void loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const toggleSellerStatus = (enable: boolean) => {
    if (!enable && initialSellerLocked.current) {
      setUi((prev) => ({ ...prev, error: "Un compte vendeur ne peut pas redevenir acheteur.", success: null }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      account_type: enable
        ? prev.seller_type === "professional"
          ? "seller_pro"
          : "seller_particular"
        : "buyer",
      is_seller: enable,
      seller_approved: enable ? prev.seller_approved : false,
    }));
  };

  const updateSellerType = (type: SellerType) => {
    setForm((prev) => ({
      ...prev,
      seller_type: type,
      account_type:
        prev.account_type === "buyer" && !initialSellerLocked.current && !sellerEnabled
          ? "buyer"
          : type === "professional"
            ? "seller_pro"
            : "seller_particular",
    }));
  };

  const validateSellerData = () => {
    if (!sellerEnabled) return true;

    if (!form.phone) {
      setUi((prev) => ({ ...prev, error: "Un numéro de téléphone est requis pour les vendeurs.", success: null }));
      return false;
    }

    if (form.seller_type === "professional") {
      if (!form.company_name) {
        setUi((prev) => ({ ...prev, error: "Le nom de l'entreprise est obligatoire pour les professionnels.", success: null }));
        return false;
      }
      if (!form.siret) {
        setUi((prev) => ({ ...prev, error: "Le numéro de SIRET est obligatoire pour les professionnels.", success: null }));
        return false;
      }
    }

    return true;
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setUi((prev) => ({ ...prev, error: "La taille maximale est de 5 Mo.", success: null }));
      return;
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setUi((prev) => ({ ...prev, error: "Formats autorisés : JPEG, PNG, GIF.", success: null }));
      return;
    }

    try {
      const { avatar_url, message } = await uploadAvatar(file);
      setForm((prev) => ({ ...prev, avatar_url }));
      updateUser({ avatar_url });
      setUi((prev) => ({ ...prev, success: message || "Avatar mis à jour", error: null }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de l'upload de l'avatar";
      setUi((prev) => ({ ...prev, error: message, success: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (initialSellerLocked.current && !sellerEnabled) {
      setUi((prev) => ({ ...prev, error: "Un compte vendeur ne peut pas redevenir acheteur.", success: null }));
      return;
    }

    if (!validateSellerData()) return;

    setUi((prev) => ({ ...prev, saving: true, error: null, success: null }));

    try {
      if (form.username && form.username !== originalUsername) {
        await updateUsername(form.username);
        setOriginalUsername(form.username);
      }

      const account_type: AccountType | null = sellerEnabled
        ? form.seller_type === "professional"
          ? "seller_pro"
          : "seller_particular"
        : "buyer";

      const payload: UpdateProfilePayload = {
        phone: form.phone || null,
        whatsapp: form.whatsapp || null,
        show_phone: form.show_phone,
        show_whatsapp: form.show_whatsapp,
        company_name: sellerEnabled ? form.company_name || null : null,
        seller_type: sellerEnabled ? form.seller_type : null,
        siret: sellerEnabled && form.seller_type === "professional" ? form.siret : null,
        account_type,
      };

      const updated = await updateProfile(payload);
      const mapped = mapProfileToForm(updated);
      setForm(mapped);
      updateUser({ avatar_url: updated.avatar_url ?? form.avatar_url, username: updated.username ?? form.username });
      setProfileEmail(updated.email || profileEmail);
      initialSellerLocked.current = isSellerAccount(updated.account_type, updated.is_seller);

      setUi((prev) => ({ ...prev, success: "Profil mis à jour avec succès", error: null }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la mise à jour du profil";
      setUi((prev) => ({ ...prev, error: message, success: null }));
    } finally {
      setUi((prev) => ({ ...prev, saving: false }));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?");
    if (!confirmation) return;

    setUi((prev) => ({ ...prev, deleting: true, error: null, success: null }));
    try {
      await deleteAccount();
      setUi((prev) => ({ ...prev, success: "Compte supprimé", error: null }));
      await logout();
      navigate("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la suppression du compte";
      setUi((prev) => ({ ...prev, error: message, success: null }));
    } finally {
      setUi((prev) => ({ ...prev, deleting: false }));
    }
  };

  if (ui.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="flex items-center text-sm text-blue-600">
          <Loader className="h-5 w-5 animate-spin mr-2" />
          <span>Chargement du profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="space-y-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="white"
                d="M41.6,-67.9C53.3,-59.4,62,-47.4,69.8,-34.4C77.7,-21.4,84.5,-7.3,83.5,6.1C82.6,19.5,73.9,32.2,63.8,42.9C53.7,53.5,42.2,62,29.8,68.2C17.4,74.4,3.9,78.2,-10.4,77.9C-24.7,77.5,-49.3,73,-63.6,60.7C-77.9,48.3,-81.8,28.1,-81.3,8.8C-80.7,-10.5,-75.7,-29.9,-65.4,-44.5C-55.1,-59.1,-39.5,-68.9,-24.4,-75.5C-9.3,-82.1,5.3,-85.5,18.8,-81.3C32.3,-77.1,64.7,-65.3,82.5,-53.4C100.4,-41.5,103.7,-29.3,107.2,-16.1C110.7,-2.9,114.5,11.3,112.4,24.1C110.4,36.9,102.6,48.2,90.6,53.7C78.6,59.3,62.6,59,48.3,60.9C34,62.7,21.6,66.7,6.8,72.9C-8,79.1,-25.1,87.5,-39.5,85.6C-54,83.6,-65.8,71.3,-74.7,57.6C-83.7,43.9,-89.8,28.9,-89.8,14C-89.8,-1,-83.8,-15.9,-78.4,-31.2C-73,-46.6,-68.3,-62.4,-57.3,-71.6C-46.4,-80.8,-29.2,-83.4,-12.9,-80.9C3.4,-78.4,29.9,-76.4,41.6,-67.9Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 backdrop-blur-sm p-1 shadow-xl">
                {form.avatar_url ? (
                  <img
                    src={`${form.avatar_url}?${new Date().getTime()}`}
                    alt="Photo de profil"
                    className="w-full h-full rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = "";
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/30 flex items-center justify-center">
                    {form.username ? (
                      <span className="text-white/80 text-2xl font-semibold">{initials}</span>
                    ) : (
                      <User className="w-12 h-12 md:w-16 md:h-16 text-white/70" />
                    )}
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-white text-blue-600 p-2 rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl hover:bg-gray-50">
                <Camera className="w-5 h-5" />
                <input type="file" className="hidden" accept="image/jpeg,image/png,image/gif" onChange={handleAvatarUpload} disabled={ui.saving} />
              </label>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold">{form.username || "Mon profil"}</h1>
              <p className="text-blue-100 mt-1">{profileEmail || user?.email}</p>

              {sellerEnabled && (
                <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                  {form.seller_approved ? (
                    <>
                      <ShieldCheck className="w-4 h-4 mr-1" />
                      <span>Vendeur approuvé</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 mr-1" />
                      <span>En attente d'approbation</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {ui.error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 flex items-center animate-appear shadow-sm">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{ui.error}</span>
          </div>
        )}

        {ui.success && (
          <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 flex items-center animate-appear shadow-sm">
            <Check className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{ui.success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Informations personnelles</h2>
              {ui.saving && (
                <div className="flex items-center text-sm text-blue-600">
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  <span>Traitement...</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <input
                      value={profileEmail || user?.email || ""}
                      readOnly
                      className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-gray-200 bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1.5">Nom d'utilisateur</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      name="username"
                      value={form.username}
                      onChange={handleInputChange}
                      required
                      className="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800">Mode vendeur</h2>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-800">Je souhaite vendre des articles</h3>
                    <p className="text-sm text-gray-500">Activez cette option pour mettre en vente vos articles</p>
                  </div>
                </div>
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${sellerEnabled ? "bg-blue-600" : "bg-gray-200"} ${initialSellerLocked.current ? "opacity-60 cursor-not-allowed" : ""}`}
                  onClick={() => toggleSellerStatus(!sellerEnabled)}
                  disabled={initialSellerLocked.current}
                >
                  <span className="sr-only">Activer le mode vendeur</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${sellerEnabled ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              {sellerEnabled && (
                <div className="mt-6 space-y-6 bg-blue-50 p-5 rounded-xl border border-blue-100 animate-appear">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Type de vendeur</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => updateSellerType("particular")}
                        disabled={form.seller_approved}
                        className={`group relative p-4 border rounded-xl text-left transition-all duration-200 ${form.seller_type === "particular" ? "border-blue-500 bg-white shadow-md" : "border-gray-200 bg-white/60 hover:bg-white hover:shadow-sm"} ${form.seller_approved ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${form.seller_type === "particular" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"}`}
                          >
                            <User className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Particulier</h3>
                            <p className="text-sm text-gray-500">Pour les ventes occasionnelles</p>
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSellerType("professional")}
                        disabled={form.seller_approved}
                        className={`group relative p-4 border rounded-xl text-left transition-all duration-200 ${form.seller_type === "professional" ? "border-blue-500 bg-white shadow-md" : "border-gray-200 bg-white/60 hover:bg-white hover:shadow-sm"} ${form.seller_approved ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center ${form.seller_type === "professional" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500"}`}
                          >
                            <Briefcase className="h-5 w-5" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-800">Professionnel</h3>
                            <p className="text-sm text-gray-500">Pour les entreprises</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {form.seller_type === "professional" && (
                    <div className="animate-appear">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom de l'entreprise*</label>
                      <input
                        name="company_name"
                        value={form.company_name}
                        onChange={handleInputChange}
                        required
                        disabled={form.seller_approved}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Votre entreprise"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone*</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          required
                          disabled={form.seller_approved}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+212 612 34 56 78"
                        />
                      </div>
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          id="show_phone"
                          name="show_phone"
                          checked={form.show_phone}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="show_phone" className="ml-2 text-sm text-gray-600">
                          Afficher sur mes annonces
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MessageSquare className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          name="whatsapp"
                          value={form.whatsapp}
                          onChange={handleInputChange}
                          disabled={form.seller_approved}
                          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+212 612 34 56 78"
                        />
                      </div>
                      <div className="mt-2 flex items-center">
                        <input
                          type="checkbox"
                          id="show_whatsapp"
                          name="show_whatsapp"
                          checked={form.show_whatsapp}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="show_whatsapp" className="ml-2 text-sm text-gray-600">
                          Afficher sur mes annonces
                        </label>
                      </div>
                    </div>
                  </div>

                  {form.seller_type === "professional" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de SIRET*</label>
                        <input
                          name="siret"
                          value={form.siret}
                          onChange={handleInputChange}
                          required
                          disabled={form.seller_approved}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="SIRET"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 font-medium"
              disabled={ui.saving}
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium flex items-center justify-center min-w-32 ${ui.saving ? "opacity-80 cursor-not-allowed" : ""}`}
              disabled={ui.saving}
            >
              {ui.saving ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  <span>Traitement...</span>
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Zone sensible</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">Supprimer votre compte effacera toutes vos données et nécessite une reconnexion.</p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              disabled={ui.deleting}
              className="px-5 py-2.5 rounded-lg bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 transition-all duration-200 font-medium flex items-center gap-2"
            >
              {ui.deleting && <Loader className="h-4 w-4 animate-spin" />}
              Supprimer mon compte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
