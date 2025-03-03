"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "How does the AI video generation work?",
        answer: "Our AI analyzes your product information and target audience to automatically create engaging videos. It uses proven patterns from viral TikTok content to optimize your videos for maximum engagement.",
    },
    {
        question: "Can I customize the generated videos?",
        answer: "Yes! While our AI creates the initial video, you have full control to edit any aspect including text, transitions, effects, and music. We provide an intuitive editor for fine-tuning your content.",
    },
    {
        question: "How long does it take to generate a video?",
        answer: "Most videos are generated within 2-3 minutes. The exact time depends on the complexity and length of the video. You can generate multiple variations simultaneously to save time.",
    },
    {
        question: "Do you integrate with TikTok Shop?",
        answer: "Yes, we offer seamless integration with TikTok Shop. You can directly import product details and automatically generate product showcase videos optimized for sales.",
    },
    {
        question: "What video quality do you support?",
        answer: "We support up to 4K video quality on our Enterprise plan. The Free plan supports 720p, and the Pro plan supports 1080p. All videos are optimized for TikTok's platform.",
    },
    {
        question: "Can I schedule posts directly from your platform?",
        answer: "Yes, Pro and Enterprise plans include our scheduling feature. You can plan and schedule your content calendar, and we'll automatically post to your TikTok account at the optimal times.",
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export default function FAQ() {
    return (
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                    Frequently Asked{" "}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
                        Questions
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                    Everything you need to know about our AI-powered video creation platform.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
            >
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <motion.div key={index} variants={item}>
                            <AccordionItem value={`item-${index}`}>
                                <AccordionTrigger className="text-left">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </motion.div>
        </div>
    );
} 