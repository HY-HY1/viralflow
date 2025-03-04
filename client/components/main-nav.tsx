"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/dashboard"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Overview
      </Link>
      <Link
        href="/dashboard/analytics"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/analytics"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Analytics
      </Link>
      <Link
        href="/dashboard/content"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/content"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Content
      </Link>
      <Link
        href="/dashboard/youtube/downloader"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/youtube/downloader"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        YouTube Downloader
      </Link>
      <Link
        href="/dashboard/settings"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/dashboard/settings"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Settings
      </Link>
    </nav>
  );
} 