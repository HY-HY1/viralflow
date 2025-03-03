"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Something went wrong with Google sign in.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800"
        >
          <div className="absolute inset-0 w-3 bg-gradient-to-r from-purple-400 to-pink-600 transition-all duration-[250ms] ease-out group-hover:w-full" />
          <div className="relative flex items-center justify-center gap-2">
            {isGoogleLoading ? (
              <Icons.spinner className="h-5 w-5 animate-spin" />
            ) : (
              <Icons.google className="h-5 w-5" />
            )}
            <span className="relative group-hover:text-white transition-colors duration-200">
              Continue with Google
            </span>
          </div>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background dark:text-zinc-400 px-2">
              Or continue with email
            </span>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <Button className="bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:opacity-90 transition-opacity">
            Sign In with Email
          </Button>
        </div>
      </div>
    </div>
  );
} 