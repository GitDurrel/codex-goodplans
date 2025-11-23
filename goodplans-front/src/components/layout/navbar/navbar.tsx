import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, PlusCircle } from "lucide-react";

import Logo from "../../Logo";
import { useAuth } from "../../../features/auth/AuthContext";
import { useUnreadCount } from "../../../features/messages/messagesApi";
import { PERMISSIONS, ROLES } from "../../../constants/auth";
import {
  DesktopProfileMenu,
  MessageIndicator,
  MobileMenu,
} from "./NavbarSections";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, hasPermission, hasRole } = useAuth();
  const isAuthenticated = !!user;

  const { data: unreadData } = useUnreadCount(!isAuthenticated);
  const unreadMessages =
    unreadData?.unreadCount ?? unreadData?.unread_count ?? unreadData?.count ?? 0;

  const isSeller = hasRole(ROLES.SELLER_PRO) || hasRole(ROLES.SELLER_PARTICULAR);
  const canPostListing = isSeller || hasPermission(PERMISSIONS.LISTING_CREATE);
  const canAccessMessages = hasPermission(PERMISSIONS.MESSAGES_ACCESS);
  const canSeeSellerDashboard = hasPermission(PERMISSIONS.SELLER_STATS_VIEW);
  const canSeeAdmin = hasRole(ROLES.ADMIN) || hasRole(ROLES.SUPER_ADMIN);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  function closeAllMenus() {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  function handlePostListing() {
    if (!canPostListing) {
      navigate("/profile");
      return;
    }
    navigate("/create-listing");
  }

  function handleMessages() {
    navigate("/messages");
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3">
        <div className="h-16 flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-3">
            {isAuthenticated && canPostListing && (
              <button
                onClick={handlePostListing}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Publier</span>
              </button>
            )}

            {isAuthenticated && canAccessMessages && (
              <button
                onClick={handleMessages}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <MessageIndicator count={unreadMessages} />
              </button>
            )}

            <div className="hidden md:block">
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
                  className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50"
                >
                  Connexion
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-full bg-gray-100"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMenuOpen}
        closeAll={closeAllMenus}
        user={user}
        isAuthenticated={isAuthenticated}
        unreadMessages={unreadMessages}
        canPostListing={canPostListing}
        canAccessMessages={canAccessMessages}
        canSeeSellerDashboard={canSeeSellerDashboard}
        canSeeAdmin={canSeeAdmin}
        onLogout={handleLogout}
        onPostListing={handlePostListing}
        onMessages={handleMessages}
        headerSlot={<Logo />}
      />
    </nav>
  );
}
