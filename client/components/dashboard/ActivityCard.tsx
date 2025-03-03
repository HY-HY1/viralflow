import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "@/lib/api"
import { formatDistanceToNow } from 'date-fns'

interface ActivityCardProps {
  activities: Activity[] | null;
  isLoading: boolean;
}

export function ActivityCard({ activities, isLoading }: ActivityCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  activity.status === 'failed' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 