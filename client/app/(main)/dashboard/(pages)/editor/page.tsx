"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditorPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Editor</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          New Project
        </button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common editing tools and templates</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Add quick action buttons/tools here */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border rounded-lg hover:bg-accent">
                New Video
              </button>
              <button className="p-4 border rounded-lg hover:bg-accent">
                Import Media
              </button>
              <button className="p-4 border rounded-lg hover:bg-accent">
                Recent Projects
              </button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Your editing workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Timeline workspace will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 