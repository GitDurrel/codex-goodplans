// App.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LoginPage } from "./pages/LoginPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyOtpPage } from "./pages/VerifyOtpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { MessagesPage } from "./pages/MessagesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/layout/navbar/navbar";
import Footer from "./components/layout/footer/footer";
import { HomePage } from "./pages/HomePage/HomePage";
import CreateListing from "./pages/CreateListing";
import { ListingDetailsPage } from "./features/listings/pages/ListingDetailsPage";
import SellerLayout from "./layouts/SellerLayout";
import SellerOverviewPage from "./pages/seller/SellerOverviewPage";
import SellerListingsPage from "./pages/seller/SellerListingsPage";
import SellerSettingsPage from "./pages/seller/SellerSettingsPage";
import SellerHelp from "./pages/seller/Help";
import { EditListingPage } from "./pages/EditListings";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ResetVerifyCodePage } from "./pages/ResetVerifyCodePage";
import { SellerPublicProfilePage } from "./pages/SellerPublicProfilePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { AdminLayout } from "./features/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminListingsPage from "./pages/admin/AdminListingsPage";
import Devis from "./pages/admin/AdminDevisPage";
import AdvertisingRequestPage from "./pages/AdvertisingRequestPage";
import PromoBannersPage from "./pages/admin/PromoBannersPage";
import AdminContactsPage from "./pages/admin/AdminContactsPage";
import ContactPage from "./pages/ContactPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import CategoryListings from "./pages/CategoryListings";
import SearchResults from "./pages/SearchResults";
import SellerFeaturedOrdersPage from "./pages/seller/SellerFeaturedOrdersPage";
import AdminFeaturedOrdersPage from "./pages/admin/AdminFeaturedOrdersPage";
import AdminFeaturedPlansPage from "./pages/admin/AdminFeaturedPlansPage";
// import NotificationsFab from "./components/notifiactions/notificationsFab";
import TermsPage from "./pages/terms";
import PrivacyPage from "./pages/privacy";
import LegalPage from "./pages/legal";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import SafetyPage from "./pages/SafetyPage";
import FaqPage from "./pages/FaqPage";
import SupportPage from "./pages/SupportPage";
import AdminSupportRequestsPage from "./features/admin/components/AdminSupportRequestsPage";
import AdminSupportRequestDetailsPage from "./features/admin/components/AdminSupportRequestDetailsPage";
import { PublicRoute } from "./features/PublicRouteWithExclusion";

function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow-lg px-8 py-10">
        <h1 className="text-2xl font-bold mb-4">Accès refusé</h1>
        <p className="text-slate-700 text-sm">
          Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.
        </p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  const authRoutes = ["/login", "/register", "/verify-otp", "/reset-password"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <>
      {/* Pas de navbar sur les pages d'auth */}
      {!isAuthRoute && <Navbar />}

      <Routes>
        {/* Pages auth sans layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-verify" element={<ResetVerifyCodePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Le reste avec layout */}
        <Route path="/forbidden" element={<ForbiddenPage />} />
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/listings/:id" element={<ListingDetailsPage />} />
        <Route path="/sellers/:sellerId" element={<SellerPublicProfilePage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/safety" element={<SafetyPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route
          path="/demande-devis"
          element={
            <PublicRoute excludeRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdvertisingRequestPage />
            </PublicRoute>
          }
        />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/category/:category" element={<CategoryListings />} />
        <Route path="/search" element={<SearchResults />} />


        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >

          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="listings" element={<AdminListingsPage />} />
          <Route path="devis" element={<Devis />} />
          <Route path="promo-banners" element={<PromoBannersPage />} />
          <Route path="mises-en-avant" element={<AdminFeaturedOrdersPage />} />
          <Route path="featured/plans" element={<AdminFeaturedPlansPage />} />
          <Route path="messages" element={<MessagesPage />} />`
          <Route path="settings" element={<SettingsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="/admin/support" element={<AdminSupportRequestsPage />} />
          <Route path="/admin/support/:id" element={<AdminSupportRequestDetailsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
        </Route>

        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerOverviewPage />} />
          <Route path="listings" element={<SellerListingsPage />} />
          <Route path="edit-listing/:listingId" element={<EditListingPage />} />
          <Route path="featured-orders" element={<SellerFeaturedOrdersPage />} />
          <Route path="settings" element={<SellerSettingsPage />} />
          <Route path="help" element={<SellerHelp />} />
        </Route>

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute excludeRoles={["ADMIN", "SUPER_ADMIN"]}>
              <CreateListing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
      </Routes >

      {/* Pas de footer sur les pages auth */}
      {!isAuthRoute && <Footer />}

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          error: {
            duration: 8000,
          },
        }}
      />

      {/* La cloche globale */}
      {/* <NotificationsFab /> */}
    </>
  );
}

export default App;
