"use client";

import { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Box,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Bell,
    TrendingUp,
    Package,
    ArrowUpRight,
    MessageSquare, // Added MessageSquare
    Search,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin" },
        { icon: Box, label: "Products", href: "/admin/products" },
        { icon: ShoppingBag, label: "Orders", href: "/admin/orders" },
        { icon: Users, label: "Customers", href: "/admin/customers" },
        { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
        { icon: MessageSquare, label: "Support", href: "/admin/support" }, // Added Support link
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-background flex font-sans">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-card border-r border-border/50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col p-6">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Package className="w-6 h-6" />
                        </div>
                        <span className="font-display text-xl font-bold tracking-tight">Timecraft Admin</span>
                    </div>

                    <nav className="flex-1 space-y-1.5">
                        {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all group font-medium"
                            >
                                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-border/50">
                        <Button variant="ghost" className="w-full justify-start gap-3.5 px-4 py-3 rounded-2xl text-destructive hover:bg-destructive/5 hover:text-destructive transition-all font-medium">
                            <LogOut className="w-5 h-5 text-destructive" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : ''}`}>
                {/* Header */}
                <header className="h-20 bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden">
                            {isSidebarOpen ? <X /> : <Menu />}
                        </Button>
                        <div className="relative hidden md:block w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="w-full py-2.5 pl-11 pr-4 bg-[#F1F3F5] dark:bg-background border-none rounded-2xl text-sm focus:ring-2 ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="relative rounded-2xl hover:bg-[#F1F3F5]">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-white" />
                        </Button>
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </header>

                <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
