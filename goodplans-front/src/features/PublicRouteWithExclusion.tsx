import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuth } from "./auth/AuthContext";
import type { Role } from "./auth/type";

type PublicRouteProps = {
  children: JSX.Element;
  excludeRoles?: Role[];
};

export function PublicRoute({
  children,
  excludeRoles,
}: PublicRouteProps) {
  const { user, isAuthenticated, hasAnyRole } = useAuth();

  // Si connecté ET role exclu → forbidden
  if (
    isAuthenticated &&
    excludeRoles &&
    excludeRoles.length > 0 &&
    hasAnyRole(excludeRoles)
  ) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
}
