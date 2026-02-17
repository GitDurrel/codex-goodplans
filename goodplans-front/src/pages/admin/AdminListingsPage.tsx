// src/features/admin/pages/AdminListingsPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  Pause,
  MapPin,
  AlertCircle,
  Loader2,
  Pencil,
  Tag,
  Trash,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLanguage } from "../../lib/language/LanguageContext";

import {
  apiAdminGetListings,
  apiAdminUpdateListingStatus,
  apiAdminDeleteListing,
  type AdminListing,
  type AdminListingApprovalAction,
} from "../../features/admin/adminApi";

type StatusFilter =
  | "all"
  | "pending"
  | "published"
  | "rejected"
  | "suspended"
  | "sold"
  | "archived";

type TransactionFilter = "all" | "sale" | "rent";

type ModalAction = AdminListingApprovalAction | "delete";

type ModalState = {
  open: boolean;
  listing: AdminListing | null;
  action: ModalAction | null;
};

const ITEMS_PER_PAGE = 10;

export default function AdminListingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [listings, setListings] = useState<AdminListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [transactionFilter, setTransactionFilter] =
    useState<TransactionFilter>("all");

  const [page, setPage] = useState(1);

  const [modal, setModal] = useState<ModalState>({
    open: false,
    listing: null,
    action: null,
  });
  const [modalReason, setModalReason] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // --------- LOAD ---------

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: any = {};
        if (categoryFilter !== "all") params.category = categoryFilter;
        if (transactionFilter !== "all")
          params.transaction_type = transactionFilter;

        const data = await apiAdminGetListings(params);
        setListings(data);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Erreur lors du chargement des annonces");
        toast.error("Impossible de charger les annonces");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [categoryFilter, transactionFilter]);

  // --------- HELPERS ---------

  const categoriesOptions = useMemo(() => {
    const set = new Set<string>();
    listings.forEach((l) => {
      if (l.category) set.add(l.category);
    });
    return Array.from(set);
  }, [listings]);

  const normalizeStatus = (l: AdminListing): string => {
    const raw =
      l.status ??
      (l.is_approved ? "Publié" : t("admin.common.status.pending"));
    return raw.toString().toLowerCase();
  };

  const statusLabelAndColor = (l: AdminListing) => {
    const s = normalizeStatus(l);

    if (s.includes("publi") || s === "active") {
      return {
        label: "Publié",
        className: "bg-emerald-50 text-emerald-700",
      };
    }
    if (s.includes("attente") || s === "pending") {
      return {
        label: t("admin.common.status.pending"),
        className: "bg-amber-50 text-amber-700",
      };
    }
    if (s.includes("rejete") || s.includes("rejeté") || s.includes("rejetée")) {
      return {
        label: "Rejeté",
        className: "bg-red-50 text-red-700",
      };
    }
    if (s.includes("suspend")) {
      return {
        label: "Suspendu",
        className: "bg-orange-50 text-orange-700",
      };
    }
    if (s.includes("vendu")) {
      return {
        label: "Vendu",
        className: "bg-blue-50 text-blue-700",
      };
    }
    if (s.includes("archive")) {
      return {
        label: t("admin.common.status.archived"),
        className: "bg-slate-50 text-slate-700",
      };
    }

    return {
      label: l.status || "Inconnu",
      className: "bg-slate-50 text-slate-700",
    };
  };

  const categoryLabel = (slug: string) => {
    const map: Record<string, string> = {
      real_estate: "Immobilier",
      immobilier: "Immobilier",
      vehicle: "Véhicules",
      vehicules: "Véhicules",
      service: "Services",
      services: "Services",
      craft: "Artisanat",
      artisanat: "Artisanat",
    };
    return map[slug] || slug;
  };

  // --------- FILTERED + PAGINATION ---------

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const s = normalizeStatus(l);

      if (statusFilter !== "all") {
        if (
          statusFilter === "pending" &&
          !(s.includes("attente") || s === "pending")
        ) {
          return false;
        }
        if (
          statusFilter === "published" &&
          !(s.includes("publi") || s === "active")
        ) {
          return false;
        }
        if (
          statusFilter === "rejected" &&
          !(
            s.includes("rejete") ||
            s.includes("rejeté") ||
            s.includes("rejetée")
          )
        ) {
          return false;
        }
        if (statusFilter === "suspended" && !s.includes("suspend")) {
          return false;
        }
        if (statusFilter === "sold" && !s.includes("vendu")) {
          return false;
        }
        if (statusFilter === "archived" && !s.includes("archive")) {
          return false;
        }
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        const title = l.title?.toLowerCase() ?? "";
        const desc = l.description?.toLowerCase() ?? "";
        const username = l.user?.username?.toLowerCase() ?? "";
        const company = l.user?.company_name?.toLowerCase() ?? "";

        if (
          !title.includes(q) &&
          !desc.includes(q) &&
          !username.includes(q) &&
          !company.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [listings, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / ITEMS_PER_PAGE)
  );

  const paginatedListings = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredListings.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredListings, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // --------- STATS ---------

  const stats = useMemo(() => {
    let pending = 0;
    let published = 0;
    let rejected = 0;
    let suspended = 0;

    listings.forEach((l) => {
      const s = normalizeStatus(l);
      if (s.includes("attente") || s === "pending") pending++;
      else if (s.includes("publi") || s === "active") published++;
      else if (
        s.includes("rejete") ||
        s.includes("rejeté") ||
        s.includes("rejetée")
      )
        rejected++;
      else if (s.includes("suspend")) suspended++;
    });

    return {
      total: listings.length,
      pending,
      published,
      rejected,
      suspended,
    };
  }, [listings]);

  // --------- ACTIONS ---------

  const openModal = (listing: AdminListing, action: ModalAction) => {
    setModal({ open: true, listing, action });
    setModalReason("");
  };

  const closeModal = () => {
    if (modalLoading) return;
    setModal({ open: false, listing: null, action: null });
    setModalReason("");
  };

  const handleConfirmAction = async () => {
    if (!modal.listing || !modal.action) return;

    const listing = modal.listing;
    const action = modal.action;

    if (action === "delete") {
      await apiAdminDeleteListing(listing.id);

      setListings((prev) =>
        prev.filter((l) => l.id !== listing.id)
      );

      toast.success("Annonce supprimée définitivement");
      closeModal();
      return;
    }


    try {
      setModalLoading(true);

      const payload: any = { action };

      if (action === "reject") {
        if (!modalReason.trim()) {
          toast.error("La raison du rejet est obligatoire");
          setModalLoading(false);
          return;
        }
        payload.rejection_reason = modalReason.trim();
      }

      if (action === "suspend") {
        if (!modalReason.trim()) {
          toast.error("La raison de la suspension est obligatoire");
          setModalLoading(false);
          return;
        }
        payload.suspension_reason = modalReason.trim();
      }

      const updated = await apiAdminUpdateListingStatus(listing.id, payload);

      setListings((prev) =>
        prev.map((l) => (l.id === updated.id ? updated : l))
      );

      toast.success(
        action === "approve"
          ? "Annonce publiée"
          : action === "reject"
            ? "Annonce rejetée"
            : "Annonce suspendue"
      );
      closeModal();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erreur lors de la mise à jour");
    } finally {
      setModalLoading(false);
    }
  };

  const getActionButtons = (listing: AdminListing) => {
    const s = normalizeStatus(listing);

    const showApprove =
      s.includes("attente") ||
      s === "pending" ||
      s.includes("rejete") ||
      s.includes("rejeté") ||
      s.includes("rejetée") ||
      s.includes("suspend");

    const showReject =
      s.includes("attente") ||
      s === "pending" ||
      s.includes("publi") ||
      s === "active";

    const showSuspend =
      s.includes("publi") || s === "active";

    return (
      <>
        {showApprove && (
          <IconButton
            title={
              s.includes("suspend") || s.includes("rejet")
                ? "Republier l’annonce"
                : "Approuver l’annonce"
            }
            variant="success"
            onClick={() => openModal(listing, "approve")}
          >
            <Check className="h-4 w-4" />
          </IconButton>
        )}

        {showReject && (
          <IconButton
            title="Rejeter l’annonce"
            variant="dangerOutline"
            onClick={() => openModal(listing, "reject")}
          >
            <X className="h-4 w-4" />
          </IconButton>
        )}

        {showSuspend && (
          <IconButton
            title="Suspendre l’annonce"
            variant="warning"
            onClick={() => openModal(listing, "suspend")}
          >
            <Pause className="h-4 w-4" />
          </IconButton>
        )}
      </>
    );
  };

  // --------- RENDER ---------

  if (loading && listings.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && listings.length === 0) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            Gestion des annonces
          </h1>
          <p className="text-sm text-slate-500">
            Validation, suspension et suivi des listings.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative flex-1 min-w-[220px]">
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Recherche (titre, vendeur, entreprise)…"
              className="w-full rounded-full border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Total annonces" value={stats.total} icon={Tag} />
        <StatCard label={t("admin.common.status.pending")} value={stats.pending} icon={AlertCircle} />
        <StatCard label={t("admin.listings.stats.published")} value={stats.published} icon={Check} />
        <StatCard label="Suspendues" value={stats.suspended} icon={Pause} />
      </div>

      {/* filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">Toutes les catégories</option>
          {categoriesOptions.map((c) => (
            <option key={c} value={c}>
              {categoryLabel(c)}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as StatusFilter);
            setPage(1);
          }}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="published">Publiées</option>
          <option value="rejected">Rejetées</option>
          <option value="suspended">Suspendues</option>
          <option value="sold">Vendues</option>
          <option value="archived">Archivées</option>
        </select>

        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={transactionFilter}
          onChange={(e) => {
            setTransactionFilter(e.target.value as TransactionFilter);
            setPage(1);
          }}
        >
          <option value="all">Toutes transactions</option>
          <option value="sale">Vente</option>
          <option value="rent">Location</option>
        </select>
      </div>

      {/* table */}
      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <Th>Annonce</Th>
              <Th>Vendeur</Th>
              <Th className="hidden md:table-cell">Localisation</Th>
              <Th>Prix</Th>
              <Th className="hidden lg:table-cell">Statut</Th>
              <Th className="hidden lg:table-cell">Vues</Th>
              <Th className="hidden xl:table-cell">Créée le</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {paginatedListings.map((l) => {
              const statusStyle = statusLabelAndColor(l);

              return (
                <tr key={l.id} className="hover:bg-slate-50/70">
                  {/* annonce */}
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {l.images?.[0] ? (
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <Tag className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[220px] truncate text-sm font-semibold text-slate-900">
                          {l.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {categoryLabel(l.category)}
                        </p>
                      </div>
                    </div>
                  </Td>

                  {/* vendeur */}
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        {l.user?.avatar_url ? (
                          <img
                            src={l.user.avatar_url}
                            alt={l.user.username || ""}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-medium">
                            {(l.user?.company_name ||
                              l.user?.username ||
                              "A")[0]
                              ?.toString()
                              .toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[140px] truncate text-xs font-medium text-slate-900">
                          {l.user?.company_name ||
                            l.user?.username ||
                            "Vendeur inconnu"}
                        </p>
                        <p className="max-w-[140px] truncate text-[11px] text-slate-500">
                          {l.user?.email}
                        </p>
                      </div>
                    </div>
                  </Td>

                  {/* localisation */}
                  <Td className="hidden md:table-cell text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="truncate">
                        {l.region ? `${l.city}, ${l.region}` : l.city}
                      </span>
                    </div>
                  </Td>

                  {/* price */}
                  <Td>
                    <div className="text-sm font-semibold text-slate-900">
                      {l.price?.toLocaleString("fr-FR")} MAD
                    </div>
                    <div className="text-xs text-slate-500">
                      {l.transaction_type || t("admin.listings.table.notSpecified")}
                    </div>
                  </Td>

                  {/* statut */}
                  <Td className="hidden lg:table-cell">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusStyle.className}`}
                    >
                      {statusStyle.label}
                    </span>
                  </Td>

                  {/* vues */}
                  <Td className="hidden lg:table-cell text-xs text-slate-600">
                    {l.views ?? 0}
                  </Td>

                  {/* date */}
                  <Td className="hidden xl:table-cell text-xs text-slate-500">
                    {l.created_at
                      ? new Date(l.created_at).toLocaleDateString("fr-FR")
                      : "-"}
                  </Td>

                  {/* actions */}
                  <Td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        title="Voir la fiche publique"
                        onClick={() => navigate(`/listings/${l.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </IconButton>

                      <IconButton
                        title="Modifier l’annonce"
                        onClick={() =>
                          navigate(`/seller/listings/${l.id}/edit`)
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </IconButton>

                      <IconButton
                        title="Supprimer définitivement"
                        variant="danger"
                        onClick={() => openModal(l, "delete")}
                      >
                        <Trash className="h-4 w-4" />
                      </IconButton>

                      {getActionButtons(l)}
                    </div>
                  </Td>
                </tr>
              );
            })}

            {paginatedListings.length === 0 && !loading && (
              <tr>
                <td
                  className="px-4 py-10 text-center text-sm text-slate-500"
                  colSpan={8}
                >
                  Aucune annonce trouvée avec ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        )}

        {/* pagination */}
        {filteredListings.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-600">
            <span>
              Affichage de{" "}
              {(page - 1) * ITEMS_PER_PAGE + 1} à{" "}
              {Math.min(page * ITEMS_PER_PAGE, filteredListings.length)} sur{" "}
              {filteredListings.length} annonces
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => page > 1 && setPage((p) => p - 1)}
                className="rounded-full border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Précédent
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => page < totalPages && setPage((p) => p + 1)}
                className="rounded-full border border-slate-200 px-2 py-1 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* modal */}
      {modal.open && modal.listing && modal.action && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-slate-100 p-2">
                {modal.action === "approve" ? (
                  <Check className="h-5 w-5 text-emerald-600" />
                ) : modal.action === "reject" ? (
                  <X className="h-5 w-5 text-red-600" />
                ) : (
                  <Pause className="h-5 w-5 text-orange-600" />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {modal.action === "delete" && "Supprimer définitivement l’annonce"}
                  {modal.action === "approve" && "Approuver l’annonce"}
                  {modal.action === "reject" && "Rejeter l’annonce"}
                  {modal.action === "suspend" && "Suspendre l’annonce"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {modal.action === "delete" &&
                    `Confirmer la suppression définitive de « ${modal.listing.title} » ?`}
                  {modal.action === "approve" &&
                    `Confirmer la publication de « ${modal.listing.title} » ?`}
                  {modal.action === "reject" &&
                    `Confirmer le rejet de « ${modal.listing.title} » ?`}
                  {modal.action === "suspend" &&
                    `Confirmer la suspension de « ${modal.listing.title} » ?`}
                </p>
              </div>
            </div>

            {(modal.action === "reject" || modal.action === "suspend") && (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Raison{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  placeholder={
                    modal.action === "reject"
                      ? "Raison du rejet…"
                      : "Raison de la suspension…"
                  }
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={modalLoading}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={modalLoading}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${modal.action === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : modal.action === "reject"
                      ? "bg-red-600 hover:bg-red-700"
                      : modal.action === "suspend"
                        ? "bg-orange-600 hover:bg-orange-700"
                        : "bg-red-700 hover:bg-red-800"
                  }`}
              >
                {modalLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------- UI helpers ---------

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-3 py-3 align-middle text-sm ${className}`}>{children}</td>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  children,
  title,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  variant?:
  | "default"
  | "success"
  | "danger"
  | "dangerOutline"
  | "warning";
  onClick?: () => void;
}) {
  const base =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs transition-colors";

  const variants: Record<string, string> = {
    default:
      "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    danger:
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
    dangerOutline:
      "border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700",
    warning:
      "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100",
  };

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}