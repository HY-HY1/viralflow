import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stats } from "@/lib/api"

interface StatsCardProps {
  stats: Stats | null;
  isLoading: boolean;
}

export function StatsCard({ stats, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Downloads:</span>
          <span className="font-medium">{stats?.total_downloads || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Transcriptions:</span>
          <span className="font-medium">{stats?.total_transcriptions || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Storage Used:</span>
          <span className="font-medium">{stats?.storage_used || '0 MB'}</span>
        </div>
      </CardContent>
    </Card>
  )
} 