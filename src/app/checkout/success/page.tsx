"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Suspense } from "react";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const { clearCart } = useCart();

    useEffect(() => {
        if (sessionId) {
            clearCart();
        }
    }, [sessionId, clearCart]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-card p-12 rounded-[3rem] shadow-2xl border border-border/50 text-center space-y-8"
        >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto">
                <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-3">
                <h1 className="font-display text-4xl font-bold">Acquisition Secured</h1>
                <p className="text-muted-foreground text-lg">Your timepiece has been successfully ordered and is being prepared for fulfillment.</p>
            </div>

            <div className="p-6 bg-muted/50 rounded-3xl text-sm font-medium border border-border/50">
                <p className="text-muted-foreground mb-1 uppercase tracking-widest text-[10px] font-bold">Order ID</p>
                <p className="text-foreground">#{sessionId?.slice(-12).toUpperCase() || "PENDING"}</p>
            </div>

            <div className="space-y-3">
                <Button asChild className="w-full h-14 rounded-2xl font-bold gap-2">
                    <Link href="/dashboard">
                        <Package className="w-5 h-5" />
                        Track in Dashboard
                    </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full h-14 rounded-2xl font-bold gap-2">
                    <Link href="/products">
                        <ShoppingBag className="w-5 h-5" />
                        Continue Exploring
                    </Link>
                </Button>
            </div>
        </motion.div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 pt-20">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
