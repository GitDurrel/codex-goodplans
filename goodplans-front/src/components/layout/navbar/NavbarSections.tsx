import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Settings,
  Home,
  Heart,
  Search,
  MessageSquare,
  PlusCircle,
  LayoutDashboard,
  Shield,
  X,
  Megaphone,
} from "lucide-react";
import type { AuthUser } from "../../../features/auth/type";
import { useLanguage } from "../../../lib/language/LanguageContext";

export function MessageIndicator({ count }: { count: number }) {
  if (!count) return <MessageSquare className="h-5 w-5" />;

  return (
    <div className="relative">
      <MessageSquare className="h-5 w-5" />
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
        {Math.min(count, 99)}
      </span>
    </div>
  );
}

interface DesktopProfileMenuProps {
  user: AuthUser;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
  canSeeSellerDashboard: boolean;
  canSeeAdmin: boolean;
  closeAll: () => void;
}

export function DesktopProfileMenu({
  user,
  isOpen,
  onToggle,
  onLogout,
  canSeeSellerDashboard,
  canSeeAdmin,
  closeAll,
}: DesktopProfileMenuProps) {

  const { t } = useLanguage();

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        {user.avatar_url ? (
          <img
            src={`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}v=${user.avatar_url.length}`}
            alt={user.username}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-medium text-sm">{user.email.split("@")[0]}</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-700">{user.email}</p>
          </div>

          <div className="py-1">
            {canSeeSellerDashboard && (
              <Link
                to="/seller/dashboard"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={closeAll}
              >
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                {t("navbar.sellerDashboard")}
              </Link>
            )}

            {canSeeAdmin && (
              <Link
                to="/admin"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={closeAll}
              >
                <Shield className="mr-3 h-5 w-5 text-gray-500" />
                {t("navbar.admin")}
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              {t("navbar.profile")}
            </Link>

            <Link
              to="/favorites"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <Heart className="mr-3 h-5 w-5 text-gray-500" />
              {t("navbar.favorites")}
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              {t("navbar.settings")}
            </Link>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={onLogout}
              className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              {t("navbar.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  closeAll: () => void;
  user: AuthUser | null;
  isAuthenticated: boolean;
  unreadMessages: number;
  canPostListing: boolean;
  canAccessMessages: boolean;
  canSeeSellerDashboard: boolean;
  canSeeAdmin: boolean;
  onLogout: () => void;
  onPostListing: () => void;
  onMessages: () => void;
  onAdvertisingRequest: () => void;
  headerSlot?: React.ReactNode;
  isAdminOrSuperAdmin: boolean;
}

export function MobileMenu({
  isOpen,
  closeAll,
  user,
  isAuthenticated,
  unreadMessages,
  canAccessMessages,
  canSeeSellerDashboard,
  canSeeAdmin,
  onLogout,
  onPostListing,
  onMessages,
  onAdvertisingRequest,
  headerSlot,
  isAdminOrSuperAdmin,
}: MobileMenuProps) {
  if (!isOpen) return null;
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={closeAll}
        className="absolute inset-0 bg-black/40"
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl">
        <div className="h-full flex flex-col">
          {/* Header avec logo */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="shrink-0">{headerSlot}</div>
            <button
              onClick={closeAll}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Profil utilisateur si connecté */}
            {isAuthenticated && user && (
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {user.avatar_url ? (
                    <img
                      src={`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}v=${user.avatar_url.length}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{user.email.split("@")[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Home className="h-5 w-5 text-gray-500" />
              {t("navbar.home")}
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Search className="h-5 w-5 text-gray-500" />
              {t("navbar.search")}
            </Link>

            {/* Bouton devis publicitaire dans le menu mobile */}
            {!isAdminOrSuperAdmin && (
              <button
                onClick={() => {
                  onAdvertisingRequest();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-50"
              >
                <Megaphone className="h-5 w-5 text-gray-500" />
                {t("navbar.requestQuote")}
              </button>
            )}

            {!isAdminOrSuperAdmin && (
              <button
                onClick={() => {
                  onPostListing();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-50"
              >
                <PlusCircle className="h-5 w-5 text-gray-500" />
                {t("navbar.postListing")}
              </button>
            )}

            {isAuthenticated && canAccessMessages && (
              <button
                onClick={() => {
                  onMessages();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 w-full text-left"
              >
                <MessageIndicator count={unreadMessages} />
                {t("navbar.messages")}
              </button>
            )}

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  onClick={closeAll}
                >
                  <User className="h-5 w-5 text-gray-500" />
                  {t("navbar.profile")}
                </Link>

                <Link
                  to="/favorites"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  onClick={closeAll}
                >
                  <Heart className="h-5 w-5 text-gray-500" />
                  {t("navbar.favorites")}
                </Link>

                {canSeeSellerDashboard && (
                  <Link
                    to="/seller/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    onClick={closeAll}
                  >
                    <LayoutDashboard className="h-5 w-5 text-gray-500" />
                    {t("navbar.sellerDashboard")}
                  </Link>
                )}

                {canSeeAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                    onClick={closeAll}
                  >
                    <Shield className="h-5 w-5 text-gray-500" />
                    {t("navbar.admin")}
                  </Link>
                )}

                <Link
                  to="/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  onClick={closeAll}
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  {t("navbar.settings")}
                </Link>
              </>
            )}

            <div className="border-t border-gray-200 my-2" />

            {/* Connexion / Déconnexion */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full"
              >
                <LogOut className="h-5 w-5" />
                {t("navbar.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-blue-600 font-medium"
                onClick={closeAll}
              >
                <User className="h-5 w-5" />
                {t("navbar.login")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}