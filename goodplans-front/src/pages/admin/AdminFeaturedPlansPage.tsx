// src/pages/admin/AdminFeaturedPlansPage.tsx
import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../lib/language/LanguageContext";
import {
  apiAdminGetFeaturedPlans,
  apiAdminCreateFeaturedPlan,
  apiAdminUpdateFeaturedPlan,
  apiAdminDeleteFeaturedPlan,
  type AdminFeaturedPlan,
} from "../../features/admin/adminApi";

type PlanFormMode = "create" | "edit";

interface PlanFormState {
  id?: string;
  name: string;
  description: string;
  duration_days: number | "";
  price: number | "";
  is_active: boolean;
}

const emptyForm: PlanFormState = {
  name: "",
  description: "",
  duration_days: "",
  price: "",
  is_active: true,
};

const AdminFeaturedPlansPage = () => {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<AdminFeaturedPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<PlanFormMode>("create");
  const [form, setForm] = useState<PlanFormState>(emptyForm);

  const openCreateModal = () => {
    setMode("create");
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: AdminFeaturedPlan) => {
    setMode("edit");
    setForm({
      id: plan.id,
      name: plan.name,
      description: plan.description || "",
      duration_days: plan.duration_days,
      price: plan.price,
      is_active: plan.is_active,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiAdminGetFeaturedPlans();
      setPlans(data || []);
    } catch (err: any) {
      console.error("Error fetching featured plans:", err);
      setError(err?.message || t("admin.featuredPlans.errors.loadRaw"));
      toast.error(t("admin.featuredPlans.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPlans();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget;

    setForm((prev) => {
      if (type === "checkbox") {
        const checked = (e.currentTarget as HTMLInputElement).checked;
        return { ...prev, [name]: checked };
      }

      if (name === "duration_days" || name === "price") {
        const numValue = value === "" ? "" : Number(value);
        return { ...prev, [name]: numValue };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.duration_days === "" || form.price === "") {
      toast.error(t("admin.featuredPlans.errors.requiredFields"));
      return;
    }

    try {
      setSaving(true);

      if (mode === "create") {
        const created = await apiAdminCreateFeaturedPlan({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          duration_days: Number(form.duration_days),
          price: Number(form.price),
          is_active: form.is_active,
        });

        setPlans((prev) => [created, ...prev]);
        toast.success(t("admin.featuredPlans.success.created"));
      } else if (mode === "edit" && form.id) {
        const updated = await apiAdminUpdateFeaturedPlan(form.id, {
          name: form.name.trim(),
          description: form.description.trim(),
          duration_days: Number(form.duration_days),
          price: Number(form.price),
          is_active: form.is_active,
        });

        setPlans((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success(t("admin.featuredPlans.success.updated"));
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error saving plan:", err);
      toast.error(err?.message || t("admin.featuredPlans.errors.saveFailed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (plan: AdminFeaturedPlan) => {
    if (
      !window.confirm(
        t("admin.featuredPlans.confirm.disable")
      )
    ) {
      return;
    }

    try {
      const updated = await apiAdminDeleteFeaturedPlan(plan.id);
      setPlans((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      toast.success(t("admin.featuredPlans.success.disabled"));
    } catch (err: any) {
      console.error("Error deleting plan:", err);
      toast.error(err?.message || t("admin.featuredPlans.errors.disableFailed"));
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("admin.featuredPlans.title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure les plans que les vendeurs peuvent acheter pour booster leurs annonces.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          {t("admin.featuredPlans.actions.newPlan")}
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          {error}
          <button
            onClick={fetchPlans}
            className="ml-4 text-sm underline"
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {plans.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {t("admin.featuredPlans.empty")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredPlans.table.name")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredPlans.table.duration")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredPlans.table.price")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredPlans.table.status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredPlans.table.createdAt")}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">
                        {plan.name}
                      </div>
                      {plan.description && (
                        <div className="text-xs text-gray-500">
                          {plan.description}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {plan.duration_days} jour
                      {plan.duration_days > 1 ? "s" : ""}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      {plan.price.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      MAD
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      {plan.is_active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                          <CheckCircle className="h-3 w-3" />
                          {t("admin.featuredPlans.status.active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          <XCircle className="h-3 w-3" />
                          {t("admin.featuredPlans.status.inactive")}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(plan.created_at).toLocaleDateString("fr-FR")}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
                        >
                          <Pencil className="h-4 w-4" />
                          {t("common.edit")}
                        </button>

                        <button
                          onClick={() => handleDelete(plan)}
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                          {t("admin.featuredPlans.actions.disable")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREATE / EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {mode === "create"
                  ? t("admin.featuredPlans.modal.createTitle")
                  : t("admin.featuredPlans.modal.editTitle")}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                disabled={saving}
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("admin.featuredPlans.form.name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Ex: Boost 7 jours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("admin.featuredPlans.form.description")} (optionnelle)
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
                  placeholder="Ex: Mise en avant pendant 7 jours en haut de la liste"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("admin.featuredPlans.table.duration")} (jours)
                  </label>
                  <input
                    type="number"
                    name="duration_days"
                    value={form.duration_days}
                    onChange={handleChange}
                    min={1}
                    required
                    className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("admin.featuredPlans.table.price")} (MAD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    required
                    className="mt-1 w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_active"
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm text-gray-700"
                >
                  Plan actif (visible pour les vendeurs)
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {t("common.cancel")}
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-70"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === "create" ? t("admin.featuredPlans.actions.create") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeaturedPlansPage;