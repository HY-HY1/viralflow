"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Type, Wand2, Copy, Download } from "lucide-react";

export default function FakeTextPage() {
  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fake Text Generator</h1>
          <p className="text-muted-foreground mt-2">
            Generate realistic-looking placeholder text for your projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Text</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Your generated text will appear here..."
                className="h-[400px] font-mono"
                readOnly
              />
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Copy className="h-4 w-4" />
                  <span>Copy</span>
                </button>
                <button className="flex items-center space-x-2 border px-4 py-2 rounded-md hover:bg-accent">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Text Type</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Lorem Ipsum</option>
                  <option>Random Words</option>
                  <option>Sentences</option>
                  <option>Paragraphs</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Length</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input type="number" placeholder="Words" min={1} />
                  </div>
                  <div>
                    <Input type="number" placeholder="Paragraphs" min={1} />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Format</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option>Plain Text</option>
                  <option>HTML</option>
                  <option>Markdown</option>
                </select>
              </div>
              <button className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                <Wand2 className="h-4 w-4" />
                <span>Generate Text</span>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <li key={i} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                    <div className="flex items-center space-x-2">
                      <Type className="h-4 w-4 text-primary" />
                      <span className="text-sm">Generation #{i}</span>
                    </div>
                    <button className="text-sm text-primary hover:underline">
                      Load
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 