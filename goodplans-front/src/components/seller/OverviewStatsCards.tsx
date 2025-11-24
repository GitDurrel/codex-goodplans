import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { ListChecks, Eye, MessageSquare, DollarSign } from "lucide-react";

export interface OverviewStats {
  activeListings: number;
  totalViews: number;
  unreadMessages: number;
  pendingOffers: number;
}

interface Props {
  stats: OverviewStats;
}

const cardsConfig = [
  {
    key: "activeListings",
    icon: <ListChecks className="h-5 w-5 sm:h-6 sm:w-6" />,
    link: "/seller/listings",
    title: "Annonces actives",
  },
  {
    key: "totalViews",
    icon: <Eye className="h-5 w-5 sm:h-6 sm:w-6" />,
    link: "/seller/analytics",
    title: "Vues totales",
  },
  {
    key: "unreadMessages",
    icon: <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />,
    link: "/seller/chatList",
    title: "Messages non lus",
  },
  {
    key: "pendingOffers",
    icon: <DollarSign className="h-5 w-5 sm:h-6 sm:w-6" />,
    link: "/seller/sales",
    title: "Offres en attente",
  },
] satisfies Array<{ key: keyof OverviewStats; icon: ReactElement; link: string; title: string }>;

export function OverviewStatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {cardsConfig.map((card) => (
        <Link key={card.key} to={card.link} className="block">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="text-2xl font-semibold mt-1">{stats[card.key]}</p>
              </div>
              <div className="text-gray-400">{card.icon}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
