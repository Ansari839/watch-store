"use client";

import { useState, useEffect } from "react";
import {
    Users as UsersIcon,
    Search,
    MoreHorizontal,
    Mail,
    Phone,
    ChevronLeft,
    ChevronRight,
    UserPlus,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/customers");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCustomers(data);
            }
        } catch (error) {
            toast.error("Failed to fetch customers");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch =
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === "All" ||
            (filter === "Premium" && customer.totalSpent > 1000) ||
            (filter === "Active" && customer.orderCount > 0) ||
            (filter === "New" && new Date(customer.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight text-stroke-sm">Customer Base</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage profiles and analyze shopping behavior.</p>
                </div>
                <Button className="rounded-2xl h-14 px-8 bg-primary font-bold shadow-lg shadow-primary/20 gap-2">
                    <UserPlus className="w-5 h-5" /> Add Customer
                </Button>
            </div>

            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-premium border border-border/50 overflow-hidden">
                <div className="p-8 border-b border-border/50 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-4 pl-11 pr-4 bg-muted/20 border-border/50 border rounded-2xl text-sm focus:ring-2 ring-primary/20 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {["All", "Active", "Premium", "New"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === f ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#F8F9FA] dark:bg-background border-b border-border/50">
                            <tr>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Profile</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Contact</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Total Orders</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider">Lifetime Spent</th>
                                <th className="px-8 py-5 font-bold text-xs text-muted-foreground uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            <p className="text-muted-foreground font-medium">Loading customers...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-muted/5 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-primary text-xl uppercase">
                                                {customer.name[0]}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground text-sm">{customer.name}</span>
                                                <span className="text-xs text-muted-foreground">ID: #{customer.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" /> {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Phone className="w-3 h-3" /> {customer.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${customer.totalSpent > 1000 ? "bg-amber-500/10 text-amber-500" :
                                                customer.role === "ADMIN" ? "bg-purple-500/10 text-purple-500" :
                                                    "bg-green-500/10 text-green-500"
                                            }`}>
                                            {customer.totalSpent > 1000 ? "Premium" : customer.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-sm tracking-tight">{customer.orderCount} Orders</td>
                                    <td className="px-8 py-6">
                                        <span className="font-bold text-primary text-base">${customer.totalSpent.toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <UsersIcon className="w-12 h-12 text-muted-foreground/20" />
                                            <p className="text-muted-foreground font-medium">No customers found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-border/50 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground font-medium">Total: {filteredCustomers.length} customers</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="rounded-xl"><ChevronLeft className="w-5 h-5" /></Button>
                        <Button variant="outline" size="icon" className="rounded-xl"><ChevronRight className="w-5 h-5" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
