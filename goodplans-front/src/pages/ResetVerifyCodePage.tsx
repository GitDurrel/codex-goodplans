import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { apiVerifyResetCode, apiForgotPassword } from "../features/auth/authApi";
import { useLanguage } from "../lib/language/LanguageContext";

export function ResetVerifyCodePage() {

  const { t } = useLanguage();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email") ?? "";
  const [codeArray, setCodeArray] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!emailParam) {
      toast.error(t("resetVerifyCode.toast.notEmail"));
      navigate("/login", { replace: true });
      return;
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [emailParam, navigate]);

  // Timer pour le cooldown du bouton "Renvoyer"
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  function handleChange(index: number, value: string) {
    // Autoriser uniquement les chiffres
    if (!/^\d?$/.test(value)) return;

    const next = [...codeArray];
    next[index] = value;
    setCodeArray(next);

    // Auto-focus sur le champ suivant si un chiffre est saisi
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]!.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!codeArray[index] && index > 0) {
        // Si le champ actuel est vide, revenir au précédent
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]!.focus();
        }
      } else {
        // Effacer le champ actuel
        const next = [...codeArray];
        next[index] = "";
        setCodeArray(next);
      }
      e.preventDefault();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Extraire uniquement les chiffres
    const digits = pastedData.replace(/\D/g, "").slice(0, 6);

    if (digits.length > 0) {
      const newCodeArray = [...codeArray];
      for (let i = 0; i < digits.length && i < 6; i++) {
        newCodeArray[i] = digits[i];
      }
      setCodeArray(newCodeArray);

      // Focus sur le dernier champ rempli ou le suivant
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex]!.focus();
      }
    }
  }

  async function handleResendCode() {
    if (!canResend || resending) return;

    const email = emailParam.trim();
    if (!email) {
      toast.error(t("resetVerifyCode.toast.notEmail"));
      return;
    }

    setResending(true);
    setError(null);

    try {
      await apiForgotPassword(email);

      toast.success(t("resetVerifyCode.toast.success"));

      // Réinitialiser les champs
      setCodeArray(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }

      // Activer le cooldown de 60 secondes
      setCanResend(false);
      setCountdown(60);
    } catch (err: any) {
      const msg = err?.message || t("resetVerifyCode.toast.errorResendCode");
      toast.error(msg);
      setError(msg);
    } finally {
      setResending(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const email = emailParam.trim();
    const code = codeArray.join("");

    if (!email) {
      const msg = t("resetVerifyCode.toast.notEmail");
      setError(msg);
      toast.error(msg);
      return;
    }

    if (code.length !== 6) {
      const msg = t("resetVerifyCode.toast.invalidCode");
      setError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);

    try {
      await apiVerifyResetCode(email, code);

      toast.success(t("resetVerifyCode.toast.verifyCode"));

      // ✅ Rediriger vers la page de réinitialisation avec email + code
      navigate(
        `/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`,
        { replace: true }
      );
    } catch (err: any) {
      const msg =
        err?.message && !String(err.message).startsWith("HTTP")
          ? err.message
          : t("resetVerifyCode.toast.errorVerifyCode");
      setError(msg);
      toast.error(msg);

      // Réinitialiser les champs en cas d'erreur
      setCodeArray(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
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
            {t("resetVerifyCode.invalidEmail.title")}
          </h1>
          <p className="text-sm text-slate-600 mb-6">
            {t("resetVerifyCode.invalidEmail.subtitle")}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {t("resetVerifyCode.redirectLogin")}
          </button>
        </div>
      </div>
    );
  }

  const codeComplete = codeArray.every(digit => digit !== "");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="pt-8 sm:pt-10 flex justify-center">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg px-6 sm:px-8 py-8 sm:py-10">
          {/* Header avec icône */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {t("resetVerifyCode.title")}
            </h1>
            <p className="text-sm text-slate-600">
              {t("resetVerifyCode.sendEmailMessage")}
            </p>
            <p className="text-sm font-semibold text-blue-600 mt-1">
              {emailParam}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champs de code */}
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {codeArray.map((val, index) => (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`
                    w-10 h-12 sm:w-12 sm:h-14
                    text-center text-lg sm:text-xl font-bold
                    border-2 rounded-lg
                    transition-all duration-200
                    ${error
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : val
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }
                    focus:outline-none focus:ring-2
                    disabled:bg-slate-100 disabled:cursor-not-allowed
                  `}
                  value={val}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  disabled={submitting}
                  autoComplete="off"
                />
              ))}
            </div>

            <p className="text-xs text-center text-slate-500">
              {t("resetVerifyCode.infoText")}
            </p>
            {/* Bouton valider */}
            <button
              type="submit"
              disabled={submitting || !codeComplete}
              className={`
                w-full py-3 rounded-xl text-white font-semibold
                flex items-center justify-center gap-2
                transition-all duration-200
                ${submitting || !codeComplete
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }
              `}
            >
              {submitting ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("resetVerifyCode.sending")}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("resetVerifyCode.submitButton")}
                </>
              )}
            </button>

            {/* Renvoyer le code */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={submitting || resending || !canResend}
                className={`
                  text-sm font-medium transition-all
                  ${submitting || resending || !canResend
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-blue-600 hover:text-blue-800"
                  }
                `}
              >
                {resending ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-block w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    {t("resetVerifyCode.resending")}
                  </span>
                ) : !canResend ? (
                  `t("resetVerifyCode.resendButton") (${countdown}s)`
                ) : (
                  t("resetVerifyCode.resendButton")
                )}
              </button>
            </div>

            {/* Retour */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              {t("resetVerifyCode.redirectLogin")}
            </button>
          </form>

          {/* Timer d'expiration (optionnel) */}
          <p className="mt-6 text-xs text-center text-slate-500">
            {t("resetVerifyCode.expirationTimer")}
          </p>
        </div>
      </main>
    </div>
  );
}