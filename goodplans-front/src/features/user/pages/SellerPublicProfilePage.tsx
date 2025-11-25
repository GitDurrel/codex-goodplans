import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertCircle, Building2, Loader2, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { getSellerPublicProfile } from "../api/userApi";
import type { UserProfile } from "../types";

/**
 * Public seller profile page (read-only).
 * Displays minimal seller details retrieved from the backend using the sellerId present in the URL.
 */
export function SellerPublicProfilePage() {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadSeller() {
      if (!sellerId) {
        setError("Profil vendeur introuvable");
        setLoading(false);
        return;
      }

      try {
        const res = await getSellerPublicProfile(sellerId);
        if (mounted) {
          setSeller(res);
        }
      } catch (e) {
        if (mounted) {
          const message = e instanceof Error ? e.message : "Impossible de charger le profil vendeur";
          setError(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSeller();
    return () => {
      mounted = false;
    };
  }, [sellerId]);

  const avatarSrc = useMemo(() => {
    if (!seller?.avatar_url) return null;
    const separator = seller.avatar_url.includes("?") ? "&" : "?";
    return `${seller.avatar_url}${separator}v=${seller.avatar_url.length}`;
  }, [seller?.avatar_url]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl bg-red-50 p-6 text-center text-red-700 shadow-sm">
          <AlertCircle className="h-8 w-8" />
          <p className="text-sm font-semibold">{error ?? "Profil vendeur introuvable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-md">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex-shrink-0">
            {avatarSrc ? (
              <img src={avatarSrc} alt={seller.username} className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-100" />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl font-bold text-blue-700">
                {seller.username?.[0]?.toUpperCase() ?? <User className="h-8 w-8" />}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              {seller.username}
              {seller.seller_approved && <ShieldCheck className="h-5 w-5 text-emerald-500" />}
            </div>
            <p className="text-sm text-slate-500">{seller.account_type ?? "Compte vendeur"}</p>
            {seller.company_name && (
              <p className="flex items-center gap-2 text-sm text-slate-700">
                <Building2 className="h-4 w-4 text-indigo-500" />
                {seller.company_name}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
            <Mail className="h-5 w-5 text-slate-500" />
            <div className="text-sm">
              <p className="text-slate-500">Email</p>
              <p className="font-semibold text-slate-900">{seller.email}</p>
            </div>
          </div>
          {seller.phone && (
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
              <Phone className="h-5 w-5 text-emerald-500" />
              <div className="text-sm">
                <p className="text-slate-500">Téléphone</p>
                <p className="font-semibold text-slate-900">{seller.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
