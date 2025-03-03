"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
                {/* Left side - Content */}
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                        Create{" "}
                        <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                            Viral-Ready
                        </span>{" "}
                        TikTok Shop Videos in Minutes
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                        Transform your TikTok Shop with AI-powered video creation. Boost engagement, drive sales, and scale your affiliate business on autopilot.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        {user ? (
                            <Link href="/dashboard">
                                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-90">
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/onboarding">
                                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-90">
                                        Start Creating Free
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    <Play className="mr-2 h-4 w-4" />
                                    Watch Demo
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-3xl font-bold text-purple-400">300%</span>
                            <span className="text-sm text-muted-foreground">Avg. Engagement</span>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-3xl font-bold text-pink-400">10k+</span>
                            <span className="text-sm text-muted-foreground">Active Users</span>
                        </div>
                        <div className="w-px h-12 bg-gray-200" />
                        <div className="flex flex-col items-center lg:items-start">
                            <span className="text-3xl font-bold text-purple-400">1M+</span>
                            <span className="text-sm text-muted-foreground">Videos Created</span>
                        </div>
                    </div>
                </div>

                {/* Right side - Image/Animation */}
                <div className="flex-1 relative">
                    <div className="relative w-full aspect-square -z-100">
                        <div className=" absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-600/30 rounded-full blur-3xl" />
                        <div className="relative z-10 w-full h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                            AI Video Platform
                        </div>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute top-1/4 -left-8 bg-white p-4 rounded-lg shadow-lg z-20">
                        <div className="flex items-center gap-3">
                            <div className=" w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-600" />
                            <div>
                                <p className="font-semibold">Video Generated</p>
                                <p className="text-sm text-muted-foreground">Just now</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-1/4 -right-8 bg-white p-4 rounded-lg shadow-lg z-20">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-600" />
                            <div>
                                <p className="font-semibold">Sales Increased</p>
                                <p className="text-sm text-muted-foreground">+127% this month</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
