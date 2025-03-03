"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Film, Clock, CheckCircle, XCircle } from "lucide-react";

export default function ExportsPage() {
  const exports = [
    {
      id: 1,
      name: "Marketing_Final_v2.mp4",
      status: "completed",
      date: "2024-03-01",
      size: "256MB",
      format: "MP4",
    },
    {
      id: 2,
      name: "Product_Demo_HD.mp4",
      status: "processing",
      date: "2024-03-01",
      size: "512MB",
      format: "MP4",
    },
    {
      id: 3,
      name: "Tutorial_1_4K.mp4",
      status: "failed",
      date: "2024-02-29",
      size: "1.2GB",
      format: "MP4",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exports</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          New Export
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {exports.map((export_) => (
              <div
                key={export_.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Film className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-medium">{export_.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {export_.date} • {export_.size} • {export_.format}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusIcon(export_.status)}
                  {export_.status === "completed" && (
                    <button className="flex items-center space-x-2 px-3 py-1 text-sm border rounded-md hover:bg-accent">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Export Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Presets</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  1080p High Quality
                </button>
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  720p Fast Export
                </button>
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  4K Maximum Quality
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  Batch Export
                </button>
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  Export Queue
                </button>
                <button className="w-full text-left px-4 py-2 border rounded-md hover:bg-accent">
                  Custom Settings
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 