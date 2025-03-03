import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Notification } from "@/lib/api"
import { formatDistanceToNow } from 'date-fns'

interface NotificationsCardProps {
  notifications: Notification[] | null;
  isLoading: boolean;
}

export function NotificationsCard({ notifications, isLoading }: NotificationsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4">
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  notification.type === 'info' ? 'bg-blue-500' :
                  notification.type === 'warning' ? 'bg-yellow-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-green-500'
                }`} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No new notifications</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 