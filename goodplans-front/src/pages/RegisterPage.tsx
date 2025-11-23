import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { useCheckbox } from "../hooks/useCheckbox";
import { Checkbox } from "../components/forms/Checkbox";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import type { AccountType } from "../features/auth/type";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();

  const sellerCheckbox = useCheckbox(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [sellerType, setSellerType] = useState<"particular" | "professional">(
    "particular"
  );
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSeller = sellerCheckbox.checked;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      const msg = "Les mots de passe ne correspondent pas.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // petites validations côté front
    if (isSeller && !phone.trim()) {
      const msg = "Le téléphone est obligatoire pour un vendeur.";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (isSeller && sellerType === "professional" && !companyName.trim()) {
      const msg = "Le nom de l'entreprise est obligatoire pour un vendeur pro.";
      setError(msg);
      toast.error(msg);
      return;
    }

    // déterminer l'account_type attendu par le backend
    let accountType: AccountType = "buyer";
    if (isSeller) {
      accountType =
        sellerType === "professional" ? "seller_pro" : "seller_particular";
    }

    setLoading(true);
    try {
      await register({
        email,
        password,
        username,
        account_type: accountType, // OBLIGATOIRE

        // champs optionnels RegisterDto
        phone: isSeller ? phone : undefined,
        whatsapp: isSeller ? whatsapp : undefined,
        seller_type: isSeller ? sellerType : undefined,
        company_name:
          isSeller && sellerType === "professional" ? companyName : undefined,
        // siret: ... si tu veux le gérer plus tard
      });

      // Succès + navigation OTP déjà gérés dans AuthContext.register
    } catch (err: any) {
      const msg = err.message || "Inscription impossible.";
      setError(msg);
      // le toast d’erreur est déjà envoyé dans AuthContext.register
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-10 flex justify-center">
        <Logo />
      </header>
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-8">
            S'inscrire
          </h1>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error.split("\n").map((line, idx) => (
                <p key={idx}>• {line}</p>
              ))}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nom d’utilisateur
              </label>
              <input
                type="text"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
              <p className="mt-1 text-xs text-slate-500">
                Lettres, chiffres, tirets et underscores uniquement.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
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
              <p className="mt-1 text-xs text-slate-500">
                Doit contenir au moins une majuscule, une minuscule et un chiffre.
              </p>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
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
            </div>

            {/* Checkbox vendeur */}
            <div className="mt-4 p-3">
              <Checkbox
                checked={sellerCheckbox.checked}
                onChange={sellerCheckbox.toggle}
                label="Je souhaite m’inscrire en tant que vendeur"
                name="isSeller"
              />
            </div>

            {/* Bloc vendeur conditionnel */}
            {isSeller && (
              <div className="mt-4 space-y-4 pl-3 border-l-2 border-slate-200">
                {/* Type vendeur */}
                <div>
                  <span className="block text-sm font-medium text-slate-700 mb-1">
                    Type de vendeur
                  </span>
                  <div className="flex gap-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="particular"
                        checked={sellerType === "particular"}
                        onChange={() => setSellerType("particular")}
                        className="text-blue-600"
                        disabled={loading}
                      />
                      Particulier
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="professional"
                        checked={sellerType === "professional"}
                        onChange={() => setSellerType("professional")}
                        className="text-blue-600"
                        disabled={loading}
                      />
                      Professionnel
                    </label>
                  </div>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {/* Nom entreprise si pro */}
                {sellerType === "professional" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nom de l’entreprise
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                )}

                <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  Votre compte vendeur devra être validé par l’administration.
                </div>
              </div>
            )}

            {/* Bouton s’inscrire */}
            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {loading || authLoading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                "S’inscrire"
              )}
            </button>
          </form>

          {/* Lien déjà un compte */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Déjà un compte ? Se connecter
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
