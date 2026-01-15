"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home, Target, Heart, Award, Users } from "lucide-react";

const watch1 = "/assets/watches/watch-1.png";
const watch4 = "/assets/watches/watch-4.png";

const values = [
    {
        icon: Target,
        title: "Quality First",
        description: "Every watch in our collection is meticulously selected for its craftsmanship, durability, and timeless design.",
    },
    {
        icon: Heart,
        title: "Customer Focus",
        description: "Your satisfaction drives everything we do. From selection to delivery, we're here to make your experience exceptional.",
    },
    {
        icon: Award,
        title: "Authenticity Guaranteed",
        description: "We partner only with authorized dealers and reputable manufacturers to ensure every timepiece is genuine.",
    },
    {
        icon: Users,
        title: "Community",
        description: "Join thousands of watch enthusiasts who trust Timecraft for their timepiece needs.",
    },
];

const stats = [
    { number: "50K+", label: "Happy Customers" },
    { number: "200+", label: "Watch Styles" },
    { number: "15+", label: "Years Experience" },
    { number: "99%", label: "Satisfaction Rate" },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <main>
                {/* Breadcrumb */}
                <div className="bg-muted py-4">
                    <div className="container mx-auto px-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground font-medium">About Us</span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <section className="py-16 lg:py-24 bg-muted">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <span className="text-primary font-medium text-sm tracking-wider uppercase">
                                    Our Story
                                </span>
                                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mt-2 mb-6">
                                    Curating Timepieces<br />
                                    <span className="text-gradient-primary">Since 2009</span>
                                </h1>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    Timecraft was born from a simple passion: connecting watch enthusiasts
                                    with exceptional timepieces. What started as a small boutique has grown
                                    into a trusted destination for quality watches from around the world.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    We believe that a watch is more than just a time-telling device—it's a
                                    statement of personal style, a celebration of craftsmanship, and often,
                                    a treasured heirloom. That's why we carefully curate every piece in our
                                    collection, ensuring it meets our exacting standards.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative"
                            >
                                <div className="relative bg-card rounded-3xl p-8 shadow-medium">
                                    <motion.img
                                        src={watch4}
                                        alt="Premium watch"
                                        className="w-full max-w-sm mx-auto"
                                    />
                                </div>
                                <motion.div
                                    className="absolute -bottom-6 -left-6 bg-gradient-hero p-6 rounded-2xl text-primary-foreground"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <div className="text-3xl font-bold">15+</div>
                                    <div className="text-sm opacity-90">Years of Excellence</div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-foreground text-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="font-display text-4xl lg:text-5xl font-bold text-primary mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-background/70">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <span className="text-primary font-medium text-sm tracking-wider uppercase">
                                What We Stand For
                            </span>
                            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
                                Our Values
                            </h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
                                        <value.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {value.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Promise */}
                <section className="py-16 lg:py-24 bg-muted">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                            >
                                <motion.img
                                    src={watch1}
                                    alt="Watch craftsmanship"
                                    className="w-full max-w-md mx-auto"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <span className="text-primary font-medium text-sm tracking-wider uppercase">
                                    Our Promise
                                </span>
                                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                                    More Than Just Watches
                                </h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    When you shop with Timecraft, you're not just buying a watch—you're
                                    gaining a trusted partner in your horological journey. We provide:
                                </p>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                        Expert guidance to find the perfect timepiece for your style and budget
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                        Comprehensive warranties and after-sales support
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                        Secure packaging and worldwide shipping
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                                        A satisfaction guarantee on every purchase
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
