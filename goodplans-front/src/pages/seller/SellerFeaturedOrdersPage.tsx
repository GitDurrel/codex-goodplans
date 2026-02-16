// src/pages/seller/SellerFeaturedOrdersPage.tsx
import { useEffect, useState } from "react";
import { Loader2, Star, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "../../lib/language/LanguageContext";
import {
  fetchMyFeaturedOrders,
  type FeaturedOrder,
} from "../../features/featured/apiFeatured";

function statusBadgeClasses(status: FeaturedOrder["status"]) {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "EXPIRED":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function statusLabel(status: FeaturedOrder["status"], t: (path: string) => string) {
  switch (status) {
    case "ACTIVE":
      return t("seller.featuredOrders.status.active");
    case "PENDING":
      return t("seller.featuredOrders.status.pending");
    case "CANCELLED":
      return t("seller.featuredOrders.status.cancelled");
    case "EXPIRED":
      return t("seller.featuredOrders.status.expired");
    default:
      return status;
  }
}

export default function SellerFeaturedOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<FeaturedOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const data = await fetchMyFeaturedOrders();
      setOrders(data || []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || t("seller.featuredOrders.errors.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("seller.featuredOrders.title")}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("seller.featuredOrders.subtitle")}
          </p>
        </div>
        <button
          onClick={load}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
        >
          {t("seller.featuredOrders.actions.refresh")}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm">
          {t("seller.featuredOrders.empty")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("seller.featuredOrders.table.listing")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("seller.featuredOrders.table.plan")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("seller.featuredOrders.table.period")}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("seller.featuredOrders.table.status")}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    {t("seller.featuredOrders.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.listing.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.listing.price.toLocaleString("fr-FR")} MAD
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      <div className="font-medium">{order.plan.name}</div>
                      <div className="text-xs text-gray-500">
                        {order.plan.duration_days} {t("seller.featuredOrders.day")}
                        {order.plan.duration_days > 1 ? "s" : ""} ·{" "}
                        {order.plan.price.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        MAD
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                      <div>
                        {t("seller.featuredOrders.from")} {" "}
                        {new Date(order.started_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("seller.featuredOrders.to")} {" "}
                        {new Date(order.ends_at).toLocaleDateString("fr-FR")}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses(
                          order.status
                        )}`}
                      >
                        {statusLabel(order.status, t)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                      <Link
                        to={`/listings/${order.listing_id}`}
                        className="inline-flex items-center gap-1 text-primary hover:text-primary-dark"
                      >
                        {t("seller.featuredOrders.actions.viewListing")}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
