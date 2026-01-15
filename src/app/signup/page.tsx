"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Account created successfully! Please login.");
                router.push("/login");
            } else {
                toast.error(data.error || "Failed to create account.");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-background flex items-center justify-center p-4 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[550px] space-y-8"
            >
                <Link href="/login" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Login</span>
                </Link>

                <div className="bg-white dark:bg-card rounded-[3rem] shadow-soft border border-border/50 p-10 lg:p-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3 tracking-tight">Join Us</h1>
                        <p className="text-muted-foreground mb-10 text-lg">Start your journey into the world of luxury horology.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-widest">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Abdullah Ansari"
                                        className="w-full pl-12 p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-widest">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g. abdullah@example.com"
                                        className="w-full pl-12 p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-widest">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            required
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-12 p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-sm font-bold text-muted-foreground px-1 uppercase tracking-widest">Confirm</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            required
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            placeholder="••••••••"
                                            className="w-full pl-12 p-4 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl focus:ring-2 ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                disabled={isLoading}
                                className="w-full h-16 rounded-2xl mt-4 text-lg font-bold shadow-lg shadow-primary/20 gap-3 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5" />
                                        Create Account
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-border/50 text-center">
                            <p className="text-muted-foreground">
                                Already a member?{" "}
                                <Link href="/login" className="text-primary font-bold hover:underline">Log In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
