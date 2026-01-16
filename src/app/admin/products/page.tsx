"use client";

import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    MoreHorizontal,
    Box,
    ChevronDown,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const { settings } = useStore();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/products");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Failed to fetch products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                toast.success("Product deleted successfully");
                fetchProducts();
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Products Management</h1>
                    <p className="text-muted-foreground mt-2 text-lg">Manage your inventory, pricing, and product details.</p>
                </div>
                <Button asChild className="rounded-2xl h-12 px-6 bg-primary font-bold shadow-lg shadow-primary/20 gap-2">
                    <Link href="/admin/products/add">
                        <Plus className="w-5 h-5" />
                        Add New Product
                    </Link>
                </Button>
            </div>

            {/* Stats Cards for Products */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white dark:bg-card rounded-[2rem] shadow-soft border border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Box className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Total Products</h3>
                    </div>
                    <p className="text-3xl font-bold">{products.length}</p>
                </div>
                <div className="p-8 bg-white dark:bg-card rounded-[2rem] shadow-soft border border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                            <Star className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Featured</h3>
                    </div>
                    <p className="text-3xl font-bold">{products.filter(p => p.featured).length}</p>
                </div>
                <div className="p-8 bg-white dark:bg-card rounded-[2rem] shadow-soft border border-border/50">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                            <Box className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Active Stock</h3>
                    </div>
                    <p className="text-3xl font-bold">{products.filter(p => p.stock > 0).length}</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-card p-6 rounded-[2rem] border border-border/50 shadow-soft flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 bg-muted/20 border-border/50 border rounded-2xl text-sm focus:ring-2 ring-primary/20 transition-all outline-none"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="rounded-2xl h-12 px-6 border-border font-bold gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-card rounded-[2.5rem] shadow-soft border border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#F8F9FA] dark:bg-background border-b border-border/50">
                            <tr>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Product</th>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Category</th>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Price</th>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Stock</th>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Rating</th>
                                <th className="px-8 py-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
                                            Loading products...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-primary/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-muted p-1 flex items-center justify-center shrink-0">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{product.name}</h4>
                                                <p className="text-xs text-muted-foreground mt-0.5">#{product.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold border border-primary/10">
                                            {product.name.split(' ')[0]} {/* Placeholder for category name if not populated */}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 font-bold text-foreground">{settings.currencySymbol}{product.price.toLocaleString()}</td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-sm font-bold ${product.stock > 10 ? 'text-foreground' : 'text-accent'}`}>
                                                {product.stock} units
                                            </span>
                                            <div className="w-24 h-1 bg-muted rounded-full">
                                                <div
                                                    className={`h-full rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-accent'}`}
                                                    style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 font-bold text-sm">
                                            <Star className="w-4 h-4 fill-gold text-gold" />
                                            {product.rating}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Button asChild variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                <Link href={`/products/${product.id}`}>
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="ghost" size="icon" className="rounded-xl hover:bg-blue-500/10 hover:text-blue-500 transition-all">
                                                <Link href={`/admin/products/edit/${product.id}`}>
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => deleteProduct(product.id)}
                                                className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                                        No products found matching your search.
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
