"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    ArrowUpRight,
    MousePointer2,
    Clock,
    Loader2,
    ChevronDown
} from "lucide-react";
import { toast } from "sonner";

export default function AnalyticsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activePeriod, setActivePeriod] = useState("Week");

    useEffect(() => {
        fetchAnalytics();
    }, [activePeriod]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/admin/analytics?period=${activePeriod}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    }

    const analyticsStats = [
        { label: "Avg. Order Value", value: `$${data?.kpis.avgOrderValue || 0}`, change: "+12.5%", icon: DollarSign, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Total Revenue", value: `$${data?.kpis.totalRevenue.toLocaleString() || 0}`, change: "+18.2%", icon: ShoppingBag, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Delivered Items", value: data?.kpis.deliveredCount || 0, change: "All Time", icon: Clock, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Sales Growth", value: "24.5%", change: "+4.1%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    ];

    const salesData = data?.trendData || [];
    const categoryColors = ["bg-amber-500", "bg-rose-500", "bg-indigo-500", "bg-emerald-500", "bg-slate-400"];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-stroke-sm bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Store Intelligence</h1>
                    <p className="text-muted-foreground mt-2 text-lg font-medium">Data-driven insights for your luxury watch empire.</p>
                </div>
                <div className="flex bg-white dark:bg-card p-1.5 rounded-[1.25rem] border border-border/50 shadow-premium backdrop-blur-xl">
                    {["Day", "Week", "Month", "Year"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setActivePeriod(p)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activePeriod === p ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105" : "text-muted-foreground hover:bg-muted/50"}`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Insights Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-card p-10 rounded-[3rem] shadow-premium border border-border/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700" />

                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold tracking-tight">Revenue Trends</h3>
                            <p className="text-sm text-muted-foreground font-medium">Live performance for the selected {activePeriod.toLowerCase()}.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl text-xs font-bold text-primary border border-primary/10">
                            <TrendingUp className="w-4 h-4" /> Real-time Data
                        </div>
                    </div>

                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Calculating Metrics...</p>
                        </div>
                    ) : (
                        <div className="flex items-end justify-between h-64 gap-3 px-2 relative z-10">
                            {salesData.map((d: any, i: number) => {
                                const maxVal = Math.max(...salesData.map((x: any) => x.value), 1);
                                const heightPercentage = (d.value / maxVal) * 100;

                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                        <div className="w-full relative flex items-end justify-center h-full">
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${heightPercentage}%` }}
                                                transition={{ duration: 0.8, delay: i * 0.05, ease: "circOut" }}
                                                className="w-full max-w-[32px] bg-gradient-to-t from-primary/80 to-primary rounded-t-lg group-hover/bar:from-primary group-hover/bar:to-primary-light transition-all relative shadow-lg shadow-primary/10"
                                            >
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-2 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all duration-300 scale-75 group-hover/bar:scale-100 border border-border">
                                                    ${d.value.toLocaleString()}{activePeriod !== 'Day' ? 'k' : ''}
                                                </div>
                                            </motion.div>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter ${i % (activePeriod === 'Day' ? 4 : 1) === 0 ? 'text-muted-foreground' : 'opacity-0'}`}>
                                            {d.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Performance Card */}
                <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative shadow-2xl flex flex-col border border-white/5">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent)]" />
                    <div className="absolute inset-0 bg-grid opacity-10" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-8 border border-amber-500/20">
                            <TrendingUp className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Growth Milestone</h3>
                        <p className="text-white/60 text-sm font-medium mb-10">Quarterly objective tracking.</p>

                        <div className="space-y-10">
                            <div>
                                <div className="flex items-center justify-between text-4xl font-black mb-4 tracking-tighter">
                                    ${data?.kpis.totalRevenue.toLocaleString() || "0"}
                                    <div className="bg-emerald-500/20 p-2 rounded-xl">
                                        <ArrowUpRight className="w-6 h-6 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "78%" }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                                    />
                                </div>
                                <div className="flex justify-between mt-3">
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">78% achieved</span>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Target: $250k</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <p className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">Operational Status: Peak performance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {analyticsStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-card p-8 rounded-[2.5rem] border border-border/50 shadow-premium transition-transform hover:scale-[1.02] duration-300"
                    >
                        <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-6 border border-border/50`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground mb-2 flex items-center justify-between">
                            {stat.label}
                            <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black ${stat.change.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {stat.change}
                            </span>
                        </p>
                        <h4 className="text-3xl font-black tracking-tight">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            {/* Distribution Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-card p-10 rounded-[3rem] shadow-premium border border-border/50">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-bold tracking-tight">Category Share</h3>
                        <Button variant="outline" className="rounded-xl font-bold bg-muted/30 border-none px-6">Export</Button>
                    </div>
                    <div className="space-y-8">
                        {data?.categoryStats.map((item: any, idx: number) => (
                            <div key={item.name} className="group/cat">
                                <div className="flex justify-between mb-3 items-end">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${categoryColors[idx % categoryColors.length]}`} />
                                        <span className="font-bold text-base group-hover/cat:text-primary transition-colors">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-black text-muted-foreground">
                                        ${item.revenue.toLocaleString()} <span className="opacity-40 text-[10px] ml-1">({item.share}%)</span>
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden border border-border/50">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.share}%` }}
                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                        className={`h-full ${categoryColors[idx % categoryColors.length]} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-card p-10 rounded-[3rem] shadow-premium border border-border/50">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-2xl font-bold tracking-tight">Recent Activity Insights</h3>
                        <MousePointer2 className="w-6 h-6 text-primary/50" />
                    </div>
                    <div className="space-y-6">
                        {[
                            { title: "Peak Sales Period", desc: "Highest traffic recorded at 8:00 PM", status: "Active" },
                            { title: "Top Region", desc: "London, United Kingdom contributing 25% of sales", status: "Steady" },
                            { title: "Checkout Completion", desc: "72% conversion rate on mobile devices", status: "Increasing" }
                        ].map((insight, i) => (
                            <div key={i} className="flex gap-6 p-6 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                    <span className="text-primary font-black">0{i + 1}</span>
                                </div>
                                <div>
                                    <h5 className="font-bold text-base mb-1">{insight.title}</h5>
                                    <p className="text-sm text-muted-foreground font-medium">{insight.desc}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black uppercase text-emerald-500">{insight.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
