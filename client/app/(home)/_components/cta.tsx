"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
    return (
        <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-400 to-pink-600 py-20">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Create Viral TikTok Content?
                        </h2>
                        <p className="text-xl lg:text-2xl mb-8 text-white/90">
                            Join thousands of creators who are growing their TikTok Shop business with AI-powered videos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/onboarding">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20">
                                Schedule Demo
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 