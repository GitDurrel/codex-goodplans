import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Logo from "../components/Logo";
import { apiResetPassword } from "../features/auth/authApi";
import { useLanguage } from "../lib/language/LanguageContext";

type FormValues = {
  password: string;
  confirmPassword: string;
};

export function ResetPasswordPage() {

  const { t } = useLanguage();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const code = searchParams.get("code") ?? "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // ✅ Vérifier que email ET code sont présents
    if (!email || !code) {
      toast.error(t("resetPassword.toast.notEmailOrCode"));
      navigate("/login", { replace: true });
    }
  }, [email, code, navigate]);

  async function onSubmit(values: FormValues) {
    if (!email || !code) {
      toast.error(t("resetPassword.toast.notEmailOrCode"));
      return;
    }

    const { password, confirmPassword } = values;

    if (password !== confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: t("resetPassword.toast.notConfirmPwd"),
      });
      return;
    }

    if (password.length < 8) {
      setError("password", {
        type: "manual",
        message: t("resetPassword.toast.errParamPwd"),
      });
      return;
    }

    try {
      // await apiVerifyResetCode(email, code); // ✅ valide l’OTP
      // ✅ Envoyer email, code ET nouveau mot de passe
      await apiResetPassword(email, code, password);

      toast.success(t("resetPassword.toast.success"));

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1200);
    } catch (err: any) {
      const msg = err?.message || t("resetPassword.toast.error");
      toast.error(msg);
    }
  }

  const passwordValue = watch("password");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="pt-8 flex justify-center">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {t("resetPassword.title")}
            </h1>
            <p className="text-sm text-slate-600">
              {t("resetPassword.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nouveau mot de passe */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("resetPassword.form.inputNewPwd")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-all`}
                  placeholder={t("resetPassword.form.placeholderNewPwd")}
                  {...register("password", {
                    required: t("resetPassword.form.requiredPwd"),
                    minLength: {
                      value: 8,
                      message: t("resetPassword.form.minLength"),
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: t("resetPassword.form.pattern")
                    }
                  })}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19C7.523 19 3.732 16.057 2.458 12a9.956 9.956 0 011.563-3.03M9.88 9.88A3 3 0 0115 12m-1.879 2.121A2.999 2.999 0 019.88 9.88m0 0L6.59 6.59m3.29 3.29l4.24 4.24M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t("resetPassword.form.inputConfirmPwd")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.confirmPassword
                    ? "border-red-300 focus:ring-red-500"
                    : "border-slate-300 focus:ring-blue-500"
                    } focus:outline-none focus:ring-2 transition-all`}
                  placeholder={t("resetPassword.form.placeholderconfirmPwd")}
                  {...register("confirmPassword", {
                    required: t("resetPassword.form.requiredConfirmPwd"),
                    validate: (value) =>
                      value === passwordValue ||
                      t("resetPassword.form.validatePwd"),
                  })}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19C7.523 19 3.732 16.057 2.458 12a9.956 9.956 0 011.563-3.03M9.88 9.88A3 3 0 0115 12m-1.879 2.121A2.999 2.999 0 019.88 9.88m0 0L6.59 6.59m3.29 3.29l4.24 4.24M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Indicateur de force du mot de passe */}
            {passwordValue && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => {
                    const strength = passwordValue.length >= 12 ? 4 :
                      passwordValue.length >= 10 ? 3 :
                        passwordValue.length >= 8 ? 2 : 1;

                    return (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all ${level <= strength
                          ? strength === 4 ? 'bg-green-500' :
                            strength === 3 ? 'bg-blue-500' :
                              strength === 2 ? 'bg-yellow-500' : 'bg-red-500'
                          : 'bg-slate-200'
                          }`}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  {passwordValue.length >= 12 ? t("resetPassword.form.VeryStrongPwd") :
                    passwordValue.length >= 10 ? t("resetPassword.form.strongPwd") :
                      passwordValue.length >= 8 ? t("resetPassword.form.meanPwd") : t("resetPassword.form.lowPwd")
                  }
                </p>
              </div>
            )}

            {/* Bouton soumettre */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3 px-4 rounded-xl text-white font-semibold
                flex items-center justify-center gap-2 transition-all
                ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                }
              `}
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t("resetPassword.form.submitting")}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("resetPassword.form.submitButton")}
                </>
              )}
            </button>

            {/* Retour */}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium"
            >
              {t("resetPassword.redirectLogin")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}