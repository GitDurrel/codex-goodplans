// src/pages/VerifyOtpPage.tsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Logo from "../components/Logo";
import { apiVerifyAccountOtp } from "../features/auth/authApi";
import { useAuth } from "../features/auth/AuthContext";
import type { LoginResponse } from "../features/auth/type";

function maskEmail(email: string): string {
  const [localPart, domainPart] = email.split("@");
  if (!domainPart) return email;

  const visibleLocal = localPart.slice(0, 2);
  const maskedLocal = "*".repeat(Math.max(localPart.length - 2, 3));

  const [domainName, tld] = domainPart.split(".");
  if (!tld) return `${visibleLocal}${maskedLocal}@${domainPart}`;

  const visibleDomain = domainName.slice(0, 1);
  const maskedDomain = "*".repeat(Math.max(domainName.length - 1, 3));

  return `${visibleLocal}${maskedLocal}@${visibleDomain}${maskedDomain}.${tld}`;
}

export function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { markOtpValidated } = useAuth();

  const emailParam = searchParams.get("email") ?? "";
  const [codeArray, setCodeArray] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  function handleChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;

    const next = [...codeArray];
    next[index] = value;
    setCodeArray(next);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !codeArray[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]!.focus();
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const email = emailParam.trim();
    const code = codeArray.join("");

    if (!email) {
      const msg = "Email manquant. Merci de revenir depuis le lien d’inscription.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (code.length !== 6) {
      const msg = "Merci de saisir les 6 chiffres du code OTP.";
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      const res: LoginResponse = await apiVerifyAccountOtp(email, code);

      // On met à jour le contexte (user + tokens + hasOTPValidated = true)
      markOtpValidated(res);

      toast.success("Votre compte a été vérifié avec succès 🎉");

      // Redirection vers la home
      navigate("/", { replace: true });
    } catch (err: any) {
      const msg =
        err?.message && !String(err.message).startsWith("HTTP")
          ? err.message
          : "Code invalide ou expiré. Merci de réessayer.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (!emailParam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="mb-6">
          <Logo />
        </div>
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-slate-900 mb-4">
            Lien invalide
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            L’email est manquant. Merci de recommencer votre inscription.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm"
          >
            Retour à l’inscription
          </button>
        </div>
      </div>
    );
  }

  const masked = maskEmail(emailParam);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="pt-10 flex justify-center">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-8 py-10">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
            Vérification de votre compte
          </h1>
          <p className="text-sm text-slate-600 text-center mb-6">
            Un code à 6 chiffres a été envoyé à{" "}
            <span className="font-semibold">{masked}</span>.
            <br />
            Merci de le saisir ci-dessous pour activer votre compte.
          </p>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {codeArray.map((val, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={val}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  disabled={submitting}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg text-sm flex items-center justify-center"
            >
              {submitting && (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              )}
              {submitting ? "Vérification en cours..." : "Valider le code"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            Si vous ne trouvez pas l’email, pensez à vérifier vos spams.
          </p>
        </div>
      </main>
    </div>
  );
}
