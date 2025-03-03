"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Folder, Search, Filter } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { id: 1, title: "Marketing Video", date: "2024-03-01", status: "In Progress" },
    { id: 2, title: "Product Demo", date: "2024-02-28", status: "Completed" },
    { id: 3, title: "Tutorial Series", date: "2024-02-27", status: "Draft" },
    // Add more mock projects as needed
  ];

  return (
    <div className="container space-y-8 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          New Project
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-md hover:bg-accent">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Folder className="h-5 w-5 text-primary" />
                <CardTitle>{project.title}</CardTitle>
              </div>
              <CardDescription>Last modified: {project.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status: {project.status}</span>
                <button className="text-sm text-primary hover:underline">
                  Open
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 