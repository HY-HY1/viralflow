"use client";

import { Icons } from "@/components/ui/icons";
import { motion } from "framer-motion";

const features = [
    {
        icon: "wand",
        title: "AI-Powered Editing",
        description: "Our advanced AI automatically edits your videos for maximum engagement, saving you hours of work.",
    },
    {
        icon: "rocket",
        title: "Instant Generation",
        description: "Generate multiple video variations in minutes, not hours. Perfect for testing different styles.",
    },
    {
        icon: "chart",
        title: "Performance Analytics",
        description: "Track your video performance and get AI-powered insights to improve your content strategy.",
    },
    {
        icon: "shop",
        title: "Shop Integration",
        description: "Seamlessly integrate with TikTok Shop to create product videos that drive sales.",
    },
    {
        icon: "template",
        title: "Viral Templates",
        description: "Access a library of proven templates that have helped creators go viral.",
    },
    {
        icon: "automation",
        title: "Automation Tools",
        description: "Schedule posts and automate your content creation workflow for maximum efficiency.",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function Features() {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Everything You Need to Create{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                        Viral Content
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                    Our AI-powered platform provides all the tools you need to create, edit, and optimize your TikTok Shop content.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {features.map((feature, index) => {
                    const Icon = Icons[feature.icon];
                    return (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/5 to-pink-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400/10 to-pink-600/10 flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
} 