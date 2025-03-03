"use client";
import {
  FileText,
  Folder,
  Download,
  Video,
  Type,
  Mic,
  Edit,
  Archive,
  ChevronUp,
  User2,
  YoutubeIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/context/authContext";

// Sidebar menu sections
const sections = [
  {
    label: "Dashboard",
    items: [
      { title: "Editor", url: "/dashboard/editor", icon: Edit },
      { title: "Projects", url: "/dashboard/projects", icon: Folder },
      { title: "Exports", url: "/dashboard/exports", icon: Archive },
    ],
  },
  {
    label: "Create",
    items: [
      { title: "ChatGPT Video", url: "/dashboard/chatgpt-video", icon: Video },
      { title: "Fake Text Generator", url: "/dashboard/fake-text", icon: Type },
      { title: "Blur Video", url: "/dashboard/blur-video", icon: Video },
      { title: "Voice Over Video", url: "/dashboard/voice-over", icon: Mic },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Youtube Downloader",
        url: "/dashboard/youtube/downloader",
        icon: YoutubeIcon,
      },
      {
        title: "Tiktok Downloader",
        url: "/dashboard/tiktok/downloader",
        icon: Download,
      },
      { title: "Tiktok Video to Script", url: "/dashboard/tiktok/script", icon: FileText },
    ],
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  return (
    <Sidebar>
      <SidebarContent>
        <h2 className="px-4 border-b">ACME</h2>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton>
                <User2 /> {user?.email}
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              className="w-[--radix-popper-anchor-width] bg-white p-4 rounded-sm"
            >
              <DropdownMenuItem>
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span onClick={() => {logout()}}>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
}
