"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Video, Sparkles } from "lucide-react";

export default function ChatGPTVideoPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ChatGPT Video Creator</h1>
          <p className="text-muted-foreground mt-2">
            Create engaging videos using AI-generated content
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Video Title</label>
                <Input placeholder="Enter a title for your video" />
              </div>
              <div>
                <label className="text-sm font-medium">Topic or Prompt</label>
                <Textarea
                  placeholder="Describe what you want your video to be about..."
                  className="h-32"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Script</span>
                </button>
                <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-accent">
                  <Video className="h-4 w-4" />
                  <span>Preview</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="script">
            <TabsList>
              <TabsTrigger value="script">Script</TabsTrigger>
              <TabsTrigger value="visuals">Visuals</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
            </TabsList>
            <TabsContent value="script" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="Your AI-generated script will appear here..."
                    className="h-[400px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="visuals">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border rounded-lg hover:bg-accent text-left">
                        <div className="font-medium">Stock Footage</div>
                        <div className="text-sm text-muted-foreground">
                          Use high-quality stock videos
                        </div>
                      </button>
                      <button className="p-4 border rounded-lg hover:bg-accent text-left">
                        <div className="font-medium">AI Generated</div>
                        <div className="text-sm text-muted-foreground">
                          Create custom visuals with AI
                        </div>
                      </button>
                    </div>
                    <div className="h-[300px] border rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Visual preview will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="audio">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border rounded-lg hover:bg-accent text-left">
                        <div className="font-medium">Text to Speech</div>
                        <div className="text-sm text-muted-foreground">
                          Convert script to natural speech
                        </div>
                      </button>
                      <button className="p-4 border rounded-lg hover:bg-accent text-left">
                        <div className="font-medium">Background Music</div>
                        <div className="text-sm text-muted-foreground">
                          Add music and sound effects
                        </div>
                      </button>
                    </div>
                    <div className="h-[300px] border rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">Audio controls will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Style</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Educational</option>
                  <option>Entertainment</option>
                  <option>Professional</option>
                  <option>Casual</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Short (1-3 min)</option>
                  <option>Medium (3-7 min)</option>
                  <option>Long (7-15 min)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Language</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>English (US)</option>
                  <option>English (UK)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm">Be specific with your prompt</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm">Choose a clear target audience</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm">Review and edit the generated script</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 