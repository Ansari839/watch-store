"use client";

import { useState, useEffect } from "react";
import {
    ShoppingBag,
    Search,
    Filter,
    ChevronRight,
    MoreHorizontal,
    Download,
    Mail,
    Smartphone,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch (error) {
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
                toast.success(`Order updated to ${newStatus}`);
                fetchOrders();
            }
        } catch (error) {
            toast.error("Update failed");
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

    const filteredOrders = orders.filter(o => {
        const matchesFilter = filter === "All" || o.status === filter;
        const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-stroke-sm">Order Management</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Tracks and manage all customer purchases.</p>
                </div>
                <Button className="rounded-2xl h-14 px-8 bg-primary font-bold shadow-lg shadow-primary/20 gap-2">
                    <Download className="w-5 h-5" /> Export Orders
                </Button>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-premium border border-border/50 overflow-hidden">
                <div className="p-8 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-3.5 pl-11 pr-4 bg-muted/20 border-border/50 border rounded-2xl text-sm focus:ring-2 ring-primary/20 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === s ? "bg-primary text-white" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] dark:bg-background border-b border-border/50">
                            <tr>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Order Details</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Customer</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-8 py-7">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-base text-foreground">#{order.id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm">{order.customerName}</span>
                                            <span className="text-xs text-muted-foreground">{order.customerEmail}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7 font-bold text-primary">${order.total.toLocaleString()}</td>
                                    <td className="px-8 py-7">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border-2 border-transparent focus:border-primary/20 outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex justify-end gap-3 px-2">
                                            {/* WhatsApp Button */}
                                            <a
                                                href={`https://wa.me/${order.customerPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(
                                                    `Hello ${order.customerName}, this is an update regarding your Order #${order.id.slice(-8).toUpperCase()} from Watch Store.\n\nCurrent Status: *${order.status.toUpperCase()}*\n\nThank you for your patience!`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                title="WhatsApp Customer"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </a>

                                            {/* Email Button */}
                                            <a
                                                href={`mailto:${order.customerEmail}?subject=${encodeURIComponent(`Order Update: #${order.id.slice(-8).toUpperCase()} - ${order.status}`)}&body=${encodeURIComponent(
                                                    `Dear ${order.customerName},\n\nWe are writing to update you on your order #${order.id.slice(-8).toUpperCase()}.\n\nThe current status is: ${order.status.toUpperCase()}.\n\nThank you for choosing Watch Store!\n\nBest regards,\nThe Watch Store Team`
                                                )}`}
                                                className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                title="Email Customer"
                                            >
                                                <Mail className="w-5 h-5" />
                                            </a>

                                            {/* SMS Button */}
                                            <a
                                                href={`sms:${order.customerPhone}${typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent) ? '&' : '?'}body=${encodeURIComponent(
                                                    `Watch Store Order #${order.id.slice(-8).toUpperCase()} Update - Status: ${order.status.toUpperCase()}. Thank you!`
                                                )}`}
                                                className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                title="SMS Customer"
                                            >
                                                <Smartphone className="w-5 h-5" />
                                            </a>

                                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted/50 border border-border/50">
                                                <ChevronRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <ShoppingBag className="w-12 h-12 text-muted-foreground/20" />
                                            <p className="text-muted-foreground font-medium">No orders found in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
