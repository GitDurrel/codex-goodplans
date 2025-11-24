import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Bell,
  Check,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../features/auth/AuthContext";
import { getProfile, updateProfile, deleteAccount } from "../api/apiUser";
import { changePassword } from "../api/apiAuth";
import type { UserPreferences, UserProfile } from "../features/user/types";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

interface SettingsPageProps {
  sellerContext?: boolean;
}

function extractPreferences(prefs: UserPreferences[] | undefined): Pick<
  UserPreferences,
  "email_notifications" | "push_notifications"
> {
  if (prefs && prefs.length > 0) {
    return {
      email_notifications: !!prefs[0].email_notifications,
      push_notifications: !!prefs[0].push_notifications,
    };
  }
  return { email_notifications: true, push_notifications: true };
}

function SettingsPageBase({ sellerContext = false }: SettingsPageProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "security">("account");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState({ email_notifications: true, push_notifications: true });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingProfile(true);
        const data = await getProfile();
        if (cancelled) return;
        setProfile(data);
        setPreferences(extractPreferences(data.user_preferences));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Impossible de charger vos paramètres");
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handlePreferenceChange = (key: "email_notifications" | "push_notifications", value: boolean) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({ user_preferences: { ...preferences } as Partial<UserPreferences> });
      setSuccess("Préférences mises à jour");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la sauvegarde des préférences");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return;
    setSaving(true);
    setError(null);
    try {
      await deleteAccount();
      await logout();
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Merci de remplir tous les champs mot de passe");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setError("Le mot de passe doit contenir 8 caractères, une majuscule, une minuscule et un chiffre");
      return;
    }

    setSaving(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess("Mot de passe mis à jour");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de changer le mot de passe");
    } finally {
      setSaving(false);
    }
  };

  const accountEmail = useMemo(() => profile?.email ?? user?.email ?? "", [profile?.email, user?.email]);

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>

      {error && (
        <div className="mb-4 flex items-center rounded-lg bg-red-50 p-3 text-red-700">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center rounded-lg bg-emerald-50 p-3 text-emerald-700">
          <Check className="mr-2 h-5 w-5" />
          <span>{success}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
              activeTab === "account" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            <User className="mr-3 h-5 w-5" /> Compte
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
              activeTab === "notifications" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            <Bell className="mr-3 h-5 w-5" /> Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
              activeTab === "security" ? "bg-gray-100 font-medium" : "hover:bg-gray-50"
            }`}
          >
            <Lock className="mr-3 h-5 w-5" /> Sécurité
          </button>

          <div className="mt-6 border-t pt-4">
            <button
              onClick={handleDeleteAccount}
              disabled={saving}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${
                saving ? "text-red-400" : "text-red-600 hover:bg-red-50"
              }`}
            >
              <Trash2 className="mr-3 h-5 w-5" /> {saving ? "Suppression..." : "Supprimer mon compte"}
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          {activeTab === "account" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Compte</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <div className="flex items-center rounded-lg bg-gray-50 p-3 text-slate-700">
                    <Mail className="mr-3 h-5 w-5 text-gray-400" />
                    <span>{accountEmail}</span>
                  </div>
                </div>
                {profile?.username && (
                  <div>
                    <label className="mb-1 block text-sm font-medium">Nom d'utilisateur</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                      {profile.username}
                    </div>
                  </div>
                )}
                <div className="pt-2">
                  <button
                    onClick={logout}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <LogOut className="mr-2 h-5 w-5" /> Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-500">Recevoir les mises à jour importantes par email.</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange("email_notifications", !preferences.email_notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.email_notifications ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.email_notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notifications push</h3>
                    <p className="text-sm text-gray-500">Alertes rapides sur l'activité de vos annonces.</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange("push_notifications", !preferences.push_notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      preferences.push_notifications ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        preferences.push_notifications ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sauvegarder
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Sécurité</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Ancien mot de passe</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nouveau mot de passe</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">Au moins 8 caractères, une majuscule, une minuscule et un chiffre.</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Confirmation</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Mettre à jour
                </button>
              </div>
            </div>
          )}

          {sellerContext && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profil vendeur</h2>
              <div className="grid gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Nom d'utilisateur</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                    {profile?.username ?? "-"}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Email</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                    {accountEmail || "-"}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Type de compte</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700 capitalize">
                      {profile?.account_type ?? "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Type de vendeur</label>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700 capitalize">
                      {profile?.seller_type ?? "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Société</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                    {profile?.company_name || "Non renseigné"}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Téléphone</label>
                    <input
                      type="tel"
                      value={profile?.phone ?? ""}
                      onChange={(e) => setProfile((prev) => (prev ? { ...prev, phone: e.target.value } : prev))}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">Bio (optionnel)</label>
                    <textarea
                      value={(profile as any)?.bio ?? ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? ({ ...prev, bio: e.target.value } as UserProfile & { bio?: string }) : prev
                        )
                      }
                      className="h-[88px] w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">Préparé pour un futur champ bio côté backend.</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      setSaving(true);
                      setError(null);
                      try {
                        const payload = {
                          phone: profile?.phone ?? null,
                          bio: (profile as any)?.bio ?? null,
                        };
                        await updateProfile(payload);
                        setSuccess("Profil vendeur mis à jour");
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Impossible de mettre à jour le profil vendeur");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <SettingsPageBase />;
}

export function SellerSettingsPage() {
  return <SettingsPageBase sellerContext />;
}
