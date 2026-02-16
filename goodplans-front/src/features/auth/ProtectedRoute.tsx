// ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { Role } from "./type"; 
import type { JSX } from "react";

type ProtectedRouteProps = {
  children: JSX.Element;
  requiredRoles?: Role[];          
  excludeRoles?: Role[];           // <--- NOUVEAU : Rôles interdits
  requiredPermissions?: string[];  
  requireOTPValidated?: boolean;   
};

export function ProtectedRoute({
  children,
  requiredRoles,
  excludeRoles, // <--- On le récupère ici
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

  if (loading) return null; 

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

  // 2) OTP pas encore validé
  if (requireOTPValidated && user && !user.hasOTPValidated) {
    return (
      <Navigate
        to={`/verify-otp?email=${encodeURIComponent(user.email)}`}
        replace
      />
    );
  }

  // --- NOUVELLE LOGIQUE : Exclusion ---
  // 3) Vérifier les rôles exclus (Interdire l'accès)
  if (excludeRoles && excludeRoles.length > 0) {
    if (hasAnyRole(excludeRoles)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // 4) Vérifier les rôles requis (Accès restreint à certains rôles)
  if (requiredRoles && requiredRoles.length > 0) {
    if (!hasAnyRole(requiredRoles)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  // 5) Vérifier les permissions si demandées
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (!hasAnyPermission(requiredPermissions)) {
      return <Navigate to="/forbidden" replace />;
    }
  }

  return children;
}