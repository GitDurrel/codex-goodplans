import { useState } from "react";
import { apiRequest } from "../lib/apiRequest";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "../lib/language/LanguageContext";

export default function AdvertisingRequestPage() {
  const { t } = useLanguage() ;

  const location = useLocation();
  const navigate = useNavigate();

  const from = (location.state as any)?.from ?? "/";

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    duration: "",
    topOfPage: false,
    popup: false,
    carousel: false,
    searchPageBanner: false,
  });
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("POST", "/public/advertising-requests", {
        name: form.name,
        company: form.company,
        email: form.email,
        duration: form.duration,
        ad_space: {
          topOfPage: form.topOfPage,
          popup: form.popup,
          carousel: form.carousel,
          searchPage: form.searchPageBanner,
        },
      });

      toast.success(t("advertisingRequest.toast.success"));
      setForm({
        name: "",
        company: "",
        email: "",
        duration: "",
        topOfPage: false,
        popup: false,
        carousel: false,
        searchPageBanner: false,
      });
    } catch (err: any) {
      toast.error(err.message || t("advertisingRequest.toast.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-3 py-8 max-w-3xl">
      {/* Barre de retour */}
      <div className="mb-3 flex items-center">
        <button
          type="button"
          onClick={() => navigate(from)}
          className="inline-flex items-center rounded-full bg-white px-3 py-1 text-sm text-slate-700 shadow-sm hover:bg-slate-100"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
        </button>
      </div>

      <h1 className="text-2xl font-extrabold mb-2 text-gray-900">
        {t("advertisingRequest.title")}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
       {t("advertisingRequest.subtitle")}
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {t("advertisingRequest.form.contactName")}
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md border border-blue-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-shadow px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {t("advertisingRequest.form.companyName")}
          </label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full rounded-md border border-blue-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-shadow px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-blue-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-shadow px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            {t("advertisingRequest.form.duration")}
          </label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder={t("advertisingRequest.form.placeholderDuration")}
            className="w-full rounded-md border border-blue-100 focus:border-blue-600 focus:ring-2 focus:ring-blue-50 transition-shadow px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <span className="block text-sm font-medium mb-3 text-gray-700">
            {t("advertisingRequest.form.ChooseArea")}
          </span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="topOfPage"
                checked={form.topOfPage}
                onChange={handleChange}
                className="accent-blue-600 h-4 w-4"
              />
              {t("advertisingRequest.form.TopOfPage")}
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="popup"
                checked={form.popup}
                onChange={handleChange}
                className="accent-blue-600 h-4 w-4"
              />
              Popup
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="carousel"
                checked={form.carousel}
                onChange={handleChange}
                className="accent-blue-600 h-4 w-4"
              />
              {t("advertisingRequest.form.carousel")}
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="searchPageBanner"
                checked={form.searchPageBanner}
                onChange={handleChange}
                className="accent-blue-600 h-4 w-4"
              />
              {t("advertisingRequest.form.searchBannerPage")}
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 disabled:opacity-60 shadow-md transition"
          >
            {loading ? t("advertisingRequest.form.loading") : t("advertisingRequest.form.submit")}
          </button>
          <p className="text-xs text-gray-500">
            {t("advertisingRequest.footerInfo")}
          </p>
        </div>
      </form>
    </div>
  );
}
