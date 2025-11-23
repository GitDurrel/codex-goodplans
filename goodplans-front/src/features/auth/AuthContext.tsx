// src/features/auth/AuthContext.tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiLogin, apiLogout, apiRefresh, apiRegister } from "./authApi";
import type { AuthUser, LoginResponse, Role, SignUpPayload } from "./type";

const STORAGE_KEY = "gp_auth";

type StoredAuth = {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
};

interface AuthContextType {
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    isAuthenticated: boolean;

    login: (email: string, password: string) => Promise<void>;
    register: (payload: SignUpPayload) => Promise<void>;
    logout: () => Promise<void>;
    markOtpValidated: (res: LoginResponse) => void;

    hasRole: (role: Role) => boolean;
    hasAnyRole: (roles: Role[]) => boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ------------------------- helpers localStorage ------------------------- */

function loadFromStorage(): StoredAuth | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredAuth;
    } catch {
        return null;
    }
}

function saveToStorage(data: StoredAuth) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // ignore
    }
}

function clearStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        // ignore
    }
}

/* ---------------------------- AuthProvider ----------------------------- */

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // Au premier rendu : recharger depuis localStorage + tenter un refresh
    useEffect(() => {
        const init = async () => {
            const stored = loadFromStorage();
            if (!stored) {
                setLoading(false);
                return;
            }

            try {
                const refreshed = await apiRefresh(stored.refreshToken);
                const newAuth: StoredAuth = {
                    user: stored.user,
                    accessToken: refreshed.accessToken,
                    refreshToken: refreshed.refreshToken,
                };

                setUser(newAuth.user);
                setAccessToken(newAuth.accessToken);
                setRefreshToken(newAuth.refreshToken);
                saveToStorage(newAuth);
            } catch {
                clearStorage();
                setUser(null);
                setAccessToken(null);
                setRefreshToken(null);
            } finally {
                setLoading(false);
            }
        };

        void init();
    }, []);

    const isAuthenticated = !!user;

    /* ------------------------------- helpers ------------------------------ */

    function setAuthFromResponse(res: LoginResponse) {
        const data: StoredAuth = {
            user: res.user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
        };
        setUser(res.user);
        setAccessToken(res.accessToken);
        setRefreshToken(res.refreshToken);
        saveToStorage(data);
    }

    const hasRole = (role: Role) => !!user?.roles.includes(role);

    const hasAnyRole = (roles: Role[]) =>
        user ? roles.some((r) => user.roles.includes(r)) : false;

    const hasPermission = (permission: string) =>
        !!user?.permissions.includes(permission);

    const hasAnyPermission = (permissions: string[]) =>
        user ? permissions.some((p) => user.permissions.includes(p)) : false;

    /*----------------------------- OTP Validation ---------------------------- */

    function markOtpValidated(res: LoginResponse) {
        // on utilise directement la réponse backend (user + tokens à jour)
        setAuthFromResponse(res);
    }

    /* --------------------------------- API -------------------------------- */

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const res = await apiLogin(email, password);
            setAuthFromResponse(res);

            toast.success("Connexion réussie ✅");

            const from = (location.state as any)?.from ?? "/";
            navigate(from, { replace: true });
        } catch (err: any) {
            console.error("LOGIN ERROR:", err);
            const msg =
                err?.message && !err.message.startsWith("HTTP")
                    ? err.message
                    : "Connexion impossible. Vérifie tes identifiants.";
            toast.error(msg);
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    async function register(payload: SignUpPayload) {
        setLoading(true);
        try {
            await apiRegister(payload);

            toast.success("Compte créé. Un code OTP vous a été envoyé par email.");

            navigate(
                `/verify-otp?email=${encodeURIComponent(payload.email)}`,
                { replace: true }
            );
        } catch (err: any) {
            console.error("REGISTER ERROR:", err);
            const msg =
                err?.message && !err.message.startsWith("HTTP")
                    ? err.message
                    : "Inscription impossible pour le moment.";
            toast.error(msg, { duration: 8000 });
            throw new Error(msg);
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {
            await apiLogout();
        } catch {
            // ignore
        } finally {
            clearStorage();
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            toast.success("Vous avez été déconnecté.");
            navigate("/login", { replace: true });
        }
    }

    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        markOtpValidated,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

/* ---------------------------- hook useAuth ----------------------------- */

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
