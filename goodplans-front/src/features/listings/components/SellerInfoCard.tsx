import { BadgeCheck, Building2, Calendar, Lock, MessageSquare, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SellerProfile } from "../types";
import { useMemo } from "react";
import { useAuth } from "../../auth/AuthContext";

interface SellerInfoCardProps {
  seller: SellerProfile | null;
  listingId: string;
}

export function SellerInfoCard({ seller, listingId }: SellerInfoCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const initials = useMemo(() => seller?.username?.[0]?.toUpperCase() ?? "?", [seller?.username]);
  const sellerProfilePath = seller?.user_id ? `/sellers/${seller.user_id}` : undefined;
  const avatarSrc = useMemo(() => {
    if (!seller?.avatar_url) return null;
    const separator = seller.avatar_url.includes("?") ? "&" : "?";
    return `${seller.avatar_url}${separator}v=${seller.avatar_url.length}`;
  }, [seller?.avatar_url]);

  if (!seller) return null;

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {sellerProfilePath ? (
          <Link to={sellerProfilePath} aria-label={`Voir le profil de ${seller.username ?? "vendeur"}`}>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={seller.username}
                className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-bold text-blue-700">
                {initials}
              </div>
            )}
          </Link>
        ) : avatarSrc ? (
          <img src={avatarSrc} alt={seller.username} className="h-14 w-14 rounded-full object-cover ring-2 ring-slate-100" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-lg font-bold text-blue-700">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900 flex items-center gap-1">
            {seller.username ?? "Vendeur"}
            {seller.seller_approved && <BadgeCheck className="h-4 w-4 text-emerald-500" />}
          </p>
          {seller.company_name && (
            <p className="flex items-center gap-1 text-xs text-slate-600">
              <Building2 className="h-3.5 w-3.5" /> {seller.company_name}
            </p>
          )}
          {seller.created_at && (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              Membre depuis {new Date(seller.created_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {isAuthenticated ? (
          <Link
            to={`/chat/${seller.user_id}?listingId=${listingId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <MessageSquare className="h-4 w-4" />
            Contacter le vendeur
          </Link>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Lock className="h-4 w-4" />
            Connectez-vous pour discuter
          </button>
        )}

        {seller.phone && seller.show_phone !== false && (
          <a
            href={`tel:${seller.phone}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            <Phone className="h-4 w-4" />
            {seller.phone}
          </a>
        )}

        <Link
          to={sellerProfilePath ?? "/profile"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Voir le profil
        </Link>
      </div>
    </aside>
  );
}
