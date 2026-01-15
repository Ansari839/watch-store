"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MessageSquare,
    Search,
    Filter,
    MoreVertical,
    Mail,
    User,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockQueries = [
    {
        id: "1",
        name: "James Wilson",
        email: "james.w@example.com",
        subject: "Order Inquiry",
        message: "When will the Royal Oak Offshore be back in stock?",
        status: "PENDING",
        date: "2023-11-20T10:30:00Z"
    },
    {
        id: "2",
        name: "Sarah Miller",
        email: "sarah.m@example.com",
        subject: "Product Question",
        message: "Does the Submariner come with a certified appraisal?",
        status: "RESOLVED",
        date: "2023-11-19T14:20:00Z"
    },
    {
        id: "3",
        name: "Robert Chen",
        email: "r.chen@example.com",
        subject: "Shipping & Delivery",
        message: "My order #UX12345 hasn't updated its tracking status in 3 days.",
        status: "PENDING",
        date: "2023-11-21T09:15:00Z"
    }
];

export default function AdminSupportPage() {
    const [queries, setQueries] = useState(mockQueries);
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Support Inquiries</h1>
                    <p className="text-muted-foreground mt-1">Manage and respond to collector queries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search inquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-muted rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary w-64"
                        />
                    </div>
                    <Button variant="outline" className="rounded-xl gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="grid gap-6">
                {queries.map((query, index) => (
                    <motion.div
                        key={query.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-card rounded-[2rem] border border-border/50 p-8 shadow-soft hover:shadow-lg transition-all"
                    >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                            <div className="flex gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-xl font-bold">{query.subject}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${query.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {query.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            {query.name}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {query.email}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(query.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <p className="text-foreground/80 leading-relaxed mt-4 p-4 bg-muted/30 rounded-2xl italic">
                                        "{query.message}"
                                    </p>
                                </div>
                            </div>
                            <div className="flex md:flex-col gap-2">
                                <Button className="rounded-xl px-6 h-12 shadow-lg shadow-primary/10">Respond</Button>
                                <Button variant="outline" className="rounded-xl px-6 h-12">Archive</Button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
