// src/features/admin/components/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    Settings,
    LogOut,
    MessageSquare,
    FileText,
    Mail,
    Star,
    Megaphone,
    Package,
    LifeBuoy
} from "lucide-react";

import Logo from "../../../components/Logo";
import { useAuth } from "../../auth/AuthContext";

interface SidebarProps {
    isCollapsed?: boolean;
    closeSidebar: () => void;
}

type NavItem = {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export function AdminSidebar({ isCollapsed = false, closeSidebar }: SidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();

    const baseNavigation: NavItem[] = [
        { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
        { name: "Utilisateurs", href: "/admin/users", icon: Users },
        { name: "Annonces", href: "/admin/listings", icon: ShoppingBag },
        { name: "Devis", href: "/admin/devis", icon: FileText },
        { name: "Publicités", href: "/admin/promo-banners", icon: Megaphone },
        { name: "Contacts", href: "/admin/contacts", icon: Mail },
        { name: "Support/Aide", href: "/admin/support", icon: LifeBuoy },
        { name: "Mises en avant", href: "/admin/mises-en-avant", icon: Star },
        {name: "Packs de mise en avant", href: "/admin/featured/plans", icon: Package },
    ];

    const additionalNavigation: NavItem[] = [
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        // { name: "Signalements", href: "/admin/reports", icon: Flag },
        { name: "Paramètres", href: "/admin/settings", icon: Settings },
    ];

    const navigation = [...baseNavigation, ...additionalNavigation];

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            closeSidebar();
        }
    };

    const handleSignOut = async () => {
        await logout();
        closeSidebar();
    };

    return (
        <div className="flex h-full flex-col border-r border-slate-200 bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-slate-200 px-4">
                {/* Logo contient déjà son propre <Link>, donc on NE le remets pas dans un <Link> */}
                <div className="max-w-[150px] overflow-hidden">
                    <Logo />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
                {navigation.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? location.pathname === "/admin" // le dashboard n'est actif que sur /admin
                            : location.pathname === item.href ||
                            location.pathname.startsWith(item.href + "/");

                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={handleLinkClick}
                            className={`
                                flex items-center rounded-md px-2 py-2 text-sm font-medium
                                ${isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }
                                ${isCollapsed ? "justify-center" : ""}
                            `}
                        >
                            <Icon className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                            {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="border-t border-slate-200 p-4">
                <button
                    onClick={handleSignOut}
                    className={`
            flex w-full items-center rounded-md px-2 py-2 text-sm font-medium
            text-slate-600 hover:bg-slate-50 hover:text-slate-900
            ${isCollapsed ? "justify-center" : ""}
          `}
                >
                    <LogOut className={`h-5 w-5 ${isCollapsed ? "" : "mr-3"}`} />
                    {!isCollapsed && <span>Déconnexion</span>}
                </button>
            </div>

        </div>
    );
}
