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
import { changePassword } from "../features/auth/authApi";
import type { UserPreferences, UserProfile } from "../features/user/types";
import { PhoneInput } from "../components/forms/PhoneInput";
import { useLanguage } from "../lib/language/LanguageContext";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const ACCOUNT_TYPE_LABEL_FR: Record<string, string> = {
  BUYER: "Acheteur",
  SELLER_PARTICULAR: "Vendeur particulier",
  SELLER_PRO: "Vendeur professionnel",

  // si ton backend renvoie en snake_case (comme sur ta capture)
  buyer: "Acheteur",
  seller_particular: "Vendeur particulier",
  seller_pro: "Vendeur professionnel",
};


interface SettingsPageProps {
  sellerContext?: boolean;
}

type AccountFormState = {
  username: string;
  phone: string;
  whatsapp: string;
  company_name: string;
  account_type: string | null;
};

function extractPreferences(
  prefs: UserPreferences[] | undefined,
): Pick<UserPreferences, "email_notifications" | "push_notifications"> {
  if (prefs && prefs.length > 0) {
    return {
      email_notifications: !!prefs[0].email_notifications,
      push_notifications: !!prefs[0].push_notifications,
    };
  }
  return { email_notifications: true, push_notifications: true };
}

function SettingsPageBase({ sellerContext = false }: SettingsPageProps) {

  const { t } = useLanguage();
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "security">(
    "account",
  );
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accountForm, setAccountForm] = useState<AccountFormState | null>(null);
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ----------------- LOAD PROFILE -----------------
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingProfile(true);
        const data = await getProfile();
        console.log("PROFILE DATA:", data);
        if (cancelled) return;

        setProfile(data);
        setPreferences(extractPreferences(data.user_preferences));

        // pré-remplissage du formulaire de compte
        setAccountForm({
          username: data.username ?? "",
          phone: data.phone ?? "",
          whatsapp: (data as any).whatsapp ?? "",
          company_name: data.company_name ?? "",
          account_type: data.account_type ?? null,
        });
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error
            ? err.message
            : t("settings.alerts.loadError"),
        );
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // auto-clear messages
  useEffect(() => {
    if (!success && !error) return;
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const handlePreferenceChange = (
    key: "email_notifications" | "push_notifications",
    value: boolean,
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        user_preferences: { ...preferences } as Partial<UserPreferences>,
      });
      setSuccess(t("settings.alerts.preferencesUpdated"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("settings.alerts.preferencesSaveError"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(t("settings.alerts.deleteConfirm")))
      return;
    setSaving(true);
    setError(null);
    try {
      await deleteAccount();
      await logout();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("settings.alerts.deleteError"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError(t("settings.alerts.passwordFieldsRequired"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("settings.alerts.passwordMismatch"));
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        t("settings.alerts.passwordInvalid"),
      );
      return;
    }

    setSaving(true);

    try {
      await changePassword(oldPassword, newPassword);

      setSuccess(t("settings.alerts.passwordUpdated"));

      // Nettoyer les champs
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // petit délai UX puis logout
      setTimeout(async () => {
        await logout();        // clear tokens + storage
        navigate("/login", { replace: true });
      }, 1200);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("settings.alerts.passwordChangeError"),
      );
    } finally {
      setSaving(false);
    }
  };


  const accountEmail = useMemo(
    () => profile?.email ?? user?.email ?? "",
    [profile?.email, user?.email],
  );

  const accountTypeRaw = accountForm?.account_type ?? "";
  const accountTypeLabel =
    ACCOUNT_TYPE_LABEL_FR[accountTypeRaw] ??
    ACCOUNT_TYPE_LABEL_FR[accountTypeRaw.toUpperCase()] ??
    (accountTypeRaw ? accountTypeRaw.replaceAll("_", " ") : "");



  const handleAccountFieldChange = (
    field: keyof AccountFormState,
    value: string,
  ) => {
    setAccountForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveAccount = async () => {
    if (!accountForm) return;
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const payload: Partial<UserProfile> = {
        username: accountForm.username?.trim() || undefined,
        phone: accountForm.phone?.trim() || undefined,
        whatsapp: accountForm.whatsapp?.trim() || undefined,
        company_name: accountForm.company_name?.trim() || undefined,
      };

      console.log("Saving profile payload:", payload);


      const updated = await updateProfile(payload as any);
      setProfile(updated);
      setAccountForm({
        username: updated.username ?? "",
        phone: updated.phone ?? "",
        whatsapp: (updated as any).whatsapp ?? "",
        company_name: updated.company_name ?? "",
        account_type: updated.account_type ?? null,
      });
      setSuccess(t("settings.alerts.accountUpdated"));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : t("settings.alerts.accountUpdateError"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile || !accountForm) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">{t("settings.title")}</h1>

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
        {/* Sidebar tabs */}
        <div className="w-full md:w-64 space-y-1">
          <button
            onClick={() => setActiveTab("account")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === "account"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-50"
              }`}
          >
            <User className="mr-3 h-5 w-5" /> {t("settings.tabs.account")}
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === "notifications"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-50"
              }`}
          >
            <Bell className="mr-3 h-5 w-5" /> {t("settings.tabs.notifications")}
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${activeTab === "security"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-50"
              }`}
          >
            <Lock className="mr-3 h-5 w-5" /> {t("settings.tabs.security")}
          </button>

          <div className="mt-6 border-t pt-4">
            <button
              onClick={handleDeleteAccount}
              disabled={saving}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left ${saving ? "text-red-400" : "text-red-600 hover:bg-red-50"
                }`}
            >
              <Trash2 className="mr-3 h-5 w-5" />{" "}
              {saving ? t("settings.account.deleting") : t("settings.account.deleteAccount")}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* onglet COMPTE */}
          {activeTab === "account" && (
            <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
              <h2 className="text-xl font-semibold mb-2">{t("settings.account.title")}</h2>

              <div>
                <label className="mb-1 block text-sm font-medium">{t("settings.account.email")}</label>
                <div className="flex items-center rounded-lg bg-gray-50 p-3 text-slate-700 border border-gray-200">
                  <Mail className="mr-3 h-5 w-5 text-gray-400" />
                  <span>{accountEmail}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                 {t("settings.account.emailHelp")}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.account.username")}
                  </label>
                  <input
                    type="text"
                    value={accountForm.username}
                    onChange={(e) =>
                      handleAccountFieldChange("username", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.account.accountType")}
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700 capitalize">
                    {accountTypeLabel || "N/A"}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {t("settings.account.accountTypeHelp")}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <PhoneInput
                    label={t("settings.account.phone")}
                    value={accountForm.phone}
                    onChange={(val) => handleAccountFieldChange("phone", val)}
                    placeholder="612 34 56 78"
                    disabled={saving}
                    defaultCountry="MA"
                    helperText={t("settings.account.phoneHelper")}
                  />
                </div>

                <div>
                  <PhoneInput
                    label={t("settings.account.whatsapp")}
                    value={accountForm.whatsapp}
                    onChange={(val) => handleAccountFieldChange("whatsapp", val)}
                    placeholder="612 34 56 78"
                    disabled={saving}
                    defaultCountry="MA"
                    helperText={t("settings.account.whatsappHelper")}
                  />
                </div>

              </div>

              {sellerContext && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      {t("settings.account.company")}
                    </label>
                    <input
                      type="text"
                      value={accountForm.company_name}
                      onChange={(e) =>
                        handleAccountFieldChange(
                          "company_name",
                          e.target.value,
                        )
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {t("settings.account.companyHelper")}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={logout}
                  type="button"
                  className="flex items-center text-red-600 hover:text-red-700 text-sm"
                >
                  <LogOut className="mr-2 h-5 w-5" /> {t("settings.account.logout")}
                </button>

                <button
                  onClick={handleSaveAccount}
                  type="button"
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("settings.account.save")}
                </button>
              </div>
            </div>
          )}

          {/* onglet NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t("settings.notifications.title")}</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t("settings.notifications.emailTitle")}</h3>
                    <p className="text-sm text-gray-500">
                      {t("settings.notifications.emailDesc")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handlePreferenceChange(
                        "email_notifications",
                        !preferences.email_notifications,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.email_notifications
                      ? "bg-blue-600"
                      : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.email_notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{t("settings.notifications.pushTitle")}</h3>
                    <p className="text-sm text-gray-500">
                      {t("settings.notifications.pushDesc")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handlePreferenceChange(
                        "push_notifications",
                        !preferences.push_notifications,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${preferences.push_notifications
                      ? "bg-blue-600"
                      : "bg-gray-200"
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.push_notifications
                        ? "translate-x-6"
                        : "translate-x-1"
                        }`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("settings.notifications.save")}
                </button>
              </div>
            </div>
          )}

          {/* onglet SÉCURITÉ */}
          {activeTab === "security" && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t("settings.security.title")}</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.security.oldPassword")}
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.security.newPassword")}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("settings.security.passwordHelper")}
                  </p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.security.confirmPassword")}
                  </label>
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
                  className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("settings.security.update")}
                </button>
              </div>
            </div>
          )}

          {/* bloc spécifique seller : résumé profil vendeur + bio simple */}
          {sellerContext && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">{t("settings.sellerProfile.title")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.account.username")}
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                    {accountForm.username || "-"}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">{t("settings.account.email")}</label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                    {accountEmail || "-"}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.account.accountType")}
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700 capitalize">
                    {(ACCOUNT_TYPE_LABEL_FR[profile?.account_type ?? ""] ??
                      ACCOUNT_TYPE_LABEL_FR[(profile?.account_type ?? "").toUpperCase()] ??
                      (profile?.account_type ?? "").replaceAll("_", " ")) || "N/A"}

                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    {t("settings.sellerProfile.sellerType")}
                  </label>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700 capitalize">
                    {profile?.seller_type ?? "-"}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium">
                  {t("settings.account.company")}
                </label>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-slate-700">
                  {accountForm.company_name || t("settings.sellerProfile.notProvided") }
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
