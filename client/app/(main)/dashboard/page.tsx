"use client"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Quick Stats</h2>
          <p>Development mode - Stats will go here</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <p>Development mode - Activity will go here</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-2">Notifications</h2>
          <p>Development mode - Notifications will go here</p>
        </div>
      </div>
    </div>
  );
}