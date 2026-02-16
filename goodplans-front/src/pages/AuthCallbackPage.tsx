import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { supabase } from "../lib/supabase";
import { apiOAuthFinalize } from "../features/auth/authApi";
import { useAuth } from "../features/auth/AuthContext";
import { useLanguage } from "../lib/language/LanguageContext";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { completeLogin } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // 1) Récupérer session Supabase (après redirect Google)
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error(error.message);

        const session = data.session;
        const user = session?.user;

        if (!user?.id || !user?.email) {
          throw new Error(t("authCallback.errors.sessionNotFound"));
        }

        // 2) Finaliser côté backend (comme le mobile)
        const result = await apiOAuthFinalize(user.id, user.email);

        // 3) Transformer -> LoginResponse attendu (user + tokens)
        // ton backend renvoie { user, tokens }
        const loginRes = {
          user: result.user,
          accessToken: result.tokens?.accessToken || result.tokens?.access_token,
          refreshToken: result.tokens?.refreshToken || result.tokens?.refresh_token,
        };

        if (!loginRes.accessToken || !loginRes.refreshToken) {
          throw new Error(t("authCallback.errors.missingTokens"));
        }

        if (cancelled) return;

        toast.success(t("authCallback.success.googleLogin"));
        completeLogin(loginRes as any, "/"); // ou "/dashboard" si tu veux direct
      } catch (e: any) {
        console.error("OAuth callback error:", e);
        toast.error(e?.message || t("authCallback.errors.googleLoginFailed"));
        navigate("/login", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [completeLogin, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="mb-6">
        <Logo />
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-100 p-8 text-center">
        <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <span className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          {t("authCallback.loading.title")}
        </h1>
        <p className="text-sm text-slate-600">
          {loading
            ? t("authCallback.loading.finalizing")
            : t("authCallback.loading.redirecting")}
        </p>
      </div>
    </div>
  );
}
