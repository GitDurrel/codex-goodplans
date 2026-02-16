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
import { apiLogin, apiLogout, apiRefresh, apiRegister, apiGetMe } from "./authApi";
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
    loginWithGoogle: () => void;
    completeLogin: (res: LoginResponse, redirectTo?: string) => void;

    register: (payload: SignUpPayload) => Promise<void>;
    logout: () => Promise<void>;
    markOtpValidated: (res: LoginResponse) => void;
    updateUser: (partial: Partial<AuthUser>) => void;

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
                try {
                    const me = await apiGetMe();
                    setUser(me.user);
                    setAccessToken(me.accessToken);
                    setRefreshToken(me.refreshToken);
                    saveToStorage({
                        user: me.user,
                        accessToken: me.accessToken,
                        refreshToken: me.refreshToken,
                    });
                } catch (e) {
                    console.warn("apiGetMe failed on init:", e);
                }

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


    /**
     * Détecter le retour du callback Google OAuth
     */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const authParam = params.get('auth');
        const errorParam = params.get('error');
        const errorDetails = params.get('details');

        // ✅ Succès Google OAuth
        if (authParam === 'success') {
            console.log('✅ Authentification Google réussie');

            const handleGoogleSuccess = async () => {
                try {
                    toast.success('Connexion avec Google réussie ! 🎉');

                    // Nettoyer l'URL
                    window.history.replaceState({}, '', '/dashboard');

                    // Recharger les données depuis localStorage
                    // (le backend peut avoir mis à jour via les cookies)
                    const stored = loadFromStorage();
                    if (stored) {
                        setUser(stored.user);
                        setAccessToken(stored.accessToken);
                        setRefreshToken(stored.refreshToken);
                    }

                    // Rediriger vers le dashboard
                    navigate('/dashboard', { replace: true });

                } catch (err) {
                    console.error('Erreur finalisation Google OAuth:', err);
                    toast.error('Erreur lors de la connexion');
                    navigate('/login', { replace: true });
                }
            };

            handleGoogleSuccess();
        }

        // ❌ Erreur Google OAuth
        if (errorParam) {
            console.error('❌ Erreur Google OAuth:', errorParam, errorDetails);
            const message = errorDetails || errorParam;
            toast.error(`Erreur: ${message}`);

            // Nettoyer l'URL
            window.history.replaceState({}, '', '/login');
        }
    }, [navigate]);

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

    function updateUser(partial: Partial<AuthUser>) {
        setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...partial };
            if (accessToken && refreshToken) {
                saveToStorage({ user: next, accessToken, refreshToken });
            }
            return next;
        });
    }

    /*----------------------------- OTP Validation ---------------------------- */

    function markOtpValidated(res: LoginResponse) {
        // on utilise directement la réponse backend (user + tokens à jour)
        setAuthFromResponse(res);
    }

    /* --------------------------------- API -------------------------------- */

    async function login(email: string, password: string) {
        try {
            const res = await apiLogin(email, password);

            // 1) stocker tokens tout de suite (nécessaire pour Bearer dans /auth/me)
            setAuthFromResponse(res);

            // 2) re-fetch /auth/me pour récupérer admin (si le user est dans table admins)
            try {
                const me = await apiGetMe();
                setAuthFromResponse(me);
            } catch (e) {
                console.warn("apiGetMe failed after login:", e);
                // on garde res (login normal)
            }

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
        }
    }


    async function register(payload: SignUpPayload) {
        try {
            await apiRegister(payload);

            toast.success(
                "Compte créé. Un code OTP vous a été envoyé par email."
            );

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

    /**
    * Connexion Google OAuth
    * Redirige vers le backend qui gère tout
    */
    async function loginWithGoogle() {
        try {
            const { apiGoogleLoginWeb } = await import("./authApi");
            await apiGoogleLoginWeb();
        } catch (err: any) {
            console.error("LOGIN GOOGLE ERROR:", err);
            toast.error(err?.message || "Impossible de se connecter avec Google");
            throw err;
        }
    }


    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        loading,
        isAuthenticated,
        completeLogin,
        login,
        loginWithGoogle,
        register,
        logout,
        hasRole,
        hasAnyRole,
        hasPermission,
        hasAnyPermission,
        markOtpValidated,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );

    function completeLogin(res: LoginResponse, redirectTo = "/") {
        setAuthFromResponse(res);
        navigate(redirectTo, { replace: true });
    }

}

/* ---------------------------- hook useAuth ----------------------------- */

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
