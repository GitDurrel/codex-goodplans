// src/pages/admin/AdminFeaturedOrdersPage.tsx
import { useEffect, useState } from "react";
import { Loader2, Star, XCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../lib/language/LanguageContext";
import { Link } from "react-router-dom";
import {
  apiAdminGetFeaturedOrders,
  apiAdminCancelFeaturedOrder,
  type AdminFeaturedOrder,
  type FeaturedOrderStatus,
} from "../../features/admin/adminApi";

function getStatusBadgeClasses(status: FeaturedOrderStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "EXPIRED":
      return "bg-gray-100 text-gray-600";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getStatusLabel(status: FeaturedOrderStatus, t: (path: string) => string) {
  switch (status) {
    case "ACTIVE":
      return t("admin.featuredOrders.status.active");
    case "PENDING":
      return t("admin.common.status.pending");
    case "EXPIRED":
      return t("admin.featuredOrders.status.expired");
    case "CANCELLED":
      return t("admin.featuredOrders.status.cancelled");
    default:
      return status;
  }
}

const AdminFeaturedOrdersPage = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<AdminFeaturedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | FeaturedOrderStatus>(
    "all"
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params =
        statusFilter === "all" ? {} : { status: statusFilter as FeaturedOrderStatus };

      const data = await apiAdminGetFeaturedOrders(params);
      setOrders(data || []);
    } catch (err: any) {
      console.error("Error fetching featured orders:", err);
      setError(err?.message || t("admin.featuredOrders.errors.loadRaw"));
      toast.error(t("admin.featuredOrders.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (
      !window.confirm(
        t("admin.featuredOrders.confirm.cancel")
      )
    ) {
      return;
    }

    try {
      await apiAdminCancelFeaturedOrder(orderId);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, status: "CANCELLED" as FeaturedOrderStatus }
            : order
        )
      );
      toast.success(t("admin.featuredOrders.success.cancelled"));
    } catch (err: any) {
      console.error("Error cancelling featured order:", err);
      toast.error(err?.message || t("admin.featuredOrders.errors.cancelFailed"));
    }
  };

  useEffect(() => {
    void fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/featured/plans"
          className="rounded-md border border-primary/30 px-3 py-2 text-sm text-primary hover:bg-primary/5"
        >
          {t("admin.featuredOrders.actions.managePlans")}
        </Link>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as "all" | FeaturedOrderStatus
            )
          }
          className="rounded-md border-gray-300 text-sm shadow-sm focus:border-primary focus:ring-primary"
        >
          <option value="all">{t("admin.common.filters.allStatuses")}</option>
          <option value="ACTIVE">{t("admin.featuredOrders.status.active")}</option>
          <option value="PENDING">{t("admin.common.status.pending")}</option>
          <option value="EXPIRED">{t("admin.featuredOrders.status.expiredPlural")}</option>
          <option value="CANCELLED">{t("admin.featuredOrders.status.cancelledPlural")}</option>
        </select>

        <button
          onClick={fetchOrders}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark transition-colors"
        >
          {t("admin.common.actions.refresh")}
        </button>
      </div>


      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          {error}
          <button
            onClick={fetchOrders}
            className="ml-4 text-sm underline"
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {t("admin.featuredOrders.empty")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredOrders.table.listing")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.reports.table.seller")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredOrders.table.plan")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredOrders.table.period")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("admin.featuredOrders.table.status")}
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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* {t("admin.featuredOrders.table.listing")} */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.listing?.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.listing?.category} ·{" "}
                            {order.listing?.price.toLocaleString("fr-FR")} MAD
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Vendeur */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <div>{order.seller?.username || "—"}</div>
                      <div className="text-xs text-gray-500">
                        {order.seller?.email || "—"}
                      </div>
                    </td>

                    {/* {t("admin.featuredOrders.table.plan")} */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <div className="font-medium">{order.plan?.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.plan?.duration_days} jour
                        {order.plan?.duration_days > 1 ? "s" : ""} ·{" "}
                        {order.plan?.price.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        MAD
                      </div>
                    </td>

                    {/* {t("admin.featuredOrders.table.period")} */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                      <div>
                        Du{" "}
                        {new Date(order.started_at).toLocaleDateString("fr-FR")}
                      </div>
                      <div className="text-xs text-gray-500">
                        au{" "}
                        {new Date(order.ends_at).toLocaleDateString("fr-FR")}
                      </div>
                    </td>

                    {/* Statut */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status, t)}
                      </span>
                    </td>

                    {/* Création */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("fr-FR")}
                    </td>

                    {/* {t("common.actions")} */}
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/listings/${order.listing_id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Voir l&apos;annonce
                        </Link>

                        {order.status === "ACTIVE" && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800"
                          >
                            <XCircle className="h-4 w-4" />
                            {t("common.cancel")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeaturedOrdersPage;