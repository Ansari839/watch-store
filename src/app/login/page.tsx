"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Logged in successfully!");
                router.push("/");
                router.refresh();
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
                className="w-full max-w-[500px] space-y-8"
            >
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>

                <div className="bg-white dark:bg-card rounded-[3rem] shadow-soft border border-border/50 p-10 lg:p-14 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />

                    <div className="relative z-10">
                        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-3 tracking-tight">Welcome Back</h1>
                        <p className="text-muted-foreground mb-10 text-lg">Enter your details to access your collection.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <div className="space-y-2.5">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Password</label>
                                    <Link href="#" className="text-xs font-bold text-primary hover:underline">Forgot Password?</Link>
                                </div>
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

                            <Button
                                disabled={isLoading}
                                className="w-full h-16 rounded-2xl mt-4 text-lg font-bold shadow-lg shadow-primary/20 gap-3 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        Log In
                                        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-border/50 text-center">
                            <p className="text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/signup" className="text-primary font-bold hover:underline">Join the Collective</Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">Secured by Timecraft Encryption</p>
                </div>
            </motion.div>
        </div>
    );
}
