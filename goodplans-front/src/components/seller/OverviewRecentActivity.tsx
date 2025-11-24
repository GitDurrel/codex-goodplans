import type { ReactElement } from "react";
import { Eye, MessageSquare, DollarSign, Clock } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  time: string;
}

interface Props {
  activities: ActivityItem[];
  isLoading?: boolean;
}

function getActivityIcon(type: string) {
  const icons: Record<string, ReactElement> = {
    message: <MessageSquare className="h-4 w-4 text-white" />,
    offer: <DollarSign className="h-4 w-4 text-white" />,
    view: <Eye className="h-4 w-4 text-white" />,
  };
  return icons[type] || <Clock className="h-4 w-4 text-white" />;
}

function getActivityIconBg(type: string) {
  const colors: Record<string, string> = {
    message: "bg-blue-500",
    offer: "bg-green-500",
    view: "bg-purple-500",
  };
  return colors[type] || "bg-gray-500";
}

export function OverviewRecentActivity({ activities, isLoading }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Activité récente</h2>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start">
                <div className={`mt-1 mr-4 rounded-full p-2 ${getActivityIconBg(activity.type)}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <p className="text-gray-500">Pas encore d'activité</p>
          </div>
        )}
      </div>
    </div>
  );
}
