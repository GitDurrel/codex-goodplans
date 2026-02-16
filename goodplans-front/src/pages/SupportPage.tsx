import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, MessageSquare, Send, User } from "lucide-react";
import { apiCreateSupportRequest } from "../features/admin/adminApi"; // ✅ tu peux aussi créer un supportApi dédié
import { useLanguage } from "../lib/language/LanguageContext";


type SupportForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const emptyForm: SupportForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function isEmail(v: string) {
  return /^\S+@\S+\.\S+$/.test(v.trim());
}

export default function SupportPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<SupportForm>(emptyForm);
  const [sending, setSending] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      isEmail(form.email) &&
      form.subject.trim().length >= 3 &&
      form.message.trim().length >= 10
    );
  }, [form]);

  function handleChange<K extends keyof SupportForm>(key: K, value: SupportForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim()) return toast.error(t("support.notNameMsg"));
    if (!isEmail(form.email)) return toast.error(t("support.notEmail"));
    if (!form.subject.trim()) return toast.error(t("support.notSubject"));
    if (form.message.trim().length < 10)
      return toast.error(t("support.notMsg"));

    try {
      setSending(true);
      const res = await apiCreateSupportRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });

      toast.success(res?.message || t("support.successMsg"));
      setForm(emptyForm);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || t("support.errorMsg"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-lg">
          <h1 className="text-2xl md:text-3xl font-bold">{t("support.title")}</h1>
          <p className="mt-2 text-blue-100 text-sm md:text-base">
            {t("support.subtitle")}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/15 px-3 py-1">{t("support.badge1")}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{t("support.badge2")}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{t("support.badge3")}</span>
            <span className="rounded-full bg-white/15 px-3 py-1">{t("support.badge4")}</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Infos */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl bg-blue-50 p-2 text-blue-700">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t("support.infoTitle")}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {t("support.infoText")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-slate-900">{t("support.infoSecondTitle")}</p>
              <ul className="mt-2 text-sm text-slate-600 space-y-2">
                <li>• {t("support.infoText1")}</li>
                <li>• {t("support.infoText2")}</li>
                <li>• {t("support.infoText3")}</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{t("support.formTitle")}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {t("support.formSubtitle")}
            </p>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">{t("support.inputName")}</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="flex-1 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={t("support.placeholderName")}
                    />
                  </div>
                </div>

                {/* email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="flex-1 block w-full px-3 py-2.5 rounded-none rounded-r-md border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ex: nom@email.com"
                      type="email"
                    />
                  </div>
                </div>
              </div>

              {/* subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700">{t("support.inputSubject")}</label>
                <input
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="mt-1 block w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("support.placeholderSubject")}
                />
              </div>

              {/* message */}
              <div>
                <label className="block text-sm font-medium text-slate-700">{t("support.inputMsg")}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={6}
                  className="mt-1 block w-full px-3 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t("support.placeholderMsg")}
                />
                <p className="mt-1 text-xs text-slate-500">
                  {t("support.indicationMsg")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setForm(emptyForm)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50"
                  disabled={sending}
                >
                  {t("support.resetButton")}
                </button>
                <button
                  type="submit"
                  disabled={sending || !canSubmit}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {sending ? t("support.loading") : t("support.submitButton")}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* mini FAQ support */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900">{t("support.miniFaqTitle")}</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{t("support.miniFaqCard1P1")}</p>
              <p className="mt-1 text-slate-600">{t("support.miniFaqCard1P2")}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{t("support.miniFaqCard2P1")}</p>
              <p className="mt-1 text-slate-600">{t("support.miniFaqCard2P2")}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
              <p className="font-medium text-slate-900">{t("support.miniFaqCard3P1")}</p>
              <p className="mt-1 text-slate-600">{t("support.miniFaqCard3P2")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
