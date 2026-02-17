import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Search,
  Shield,
  Ban,
  Check,
  X,
  Trash2,
  User,
  Store,
  Mail,
  Phone,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import {
  type AdminUser,
  apiGetUsers,
  apiBanUser,
  apiUnbanUser,
  apiApproveSeller,
  apiRejectSeller,
  apiDeleteUser,
  type UsersMeta,
  apiCreateAdmin,
  type AdminRole,
} from "../../features/admin/adminApi";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../lib/language/LanguageContext";

type Filters = {
  search: string;
  isSeller: "all" | "yes" | "no";
  sellerApproved: "all" | "yes" | "no";
  banned: "all" | "yes" | "no";
};

type ActionType = "ban" | "unban" | "approveSeller" | "rejectSeller" | "delete";

const DEFAULT_LIMIT = 20;

function isBanned(user: AdminUser): boolean {
  if (!user.banned_until) return false;
  return new Date(user.banned_until) > new Date();
}

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<UsersMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    isSeller: "all",
    sellerApproved: "all",
    banned: "all",
  });
  const [reloadKey, setReloadKey] = useState(0);

  // confirmation modal state
  const [confirmAction, setConfirmAction] = useState<{
    type: ActionType;
    user: AdminUser;
  } | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // modal création admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminRole, setAdminRole] = useState<AdminRole>("admin");
  const [adminLoading, setAdminLoading] = useState(false);

  // Chargement des utilisateurs
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const params: any = {
          page,
          limit: DEFAULT_LIMIT,
          sortBy: "created_at",
          sortOrder: "desc",
        };

        if (filters.search.trim()) {
          params.search = filters.search.trim();
        }
        if (filters.isSeller === "yes") params.is_seller = true;
        if (filters.isSeller === "no") params.is_seller = false;

        if (filters.sellerApproved === "yes") params.seller_approved = true;
        if (filters.sellerApproved === "no") params.seller_approved = false;

        if (filters.banned === "yes") params.banned = true;
        if (filters.banned === "no") params.banned = false;

        const res = await apiGetUsers(params);
        if (isCancelled) return;

        setUsers(res.data);
        setMeta(res.meta);
      } catch (err: any) {
        console.error(err);
        if (!isCancelled) {
          setError(
            err?.message || "Erreur lors du chargement des utilisateurs"
          );
          toast.error("Impossible de charger les utilisateurs");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
          setInitialLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [page, filters, reloadKey]);

  const totalUsers = meta?.total ?? users.length;

  const stats = useMemo(() => {
    const sellers = users.filter((u) => u.is_seller);
    const approvedSellers = sellers.filter((u) => u.seller_approved);
    const bannedUsers = users.filter((u) => isBanned(u));

    return {
      total: totalUsers,
      sellers: sellers.length,
      approvedSellers: approvedSellers.length,
      banned: bannedUsers.length,
    };
  }, [users, totalUsers]);

  const handleChangeFilter = (patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  // === Ouverture des popups d'action ===

  function openActionModal(type: ActionType, user: AdminUser) {
    setConfirmAction({ type, user });
    if (type === "ban") {
      setActionReason(user.ban_reason || "");
    } else if (type === "rejectSeller") {
      setActionReason("Profil non conforme");
    } else {
      setActionReason("");
    }
  }

  function closeActionModal() {
    if (actionLoading) return;
    setConfirmAction(null);
    setActionReason("");
  }

  // === Exécution des actions (ban, unban, etc.) ===

  async function handleConfirmAction() {
    if (!confirmAction) return;
    const { type, user } = confirmAction;

    try {
      setActionLoading(true);

      if (type === "ban") {
        const reason = actionReason.trim();
        if (!reason) {
          toast.error("La raison est obligatoire pour bannir un utilisateur");
          setActionLoading(false);
          return;
        }

        const until = new Date();
        until.setDate(until.getDate() + 30); // bannir 30 jours par défaut

        await apiBanUser(user.user_id, {
          reason,
          banned_until: until.toISOString(),
        });

        toast.success("Utilisateur banni");
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id
              ? {
                  ...u,
                  banned_until: until.toISOString(),
                  ban_reason: reason,
                }
              : u
          )
        );
      }

      if (type === "unban") {
        await apiUnbanUser(user.user_id);
        toast.success(t("admin.users.success.unbanned"));
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id
              ? { ...u, banned_until: null, ban_reason: null }
              : u
          )
        );
      }

      if (type === "approveSeller") {
        await apiApproveSeller(user.user_id);
        toast.success(t("admin.users.success.sellerApproved"));
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id ? { ...u, seller_approved: true } : u
          )
        );
      }

      if (type === "rejectSeller") {
        const reason = actionReason.trim();
        if (!reason) {
          toast.error("La raison est obligatoire pour rejeter le vendeur");
          setActionLoading(false);
          return;
        }

        await apiRejectSeller(user.user_id, reason);
        toast.success(t("admin.users.success.sellerRejected"));
        setUsers((prev) =>
          prev.map((u) =>
            u.user_id === user.user_id
              ? { ...u, seller_approved: false }
              : u
          )
        );
      }

      if (type === "delete") {
        await apiDeleteUser(user.user_id);
        toast.success(t("admin.users.success.deleted"));
        setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de l’action");
    } finally {
      setActionLoading(false);
      setConfirmAction(null);
      setActionReason("");
    }
  }

  // === Création d'un admin ===

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    const email = adminEmail.trim();
    if (!email) {
      toast.error("L’email est obligatoire");
      return;
    }

    try {
      setAdminLoading(true);
      await apiCreateAdmin({ email, role: adminRole });
      toast.success(t("admin.users.success.adminCreated"));
      setShowAdminModal(false);
      setAdminEmail("");
      setAdminRole("admin");
      setReloadKey((k) => k + 1); // refresh liste si besoin
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Erreur lors de la création de l’admin");
    } finally {
      setAdminLoading(false);
    }
  }

  // === Rendu ===

  if (initialLoading && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error && users.length === 0) {
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
      {/* Header + search + bouton admin */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Utilisateurs</h1>
          <p className="text-sm text-slate-500">
            Gestion des comptes, vendeurs et statuts.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <div className="relative flex-1 min-w-[220px]">
            <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Rechercher (email, nom, entreprise)..."
              className="w-full rounded-full border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleChangeFilter({ search: e.target.value })}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowAdminModal(true)}
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un admin
          </button>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard icon={Users} label="Total utilisateurs" value={stats.total} />
        <StatCard icon={Store} label="Vendeurs" value={stats.sellers} />
        <StatCard
          icon={Check}
          label="Vendeurs approuvés"
          value={stats.approvedSellers}
        />
        <StatCard icon={Ban} label="Utilisateurs bannis" value={stats.banned} />
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.isSeller}
          onChange={(e) =>
            handleChangeFilter({
              isSeller: e.target.value as Filters["isSeller"],
            })
          }
        >
          <option value="all">Tous (acheteurs & vendeurs)</option>
          <option value="yes">Vendeurs uniquement</option>
          <option value="no">Acheteurs uniquement</option>
        </select>

        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.sellerApproved}
          onChange={(e) =>
            handleChangeFilter({
              sellerApproved: e.target.value as Filters["sellerApproved"],
            })
          }
        >
          <option value="all">Tous statuts vendeur</option>
          <option value="yes">Vendeurs approuvés</option>
          <option value="no">Vendeurs non approuvés</option>
        </select>

        <select
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.banned}
          onChange={(e) =>
            handleChangeFilter({
              banned: e.target.value as Filters["banned"],
            })
          }
        >
          <option value="all">Tous (bannis & non bannis)</option>
          <option value="yes">Bannis uniquement</option>
          <option value="no">Non bannis uniquement</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg border border-slate-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50">
            <tr>
              <Th>Utilisateur</Th>
              <Th className="hidden md:table-cell">Contact</Th>
              <Th>Compte</Th>
              <Th className="hidden lg:table-cell">Vendeur</Th>
              <Th className="hidden xl:table-cell">Créé le</Th>
              <Th className="hidden xl:table-cell">Dernière connexion</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 bg-white">
            {users.map((u) => {
              const banned = isBanned(u);

              return (
                <tr key={u.id}>
                  {/* Utilisateur */}
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        {u.avatar_url ? (
                          <img
                            src={u.avatar_url}
                            alt={u.username || u.email}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="max-w-[160px] truncate text-sm font-medium text-slate-900">
                            {u.username || "Sans nom"}
                          </span>
                          {u.email_verified && (
                            <Mail className="h-3 w-3 text-emerald-500" />
                          )}
                          {u.online && (
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <p className="max-w-[180px] truncate text-xs text-slate-500">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </Td>

                  {/* Contact */}
                  <Td className="hidden md:table-cell text-xs">
                    <div className="flex flex-col gap-0.5">
                      {u.phone && (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Phone className="h-3 w-3" />
                          {u.phone}
                        </span>
                      )}
                      {u.whatsapp && u.whatsapp !== u.phone && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <Phone className="h-3 w-3" />
                          WhatsApp: {u.whatsapp}
                        </span>
                      )}
                      {u.company_name && (
                        <span className="text-[11px] text-slate-500">
                          {u.company_name}
                        </span>
                      )}
                    </div>
                  </Td>

                  {/* Compte */}
                  <Td>
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 text-[11px] font-medium uppercase tracking-wide text-slate-700">
                        {u.account_type || "buyer"}
                      </span>
                      {banned && (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 text-[11px] font-medium text-red-700">
                          Banni
                        </span>
                      )}
                    </div>
                  </Td>

                  {/* Vendeur */}
                  <Td className="hidden lg:table-cell">
                    {!u.is_seller ? (
                      <span className="inline-flex rounded-full bg-slate-50 px-2 text-[11px] font-medium text-slate-500">
                        Acheteur
                      </span>
                    ) : u.seller_approved ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 text-[11px] font-medium text-emerald-700">
                        <Check className="h-3 w-3" />
                        Vendeur approuvé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 text-[11px] font-medium text-amber-700">
                        <AlertCircle className="h-3 w-3" />
                        Vendeur en attente
                      </span>
                    )}
                  </Td>

                  {/* Dates */}
                  <Td className="hidden xl:table-cell text-xs text-slate-500">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleDateString("fr-FR")
                      : "-"}
                  </Td>
                  <Td className="hidden xl:table-cell text-xs text-slate-500">
                    {u.last_sign_in_at
                      ? new Date(u.last_sign_in_at).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "Jamais"}
                  </Td>

                  {/* Actions */}
                  <Td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      {/* Bannir / débannir */}
                      {banned ? (
                        <IconButton
                          title="Débannir"
                          variant="success"
                          onClick={() => openActionModal("unban", u)}
                        >
                          <Check className="h-4 w-4" />
                        </IconButton>
                      ) : (
                        <IconButton
                          title="Bannir"
                          variant="danger"
                          onClick={() => openActionModal("ban", u)}
                        >
                          <Ban className="h-4 w-4" />
                        </IconButton>
                      )}

                      {/* Approve / reject seller */}
                      {u.is_seller &&
                        (u.seller_approved ? (
                          <IconButton
                            title="Rejeter le compte vendeur"
                            variant="warning"
                            onClick={() => openActionModal("rejectSeller", u)}
                          >
                            <X className="h-4 w-4" />
                          </IconButton>
                        ) : (
                          <IconButton
                            title="Approuver le vendeur"
                            variant="success"
                            onClick={() =>
                              openActionModal("approveSeller", u)
                            }
                          >
                            <Shield className="h-4 w-4" />
                          </IconButton>
                        ))}

                      {/* Supprimer */}
                      <IconButton
                        title="Supprimer l'utilisateur"
                        variant="dangerOutline"
                        onClick={() => openActionModal("delete", u)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              );
            })}

            {users.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-sm text-slate-500"
                >
                  Aucun utilisateur trouvé avec ces filtres.
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
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Page {meta.page} / {meta.totalPages} — {meta.total} utilisateurs
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={!meta.hasPrev}
              onClick={() => meta.hasPrev && setPage((p) => p - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={!meta.hasNext}
              onClick={() => meta.hasNext && setPage((p) => p + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmation des actions */}
      {confirmAction && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start gap-3">
              <div className="mt-1 rounded-full bg-slate-100 p-2">
                {confirmAction.type === "delete" ? (
                  <Trash2 className="h-4 w-4 text-red-600" />
                ) : confirmAction.type === "ban" ? (
                  <Ban className="h-4 w-4 text-red-600" />
                ) : confirmAction.type === "approveSeller" ? (
                  <Shield className="h-4 w-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-slate-500" />
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  {confirmAction.type === "ban" && "Bannir l’utilisateur"}
                  {confirmAction.type === "unban" && "Débannir l’utilisateur"}
                  {confirmAction.type === "approveSeller" &&
                    "Approuver le vendeur"}
                  {confirmAction.type === "rejectSeller" &&
                    "Rejeter le compte vendeur"}
                  {confirmAction.type === "delete" &&
                    "Supprimer définitivement le compte"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {confirmAction.type === "ban" &&
                    `Confirmer le bannissement de ${
                      confirmAction.user.username || confirmAction.user.email
                    } ?`}
                  {confirmAction.type === "unban" &&
                    `Confirmer le débannissement de ${
                      confirmAction.user.username || confirmAction.user.email
                    } ?`}
                  {confirmAction.type === "approveSeller" &&
                    `Confirmer l’approbation du compte vendeur de ${
                      confirmAction.user.username || confirmAction.user.email
                    } ?`}
                  {confirmAction.type === "rejectSeller" &&
                    `Confirmer le rejet du compte vendeur de ${
                      confirmAction.user.username || confirmAction.user.email
                    } ?`}
                  {confirmAction.type === "delete" &&
                    `Cette action est définitive. Le compte de ${
                      confirmAction.user.username || confirmAction.user.email
                    } sera supprimé.`}
                </p>
              </div>
            </div>

            {(confirmAction.type === "ban" ||
              confirmAction.type === "rejectSeller") && (
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Raison
                </label>
                <textarea
                  className="w-full rounded-md border border-slate-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder="Décrivez la raison…"
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeActionModal}
                disabled={actionLoading}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={actionLoading}
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
                  confirmAction.type === "approveSeller" ||
                  confirmAction.type === "unban"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {actionLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal création admin */}
      {showAdminModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Ajouter un administrateur
            </h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Email de l’utilisateur
                </label>
                <input
                  type="email"
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Rôle
                </label>
                <select
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={adminRole}
                  onChange={(e) =>
                    setAdminRole(e.target.value as AdminRole)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super admin</option>
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => !adminLoading && setShowAdminModal(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                  disabled={adminLoading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {adminLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Créer l’admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// === Petites sous-composants UI ===

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
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

// Bouton icône style “Material”
function IconButton({
  children,
  title,
  variant = "default",
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  variant?: "default" | "success" | "danger" | "dangerOutline" | "warning";
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
      "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100",
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

// petit helper pour StatCard
function Users(props: any) {
  return <User {...props} />;
}