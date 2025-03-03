"use client"

import { useEffect, useState } from 'react'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { ActivityCard } from '@/components/dashboard/ActivityCard'
import { NotificationsCard } from '@/components/dashboard/NotificationsCard'
import { dashboardApi, Stats, Activity, Notification } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<Activity[] | null>(null)
  const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setIsLoading(true)
        const [statsData, activityData, notificationsData] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getActivity(),
          dashboardApi.getNotifications()
        ])

        setStats(statsData)
        setActivities(activityData.activities)
        setNotifications(notificationsData.notifications)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard stats={stats} isLoading={isLoading} />
        <ActivityCard activities={activities} isLoading={isLoading} />
        <NotificationsCard notifications={notifications} isLoading={isLoading} />
      </div>
    </div>
  )
}