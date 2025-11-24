import { Calendar, Lock, MessageSquare, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SellerProfile } from "../types";
import { useMemo } from "react";

interface SellerInfoCardProps {
  seller: SellerProfile | null;
  listingId: string;
  isAuthenticated?: boolean;
}

export function SellerInfoCard({ seller, listingId, isAuthenticated }: SellerInfoCardProps) {
  const navigate = useNavigate();
  const initials = useMemo(() => seller?.username?.[0]?.toUpperCase() ?? "?", [seller?.username]);

  if (!seller) return null;

  return (
    <aside className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {seller.avatar_url ? (
          <img src={seller.avatar_url} alt={seller.username} className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-600">
            {initials}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-slate-900">{seller.username ?? "Vendeur"}</p>
          {seller.created_at && (
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5" />
              Membre depuis {new Date(seller.created_at).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {isAuthenticated ? (
          <Link
            to={`/chat/${seller.user_id}?listingId=${listingId}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <MessageSquare className="h-4 w-4" />
            Contacter le vendeur
          </Link>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700"
          >
            <Lock className="h-4 w-4" />
            Connectez-vous pour discuter
          </button>
        )}

        {seller.show_phone && seller.phone && (
          <a
            href={`tel:${seller.phone}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-200"
          >
            <Phone className="h-4 w-4" />
            {seller.phone}
          </a>
        )}

        <Link
          to="/profile"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
        >
          Voir le profil
        </Link>
      </div>
    </aside>
  );
}
