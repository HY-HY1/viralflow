"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
    {
        name: "Free",
        price: "0",
        description: "Perfect for trying out our platform",
        features: [
            "5 AI-generated videos per month",
            "Basic video templates",
            "720p video quality",
            "Basic analytics",
            "Community support",
        ],
    },
    {
        name: "Pro",
        price: "29",
        description: "Best for growing creators",
        features: [
            "50 AI-generated videos per month",
            "Premium video templates",
            "1080p video quality",
            "Advanced analytics",
            "Priority support",
            "Custom branding",
            "Scheduled posting",
            "Team collaboration",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "99",
        description: "For professional content creators",
        features: [
            "Unlimited AI-generated videos",
            "Custom video templates",
            "4K video quality",
            "Enterprise analytics",
            "24/7 dedicated support",
            "Custom branding",
            "Advanced automation",
            "API access",
            "Multiple team workspaces",
        ],
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

export default function Pricing() {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Simple,{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                        Transparent
                    </span>{" "}
                    Pricing
                </h2>
                <p className="text-xl text-muted-foreground">
                    Choose the perfect plan for your content creation needs. No hidden fees.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                {plans.map((plan, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className={`relative bg-white p-8 rounded-2xl border ${
                            plan.popular
                                ? "border-purple-400 shadow-lg"
                                : "border-gray-100 shadow-sm"
                        }`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-400 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Most Popular
                            </div>
                        )}
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                            <p className="text-muted-foreground mb-4">{plan.description}</p>
                            <div className="flex items-end justify-center gap-1">
                                <span className="text-4xl font-bold">${plan.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Button
                            className={`w-full ${
                                plan.popular
                                    ? "bg-gradient-to-r from-purple-400 to-pink-600 hover:opacity-90"
                                    : ""
                            }`}
                            variant={plan.popular ? "default" : "outline"}
                        >
                            Get Started
                        </Button>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
} 