"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Video, Play, Download } from "lucide-react";

export default function BlurVideoPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blur Video</h1>
          <p className="text-muted-foreground mt-2">
            Add blur effects to specific areas in your video
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">
                    Upload a video to start editing
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4">
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Play className="h-4 w-4" />
                  <span>Preview</span>
                </button>
                <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-accent">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Timeline controls will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">
                  Drag and drop your video here, or click to browse
                </p>
                <Input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  id="video-upload"
                />
                <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                  Select Video
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Supported formats: MP4, MOV, AVI (max 500MB)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blur Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Blur Type</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Gaussian Blur</option>
                  <option>Motion Blur</option>
                  <option>Pixelate</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Blur Intensity</label>
                <Input
                  type="range"
                  min="1"
                  max="20"
                  defaultValue="10"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Selection Mode</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Rectangle</option>
                  <option>Ellipse</option>
                  <option>Free Draw</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Face Detection</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="face-detection" />
                  <label htmlFor="face-detection" className="text-sm">
                    Automatically detect and blur faces
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Format</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>MP4</option>
                  <option>MOV</option>
                  <option>AVI</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Quality</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>High (1080p)</option>
                  <option>Medium (720p)</option>
                  <option>Low (480p)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 