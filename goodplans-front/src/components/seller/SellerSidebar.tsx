import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import {
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  PlusCircle,
} from "lucide-react";

export default function SellerSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navItems = [
    {
      name: "Aperçu",
      path: "/seller/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      end: true,
    },
    {
      name: "Mes annonces",
      path: "/seller/listings",
      icon: <ListChecks className="h-5 w-5" />,
    },
    {
      name: "Messages",
      path: "/seller/chatList",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Paramètres",
      path: "/seller/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Aide",
      path: "/seller/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800">{user?.email}</p>
        <p className="text-xs text-gray-500">Gérer mon compte vendeur</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <span className="mr-3 text-gray-500">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-2">
        <NavLink
          to="/create-listing"
          className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Publier une annonce
        </NavLink>

        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
