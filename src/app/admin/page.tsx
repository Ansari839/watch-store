"use client";

import { motion } from "framer-motion";
import {
    Users,
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import { Palette, Check } from "lucide-react";

const stats = [
    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", positive: true, icon: DollarSign },
    { label: "Active Orders", value: "+2350", change: "+180.1%", positive: true, icon: ShoppingBag },
    { label: "Total Customers", value: "+12,234", change: "+19%", positive: true, icon: Users },
    { label: "Conversion Rate", value: "3.2%", change: "-2.4%", positive: false, icon: ArrowUpRight },
];

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();

            if (Array.isArray(data)) {
                setOrders(data);
            } else {
                console.error("Expected array but received:", data);
                setOrders([]);
                toast.error("Invalid response from server");
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setOrders([]);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, status: newStatus })
            });
            if (res.ok) {
                toast.success(`Order #${orderId} updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-500';
            case 'shipped': return 'bg-blue-500/10 text-blue-500';
            case 'delivered': return 'bg-green-500/10 text-green-500';
            case 'cancelled': return 'bg-red-500/10 text-red-500';
            default: return 'bg-gray-500/10 text-gray-500';
        }
    };

    const themes = [
        { id: "default", name: "Luxury Default", color: "bg-[#174e4c]", accent: "bg-[#f59e0b]" },
        { id: "executive", name: "Electric Executive", color: "bg-white", accent: "bg-[#6366f1]" },
        { id: "summer", name: "Mediterranean Summer", color: "bg-[#fffdf5]", accent: "bg-[#00b5ad]" },
        { id: "sunset", name: "Sunset Boutique", color: "bg-[#faf9f6]", accent: "bg-[#ff5a1f]" },
        { id: "cyber", name: "Cyber Mint", color: "bg-white", accent: "bg-[#00ffab]" },
    ] as const;

    const { theme: currentTheme, setTheme } = useTheme();

    return (
        <div className="space-y-10">
            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-border font-bold">Download Report</Button>
                    <Button className="rounded-2xl h-12 px-6 bg-primary font-bold shadow-lg shadow-primary/20">Add New Product</Button>
                </div>
            </div>

            {/* Store Aura Selection */}
            <section className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-soft">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Palette className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Store Aura</h2>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Select Active Theme</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {themes.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`group relative p-4 rounded-3xl border-2 transition-all duration-300 text-left ${currentTheme === t.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30 bg-muted/20"
                                }`}
                        >
                            <div className="flex flex-col gap-4">
                                <div className="flex gap-1.5 grayscale group-hover:grayscale-0 transition-all">
                                    <div className={`w-8 h-8 rounded-lg ${t.color} border border-border/50 shadow-sm`} />
                                    <div className={`w-8 h-8 rounded-lg ${t.accent} shadow-sm`} />
                                </div>
                                <span className={`text-xs font-bold leading-tight ${currentTheme === t.id ? "text-primary" : "text-muted-foreground"}`}>{t.name}</span>
                            </div>
                            {currentTheme === t.id && (
                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 bg-white dark:bg-card rounded-[2rem] shadow-soft border border-border/50"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#F8F9FA] dark:bg-background flex items-center justify-center">
                                <stat.icon className="w-7 h-7 text-primary" />
                            </div>
                            <span className={`flex items-center gap-1 text-sm font-bold ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.change}
                                {stat.positive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </span>
                        </div>
                        <div>
                            <p className="text-muted-foreground font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Orders Section */}
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 overflow-hidden">
                    <div className="p-8 border-b border-border/50 flex items-center justify-between">
                        <h2 className="font-display text-2xl font-bold">Recent Orders</h2>
                        <Button variant="ghost" className="rounded-xl text-primary font-bold">View All</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#F8F9FA] dark:bg-background border-b border-border/50">
                                <tr>
                                    <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Order ID</th>
                                    <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Customer</th>
                                    <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Total</th>
                                    <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {orders.length > 0 ? orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#F8F9FA] dark:hover:bg-background/20 transition-colors">
                                        <td className="px-8 py-6 font-bold text-foreground truncate max-w-[120px]">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm">{order.customerName}</span>
                                                <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 font-bold text-foreground">${order.total.toLocaleString()}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
                                                    <Search className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground">
                                            {loading ? "Loading orders..." : "No orders found."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-primary p-10 rounded-[2.5rem] text-white overflow-hidden relative shadow-2xl">
                    <div className="absolute inset-0 bg-grid opacity-10" />
                    <div className="relative z-10 flex flex-col h-full">
                        <h2 className="font-display text-4xl font-bold mb-6 italic">Premium Support</h2>
                        <p className="text-white/80 text-lg leading-relaxed mb-10">Need help managing your store? Our dedicated support team is here for you 24/7.</p>
                        <div className="mt-auto">
                            <Button className="w-full h-14 bg-white text-primary rounded-2xl font-bold text-lg hover:bg-white/90 border-none">Contact Support</Button>
                        </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
                </div>
            </div>
        </div>
    );
}
