// src/features/admin/AdminLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { useAuth } from "../auth/AuthContext";
import { AdminSidebar } from "./components/AdminSidebar";
import NotFoundPage from "../../pages/NotFoundPage";
import { PERMISSIONS } from "../../constants/auth";

export function AdminLayout() {
  const { user, loading, isAuthenticated, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdmin = hasPermission(PERMISSIONS.ADMIN_STATS_VIEW);

  // rediriger vers login si pas connecté
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  // état initial sidebar selon la taille
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  // user connecté mais pas admin/super_admin → 404
  if (user && !isAdmin) {
    return <NotFoundPage />;
  }

  // si pas user (et pas loading) on aura déjà été redirigé vers /login
  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* Bouton hamburger mobile - z-index élevé pour être au-dessus de tout */}
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-4 z-50 rounded-md bg-white p-2 shadow-lg md:hidden"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-slate-700" />
        ) : (
          <Menu className="h-5 w-5 text-slate-700" />
        )}
      </button>

      {/* Overlay mobile - z-index entre le contenu et la sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - z-index au-dessus de l'overlay */}
      <div
        className={`
          fixed left-0 top-0 z-40 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:shadow-none
        `}
      >
        <AdminSidebar
          isCollapsed={false}
          closeSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto">
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}