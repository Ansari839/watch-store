"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ChevronRight,
    Home,
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    Check,
    MessageSquare,
    Headphones
} from "lucide-react";

const contactMethods = [
    {
        icon: Mail,
        title: "Email Us",
        value: "hello@timecraft.com",
        description: "We'll respond within 24 hours",
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+1 (555) 123-4567",
        description: "Mon-Fri 9am-6pm EST",
    },
    {
        icon: MapPin,
        title: "Visit Us",
        value: "123 Watch Street",
        description: "Timepiece City, TC 12345",
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon - Fri: 9am - 6pm",
        description: "Sat: 10am - 4pm",
    },
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                            <span className="text-foreground font-medium">Contact</span>
                        </nav>
                    </div>
                </div>

                {/* Hero */}
                <section className="py-16 lg:py-20 bg-muted">
                    <div className="container mx-auto px-4 text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block text-primary font-medium text-sm tracking-wider uppercase mb-2"
                        >
                            Get in Touch
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4"
                        >
                            We're Here to Help
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-muted-foreground max-w-xl mx-auto"
                        >
                            Have questions about a watch, your order, or need guidance finding the perfect
                            timepiece? Our team is ready to assist you.
                        </motion.p>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-12 -mt-8">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {contactMethods.map((method, index) => (
                                <motion.div
                                    key={method.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="bg-card rounded-2xl p-6 shadow-soft text-center"
                                >
                                    <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <method.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-medium text-foreground mb-1">{method.title}</h3>
                                    <p className="text-foreground font-semibold">{method.value}</p>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                                    Send Us a Message
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                                            Subject
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 bg-muted rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="order">Order Inquiry</option>
                                            <option value="product">Product Question</option>
                                            <option value="shipping">Shipping & Delivery</option>
                                            <option value="returns">Returns & Refunds</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 bg-muted rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                            placeholder="Tell us how we can help..."
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full gap-2 font-sans" disabled={isSubmitted}>
                                        {isSubmitted ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Message Sent!
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </motion.div>

                            {/* Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:pt-12"
                            >
                                <div className="bg-gradient-hero rounded-3xl p-8 lg:p-10 text-primary-foreground mb-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-background/20 flex items-center justify-center">
                                            <Headphones className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-xl font-semibold">Need Immediate Help?</h3>
                                            <p className="opacity-90">Our support team is standing by</p>
                                        </div>
                                    </div>
                                    <p className="opacity-90 mb-6">
                                        For urgent matters or if you prefer speaking directly with our team,
                                        give us a call during business hours. We're always happy to help!
                                    </p>
                                    <div className="flex items-center gap-3 text-lg font-semibold">
                                        <Phone className="w-5 h-5" />
                                        +1 (555) 123-4567
                                    </div>
                                </div>

                                <div className="bg-card rounded-3xl p-8 shadow-soft">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-display text-lg font-semibold text-foreground">FAQ</h3>
                                            <p className="text-muted-foreground text-sm">Quick answers to common questions</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                            <span>Orders typically ship within 1-2 business days</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                            <span>All watches include a 2-year warranty</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                            <span>Free returns within 30 days of purchase</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                                            <span>Free shipping on orders over $150</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
