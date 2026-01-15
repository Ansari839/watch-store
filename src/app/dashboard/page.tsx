"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    Package,
    User as UserIcon,
    Heart,
    Settings,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch("/api/orders/my-orders");
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchOrders();
        }
    }, [session]);

    const stats = [
        { label: "Total Orders", value: orders.length, icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Pending", value: orders.filter(o => o.status === "PENDING").length, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Delivered", value: orders.filter(o => o.status === "DELIVERED").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Please log in to view your dashboard</h1>
                    <Button asChild rounded-2xl>
                        <Link href="/login">Login Now</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-display text-4xl lg:text-5xl font-bold mb-2">Welcome back, {session.user?.name?.split(' ')[0]}</h1>
                    <p className="text-muted-foreground">Manage your orders and account preferences.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-card p-6 rounded-[2rem] border border-border/50 shadow-soft flex items-center gap-6"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <p className="text-3xl font-bold">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Package className="w-6 h-6 text-primary" />
                                Recent Orders
                            </h2>
                            <Link href="/orders" className="text-sm font-bold text-primary hover:underline">View All</Link>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-32 bg-muted animate-pulse rounded-[2rem]" />
                                ))}
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.slice(0, 5).map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-card p-6 rounded-[2rem] border border-border/50 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
                                                <ShoppingBag className="w-8 h-8 opacity-20" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Order #{order.id.slice(-8).toUpperCase()}</p>
                                                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 md:gap-8">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total</p>
                                                <p className="font-bold">${order.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    order.status === 'CANCELLED' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-amber-500/10 text-amber-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 hover:text-primary">
                                                <Link href={`/orders/${order.id}`}>
                                                    <ChevronRight className="w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-card p-12 rounded-[2rem] border border-border/50 shadow-soft text-center">
                                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                                <Button asChild className="mt-6 rounded-2xl" variant="outline">
                                    <Link href="/products">Start Shopping</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Quick Settings / Profile */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <UserIcon className="w-6 h-6 text-primary" />
                            Account Overview
                        </h2>

                        <div className="bg-white dark:bg-card p-8 rounded-[2rem] border border-border/50 shadow-soft space-y-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-4 border-4 border-white dark:border-card shadow-lg">
                                    {session.user?.name?.charAt(0)}
                                </div>
                                <h3 className="text-xl font-bold">{session.user?.name}</h3>
                                <p className="text-sm text-muted-foreground">{session.user?.email}</p>
                            </div>

                            <div className="space-y-2">
                                <Link
                                    href="/wishlist"
                                    className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-medium">My Wishlist</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="font-medium">Account Settings</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                </Link>
                            </div>

                            <Button className="w-full rounded-2xl h-12 shadow-lg shadow-primary/20">
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
