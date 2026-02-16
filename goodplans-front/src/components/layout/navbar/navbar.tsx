import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, PlusCircle, Megaphone } from "lucide-react";

import Logo from "../../Logo";
import { useAuth } from "../../../features/auth/AuthContext";
import { useUnreadCountQuery } from "../../../features/messages/hooks/useMessages";
import { PERMISSIONS, ROLES } from "../../../constants/auth";
import {
  DesktopProfileMenu,
  MessageIndicator,
  MobileMenu,
} from "./NavbarSections";
import { LanguageSwitcher } from "../../LanguageSwitcher";
import { useLanguage } from "../../../lib/language/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout, hasPermission, hasRole } = useAuth();
  const isAuthenticated = !!user;

  const { data: unreadData } = useUnreadCountQuery(isAuthenticated);
  const unreadMessages = unreadData?.unreadCount ?? 0;

  const isSeller =
    hasRole(ROLES.SELLER_PRO) || hasRole(ROLES.SELLER_PARTICULAR);

  const isAdminOrSuperAdmin =
    hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN);

  const canPostListingByRole =
    isSeller || hasPermission(PERMISSIONS.LISTING_CREATE);

  const canAccessMessages = hasPermission(PERMISSIONS.MESSAGES_ACCESS);
  const canSeeSellerDashboard = hasPermission(PERMISSIONS.SELLER_STATS_VIEW);
  const canSeeAdmin = hasPermission(PERMISSIONS.ADMIN_STATS_VIEW);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function closeAllMenus() {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  function handlePostListing() {
    if (!isAuthenticated) {
      navigate("/login?from=create-listing");
      return;
    }
    if (!canPostListingByRole) {
      navigate("/profile?from=create-listing&status=not-seller");
      return;
    }
    navigate("/create-listing");
  }

  function handleMessages() {
    navigate("/messages");
  }

  function handleAdvertisingRequest() {
    navigate("/demande-devis");
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto w-full max-w-[1600px] px-3 sm:px-4 lg:px-6">
        <div className="h-20 sm:h-20 lg:h-24 md:h-24 flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* Logo agrandi sur desktop */}
          <div className="h-20 sm:h-24 md:h-32 lg:h-36 xl:h-40 flex items-center gap-3">
            <Logo />
          </div>

          {/* Boutons à droite */}
          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">

            <LanguageSwitcher/>

            {/* Bouton devis publicitaire - Caché sur mobile, visible desktop */}
            {!isAdminOrSuperAdmin && (
              <button
                onClick={handleAdvertisingRequest}
                className="
                  hidden md:inline-flex items-center gap-1.5
                  px-2 sm:px-3 py-1.5 sm:py-2 rounded-full
                  border border-blue-600 text-blue-600 hover:bg-blue-50
                  text-xs sm:text-sm font-medium whitespace-nowrap transition-colors
                "
              >
                <Megaphone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden lg:inline">{t("navbar.requestQuote")}</span>
                <span className="lg:hidden">{t("navbar.requestQuoteShort")}</span>
              </button>
            )}

            {/* Bouton publier annonce */}
            {!isAdminOrSuperAdmin && (
              <button
                onClick={handlePostListing}
                className="
                  inline-flex items-center gap-1.5
                  px-2 sm:px-3 py-1.5 sm:py-2 rounded-full
                  text-white bg-blue-600 hover:bg-blue-700
                  text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors
                "
              >
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">{t("navbar.postListing")}</span>
                <span className="sm:hidden">{t("navbar.postShort")}</span>
              </button>
            )}

            {/* Messages */}
            {isAuthenticated && canAccessMessages && (
              <button
                onClick={handleMessages}
                className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Messages"
              >
                <MessageIndicator count={unreadMessages} />
              </button>
            )}

            {/* Menu desktop - visible uniquement sur grand écran */}
            <div className="hidden lg:block">
              {isAuthenticated ? (
                <DesktopProfileMenu
                  user={user}
                  isOpen={isProfileOpen}
                  onToggle={() => setIsProfileOpen((v) => !v)}
                  onLogout={handleLogout}
                  canSeeSellerDashboard={canSeeSellerDashboard}
                  canSeeAdmin={canSeeAdmin}
                  closeAll={closeAllMenus}
                />
              ) : (
                <Link
                  to="/login"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-300 hover:bg-gray-50 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors"
                >
                  {t("navbar.login")}
                </Link>
              )}
            </div>

            {/* Bouton menu burger - visible sur mobile/tablette */}
            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="lg:hidden p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile/tablette */}
      <MobileMenu
        isOpen={isMenuOpen}
        closeAll={closeAllMenus}
        user={user}
        isAuthenticated={isAuthenticated}
        unreadMessages={unreadMessages}
        canPostListing={isAuthenticated && !isAdminOrSuperAdmin}
        canAccessMessages={canAccessMessages}
        canSeeSellerDashboard={canSeeSellerDashboard}
        canSeeAdmin={canSeeAdmin}
        onLogout={handleLogout}
        onPostListing={handlePostListing}
        onMessages={handleMessages}
        onAdvertisingRequest={handleAdvertisingRequest}
        headerSlot={<Logo />}
        isAdminOrSuperAdmin={isAdminOrSuperAdmin}
      />
    </nav>
  );
}