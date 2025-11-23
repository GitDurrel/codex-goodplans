import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  LogOut,
  User,
  Settings,
  Home,
  Search,
  MessageSquare,
  PlusCircle,
  LayoutDashboard,
  Shield,
  X,
} from "lucide-react";
import type { AuthUser } from "../../../features/auth/type";

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
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
          {user.email.charAt(0).toUpperCase()}
        </div>
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
                Tableau de bord vendeur
              </Link>
            )}

            {canSeeAdmin && (
              <Link
                to="/admin"
                className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                onClick={closeAll}
              >
                <Shield className="mr-3 h-5 w-5 text-gray-500" />
                Administration
              </Link>
            )}

            <Link
              to="/profile"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <User className="mr-3 h-5 w-5 text-gray-500" />
              Profil
            </Link>

            <Link
              to="/settings"
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              onClick={closeAll}
            >
              <Settings className="mr-3 h-5 w-5 text-gray-500" />
              Paramètres
            </Link>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={onLogout}
              className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Déconnexion
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
  headerSlot?: React.ReactNode;
}

export function MobileMenu({
  isOpen,
  closeAll,
  user,
  isAuthenticated,
  unreadMessages,
  canPostListing,
  canAccessMessages,
  canSeeSellerDashboard,
  canSeeAdmin,
  onLogout,
  onPostListing,
  onMessages,
  headerSlot,
}: MobileMenuProps) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-all duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeAll}
      />

      <div
        className={`absolute right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            {headerSlot}
            <button
              onClick={closeAll}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {isAuthenticated && user && (
              <div className="p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold">
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user.email.split("@")[0]}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <Link
              to="/"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Home className="h-5 w-5 text-gray-500" />
              Accueil
            </Link>

            <Link
              to="/search"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
              onClick={closeAll}
            >
              <Search className="h-5 w-5 text-gray-500" />
              Rechercher
            </Link>

            {isAuthenticated && canPostListing && (
              <button
                onClick={() => {
                  onPostListing();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg w-full text-left hover:bg-gray-50"
              >
                <PlusCircle className="h-5 w-5 text-gray-500" />
                Déposer une annonce
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
                Messages
              </button>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <User className="h-5 w-5 text-gray-500" />
                Profil
              </Link>
            )}

            {isAuthenticated && canSeeSellerDashboard && (
              <Link
                to="/seller/dashboard"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <LayoutDashboard className="h-5 w-5 text-gray-500" />
                Tableau vendeur
              </Link>
            )}

            {isAuthenticated && canSeeAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <Shield className="h-5 w-5 text-gray-500" />
                Admin
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <Settings className="h-5 w-5 text-gray-500" />
                Paramètres
              </Link>
            )}

            <div className="border-t border-gray-200 my-2" />

            {isAuthenticated ? (
              <button
                onClick={() => {
                  onLogout();
                  closeAll();
                }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full"
              >
                <LogOut className="h-5 w-5" />
                Déconnexion
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                onClick={closeAll}
              >
                <User className="h-5 w-5 text-gray-500" />
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
