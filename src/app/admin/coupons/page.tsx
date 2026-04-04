"use client";

import { useState, useEffect } from "react";
import {
    Ticket,
    Plus,
    Trash2,
    Calendar,
    Percent,
    DollarSign,
    Save,
    X,
    Layout,
    ArrowRight,
    Image as ImageIcon,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({
        code: "",
        type: "PERCENTAGE",
        value: "",
        minPurchase: "0",
        usageLimit: "",
        expiryDate: ""
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/coupons");
            const data = await res.json();
            if (Array.isArray(data)) setCoupons(data);
        } catch (error) {
            toast.error("Failed to load coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/admin/coupons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newCoupon,
                    value: parseFloat(newCoupon.value),
                    minPurchase: parseFloat(newCoupon.minPurchase),
                    usageLimit: newCoupon.usageLimit ? parseInt(newCoupon.usageLimit) : null,
                    expiryDate: newCoupon.expiryDate ? new Date(newCoupon.expiryDate).toISOString() : null
                })
            });

            if (res.ok) {
                toast.success("Coupon created successfully");
                setIsAddModalOpen(false);
                fetchCoupons();
                setNewCoupon({ code: "", type: "PERCENTAGE", value: "", minPurchase: "0", usageLimit: "", expiryDate: "" });
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to create coupon");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        try {
            const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Coupon deleted");
                fetchCoupons();
            }
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Coupons & Discounts</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Create and manage promotional codes for your customers.</p>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="rounded-2xl h-14 px-8 bg-primary font-bold shadow-lg shadow-primary/20 gap-2 min-w-[180px]"
                >
                    <Plus className="w-5 h-5" />
                    Create Coupon
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coupons.map((coupon) => (
                    <motion.div
                        layout
                        key={coupon.id}
                        className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft relative overflow-hidden group hover:shadow-premium transition-all duration-500"
                    >
                        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-xl h-11 w-11 shadow-lg shadow-destructive/20"
                                onClick={() => handleDelete(coupon.id)}
                            >
                                <Trash2 className="w-4.5 h-4.5" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                                <Ticket className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold uppercase tracking-widest font-display">{coupon.code}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-tighter italic shadow-sm">
                                        {coupon.type === "PERCENTAGE" ? `${coupon.value}% OFF` : `$${coupon.value} OFF`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm py-2 px-1">
                                <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Min. Purchase</span>
                                <span className="font-bold text-foreground font-display text-lg">${coupon.minPurchase}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm py-2 px-1">
                                <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Usage Limit</span>
                                <span className="font-bold text-foreground">{coupon.usageCount} <span className="text-muted-foreground/50 font-medium">/</span> {coupon.usageLimit || "∞"}</span>
                            </div>
                            <div className="pt-4 border-t border-dashed border-border/50">
                                <div className="flex items-center justify-between text-sm px-1">
                                    <span className="text-muted-foreground font-medium uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Expiry
                                    </span>
                                    <span className={`font-bold uppercase tracking-tighter text-xs ${coupon.expiryDate && new Date(coupon.expiryDate) < new Date() ? 'text-destructive' : 'text-primary'}`}>
                                        {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : "No Expiry"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Aesthetic Decoration */}
                        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
                    </motion.div>
                ))}

                {coupons.length === 0 && (
                    <div className="lg:col-span-3 py-24 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground">
                        <Ticket className="w-20 h-20 mb-6 opacity-5" />
                        <p className="font-bold text-xl uppercase tracking-widest">No Active Coupons</p>
                        <p className="text-sm mt-2">Start offering discounts to boost your sales.</p>
                        <Button
                            variant="ghost"
                            className="mt-8 rounded-xl font-bold gap-2 text-primary hover:bg-primary/5"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Plus className="w-4 h-4" /> Create First Coupon
                        </Button>
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-lg bg-white dark:bg-card p-10 lg:p-12 rounded-[3rem] shadow-2xl border border-border/50"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">New Discount</h2>
                                    <p className="text-muted-foreground text-sm mt-1">Define rewards for your loyal customers.</p>
                                </div>
                                <Button size="icon" variant="ghost" className="rounded-2xl" onClick={() => setIsAddModalOpen(false)}>
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Coupon Code</label>
                                    <input
                                        type="text"
                                        value={newCoupon.code}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                        placeholder="e.g. LUXURY40"
                                        className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold text-lg uppercase tracking-widest"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Reward Type</label>
                                        <select
                                            value={newCoupon.type}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, type: e.target.value })}
                                            className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 appearance-none cursor-pointer font-bold"
                                        >
                                            <option value="PERCENTAGE">Percentage (%)</option>
                                            <option value="FIXED">Fixed Amount ($)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Value</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={newCoupon.value}
                                                onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                                                placeholder="0.00"
                                                className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold text-lg"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                                                {newCoupon.type === "PERCENTAGE" ? "%" : "$"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Min. Order</label>
                                        <input
                                            type="number"
                                            value={newCoupon.minPurchase}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, minPurchase: e.target.value })}
                                            placeholder="0"
                                            className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Usage Limit</label>
                                        <input
                                            type="number"
                                            value={newCoupon.usageLimit}
                                            onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                                            placeholder="∞"
                                            className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1">Expiration Date</label>
                                    <input
                                        type="date"
                                        value={newCoupon.expiryDate}
                                        onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                                        className="w-full p-5 bg-[#F8F9FA] dark:bg-background border-none rounded-2xl outline-none focus:ring-2 ring-primary/20 font-bold"
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <Button
                                        variant="outline"
                                        className="flex-1 h-15 rounded-2xl border-border font-bold text-muted-foreground hover:bg-muted"
                                        onClick={() => setIsAddModalOpen(false)}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        className="flex-2 h-15 rounded-2xl bg-primary shadow-xl shadow-primary/20 font-bold px-8"
                                        onClick={handleCreate}
                                    >
                                        Activate Coupon
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
