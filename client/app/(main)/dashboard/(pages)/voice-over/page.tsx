"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Video, Play, Pause, Upload, Download, Waves } from "lucide-react";

export default function VoiceOverPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voice Over Video</h1>
          <p className="text-muted-foreground mt-2">
            Add professional voice overs to your videos
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
                    Upload a video to start adding voice over
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
              <CardTitle>Voice Over Script</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Write or paste your voice over script here..."
                className="h-32"
              />
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md">
                  <Mic className="h-4 w-4" />
                  <span>Start Recording</span>
                </button>
                <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-accent">
                  <Upload className="h-4 w-4" />
                  <span>Upload Audio</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audio Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-24 bg-muted rounded-lg p-4">
                  <Waves className="w-full h-full text-primary opacity-50" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">00:00</span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full hover:bg-accent">
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-accent">
                      <Pause className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">00:00</span>
                </div>
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
              <CardTitle>Voice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Voice Type</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Natural Voice</option>
                  <option>AI Voice 1</option>
                  <option>AI Voice 2</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Speed</label>
                <Input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  defaultValue="1"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Volume</label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="80"
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Background Music</label>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" id="background-music" />
                  <label htmlFor="background-music" className="text-sm">
                    Add background music
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