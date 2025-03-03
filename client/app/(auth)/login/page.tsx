import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "../_components/LoginForm";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Login - TikTok AI",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left side - Dark Branding */}
      <div className="relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            TikTok AI
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-6">
            <div className="relative">
              <div className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-purple-400">300%</span>
                    <p className="text-zinc-400">Average engagement increase for our creators</p>
                  </div>
                  <div className="h-px bg-zinc-700" />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-pink-400">10k+</span>
                    <p className="text-zinc-400">Active content creators using our platform</p>
                  </div>
                  <div className="h-px bg-zinc-700" />
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-bold text-purple-400">1M+</span>
                    <p className="text-zinc-400">Videos created with our AI tools</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 p-6">
              <p className="text-lg text-zinc-300">
                "This platform has revolutionized how we create TikTok content. The AI-powered tools have saved us countless hours."
              </p>
              <footer className="mt-4 flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-600" />
                <div>
                  <p className="text-base font-semibold text-zinc-200">Sofia Davis</p>
                  <p className="text-sm text-zinc-400">1M+ TikTok Followers</p>
                </div>
              </footer>
            </div>
          </blockquote>
        </div>
        <div className="relative z-20 mt-16">
          <div className="flex items-center space-x-4 text-sm text-zinc-400">
            <Link href="/privacy" className="hover:text-zinc-200 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-200 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-zinc-200 transition-colors">Contact</Link>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="relative flex h-full flex-col items-center justify-center lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue creating amazing content
            </p>
          </div>
          <LoginForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link 
              href="/register" 
              className="group inline-flex items-center hover:text-brand underline underline-offset-4"
            >
              Don&apos;t have an account? Sign Up
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}