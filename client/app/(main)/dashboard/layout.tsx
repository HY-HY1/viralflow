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
        <div className="flex w-full 0">
          <AppSidebar />
          <main className="flex-1 w-full">
            <SidebarTrigger />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  )
}
