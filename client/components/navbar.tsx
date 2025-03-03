"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Icons.wand className="h-6 w-6" />
            <span className="font-bold">ViralFlow</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Icons.dashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/pricing" className="flex items-center space-x-2">
              <Icons.dollar className="h-5 w-5" />
              <span>Pricing</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Icons.user className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </Link>
            ) : (
              <Link href="/onboarding">
                <Button size="sm">
                  <Icons.user className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 