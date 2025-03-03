"use client"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from "./_components/sidebar"
import { AuthProvider } from "@/context/authContext"
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex">
          <AppSidebar />
          <main className="flex-1">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}
