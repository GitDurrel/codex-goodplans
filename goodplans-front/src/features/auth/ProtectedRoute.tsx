import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./type"; // ou depuis ton fichier constants si tu préfères
import type { JSX } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;

  requiredRoles?: Role[];          // ex: ["ADMIN", "SUPER_ADMIN"]
  requiredPermissions?: string[];  // ex: ["listing.create"]
  requireOTPValidated?: boolean;   // true = OTP obligatoire (par défaut)
};

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredPermissions,
  requireOTPValidated = true,
}: ProtectedRouteProps) {
  const {
    user,
    isAuthenticated,
    loading,
    hasAnyRole,
    hasAnyPermission,
  } = useAuth();
  const location = useLocation();

  if (loading) return null; // ici tu peux mettre un spinner ou un skeleton

  // 1) Pas connecté → /login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 2) OTP pas encore validé → /verify-otp
  //    ➜ ne donnera effet QUE tant que hasOTPValidated === false,
  //       donc uniquement juste après inscription tant que le user n'a pas validé.
  if (requireOTPValidated && user && !user.hasOTPValidated) {
    return (
      <Navigate
        to={`/verify-otp?email=${encodeURIComponent(user.email)}`}
        replace
      />
    );
  }

  // 3) Vérifier les rôles si demandé
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(requiredRoles)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // 4) Vérifier les permissions si demandées
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (!hasAnyPermission(requiredPermissions)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // 5) Tout est OK → on affiche
  return children;
}
