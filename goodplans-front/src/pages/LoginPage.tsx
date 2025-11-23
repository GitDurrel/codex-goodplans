import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { apiForgotPassword } from "../features/auth/authApi";
import Logo from "../components/Logo";
import toast from "react-hot-toast";

export function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      await login(email, password); // toasts + navigate dans le contexte
      // pas besoin de toast ici, déjà géré dans AuthContext
    } catch (err: any) {
      const msg = err.message || "Connexion impossible";
      setError(msg);
      // le toast d'erreur est déjà déclenché dans AuthContext.login
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setInfo(null);

    if (!email) {
      const msg = "Merci de renseigner votre email d’abord.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setForgotLoading(true);
    try {
      await apiForgotPassword(email);
      const msg = "Un email de réinitialisation a été envoyé.";
      setInfo(msg);
      toast.success(msg);
    } catch (err: any) {
      const msg =
        err.message || "Impossible d’envoyer l’email de réinitialisation.";
      setError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  }

  function handleGoogleLogin() {
    // adapte l’URL à ton backend (route d’init OAuth, pas le callback)
    window.location.href = "http://localhost:3000/api/auth/google";
  }

  return (
    <div className="min-h-screen bg-slate-30 flex flex-col">
      <header className="pt-10 flex justify-center">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">
            Se connecter
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {info && (
            <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="vous@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-blue-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19C7.523 19 3.732 16.057 2.458 12a9.956 9.956 0 011.563-3.03M9.88 9.88A3 3 0 0115 12m-1.879 2.121A2.999 2.999 0 019.88 9.88m0 0L6.59 6.59m3.29 3.29l4.24 4.24M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading || loading}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {forgotLoading ? "Envoi..." : "Mot de passe oublié ?"}
                </button>
              </div>
            </div>

            {/* Bouton Se connecter */}
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading || authLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Google */}
          <div className="mt-6">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full max-w-xs flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 34.1-25.1 62.8-53.4 82v68.1h86.2c50.5-46.6 81.8-115.3 81.8-195.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c72.6 0 133.5-23.9 178-64.8l-86.2-68.1c-24.3 16.3-55.3 25.9-91.8 25.9-70.6 0-130.4-47.6-151.8-111.5H31.8v69.9c44.7 88 137 148.6 240.2 148.6z"
                    fill="#34A853"
                  />
                  <path
                    d="M120.2 325.8c-10.3-30.1-10.3-62.5 0-92.6V163.3H31.8c-36.3 71.5-36.3 156.2 0 227.6l88.4-65.1z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.7c39.5-.6 77.6 13.9 106.9 40.5l80.2-80.2C410.8 25 343.4 0 272 0 169 0 76.5 60.6 31.8 148.7l88.4 65.1C141.7 155.3 201.5 107.7 272 107.7z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Se connecter avec Google</span>
              </button>
            </div>
          </div>

          {/* Lien inscription */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Pas encore de compte ?
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
