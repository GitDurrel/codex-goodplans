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
      return "Active";
    case "PENDING":
      return t("admin.common.status.pending");
    case "EXPIRED":
      return "Expirée";
    case "CANCELLED":
      return "Annulée";
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
      setError(err?.message || "Erreur lors du chargement des mises en avant");
      toast.error("Impossible de charger les mises en avant");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (
      !window.confirm(
        "Annuler cette mise en avant ? L'annonce ne sera plus prioritaire dans les résultats."
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
      toast.success("Mise en avant annulée avec succès");
    } catch (err: any) {
      console.error("Error cancelling featured order:", err);
      toast.error(err?.message || "Erreur lors de l'annulation");
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
          Gérer les packs
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
          <option value="all">Tous les statuts</option>
          <option value="ACTIVE">Actives</option>
          <option value="PENDING">En attente</option>
          <option value="EXPIRED">Expirées</option>
          <option value="CANCELLED">Annulées</option>
        </select>

        <button
          onClick={fetchOrders}
          className="rounded-md bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark transition-colors"
        >
          Actualiser
        </button>
      </div>


      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-500">
          {error}
          <button
            onClick={fetchOrders}
            className="ml-4 text-sm underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Aucune mise en avant trouvée.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Annonce
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Vendeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Période
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    {/* Annonce */}
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

                    {/* Plan */}
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

                    {/* Période */}
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

                    {/* Actions */}
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
                            Annuler
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