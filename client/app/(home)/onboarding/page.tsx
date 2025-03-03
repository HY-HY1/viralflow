"use client"

import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Github } from "lucide-react";
import { signIn } from "next-auth/react";

// Icons component for loading and provider logos
const Icons = {
    spinner: ({ className }: { className?: string }) => (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    ),
    google: ({ className }: { className?: string }) => (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
        >
            <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
        </svg>
    ),
};

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const metrics = [
    { value: "2M+", label: "Videos Created" },
    { value: "500K+", label: "Active Users" },
    { value: "98%", label: "Success Rate" },
    { value: "24/7", label: "Support" },
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Content Creator",
        image: "/testimonials/sarah.jpg",
        content: "TikTok AI has transformed how I create content. My engagement has increased by 300% since I started using it.",
        stats: "1.2M Followers"
    },
    {
        name: "David Chen",
        role: "Brand Manager",
        image: "/testimonials/david.jpg",
        content: "The AI-powered editing tools save us hours of work. Our content quality has never been better.",
        stats: "500K+ Views/Post"
    },
    {
        name: "Emma Wilson",
        role: "Influencer",
        image: "/testimonials/emma.jpg",
        content: "I was skeptical at first, but the results speak for themselves. My reach has doubled in just two months.",
        stats: "2.5M Likes"
    }
];

const steps = [
    {
        title: "Create your account",
        description: "Start your journey with TikTok AI",
        fields: ["email", "password"]
    },
    {
        title: "Tell us about your content",
        description: "Help us personalize your experience",
        fields: ["content_type", "niche"]
    },
    {
        title: "Choose your plan",
        description: "Select the perfect plan for your needs",
        fields: ["plan"]
    }
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const containerRef = useRef(null);
    const formRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: formRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1]);
    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.push("/dashboard");
        }
    };

    const handleOAuthSignIn = async (provider: string) => {
        if (provider === "google") {
            setIsGoogleLoading(true);
            try {
                await signIn(provider, {
                    callbackUrl: "/onboarding",
                    redirect: true,
                });
            } catch (error) {
                console.error("Error signing in with Google:", error);
            }
        } else {
            await signIn(provider, {
                callbackUrl: "/onboarding",
                redirect: true,
            });
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen relative">
            {/* Hero Section with Metrics */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-purple-50 to-white"
            >
                <div className="container mx-auto px-4 py-20 text-center">
                    <motion.h1 
                        className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
                        variants={fadeInUp}
                    >
                        Transform Your TikTok Content
                    </motion.h1>
                    <motion.p 
                        className="text-xl md:text-2xl text-gray-600 mb-12"
                        variants={fadeInUp}
                    >
                        AI-powered tools to create viral-worthy videos in minutes
                    </motion.p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
                        {metrics.map((metric, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-white rounded-2xl shadow-xl"
                            >
                                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                                    {metric.value}
                                </div>
                                <div className="text-gray-600">{metric.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="bg-white p-6 rounded-2xl shadow-lg"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 mr-4" />
                                    <div>
                                        <h3 className="font-semibold">{testimonial.name}</h3>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{testimonial.content}</p>
                                <div className="text-sm font-semibold text-purple-600">
                                    {testimonial.stats}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Onboarding Form Section with Parallax */}
            <motion.section
                ref={formRef}
                style={{ opacity, scale }}
                className="min-h-screen flex items-center justify-center py-20 relative"
            >
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-purple-600 to-pink-600 rounded-[3rem] mx-4 lg:mx-8"
                    style={{ y: backgroundY }}
                />
                
                <motion.div 
                    className="max-w-md w-full mx-4 space-y-8 bg-white p-8 rounded-2xl shadow-xl relative z-10"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    {/* OAuth Buttons */}
                    <div className="space-y-4">
                        <Button
                            onClick={() => handleOAuthSignIn("google")}
                            variant="outline"
                            className="w-full"
                            disabled={isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <Icons.spinner className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <Icons.google className="h-5 w-5 mr-2" />
                            )}
                            Continue with Google
                        </Button>
                        <Button
                            onClick={() => handleOAuthSignIn("github")}
                            variant="outline"
                            className="w-full"
                        >
                            <Github className="mr-2 h-5 w-5" />
                            Continue with GitHub
                        </Button>
                        
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    {/* Step Content */}
                    <motion.div
                        key={currentStep}
                        initial="initial"
                        animate="animate"
                        variants={fadeInUp}
                        className="space-y-6"
                    >
                        <div className="text-center">
                            <motion.h2 
                                className="text-3xl font-bold text-gray-900"
                                variants={fadeInUp}
                            >
                                {steps[currentStep].title}
                            </motion.h2>
                            <motion.p 
                                className="mt-2 text-gray-600"
                                variants={fadeInUp}
                            >
                                {steps[currentStep].description}
                            </motion.p>
                        </div>

                        <div className="space-y-4">
                            {currentStep === 0 && (
                                <>
                                    <Input
                                        type="email"
                                        placeholder="Email address"
                                        className="w-full"
                                    />
                                    <Input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full"
                                    />
                                </>
                            )}

                            {currentStep === 1 && (
                                <>
                                    <select className="w-full rounded-lg border border-gray-300 p-3">
                                        <option value="">Select content type</option>
                                        <option value="educational">Educational</option>
                                        <option value="entertainment">Entertainment</option>
                                        <option value="lifestyle">Lifestyle</option>
                                    </select>
                                    <select className="w-full rounded-lg border border-gray-300 p-3">
                                        <option value="">Select your niche</option>
                                        <option value="tech">Technology</option>
                                        <option value="fashion">Fashion</option>
                                        <option value="food">Food</option>
                                        <option value="fitness">Fitness</option>
                                    </select>
                                </>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    {["Free", "Pro", "Enterprise"].map((plan) => (
                                        <motion.div
                                            key={plan}
                                            className="border rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium">{plan}</h3>
                                                <CheckCircle2 className="h-5 w-5 text-purple-500" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <motion.div
                            className="flex justify-end"
                            variants={fadeInUp}
                        >
                            <Button
                                onClick={handleNext}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                            >
                                {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.section>
        </div>
    );
}
